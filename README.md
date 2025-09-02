Hi, this is a general README file for this overall full stack application called "Food Cost Estimator" where using ingredient names and quantites required, it gives the total cost of making a given serving of food.
Additionally it can also use AI to generate the recipe then do the above mentioned things.

A separate README.md file is in Backend folder for the expressJS (typescript) application which is required to use the Frontend React application. PLEASE REFER THAT FILE TOO!

To run the front end , simply do "npm install" first as node_modules and build folders aren't commited to the repo. Then use "npm start" to start the react application.

Ideal node version is around v18 but it runs on node 24 as well with no issues.
Ensure to run backend application and see if mongoDB connection succeeds before using this App.

[ Note: Please refer the screenshots folder for previews of all the application's pages! ]

There are primarily 3 functionalities: -

Home :
    This page has functionalities to :
        -> AI generate and then cost estimate that recipe which was obtained
        -> Search (approximated search) for a recipe name in DB to fetch.
        -> Delete the recipe in DB if it exists.

Insert: 
    This page helps to insert a recipe of ingredient names and required quantities you already have to get the cost estimation values.

Display Page (Not indexed in nav bar):
    This is the page which appears if you searched or generated a new recipe, where you can edit the parameters and details of the recipe accordingly (and the other fields will AUTO-CALCULATE everytime you change a dependency field!), and can be used to do an 'Update Recipe' action.

Feel free to reach out of any issues are there with this full stack app.

Thank You.

[ Critical Warning: This application has major dependency on the GITHUB AI endpoint working ( ensure correct token permissions are present ) and the Bigbasket APIs which actually are NOT officially to be used for this purpose. They were obtained by observing the frontend api calls which occured. So any change in these apis will make this applciation unusable. Potentially you can find the new api calls that is done and use that here instead, it should work (Additionally recipe image is taken from a swiggy api same way as bigbasket, so this minor functionality also has this additional dependency). ]