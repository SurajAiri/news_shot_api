const newsService = require("../../services/news/news.services.js");

exports.createMediaController = async (req, res) => {
  try {
    const media = await newsService.createNewsMedia(req.body);
    res.status(201).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllMediaController = async (req, res) => {
  try {
    const media = await newsService.getAllMedia(req.query);
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMediaByIdController = async (req, res) => {
  try {
    const media = await newsService.getMediaById(req.params.id);
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateMediaController = async (req, res) => {
  try {
    const media = await newsService.updateMedia(req.params.id, req.body);
    res.status(200).json(media);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteMediaController = async (req, res) => {
  try {
    await newsService.deleteMedia(req.params.id);
    res.status(204).send({ message: "Media deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
