'use client';
/* eslint-disable */
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

interface Book {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
  author: {
    username: string;
  };
  createdAt: string;
}


function BookDetails() {
  const params = useParams();
  const { bookId } = params as { bookId: string };
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
   const router=useRouter()
 
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      router.push("/bookInventory");  // go to previous page
    }
  }
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/bookDetails/${bookId}`);
        const data = res.data;

        if (data.success) {
          setBook(data.book);
        } else {
          setError(data.message || 'Failed to fetch book');
        }
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <p className="text-red-600 bg-white px-6 py-3 rounded-lg shadow-lg">{error}</p>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/50">
        <p className="text-gray-600 bg-white px-6 py-3 rounded-lg shadow-lg">Book not found</p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={handleOverlayClick}>
      <motion.div
        ref={modalRef}
        initial={{ opacity: 0, scale: 0.8, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="max-w-3xl w-full bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 space-y-4"
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{book.title}</h1>
        <p className="text-gray-600 dark:text-gray-300">Author: {book.author.username}</p>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Published: {new Date(book.createdAt).toLocaleDateString()}
        </p>
        <div className="text-gray-700 dark:text-gray-200 mt-4">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p>{book.description}</p>
        </div>
        <p
          className={`mt-4 font-medium ${
            book.isPublished ? 'text-green-600' : 'text-yellow-600'
          }`}
        >
          Status: {book.isPublished ? 'Published' : 'Not Published'}
        </p>
      </motion.div>
    </div>
  );
}

export default BookDetails;
