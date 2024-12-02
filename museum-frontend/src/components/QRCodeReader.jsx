import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQRScanner from "react-qr-scanner";

const QrScanner = () => {
  const [data, setData] = useState("No result");
  const [scanned, setScanned] = useState(false);
  const navigate = useNavigate();

  const handleScan = (data) => {
    if (data) {
      setData(data.text);
      setScanned(true);

      const urlPattern = /^https?:\/\/localhost:3000\/item\/([a-zA-Z0-9]+)$/;
      const match = data.text.match(urlPattern);

      if (match) {
        const id = match[1];
        navigate(`/item/${id}`);
      }
    }
  };

  const handleError = (error) => {
    console.warn(error);
  };

  // Automatically stop the scanner when the component is unmounted
  useEffect(() => {
    return () => {
      setScanned(false);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        QR Code Scanner
      </h1>
      {scanned ? (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md text-center">
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-2">
            Scanned Data:
          </p>
          <p className="text-xl font-semibold text-blue-500">{data}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg w-full max-w-md mt-6">
          <ReactQRScanner
            delay={300}
            onScan={handleScan}
            onError={handleError}
            style={{ width: "100%" }}
          />
        </div>
      )}
    </div>
  );
};

export default QrScanner;
