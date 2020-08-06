## aws-polly
very low latency amazon Text-To-Speech aws polly script.  
a simple to use alternative, but with a ~3s execution time, is listed further down.  
this sctipt runs as daemon and waits for the bash SIGUSR1 signal, to achieve a very low playback latency time (under 0.5s).

### Installation
1) download project to /usr/local/aws-polly/

2) install dependency:  
```bash 
sudo apt install mpg123 
``` 
3) modules install
```bash 
npm i aws-sdk dotenv fs child_process minimist
``` 
4) rename file .env-blank to .env 

5) add your aws credentials to .env

### Usage
call the following from your app / script as root:
```bash
pkill -x -o -SIGUSR1 -f 'node /usr/local/aws-polly/signal.js' || node /usr/local/aws-polly/signal.js &
```
this will:  
•send a SIGUSR1 signal to the script,  
•or start it in background if it doesn't run.  

run `node signal.js --help` for information about the optional cli arguments, and add them (twice) to the above line.  
by default, signal.js will load /tmp/tts.txt, read it using voice-id 'Matthew', and play it on the system default speaker.  

list pid of running instance:
```bash
pgrep -f 'node /usr/local/aws-polly/signal.js'
```
kill running instance:
```bash
pkill -SIGINT -f "node /usr/local/aws-polly/signal.js"
```

### Usage for export module function.js
```bash
const POLLY = require("/usr/local/aws-polly/function.js");
```
call from your node code:
```bash
POLLY.ttsBurrito();
```

### References
script is based on instructions and examples from:    
https://medium.com/@anaptfox/getting-started-with-amazon-polly-using-node-js-345e84dbd23d    
https://medium.com/better-programming/text-to-speech-build-apps-that-talk-with-aws-polly-and-node-js-a9cdab99af04    
https://trevorsullivan.net/2016/12/01/amazon-aws-cloud-polly-nodejs/   

Listen to some voice examples:  
https://www.amazonaws.cn/en/polly/   
Listen to all voices (requires aws console login) :   
https://us-east-2.console.aws.amazon.com/polly/home/SynthesizeSpeech   
Full list of available voices: (write voice names without phonetics. Léa -> Lea)  
https://docs.aws.amazon.com/polly/latest/dg/voicelist.html  

check how many characters you've used this month here:
https://console.aws.amazon.com/billing/home#/bills

SSML (markup language) reference doc:  
https://developer.amazon.com/it-IT/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html#prosody   
AWS polly class properties doc:  
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html   

### CLI alternative
an easy to use alternative are the CLI packages from aws themselves. execution time until playback is about 2.7s.  
a complete command could then look like this:
```bash
aws polly synthesize-speech --voice-id Matthew --output-format mp3 --text "<speak>$(cat /tmp/tts.txt)</speak>" --text-type ssml /tmp/tts.mp3 && mpg123 -q --no-control -a plughw:1 /tmp/tts.mp3 &
```
(~5 simultaneous instances will result in failure)  
command reference:  
https://awscli.amazonaws.com/v2/documentation/api/latest/reference/polly/synthesize-speech.html  
CLI v2 install:  
https://docs.aws.amazon.com/cli/latest/userguide/install-cliv2-linux.html  
CLI v2 is not supported on raspberry pi, but CLI v1 is still available for arm processors.  
CLI v1 install:  
https://docs.aws.amazon.com/cli/latest/userguide/install-linux.html#install-linux-bundled-sudo  
either create the aws credentials files or run `aws config`  
https://blog.gruntwork.io/authenticating-to-aws-with-the-credentials-file-d16c0fbcbf9e?gi=f46ca71979f8  
  
#### *ignore this part. pkg workflow notes for future self*
*0) copy creds from old .js
1) cp signal.js aws-polly-signed-signal.js
2) add creds into param
3) npm i pkg
4) get https://github.com/vercel/pkg-fetch , or for armv7 https://github.com/robertsLando/pkg-binaries
5) pkg --targets node10.15.3-linux-armv7 package.json
6) mv aws-polly-signed-signal ../
*
