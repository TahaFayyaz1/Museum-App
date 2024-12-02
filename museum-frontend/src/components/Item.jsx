import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ItemDetail = () => {
  const { id } = useParams(); // Get the id from URL params
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/images/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch item details");

        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Error fetching item details:", error);
        setError("Failed to load item details.");
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Loading item details...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-red-500 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Item not found.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col items-center">
      <div className="max-w-4xl w-full px-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          {item.photos[0]?.originalName || "Unnamed Item"}
        </h1>
        <img
          src={`http://localhost:5000/uploads/${item.photos[0]?.filename}`}
          alt={item.photos[0]?.originalName || "Item Image"}
          className="rounded-lg w-full h-64 object-cover mb-4"
        />
        <p className="text-lg text-gray-700 dark:text-gray-300">
          {item.photos[0]?.description || "No description available."}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Uploaded on:{" "}
          {new Date(item.createdAt).toLocaleDateString() || "Unknown"}
        </p>
      </div>
    </div>
  );
};

export default ItemDetail;
