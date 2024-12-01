const multer = require("multer");
const QRCode = require("qrcode");
const fs = require("fs");
const path = require("path");

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Upload Image
const uploadImage = upload.single("image");
const saveImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { filename, originalname, size } = req.file;
  const { description } = req.body;
  const db = req.db;

  try {
    const result = await db.collection("images").insertOne({
      filename,
      originalName: originalname,
      size,
      description: description || "",
      uploadedAt: new Date(),
    });

    // Use `insertedId` to fetch the newly inserted document
    const insertedImage = await db
      .collection("images")
      .findOne({ _id: result.insertedId });

    res.status(201).json(insertedImage); // Return the inserted document
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save image", details: err.message });
  }
};

// Generate QR Code
const { ObjectId } = require("mongodb"); // Import ObjectId

const generateQRCode = async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  try {
    // Ensure the id is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid image ID" });
    }

    const image = await db
      .collection("images")
      .findOne({ _id: new ObjectId(id) });
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Generate the QR code data URL
    const qrCodeData = `http://localhost:5000/uploads/${image.filename}`;

    // Generate the QR code
    const qrCode = await QRCode.toDataURL(qrCodeData);
    if (!qrCode) {
      return res.status(500).json({ error: "Failed to generate QR code" });
    }

    // Update the database with the generated QR code data
    await db
      .collection("images")
      .updateOne({ _id: new ObjectId(id) }, { $set: { qrCodeData } });

    // Return the generated QR code
    res.status(200).json({ qrCode });
  } catch (err) {
    console.error("Error generating QR code:", err); // Log the error for debugging
    res
      .status(500)
      .json({ error: "Failed to generate QR code", details: err.message });
  }
};

const getAllImages = async (req, res) => {
  const db = req.db;

  try {
    const images = await db.collection("images").find({}).toArray();
    res.status(200).json(images); // Return all images
  } catch (err) {
    console.error("Error fetching images:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch images", details: err.message });
  }
};

module.exports = { uploadImage, saveImage, generateQRCode, getAllImages };
