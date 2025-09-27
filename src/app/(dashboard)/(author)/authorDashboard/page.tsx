'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react';
import { Loader2, PlusCircle, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

function AuthorDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios('/api/authorBooks'); // 👈 same API
        const data = await res.data;
        console.log("data is ",data)
        if (data.success) {
          setBooks(data.books);
        } else {
          console.error("Failed to fetch books:", data.message);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const getStatusText = (book: any) => {
    if (book.status === "published") return { text: "Published", color: "bg-green-100 text-green-700" };
    if (book.status === "rejected") return { text: "Rejected", color: "bg-red-100 text-red-700" };
    return { text: "Pending Review", color: "bg-yellow-100 text-yellow-700" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">📚 My Books</h1>
        <button
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-xl shadow-md hover:bg-blue-700 transition"
          onClick={() => router.replace("/addNewBook")}
        >
          <PlusCircle className="w-5 h-5" />
          Create New Book
        </button>
      </div>

      {/* Books List */}
      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-gray-600">
          <BookOpen className="w-16 h-16 mb-4 text-gray-400" />
          <p className="text-lg">No books found. Start by creating one!</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => {
            const status = getStatusText(book);
            return (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/books/${book.id}`)}
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{book.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{book.description}</p>
                
                {/* Status */}
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${status.color}`}
                >
                  {status.text}
                </span>

                {/* Readers Count */}
                <p className="mt-3 text-sm text-gray-600">
                  👤 Readers: <span className="font-medium">{book.issueRequests.length}</span>
                </p>
              </motion.div>
      );
    })}
        </div>
      )}
    </div>
  );
}

export default AuthorDashboard;
