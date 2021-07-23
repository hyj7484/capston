const app = require('express')();
const bodyParser = require('body-parser');
const api = require('./app');
const socket = require('./router/socket')
const cors = require('cors');
const fs = require('fs');

const option = {
  key : fs.readFileSync('/etc/letsencrypt/live/sinzuku.n-e.kr/privkey.pem'),
  cert : fs.readFileSync('/etc/letsencrypt/live/sinzuku.n-e.kr/cert.pem')
}

const http  = require('http').createServer(app);
const https = require('https').createServer(option, app);

// module.exports = server;
module.exports = https;

const io = require('./router/socket')(https);

app.use(cors());
app.use(bodyParser.json());
app.use('/api', api);

const httpPort = 80;
const httpsPort = 443;

http.listen(httpPort, () => {
  console.log(`Listen to port ${httpPort}`);
});
https.listen(httpsPort, () => {
  console.log(`Listen to port ${httpsPort}`);
});

// const port = 3002;
// server.listen(port, ()=>console.log(`Listening on port ${port}`))
