// IMPORTS
import express from "express";
import cors from "cors";
import socketSetup from "./src/sockets/socketSetup.js";
import { createServer } from "http";

// CONSTANT
const app = express();
const PORT = 5000;
const URL = `http://localhost`;

// CORS configuration
const allowOrigin = "http://localhost:5173";
const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (allowOrigin.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
};
app.use(cors(corsOptions));

// HTTP SERVER
const server = createServer(app);

// SOCKET SETUP
const socket = new socketSetup(server, corsOptions);

// SERVER LOGIC
const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on ${URL}:${PORT}`);
      console.log(`Frontend is available at `, allowOrigin);
      console.log("Socket.IO server is ready");
    });
  } catch (error) {
    console.log("Error starting server", error.message);
  }
};

// START THE SERVER
startServer();
