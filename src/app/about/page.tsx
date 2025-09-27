'use client';

import React from "react";
import { motion } from "framer-motion";
import { FaBook, FaUsers, FaCode } from "react-icons/fa";

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 text-gray-800">
      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="text-center py-12"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          About Our Library Management System
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
          A modern platform built to manage books, readers, and knowledge effortlessly.  
          Streamlining publishing, exploring, and issuing books all in one place.
        </p>
      </motion.header>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-3 gap-8">
        {[
          {
            icon: <FaBook className="text-blue-600 w-10 h-10" />,
            title: "Explore Books",
            desc: "Browse published books with detailed information and request issues instantly.",
          },
          {
            icon: <FaUsers className="text-purple-600 w-10 h-10" />,
            title: "Issued Books",
            desc: "Track your issued books and access them anytime with just one click.",
          },
          {
            icon: <FaCode className="text-green-600 w-10 h-10" />,
            title: "Tech Powered",
            desc: "Built using Next.js, TailwindCSS, Prisma, and modern APIs for speed and security.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 text-center"
          >
            <div className="flex justify-center mb-4">{item.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
            <p className="text-gray-600">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Mission Statement */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white py-16 px-6 text-center"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Our Mission
        </h2>
        <p className="max-w-3xl mx-auto text-lg">
          We aim to simplify library management by providing a seamless, user-friendly,
          and scalable solution that empowers students, authors, and institutions to
          manage books effortlessly.
        </p>
      </motion.section>

      {/* Footer */}
      <footer className="text-center py-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} Library Management System. Built with ❤️ using Next.js.
      </footer>
    </div>
  );
};

export default AboutPage;
