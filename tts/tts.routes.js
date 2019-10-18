const Tts = require('./tts.controller');

module.exports = (router) => {
  router.post('/textToSpeech',   Tts.conversation);
  router.get('/audio',  Tts.audio);
}