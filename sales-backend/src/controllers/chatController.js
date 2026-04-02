const prisma = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @route   GET /api/v1/chats
// @desc    Get all job-related chats for the current worker
const getChats = async (req, res) => {
    try {
        const chats = await prisma.chats.findMany({
            where: {
                jobs: {
                    workerId: req.user.id
                }
            },
            include: {
                jobs: {
                    include: {
                        customer: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                                isAvailable: true
                            }
                        }
                    }
                }
            },
            orderBy: {
                updated_at: 'desc'
            }
        });

        const formatted = chats.map(chat => ({
            id: chat.id,
            jobId: chat.job_id,
            customerName: chat.jobs.customer.name,
            lastMessage: chat.last_message,
            time: chat.updated_at,
            status: chat.jobs.customer.isAvailable ? 'online' : 'offline',
            service: chat.jobs.categoryName,
            leadId: chat.jobs.jobNo
        }));

        res.status(200).json({ success: true, count: formatted.length, data: formatted });
    } catch (error) {
        console.error("Fetch Chats Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET /api/v1/chats/:chatId/messages
// @desc    Get messages for a specific job chat
const getMessages = async (req, res) => {
    try {
        const { chatId } = req.params;

        const chat = await prisma.chats.findUnique({
            where: { id: chatId },
            include: { jobs: true }
        });

        if (!chat || chat.jobs.workerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized for this chat' });
        }

        const messages = await prisma.messages.findMany({
            where: { chat_id: chatId },
            orderBy: { created_at: 'asc' },
            include: { users: { select: { name: true, role: true } } }
        });

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        console.error("Fetch Messages Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST /api/v1/chats/:chatId/messages
// @desc    Send a message to a job chat
const sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { text } = req.body;

        const chat = await prisma.chats.findUnique({
            where: { id: chatId },
            include: { jobs: true }
        });

        if (!chat || chat.jobs.workerId !== req.user.id) {
            return res.status(403).json({ success: false, message: 'Not authorized for this chat' });
        }

        const message = await prisma.messages.create({
            data: {
                id: uuidv4(),
                chat_id: chatId,
                sender_id: req.user.id,
                text,
                created_at: new Date()
            }
        });

        // Parse for status updates
        const msgText = text.toLowerCase();
        let newStatus = null;

        if (msgText.includes("on the way")) newStatus = 'ON_THE_WAY';
        else if (msgText.includes("start work") || msgText.includes("started")) newStatus = 'STARTED';
        else if (msgText.includes("completed") || msgText.includes("finished") || msgText.includes("job done")) newStatus = 'COMPLETED';

        let lastMessageText = text;
        if (newStatus) {
            await prisma.job.update({
                where: { id: chat.job_id },
                data: { status: newStatus }
            });
            lastMessageText = `[Update: ${newStatus}] ${text}`;
        }

        await prisma.chats.update({
            where: { id: chatId },
            data: { 
                last_message: lastMessageText,
                updated_at: new Date()
            }
        });

        res.status(201).json({ success: true, data: message, jobStatusUpdated: !!newStatus });
    } catch (error) {
        console.error("Send Message Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   GET /api/v1/chats/direct/:otherUserId
const getDirectMessages = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const myId = req.user.id;

        const [u1, u2] = [myId, otherUserId].sort();

        let conversation = await prisma.conversations.findUnique({
            where: { user1_id_user2_id: { user1_id: u1, user2_id: u2 } },
            include: { 
                direct_messages: { orderBy: { created_at: 'asc' } },
                users_conversations_user1_idTousers: { select: { name: true, role: true } },
                users_conversations_user2_idTousers: { select: { name: true, role: true } }
            }
        });

        if (!conversation) {
            conversation = await prisma.conversations.create({
                data: { 
                    id: uuidv4(),
                    user1_id: u1, 
                    user2_id: u2,
                    updated_at: new Date()
                },
                include: { 
                    direct_messages: true,
                    users_conversations_user1_idTousers: { select: { name: true, role: true } },
                    users_conversations_user2_idTousers: { select: { name: true, role: true } }
                }
            });
        }

        res.status(200).json({ success: true, data: conversation });
    } catch (error) {
        console.error("Direct Messages Error:", error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// @route   POST /api/v1/chats/direct/:otherUserId
const sendDirectMessage = async (req, res) => {
    try {
        const { otherUserId } = req.params;
        const { text } = req.body;
        const myId = req.user.id;

        const [u1, u2] = [myId, otherUserId].sort();

        let conversation = await prisma.conversations.upsert({
            where: { user1_id_user2_id: { user1_id: u1, user2_id: u2 } },
            update: { last_message: text, updated_at: new Date() },
            create: { 
                id: uuidv4(),
                user1_id: u1, 
                user2_id: u2, 
                last_message: text,
                updated_at: new Date()
            }
        });

        const message = await prisma.direct_messages.create({
            data: {
                id: uuidv4(),
                conversation_id: conversation.id,
                sender_id: myId,
                text,
                created_at: new Date()
            }
        });

        res.status(201).json({ success: true, data: message });
    } catch (error) {
        console.error("Direct Send Error:", error);
        res.status(500).json({ success: false, message: 'Server error: ' + error.message });
    }
};

module.exports = {
    getChats,
    getMessages,
    sendMessage,
    getDirectMessages,
    sendDirectMessage
};
