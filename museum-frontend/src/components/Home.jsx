import React, { useEffect, useState } from "react";

const Home = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

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
    return <p>Loading images...</p>;
  }

  if (images.length === 0) {
    return <p>No images found.</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col items-center">
      <div className="max-w-6xl w-full px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Image Gallery
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image) => (
            <div
              key={image._id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center"
            >
              <img
                src={`http://localhost:5000/uploads/${image.filename}`}
                alt={image.originalName}
                className="rounded-lg w-full h-48 object-cover mb-4"
              />
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {image.originalName}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {image.description || "No description available"}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
