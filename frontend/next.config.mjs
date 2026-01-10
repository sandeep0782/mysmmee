/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "lh3.googleusercontent.com",
      "res.cloudinary.com",
      "images.unsplash.com",
      "media.istockphoto.com",
      "modelink.s3.eu-north-1.amazonaws.com",
      'modelink.s3.eu-north-1.amazonaws.com',
    ],
  },
};

export default nextConfig;
