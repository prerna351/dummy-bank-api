
const express = require('express');
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors());

const JWT_SECRET = "Token_secret";
const secretKey = "hdfc_secret_key";



app.post("/sendWebhookRequest", async(req, res) => {
    
    try{
        const token = req.body;
        if (!token) {
          return res.status(400).json({ error: "Token is missing" });
        }
        const decodedToken = jwt.verify(token, JWT_SECRET) ;
        const userId = decodedToken.userId;
        const amount = decodedToken.amount; 
  
        // hit the bank webhook to update the database 
        const response = await axios.post("http://localhost:3003/hdfcWebhook",{
          token,
          userId,
          amount
        }
        );
  
        if (response.status === 200) {
          
          console.log('Webhook response:', response.data);
          return res.status(200).json({
            msg: "i am in hdfc netbanking backend"
          })
      }
      }catch(e){
        console.error('Error sending webhook request');
        
      }
    }
)

app.listen(3004, () => {
    console.log("hdfc Server running on port 3004");
  });