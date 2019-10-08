const Tts = require('./tts.controller');

module.exports = (router) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    if (req.method === 'OPTIONS'){
      res.header("Access-Control-Allow-Headers", "X-Requested-With,content-type");
      return res.status(200).json({});
    }
    next();
  });
  
  router.post('/textToSpeech',  Tts.conversation);
  router.get('/audio', Tts.audio);
}