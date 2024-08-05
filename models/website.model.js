// {
//   "name":"",
// "url":"",
// "categories":[] // news category
// }

const { default: mongoose } = require("mongoose");

// // news category
// {
//   "name":"",
//   "url":""
// }

const websiteCategorySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const websiteSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  logoUrl: {
    type: String,
  },
  url: {
    type: String,
    required: true,
  },
  // categories id array
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Website_Category",
    },
  ],
});

WebsiteModel = mongoose.model("Website", websiteSchema);
WebsiteCategoryModel = mongoose.model(
  "Website_Category",
  websiteCategorySchema
);

module.exports = {
  WebsiteModel,
  WebsiteCategoryModel,
};
