const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/authMiddleware');
const { getChats, getMessages, sendMessage, getDirectMessages, sendDirectMessage } = require('../controllers/chatController');

router.use(protect);

router.get('/', getChats);
router.get('/direct/:otherUserId', getDirectMessages);
router.get('/:chatId/messages', getMessages);
router.post('/direct/:otherUserId', sendDirectMessage);
router.post('/:chatId/messages', sendMessage);

module.exports = router;
