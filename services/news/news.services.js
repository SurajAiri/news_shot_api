const { default: mongoose } = require("mongoose");
const {
  newsSummaryModel,
  newsReferenceModel,
  newsModel,
} = require("../../models/news.model");
const {
  API_RESPONSE_PAGE,
  API_RESPONSE_LIMIT,
} = require("../../utils/constant");

const categoryServices = require("./_category.services");
const mediaServices = require("./_media.services");

// news apis -> create news, update news, get all news, get specific news, verify news, publish news
// exports.createNews = async (newsData) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { summary, reference, ...newsFields } = newsData;

//     // Ensure summary and reference are arrays
//     if (!Array.isArray(summary) || summary.length === 0) {
//       throw new Error("Summary must be a non-empty array.");
//     }
//     if (!Array.isArray(reference) || reference.length === 0) {
//       throw new Error("Reference must be a non-empty array.");
//     }

//     // Create summary
//     const createdSummaries = await newsSummaryModel.create(summary, {
//       session,
//     });

//     // Create reference
//     const createdReferences = await newsReferenceModel.create(reference, {
//       session,
//     });

//     // Add summary and reference ObjectIds to news
//     newsFields.summary = createdSummaries.map((item) => item._id);
//     newsFields.reference = createdReferences.map((item) => item._id);

//     // Create news
//     const news = await newsModel.create([newsFields], { session });

//     await session.commitTransaction();
//     session.endSession();

//     return news[0];
//   } catch (error) {
//     await session.abortTransaction();
//     session.endSession();
//     throw new Error(`Failed to create news: ${error.message}`);
//   }
// };

exports.createNews = async (newsData) => {
  let createdSummaries = [];
  let createdReferences = [];

  try {
    const { summary, reference, ...newsFields } = newsData;

    // Ensure summary and reference are arrays
    if (!Array.isArray(summary) || summary.length === 0) {
      throw new Error("Summary must be a non-empty array.");
    }
    if (!Array.isArray(reference) || reference.length === 0) {
      throw new Error("Reference must be a non-empty array.");
    }

    // Create summary
    // createdSummaries = await newsSummaryModel.create(summary);
    createdSummaries = await newsSummaryModel.insertMany(summary);

    // Create reference
    createdReferences = await newsReferenceModel.insertMany(reference);

    // Add summary and reference ObjectIds to news
    newsFields.summary = createdSummaries.map((item) => item._id);
    newsFields.reference = createdReferences.map((item) => item._id);

    // Create news
    const news = await newsModel.create(newsFields);

    return news[0];
  } catch (error) {
    // If an error occurs, handle it
    console.error(`Failed to create news: ${error.message}`);

    // Optional: Cleanup any partial data
    if (createdSummaries.length > 0) {
      await newsSummaryModel.deleteMany({
        _id: { $in: createdSummaries.map((item) => item._id) },
      });
    }
    if (createdReferences.length > 0) {
      await newsReferenceModel.deleteMany({
        _id: { $in: createdReferences.map((item) => item._id) },
      });
    }

    throw new Error(`Failed to create news: ${error.message}`);
  }
};

exports.deleteNews = async (newsId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const news = await newsModel.findById(newsId).exec();
    if (!news) {
      throw new Error("News not found");
    }

    // Delete associated summary and reference
    await newsSummaryModel.deleteMany(
      { _id: { $in: news.summary } },
      { session }
    );
    await newsReferenceModel.findByIdAndDelete(news.reference, { session });

    // Delete news
    await newsModel.findByIdAndDelete(newsId, { session });

    await session.commitTransaction();
    session.endSession();

    return news;
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    throw new Error(`Failed to delete news: ${error.message}`);
  }
};

exports.getAllNews = async (query) => {
  const {
    category = null,
    // tag = null,
    page = API_RESPONSE_PAGE,
    limit = API_RESPONSE_LIMIT,
  } = query;

  // Initialize the query object
  let newsQuery = {};

  // If a category is provided, filter by category
  if (category) {
    if (!category) newsQuery.category = category;
    // if (!tag) newsQuery.tags = { $in: tag };
    // if (tag) {
    //   const tagsArray = tag.map((t) => t.toLowerCase()); // Ensure tags are lowercase
    //   newsQuery.tags = { $in: tagsArray }; // Match any document where at least one tag matches any string in the array
    // }
  }

  return await newsModel
    .find(newsQuery)
    .populate("summary", "title language")
    .populate({
      path: "media.options",
      select: "url type",
    })
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
};

exports.getNewsById = async (newsId) => {
  return await newsModel
    .findById(newsId)
    .populate("summary", "title summary language")
    .populate({
      path: "media.options",
      select: "url type thumbnailUrl",
    })
    .populate("category", "name")
    .populate("reference", "url source author publishDate")
    .exec();
};

exports.updateNews = async (newsId, news) => {
  return await newsModel.findByIdAndUpdate(newsId, news, { new: true }).exec();
};

exports.updateMedia = async (mediaId, media) => {
  return await newsMediaModel
    .findByIdAndUpdate(mediaId, media, { new: true })
    .exec();
};

// action apis -> get all actions, get specific action
// todo: implement later (skip for now)

exports.updateSummary = async (summaryId, summary) => {
  return await newsSummaryModel
    .findByIdAndUpdate(summaryId, summary, { new: true })
    .exec();
};

exports.updateReference = async (referenceId, reference) => {
  return await newsReferenceModel.findByIdAndUpdate(referenceId, reference, {
    new: true,
  });
};

// category: get all categories, get specific category, create category, update category, delete category
exports.getAllCategories = categoryServices.getAllCategories;
exports.getCategoryById = categoryServices.getCategoryById;
exports.updateCategory = categoryServices.updateCategory;
exports.deleteCategory = categoryServices.deleteCategory;
exports.createCategory = categoryServices.createCategory;

// media: get all media, get specific media, create media, update media, delete media
exports.createNewsMedia = mediaServices.createNewsMedia;
exports.getAllMedia = mediaServices.getAllMedia;
exports.getMediaById = mediaServices.getMediaById;
exports.updateMedia = mediaServices.updateMedia;
exports.deleteMedia = mediaServices.deleteMedia;
