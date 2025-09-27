"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function HeroSectionOne() {
  const router = useRouter();

  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center px-4">
      
      {/* Decorative Lines */}
      <div className="absolute inset-y-0 left-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute top-0 h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-y-0 right-0 h-full w-px bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute h-40 w-px bg-gradient-to-b from-transparent via-blue-500 to-transparent" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px w-full bg-neutral-200/80 dark:bg-neutral-800/80">
        <div className="absolute mx-auto h-px w-40 bg-gradient-to-r from-transparent via-blue-500 to-transparent" />
      </div>

      {/* Heading */}
      <div className="py-10 md:py-20 text-center">
        <h1 className="relative z-10 mx-auto max-w-4xl text-2xl font-bold text-slate-700 md:text-4xl lg:text-7xl dark:text-slate-300">
          {"Manage Your Library Efficiently, From Anywhere"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1, ease: "easeInOut" }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="relative z-10 mx-auto max-w-xl py-4 text-lg text-neutral-600 dark:text-neutral-400"
        >
          Track books, manage users, and automate library operations seamlessly
          with our all-in-one Library Management System. Save time, reduce
          errors, and provide an excellent experience for students and staff.
        </motion.p>

        {/* Call-to-Action Buttons */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            onClick={() => router.replace("/about")}
          >
            Explore Now
          </button>
          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>
      </div>

      {/* Animated Book Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="relative z-10 mt-20 flex flex-wrap justify-center gap-6"
      >
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.5 }}
            className="w-60 rounded-2xl border border-gray-300 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-900 hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-center mb-4">
              <div className="h-20 w-20 rounded-full bg-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                📚
              </div>
            </div>
            <h3 className="text-xl font-semibold text-center text-gray-800 dark:text-gray-200">
              Library Feature {i}
            </h3>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400 text-sm">
              Manage books, track users, and automate operations efficiently.
            </p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
