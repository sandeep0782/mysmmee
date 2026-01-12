import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Youtube } from "lucide-react";
import { Shield, Clock, HeadphonesIcon } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="w-[95%] mx-auto px-4 py-12">
        <div className="grid gap-12 md:grid-cols-4">
          {/* ONLINE SHOPPING */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white uppercase">
              Online Shopping
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/men" className="hover:text-white">
                  Men
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover:text-white">
                  Women
                </Link>
              </li>
              <li>
                <Link href="/kids" className="hover:text-white">
                  Kids
                </Link>
              </li>
              <li>
                <Link href="/home" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/genz" className="hover:text-white">
                  GenZ
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="hover:text-white">
                  Gift Cards
                </Link>
              </li>
              <li>
                <Link href="/insider" className="hover:text-white">
                  My MYSMME
                </Link>
              </li>
            </ul>
          </div>
          {/* USEFUL LINKS */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white uppercase">
              Useful Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="hover:text-white">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-white">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-white">
                  Site Map
                </Link>
              </li>
              <li>
                <Link href="/corporate" className="hover:text-white">
                  Corporate Information
                </Link>
              </li>
              <li>
                <Link href="/whitehat" className="hover:text-white">
                  Whitehat
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-use" className="hover:text-white">
                  Terms of Use
                </Link>
              </li>
            </ul>
          </div>

          {/* CUSTOMER POLICIES */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white uppercase">
              Customer Policies
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="hover:text-white">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white">
                  T&amp;C
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white">
                  Shipping
                </Link>
              </li>
              <li>
                <Link href="/cancellation" className="hover:text-white">
                  Cancellation
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white">
                  Returns
                </Link>
              </li>

              <li>
                <Link href="/grievance" className="hover:text-white">
                  Grievance Redressal
                </Link>
              </li>
            </ul>
          </div>

          {/* APP & CONTACT */}
          <div>
            <h3 className="mb-4 text-base font-semibold text-white uppercase">
              {/* Experience the App */}
              Mobile App is under Development
            </h3>
            <p className="mb-4">Shop anytime, anywhere with our mobile app.</p>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="hover:opacity-80">
                <img
                  src="/icons/google.png"
                  alt="Google Play"
                  className="h-10"
                />
              </a>
              <a href="#" className="hover:opacity-80">
                <img
                  src="/icons/apple_store.png"
                  alt="App Store"
                  className="h-10"
                />
              </a>
            </div>

            <h3 className="mb-2 text-base font-semibold text-white uppercase">
              Keep in Touch with
            </h3>
            <div className="flex space-x-4 text-gray-600 items-center">
              <a href="#" aria-label="Facebook" className="hover:text-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" aria-label="Twitter" className="hover:text-blue-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" aria-label="Instagram" className="hover:text-pink-500 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" aria-label="YouTube" className="hover:text-red-600 transition-colors">
                <Youtube size={25} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-12 border-t border-gray-700 pt-6 text-xs text-gray-500">
          <p className="mb-2">
            100% original guarantee for all products | Return within 7 days of
            delivery
          </p>
          {/* <p className="mb-2">
            © 2025 www.mysmme.com. All rights reserved. Inspired by Vocal for
            Local.
          </p> */}
          <p className="mb-2">
            Registered Office Address: Shankar Vihar, New Palam VIhar, Sector-110, Gurugram-Haryana-122001 ,
            India
          </p>
          <p className="mb-2">CIN: UNDERCOMPANYCREATION235356 | Phone: +91-9650070010</p>
        </div>


        <div className="mt-12  border-t border-gray-700 pt-8 flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} www.mysmme.com. All rights reserved. Inspired by Vocal for
            Local.
          </p>
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-8">
              <Image src="/icons/visa.svg" alt="Visa" fill className="object-contain filter brightness-20 invert" />
            </div>
            <div className="relative w-12 h-8">
              <Image src="/icons/rupay.svg" alt="Rupay" fill className="object-contain filter brightness-20 invert" />
            </div>
            <div className="relative w-12 h-8">
              <Image src="/icons/paytm.svg" alt="Paytm" fill className="object-contain" />
            </div>
            <div className="relative w-12 h-8">
              <Image src="/icons/upi.svg" alt="Upi" fill className="object-contain filter brightness-20 invert" />
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
}
