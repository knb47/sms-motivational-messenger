// SQL QUERIES
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

module.exports = {
  selectUser: async (phoneNumber) => {
    const text = 'SELECT * FROM users WHERE phone_number = $1';
    try {
      const results = await pool.query(text, [phoneNumber]);
      return results.rows.length > 0;
    } catch (err) {
      console.log(err);
    }
  },
  
  deleteUser: async (phoneNumber) => {
    const text = 'DELETE FROM users WHERE phone_number = $1';
    try {
      const results = await pool.query(text, [phoneNumber]);
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  },
  
  addUser: async (phoneNumber) => {
    const text = 'INSERT INTO users (phone_number, time_zone) VALUES ($1, $2)';
    try {
      const results = await pool.query(text, [phoneNumber, 'America/New_York']);
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  },
  
  getAllUsers: async () => {
    const text = 'SELECT phone_number FROM users';
    try {
      const results = await pool.query(text);
      return results;
    } catch (err) {
      console.log(err);
    }
  },
  
  deleteAllUsers: async () => {
    const text = 'DELETE FROM users';
    try {
      const results = await pool.query(text);
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  },
  
  addMessage: async (message) => {
    const text = 'INSERT INTO messages (message) VALUES ($1)';
    try {
      const results = await pool.query(text, [message]);
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  },
  
  selectRandomMessage: async () => {
    const text = 'SELECT * FROM messages ORDER BY random() LIMIT 1';
    try {
      const results = await pool.query(text);
      return results.rows[0];
    } catch (err) {
      console.log(err);
    }
  },
  
  deleteAllMessages: async () => {
    const text = 'DELETE FROM messages';
    try {
      const results = await pool.query(text);
      console.log(results);
    } catch (err) {
      console.log(err);
    }
  },
}