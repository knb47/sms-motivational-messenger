const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");
const ngrok = require("ngrok");
const timezonelist = require("./timezonelist.js");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const app = express();
const port = 3000;
const cron = require('node-cron');
const queries = require('./sqlcontroller.js');

dotenv.config();

//SQL credentials
const SQL_URI = process.env.SQL_URI;

const pool = new Pool({
  connectionString: SQL_URI,
});

// Twilio account credentials
const accountSid = "AC5e57136a0b63339682fb1c5bdb550652";
const authToken = "9676afa6e0b84c3bceec9dae5bc874b9";
const client = twilio(accountSid, authToken);

//open ai configuration
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  organization: "org-dmrFp1Qvb5jsxzyHLMGXyHQX",
  apiKey: "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",
});

const openai = new OpenAIApi(configuration);

async function generateGPTResponse(message) {
  const completion = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      { 
        role: "system", 
        content: "You are an assisant for our sms-based application. You will be talking to our users over sms. Our application's purpose is to send motivating text messages at 7:00am for users. Please keep the responses under 100 characters. If you get a message that you don't understand, tell the user that they can begin receiving messages from our service by texting 'morning' or stop receiving messages by texting 'pause'. When you first greet users, tell them that they can start receiving motivational messages by texting 'morning'."
      },
      { 
        role: "user", 
        content: message
      }
    ]
  });
  return completion;
}


async function handleResponse(number, req, res, message) {
  const response = await generateGPTResponse(message);
  // console.log(response);
  console.log(response.data.choices[0].message);

  const parsedResponse = response.data.choices[0].message.content

  client.messages
    .create({
      body: parsedResponse,
      from: "+16319003876",
      to: number,
    })
    .then(() => {
      res.send("Message sent!");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error sending message");
    });
}


// Parse incoming request body as text
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint to handle incoming SMS messages
app.post("/sms", async (req, res) => {
  const { Body, From } = req.body;
  
  const isUser = false;
  // isUser = await queries.selectUser(From)


  if (Body.slice(0, 8).toLowerCase() === "morning") {
    //sql query to create user
    if (isUser) {
      alreadySignedUp(From, req, res);
    } else {
      signupUser(From, req, res);
    }
  } else if (Body.slice(0, 5).toLowerCase() === "pause") {
    //sql query to remove user
    removeUser(From, req, res);
  } else {
    handleResponse(From, req, res, Body);
    //sql query to send options to a user
    // sendOptions(From, req, res);
  }
});

async function alreadySignedUp(number, req, res) {
  const response = `Hey! I see you're already signed up - glad to have you. I'll see you in the morning!`;

  client.messages
    .create({
      body: response,
      from: "+16319003876",
      to: From,
    })
    .then(() => {
      res.send("Message sent!");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error sending message");
    });
}

async function signupUser(number, req, res) {
  const response = `Awesome! You'll now receive morning messages from me. As a reminder, if you ever wish to unsubscribe, just send "pause".`;

  queries.addUser(number);

  client.messages
    .create({
      body: response,
      from: "+16319003876",
      to: number,
    })
    .then(() => {
      res.send("Message sent!");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error sending message");
    });
}

async function userExists(number) {
  //sql query to see if the user exists or doesn't exist
  return false;
}

async function removeUser(number, req, res) {
  const response = `You're now unsubscribed. If you ever change your mind, just send "morning", and I'll resume sending morning messages. Goodbye!`;

  //sql query to remove a user
  queries.deleteUser(number);
  
  client.messages
    .create({
      body: response,
      from: "+16319003876",
      to: number,
    })
    .then(() => {
      res.send("Message sent!");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error sending message");
    });
}

function sendOptions(number, req, res) {
  const response = `Hey, there! I'm Good Morning GPT, your personal life coach to start your day. To subscribe for morning messages, just text "morning". 
  \n \n
  If you no longer wish to receive messages, text "pause".`;

  client.messages
    .create({
      body: response,
      from: "+16319003876",
      to: number,
    })
    .then(() => {
      res.send("Message sent!");
    })
    .catch((error) => {
      console.log("this is throwing an error!");
      console.error(error);
      res.status(500).send("Error sending message");
    });
}

// Schedule task to run every hour
timezonelist.forEach(({ timezone, task }) => {
  cron.schedule("0 * * * *", () => {
    const now = moment().tz(timezone);
    if (now.hour() === 7) {
      sendMessages(timezone);
    }
  });
});


/* Testing */
// cron.schedule("* * * * *", () => {
//     sendMessages();
// });

async function runScheduledTask() {
  await cron.schedule('* * * * *', () => {
    sendMessages();
  });
  console.log('Scheduled task completed');
}

runScheduledTask().catch(error => console.log(error));

async function sendMessages() {
  //get the random message from the database
  const messageOfDay = await queries.selectRandomMessage();
  console.log(messageOfDay);
  //query all users phone numbers
  const numbers = await queries.getAllUsers();
  //send all users the message of the day

  numbers.rows.forEach((number) => {
    console.log(number);
    client.messages
      .create({
        body: messageOfDay,
        from: "+16319003876",
        to: number.phone_number
      })
      .then(message => console.log(message.sid))
      .catch(error => console.log(error));
  });
}

// Start the server and ngrok tunnel
(async () => {
  const url = await ngrok.connect(port);
  console.log(`Server listening on ${url}`);
  console.log(`Webhook URL for Twilio: ${url}/sms`);
  app.listen(port);
})();
