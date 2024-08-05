const {
  handleWebsiteCreate,
  handleWebsiteGetAll,
  handleWebsiteGetById,
  handleWebsiteUpdate,
  handleWebsiteDelete,
  handleGetAllCategoriesOfWebsite,
  handleGetWebsiteCategoryById,
  handleGetAllWebsiteCategories,
  handleCreateWebsiteCategory,
  handleUpdateWebsiteCategory,
  handleDeleteWebsiteCategory,
  handleRemoveAndDeleteWebsiteCategory,
} = require("../controllers/website.controller");
const { restrictUserPermission } = require("../middlewares/auth.middlewares");

express = require("express");
router = express.Router();

// // get all websites, get website by id, create website, update website, delete website -> done
// // add category, update category, delete category

// get all, create
router
  .route("/category")
  .get(handleGetAllWebsiteCategories)
  .post(handleCreateWebsiteCategory);

router.delete(
  "/category/:websiteId/:categoryId",
  handleRemoveAndDeleteWebsiteCategory
);

router.get("/category/w/:websiteId", handleGetAllCategoriesOfWebsite);
router
  .route("/category/:categoryId")
  .get(handleGetWebsiteCategoryById)
  .patch(handleUpdateWebsiteCategory);
// .delete(handleDeleteWebsiteCategory);

router
  .route("/")
  .get(handleWebsiteGetAll)
  .post(
    restrictUserPermission(["admin", "summarizer", "verifier"]),
    handleWebsiteCreate
  );

router
  .route(
    "/:websiteId",
    restrictUserPermission(["admin", "summarizer", "verifier"])
  )
  .get(handleWebsiteGetById)
  .patch(handleWebsiteUpdate);

router.delete(
  "/:websiteId",
  restrictUserPermission(["admin"]),
  handleWebsiteDelete
);

module.exports = router;
