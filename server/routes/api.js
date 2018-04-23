const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;
const Server = require('mongodb').Server;
const ObjectID = require('mongodb').ObjectID;

const url = "mongodb://localhost:27017/blogData";

// Connect
let mongodb = null;
MongoClient.connect(url, {poolSize: 10}, (err, database) => {
  if(err) throw err;
  mongodb = database.db('blogData');
});


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
let responseContents = {
  status: 200,
  data: [],
  total: 0,
  message: null
};

// Get boardContent As Paging
router.post('/boardContent/contents', (req, res) => {
  if (req.body.sub_order == "no") {
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id } )
      .count()
      .then((item_size) => {
        response.total = item_size;
      })
      .catch((err) => {
          sendError(err, res);
    });

    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id } )
      .sort( { "index": -1, "date": -1 } )
      .skip((req.body.page-1)*req.body.page_cnt)
      .limit(req.body.page_cnt)
      .toArray()
      .then((boardContent) => {
          response.data = boardContent;
          res.json(response);
      })
      .catch((err) => {
          sendError(err, res);
    });
  } else {
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order } )
      .count()
      .then((item_size) => {
        response.total = item_size;
      })
      .catch((err) => {
          sendError(err, res);
    });

    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order } )
      .sort( { "index": -1, "date": -1 } )
      .skip((req.body.page-1)*req.body.page_cnt)
      .limit(req.body.page_cnt)
      .toArray()
      .then((boardContent) => {
          response.data = boardContent;
          res.json(response);
      })
      .catch((err) => {
          sendError(err, res);
    });
  }
})
// Get search boardContent As Paging
// 아래의 코드 완전 수정해야 함. 위의 코드 그대로 따온거에 불과
router.post('/boardContent/search_contents', (req, res) => {
  var option = req.body.board_content_search_selected_option;
  if (option == 0) { // 제목
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order, "title": { $regex: req.body.board_content_search_word } } )
      .count()
      .then((item_size) => {
        response.total = item_size;
      })
      .catch((err) => {
          sendError(err, res);
    });
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order, "title": { $regex: req.body.board_content_search_word } } )
      .sort( { "index": -1, "date": -1 } )
      .skip((req.body.page-1)*req.body.page_cnt)
      .limit(req.body.page_cnt)
      .toArray()
      .then((boardContent) => {
          response.data = boardContent;
          res.json(response);
      })
      .catch((err) => {
          sendError(err, res);
    });
  } else if (option == 1) { // 내용
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order, "contents": { $regex: req.body.board_content_search_word } } )
      .count()
      .then((item_size) => {
        response.total = item_size;
      })
      .catch((err) => {
          sendError(err, res);
    });
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order, "contents": { $regex: req.body.board_content_search_word } } )
      .sort( { "index": -1, "date": -1 } )
      .skip((req.body.page-1)*req.body.page_cnt)
      .limit(req.body.page_cnt)
      .toArray()
      .then((boardContent) => {
          response.data = boardContent;
          res.json(response);
      })
      .catch((err) => {
          sendError(err, res);
    });
  } else if (option == 2) { // 제목+내용
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order, $or: [ { "title": { $regex: req.body.board_content_search_word } }, { "contents": { $regex: req.body.board_content_search_word } } ] } )
      .count()
      .then((item_size) => {
        response.total = item_size;
      })
      .catch((err) => {
          sendError(err, res);
    });
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order, $or: [ { "title": { $regex: req.body.board_content_search_word } }, { "contents": { $regex: req.body.board_content_search_word } } ] } )
      .sort( { "index": -1, "date": -1 } )
      .skip((req.body.page-1)*req.body.page_cnt)
      .limit(req.body.page_cnt)
      .toArray()
      .then((boardContent) => {
          response.data = boardContent;
          res.json(response);
      })
      .catch((err) => {
          sendError(err, res);
    });
  } else if (option == 3) { // 작성자
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order, "author": { $regex: req.body.board_content_search_word } } )
      .count()
      .then((item_size) => {
        response.total = item_size;
      })
      .catch((err) => {
          sendError(err, res);
    });
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order, "author": { $regex: req.body.board_content_search_word } } )
      .sort( { "index": -1, "date": -1 } )
      .skip((req.body.page-1)*req.body.page_cnt)
      .limit(req.body.page_cnt)
      .toArray()
      .then((boardContent) => {
          response.data = boardContent;
          res.json(response);
      })
      .catch((err) => {
          sendError(err, res);
    });
  }
})
// Delete boardContent document
router.patch('/boardContent/content/isDeleted', (req, res) => {
  mongodb.collection('boardContent')
         .update( { "_id": ObjectID(req.body._id)}, { $set: {"isDeleted": true}})
         .then((boardContent) => {
            response.data = boardContent;
            res.json(response);
         })
         .catch((err) => {
            sendError(err, res);
       });
})
// Get boardContent sub content's max index
router.post('/boardContent/maxIndex', (req, res) => {
    mongodb.collection('boardContent')
      .find( { "isDeleted": false, "super_id": req.body.super_id, "sub_order": req.body.sub_order } )
      .sort( { "index": -1 } )
      .limit(1)
      .toArray()
      .then((max_index) => {
        response.data = max_index[0].index;
        res.json(response);
      })
      .catch((err) => {
          sendError(err, res);
    });
})
// Add boardContent
router.post('/boardContent', (req, res) => {
  mongodb.collection('boardContent').insert(req.body)
    .then((boardContent) => {
      response.data = boardContent;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
})
// Update boardContent content info
router.patch('/boardContent/content', (req, res) => {
  mongodb.collection('boardContent')
    .update( { "_id": ObjectID(req.body._id)}, { $set: {"super_id": req.body.super_id, "sub_order": req.body.sub_order, "title": req.body.title, "contents": req.body.contents, "date": req.body.date, "views": req.body.views}})
    .then((viewCount) => {
        response.data = viewCount;
        res.json(response);
    })
    .catch((err) => {
        sendError(err, res);
  });
})
// Update boardContent view count
router.patch('/boardContent/viewCount', (req, res) => {
  mongodb.collection('boardContent')
    .update( { "_id": ObjectID(req.body._id)}, { $set: {"views": req.body.views}})
    .then((viewCount) => {
        response.data = viewCount;
        res.json(response);
    })
    .catch((err) => {
        sendError(err, res);
  });
})

// Get guestBook
router.get('/guestBook', (req, res) => {
  mongodb.collection('guestBook')
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
})
// Delete guestBook document
router.patch('/guestBook', (req, res) => {
  mongodb.collection('guestBook')
         .update( { "_id": ObjectID(req.body._id)}, { $set: {"isDeleted": true}});
})
// Save Json Data To 'guestBook' Collection
router.post('/guestBook', (req, res) => {
  mongodb.collection('guestBook').insert(req.body)
    .then((guestBook) => {
      response.data = guestBook;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
})

// Get 'userInfo' Collection From 'blogData' Database
router.get('/userInfo', (req, res) => {
  mongodb.collection('userInfo')
    .find( { "isDeleted": false } )
    .toArray()
    .then((userInfo) => {
        response.data = userInfo;
        res.json(response);
    })
    .catch((err) => {
        sendError(err, res);
  });
})
// Save Json Data To 'userInfo' Collection
router.post('/userInfo', (req, res) => {
  mongodb.collection('userInfo').insert(req.body)
    .then((userInfo) => {
      response.data = userInfo;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
})

// Get studyTopMenu
router.get('/studyTopMenu', (req, res) => {
  mongodb.collection('studyTopMenu')
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
// Add studyTopMenu
router.post('/studyTopMenu', (req, res) => {
  mongodb.collection('studyTopMenu').insert(req.body)
    .then((studyTopMenu) => {
      response.data = studyTopMenu;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
})
// Delete studyTopMenu item
router.patch('/studyTopMenu', (req, res) => {
  mongodb.collection('studyTopMenu')
         .update( { "_id": ObjectID(req.body._id)}, { $set: {"isDeleted": true}});
})
// Get studySubMenu
router.get('/studySubMenu', (req, res) => {
  mongodb.collection('studySubMenu')
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
// Add studySubMenu
router.post('/studySubMenu', (req, res) => {
  mongodb.collection('studySubMenu').insert(req.body)
    .then((studySubMenu) => {
      response.data = studySubMenu;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
})
// Delete studySubMenu item
router.patch('/studySubMenu', (req, res) => {
  mongodb.collection('studySubMenu')
         .update( { "_id": ObjectID(req.body._id)}, { $set: {"isDeleted": true}});
})

// Add Main page accessInfo
router.post('/accessMainLog', (req, res) => {
  mongodb.collection('accessMainLog').insert(req.body)
    .then((accessMainLog) => {
      response.data = accessMainLog;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
})
// Add Login User accessInfo
router.post('/accessLoginLog', (req, res) => {
  mongodb.collection('accessLoginLog').insert(req.body)
    .then((accessLoginLog) => {
      response.data = accessLoginLog;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
})
// Get Study page accessInfo
router.get('/accessStudyLog', (req, res) => {
  mongodb.collection('accessStudyLog')
    .find()
    .sort( { "access_time": -1} )
    .toArray()
    .then((accessStudyLog) => {
        response.data = accessStudyLog;
        res.json(response);
    })
    .catch((err) => {
        sendError(err, res);
  });
});
// Add Study page accessInfo
router.post('/accessStudyLog', (req, res) => {
  mongodb.collection('accessStudyLog').insert(req.body)
    .then((accessStudyLog) => {
      response.data = accessStudyLog;
      res.json(response);
    })
    .catch((err) => {
      sendError(err, res);
    });
})

module.exports = router;
