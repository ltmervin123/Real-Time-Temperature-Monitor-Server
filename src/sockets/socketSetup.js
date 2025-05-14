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

  setupSocketEvents() {}
}
