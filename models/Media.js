const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  filename: String,
  fileId: mongoose.Schema.Types.ObjectId,
  uploadedBy: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Media", mediaSchema);