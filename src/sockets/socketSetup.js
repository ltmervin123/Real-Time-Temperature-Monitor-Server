import { Server } from "socket.io";

export default class socketSetup {
  constructor(server, corsOptions) {
    this.io = new Server(server, {
      cors: corsOptions,
      maxHttpBufferSize: 5e6,
      pingTimeout: 120000,
      pingInterval: 30000,
    });

    this.setupSocketEvents();
  }

  setupSocketEvents() {
    this.io.on("connection", (socket) => {
      console.log("New client connected:", socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected:", socket.id);
      });
    });
  }

  // Expose method to emit temperature updates
  broadcastTemperature(temp) {
    this.io.emit("temperature", temp);
  }
}
