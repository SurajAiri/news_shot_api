express = require("express");
const router = express.Router();
const newsController = require("../controllers/news/news.controller");

// category: get all categories, get specific category, create category, update category, delete category
router
  .route("/category")
  .get(newsController.getAllCategories)
  .post(newsController.createCategory);

router
  .route("/category/:id")
  .get(newsController.getCategoryById)
  .patch(newsController.updateCategory)
  .delete(newsController.deleteCategory);

// // media: get all media, get specific media, create media, update media, delete media
router
  .route("/media")
  .get(newsController.getAllMedia)
  .post(newsController.createNewsMedia);

router
  .route("/media/:id")
  .get(newsController.getMediaById)
  .patch(newsController.updateMedia)
  .delete(newsController.deleteMedia);

router
  .route("/")
  .post(newsController.createNewsController)
  .get(newsController.getAllNewsController);

router
  .route("/:id")
  .delete(newsController.deleteNewsController)
  .patch(newsController.updateNewsController)
  .get(newsController.getNewsByIdController);

module.exports = router;
