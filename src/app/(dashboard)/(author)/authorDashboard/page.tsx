'use client'

import axios from 'axios';
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

function AuthorDashboard() {
  const router = useRouter();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios('/api/authorBooks'); // 👈 your API route
        const data = await res.data;

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

  if (loading) {
    return <p>Loading books...</p>;
  }

  const getStatusText = (book: any) => {
    if (book.status === "published") return { text: "Published", color: "text-green-600" };
    if (book.status === "rejected") return { text: "Rejected", color: "text-red-600" };
    return { text: "Not Published", color: "text-yellow-600" }; // pending / in process
  };

  return (
    <div className="p-4">
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded-md mb-4"
        onClick={() => router.replace("/addNewBook")}
      >
        Create New Book
      </button>

      <h2 className="text-xl font-semibold mb-2">My Books</h2>
      {books.length === 0 ? (
        <p>No books found. Start by creating one!</p>
      ) : (
        <ul className="space-y-2">
          {books.map((book) => {
            const status = getStatusText(book);
            return (
              <li key={book.id} className="border p-3 rounded-md cursor-pointer"
                onClick={() => router.push(`/books/${book.id}`)}
              >
                <h3 className="font-bold">{book.title}</h3>
                <p className="text-gray-600">{book.description}</p>
                <span className={`text-sm ${status.color}`}>
                  {status.text}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default AuthorDashboard;
