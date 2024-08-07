const { default: mongoose } = require("mongoose");

const supportedLanguages = ["en"];
const supportedActions = ["create", "update", "summary", "verify", "publish"];
const newsLevels = ["general", "trendy", "major"];

// Index on language
const newSummarySchema = new mongoose.Schema({
  title: { type: String, required: true, maxlength: 200 },
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
    url: {
      type: String,
      required: true,
      match: /^https?:\/\/.*/,
      unique: true,
    },
    type: { type: String, required: true, enum: ["image", "video"] },
    thumbnailUrl: { type: String, match: /^https?:\/\/.*/ },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    tags: [{ type: String, index: true }],
  },
  { timestamps: true }
);

const newsCategorySchema = new mongoose.Schema({
  name: { type: String, required: true, maxlength: 50 },
});

const newsReferenceSchema = new mongoose.Schema({
  url: { type: String, required: true, match: /^https?:\/\/.*/, unique: true },
  source: { type: String, required: true },
  author: { type: String, required: true, maxlength: 100 },
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

const newsActionModel = mongoose.model("News_Action", newsActionSchema);
const newsMediaModel = mongoose.model("News_Media", newsMediaSchema);
const newsCategoryModel = mongoose.model("News_Category", newsCategorySchema);
const newsSummaryModel = mongoose.model("News_Summary", newSummarySchema);
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
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News_Category",
      required: true,
    },
    reference: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "News_Reference",
      required: true,
    },
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
