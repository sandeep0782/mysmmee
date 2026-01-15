import cors from "cors";

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
];

// Dynamic CORS options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (like Postman or server-to-server)
    if (!origin) return callback(null, true);

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    }
  },
  credentials: true, // allow cookies and authorization headers
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], // allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // allowed headers
};

export default corsOptions;
