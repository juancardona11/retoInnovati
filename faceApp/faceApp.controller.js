'use strict';
const request = require('request');
// Replace <Subscription Key> with your valid subscription key.
const subscriptionKey = 'f0d7619cbda245a9a12b49eabb3e3b88';
// You must use the same location in your REST call as you used to get your
// subscription keys. For example, if you got your subscription keys from
// westus, replace "westcentralus" in the URL below with "westus".

exports.face = (request, response) => {

    async function main() {
        const subscriptionKey = 'f0d7619cbda245a9a12b49eabb3e3b88';
        if (!subscriptionKey) {
            throw new Error('Environment variable for your subscription key is not set.')
        };
        const imageUrl = request.body.img;
        var buff = new Buffer(imageUrl.replace(/^data:image\/(png|gif|jpeg);base64,/, ''), 'base64');
        
        const uriBase = 'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect';
        // Request parameters.
        
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
        let result = JSON.parse(await faceApp(options));
        response.send(result);
        } catch (err) {
            console.log(`Something went wrong: ${err}`);
        }
          
    }
    main();
}

        function faceApp(options){
            return new Promise ( resolve => {
                request.post(options, (error, response, body) => {
                
                    if (error) {
                    console.log('Error: ', error);
                    return;
                    }
                    let jsonResponse = JSON.stringify(JSON.parse(body), null, '  ');
                    //console.log('JSON Response\n');
                    //console.log(jsonResponse);
                    resolve(jsonResponse);
                    
                });
            });
        }
      


