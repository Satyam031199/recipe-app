import dotenv from "dotenv";
dotenv.config({quiet: true});

console.log("NODE_ENV: ", process.env.NODE_ENV);
export const config = {
  port: process.env.PORT || 5001,
  databaseUrl: process.env.DATABASE_URL,
  nodeEnv: process.env.NODE_ENV || "development",
  apiUrl: process.env.API_URL,
};