const Face = require('./faceApp.controller');

module.exports = (router) => {
  
  router.post('/face',   Face.face);  
}