const request = require('request');
const rp = require('request-promise');
const fs = require('fs');
const readline = require('readline-sync');
const xmlbuilder = require('xmlbuilder');
const mediaserver = require('mediaserver');
const path = require('path');

exports.conversation = (request, response) => {
    
    async function main() {
        const subscriptionKey = "080373c5f65e4bb494a03794b9012e4c";
        const text = request.body.text;
        if (!subscriptionKey) {
            throw new Error('Environment variable for your subscription key is not set.')
        };
        
        try {
        const accessToken = await getAccessToken(subscriptionKey);
        let request =  await textToSpeech(accessToken, text);
        } catch (err) {
            console.log(`Something went wrong: ${err}`);
        }
        
    }
    main();
    
    // Se obtiene el toke de acceso
    function getAccessToken(subscriptionKey) {
        let options = {
            method: 'POST',
            uri: 'https://westus.api.cognitive.microsoft.com/sts/v1.0/issueToken',
            headers: {
                'Ocp-Apim-Subscription-Key': subscriptionKey
            }
        }
        return rp(options);
    }

    
    async  function textToSpeech(accessToken, text) {
        //Se crea la petición SSML 
        let xml_body = xmlbuilder.create('speak')
            .att('version', '1.0')
            .att('xml:lang', 'es-mx')
            .ele('voice')
            .att('xml:lang', 'es-mx')
            .att('name', 'Microsoft Server Speech Text to Speech Voice (es-MX, HildaRUS)')
            .txt(text)
            .end();
        let body = xml_body.toString();
        let options = {
            method: 'POST',
            baseUrl: 'https://westus.tts.speech.microsoft.com/',
            url: 'cognitiveservices/v1',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'cache-control': 'no-cache',
                'User-Agent': 'YOUR_RESOURCE_NAME',
                'X-Microsoft-OutputFormat': 'riff-24khz-16bit-mono-pcm',
                'Content-Type': 'application/ssml+xml'
            },
            body: body
        }
         try{
           //Se utiliza la función getAudio para obtener el audio del texto
           let result = await getAudio(options);  
           response.send({message:'Exito'});   
         } catch {(err)
            console.log(`Something went wrong: ${err}`);
         }
    }          
}

     function getAudio(options){
                let request =  rp(options)
             .on('response', (response) => {
                 if (response.statusCode === 200) {
                     request.pipe(fs.createWriteStream('TTSOutput.wav'));
                     console.log('\nYour file is ready.\n')
                 }
            });  
         return request;
     }
     // Se utiliza la librería mediaServer para enviar el archivo de audio al Front
     exports.audio = (request, response) => {
        var file = path.join(__dirname, '../','TTSOutput.wav');
        mediaserver.pipe(request, response, file);
     }
