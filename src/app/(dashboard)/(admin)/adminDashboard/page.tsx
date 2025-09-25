'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaUser, FaUsers, FaBook, FaClipboardList, FaChartLine, FaCogs } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store"; 


function AdminDashboard() {
  const { authorCount, customerCount, books, loading, error } = useSelector(
    (state: RootState) => state.admin
  );
  // const [totalAuthor, setAuthorCount] = useState<number | null>(null);
  // const [totalCustomer, setCustomerCount] = useState<number | null>(null);
  // const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { data: session } = useSession();
  const adminName = session?.user?.name || "Admin";

  // useEffect(() => {
  //   const fetchCounts = async () => {
  //     try {
  //       const authorCount = await axios.get("/api/authorCount");
  //       const customerCount = await axios.get("/api/customerCount");
  //       if (authorCount.data.success) setAuthorCount(authorCount.data.authorCount);
  //       if (customerCount.data.success) setCustomerCount(customerCount.data.customerCount);
  //     } catch (error) {
  //       console.error("Error fetching counts:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchCounts();
  // }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-200 dark:bg-gray-900">
        <p className="text-gray-500 text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-200 dark:bg-gray-900 p-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Welcome, <span className="text-gray-700 dark:text-gray-200">{adminName}</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Here's an overview of your system
        </p>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
          onClick={() => router.push("/admin/customers")}
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

        {/* Reports */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow hover:shadow-lg cursor-pointer flex flex-col justify-center items-center transition"
          onClick={() => router.push("/admin/reports")}
        >
          <FaClipboardList className="text-2xl mb-2" />
          <h2 className="font-semibold mb-1">Reports</h2>
          <p className="text-3xl font-bold">—</p>
          <p className="mt-1 text-sm text-gray-400">View reports</p>
        </motion.div>

        {/* Active Sessions */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow hover:shadow-lg flex flex-col justify-center items-center transition"
        >
          <FaChartLine className="text-2xl mb-2" />
          <h2 className="font-semibold mb-1">Active Sessions</h2>
          <p className="text-3xl font-bold">12</p>
          <p className="mt-1 text-sm text-gray-400">Currently logged in</p>
        </motion.div>

        {/* System Status */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-lg shadow hover:shadow-lg flex flex-col justify-center items-center transition"
        >
          <FaCogs className="text-2xl mb-2" />
          <h2 className="font-semibold mb-1">System Status</h2>
          <p className="text-3xl font-bold">Good</p>
          <p className="mt-1 text-sm text-gray-400">All systems running</p>
        </motion.div>
      </div>
    </div>
  );
}

export default AdminDashboard;
