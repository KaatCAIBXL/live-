const express = require('express');
const { WebSocketServer } = require('ws');
const path = require('path');

const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname)));
app.get('/', (req, res) => res.redirect('/index-itech-disciple.html'));

const server = app.listen(PORT, () => {
  console.log('Server op http://localhost:' + PORT);
  console.log('App: http://localhost:' + PORT + '/index-itech-disciple.html');
  console.log('Kies I-tech of Disciple bij het openen.');
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.type === 'transcript' && msg.text != null) {
        wss.clients.forEach((client) => {
          if (client !== ws && client.readyState === 1) {
            client.send(JSON.stringify(msg));
          }
        });
      }
    } catch (e) {
      // ignore invalid messages
    }
  });
});
