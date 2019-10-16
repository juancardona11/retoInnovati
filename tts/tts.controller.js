// Requires request and request-promise for HTTP requests
// e.g. npm install request request-promise
const rp = require('request-promise');
// Requires fs to write synthesized speech to a file
const fs = require('fs');
// Requires readline-sync to read command line inputs
const readline = require('readline-sync');
// Requires xmlbuilder to build the SSML body
const xmlbuilder = require('xmlbuilder');

const mediaserver = require('mediaserver');

const path = require('path');

exports.conversation = (request, response) => {
    
    async function main() {
        const subscriptionKey = "080373c5f65e4bb494a03794b9012e4c";
        if (!subscriptionKey) {
            throw new Error('Environment variable for your subscription key is not set.')
        };
        // Prompts the user to input text.
        //const text = readline.question('What would you like to convert to speech? ');
        const text = request.body.text;
        
        try {
        const accessToken = await getAccessToken(subscriptionKey);
        let request =  await textToSpeech(accessToken, text);
        } catch (err) {
            console.log(`Something went wrong: ${err}`);
        }
        
    }
    main();
    
    // Gets an access token.
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
        // Create the SSML request.
        
        let xml_body = xmlbuilder.create('speak')
            .att('version', '1.0')
            .att('xml:lang', 'es-mx')
            .ele('voice')
            .att('xml:lang', 'es-mx')
            .att('name', 'Microsoft Server Speech Text to Speech Voice (es-MX, HildaRUS)')
            .txt(text)
            .end();
        // Convert the XML into a string to send in the TTS request.
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

    //    let request =  rp(options)
    //         .on('response', (response) => {
    //             if (response.statusCode === 200) {
    //                 request.pipe(fs.createWriteStream('TTSOutput.wav'));
    //                 console.log('\nYour file is ready.\n')
    //             }
    //         });  
        
    //     return request;
         try{
           let result = await getAudio(options);  
           response.send({message:'hola'}); 
           
         } catch {

         }
    }
    
            
}

     exports.audio = (request, response) => {
        var file = path.join(__dirname, '../','TTSOutput.wav');
        mediaserver.pipe(request, response, file);
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
