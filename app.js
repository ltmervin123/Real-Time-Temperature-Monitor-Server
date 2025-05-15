// IMPORTS
import express from "express";
import cors from "cors";
import socketSetup from "./src/sockets/socketSetup.js";
import { createServer } from "http";
import { SerialPort } from "serialport";
import { ReadlineParser } from "@serialport/parser-readline";

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

// SERIAL CONNECTION SET UP
const serial = new SerialPort({
  path: "COM3",
  baudRate: 9600,
});

const parser = serial.pipe(new ReadlineParser({ delimiter: "\n" }));

parser.on("data", (line) => {
  const temperature = parseFloat(line.trim()).toFixed(1);
  if (!isNaN(temperature)) {
    console.log(`TEMP: ${temperature}`);
    socket.broadcastTemperature(temperature);
  }
});

serial.on("error", (err) => {
  console.error("Serial Port Error:", err.message);
});

// MOCK TEMP
const generateMockTemp = () => {
  const MIN = 20;
  const MAX = 35;
  return Math.random() * (MAX - MIN) + MIN;
};

// SERVER LOGIC
const startServer = async () => {
  try {
    server.listen(PORT, () => {
      console.log(`Server is running on ${URL}:${PORT}`);
      console.log(`Frontend is available at `, allowOrigin);
      console.log("Socket.IO server is ready");
    });

    // EMIT MOCK TEMP EVERY 5 SECONDS
    // setInterval(() => {
    //   const temperature = generateMockTemp().toFixed(1);
    //   console.log("MOCK TEMP: ", temperature);
    //   socket.broadcastTemperature(temperature);
    // }, 1000);
  } catch (error) {
    console.log("Error starting server", error.message);
  }
};

// START THE SERVER
startServer();
