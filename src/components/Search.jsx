import React, { useRef } from "react";
import { Form, useNavigate } from "react-router-dom";

const debounce = (fn, ms = 300) => {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), ms);
  };
};

export function Search() {
  const query = useRef(null);
  const navigate = useNavigate();

  const handleSearch = debounce((event) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set("query", event.target.value);
    navigate(`?${newSearchParams}`, { replace: true });
  });

  return (
    <div className="max-w-[350px] mx-auto">
      <Form>
        <label
          htmlFor="query"
          className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
        >
          Search
        </label>
        <div className="relative my-8">
          <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="search"
            name="query"
            id="query"
            ref={query}
            onChange={handleSearch}
            className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-200 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-200 dark:border-gray-200 dark:placeholder-[#3b3c3c] dark:text-[#000915] dark:focus:ring-[#000915] dark:focus:border-[#000915]"
            placeholder="Search for products..."
            required
          />
          <button
            type="submit"
            className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-[#7f6727] duration-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-[#000915]"
          >
            Search
          </button>
        </div>
      </Form>
    </div>
  );
}
