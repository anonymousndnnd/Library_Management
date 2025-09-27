'use client';

import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useRouter } from 'next/navigation';

interface Book {
  id: string;
  title: string;
  createdAt: string;
  author: {
    username: string;
  };
}

function BookInventory() {
  const books = useSelector((state: RootState) => state.admin.books); 
  const loading = useSelector((state: RootState) => state.admin.loading);
  const [search, setSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const filteredBooks = useMemo(() => 
    books.filter(book => book.title.toLowerCase().includes(search.toLowerCase()))
  , [books, search]);

  const handleSelect = (bookId: string) => {
    router.replace(`/bookDetails/${bookId}`);
    setSearch('');           // clear input
    setShowSuggestions(false); // hide suggestions
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-600 animate-pulse">Loading books...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 bg-gray-100 dark:bg-gray-900">
      {/* Top Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 relative">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4 md:mb-0">
          Total Books: {books.length}
        </h2>

        <div className="w-full md:w-1/3 relative">
          <input
            type="text"
            placeholder="Search books..."
            value={search}
            onChange={e => {
              setSearch(e.target.value);
              setShowSuggestions(true);
            }}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // delay to allow click
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
          />
          {showSuggestions && search && filteredBooks.length > 0 && (
            <ul className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg mt-1 max-h-60 overflow-y-auto z-50 shadow-lg">
              {filteredBooks.slice(0, 6).map(book => (
                <li
                  key={book.id}
                  onClick={() => handleSelect(book.id)}
                  className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white dark:hover:bg-blue-600 transition"
                >
                  {book.title}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <motion.div
            key={book.id}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col justify-between transition-all cursor-pointer"
            onClick={() => router.replace(`/bookDetails/${book.id}`)}
          >
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">{book.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">Author: {book.author.username}</p>
            </div>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              Published: {new Date(book.createdAt).toLocaleDateString("en-GB", { timeZone: "UTC" })}
            </p>
          </motion.div>
        ))}

        {filteredBooks.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 col-span-full text-center mt-10">
            No books found
          </p>
        )}
      </div>
    </div>
  );
}

export default BookInventory;
