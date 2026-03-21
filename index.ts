import express from "express";

const app = express();
app.use(express.json());

// اختبار أن السيرفر شغال
app.get("/", (req, res) => {
    res.send("Bot is running 🚀");
});

// هنا تستقبل رسائل Telegram (Webhook)
app.post("/", (req, res) => {
    console.log(req.body);
    res.send("ok");
});

// أهم شيء: PORT من Railway
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server started on port " + PORT);
});