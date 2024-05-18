import { Server } from "socket.io";

const socket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL,
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("User connected");

        // Handle incoming messages
        socket.on("sendMessage", (message) => {
            console.log(`Message received: ${message}`);
            io.emit("receiveMessage", message);
        });

        // Handle disconnection
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};

export default socket;
