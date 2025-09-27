'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiBookOpen } from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  publishedAt?: string;
  issued?: boolean;
}

export default function ExploreBooks() {
  const [publishedBooks, setPublishedBooks] = useState<Book[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // 👇 for modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get("/api/customerDashboard");
        if (res.data.success) {
          setPublishedBooks(res.data.publishedBooks);
          setIssuedBooks(res.data.issuedBooks);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-500 border-b-4 border-indigo-500"></div>
      </div>
    );
  }

  const renderBookItem = (book: Book, showButton: boolean) => (
    <motion.div
      key={book.id}
      whileHover={{ scale: book.issued ? 1 : 1.03 }}
      className={`relative flex justify-between items-center p-4 border border-gray-200 rounded-xl transition-all ${
        book.issued ? "bg-purple-50" : "bg-gradient-to-r from-white to-gray-50 hover:shadow-lg"
      }`}
    >
      {book.issued && (
        <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold text-purple-700 bg-purple-200 rounded-full">
          Issued
        </span>
      )}

      <div className="flex items-center gap-3">
        <FiBookOpen className={`${book.issued ? "text-purple-500" : "text-blue-500"} w-6 h-6`} />
        <div>
          <h3 className="font-semibold text-gray-900">{book.title}</h3>
          <p className="text-sm text-gray-500">Author: {book.author}</p>
          {book.publishedAt && (
            <p className="text-xs text-gray-400">
              Published: {new Date(book.publishedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>

      {showButton && (
        <button
          disabled={!!book.issued}
          className={`px-3 py-1 rounded transition font-semibold ${
            book.issued
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
          onClick={() => !book.issued && router.replace(`/bookOverview/${book.id}`)}
        >
          {book.issued ? "Already Issued" : "Request Issue"}
        </button>
      )}
    </motion.div>
  );

  return (
    <section className="p-6 min-h-[60vh] bg-gray-50 flex flex-col md:flex-row gap-6">
      {/* Explore Books Section */}
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
          Explore Books
        </h2>
        <div className="max-h-[70vh] overflow-y-auto bg-white shadow-lg rounded-xl p-4 space-y-4 custom-scrollbar">
          {publishedBooks.length === 0 ? (
            <p className="text-center text-gray-400 mt-4">No books available.</p>
          ) : (
            publishedBooks.map((book) => renderBookItem(book, true))
          )}
        </div>
      </div>

      {/* Issued Books Section */}
      <div className="w-full md:w-1/2">
        <h2 className="text-3xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-500">
          Issued Books
        </h2>
        <div className="max-h-[70vh] overflow-y-auto bg-white shadow-lg rounded-xl p-4 space-y-4 custom-scrollbar">
          {issuedBooks.length === 0 ? (
            <p className="text-center text-gray-400 mt-4">No issued books yet.</p>
          ) : (
            issuedBooks.map((book) => (
              <div key={book.id}>
                {renderBookItem(book, false)}
                <button
                  onClick={() => setSelectedBook(book)}
                  className="mt-2 w-full px-3 py-1 rounded transition font-semibold bg-green-600 text-white hover:bg-green-700"
                >
                  Open Book
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal for Book Details */}
      <AnimatePresence>
        {selectedBook && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/30 backdrop-blur-lg p-6 rounded-xl shadow-lg w-96 relative border border-white/40"
            >
              <h3 className="text-2xl font-bold mb-2 text-gray-900">{selectedBook.title}</h3>
              <p className="text-sm text-gray-800 mb-2">Author: {selectedBook.author}</p>
              <p className="text-sm text-gray-700 mb-2">
                Published:{" "}
                {selectedBook.publishedAt &&
                  new Date(selectedBook.publishedAt).toLocaleDateString()}
              </p>
              <p className="text-gray-900 mb-4">{selectedBook.description}</p>
              <button
                onClick={() => setSelectedBook(null)}
                className="absolute top-2 right-2 px-2 py-1 rounded bg-red-500 text-white hover:bg-red-600"
              >
                ✕
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(79, 70, 229, 0.6);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 4px;
        }
      `}</style>
    </section>
  );
}
