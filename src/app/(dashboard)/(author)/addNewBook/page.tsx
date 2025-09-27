'use client'
/* eslint-disable */
import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function AddNewBook() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await axios.post('/api/author_addBook', { title, description }); 

      if (res.data.success) {
        setMessage('✅ Book added successfully!');
        router.replace('/authorDashboard');
      } else {
        setMessage(res.data.message || '❌ Failed to add book');
      }
    } catch (err: any) {
      console.error(err);
      setMessage(err.response?.data?.message || '⚠️ Error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black p-6">
      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-6 text-center">📚 Add New Book</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-200 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter book title"
              required
            />
          </div>
          <div>
            <label className="block text-gray-200 mb-2">Description</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter book description"
              rows={4}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400 rounded-lg text-white font-semibold flex justify-center items-center transition-all"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  ></path>
                </svg>
                Adding...
              </span>
            ) : (
              "Add Book"
            )}
          </button>
        </form>
        {message && (
          <p
            className={`mt-4 text-center font-medium ${
              message.includes('successfully')
                ? 'text-green-400'
                : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
