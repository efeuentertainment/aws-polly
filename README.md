## aws-polly
multipurpose amazon Text-To-Speech aws 
polly script. based on instructions and 
examples from:    
https://medium.com/@anaptfox/getting-started-with-amazon-polly-using-node-js-345e84dbd23d    
https://medium.com/better-programming/text-to-speech-build-apps-that-talk-with-aws-polly-and-node-js-a9cdab99af04    
https://trevorsullivan.net/2016/12/01/amazon-aws-cloud-polly-nodejs/   

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

