import express from "express";
import dotenv from "dotenv";

import cors from "cors";
import authRoutes from "./routes/authRoute";
import productRoutes from "./routes/productRoute";
import cartRoutes from "./routes/cartRoute";
import wishlistRoutes from "./routes/wishListRoute";
import orderRoutes from "./routes/orderRoute";
import addressRoute from "./routes/addressRoute";
import userRoute from "./routes/userRoute";
import adminRoute from "./routes/adminRoute";
import connectDB from "./config/dbConfig";
import passport from "./controllers/strategy/google.strategy";
import cookieParser from "cookie-parser";
import brandRoutes from "./routes/brandRoutes";
import colorRoutes from "./routes/colorRoutes";
import categoryRoutes from "./routes/categoryRoutes";
import seasonRoutes from "./routes/seasonRoutes";
import corsOptions from "./corOptions";
import importRoutes from "./routes/importProductRoutes"; // make sure the path is correct
import importUserRoutes from "./routes/importUserRoutes";
import bannerRoutes from "./routes/bannerRoutes";
import advertiseRoutes from "./routes/advertiseRoutes";
import path from "path";
import "./services/cron"; // ✅ make sure cron runs
import articleTypeRoutes from "./routes/articleTypeRoutes";

dotenv.config();

const app = express();

// Middleware
// const corsOptions = {
//     origin:process.env.FRONTEND_URL,
//     credentials: true,
// }
app.options("*", cors(corsOptions)); // handle preflight
app.use(cors(corsOptions));
app.use(express.json());
app.use(passport.initialize());
app.use(cookieParser());

// Connect to MongoDB
connectDB();

app.use("/public", express.static(path.join(__dirname, "public")));

// Test API route
// Add this **before your API routes**:
app.get("/", (req, res) => {
  res.send("Welcome to MYSMME backend! API is live ✅");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/address", addressRoute);
app.use("/api/users", userRoute);
app.use("/api/brands", brandRoutes);
app.use("/api/colors", colorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/articleTypes", articleTypeRoutes);
app.use("/api/season", seasonRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/admin", adminRoute);

app.use("/api", importRoutes); // Now POST /api/products/import works
app.use("/api", importUserRoutes);
app.use("/api/email-campaigns", advertiseRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;

// pm2 start index.ts --name project-backend --interpreter node --node-args="-r ts-node/register"
