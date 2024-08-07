const {
  newsMediaModel,
  newsSummaryModel,
  newsCategoryModel,
} = require("../models/news.model");

// news apis -> create news, update news, get all news, get specific news, verify news, publish news

// media apis -> get all media, get specific media, create media, update media, delete media
exports.createNewsMedia = async (media) => {
  return await newsMediaModel.create(media);
};

exports.getAllMedia = async (query) => {
  const {
    tag = null,
    page = API_RESPONSE_PAGE,
    limit = API_RESPONSE_LIMIT,
  } = query;

  // Initialize the query object
  let mediaQuery = {};

  // If a tag is provided, filter by tags
  if (tag) {
    tag = tag.toLowerCase();
    const tagsArray = tag.split(","); // Convert comma-separated tags into an array
    mediaQuery.tags = { $in: tagsArray }; // Filter documents where tags array contains any of the provided tags
  }

  return await newsMediaModel
    .find(mediaQuery)
    .skip((page - 1) * limit)
    .limit(limit)
    .exec();
};

exports.getMediaById = async (mediaId) => {
  return await newsMediaModel.findById(mediaId).exec();
};

exports.updateMedia = async (mediaId, media) => {
  return await newsMediaModel
    .findByIdAndUpdate(mediaId, media, { new: true })
    .exec();
};

exports.deleteMedia = async (mediaId) => {
  return await newsMediaModel.findByIdAndDelete(mediaId).exec();
};

// category apis -> get all categories, get specific category, create category, update category, delete category

exports.getAllCategories = async () => {
  return await newsCategoryModel.find().exec();
};

exports.getCategoryById = async (categoryId) => {
  return await newsCategoryModel.findById(categoryId).exec();
};

exports.createCategory = async (categoryName) => {
  // Validate category name
  if (typeof categoryName !== "string" || categoryName.trim() === "") {
    throw new Error("Category name must be a non-empty string.");
  }

  if (categoryName.length > MAX_CATEGORY_NAME_LENGTH) {
    throw new Error(
      `Category name cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters.`
    );
  }
  return await newsCategoryModel.create({ name: categoryName.trim() });
};

exports.updateCategory = async (categoryId, categoryName) => {
  // Validate category name
  if (typeof categoryName !== "string" || categoryName.trim() === "") {
    throw new Error("Category name must be a non-empty string.");
  }

  if (categoryName.length > MAX_CATEGORY_NAME_LENGTH) {
    throw new Error(
      `Category name cannot exceed ${MAX_CATEGORY_NAME_LENGTH} characters.`
    );
  }
  return await newsCategoryModel
    .findByIdAndUpdate(categoryId, { name: categoryName.trim() }, { new: true })
    .exec();
};

exports.deleteCategory = async (categoryId) => {
  return await newsCategoryModel.findByIdAndDelete(categoryId).exec();
};

// action apis -> get all actions, get specific action
// todo: implement later (skip for now)

// summary apis -> get all summaries, get specific summary, create summary, update summary, delete summary

exports.createSummary = async (summary) => {
  return await newsSummaryModel.create(summary);
};

exports.updateSummary = async (summaryId, summary) => {
  return await newsSummaryModel
    .findByIdAndUpdate(summaryId, summary, { new: true })
    .exec();
};

exports.deleteSummary = async (summaryId) => {
  return await newsSummaryModel.findByIdAndDelete(summaryId).exec();
};

// reference: create and add to news, delete and remove from news, update reference
exports.createReference = async (reference) => {
  return await newsReferenceModel.create(reference);
};

exports.deleteReference = async (referenceId) => {
  return await newsReferenceModel.findByIdAndDelete(referenceId).exec();
};

exports.updateReference = async (referenceId, reference) => {
  return await newsReferenceModel.findByIdAndUpdate(referenceId, reference, {
    new: true,
  });
};

// news apis -> create news, update news, get all news, get specific news, verify news, publish news
