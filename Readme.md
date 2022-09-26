# Guiding Vision Technical Overview
Author: KamS04, singhparneet0911

### Contents
- [Guiding Vision Technical Overview](#guiding-vision-technical-overview)
    - [Contents](#contents)
- [Models & Naming Overview](#models--naming-overview)
  - [Models Linked Directly to the Database](#models-linked-directly-to-the-database)
    - [Program](#program)
    - [Pathway](#pathway)
    - [University](#university)
  - [Models Not Linked to the Database](#models-not-linked-to-the-database)
    - [Prerequisite](#prerequisite)
    - [MiniProgram](#miniprogram)
- [API Design](#api-design)
  - [Data](#data)
    - [Models](#models)
    - [SqlNames](#sqlnames)
    - [Queries](#queries)
    - [RawData](#rawdata)
    - [Processors](#processors)
  - [Controllers](#controllers)
  - [Routes](#routes)
- [Frontend Design](#frontend-design)
  - [Model Specific Routes](#model-specific-routes)
  - [Search Routes](#search-routes)
  - [Compare Route](#compare-route)
  - [Miscellaneous](#miscellaneous)
  - [RawDataService](#rawdataservice)
- [Frontend Build + Static Integration with Express](#frontend-build--static-integration-with-express)
- [Nginx + Pm2](#nginx--pm2)
- [Database](#database)
- [Final Thoughts](#final-thoughts)


# Models & Naming Overview
The guiding vision site was built to display small blocks of data. The entire point was to give out information about 2 things. We wanted to give information about programs available at different universities, and we wanted to give information about different pathways and the programs that are encompassed in them, i.e. Business, Life sciences, etc. So this gave us the 2 main data models for the site, [Program](#program) and [Pathway](#pathway). BUT since we realized that different programs at the same university would share some data we decided to create a 3rd model, [University](#university), to hold data related to a specific university.

On top of that we had to create 2 virtual models that aren't related to the database directly but are used in both the api and frontend.

## Models Linked Directly to the Database

**Here are outlines for the 3 data models**

### Program
> - id
>   - unique identifier
> - universityId
>   - identifier of the attached university
> - courseUrl
>   - url that points to the official page for the program
> - title
>   - title of the program
> - faculty
>   - the faculty that the program belongs to
> - prerequisites
>   - array of [Prerequisite](#prerequisite) objects
> - requiredAverage
>   - the required average for the program, as an integer
> - domesticTuition
>   - tuition required for Canadian students, as an integer
> - domesticBooks
>   - approximate cost for the books required by the program for Canadian students, as an integer
> - domesticNotes
>   - notes about costs for Canadian students
> - internationalTuition
>   - tuition required for international students, as an integer
> - internationalBooks
>   - approximate cost for the books required by the program for international students, as an integer
> - internationalNotes
>   - notes about costs for international students
> - notes
>   - overall/extra info on the course that doesn't fit in the other properties
> 

### Pathway
> - id
>   - unique identifier for object
> - title
>   - the title of the pathway, i.e. Life Sciences
> - futureJobOpportunities
>   - an array of strings containing the names of professions one may be able to get into via this pathway

### University
> - id
>   - unique identifier for object
> - name
>   - the name of the university
> - faculties
>   - an array of strings containing the names of the faculties at the University
> - phone
>   - a phone number to contact the university, BUT since some universities don't just have 1 phone number, we just kind of pick one
> - streetAddress
>   - The address for the university is split amongst multiple properties, to make it easy to display them, for universities with multiple campuses, ummmm, we decided to ignore them
> - city
> - provinceState
> - country
> - postalCode
> - url
>   - url to the official site of the university
> - iconUrl
>   - url to an image that holds the logo of the university

## Models Not Linked to the Database

**Here are the outlines for the 2 virtual data models**

### Prerequisite
> - title
>   - the title for the prerequisite, normally the name of the diploma, e.g. OSSD, or IB Diploma
> - prerequisites
>   - an array of strings that contains the names/course codes of the courses you need to take in High School if you are trying to get into the program with this diploma

### MiniProgram
> This is a virtual model that connects the [Program](#Program) model and the [University](#university), but only shows a few properties so that we can display cards, and then have a details button to show the rest

> - courseId
>   - the unique id of the Program object that this refers to
> - courseTitle
>   - the title of the Program
> - universityName
>   - the name of the attached university
> - universityIconUrl
>   - the url pointing to the icon for the attached university


**You'll notice that the [MiniProgram](#miniprogram) model uses the word ***course*** in its properties, this comes from an old naming scheme where Programs were referred to as Courses, and Pathways were referred to as Categories.**
**We moved away from this because we realised it created confusion since when you go through a program at university, you will take courses related to that program, so we renamed stuff to match.**
**The [MiniProgram](#miniprogram) model still uses the old naming scheme because it takes too much effort to rename it.**
**Also, the database still uses the old naming scheme but the columns are just mapped to objects that have the new naming scheme**

# API Design
All routes pointing to the api start with ***/api***.

The api uses [Express](https://www.npmjs.com/package/express) to setup routing.

The api is split into 3 folders which build upon one another and then are connected by the ***app.js*** script.

## Data
This folder handles accessing the database.
This folder is split into 5 folders.

---

### Models
This folder has scripts that contain the classes outlined in the [Models & Naming Overview](#models--naming-overview).

### SqlNames
This folder has scripts divided by the models, and contains variables that hold the names of columns and tables for the database.

### Queries
This folder has scripts divided by the models, all the scripts reference the names in the [SqlNames](#sqlnames) folder, to create queries to create tables and Read queries to access data in the database.
The most complicated is ***program.js***, because it also has queries to select Programs by attached universities/pathways, and to get minified Programs.

### RawData
This folder has scripts divided by models, and is a collection of functions that use the SQL queries set up in the [Queries](#queries) folder to get data and return rows. All Functions are asynchronoues.
ALSO, ***database.js*** connects to the sqlite datbase using the file path specified in the ***config.js***, this file is and should be the only connection to the database, and all other files require this script to access the database.

### Processors
This folder has scripts divided by models, which takes the SQL rows returned by the functions in the [RawData](#rawdata) folder and maps them to the models defined in the [Models](#models) folder.

## Controllers
This folder contains functions that handle queries towards specific routes. The functions are not coupled to a specific route so they can be moved around **but** they have specific parameters.

The ***preprocessor*** folder inside this holds 2 scripts that help parse parameters from an express req object.
All of the controllers require some paramters whether they be from the route itself or query parameters.
And the parameters have to be of some type.
The ***preprocessor/paramprocessor.js*** script has a function that takes in an array of parameters the function needs, and runs before the actual request handler.
This function checks the request to make sure the required parameters have been passed in, parses the parameters, and then runs the handler.

## Routes
This folder actually connects the controllers to specific routes. Each script creates an **express.Router** object, connects controllers to the router, and then exports the router.

---
That concludes the 3 seperate folders in the api.
The **app.js** file connects the router objects exported by the [Routes](#routes) folder to the actual **express* server.

The **config.js** script holds important variables that need to be constant and are used accross multiple scripts.
The file pulls variables from **environment** variables or if they don't exist sets up defaults.

# Frontend Design
The actual website that the user will see was built with [Angular](https://angular.io/).
Angular is a typescript web framework that splits the page into components and uses javascript combined with templates to inject them into the webpage.
Angular also interferes with the browsers routing/navigating system so that it can handle switches between routes and pages via javascript. This, makes the first page load very slow because the entire site is loaded, **BUT** all consequent page loads are insanely fast because they are handled via javascript and have no actual wait times associated with fetching files over the internet.

The frontend is based on 4 routes and the homepage.
The home page is a simple component with 3 sections that displays 3 random [Universities](#university), [Programs](#program), and [Pathways](#pathway). It then links to model specific pages which show more models.

## Model Specific Routes
The model specific routes are
> - /pathways
> - /programs
> - /universities

Each displays more of the specific model. It uses the lazy presenter component which is a simple template, that allows for lazy loading.
Essentially once the user scrolls to the bottom the the component emits an event so that the Model Specific component can load more data.
The lazy loader component is from this [stackblitz repo](https://stackblitz.com/edit/angular-scroll-to-bottom-load-more-items) by zome dude named Jo-Va, who I couldn't get more info on.
I think the repo is based on the IntersectionObserver which is might have been explained in [this blog post](https://www.smashingmagazine.com/2018/01/deferring-lazy-loading-intersection-observer-api/).
I tried reading it, but it's too technical for me.

Each of the model specific route also has a secondary route ***/{model}/:id*** which connects to components that give details on 1 specific model.

## Search Routes
The basic ***/search*** route is an overall search component, which takes a singular query and searches for it in all [3 Models](#models-linked-directly-to-the-database).
This then lets you move to model specific search components which route to ***/search/{model}*** which searches for the query in one specific model.
These specific model searches will search for more entries.
The overall search only searches for 5 entries, while the specific model searches implements lazy loading.

## Compare Route
This route uses the [Programs](#program) that the user has selected for comparison, and displays the selected programs in a table so that the user can compare them.

This compare component is connected to the **CompareDataService**, which caches [programs](#program) selected by the user, in memory and in **localStorage.**

## Miscellaneous
Every other route, **other than the /api routes**, display a generic 404 page.

## RawDataService
The api returns data in a very simple way.

If the request is valid and data is returned the response will be:
> {
> 
>       "success": true,
> 
>       "data": **whatever data was requested**
> 
> }

If the request is invalid the response will be:
> {
> 
>       "success": false,
> 
>       "msg": **the error message**
> 
> }

So I created a model in the frontend; **Result**, which is extended by **ResultSuccess**, and **ResultError** to match the responses.

The **RawDataService** returns observables that are of the **ResultSuccess** type.
The **contract** function defined in ***/utils/observable.js*** takes the observable and turns it into a **Promise**.
The **contract** function also promises the result and casts the responses into either **ResultSuccess**, or **ResultError** based on what happened.
This allows for easy integration of the provided in Angular HttpClientModule, with **async/await** statements.

---
The frontend site uses [Bootstrap](https://getbootstrap.com/) as a base with the [ng-bootstrap](https://ng-bootstrap.github.io/#/home) npm package driving the javascript. As well as the [Lux theme from Bootswatch](https://bootswatch.com/lux/).
The css that we defined is relatively simple, and is mainly for correctly sizing and aligning images in cards and such.

# Frontend Build + Static Integration with Express
Using the [``` ng build```](https://angular.io/cli/build) command Angular compiles the typescript, templates, and assets into static files.
The ***angular.json*** file is setup so that the build command will dump the static files directly into the ***public*** folder in the ***api***.

This introduces another problem. Static files can be easily integrated with express with the **express.static** function.
**BUT** angular routing makes all of that difficult. 
**Express** expects every route to basically be a seperate html file.
This isn't how Angular works.
The entire point of Angular Routing is to have 1 html file with javascript files to handle routing.
**SO** the different routes available in the Angular site have to be integrated into the express site and they all need to send the index.html file anyways.
This was solved by using express static to serve dedicated files, such as the css, js, and assets, along with index.html file for the home page.
Then, the last route is an overall route that catches every other request and only serves the **index.html** file.
This basically defers the request to Angular routing, which handles everything including 404s.

# Nginx + Pm2
Pm2 is used to run the **Express Server** and make sure it starts on startup.
Pm2 is also used to setup environment variables to setup the final prod server.

While the server setup with express and the [frontend build integration](#frontend-build--static-integration-with-express), is sufficient and handles everything, the lead developer has heard that Nginx is better for serving static files.
Since that is largely what is being done, we've decided to put Nginx in front of everything.
The root for the Nginx server is set to whatever path goes to the ***/public*** folder in the api.
A few locations are then set up for the Nginx server.
The first Nginx location is ***/api*** which runs a proxy pass to the running express server.
The next location is just the ***/*** which essentially runs try_uri, to try and get whatever file was requested, and if it fails, it just defaults to the **index.html** file.
It's basically how the express server was setup, and the routing is basically deferred to Angular.

# Database

God just thinking about the database hurts.

The database being used is a simple SQLite database.
Why SQLite?, well its quite simple to setup, and we don't need to setup a host for it.
There are concerns about whether it will be able to handler high numbers of users since it is a concurrent database.
**BUT** this is solved by the database being in a read-only state. Neither the frontend site nor the api can edit or change the database.
They only read data from it.
This means that to update the database the Guiding Vision team has to find some other way to do it.

So we created the DB-Browser.
It's a simple website, created with simple js, no web framework, that gives a simple UI to edit the database.
It takes in a data file which is the entire database dumped into json format.
This can be done by the accompanying python script, called **browse.py**.
The DB-Browser is outputted into a single html file that contains all the css, js, and html so that it is super easy to distribute.
Once the user makes their edits, the DB-Browser outputs a changes file, which is all of their edits outputted to json.
This changes file is once again processed by the **browse.py** script, and it will update a local database.
This means that only **1** person can edit the database at a time, because it requires a data file that has the entire database to function.
To stay consistent, all of the data files and change files, are put onto the Guiding Vision GDrive, and they are date stamped so that if something goes wrong we can track it down.

This solves the problem half way
We now have a system to let the entire Guiding Vision team to edit a local database.
**BUT** we still need to transfer the data into the production server.
So I made some scripts to do that.
It's a powershell script that I rewrote in bash as well, so that it can be used on windows, macOS, and linux.
Before running check the variables in the script to make sure all of the paths are point to the write place.
This script does the following
> - dumps the local database into a sql file
> - edits the sql file, replacing:
>     - ```INSERT INTO``` statements to ```INSERT OR REPLACE INTO```
>     - ```CREATE TABLE``` statements to ```CREATE TABLE IF NOT EXISTS```
> - transfers the file to the production server over ssh, using the scp command
> - reads the sql file into the production database using ssh

The edits that the script does before transferring the sql file are important
Otherwise edits to a specific item would be ignored, because the sqlite system would just error out, saying, that the unique constraint wasn't met.
By using ```INSERT OR REPLACE``` it will replace all items if they already exist.
The ```CREATE TABLE IF NOT EXISTS``` statements make sure that no warnings or errors are thrown.

# Final Thoughts
And that is how the Guiding Vision site was created.
Realistically speaking, it is a huge dumpster fire of bad ideas, horrible decisions, and amateur programming.
This entire documentation-ish file is largely just to appease the ego of the lead developer.
