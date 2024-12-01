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

  // Handle file input change
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setUploadStatus("File is too large. Please select a file less than 5MB.");
      setFile(null); // Clear the selected file
      setPreview(null); // Clear the preview
      return;
    }

    // Check if the file type is PNG
    if (selectedFile.type !== "image/png") {
      setUploadStatus("Only PNG files are allowed.");
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile)); // Preview the selected image
    setUploadStatus("");
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file); // Match 'image' with the backend field name
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
    setQrCodeButton(!qrCodeButton);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-light-blue-500 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white dark:bg-gray-800 shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Image Upload
              </h1>
            </div>
            <form onSubmit={handleFileUpload} className="mt-8 space-y-6">
              <div className="grid grid-cols-1 space-y-2">
                <label className="text-sm font-bold text-gray-500 dark:text-gray-400 tracking-wide">
                  Attach Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col rounded-lg border-4 border-dashed w-full h-60 p-10 group text-center">
                    <div className="h-full w-full text-center flex flex-col items-center justify-center">
                      {preview ? (
                        <img
                          src={preview}
                          alt="Preview"
                          className="max-h-full"
                        />
                      ) : (
                        <>
                          <svg
                            className="w-10 h-10 text-blue-400 group-hover:text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            ></path>
                          </svg>
                          <p className="pointer-none text-gray-500 dark:text-gray-400">
                            <span className="text-sm">Drag and drop</span> files
                            here <br /> or{" "}
                            <span className="text-blue-600 hover:underline">
                              select a file
                            </span>{" "}
                            from your computer
                          </p>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept="image/png"
                      className="hidden"
                    />
                  </label>
                </div>
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
            <button
              onClick={handleQrCodeButton}
              className="mt-6 w-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white p-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
            >
              Generate QR Code
            </button>
            {qrCodeButton && <QRCodeGenerator imageId={imageId} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
