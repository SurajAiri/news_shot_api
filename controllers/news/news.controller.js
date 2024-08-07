const {
  createNews,
  deleteNews,
  updateNews,
} = require("../../services/news/news.services");
const categoryController = require("./_category.controller");
const mediaController = require("./_media.controller");

// News Controllers
exports.createNewsController = async (req, res) => {
  try {
    const news = await createNews(req.body);
    res.status(201).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteNewsController = async (req, res) => {
  try {
    const news = await deleteNews(req.params.id);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllNewsController = async (req, res) => {
  try {
    const news = await getAllNews(req.query);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getNewsByIdController = async (req, res) => {
  try {
    const news = await getNewsById(req.params.id);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateNewsController = async (req, res) => {
  try {
    const news = await updateNews(req.params.id, req.body);
    res.status(200).json(news);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// category: get all categories, get specific category, create category, update category, delete category
exports.getAllCategories = categoryController.getAllCategoriesController;
exports.getCategoryById = categoryController.getCategoryByIdController;
exports.createCategory = categoryController.createCategoryController;
exports.updateCategory = categoryController.updateCategoryController;
exports.deleteCategory = categoryController.deleteCategoryController;

// media: get all media, get specific media, create media, update media, delete media
exports.createNewsMedia = mediaController.createMediaController;
exports.getAllMedia = mediaController.getAllMediaController;
exports.getMediaById = mediaController.getMediaByIdController;
exports.updateMedia = mediaController.updateMediaController;
exports.deleteMedia = mediaController.deleteMediaController;
