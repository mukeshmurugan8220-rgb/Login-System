const allowedOrigins = [
  "http://localhost:5173",
  "https://login-system-p2cpstg2y-mukesh-s-projects13.vercel.app",
  "https://login-system-red-ten.vercel.app",
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);