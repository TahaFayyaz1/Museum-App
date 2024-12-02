import React from "react";
import { Link } from "react-router-dom";

function NavBar({ darkMode, toggleDarkMode }) {
  return (
    <div
      className={`bg-gray-100 dark:bg-gray-900 py-4 border-b border-gray-300 dark:border-gray-700`}
    >
      <nav className="flex justify-between items-center max-w-6xl mx-auto px-4">
        <div className="space-x-4">
          <Link
            to="/"
            className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Home
          </Link>
          <Link
            to="/upload"
            className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Add New Item
          </Link>
          <Link
            to="/search"
            className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Search
          </Link>
          <Link
            to="/scan"
            className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
          >
            Scan
          </Link>
        </div>

        <button
          onClick={toggleDarkMode}
          className="ml-4 rounded-full bg-gray-200 p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
        >
          {darkMode ? (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </nav>
    </div>
  );
}

export default NavBar;
