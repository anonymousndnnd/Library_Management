'use client'
import axios from 'axios';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';

export default function BookPage() {
  const params = useParams();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { bookId } = params as { bookId: string };
  const [publishing, setPublishing] = useState(false);
  const [publishStatus, setPublishStatus] = useState<"idle" | "in-process" | "published" | "rejected">("idle");

   useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios(`/api/bookContent/${bookId}`);
        const data = await res.data;

        if (data.success) {
          setBook(data.book);
          if (data.book.status === "pending") setPublishStatus("in-process");
          else if (data.book.status === "published") setPublishStatus("published");
          else if (data.book.status === "rejected") setPublishStatus("rejected");
          else setPublishStatus("idle");
        } else {
          console.error("Failed to fetch book:", data.message);
        }
      } catch (error) {
        console.error("Error fetching book:", error);
      } finally {
        setLoading(false);
      }
    };

    if (bookId) fetchBook();
  }, [bookId]);
  if (loading) {
    return <p className="p-4">Loading book...</p>;
  }
  if (!book) {
    return <p className="p-4 text-red-600">Book not found</p>;
  }

  const handlePublish = async () => {
    setPublishing(true);
    setPublishStatus("in-process");

    try {
      const res = await axios.post(`/api/publishRequest/${bookId}`);
      const data = res.data;
      console.log("Data is:",data)
      if (data.success) {
          if (data.book.status === "pending") setPublishStatus("in-process");
          else if (data.book.status === "published") setPublishStatus("published");
          else if (data.book.status === "rejected") setPublishStatus("rejected");
          else setPublishStatus("idle");// the book is sent for review
        setBook(data.book);
      } else {
        setPublishStatus("rejected");
        console.error("Failed to publish book:", data.message);
      }
    } catch (error) {
      setPublishStatus("rejected");
      console.error("Error publishing book:", error);
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{book.title}</h1>
      <p className="mt-2 text-gray-700">{book.description}</p>

      {/* Book Status */}
      <div className="mt-4">
        <span
          className={`inline-block px-2 py-1 text-sm rounded ${
            publishStatus === "published"
              ? "bg-green-100 text-green-700"
              : publishStatus === "in-process"
              ? "bg-yellow-100 text-yellow-700"
              : publishStatus === "rejected"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {publishStatus === "published"
            ? "Published"
            : publishStatus === "in-process"
            ? "In Review"
            : publishStatus === "rejected"
            ? "Rejected"
            : "Not Published"}
        </span>
      </div>

      {/* Publish Button */}
      <button
        onClick={handlePublish}
        disabled={publishing || publishStatus === "published" || publishStatus === "in-process"}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
      >
        {publishing
          ? "Publishing..."
          : publishStatus === "published"
          ? "Published"
          : publishStatus === "in-process"
          ? "In Review"
          : "Publish"}
      </button>

      {/* Simulate rejection for testing
      {publishStatus === "in-process" && (
        <button
          onClick={simulateReject}
          className="mt-2 ml-2 px-4 py-2 bg-red-600 text-white rounded-md"
        >
          Simulate Rejection
        </button>
      )} */}
    </div>
  );
}