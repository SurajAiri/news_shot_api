// get all websites, get website by id, create website, update website, delete website
// add category, update category
// create category, delete category (websiteId required)

const {
  WebsiteModel,
  WebsiteCategoryModel,
} = require("../models/website.model");

// website apis
async function handleCreateWebsite(req, res) {
  try {
    const body = req.body;

    // Validate website data (example validation)
    if (!body.name || !body.url) {
      return res.sendResponse(400, "Invalid website data");
    }

    // preprocess website url
    body.url = body.url.trim().toLowerCase();

    // Check if website already exists
    // todo: index url field in the database
    const existingWebsite = await WebsiteModel.findOne({ url: body.url });
    if (existingWebsite) {
      return res.sendResponse(400, "Website already exists");
    }

    // Add website categories if they exist
    const catIds = [];
    const categories = body.categories || [];
    for (const category of categories) {
      if (!category.name || !category.url) {
        return res.sendResponse(400, "Invalid category data");
      }
      category.url = category.url.trim().toLowerCase();
      const existingCategory = await WebsiteCategoryModel.findOne({
        url: category.url,
      });
      if (!existingCategory) {
        // If category does not exist, create it
        let t = await WebsiteCategoryModel.create(category);
        catIds.push(t._id);
      } else {
        catIds.push(existingCategory._id);
      }
    }

    // Create website

    const newWebsite = new WebsiteModel({
      name: body.name,
      url: body.url,
      categories: catIds,
    });

    await newWebsite.save().then((data) => res.sendResponse(201, newWebsite));
  } catch (error) {
    console.error("Error creating website:", error);
    return res.sendResponse(500, "Server error");
  }
}

const handleGetAllWebsite = async (req, res) => {
  console.log("Get all websites");
  const { limit = 10, page = 1 } = req.query;
  try {
    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);

    // Get total number of entries for pagination
    const totalEntries = await WebsiteModel.countDocuments();

    // Retrieve the paginated websites
    const websites = await WebsiteModel.find()
      .populate("categories", "name url")
      .limit(limitNum)
      .skip(limitNum * (pageNum - 1))
      .exec();

    // Construct metadata
    const meta = {
      totalEntries: totalEntries,
      totalPages: Math.ceil(totalEntries / limitNum),
      currentPage: pageNum,
      perPage: limitNum,
    };

    // Send response with metadata
    return res.sendResponse(
      200,
      websites,
      "Successfully retrieved websites",
      meta
    );
  } catch (error) {
    console.error("Error getting websites:", error);
    return res.sendResponse(500, "Server error");
  }
};

async function handleGetWebsiteById(req, res) {
  const websiteId = req.params.websiteId;
  if (!websiteId) {
    return res.sendResponse(400, "Website ID is required");
  }
  await WebsiteModel.findById(websiteId)
    .populate("categories", "name url")
    .then((website) => {
      if (!website) {
        return res.sendResponse(404, "Website not found");
      }
      return res.sendResponse(200, website);
    })
    .catch((error) => {
      console.error("Error getting website by ID:", error);
      return res.sendResponse(500, error.message);
    });
}

async function handleUpdateWebsite(req, res) {
  const websiteId = req.params.websiteId;
  if (!websiteId) {
    return res.sendResponse(400, "Website ID is required");
  }

  const body = req.body;

  // preprocess website url
  if (body.url) body.url = body.url.trim().toLowerCase();

  // update website
  await WebsiteModel.findByIdAndUpdate(websiteId, body, { new: true })
    .then((updatedWebsite) => {
      if (!updatedWebsite) {
        return res.sendResponse(404, "Website not found");
      }
      return res.sendResponse(200, updatedWebsite);
    })
    .catch((error) => {
      console.error("Update Website: ", error);
      return res.sendResponse(500, error.message);
    });
}

async function handleDeleteWebsite(req, res) {
  const websiteId = req.params.websiteId;
  if (!websiteId) {
    return res.sendResponse(400, "Website ID is required");
  }

  // delete website
  await WebsiteModel.findByIdAndDelete(websiteId)
    .then((deletedWebsite) => {
      if (!deletedWebsite) {
        return res.sendResponse(404, "Website not found");
      }
      return res.sendResponse(200, { message: "Website deleted" });
    })
    .catch((error) => {
      console.error("Delete Website: ", error);
      return res.sendResponse(500, error.message);
    });
}

// website category apis
async function handleGetAllWebsiteCategories(req, res) {
  try {
    const categories = await WebsiteCategoryModel.find();
    return res.sendResponse(200, categories);
  } catch (error) {
    console.error("Error getting website categories:", error);
    return res.sendResponse(500, "Server error");
  }
}

async function handleGetWebsiteCategoryById(req, res) {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return res.sendResponse(400, "Category ID is required");
  }
  // console.log("catId", categoryId);
  await WebsiteCategoryModel.findById(categoryId)
    .then((category) => {
      if (!category) {
        return res.sendResponse(404, "Category not found");
      }
      return res.sendResponse(200, category);
    })
    .catch((error) => {
      console.error("Error getting category by ID:", error);
      return res.sendResponse(500, error.message);
    });
}

async function handleUpdateWebsiteCategory(req, res) {
  const categoryId = req.params.categoryId;
  if (!categoryId) {
    return res.sendResponse(400, "Category ID is required");
  }
  await WebsiteCategoryModel.findByIdAndUpdate(categoryId, req.body, {
    new: true,
  })
    .then((updatedCategory) => {
      if (!updatedCategory) {
        return res.sendResponse(404, "Category not found");
      }
      return res.sendResponse(200, updatedCategory);
    })
    .catch((error) => {
      console.error("Update Category: ", error);
      return res.sendResponse(500, error.message);
    });
}

async function handleRemoveAndDeleteWebsiteCategory(req, res) {
  if (req.user?.role !== "admin") return res.sendResponse(403, "Unauthorized");

  const { websiteId, categoryId } = req.params;
  if (!websiteId || !categoryId) {
    return res.sendResponse(400, "Website ID and Category ID are required");
  }

  let web = await WebsiteModel.findById(websiteId);
  if (!web) return res.sendResponse(404, "Website not found");
  if (!web.categories.includes(categoryId))
    return res.sendResponse(404, "Category not found in website");

  // Remove category from website
  web.categories.remove(categoryId);
  await web.save().catch((error) => {
    console.error("Error removing category from website:", error);
    return res.sendResponse(500, "Server error");
  });

  // Delete category
  await WebsiteCategoryModel.findByIdAndDelete(categoryId)
    .then((deletedCategory) => {
      if (!deletedCategory) {
        return res.sendResponse(404, "Category not found");
      }
      return res.sendResponse(200, { message: "Category deleted" });
    })
    .catch((error) => {
      console.error("Delete Category: ", error);
      return res.sendResponse(500, error.message);
    });
}

async function handleAddAndCreateWebsiteCategory(req, res) {
  const { websiteId } = req.params;
  const body = req.body;

  if (!body.name || !body.url)
    return res.sendResponse(400, "Invalid category data");
  if (!websiteId)
    return res.sendResponse(400, "Website ID and Category ID are required");

  if (body.url) body.url = body.url.trim().toLowerCase();

  let web = await WebsiteModel.findById(websiteId);
  if (!web) return res.sendResponse(404, "Website not found");

  // create category
  try {
    WebsiteCategoryModel.create(body).then((cat) => {
      web.categories.push(cat._id);
      web.save();
    });
    return res.sendResponse(201, "Category created");
  } catch (err) {
    console.log(err);
    return res.sendResponse(500, "Server error");
  }
}

module.exports = {
  handleCreateWebsite,
  handleGetAllWebsite,
  handleGetWebsiteById,
  handleUpdateWebsite,
  handleDeleteWebsite,

  // website categories
  handleGetAllWebsiteCategories,
  handleGetWebsiteCategoryById,
  handleUpdateWebsiteCategory,
  handleRemoveAndDeleteWebsiteCategory,
  handleAddAndCreateWebsiteCategory,
};
