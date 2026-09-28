import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin:
                process.env.FRONTEND_URL ||
                "http://localhost:5173",
            methods: ["GET", "POST"],
        },
    });

    io.on("connection", (socket) => {
        console.log("🔌 Socket connected:", socket.id);

        // Join a room for a particular show
        socket.on("join-show", (showId) => {
            const room = `show:${showId}`;

            socket.join(room);

            console.log(
                `👤 ${socket.id} joined ${room}`
            );
        });

        // Leave show room
        socket.on("leave-show", (showId) => {
            const room = `show:${showId}`;

            socket.leave(room);

            console.log(
                `👋 ${socket.id} left ${room}`
            );
        });

        socket.on("disconnect", () => {
            console.log(
                "❌ Socket disconnected:",
                socket.id
            );
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
};