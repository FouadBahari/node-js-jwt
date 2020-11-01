const { verify } = require('crypto');
const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res) => {
    jwt.verify(req.token, 'secretKey', (err, authData) => {
        if (err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created',
                authData
            })
        }
    });
});

app.post('/api/login', (req, res) => {
    //Mock user
    const user = {
        id: 1,
        name: 'fouad',
        email: 'fouad@gmail.com'
    }
    jwt.sign({ user: user }, 'secretKey', { expiresIn: '30s' }, (err, token) => {
        res.json({
            token: token
        });
    });
});

//Format of Token
// Authorization : Bearer <access_token>


//Verify Token
function verifyToken(req, res, next) {
    //Get Auth header value
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined
    if (typeof(bearerHeader) !== 'undefined') {
        //Split at the space
        const bearer = bearerHeader.split(' ');
        //get token from  array
        const token = bearer[1];
        //set token
        req.token = token;
        //next middleware
        next();
    } else {
        //forbidden
        res.sendStatus(403);
    }
}
app.listen(3000, () => console.log('server connected'));