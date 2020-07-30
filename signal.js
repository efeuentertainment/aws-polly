require('dotenv').config({ path: '/usr/local/aws-polly/.env' }) //load credentials from .env file
// Load the SDK
const AWS = require('aws-sdk')
const Stream = require('stream')
const Speaker = require('speaker')
//const PLAYBACKDEVICE = process.argv[2];//hardware device
//const VOICEID = process.argv[3];
var fs = require('fs');

let maxInstances = 2;

var done = (function wait () { if (!done) setTimeout(wait, 1000) })(); //keep runninh until done
// Create a Polly client
const Polly = new AWS.Polly({
    signatureVersion: 'v4',
    region: 'eu-west-3'
})

function ttsBurrito(){
  console.info("instances left: " + maxInstances);    
  if (maxInstances){
let ttsData = fs.readFileSync( '/tmp/tts.txt' );
let params = {
    'Text': '<speak>' + ttsData + '</speak>',
    'OutputFormat': 'pcm',
    'VoiceId': 'Matthew',
    'TextType': 'ssml'
}

Polly.synthesizeSpeech(params, (err, data) => {
    if (err) {
        console.log(err.code)
    } else if (data) {
        if (data.AudioStream instanceof Buffer) {
            // Initiate the source
            maxInstances--;
            var bufferStream = new Stream.PassThrough()
            const speaker = new Speaker({
              channels: 1,
              bitDepth: 16,
              sampleRate: 16000,
              device: 'hw:1,0'
            })
            // Pipe into Player
            bufferStream.pipe(speaker)
            // convert AudioStream into a readable stream
            bufferStream.end(data.AudioStream)
            speaker.end(() => {
	      console.info("instance ++");
              maxInstances++;
            });
        }
    }
})
}
}

process.on('SIGUSR1', () => {
console.info('SIGUSR1 signal received.');
ttsBurrito();
});

ttsBurrito();
