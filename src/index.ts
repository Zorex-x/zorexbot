import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import Groq from "groq-sdk";
import { GoogleGenerativeAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;

// Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// اختبار
app.get("/", (req, res) => {
  res.send("Bot is running 🚀");
});

app.post("/", async (req, res) => {
  try {
    const message = req.body.message;

    if (message) {
      const chatId = message.chat.id;

      const text =
        message.text ||
        message.caption ||
        "مرحبا";

      let reply = "❌ حدث خطأ";

      // 🔥 أولاً: Groq
      try {
        const completion = await groq.chat.completions.create({
          messages: [{ role: "user", content: text }],
          model: "llama3-70b-8192"
        });

        reply =
          completion.choices[0]?.message?.content ||
          "لم أستطع الرد 😅";

      } catch (err) {
        console.log("Groq failed, using Gemini...");

        // 🔥 إذا فشل Groq → Gemini
        const result = await model.generateContent(text);
        const response = await result.response;
        reply = response.text();
      }

      // إرسال الرد
      await axios.post(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
        chat_id: chatId,
        text: reply
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
