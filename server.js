'use strict'
const cors = require('cors');
const ttsRoutes = require('./tts/tts.routes');
const express = require('express');
const propierties = require('./config/properties');
const faceRoutes = require('./faceApp/faceApp.routes');
const app = express();
const router = express.Router();
const bodyParser = require('body-parser');

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json());
app.use(express.static('tts'));
app.use(cors());
app.use('/api', router);

ttsRoutes(router);
faceRoutes(router);

router.get('/', (req, res) => {
  res.send('Hello from home');
});
app.use(router);
app.listen(propierties.PORT, () => console.log(`Server runing on port ${propierties.PORT}`));