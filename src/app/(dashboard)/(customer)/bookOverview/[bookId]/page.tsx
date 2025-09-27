'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

interface Book {
  id: string;
  title: string;
  author: { username: string } | null;
  createdAt: string;
}

interface Request {
  id: string;
  issueStatus: "pending" | "approved" | "rejected";
}

export default function BookOverview() {
  const params = useParams();
  const { bookId } = params as { bookId: string };
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [issueStatus, setIssueStatus] = useState<
    "idle" | "in-process" | "issued" | "rejected"
  >("idle");
  const router = useRouter();

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/api/bookOverview/${bookId}`);
        const data = res.data;

        if (data.success) {
          setBook(data.book);

          // ✅ use request info from backend
          const status = data.request?.issueStatus;
          if (status === "pending") setIssueStatus("in-process");
          else if (status === "approved") setIssueStatus("issued");
          else if (status === "rejected") setIssueStatus("rejected");
          else setIssueStatus("idle");
        }
      } catch (err) {
        console.error("Error fetching book:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [bookId]);

  const handleRequestIssue = async () => {
    setRequesting(true);
    setIssueStatus("in-process");

    try {
      const res = await axios.post(`/api/bookIssueRequest/${bookId}`);
      const data = res.data;

      if (data.success) {
        const status = data.request?.issueStatus;
        if (status === "pending") setIssueStatus("in-process");
        else if (status === "approved") setIssueStatus("issued");
        else if (status === "rejected") setIssueStatus("rejected");
        else setIssueStatus("idle");
      } else {
        setIssueStatus("rejected");
        console.error("Failed to request issue:", data.message);
      }
    } catch (err) {
      console.error("Error requesting issue:", err);
      setIssueStatus("rejected");
    } finally {
      setRequesting(false);
    }
  };

  const handleBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if ((e.target as HTMLElement).id === "background") {
      router.replace("/customerDashboard");
    }
  };

  return (
    <AnimatePresence>
      <div
        id="background"
        onClick={handleBackgroundClick}
        className="fixed inset-0 flex justify-center items-center z-50
                   bg-[rgba(255,255,255,0.05)] backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: -50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: -50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-[rgba(255,255,255,0.85)] backdrop-blur-md rounded-2xl shadow-2xl p-8 w-11/12 max-w-md relative hover:scale-[1.02] transition-transform"
        >
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
          ) : !book ? (
            <p className="text-red-500 text-center text-xl">Book not found</p>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
              <p className="text-gray-700 text-lg mt-2">
                <span className="font-semibold">Author:</span>{" "}
                {book.author?.username || "Unknown"}
              </p>
              <p className="text-gray-500 mt-1">
                <span className="font-semibold">Published:</span>{" "}
                {new Date(book.createdAt).toLocaleDateString("en-GB", {
                  timeZone: "UTC",
                })}
              </p>

              <p className="mt-2 text-sm font-semibold">
                Your Request Status:{" "}
                <span
                  className={`px-2 py-1 rounded ${
                    issueStatus === "issued"
                      ? "bg-green-100 text-green-700"
                      : issueStatus === "in-process"
                      ? "bg-yellow-100 text-yellow-700"
                      : issueStatus === "rejected"
                      ? "bg-red-100 text-red-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {issueStatus}
                </span>
              </p>

              <button
                onClick={handleRequestIssue}
                disabled={
                  requesting ||
                  issueStatus === "in-process" ||
                  issueStatus === "issued"
                }
                className={`mt-6 w-full font-semibold py-2 px-4 rounded-xl shadow-md transition flex justify-center items-center
${
  requesting || issueStatus === "in-process" || issueStatus === "issued"
    ? "bg-gray-400 cursor-not-allowed text-white"
    : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700"
}`}
              >
                {requesting ? (
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : issueStatus === "in-process" ? (
                  "Request Sent (Pending Approval)"
                ) : issueStatus === "issued" ? (
                  "Book Issued (Cannot Request Again)"
                ) : issueStatus === "rejected" ? (
                  "Re-request Book Issue"
                ) : (
                  "Request Book Issue"
                )}
              </button>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
