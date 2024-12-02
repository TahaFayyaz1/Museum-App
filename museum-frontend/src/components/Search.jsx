import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/images/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        throw new Error("Failed to search images");
      }

      const data = await response.json();
      setResults(data);
      setError("");
      setSearchPerformed(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 flex flex-col items-center">
      <div className="max-w-6xl w-full px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
          Search Images
        </h1>

        <form
          onSubmit={handleSearch}
          className="flex flex-col sm:flex-row gap-4 items-center justify-center mb-8"
        >
          <input
            type="text"
            placeholder="Enter search term"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            required
            autoFocus
            className="w-full sm:w-2/3 px-4 py-2 text-gray-900 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Search
          </button>
        </form>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div>
          {searchPerformed && results.length === 0 && (
            <p className="text-lg text-gray-700 dark:text-gray-300 text-center">
              No results found
            </p>
          )}

          {results.length > 0 && (
            <div className="flex justify-center items-center">
              <div className="grid grid-cols-1 gap-6">
                {results.map((result) => (
                  <div
                    key={result.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 flex flex-col items-center transition-transform transform hover:scale-105"
                    onClick={() => navigate(`/item/${result.id}`)}
                  >
                    <img
                      src={`http://localhost:5000/uploads/${result.filename}`} // Construct image URL
                      alt={result.description}
                      className="rounded-lg w-full h-48 object-cover mb-4"
                    />
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {result.description || "No description available"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {result.filename}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
