"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

interface Book {
  id: string;
  title: string;
  description: string;
  isPublished: boolean;
}

interface Author {
  id: string;
  username: string;
  email: string;
  books: Book[];
}

export default function SingleAuthor() {
  const params = useParams();
  const { authorId } = params as { authorId: string };
  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await axios.get(`/api/singleAuthor/${authorId}`);
        const data = res.data;
        if (data.success) {
          setAuthor(data.author);
        } else {
          console.error("Failed to fetch author:", data.message);
        }
      } catch (error) {
        console.error("Error fetching author:", error);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) fetchAuthor();
  }, [authorId]);

  const handlePublishRequest = async (bookId: string) => {
    try {
      //Updating in database
      const updatedData = await axios.patch(`/api/handlePublishRequest/${bookId}`);
      //updating in Ui so that it shows the status immediately and saves one more request on backend

      const data = updatedData.data;
      if (data.success && author) {
        setAuthor({
          //destructing the author
          ...author,
          books: author.books.map((b) =>
            //destructuring the book
            b.id === bookId ? { ...b, isPublished: true } : b
          ),
        });
      }
    } catch (error) {
      console.error("Failed to send publish request:", error);
    }
  };

  const handleRejectPublish = async (bookId: string) => {
  try {
    // Call backend route to mark the book as rejected
    const res = await axios.patch(`/api/handleRejectPublish/${bookId}`);
    const data = res.data;

    if (data.success && author) {
      setAuthor({
        ...author,
        books: author.books.filter((b) => b.id !== bookId),
      });
    }
  } catch (error) {
    console.error("Failed to reject publish request:", error);
  }
};

  if (loading) return <p className="p-4">Loading author details...</p>;
  if (!author) return <p className="p-4 text-red-600">Author not found</p>;

  return (
    <div className="p-6 space-y-6">
      {/* Author info */}
      <div className="p-4 border rounded-lg bg-gray-50">
        <h1 className="text-2xl font-bold">{author.username}</h1>
        <p className="text-gray-700">{author.email}</p>
      </div>

      {/* Books list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {author.books.map((book) => (
          <div
            key={book.id}
            className="p-4 border rounded-lg shadow-sm bg-white flex flex-col gap-2"
          >
            <h2 className="text-lg font-semibold">{book.title}</h2>
            <p
              className={`text-sm font-medium ${
                book.isPublished ? "text-green-700" : "text-yellow-700"
              }`}
            >
              Status: {book.isPublished ? "Published" : "Not Published"}
            </p>

            {/* Buttons */}
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => console.log("Reviewing book:", book.id)}
                className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition"
              >
                Review
              </button>

              {!book.isPublished && (
                <>
                  <button
                    onClick={() => handlePublishRequest(book.id)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    Confirm Publish
                  </button>

                  <button
                    onClick={() => handleRejectPublish(book.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                  >
                    Reject Publish
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
