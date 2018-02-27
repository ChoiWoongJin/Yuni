const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017/blogData', (err, client) => {
        if (err) return console.log(err);
        let db = client.db('blogData');
        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get nav_menu
router.get('/nav_menu', (req, res) => {
    connection((db) => {
        db.collection('nav_menu')
            .find()
            .toArray()
            .then((nav_menu) => {
                response.data = nav_menu;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get content_board
router.get('/content_board', (req, res) => {
    connection((db) => {
        db.collection('content_board')
            .find()
            .toArray()
            .then((content_board) => {
                response.data = content_board;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
})

module.exports = router;
