require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const corsOptions = require('./config/corsOptions');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;

//Connect to MongoDB
connectDB();

//Custom middleware logger, next is required since it is custom.
app.use(logger);

//Cross origin resource sharing
app.use(cors(corsOptions));

app.use(express.urlencoded({extended: false}));

app.use(express.json());

app.use(express.static(path.join(__dirname, '/public')));
app.use('/', require('./routes/root'));
app.use('/states', require('./routes/api/states'));

//Route handlers
app.get('*', (req, res) =>{
    res.status(404);
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if(req.accepts('json')){
        res.json({error: "404 Not Found"});
    } else {
        res.type('txt').send("404 Not Found");
    }
})

app.use(errorHandler);

mongoose.connection.once('open', () =>{
    console.log('Connected to MongoDB');
    app.listen(PORT, () =>{
        console.log(`Server running on port ${PORT}`);
    });
});
