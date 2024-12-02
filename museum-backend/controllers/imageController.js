const multer = require("multer"); // handles file uploads
const QRCode = require("qrcode");
const sharp = require("sharp"); // used in figuring out the dimensions of the image
const { Client } = require("@elastic/elasticsearch"); // interacting with Elasticsearch cluster
const { ObjectId } = require("mongodb"); // querying database

require("dotenv").config();

// Initializes Elasticsearch client
const esClient = new Client({
  node: "http://localhost:9200",
  auth: {
    username: process.env.ELASTIC_USERNAME,
    password: process.env.ELASTIC_PASSWORD,
  },
});

// configures multer to define where and how uploaded files will be stored
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname), // to avoid filename collision date is added
});
const upload = multer({ storage });

const uploadImage = upload.single("image"); // multer parses the incoming request and looks for a file in "image" and stores it

const saveImage = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const { filename, originalname, path: filePath, size } = req.file;
  const { description } = req.body;
  const db = req.db;

  try {
    const { width, height } = await sharp(filePath).metadata(); // extracts the dimensions of the image

    // saves to mongo db using the following structure
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

    // Indexes the image data in Elasticsearch for enabling search functionality
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

// Generates a QR Code for each image
const generateQRCode = async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid image ID" }); // validates the id
    }

    const image = await db.collection("images").findOne({ _id: ObjectId }); // finds the image by the id in the db

    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

    // Generates the link for the QR code
    const link = `http://localhost:3000/item/${id}`;

    // Generates a QR code containing the link
    const qrCode = await QRCode.toDataURL(link);

    if (!qrCode) {
      return res.status(500).json({ error: "Failed to generate QR code" });
    }

    // Saves the QR code data
    await db
      .collection("images")
      .updateOne({ _id: new ObjectId(id) }, { $set: { qrCodeData: qrCode } });

    res.status(200).json({ qrCode });
  } catch (err) {
    console.error("Error generating QR code:", err);
    res
      .status(500)
      .json({ error: "Failed to generate QR code", details: err.message });
  }
};

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
const getImage = async (req, res) => {
  const { id } = req.params;
  const db = req.db;

  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid image ID" });
    }

    // Query the database for the image
    const image = await db
      .collection("images")
      .findOne({ _id: ObjectId.createFromHexString(id) });
    if (!image) {
      return res.status(404).json({ error: "Image not found" });
    }

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
  getImage,
};
