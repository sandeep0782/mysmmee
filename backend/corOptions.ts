import cors from "cors";

const isProd = process.env.NODE_ENV === "production";

const allowedOrigins = isProd
  ? [process.env.FRONTEND_URL!, process.env.ADMIN_URL!]
  : ["http://localhost:3000", "http://localhost:5000"];

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // allow Postman / server-to-server

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

export default corsOptions;
