const { newsMediaModel } = require("../../models/news.model");

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
