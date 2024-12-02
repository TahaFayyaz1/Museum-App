import React, { useState, useEffect } from "react";
import axios from "axios";

const QRCodeGenerator = ({ imageId, onClose }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the QR code using axios
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/images/qrcode/${imageId}`
        );
        setQrCode(response.data.qrCode); // Assuming the response contains the qrCode field
      } catch (error) {
        console.error("Error fetching QR code:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQRCode();
  }, [imageId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!qrCode) {
    return <div>No QR code found</div>;
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Print QR Code</title>
          <style>
            body { text-align: center; margin: 0; padding: 20px; }
            img { max-width: 100%; height: auto; }
          </style>
        </head>
        <body>
          <img src="${qrCode}" alt="QR Code" />
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-sm w-full">
        <img
          src={qrCode}
          alt="QR Code"
          className="w-64 h-64 object-contain mb-6 mx-auto" // Increased size to w-64 h-64
        />
        <div className="flex justify-center gap-4">
          {" "}
          {/* Aligned buttons horizontally */}
          <button
            onClick={onClose}
            className="w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
          >
            Close
          </button>
          <button
            onClick={handlePrint}
            className="w-full flex justify-center bg-blue-500 text-gray-100 p-4 rounded-full tracking-wide font-semibold focus:outline-none focus:shadow-outline hover:bg-blue-600 shadow-lg cursor-pointer transition ease-in duration-300"
          >
            Print QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
