const express = require("express");
const {
  getAllImages,
  uploadImage,
  saveImage,
  generateQRCode,
  searchImages,
  getImage,
} = require("../controllers/imageController");
const router = express.Router();

router.get("/", getAllImages); // Gets all images
router.post("/upload", uploadImage, saveImage); // Uploads and Saves an image
router.get("/qrcode/:id", generateQRCode); // Generates a QR code for an image
router.post("/search", searchImages); // Searches using the description for an image using post request
router.get("/:id", getImage); // Gets an image using its id

module.exports = router;
