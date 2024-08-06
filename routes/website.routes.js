const {
  handleGetWebsiteCategoryById,
  handleGetAllWebsiteCategories,
  handleUpdateWebsiteCategory,
  handleRemoveAndDeleteWebsiteCategory,
  handleGetAllWebsite,
  handleCreateWebsite,
  handleGetWebsiteById,
  handleUpdateWebsite,
  handleDeleteWebsite,
  handleAddAndCreateWebsiteCategory,
} = require("../controllers/website.controller");
const { restrictUserPermission } = require("../middlewares/auth.middlewares");

express = require("express");
router = express.Router();

// // get all websites, get website by id, create website, update website, delete website -> done
// // add category, update category, delete category

// get all, create
router.route("/category").get(handleGetAllWebsiteCategories);
router.post("/category/:websiteId", handleAddAndCreateWebsiteCategory);

router.delete(
  "/category/:websiteId/:categoryId",
  handleRemoveAndDeleteWebsiteCategory
);

router
  .route("/category/:categoryId")
  .get(handleGetWebsiteCategoryById)
  .patch(handleUpdateWebsiteCategory);

router
  .route("/")
  .get(handleGetAllWebsite)
  .post(
    restrictUserPermission(["admin", "summarizer", "verifier"]),
    handleCreateWebsite
  );

router
  .route(
    "/:websiteId",
    restrictUserPermission(["admin", "summarizer", "verifier"])
  )
  .get(handleGetWebsiteById)
  .patch(handleUpdateWebsite)
  .delete(restrictUserPermission(["admin"]), handleDeleteWebsite);

module.exports = router;
