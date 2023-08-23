# SMS-based Motivation Messenger

Authored by Kyle Brandt and Truett Davis

An SMS service leveraging Twilio, OpenAI's GPT-4, and Node.js to provide motivational messages to subscribed users every morning at 7:00am.

## Features

- **User Subscription**: Users can subscribe to daily motivational messages by sending the text "morning".
- **User Unsubscription**: Users can unsubscribe from the service by sending the text "pause".
- **Interactive Assistant**: Powered by OpenAI's GPT-4, the system provides dynamic responses to users' texts.
- **Scheduled Messaging**: Messages are dispatched to all subscribed users at 7:00am based on their time zones.

## Prerequisites

- Node.js and npm installed.
- A Twilio account with a valid SID, AuthToken, and phone number.
- A PostgreSQL database for user management.
- An OpenAI API key.

## Getting Started

1. **Setup environment variables**:
   Clone the repository and create a `.env` file in the root directory. Populate it with necessary configurations:

   ```env
   SQL_URI=<Your-PostgreSQL-connection-string>
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Run the Application**:

   ```bash
   node <your-main-file-name>.js
   ```

4. **Tunneling with ngrok**:
   The app uses `ngrok` to expose your local server to the internet. Once you run the application, it will provide you with a public URL that you can set up in your Twilio webhook configuration for incoming messages.

## Usage

- To **subscribe** to the motivational messages, users should text "morning" to the Twilio phone number.
- To **unsubscribe**, users can send the text "pause".

## Testing

The application is set up for testing with Jest. To run the tests:

```bash
npm test
```

## Contributing

If you'd like to contribute, please fork the repository and use a feature branch. Pull requests are warmly welcome.

## Issues

If you encounter any issues or have feature suggestions, please file an issue on the GitHub page for this project.