//load credentials from .env file
require('dotenv').config({ path: '/usr/local/aws-polly/.env' });
// created on PepitoBots by firened
// Load the SDK
const AWS = require('aws-sdk');
const { exec } = require("child_process");
var fs = require('fs');
const minimist = require('minimist');
//get cli arguments or use default values
let argv = minimist(process.argv.slice(2), {
	alias: {
		h: ['help', 'version'],
		v: 'voice-id',
		a: 'audiodevice',
		m: 'ssml'
	},
	default: {
		v: 'Matthew',
		a: null
	},
	string: ['v', 'a'],
	boolean: 'm'
});
//console.log(argv);

let maxInstances = 2;

if (argv.m){
	argv.m = 'ssml';
}else{
	argv.m = 'text';
}

//keep script running until done
var done = (function wait () { if (!done) setTimeout(wait, 1000) })();
// Create a Polly client
const Polly = new AWS.Polly({
	signatureVersion: 'v4',
	region: 'eu-west-3'
})

function ttsBurrito(){
	maxInstances--;
	let currentInstance = maxInstances;
	//console.info("instances left: " + maxInstances);    
	let ttsData = fs.readFileSync( '/tmp/tts.txt' );

	if (argv.m == 'ssml'){
		ttsData = '<speak>' + ttsData + '</speak>';
	}

	//set up polly parameters
	let params = {
		'Text': ttsData.toString(),
		'OutputFormat': 'mp3',
		'VoiceId': argv.v,
		'TextType': argv.m
	}
	Polly.synthesizeSpeech(params, (err, data) => {
		if (err) {
			console.log(err.code)
			console.info("err instance ++");
			maxInstances++;
		} else if (data) {
			if (data.AudioStream instanceof Buffer) {
				fs.writeFile("/tmp/tts_" + currentInstance + ".mp3", data.AudioStream, function(err) {
					if (err) {
						return console.log(err)
						console.info("err instance ++");
						maxInstances++;
					}else{
						let audioArgument = '';
						if (argv.a){
							audioArgument = '-a ' + argv.a + ' ';
						}
						exec('mpg123 -q --no-control ' + audioArgument + '/tmp/tts_' + currentInstance + '.mp3', (err, stdout, stderr) => {
							if (err) {
								//some err occurred
								console.error(err)
							} else {
								// the *entire* stdout and stderr (buffered)
								//console.log(`stdout: ${stdout}`);
								//console.log(`stderr: ${stderr}`);
							}
							//console.info("instance ++");
							maxInstances++;
						});
					}
				})
			}
		};
	})
}

process.on('SIGUSR1', () => {
	console.info('signal.js: SIGUSR1 signal received.');
	if (maxInstances){  //only a few simultanious instances allowed > skip
		ttsBurrito();
	}
});

if (argv.help){
	console.info('Usage: \n\tnode signal.js [-h|--help|--version] | [-m|--ssml] [-v|--voice-id voiceID] [-a|--audiodevice dev]');
	console.info('\t(signal.js always reads /tmp/tts.txt for text input)');
	console.info('Example: \n\tnode signal.js --voice-id Matthew --audiodevice plughw:1,0');
	console.info('\nsignal.js version 1.2, date 08.2020, author efeuentertainment');
	console.info('github https://github.com/efeuentertainment/aws-polly');
	return process.exit(0);
}

ttsBurrito();




