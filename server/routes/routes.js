const express = require("express");
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

const CONNECTION_URL = "mongodb+srv://ryan:Xcrunner1995@cluster0-uluvd.mongodb.net/test";
const DATABASE_NAME = "test";
const USERS_COLLECTION = "users";

router.post("/api/checkUsername", (req, res) => {
  MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true }, (error, client) => {
    if(error) {
        throw error;
    }
    var database = client.db(DATABASE_NAME);
    // console.log("Connected to " + DATABASE_NAME + "!");
    database.collection(USERS_COLLECTION, (err, collection) => {
      collection.find({ username: req.body.username }, (err, users) => {
        users.toArray((err, user) => {
          // console.log("HELLO: ", user);
          client.close();
          res.send({available: user.length === 0});
        });
      });
    });
  });
});

router.post("/api/createUser", (req, res) => {
  MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true }, (error, client) => {
    if(error) {
        throw error;
    }
    var database = client.db(DATABASE_NAME);
    database.collection(USERS_COLLECTION, (err, collection) => {
      collection.insertOne(req.body, (err, user) => {
        if(err) {
          res.send({success: false});
        } else {
          console.log("1 Document inserted: ", req.body);
          client.close();
          res.send({success: true});
        }
      });
    });
  });
});

router.post("/api/login", (req, res) => {
  MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true }, (error, client) => {
    if(error) {
        throw error;
    }
    var database = client.db(DATABASE_NAME);
    database.collection(USERS_COLLECTION, (err, collection) => {
      collection.find(req.body, (err, users) => {
        if(err) {
          res.send({"success": false, "message": "Authentication failed"});
        } else {
          users.toArray((err, user) => {
            console.log("LOGIN: ", user);
            client.close();
            if(user.length === 1) {
              res.send({success: true, "message": "User successfully authenticated"});
            } else {
              res.send({"success": false, "message": "Authentication failed"});
            }
            // res.send({available: user.length === 0});
          });
          // console.log("SUCCESS: ", user);
          // client.close();
          // res.send({success: true, "message": "User successfully authenticated"});
        }
      });
      // collection.insertOne(req.body, (err, user) => {
      //   if(err) {
      //     res.send({success: false});
      //   } else {
      //     console.log("1 Document inserted: ", req.body);
      //     client.close();
      //     res.send({success: true});
      //   }
      // });
    });
  });
})

// router.get("/api/mongo/:dbName//all", (req, res) => {
//   const CONNECTION_URL = "mongodb+srv://ryan:mongotest@cluster0-uluvd.mongodb.net/test";
//   const DATABASE_NAME = req.params.dbName;

//   MongoClient.connect(CONNECTION_URL, { useUnifiedTopology: true }, (error, client) => {
//     if(error) {
//         throw error;
//     }
//     var database = client.db(DATABASE_NAME);
//     // console.log("Connected to " + DATABASE_NAME + "!");
//     database.collection(req.params.collection, (err, collection) => {
//       collection.find({}, (err, users) => {
//         users.toArray((err,user) => {
//             res.send(user);
//           }
//         );
//       });
//     });
//   });
// });

module.exports = router;