## aws-polly
multipurpose amazon Text-To-Speech aws 
polly script. based on instructions and 
examples from:    
https://medium.com/@anaptfox/getting-started-with-amazon-polly-using-node-js-345e84dbd23d    
https://medium.com/better-programming/text-to-speech-build-apps-that-talk-with-aws-polly-and-node-js-a9cdab99af04    
https://trevorsullivan.net/2016/12/01/amazon-aws-cloud-polly-nodejs/   

Listen to some voice examples:
https://www.amazonaws.cn/en/polly/   
Full list of available voices:
https://docs.aws.amazon.com/polly/latest/dg/voicelist.html   
Listen to all voices (requires aws console login) :
https://us-east-2.console.aws.amazon.com/polly/home/SynthesizeSpeech   

SSML (markup language) reference doc:
https://developer.amazon.com/it-IT/docs/alexa/custom-skills/speech-synthesis-markup-language-ssml-reference.html#prosody   
AWS polly class properties doc:
https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html   


### Installation
1) speaker module dependency: 
(from https://github.com/TooTallNate/node-speaker ) 
```bash 
sudo apt-get install libasound2-dev 
``` 
2) modules install
```bash 
npm i speaker aws-sdk dotenv 
``` 
3) rename file .env-blank to .env 

4) add your aws credentials to .env

---more steps required---

### Usage
```bash
node index.js 
```

