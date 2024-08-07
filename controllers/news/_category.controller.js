const newsService = require("../../services/news/news.services.js");

exports.getAllCategoriesController = async (req, res) => {
  console.log("getAllCategoriesController");
  try {
    const categories = await newsService.getAllCategories();
    if (!categories || categories.length === 0) {
      res.sendResponse(404, "No categories found");
    } else {
      res.sendResponse(200, categories);
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.getCategoryByIdController = async (req, res) => {
  try {
    const category = await newsService.getCategoryById(req.params.id);
    if (!category) {
      res.sendResponse(404, "Category not found");
    } else {
      res.sendResponse(200, category);
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.createCategoryController = async (req, res) => {
  try {
    const category = await newsService.createCategory(req.body.name);
    res.sendResponse(201, category);
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.updateCategoryController = async (req, res) => {
  try {
    const category = await newsService.updateCategory(
      req.params.id,
      req.body.name
    );
    if (!category) {
      res.sendResponse(404, "Category not found");
    } else {
      res.sendResponse(200, category);
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};

exports.deleteCategoryController = async (req, res) => {
  try {
    const result = await newsService.deleteCategory(req.params.id);
    if (!result) {
      res.sendResponse(404, "Category not found");
    } else {
      res.sendResponse(200, "Category deleted successfully");
    }
  } catch (error) {
    res.sendResponse(500, error.message);
  }
};
