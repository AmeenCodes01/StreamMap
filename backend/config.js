const production = {
  FRONTEND_URL: "https://streammap-frontend.onrender.com",
};

const development = {
  FRONTEND_URL: "http://localhost:5173",
};

const config = process.env.NODE_ENV === "production" ? production : development;

export default config;
