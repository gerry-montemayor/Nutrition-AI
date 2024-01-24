import { OpenAI } from "openai"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import path from "path";
import chatGPTApiKey from "./config.js"

const myApiKey = chatGPTApiKey;

const openai = new OpenAI({
  apiKey: `${myApiKey}`
});

const app = express();
app.use(express.static('public'));

const port = 3000;

app.use(bodyParser.json());
app.use(cors());


const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
app.use(express.static('public'));

app.use(express.static(path.join(__dirname, "public")));


app.post("/", async (req, res) => {
  const { messages } = req.body;
  
  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      // { role: "user", content: `${message}` },
      { "role": "system", "content": "You are NutritionGPT, a helpful nutrition advice assistant chatbot." },
      ...messages
    ],

  });

  res.json({
    completion: chatCompletion.choices[0].message
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});