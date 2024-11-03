"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = "Token_secret";
const app = (0, express_1.default)();
app.use(express_1.default.json());
const cors = require('cors');
app.use(cors());
let transactions = [];
// Endpoint to initiate HDFC onRamp transaction
app.post("/api/HDFC/initiate-onramp", (req, res) => {
    const { userId, amount } = req.body;
    const payload = {
        userId: userId,
        amount: amount
    };
    // Generate token and direct it to the netbanking API
    const token = jsonwebtoken_1.default.sign(payload, JWT_SECRET, { algorithm: 'HS256', expiresIn: '1hr' });
    const transaction = { userId, amount, token, status: "pending" };
    transactions.push(transaction);
    res.json({
        token,
        netBankingUrl: `http://localhost:5173?token=${token}`
    });
});
// Endpoint to initiate SBI onRamp transaction
app.post("/api/SBI/initiate-onramp", (req, res) => {
    const { userId, amount } = req.body;
    // Generate token and direct it to the netbanking API
    const token = `txn_${Math.random().toString(36).substring(2, 20)}`;
    const transaction = { userId, amount, token, status: "pending" };
    transactions.push(transaction);
    res.json({
        token,
        netBankingUrl: `http://localhost:5173?token=${token}`
    });
});
// Start server on port 3002
app.listen(3002, () => {
    console.log("Server is running on port 3002");
});
