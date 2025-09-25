"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";


interface Author {
  id: string;
  username: string;
  email: string;
  books: { id: string; title: string; isPublished: boolean }[];
}

export default function AllAuthors() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
const router=useRouter();

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await axios.get("/api/allAuthor"); // 👈 your backend API route
        const data = res.data;

        if (data.success) {
          setAuthors(data.authors);
        } else {
          console.error("Failed to fetch authors:", data.message);
        }
      } catch (error) {
        console.error("Error fetching authors:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return <p className="p-4">Loading authors...</p>;
  }

  if (authors.length === 0) {
    return <p className="p-4 text-gray-600">No authors found.</p>;
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold mb-4">All Authors</h1>
      <ul className="space-y-3">
        {authors.map((author) => (
          <li
            key={author.id}
            className="p-4 border rounded-lg shadow-sm bg-white hover:shadow-md transition"
            onClick={()=>router.push(`/singleAuthor/${author.id}`)}
          >
            <h2 className="text-lg font-semibold">{author.username}</h2>
            <p className="text-gray-600">{author.email}</p>
            <p className="text-sm text-gray-800 mt-1">
              📚 Total Books: <span className="font-bold">{author.books.length}</span>
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
