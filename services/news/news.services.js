const {
  newsSummaryModel,
  newsReferenceModel,
  newsModel,
} = require("../../models/news.model");

// news apis -> create news, update news, get all news, get specific news, verify news, publish news
exports.createNews = async (newsData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { summary, reference, ...newsFields } = newsData;

    // Create summary
    const createdSummary = await newsSummaryModel.create([summary], {
      session,
    });

    // Create reference
    const createdReference = await newsReferenceModel.create([reference], {
      session,
    });

    // Add summary and reference ObjectIds to news
    newsFields.summary = createdSummary.map((item) => item._id);
    newsFields.reference = createdReference[0]._id;

    // Create news
    const news = await newsModel.create([newsFields], { session });

    await session.commitTransaction();
    session.endSession();

    return news[0];
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
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

// action apis -> get all actions, get specific action
// todo: implement later (skip for now)

// summary apis -> get all summaries, get specific summary, create summary, update summary, delete summary

// exports.createSummary = async (summary) => {
//   return await newsSummaryModel.create(summary);
// };

exports.updateSummary = async (summaryId, summary) => {
  return await newsSummaryModel
    .findByIdAndUpdate(summaryId, summary, { new: true })
    .exec();
};

// exports.deleteSummary = async (summaryId) => {
//   return await newsSummaryModel.findByIdAndDelete(summaryId).exec();
// };

// reference: create and add to news, delete and remove from news, update reference
// exports.createReference = async (reference) => {
//   return await newsReferenceModel.create(reference);
// };

// exports.deleteReference = async (referenceId) => {
//   return await newsReferenceModel.findByIdAndDelete(referenceId).exec();
// };

exports.updateReference = async (referenceId, reference) => {
  return await newsReferenceModel.findByIdAndUpdate(referenceId, reference, {
    new: true,
  });
};
