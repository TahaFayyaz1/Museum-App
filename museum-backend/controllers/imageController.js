const multer = require("multer");
const QRCode = require("qrcode");
const fs = require("fs");
const sharp = require("sharp");
const path = require("path");
const { Client } = require("@elastic/elasticsearch");
const { ObjectId } = require("mongodb");

// Set up Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

require("dotenv").config();
// Initialize Elasticsearch client
const esClient = new Client({
  node: "http://localhost:9200",
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
}); // Replace with your Elasticsearch URL

// Upload Image
const uploadImage = upload.single("image");
const saveImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { filename, originalname, path: filePath, size } = req.file;
  const { description } = req.body;
  const db = req.db;

  try {
    const { width, height } = await sharp(filePath).metadata();

    const result = await db.collection("images").insertOne({
      photos: [
        {
          filename,
          originalName: originalname,
          size,
          description: description || "",
          dimensions: { width, height },
        },
      ],
      uploadedAt: new Date(),
    });

    const insertedImage = await db
      .collection("images")
      .findOne({ _id: result.insertedId });

    // Index the document in Elasticsearch
    await esClient.index({
      index: "images",
      id: result.insertedId.toString(),
      body: {
        filename,
        originalName: originalname,
        description: description || "",
        dimensions: { width, height },
        uploadedAt: new Date(),
      },
    });

    res.status(201).json(insertedImage);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to save image", details: err.message });
  }
};

// Generate QR Code
const generateQRCode = async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  try {
    // Validate the provided ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid image ID" });
    }

    // Fetch the image from the database to ensure it exists
    const image = await db
      .collection("images")
      .findOne({ _id: new ObjectId(id) });

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Generate the link for the QR code
    const link = `http://localhost:3000/item/${id}`;

    // Generate a QR code containing the link
    const qrCode = await QRCode.toDataURL(link);

    if (!qrCode) {
      return res.status(500).json({ error: "Failed to generate QR code" });
    }

    // Save the QR code data (optional)
    await db
      .collection("images")
      .updateOne({ _id: new ObjectId(id) }, { $set: { qrCodeData: qrCode } });

    // Respond with the QR code
    res.status(200).json({ qrCode });
  } catch (err) {
    console.error("Error generating QR code:", err);
    res
      .status(500)
      .json({ error: "Failed to generate QR code", details: err.message });
  }
};

// Get all images
const getAllImages = async (req, res) => {
  const db = req.db;

  try {
    const images = await db.collection("images").find({}).toArray();
    res.status(200).json(images);
  } catch (err) {
    console.error("Error fetching images:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch images", details: err.message });
  }
};

// Search images by description
const searchImages = async (req, res) => {
  const { query } = req.body;

  try {
    const result = await esClient.search({
      index: "images",
      body: {
        query: {
          match: {
            description: query,
          },
        },
      },
    });

    const hits = result.hits.hits.map((hit) => ({
      id: hit._id,
      ...hit._source,
    }));

    res.status(200).json(hits);
  } catch (err) {
    console.error("Error searching images:", err);
    res
      .status(500)
      .json({ error: "Failed to search images", details: err.message });
  }
};

// Get a specific image by ID
const getImageById = async (req, res) => {
  const { id } = req.params; // Get the image ID from the request parameters
  const db = req.db; // Get the database instance from the request

  try {
    // Validate the provided ID
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid image ID" });
    }

    // Query the database for the image
    const image = await db
      .collection("images")
      .findOne({ _id: new ObjectId(id) });
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Return the image data
    res.status(200).json(image);
  } catch (err) {
    console.error("Error fetching image:", err);
    res
      .status(500)
      .json({ error: "Failed to fetch image", details: err.message });
  }
};

module.exports = {
  uploadImage,
  saveImage,
  generateQRCode,
  getAllImages,
  searchImages,
  getImageById,
};
