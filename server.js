'use strict'
const cors = require('cors');
const ttsRoutes = require('./tts/tts.routes');
const express = require('express');
const propierties = require('./config/properties');
const faceRoutes = require('./faceApp/faceapp.routes');
const app = express();
const router = express.Router();

const bodyParser = require('body-parser');

// app.use(bodyParserJSON);
// app.use(bodyParserURLEncoded);

app.use(bodyParser.json({limit: '10mb', extended: true}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));
app.use(bodyParser.json());
app.use(express.static('tts'));

app.use(cors());

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
//   res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
//   if (req.method === 'OPTIONS'){
//     res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
//   next();
// });

app.use('/api', router);

ttsRoutes(router);
faceRoutes(router);

router.get('/', (req, res) => {
  res.send('Hello from home');
});
app.use(router);
app.listen(propierties.PORT, () => console.log(`Server runing on port ${propierties.PORT}`));