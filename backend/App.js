// import/require packages
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// initialize app
const app = express();
const port = process.env.PORT || 4000;

//Create a database in your atlas.
//Put the credentials in the code below

//connect to mongoose
// username: b43_merng_db
// Password: N6VSYcNm2zvbOiwH

let databaseURL =
	process.env.DATABASE_URL ||
	"mongodb+srv://b43_merng_db:N6VSYcNm2zvbOiwH@cluster0-idqso.mongodb.net/capstone3?retryWrites=true&w=majority";

mongoose.connect(databaseURL, {
	useCreateIndex: true,
	useNewUrlParser: true
});

// Console.log to know if you are connected to mongoDB
mongoose.connection.once("open", () => {
	console.log("Connected to mongoDB.");
});

// for images
app.use(bodyParser.json({ limit: "15mb" }));

//allow users to access a folder in the server by serving the static data
// syntax: app.use("/path", express.static("folder to serve"))
app.use("/images", express.static("images"));

//cors
const cors = require("cors");

// Initialize apollo server
const server = require("./queries/queries");

// Serve the app using apolloServer
server.applyMiddleware({
	app,
	path: "/capstone3"
});

app.use(cors());

//create a listener to log if you are connected
app.listen(port, () => {
	console.log(`🚀  Server ready at localhost:${port}${server.graphqlPath}`);
});

// this will not work if there is no "./queries/queries" directory.
// next step is to create it
