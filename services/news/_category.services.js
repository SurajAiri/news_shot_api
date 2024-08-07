// category apis -> get all categories, get specific category, create category, update category, delete category

const { newsCategoryModel } = require("../../models/news.model");
const { MAX_CATEGORY_NAME_LENGTH } = require("../../utils/constant");

exports.getAllCategories = async () => {
  console.log("service call getAllCategories");
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
