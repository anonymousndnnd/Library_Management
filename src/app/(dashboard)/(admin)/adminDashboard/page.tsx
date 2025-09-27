'use client';
/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUser, FaUsers, FaBook } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store"; 
import { toast } from "sonner";



function AdminDashboard() {
  const { authorCount, customerCount, loading } = useSelector(
    (state: RootState) => state.admin
  );
  const router = useRouter();
  const { data: session } = useSession();
  const adminName = session?.user?.name || "Admin";

  const [bookRequests, setBookRequests] = useState<any[]>([]);
  const [issuedBooks, setIssuedBooks] = useState<any[]>([]);
  const [reqLoading, setReqLoading] = useState(true);
  const [issuedLoading, setIssuedLoading] = useState(true);

  // Fetch pending requests
 
    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/bookIssueRequest");
        if (res.data.success) {
          console.log(res.data)
          setBookRequests(res.data.books?? []);
        }
      } catch (error) {
        console.error("Error fetching requests:", error);
      } finally {
        setReqLoading(false);
      }
    };
    

  // Fetch issued books
  
    const fetchIssuedBooks = async () => {
      try {
        const res = await axios.get("/api/fetchIssuedBooks"); 
        console.log(res.data)
        if (res.data.success) {
          setIssuedBooks(res.data.issuedBooks?? []);
        }
      } catch (error) {
        console.error("Error fetching issued books:", error);
      } finally {
        setIssuedLoading(false);
      }
    };
    useEffect(()=>{
      fetchRequests(),
      fetchIssuedBooks()
    },[])

  const handleAccept = async (bookId: string) => {
    try {
      const res = await axios.post(`/api/bookIssueAcceptRequest/${bookId}`);
      if (res.data.success) {
        // Move request to issuedBooks
        
        const acceptedRequest = bookRequests.find(req => req.id === bookId);
        setIssuedBooks(prev => [...prev, acceptedRequest]);
        setBookRequests(prev => prev.filter(req => req.id !== bookId));
        toast("Book Issued Successfully");
      }
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-900">
        <p className="text-gray-500 text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 p-8">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Welcome, <span className="text-gray-700 dark:text-gray-200">{adminName}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here's an overview of your system
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
        {/* Authors */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col justify-center items-center transition"
          onClick={() => router.replace("/allAuthorData")}
        >
          <FaUser className="text-2xl mb-2" />
          <h2 className="font-semibold mb-1">Authors</h2>
          <p className="text-3xl font-bold">{authorCount ?? 0}</p>
          <p className="mt-1 text-sm text-gray-400">View all authors</p>
        </motion.div>

        {/* Customers */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col justify-center items-center transition"
          onClick={() => router.replace("/allCustomerData")}
        >
          <FaUsers className="text-2xl mb-2" />
          <h2 className="font-semibold mb-1">Customers</h2>
          <p className="text-3xl font-bold">{customerCount ?? 0}</p>
          <p className="mt-1 text-sm text-gray-400">View all customers</p>
        </motion.div>

        {/* Book Inventory */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col justify-center items-center transition"
          onClick={() => router.push("/bookInventory")}
        >
          <FaBook className="text-2xl mb-2" />
          <h2 className="font-semibold mb-1">Book Inventory</h2>
          <p className="mt-1 text-sm text-gray-400">View all books</p>
        </motion.div>
      </div>

      {/* Two-column layout for Requests & Issued Books */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Pending Requests */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Pending Book Requests
          </h2>
          {reqLoading ? (
            <p className="text-gray-500">Loading requests...</p>
          ) : bookRequests.length === 0 ? (
            <p className="text-gray-500">No pending requests.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scroll">
              {bookRequests.map((request) => (
                <motion.div
                  key={request.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{request.book.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Author: {request.book.author.username || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Requested By: {request.customer?.username || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Published: {new Date(request.book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleAccept(request.id)}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Issued Books */}
        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">
            Issued Books
          </h2>
          {issuedLoading ? (
            <p className="text-gray-500">Loading issued books...</p>
          ) : issuedBooks.length === 0 ? (
            <p className="text-gray-500">No issued books yet.</p>
          ) : (
            <div className="max-h-96 overflow-y-auto space-y-4 pr-2 custom-scroll">
              {issuedBooks.map((issued) => (
                <motion.div
                  key={issued.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-700 rounded-lg shadow-sm"
                >
                  <div>
                    <h3 className="font-semibold text-lg">{issued.book.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Author: {issued.book.author.username || "Unknown"}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      Issued To: {issued.customer?.username || "N/A"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Published: {new Date(issued.book.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
