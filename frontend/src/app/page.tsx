"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NewBooks from "@/app/Homepage/NewBooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import ShopByCategory from "./Homepage/ShopByCategory";
import ShopByBrands from "./Homepage/ShopByBrands";
import NewBanners from "./Homepage/NewBanners";

// Define banner type
interface Banner {
  _id: string;
  title?: string;
  subtitle?: string;
  imageUrl: string;
  link?: string;
  position?: number;
  isActive?: boolean;
}

export default function Homepage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentImage, setCurrentImage] = useState(0);
  const user = useSelector((state: RootState) => state.user.user);
  const router = useRouter();

  // Redirect admins to admin dashboard
  useEffect(() => {
    if (user && user.role !== "user") {
      router.push("/admin");
    }
  }, [user, router]);

  // Fetch banners from backend
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/banners`,
        );
        const data = await res.json();
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

        if (res.ok) {
          // Only use active banners and sort by position
          const activeBanners = (data.data || []).filter(
            (b: Banner) => b.isActive,
          );
          activeBanners.sort(
            (a: Banner, b: Banner) => (a.position || 0) - (b.position || 0),
          );
          setBanners(activeBanners);
        } else {
          console.error("Failed to fetch banners:", data.message);
        }
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    };

    fetchBanners();
  }, []);

  // Carousel auto-rotate
  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % banners.length);
    }, 5000); // 5 seconds
    return () => clearInterval(timer);
  }, [banners]);

  const currentBanner = banners[currentImage];

  return (
    <main className="min-h-screen">
      {/* Hero / Banner Section */}
      <NewBanners />

      {/* shop By Category Section */}
      <ShopByCategory />

      {/* Newly Added Books Section */}
      <NewBooks />

      {/* shop By Category Section */}
      {/* <ShopByBrands /> */}
      <div className="flex items-center">
        <Link
          href="/products"
          className="inline-flex mt-10 mb-10 mx-auto items-center justify-center bg-primary hover:bg-primary_hover text-white px-8 py-4 rounded-xl text-sm transition"
        >
          Explore All Products
        </Link>
      </div>
    </main>
  );
}
