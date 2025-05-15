/* Commands I did for creating project
* npm init -y
* npm i express
* npm i axios
* npm i tough-cookie
* npm install axios-cookiejar-support
* npm i dotenv
* npm i mongoose
* npm i axios-retry
* npm i --save-dev nodemon
* (Ensure to add a variable inside "script" variable's json as ' "devStart":"nodemon server.js" ')

* npm i jsdom

* npm run devStart
*/

const express = require("express");
const app = express();
const service = require("./service");
require("dotenv").config();

app.use(express.json()); //Middleware to parse JSON body

app.post("/ingredients-from-ai-with-costs", async (req, res) => {
    const filteredList = [];
    console.log("Request received...Calling AI, then Fetching Cookies and calling Bigbasket Apis...");
    const instructions = await service.getIngredientsListFromAi(req.body.recipeName, req.body.qtyNeeded, filteredList);
    res.status(200).json({
        "message":"Ingredients fetched successfully!",
        "items":filteredList,
        "total_mrp": filteredList.reduce((sum, item) => sum + (item.total_cost_at_mrp != -1 ? item.total_cost_at_mrp:0), 0),
        "total_cost": filteredList.reduce((sum, item) => sum + (item.actual_cost != -1 ? item.actual_cost:0), 0),
        "cost_evaluation_failed_count": filteredList.filter(item => item.total_cost_at_mrp === -1 || item.unit_conversion_issues).length,
        "instructions": instructions
    });
});

app.post("/cost-of-ingredients", async (req, res) => {
    const filteredList = [];
    console.log("Request received...Fetching Cookies and calling Bigbasket Apis...");
    await service.getIngredientsList(req.body.ingredientNames, req.body.ingredientQtys, req.body.ingredientUnits, filteredList);
    res.status(200).json({
        "message":"Ingredients' details fetched successfully!",
        "items":filteredList,
        "total_mrp": filteredList.reduce((sum, item) => sum + (item.total_cost_at_mrp != -1 ? item.total_cost_at_mrp:0), 0),
        "total_cost": filteredList.reduce((sum, item) => sum + (item.actual_cost != -1 ? item.actual_cost:0), 0),
        "cost_evaluation_failed_count": filteredList.filter(item => item.total_cost_at_mrp === -1 || item.unit_conversion_issues).length
    });
});

app.listen(3000);