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

// Get studyTopMenu
router.get('/studyTopMenu', (req, res) => {
    connection((db) => {
        db.collection('studyTopMenu')
          .find( { "isDeleted": false } )
          .sort( { "order": 1 } )
          .toArray()
          .then((studyTopMenu) => {
              response.data = studyTopMenu;
              res.json(response);
          })
          .catch((err) => {
              sendError(err, res);
        });
    });
});
// Get studySubMenu
router.get('/studySubMenu', (req, res) => {
    connection((db) => {
        db.collection('studySubMenu')
          .find( { "isDeleted": false } )
          .sort( { "super": 1, "order": 1 } )
          .toArray()
          .then((studySubMenu) => {
              response.data = studySubMenu;
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
          .find( { "isDeleted": false } )
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

// Get guestBook
router.get('/guestBook', (req, res) => {
    connection((db) => {
        db.collection('guestBook')
          .find( { "isDeleted": false } )
          .sort( { "order": -1 } )
          .toArray()
          .then((guestBook) => {
              response.data = guestBook;
              res.json(response);
          })
          .catch((err) => {
              sendError(err, res);
        });
    });
})
// Delete guestBook document
router.patch('/guestBook', (req, res) => {
    connection((db) => {
        db.collection('guestBook')
          .update( { "_id": ObjectID(req.body._id)}, { $set: {"isDeleted": true}});
    });
})
// Save Json Data To 'guestBook' Collection
router.post('/guestBook', (req, res) => {
    connection((db) => {
        db.collection('guestBook').insert(req.body);
    });
})

// Get 'userInfo' Collection From 'blogData' Database
router.get('/userInfo', (req, res) => {
    connection((db) => {
        db.collection('userInfo')
          .find( { "isDeleted": false } )
          .toArray()
          .then((userInfo) => {
              response.data = userInfo;
              res.json(response);
          })
          .catch((err) => {
              sendError(err, res);
        });
    });
})
// Save Json Data To 'userInfo' Collection
router.post('/userInfo', (req, res) => {
    connection((db) => {
        db.collection('userInfo').insert(req.body);
    });
})

module.exports = router;
