This is an expressJS application which uses mongoDB, which helps to estimate the cost of the volume/mass of ingredients in a recipe. The recipe can be obtained on your behalf using an api call to an AI/GPT but you can also give your own recipe through the respective endpoints. Feel free to try hitting these endpoints using the postman collections I've attached.

MONGO_URI and GITHUB_TOKEN are the 2 env variables required to run this application.
Please generate your own token from github in settings' to access the GPT's api, and use your mongodb url/connection string.

STRONG NOTE: PLEASE do "npm install" command before running as there are over 10K files just from node_modules folder to commit, so I have'nt commited those.

Ensure to add a json variable inside "script" as ' "devStart":"nodemon server.js" '
Feel free to use npm start also incase if you dont want to run in dev mode.

Commands I did for creating project: 
* npm init -y
* npm i express
* npm i axios
* npm i tough-cookie
* npm install axios-cookiejar-support
* npm i dotenv
* npm i mongoose
* npm i axios-retry
* npm i string-similarity
* npm i --save-dev nodemon

Current Node version (can run on later versions too): v18.20.8 (npm 10.8.0)