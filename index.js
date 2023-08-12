const express = require('express');
const timeout = require('connect-timeout');
const routes = require('./routes/route')

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(timeout('300000')); 
app.use('/', routes)

const port = process.env.PORT
app.listen(port, function (err) {
  if (err) console.log(err);
  console.log('Server listening on', port);
});