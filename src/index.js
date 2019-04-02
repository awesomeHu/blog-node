const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const app = express();
const path = require('path');
const mongoose = require('mongoose')
const mongodb = require('./core/mongodb')
const morgan = require('morgan')
const cors = require('cors')


app.use(morgan('combined'));

//To enable cross-origin requests
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
// app.use(express.static(public))

// use cookies with Express, parses cookies attached to the client request object
app.use(cookieParser('blog_node_cookie'));

app.use(
	session({
		secret: 'blog_node_cookie',
		resave: true,
		saveUninitialized: true,
		cookie: { maxAge: 60 * 1000 * 30, httpOnly: true }, //expire time
	}),
);
//Because Mongoose 4 relied on its own promise implementation, mpromise. mongoose.Promise wasn't necessarily Promise global.
mongoose.Promise = global.Promise

//connect to the database
mongodb.connect();

// set up view engine
app.set('view', path.join(__dirname, 'views')) // set the directory of storing ejs
app.set('view engine', 'ejs')  // set view engine as ejs


const routes = require('./routes/index.js');//Importing routes
routes(app)//Register the routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server has started on ${PORT}....`))

