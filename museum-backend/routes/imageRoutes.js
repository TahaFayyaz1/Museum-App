const express = require("express");
const {
  getAllImages,
  uploadImage,
  saveImage,
  generateQRCode,
} = require("../controllers/imageController");
const router = express.Router();

router.get("/", getAllImages); // Get all images
router.post("/upload", uploadImage, saveImage); // Upload an image
router.get("/:id/qrcode", generateQRCode); // Generate a QR code for an image

module.exports = router;
