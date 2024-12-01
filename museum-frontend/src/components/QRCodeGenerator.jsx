import React, { useState, useEffect } from "react";
import axios from "axios";

const QRCodeGenerator = ({ imageId }) => {
  const [qrCode, setQrCode] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the QR code using axios
    const fetchQRCode = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/images/${imageId}/qrcode`
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
    <div className="mt-8 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
          Generated QR Code
        </h3>
        <div className="flex flex-col items-center">
          <img
            src={qrCode}
            alt="QR Code"
            className="w-48 h-48 object-contain mb-4"
          />
          <button
            onClick={handlePrint}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
          >
            Print QR Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;
