// File: pages/404.js

import React from "react";
import Link from "next/link";

const Custom404 = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-9xl font-bold text-red-500 mb-4">404</div>
      <h1 className="text-3xl font-semibold text-gray-800 mb-4">
        {"Oops! The page you are looking for doesn't exist."}
      </h1>
      <p className="text-lg text-gray-600 mb-8">
        {
          "It seems you've hit a broken link or entered a URL that doesn't exist on this site."
        }
      </p>
      <Link
        href="/"
        className="inline-block px-6 py-3 bg-red-500 text-white rounded-full font-bold text-lg hover:bg-red-600 transition duration-300"
      >
        Go back to Home
      </Link>
    </div>
  );
};

export default Custom404;
