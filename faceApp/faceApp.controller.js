'use strict'
const request = require('request');

exports.face = (request, response) => {

    async function main() {
        const subscriptionKey = 'f0d7619cbda245a9a12b49eabb3e3b88';

        if (!subscriptionKey) {
            throw new Error('Environment variable for your subscription key is not set.')
        };
        //Se captura la imagen en base64 enviada desde el front
        const imageUrl = request.body.img;
        //Se transforma la imagen y se guarda en un buffer
        var buff = new Buffer(imageUrl.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
        const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
        //Se configuran los parametros que serán retornados por la API de Azure
        const params = {
            'returnFaceId': 'true',
            'returnFaceLandmarks': 'false',
            'returnFaceAttributes': 'age,gender,headPose,smile,facialHair,glasses,' +
                'emotion,hair,makeup,occlusion,accessories,blur,exposure,noise'
        };
        const options = {
            uri: uriBase,
            qs: params,
            body: buff,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Ocp-Apim-Subscription-Key' : subscriptionKey
            }
        };
        try {
        //Utilizamos la función faceApp para consumir la API de Azure
        let result = JSON.stringify(await faceApp(options));
        response.send(result);
        } catch (err) {
            console.log(`Something went wrong: ${err}`);
        }
          
    }
    main();
}
    //Se consume la API Face de Azure
    function faceApp(options){
            return new Promise ( resolve => {
                request.post(options, (error, response, body) => {
                    if (error) {
                    console.log('Error: ', error);
                    return;
                    }
                    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
                    resolve(jsonResponse);  
                });
            });
    }
      


