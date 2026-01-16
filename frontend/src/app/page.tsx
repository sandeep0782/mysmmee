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
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/banners`);
        const data = await res.json();
        if (res.ok) {
          // Only use active banners and sort by position
          const activeBanners = (data.data || []).filter((b: Banner) => b.isActive);
          activeBanners.sort((a: Banner, b: Banner) => (a.position || 0) - (b.position || 0));
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
      {currentBanner && (
        <section className="relative h-[600px] overflow-hidden">
          {banners.map((banner, index) => (
            <div
              key={banner._id}
              className={`absolute inset-0 transition-opacity duration-1000 ${currentImage === index ? "opacity-100" : "opacity-0"
                }`}
            >
              <Image
                src={banner.imageUrl}
                alt={banner.title || `Banner ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-black/50" />
            </div>
          ))}

          <div className="relative container mx-auto px-4 h-full flex flex-col items-center justify-center text-white text-center">
            {currentBanner.title && (
              <h1 className="text-4xl md:text-6xl font-bold mb-4">{currentBanner.title}</h1>
            )}
            {currentBanner.subtitle && (
              <p className="text-lg md:text-2xl mb-6">{currentBanner.subtitle}</p>
            )}

            {/* Button with banner link */}
            {currentBanner.link && (
              <Link href={currentBanner.link} className="mt-4 inline-block">
                <Button className="bg-white text-black px-6 py-3 rounded-lg hover:bg-gray-200 transition">
                  Explore
                </Button>
              </Link>
            )}
          </div>
        </section>
      )}


      {/* shop By Category Section */}
      <ShopByCategory />
      
      {/* Newly Added Books Section */}
      <NewBooks />

      {/* shop By Category Section */}
      <ShopByBrands />
      <Button
        size="lg"
        className="flex mt-10 mb-10 mx-auto bg-primary hover:bg-primary_hover px-8 py-6 rounded-xl"
      >
        <Link href="/products">
          <div className="text-sm ">Explore All Products</div>
        </Link>
      </Button>
    </main>
  );
}
