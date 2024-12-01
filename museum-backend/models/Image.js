const mongoose = require("mongoose");

const ImageSchema = new mongoose.Schema({
  filename: String,
  originalName: String,
  size: Number,
  uploadedAt: { type: Date, default: Date.now },
  qrCodeData: String, // URL or metadata linked to the QR code
});

module.exports = mongoose.model("Image", ImageSchema);
