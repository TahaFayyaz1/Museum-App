import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/images");
        if (!response.ok) throw new Error("Failed to fetch images");

        const data = await response.json();
        setImages(data);
      } catch (error) {
        console.error("Error fetching images:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading images...
        </p>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          No images found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col items-center">
      <div className="max-w-6xl w-full px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Museum Items
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105 cursor-pointer"
              onClick={() => navigate(`/item/${image._id}`)} // Navigate on click
            >
              <img
                src={`http://localhost:5000/uploads/${image.photos[0].filename}`}
                alt={image.photos[0].originalName}
                className="rounded-lg w-full h-48 object-cover mb-4"
              />
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {image.photos[0].originalName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {image.photos[0].description || "No description available"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
