const production = {
  API_URL: "https://streammap.onrender.com",
  FRONTEND_URL: "https://streammap-frontend.onrender.com",
};

const development = {
  API_URL: "http://localhost:3000",
  FRONTEND_URL: "http://localhost:5173",
};

export const config =
  process.env.NODE_ENV === "production" ? production : development;
