const Message = require("../models/Message");

const { StatusCodes } = require("http-status-codes");
const getMessage = async (req, res) => {

  try {
    const message = await Message.find().sort({'timestamp': 1});

    res.status(StatusCodes.OK).json({ message, count: message.length });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

const deleteMessage = async (req, res) => {

  try {
    const message = await Message.deleteMany({})

    res.status(StatusCodes.OK).json({ message: "deleted all data" });
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
};

module.exports = {
  getMessage,
  deleteMessage,
};
