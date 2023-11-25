require("dotenv").config();
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");

const cors = require("cors");

const app = express();

app.use(cors());

// enable CORS requests
const allowCrossDomain = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,PATCH,DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
};
app.use(allowCrossDomain);


const server = http.createServer(app);
const io = socketIO(server, {
  pingTime: 60000,
  cors: {
    origin: "http://127.0.0.1:5500",
  },
});

// MongoDB connection
const connectDB = require("./db/connect");


// OpenAI API setup
const openai = require("./config/openAi");

const Message = require("./models/Message");

app.get("/", (req, res) => {
  res.send("Hello world");
});

//route to get and delete messages
const messsageRoute= require('./routes/messageRoute')
app.use('/api/v1',messsageRoute)


// Socket.io communication
io.on("connection", (socket) => {
  console.log("A user connected");

  // Event when a user asks a question
  socket.on("ask-question", async (data) => {
    try {
      const { message } = data;

      // Save user message to MongoDB
      const userMessage = new Message({ sender: "User", message });
      await userMessage.save();

      // Make a request to OpenAI API
      const completion = await openai.default.chat.completions.create({
        messages: [{ role: "user", content: message }],
        model: "gpt-3.5-turbo",
      });
      // console.log(completion);
      const answer = completion.choices[0].message;

      // Save bot response to MongoDB
      console.log(answer);
      const botMessage = new Message({
        sender: "Bot",
        message: answer.content,
      });
      await botMessage.save();

      // Emit bot response to frontend
      io.emit("bot-response", { answer });
    } catch (err) {
      console.error("Error asking OpenAI:", err);
    }
  });

  // Event when a user disconnects
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Server listening on port 3000
server.listen(process.env.PORT, async () => {
  await connectDB(process.env.MONGO_URI);
  console.log("connected to MongoDB");
  console.log(`Server running on port ${process.env.PORT}`);
});
