'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Book {
  id: string;
  title: string;
  createdAt: string;
  author: {
    username: string;
  };
}

function BookInventory() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('/api/bookInventory');
        if (res.data.success) {
          setBooks(res.data.books);
        }
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(search.toLowerCase())
  );

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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl md:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          Total Books: {books.length}
        </h2>

        <input
          type="text"
          placeholder="Search books..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-white"
        />
      </div>

      {/* Books Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredBooks.map(book => (
          <motion.div
            key={book.id}
            whileHover={{ scale: 1.05 }}
            className="p-4 bg-white dark:bg-gray-800 rounded-xl shadow-lg flex flex-col justify-between transition-all"
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
