"use client"

import React from "react"
import { FaFacebookF, FaTwitter, FaYoutube, FaInstagram } from "react-icons/fa"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between gap-8">
        
        {/* Company Info */}
        <div className="flex flex-col gap-4">
          <h2 className="text-2xl font-bold text-white">Bookerea</h2>
          <p className="text-gray-400 max-w-sm">
            Bookerea is your go-to platform for authors, customers, and admins to manage and explore books seamlessly.
          </p>
          <div className="flex gap-4 mt-2">
            <a href="#" aria-label="Facebook" className="hover:text-blue-500 transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" aria-label="YouTube" className="hover:text-red-500 transition">
              <FaYoutube size={20} />
            </a>
            <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition">
              <FaInstagram size={20} />
            </a>
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-white">Company</h3>
            <a href="#" className="hover:text-white transition">About us</a>
            <a href="#" className="hover:text-white transition">Contact</a>
            <a href="#" className="hover:text-white transition">Jobs</a>
            <a href="#" className="hover:text-white transition">Press kit</a>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-white">Support</h3>
            <a href="#" className="hover:text-white transition">Help Center</a>
            <a href="#" className="hover:text-white transition">Terms of Service</a>
            <a href="#" className="hover:text-white transition">Privacy Policy</a>
          </div>
          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-white">Resources</h3>
            <a href="#" className="hover:text-white transition">Blog</a>
            <a href="#" className="hover:text-white transition">Guides</a>
            <a href="#" className="hover:text-white transition">Partners</a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-12 border-t border-gray-700 pt-6 text-center text-gray-500 text-sm">
        &copy; {currentYear} Bookerea. All rights reserved.
      </div>
    </footer>
  )
}
