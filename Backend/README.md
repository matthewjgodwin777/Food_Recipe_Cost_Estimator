This is an expressJS application written in typescript, which helps to estimate the cost of the volume/mass of ingredients in a recipe. The recipe can be obtained on your behalf using an api call to an AI/GPT but you can also give your own recipe through the respective endpoints and use mongoDB as database.

Feel free to try hitting these endpoints using the postman collection I've added in this repo.

Access the /api-docs endpoint for the swagger UI created for this application for more details of each endpoint.


Steps to run this application: -

In the root folder (the one with app.ts in it), use npm install just incase to update the packages, or else you can use the "npm run build" or use "npx tsc" command to build the application from typescript to pure JS, but you will have to move the resources folder inside dist folder manually if you use the "npx tsc" command.

Then you can use "node dist/app.js" to start the application (as dist is the target folder).

Alternatively, you can also use "npm run devStart" to run the app.


Strong NOTE: BASE_URL, MONGO_URI and GITHUB_TOKEN are the 3 env variables required to run this application.
Please generate your own token from github in settings' to access the GPT's api, and use your mongodb url/connection string.


Major steps done to upgrade to typescript (after node v24 upgrade): -
* npm install --save-dev typescript ts-node
* Added tsconfig.json file.
* Converted .js files to .ts and did dependency & code level changes for the same.

Current Node version: v24.0.2 (npm 11.3.0)