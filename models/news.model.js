const { default: mongoose } = require("mongoose");

const supportedLanguages = ["en"];
const supportedActions = ["create", "update", "summary", "verify", "publish"];
const newsLevels = ["general", "trendy", "major"];

// index on language
const newSummarySchema = new mongoose.Schema({
  title: { type: String, required: true },
  language: {
    type: String,
    enum: supportedLanguages,
    default: "en",
    index: true,
  },
  summary: { type: String, required: true },
});

const newsMediaSchema = new mongoose.Schema(
  {
    url: { type: String, required: true }, // URL of the media (image/video)
    type: { type: String, required: true, enum: ["image", "video"] }, // Type of media
    thumbnailUrl: { type: String }, // Optional thumbnail URL
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the admin who uploaded/selected the media
    tags: [{ type: String, index: true }], // Array of tags for search and categorization
  },
  { timestamps: true }
);

const newsCategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
});

const newsReferenceSchema = new mongoose.Schema({
  url: { type: String, required: true }, // article url
  source: { type: String, required: true }, // website url
  author: { type: String, required: true },
  publishDate: { type: Date, required: true },
  language: {
    type: String,
    enum: supportedLanguages,
    default: "en",
    index: true,
  },
});

const newsActionSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: supportedActions,
  },
  person: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const newsMediaModel = mongoose.model("News_Media", newsMediaSchema);
const newsSummaryModel = mongoose.model("News_Summary", newSummarySchema);
const newsCategoryModel = mongoose.model("News_Category", newsCategorySchema);
const newsActionModel = mongoose.model("News_Action", newsActionSchema);
const newsReferenceModel = mongoose.model(
  "News_Reference",
  newsReferenceSchema
);

const newsSchema = new mongoose.Schema(
  {
    tags: [{ type: String, index: true }],
    summary: [{ type: mongoose.Schema.Types.ObjectId, ref: "News_Summary" }],
    media: {
      options: [{ type: mongoose.Schema.Types.ObjectId, ref: "News_Media" }],
      selectedIndex: { type: Number, default: -1 },
    },
    newsLevel: { type: String, enum: newsLevels },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "News_Category" },
    reference: { type: mongoose.Schema.Types.ObjectId, ref: "News_Reference" },
    actions: [{ type: mongoose.Schema.Types.ObjectId, ref: "News_Action" }],
  },
  { timestamps: true }
);

const newsModel = mongoose.model("News", newsSchema);

module.exports = {
  newsModel,
  newsActionModel,
  newsSummaryModel,
  newsCategoryModel,
  newsMediaModel,
  newsReferenceModel,
};
