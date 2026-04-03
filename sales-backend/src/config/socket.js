const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const prisma = require("./db");
const { getJwtSecret } = require("./env");
const { v4: uuidv4 } = require('uuid');

let io;

const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    console.log("✅ Socket.io initialized");

    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token || socket.handshake.query.token;
        const sessionToken = socket.handshake.auth.sessionToken || socket.handshake.query.sessionToken;

        if (token) {
            try {
                const decoded = jwt.verify(token, getJwtSecret());
                const user = await prisma.user.findUnique({ where: { id: decoded.id } });
                if (user) {
                    socket.user = user;
                    return next();
                }
            } catch (err) {
                console.error("Socket JWT error:", err);
            }
        }

        if (sessionToken) {
            const lead = await prisma.lead.findUnique({
                where: { sessionToken: sessionToken },
                include: { job: true }
            });
            if (lead) {
                socket.guest = { 
                    token: sessionToken, 
                    leadId: lead.id, 
                    jobId: lead.job?.id,
                    name: lead.guestName || "Customer"
                };
                return next();
            }
        }

        return next(new Error("Authentication failed: No valid token or session provided"));
    });

    io.on("connection", (socket) => {
        console.log(`🔌 Connection: ${socket.id} | Identity: ${socket.user ? socket.user.name : "Guest (" + socket.guest.name + ")"}`);

        socket.on("join_chat", (jobId) => {
            // Basic validation: guest can only join their assigned job's chat
            if (socket.guest && socket.guest.jobId !== jobId) {
                console.warn(`🚫 Unauthorized join attempt by Guest to room ${jobId}`);
                return;
            }
            socket.join(jobId);
            console.log(`👥 ${socket.id} joined room: ${jobId}`);
        });

        socket.on("send_message", async (data) => {
            const { jobId, text, chatId } = data;
            if (!text || !chatId || !jobId) return;

            try {
                const message = await prisma.messages.create({
                    data: {
                        id: uuidv4(),
                        chat_id: chatId,
                        sender_id: socket.user ? socket.user.id : null,
                        isGuest: !!socket.guest,
                        text: text,
                        created_at: new Date()
                    }
                });

                await prisma.chats.update({
                    where: { id: chatId },
                    data: {
                        last_message: text,
                        updated_at: new Date()
                    }
                });

                // Broadcast to room
                io.to(jobId).emit("new_message", {
                    ...message,
                    senderName: socket.user ? socket.user.name : "Customer"
                });

                console.log(`✉️ Message from ${socket.user ? socket.user.name : "Guest"} in ${jobId}: ${text}`);

            } catch (err) {
                console.error("❌ Socket message processing error:", err);
            }
        });

        socket.on("disconnect", () => {
            console.log(`🔌 Disconnected: ${socket.id}`);
        });
    });

    return io;
};

const getIO = () => {
    if (!io) throw new Error("Socket.io not initialized!");
    return io;
};

module.exports = { initSocket, getIO };
