import { OpenAI } from "openai"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import chatGPTApiKey from "./config.js"

const __dirname = dirname(fileURLToPath(import.meta.url));

const openai = new OpenAI({
  apiKey: `${chatGPTApiKey}`
});

const app = express();
app.use(express.static('public'));

const port = 3000;

app.use(bodyParser.json());
app.use(cors());


app.use(express.urlencoded({ extended: true }));

app.post("/home", (req, res) => {
  res.redirect("/");
})


app.post("/unknown", async (req, res) => {
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


app.post("/mealplan", async (req, res) => {
  const { messages } = req.body;


  const gptConfiguration = "You will receive a profile for a person that includes" +
    "their age, gender, height, weight, excercise frequency, and goal. Your job is to " +
    "create a nutrition plan. With the given information, you will return a plan in json format as follows:" +
    "{ 'breakfast': 'breakfast plan here', 'lunch' : 'lunch plan here', 'dinner': 'dinner plan here'} " +
    "Please ensure that you only return a json of the described format. Insert each individual plan into the correct place in the json"


  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": gptConfiguration },
      ...messages

    ],
  })

  res.json({
    completion: chatCompletion.choices[0].message
  })
});



app.post("/calories", async (req, res) => {
  const { messages } = req.body;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": "You are a calorie counter. Your responses are limited to just a number. You'll be given lists of food items without calorie counts. Assume one item per entry. If count of an item is confusing, assume just one of said item. Calculate and return the total calories. I want to emphasize again that you must only return just a number. Do not return any words before or after the number." },
    ],

  });

  res.json({
    completion: chatCompletion.choices[0].message
  })
});



app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});