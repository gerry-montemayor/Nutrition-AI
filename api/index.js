import { OpenAI } from "openai"
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { chatGPTApiKey, foodDataApiKey } from "../config.js"

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

app.post("https://nutrition-ai-psi.vercel.app/home", (req, res) => {
  res.redirect("/https://nutrition-ai-psi.vercel.app");
})


app.post("https://nutrition-ai-psi.vercel.app/unknown", async (req, res) => {
  const { messages } = req.body;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": "You are NutritionGPT, a helpful nutrition advice assistant chatbot." },
      ...messages
    ],

  });

  res.json({
    completion: chatCompletion.choices[0].message
  })
});



app.post("https://nutrition-ai-psi.vercel.app/mealplan", async (req, res) => {
  const { messages } = req.body;


  const gptConfiguration = "You will receive a profile for a person that includes" +
    "their age, gender, height, weight, excercise frequency, and goal. Your job is to " +
    "create a nutrition plan. With the given information, you will return a plan in json format as follows:" +
    "{ 'breakfast': {'option1 : 'plan and calorie count', option2 :'plan and calorie count' , option3 : 'plan and calorie count', option4 : 'plan and calorie count'}, 'lunch' : {'option1 : 'plan and calorie count', option2 :'plan and calorie count' , option3 : 'plan and calorie count', option4 : 'plan and calorie count'}, 'dinner': {'option1 : 'plan and calorie count', option2 :'plan and calorie count' , option3 : 'plan and calorie count', option4 : 'plan and calorie count'}, 'advice' : 'put advice here, include a summary of goals of person, how many calories they need to consume, protein, water consumption, and other important macro amounts, and any more detals. Make this a paragraph of about 200 words.'} " +
    "Please ensure that you only return a json of the described format. Insert each individual plan into the correct place in the json, and for each option, make sure to add the calories of the meal at the end"


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



app.post("https://nutrition-ai-psi.vercel.app/calories", async (req, res) => {
  const { messages } = req.body;

  const chatCompletion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { "role": "system", "content": "Return the total calories in a list of foods.Just return the number and nothing else. You will not be given the calorie counts, you must provide them." },
    ],

  });
  res.json({
    completion: chatCompletion.choices[0].message
  })
});


app.post('https://nutrition-ai-psi.vercel.app/nutrition', async (req, res) => {
  const query = req.body.query;
  const apiUrl = 'https://api.api-ninjas.com/v1/nutrition?query=' + query;

  try {
    const response = await axios.get(apiUrl, {
      headers: { 'X-Api-Key': 'Z8Fy/O9vYf4/0e3wOZ7Ajg==UEkCSnkPvTW3XeMu' },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error fetching data');
  }
});






app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});