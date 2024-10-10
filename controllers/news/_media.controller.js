const { newsMediaModel } = require("../../models/news.model.js");
const newsService = require("../../services/news/news.services.js");
const {
  API_RESPONSE_PAGE,
  API_RESPONSE_LIMIT,
} = require("../../utils/constant.js");

exports.createMediaController = async (req, res) => {
  try {
    if (!req.user.id) {
      return res.sendResponse(403, "Permission denied");
    }
    const media = await newsService.createNewsMedia({
      uploadedBy: req.user.id,
      ...req.body,
    });
    res.sendResponse(201, media);
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.getAllMediaController = async (req, res) => {
  try {
    const {
      tag = null,
      page = API_RESPONSE_PAGE,
      limit = API_RESPONSE_LIMIT,
    } = req.query;
    const media = await newsService.getAllMedia(req.query);
    if (!media || media.length === 0) {
      res.sendResponse(404, "No media found");
    } else {
      let totalMedia = await newsMediaModel.countDocuments();
      console.log(totalMedia);
      res.sendResponse(200, media, "Success", {
        page,
        limit,
        totalMedia,
        totalPages: Math.ceil(totalMedia / limit),
        tag,
      });
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.getMediaByIdController = async (req, res) => {
  try {
    const media = await newsService.getMediaById(req.params.id);
    if (!media) {
      res.sendResponse(404, "Media not found");
    } else {
      res.sendResponse(200, media);
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.updateMediaController = async (req, res) => {
  try {
    const media = await newsService.updateMedia(req.params.id, req.body);
    if (!media) {
      res.sendResponse(404, "Media not found");
    } else {
      res.sendResponse(200, media);
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.deleteMediaController = async (req, res) => {
  try {
    const result = await newsService.deleteMedia(req.params.id);
    if (!result) {
      res.sendResponse(404, "Media not found");
    } else {
      res.sendResponse(200, "Media deleted successfully");
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};
