require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const { WHATSAPP_TOKEN, WHATSAPP_PHONE_ID, WHATSAPP_VERIFY_TOKEN, PORT = 3001 } = process.env;

// ==========================================
// 1. WEBHOOK VERIFICATION (GET)
// Required by Meta to verify the webhook URL
// ==========================================
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
      console.log('Meta Webhook Verified Successfully!');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.status(400).send('Invalid request');
  }
});

// ==========================================
// 2. RECEIVE INCOMING MESSAGES (POST)
// ==========================================
app.post('/webhook', (req, res) => {
  const body = req.body;
  if (body.object) {
    if (body.entry && body.entry[0].changes && body.entry[0].changes[0].value.messages && body.entry[0].changes[0].value.messages[0]) {
      const from = body.entry[0].changes[0].value.messages[0].from;
      const msg_body = body.entry[0].changes[0].value.messages[0].text?.body;
      console.log(`\n💬 Received WhatsApp Message from ${from}: ${msg_body}`);
      
      // Hook into AI Tutor / Flashcard features here in the future
    }
    res.sendStatus(200);
  } else {
    res.sendStatus(404);
  }
});

// ==========================================
// 3. SEND DYNAMIC PAYLOADS (POST)
// Used by the frontend to dispatch PYQs, notes, schedules
// ==========================================
app.post('/api/send-whatsapp', async (req, res) => {
  const { phoneNumber, title, payload } = req.body;

  if (!WHATSAPP_TOKEN || !WHATSAPP_PHONE_ID) {
    console.error('Missing Meta WhatsApp credentials in .env');
    return res.status(500).json({ success: false, error: 'Server misconfigured' });
  }

  try {
    const response = await axios({
      method: 'POST',
      url: `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_ID}/messages`,
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      },
      data: {
        messaging_product: 'whatsapp',
        to: phoneNumber,
        type: 'text',
        text: {
          body: `*${title}*\n\n${payload}`
        }
      }
    });
    
    console.log(`✅ Message sent to ${phoneNumber} successfully.`);
    res.status(200).json({ success: true, data: response.data });
  } catch (error) {
    console.error('❌ Error sending WhatsApp message:', error.response ? error.response.data : error.message);
    res.status(500).json({ success: false, error: 'Failed to send message via Meta Cloud API' });
  }
});

app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`🚀 Meta WhatsApp Cloud API Server running on port ${PORT}`);
  console.log(`=============================================`);
});
