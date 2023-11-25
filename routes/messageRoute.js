const express = require("express");

const router = express.Router();

const { fetchMessage, deleteMessage , getMessage} = require("../controllers/messages");

router.get("/getMessages", fetchMessage);
router.delete("/deleteMessages", deleteMessage);
router.post("/ask-openai", getMessage);

module.exports = router;
