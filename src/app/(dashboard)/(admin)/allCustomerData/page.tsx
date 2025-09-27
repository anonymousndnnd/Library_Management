'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";

interface Book {
  id: string;
  title: string;
  author: string;
  publishedAt: string;
}

interface Customer {
  id: string;
  username: string;
  email: string;
  totalBooksIssued: number;
  issuedBooks: Book[];
}

function AllCustomer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openCustomerId, setOpenCustomerId] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      const res = await axios.get("/api/allCustomer");
      if (res.data.success) {
        setCustomers(res.data.customerData);
      } else {
        setError("Failed to fetch customers");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const toggleBooks = (customerId: string) => {
    setOpenCustomerId(openCustomerId === customerId ? null : customerId);
  };

  if (loading) return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-16 h-16 border-4 border-blue-600 border-dashed rounded-full animate-spin"></div>
    </div>
  );

  if (error) return (
    <p className="text-center mt-10 text-red-500 font-medium">{error}</p>
  );

  return (
    <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-4xl font-bold mb-6 text-gray-800 dark:text-gray-100 text-center">
        All Customers
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 shadow-lg rounded-lg overflow-hidden">
          <thead className="bg-blue-600">
            <tr className="text-white">
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Total Issued Books</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {customers.map((cust, index) => (
              <React.Fragment key={cust.id}>
                <tr className="hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                  <td className="py-3 px-6 font-medium">{index + 1}</td>
                  <td className="py-3 px-6">{cust.username}</td>
                  <td className="py-3 px-6">{cust.email}</td>
                  <td className="py-3 px-6">{cust.totalBooksIssued}</td>
                  <td className="py-3 px-6">
                    <button
                      onClick={() => toggleBooks(cust.id)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                      {openCustomerId === cust.id ? "Hide Books" : "Show Books"}
                    </button>
                  </td>
                </tr>

                {openCustomerId === cust.id && (
                  <tr>
                    <td colSpan={5} className="bg-gray-50 dark:bg-gray-700 p-4">
                      {cust.issuedBooks.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {cust.issuedBooks.map((book) => (
                            <div
                              key={book.id}
                              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border-l-4 border-blue-600 hover:shadow-lg transition transform hover:-translate-y-1"
                            >
                              <p className="font-bold text-lg text-gray-800 dark:text-gray-100">{book.title}</p>
                              <p className="text-gray-600 dark:text-gray-300"><strong>Author:</strong> {book.author}</p>
                              <p className="text-gray-500 dark:text-gray-400"><strong>Published:</strong> {new Date(book.publishedAt).toLocaleDateString()}</p>
                              <p className="mt-2 text-sm text-gray-400">Book ID: {book.id}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-300">No issued books</p>
                      )}
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AllCustomer;
