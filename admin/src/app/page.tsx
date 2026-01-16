import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, BarChart2, Shield } from "lucide-react"; // Lucide icons
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <img src="/images/logo.png" alt="MYSMME Logo" className="h-10 w-10 object-contain" />
            <h1 className="text-2xl font-bold text-red-700">MYSMME</h1>
          </div>

          <nav className="space-x-4">
            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600">Contact</a>
            <a href="/auth/login" className="text-blue-600 font-semibold">Login</a>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        {/* Hero Section */}
        <section
          className="text-white py-20"
          style={{ background: "linear-gradient(90deg, #ef4444 0%, #ec4899 50%, #8b5cf6 100%)" }}
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl font-bold mb-4">
              MYSMME is Empowering Small Businesses
            </h2>
            <p className="text-lg mb-6">
              Manage your MYSMME account efficiently with our simple and modern portal. Track, organize, and grow your business seamlessly.
            </p>
            <a
              href="/auth/register"
              className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-gray-100"
            >
              Register Today
            </a>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <h3 className="text-4xl font-bold mb-16 text-gray-800">Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-red-100 rounded-full">
                  <User className="w-8 h-8 text-red-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">User Management</h4>
                <p className="text-gray-600">
                  Add, edit, and manage users of your MSME platform with ease.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-pink-100 rounded-full">
                  <BarChart2 className="w-8 h-8 text-pink-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">Business Insights</h4>
                <p className="text-gray-600">
                  Get clear insights and analytics to grow your business smartly.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center bg-purple-100 rounded-full">
                  <Shield className="w-8 h-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold mb-3 text-gray-800">Secure Access</h4>
                <p className="text-gray-600">
                  Secure login and data protection for your business and users.
                </p>
              </div>

            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-gray-200 py-8 mt-auto">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p>&copy; {new Date().getFullYear()} MYSMME. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
