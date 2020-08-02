//load credentials from .env file
require('dotenv').config({ path: '/usr/local/aws-polly/.env' });
// Load the SDK
const AWS = require('aws-sdk');
const Stream = require('stream');
const Speaker = require('speaker');
var fs = require('fs');
const minimist = require('minimist');
//get cli arguments or use default values
let argv = minimist(process.argv.slice(2), {
	alias: {
		h: ['help', 'version'],
		v: 'voice-id',
		a: 'audiodevice'
	},
	default: {
		v: 'Matthew',
		a: null
	},
	string: ['v', 'a']
});
//console.log(argv);

let maxInstances = 2;

//keep script running until done
var done = (function wait () { if (!done) setTimeout(wait, 1000) })();
// Create a Polly client
const Polly = new AWS.Polly({
	signatureVersion: 'v4',
	//accessKeyId: 'id', //if in-code authentication is required
	//secretAccessKey: 'key', //if in-code authentication is required
	region: 'eu-west-3'
})

function ttsBurrito(){
	//console.info("instances left: " + maxInstances);    
	if (maxInstances){  //only a few simultanious instances allowed > skip
		let ttsData = fs.readFileSync( '/tmp/tts.txt' );
		//set up polly parameters
		let params = {
			'Text': '<speak>' + ttsData + '</speak>',
			'OutputFormat': 'pcm',
			'VoiceId': argv.v,
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
						device: argv.audiodevice
					})
					// Pipe into Player
					bufferStream.pipe(speaker)
					// convert AudioStream into a readable stream
					bufferStream.end(data.AudioStream)
					speaker.end(() => {
						//console.info("instance ++");
						maxInstances++;
					});
				}
			}
		})
	}
}

process.on('SIGUSR1', () => {
	console.info('signal.js: SIGUSR1 signal received.');
	ttsBurrito();
});

if (argv.help){
	console.info('Usage: \n\tnode signal.js [-h|--help|--version] | [-v|--voice-id voiceID] [-a|--audiodevice dev]');
	console.info('\t(signal.js always reads /tmp/tts.txt for text input)');
	console.info('Example: \n\tnode signal.js --voice-id Matthew --audiodevice hw:1,0');
	console.info('\nsignal.js version 1.1, date 08.2020, author efeuentertainment');
	console.info('github https://github.com/efeuentertainment/aws-polly');
	return process.exit(0);
}

ttsBurrito();




