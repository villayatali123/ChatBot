const Message = require("../models/Message");
const openai = require("../config/openAi");
const { StatusCodes } = require("http-status-codes");

const fetchMessage = async (req, res) => {
  try {
    const message = await Message.find().sort({ timestamp: 1 });

    res.status(StatusCodes.OK).json({ message, count: message.length });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.deleteMany({});

    res.status(StatusCodes.OK).json({ message: "deleted all data" });
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.BAD_REQUEST).send(error);
  }
};

const getMessage = async (req, res) => {
  try {
    console.log("=====>",req.body);
    const { userPrompt } = req.body;
    if(!userPrompt)
    {
      return res.send("Please provide userPrompt")
    }
    // Make a request to OpenAI API
    const completion = await openai.default.chat.completions.create({
      messages: [{ role: "user", content: userPrompt }],
      model: "gpt-3.5-turbo",
    });

    const answer = completion.choices[0].message;
    res.status(StatusCodes.OK).json({ answer });
  } catch (err) {
    console.error("Error asking OpenAI:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "Error asking OpenAI" });
  }
};
module.exports = {
  fetchMessage,
  deleteMessage,
  getMessage,
};
