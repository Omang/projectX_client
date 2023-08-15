const express = require('express');
const dotenv = require('dotenv');
const airoutes = require('./routes/AiRoutes');
const useroutes = require('./routes/UserRoutes');
const Body_parser = require('body-parser');
const dbConnect = require('./config/dbConnect');
const cors = require('cors');
const app = express();
dotenv.config();
dbConnect();
const PORTS = process.env.PORT;
app.use(Body_parser.json());
app.use(Body_parser.urlencoded({extended: false}));
app.use(cors({
 
 credentials: true,
 origin: "https://openhelpportal.onrender.com"

}));

app.use('/ai', airoutes);
app.use('/user', useroutes);

app.listen(PORTS, ()=>{
    console.log(`Server listerning at: ${PORTS}`)
});