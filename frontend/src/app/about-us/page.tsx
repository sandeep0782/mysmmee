"use client";
import React from "react";
import { BookOpen, Users, ShieldCheck } from "lucide-react"; // Importing icons from Lucide

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">About Us</h1>
        <p className="text-gray-600 text-lg text-center mb-12">
          Welcome to MYSMME, your ultimate destination for online Shopping Solution.
        </p>

        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <BookOpen className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">
              Our Mission
            </h2>
            <p className="text-gray-600 text-center">
              At MYSMME, we aim to make fashion accessible to everyone by
              providing a platform where people can buy fashion items online easily.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">
              Our Community
            </h2>
            <p className="text-gray-600 text-center">
              We believe in building a community of Fashion lovers who can share
              their passion for fashion while promoting eco-friendly practices.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105">
            <div className="flex items-center justify-center mb-4">
              <ShieldCheck className="w-12 h-12 text-primary" />
            </div>
            <h2 className="text-xl font-semibold text-center mb-4">
              Our Commitment
            </h2>
            <p className="text-gray-600 text-center">
              We are committed to providing a secure platform for transactions
              and ensuring customer satisfaction at every step.
            </p>
          </div>
        </div>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-white">
          <h2 className="text-3xl font-bold text-center mb-8">
            Why Choose MYSMME?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
            <div className="bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">📚</span>
              </div>
              <h3 className="font-semibold text-lg text-center mb-2">
                Wide Range of Products
              </h3>
              <p className="text-gray-600 text-center">
                Thousands of new fashion products available at your fingertips.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">📝</span>
              </div>
              <h3 className="font-semibold text-lg text-center mb-2">
                Easy Listing
              </h3>
              <p className="text-gray-600 text-center">
                Sell your brand's products in just a few clicks.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">🔒</span>
              </div>
              <h3 className="font-semibold text-lg text-center mb-2">
                Secure Transactions
              </h3>
              <p className="text-gray-600 text-center">
                Safe payment methods ensure your peace of mind.
              </p>
            </div>

            <div className="bg-gray-100 rounded-lg p-6 shadow-lg transition-transform transform hover:scale-105">
              <div className="flex items-center justify-center mb-4">
                <span className="text-primary text-4xl">🤝</span>
              </div>
              <h3 className="font-semibold text-lg text-center mb-2">
                Community Driven
              </h3>
              <p className="text-gray-600 text-center">
                Join a community of fashion creator who lives for fashion.
              </p>
            </div>
          </div>
        </section>

        {/* Images Section */}
        <div className="mt-16 flex flex-col md:flex-row gap-4 items-center mb-4">
          <img
            src="/images/book1.jpg"
            alt="Books"
            className="w-full md:w-[600px] rounded-lg shadow-md mb-4 md:mb-0"
          />
          <img
            src="/images/book2.jpg"
            alt="Reading"
            className="w-full md:w-[600px] rounded-lg shadow-md"
          />
        </div>
        <h2 className="text-xl font-semibold text-center mb-4">
          Join Us Today!
        </h2>
        <p className="text-gray-600 text-lg text-center mb-8">
          Sign up now to start selling your brand's product on
          MYSMME!
        </p>

        <div className="flex justify-center">
          <a
            href="/"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition duration-300"
          >
            Get Started
          </a>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
