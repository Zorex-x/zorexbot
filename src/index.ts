import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;

// اختبار
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

// استقبال رسائل Telegram
app.post("/", async (req, res) => {
  try {
    const message = req.body.message;

    if (message) {
      const chatId = message.chat.id;
      const text = message.text || "بدون نص";

      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: "وصلت رسالتك: " + text
      });
    }

    res.send("ok");
  } catch (error) {
    console.error(error);
    res.send("error");
  }
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
