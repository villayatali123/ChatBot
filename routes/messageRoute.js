const express = require("express");

const router = express.Router();

const { getMessage, deleteMessage } = require("../controllers/messages");

router.get("/getMessages", getMessage);
router.delete("/deleteMessages", deleteMessage);

module.exports = router;
