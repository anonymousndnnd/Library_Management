'use client'
/* eslint-disable */
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function BookPage() {
  const params = useParams();
  const router = useRouter();
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
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-blue-600" />
      </div>
    );
  }

  if (!book) {
    return <p className="p-4 text-red-600">❌ Book not found</p>;
  }

  const handlePublish = async () => {
    setPublishing(true);
    setPublishStatus("in-process");

    try {
      const res = await axios.post(`/api/publishRequest/${bookId}`);
      const data = res.data;
      console.log("Data is:", data);
      if (data.success) {
        if (data.book.status === "pending") setPublishStatus("in-process");
        else if (data.book.status === "published") setPublishStatus("published");
        else if (data.book.status === "rejected") setPublishStatus("rejected");
        else setPublishStatus("idle");
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

  const statusIcons = {
    published: <CheckCircle className="text-green-600 w-5 h-5" />,
    "in-process": <Clock className="text-yellow-600 w-5 h-5" />,
    rejected: <XCircle className="text-red-600 w-5 h-5" />,
    idle: <Clock className="text-gray-600 w-5 h-5" />
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center bg-black/50 backdrop-blur-sm px-4"
      onClick={() => router.back()} // 👈 Clicking outside card goes back
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full"
        onClick={(e) => e.stopPropagation()} // 👈 Prevents closing when clicking inside card
      >
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>

        {/* Description */}
        <p className="mt-3 text-gray-600 leading-relaxed">{book.description}</p>

        {/* Status */}
        <div className="mt-6 flex items-center gap-2">
          {statusIcons[publishStatus]}
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
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
          className="mt-6 w-full py-3 rounded-xl text-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60 transition flex justify-center items-center"
        >
          {publishing && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
          {publishing
            ? "Publishing..."
            : publishStatus === "published"
            ? "Published"
            : publishStatus === "in-process"
            ? "In Review"
            : "Publish"}
        </button>
      </motion.div>
    </div>
  );
}
