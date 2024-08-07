const {
  createNews,
  deleteNews,
  updateNews,
  getAllNews,
  getNewsById,
} = require("../../services/news/news.services");
const categoryController = require("./_category.controller");
const mediaController = require("./_media.controller");

// News Controllers
exports.createNewsController = async (req, res) => {
  try {
    const news = await createNews(req.body);
    res.sendResponse(201, news);
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.deleteNewsController = async (req, res) => {
  try {
    const news = await deleteNews(req.params.id);
    if (!news) {
      res.sendResponse(404, "News not found");
    } else {
      res.sendResponse(200, news, "News deleted successfully");
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.getAllNewsController = async (req, res) => {
  try {
    const news = await getAllNews(req.query);
    if (!news || news.length === 0) {
      res.sendResponse(404, "No news found");
    } else {
      res.sendResponse(200, news);
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.getNewsByIdController = async (req, res) => {
  try {
    const news = await getNewsById(req.params.id);
    if (!news) {
      res.sendResponse(404, "News not found");
    } else {
      res.sendResponse(200, news);
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.updateNewsController = async (req, res) => {
  try {
    const news = await updateNews(req.params.id, req.body);
    if (!news) {
      res.sendResponse(404, "News not found");
    } else {
      res.sendResponse(200, news);
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

// Category Controllers
exports.getAllCategories = categoryController.getAllCategoriesController;
exports.getCategoryById = categoryController.getCategoryByIdController;
exports.createCategory = categoryController.createCategoryController;
exports.updateCategory = categoryController.updateCategoryController;
exports.deleteCategory = categoryController.deleteCategoryController;

// Media Controllers
exports.createNewsMedia = mediaController.createMediaController;
exports.getAllMedia = mediaController.getAllMediaController;
exports.getMediaById = mediaController.getMediaByIdController;
exports.updateMedia = mediaController.updateMediaController;
exports.deleteMedia = mediaController.deleteMediaController;
