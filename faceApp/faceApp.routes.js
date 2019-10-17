const Face = require('./faceapp.controller');

module.exports = (router) => {
  
  router.post('/face',   Face.face);  
}