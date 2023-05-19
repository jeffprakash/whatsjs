const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const firebase = require('firebase');

// Initialize Firebase
firebase.initializeApp({
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_AUTH_DOMAIN',
  projectId: 'YOUR_PROJECT_ID',
  // Add more Firebase configuration options if necessary
});

const db = firebase.firestore();
const messagesCollection = db.collection('messages');

const client = new Client();
client.initialize();

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Scan the QR code above with your phone to log in.');
});

client.on('authenticated', () => {
  console.log('Client is authenticated!');
});

client.on('auth_failure', (err) => {
  console.error('Authentication failed:', err.message);
});

client.on('message', async (msg) => {
  const chat = await msg.getChat();
  const sender = await msg.getContact();
  const messageData = {
    senderName: sender.name,
    messageBody: msg.body,
    timestamp: new Date(),
  };

  // Store the message data in Firestore
  await messagesCollection.add(messageData);

  console.log('Received message from', sender.name + ':', msg.body);
});
