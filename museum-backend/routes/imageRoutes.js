const express = require("express");
const {
  getAllImages,
  uploadImage,
  saveImage,
  generateQRCode,
  searchImages,
  getImageById,
} = require("../controllers/imageController");
const router = express.Router();

router.get("/", getAllImages); // Get all images
router.post("/upload", uploadImage, saveImage); // Upload an image
router.get("/qrcode/:id", generateQRCode); // Generate a QR code for an image
router.post("/search", searchImages);
router.get("/:id", getImageById);

module.exports = router;
