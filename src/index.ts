import express, { Request, Response } from "express"; 
import jwt from 'jsonwebtoken'

const JWT_SECRET = "Token_secret";

const app = express();
app.use(express.json());
const cors = require('cors');

app.use(cors());

interface Transaction {
    userId: string;
    amount: number;
    token: string;
    status: "pending" | "success" | "failed";
}

let transactions: Transaction[] = [];

// Endpoint to initiate HDFC onRamp transaction
app.post("/api/HDFC/initiate-onramp", (req: Request, res: Response) => {
    const { userId, amount } = req.body as { userId: string; amount: number };
    const payload = {
        userId:userId,
        amount: amount
    }
    // Generate token and direct it to the netbanking API
    const token = jwt.sign(payload, JWT_SECRET,{algorithm: 'HS256',expiresIn: '1hr'})
    const transaction: Transaction = { userId, amount, token, status: "pending" };
    transactions.push(transaction);

    res.json({
        token,
        netBankingUrl: `http://localhost:5173?token=${token}`
    });
});

// Endpoint to initiate SBI onRamp transaction
app.post("/api/SBI/initiate-onramp", (req: Request, res: Response) => {
    const { userId, amount } = req.body as { userId: string; amount: number };

    // Generate token and direct it to the netbanking API
    const token = `txn_${Math.random().toString(36).substring(2, 20)}`;
    const transaction: Transaction = { userId, amount, token, status: "pending" };
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
