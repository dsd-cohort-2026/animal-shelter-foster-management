const chatService = require('./chat.service');

exports.chat = async (req, res, next) => {
  try {
    const { messages } = req.body;
    const user = req.user;
    const reply = await chatService.chat(messages, user);
    res.status(200).json({ reply });
  } catch (error) {
    next(error);
  }
};
