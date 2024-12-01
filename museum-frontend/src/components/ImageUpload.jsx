import React, { useState } from "react";
import axios from "axios";
import QRCodeGenerator from "./QRCodeGenerator";

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState("");
  const [preview, setPreview] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [imageId, setImageId] = useState(null);
  const [qrCodeButton, setQrCodeButton] = useState(false);
  const [dragging, setDragging] = useState(false); // State to track drag events

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile) => {
    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setUploadStatus("File is too large. Please select a file less than 5MB.");
      setFile(null);
      setPreview(null);
      return;
    }

    if (selectedFile && selectedFile.type !== "image/png") {
      setUploadStatus("Only PNG files are allowed.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
    setUploadStatus("");
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);

    try {
      setUploadStatus("Uploading...");
      const response = await axios.post(
        "http://localhost:5000/api/images/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUploadStatus("File uploaded successfully!");
      setDescription("");
      setImageId(response.data._id);
      console.log("Response:", response.data);
    } catch (error) {
      console.error("Error uploading file:", error.response || error.message);
      setUploadStatus("Failed to upload file.");
    }
  };

  const handleQrCodeButton = () => {
    setQrCodeButton(true);
  };

  const closeQrCodeButton = () => {
    setQrCodeButton(false);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    validateAndSetFile(droppedFile);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
              Image Upload
            </h1>
            <form onSubmit={handleFileUpload} className="mt-8 space-y-6">
              <div
                className={`flex items-center justify-center w-full border-4 border-dashed p-10 h-60 rounded-lg ${
                  dragging
                    ? "border-blue-400 bg-blue-100 dark:bg-blue-800"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {preview ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="max-h-full max-w-full"
                  />
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    Drag & drop a file here, or{" "}
                    <label className="text-blue-600 hover:underline cursor-pointer">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        accept="image/png"
                        className="hidden"
                      />
                      browse
                    </label>
                  </p>
                )}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide">
                  Description
                </label>
                <textarea
                  className="w-full text-base p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                  rows="4"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
                >
                  Upload
                </button>
              </div>
            </form>
            {uploadStatus && (
              <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                {uploadStatus}
              </p>
            )}

            {/* Only show the Generate QR Code button if upload is successful */}
            {uploadStatus === "File uploaded successfully!" && (
              <button
                onClick={handleQrCodeButton}
                className="mt-6 w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
              >
                Generate QR Code
              </button>
            )}
            {qrCodeButton && (
              <QRCodeGenerator imageId={imageId} onClose={closeQrCodeButton} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
