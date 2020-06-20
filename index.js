const express = require('express');
const bodyparser = require('body-parser');

const app = express();

app.use(bodyparser.json());

app.get('/',(req,res,next) =>{
    res.send('Hello World');
})

app.listen(3000);