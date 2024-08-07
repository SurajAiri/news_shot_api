const newsService = require("../../services/news/news.services.js");

exports.getAllCategoriesController = async (req, res) => {
  console.log("getAllCategoriesController");
  try {
    const categories = await newsService.getAllCategories();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryByIdController = async (req, res) => {
  try {
    const category = await newsService.getCategoryById(req.params.id);
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createCategoryController = async (req, res) => {
  try {
    const category = await newsService.createCategory(req.body.name);
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateCategoryController = async (req, res) => {
  try {
    const category = await newsService.updateCategory(
      req.params.id,
      req.body.name
    );
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteCategoryController = async (req, res) => {
  try {
    await newsService.deleteCategory(req.params.id);
    res.sendResponse(204, "Category deleted successfully");
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
