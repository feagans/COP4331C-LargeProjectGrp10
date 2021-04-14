const { title } = require("process");
//add this to the top:
const sha256 = require("js-sha256");
const jwt = require("./createJWT");

exports.setApp = function (app, client) {
  //Login API
  app.post("/api/login", async (req, res, next) => {
    // incoming: login, password  // outgoing: id, firstName, lastName, error
    var error = "";
    const { login, password } = req.body;
    const db = client.db();
    const results = await db
      .collection("Users")
      .find({ login: login, password: sha256(password) })
      .toArray();
    var id = -1;
    var fn = "";
    var ln = "";
    var em = "";
    var ver = false;
    var emTok = "";
    var myToken = null;
    if (results.length > 0) {
      id = results[0]._id;
      fn = results[0].firstName;
      ln = results[0].lastName;
      em = results[0].email;
      ver = results[0].isVerified;
      emTok = results[0].emailTok;
      try {
        myToken = jwt.createToken(fn, ln, id);
      } catch (e) {
        console.log(e.message);
      }
      var ret = {
        id: id,
        firstName: fn,
        lastName: ln,
        email: em,
        isVerified: ver,
        emailTok: emTok,
        jwt: myToken,
        error: "",
      };
      res.status(200).json(ret);
    } else {
      var ret = {
        id: id,
        firstName: fn,
        lastName: ln,
        email: em,
        isVerified: ver,
        emailTok: emTok,
        error: "",
      };
      res.status(204).json(ret);
    }
  });
  const sgMail = require("@sendgrid/mail");
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  //Register API
  app.post("/api/register", async (req, res, next) => {
    // incoming: firstName, lastName, login, email, password      // outgoing: error/no error
    const crypto = require("crypto");
    const { firstName, lastName, login, email, password } = req.body;
    const newUser = {
      firstName: firstName,
      lastName: lastName,
      login: login,
      email: email,
      emailTok: crypto.randomBytes(64).toString("hex"),
      password: sha256(password),
      isVerified: false,
    };
    var error = "";
    const db = client.db();
    const results = await db
      .collection("Users")
      .find({ login: login })
      .toArray();
    if (results.length > 0) {
      error = "The Username you entered is already in use";
      var ret = { error: error };
      res.status(500).json(ret);
    } else {
      const msg = {
        from: "letsbuckitgroup10@gmail.com",
        to: req.body.email,
        subject: "LetsBuckit - Email Verification",
        text: ` 
                    Hello!
                    Thank you for signing up for LetsBuckit! 
                    Please copy and paste the following link in your browser to verify your account:
                    http://${req.headers.host}/api/verify-email?token=${newUser.emailTok} 
                `,
        html: `
                    <h2>Hello!</h2>
                    <p>Thank you for signing up for LetsBuckit!</p>
                    <p>Please click the link below to verify your account:</p>
                    <a href="http://${req.headers.host}/api/verify-email?token=${newUser.emailTok}">Verify Your Account</a>
                `,
      };
      try {
        const db = client.db();
        const result = db.collection("Users").insertOne(newUser);
        try {
          await sgMail.send(msg);
          //req.flash('success');
          res.redirect("/login");
        } catch (er) {
          console.log(er);
          //req.flash('an error has occured');
          req.redirect("/");
          error = er.toString();
          var ret = { error: error };
          res.status(500).json(ret);
        }
      } catch (e) {
        error = e.toString();
      }
      var ret = { error: error };
      res.status(200).json(ret);
    }
  });

  app.post("/api/verify-email", async (req, res, next) => {
    var err = "";
    const db = client.db();
    try {
      //  const user = await db.collection('Users').findOne({emailTok : req.query.token});
      const results = await db
        .collection("Users")
        .find({ emailTok: req.query.token })
        .toArray();
      var myQuery = { emailTok: req.query.token };
      var newVal = { $set: { emailTok: null, isVerified: true } };
      if (results.length == 0) {
        var ret = { error: "No User Found" };
        res.status(204).json(ret);
        // req.flash('error!');
        // return res.redirect('/');
      } else {
        results[0].emailTok = null;
        results[0].isVerified = true;
        // await results[0].save();
        db.collection("Users").updateOne(myQuery, newVal, function (err, res) {
          if (err) throw err;
          console.log("Collection Item Updated");
        });
        var ret = { error: err };
        res.status(200).json(ret);
      }
    } catch (error) {
      console.log(error);
      err = error.toString();
      var ret = { error: err };
      res.status(500).json(ret);
    }
  });

  app.post("/api/send-password-recovery", async (req, res, next) => {
    var error = "";
    const crypto = require("crypto");
    try {
      try {
        const db = client.db();
        const { login } = req.body;
        const results = await db
          .collection("Users")
          .find({ login: req.body.login })
          .toArray();
        if (results.length > 0) {
          const tok = crypto.randomBytes(64).toString("hex");
          var myQuery = { login: login };
          var newVal = { $set: { passwordResetTok: tok } };
          db.collection("Users").updateOne(
            myQuery,
            newVal,
            function (err, res) {
              if (err) throw err;
              console.log("Collection Item Updated");
            }
          );
          const msg = {
            from: "letsbuckitgroup10@gmail.com",
            to: results[0].email,
            subject: "LetsBuckit - Password Reset",
            text: ` 
                        Hello! 
                        Copy and paste the following link in your browser to reset your password:
                        http://${req.headers.host}/api/password-reset?token=${tok} 
                        If you did not request this password reset link, please consider changing your password. 
                    `,
            html: `
                        <h2>Hello!</h2>
                        <p>Click the link below to reset your password:</p>
                        <a href="http://${req.headers.host}/api/password-reset?token=${tok}">Verify Your Account</a>
                    
                        <p>If you did not request this password reset link, please consider changing your password.</p>
                        `,
          };
          try {
            await sgMail.send(msg);
            console.log("Password Reset Email Sent");
            // res.redirect('/');
          } catch (er) {
            console.log(er);
            //req.flash('an error has occured');
            // req.redirect('/');
            error = er.toString();
            var ret = { error: error };
            res.status(500).json(ret);
          }
          var ret = { error: error };
          res.status(200).json(ret);
        } else {
          var ret = { error: "Username does not exist" };
          res.status(204).json(ret);
        }
      } catch (er) {
        console.log(er);
        var ret = { error: er.toString() };
        res.status(500).json(ret);
      }
    } catch (err) {
      console.log(err);
      var ret = { error: err.toString() };
      res.status(500).json(ret);
    }
  });

  app.post("/api/password-reset", async (req, res, next) => {
    const { newPassword } = req.body;
    var error = "";
    const db = client.db();
    try {
      const results = await db
        .collection("Users")
        .find({ passwordResetTok: req.query.token })
        .toArray();
      // console.log(results.length);
      if (results.length > 0) {
        var myQuery = { passwordResetTok: req.query.token };
        var newVal = {
          $set: {
            password: sha256(req.body.newPassword),
            passwordResetTok: null,
          },
        };
        db.collection("Users").updateOne(myQuery, newVal, function (err, res) {
          if (err) throw err;
          console.log("Collection Item Updated");
        });
        var ret = { error: error };
        res.status(200).json(ret);
      } else {
        // console.log("No User Found");
        var ret = { error: "Invalid Token" };
        res.status(204).json(ret);
        // return res.redirect('/');
      }
    } catch (err) {
      error = err.toString();
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  //Send a Friend Request
  app.post("/api/fr-request", async (req, res, next) => {
    // incoming: sender Id, reciever Id      // outgoing: error/no error
    const { senderID, login } = req.body;
    var error = "";
    var recieverID;
    const db = client.db();
    const results2 = await db
      .collection("Users")
      .find({ login: login })
      .toArray();
    if (results2.length < 1) {
      error = "The username specified does not exist.";
      var ret = { error: error };
      res.status(500).json(ret);
    }
    recieverID = results2[0]._id;
    recieverID = recieverID.toString();
    const newFR = { senderID: senderID, recieverID: recieverID };

    const results = await db
      .collection("Request")
      .find({ senderID: senderID, recieverID: recieverID })
      .toArray();
    const results1 = await db
      .collection("Request")
      .find({ senderID: recieverID, recieverID: senderID })
      .toArray();
    if (results.length > 0) {
      error = "There is an existing friend request or friendship already.";
      var ret = { error: error };
      res.status(500).json(ret);
    } else if (results1.length > 0) {
      error = "There is an existing friend request or friendship already.";
      var ret = { error: error };
      res.status(500).json(ret);
    } else {
      try {
        const db = client.db();
        const result = db.collection("Request").insertOne(newFR);
      } catch (e) {
        error = e.toString();
      }
      var ret = { error: error };
      res.status(200).json(ret);
    }
  });

  //Query All Friend Request for Users
  app.post("/api/all-requests", async (req, res, next) => {
    // incoming: userId // outgoing: list of all friendIDs which are pending a request, error
    var error = "";
    var x = 0;
    var i;
    const { userID } = req.body;
    const db = client.db();
    const results = await db
      .collection("Request")
      .find({ senderID: userID })
      .toArray();
    const results1 = await db
      .collection("Request")
      .find({ recieverID: userID })
      .toArray();
    var _ret = [];
    for (i = 0; i < results.length; i++) {
      results.push(results1[x]);
      x++;
    }
    if (results.length < 1) {
      error = "No requests";
      var ret = { error: error };
      res.status(500).json(ret);
    } else {
      var ret = { results: _ret, error: error };
      res.status(200).json(ret);
    }
  });

  //Accept/Decline Friend Request
  app.post("/api/fr-response", async (req, res, next) => {
    const { userID, friendID, status } = req.body;
    const newFriend = { userID: userID, friendID: friendID };
    var error = "";
    const db = client.db();
    const results = await db
      .collection("Request")
      .find({ senderID: userID, recieverID: friendID })
      .toArray();
    const results1 = await db
      .collection("Request")
      .find({ senderID: friendID, recieverID: userID })
      .toArray();
    if (results.length > 0) {
      const removePending = { senderID: userID, recieverID: friendID };
      if (status == "A") {
        try {
          const db = client.db();
          const result = db.collection("Friends").insertOne(newFriend);
          const result1 = db.collection("Request").remove(removePending);
        } catch (e) {
          error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
      } else {
        try {
          const db = client.db();
          const result1 = db.collection("Request").remove(removePending);
        } catch (e) {
          error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
      }
    } else if (results1.length > 0) {
      const removePending1 = { senderID: friendID, recieverID: userID };
      if (status == "A") {
        try {
          const db = client.db();
          const result = db.collection("Friends").insertOne(newFriend);
          const result1 = db.collection("Request").remove(removePending1);
        } catch (e) {
          error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
      } else {
        try {
          const db = client.db();
          const result1 = db.collection("Request").remove(removePending);
        } catch (e) {
          error = e.toString();
        }
        var ret = { error: error };
        res.status(200).json(ret);
      }
    } else {
      error = "No pending friend request found.";
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  //Remove a friend
  app.post("/api/fr-remove", async (req, res, next) => {
    // incoming: userId, friendId  // outgoing: error
    var error = "";
    const { userId, friendId } = req.body;
    const FRemove = { userId: userId, friendId: friendId };
    const FRemove1 = { userId: friendId, friendId: userId };
    const db = client.db();
    const results = await db
      .collection("Friends")
      .find({ userId: userId, friendId: friendId })
      .toArray();
    const results1 = await db
      .collection("Friends")
      .find({ userId: friendId, friendId: userId })
      .toArray();

    if (results.length > 0) {
      const result = db.collection("Friends").remove(FRemove);
      var ret = { error: error };
      res.status(200).json(ret);
    } else if (results1.length > 0) {
      const result = db.collection("Friends").remove(FRemove1);
      var ret = { error: error };
      res.status(200).json(ret);
    } else {
      error = "No friend was found.";
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  //Show all friends for user
  app.post("/api/fr-allfriends", async (req, res, next) => {
    // incoming: userId // outgoing: list of ids, error
    var error = "";
    var x = 0;
    var i;
    const { userID } = req.body;
    const db = client.db();
    const results = await db
      .collection("Friends")
      .find({ userID: userID })
      .toArray();
    const results1 = await db
      .collection("Friends")
      .find({ friendID: userID })
      .toArray();
    var _ret = [];
    if (results.length > 0) {
      for (i = 0; i < results.length; i++) {
        _ret.push(results[i].friendID);
        x++;
      }
    }
    if (results1.length > 0) {
      for (i = 0; i < results1.length; i++) {
        _ret.push(results1[i].userID);
        x++;
      }
    }
    if (x == 0) {
      error = "No friends were found for this account";
      var ret = { error: error };
      res.status(500).json(ret);
    } else {
      var ret = { results: _ret, error: error };
      res.status(200).json(ret);
    }
  });

  //Add a bucket list item
  app.post("/api/add-bucket", async (req, res, next) => {
    // incoming: sender Id, reciever Id      // outgoing: error/no error
    const { userID, itemTitle, caption } = req.body;
    const newbucket = {
      userID: userID,
      itemTitle: itemTitle,
      caption: caption,
      completed: false,
    };
    var error = "";
    try {
      const db = client.db();
      const result = db.collection("Bucket").insertOne(newbucket);
    } catch (e) {
      error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
  });

  //Show all a users bucket list items
  app.post("/api/all-buckets", async (req, res, next) => {
    // incoming: userId // outgoing: list of all bucket list items, error
    var error = "";
    var x = 0;
    var i;
    const { userID } = req.body;
    const db = client.db();
    const results = await db
      .collection("Bucket")
      .find({ userID: userID })
      .toArray();

    if (results.length < 1) {
      error = "No bucket list items found";
      var ret = { error: error };
      res.status(500).json(ret);
    } else {
      var ret = { results: results, error: error };
      res.status(200).json(ret);
    }
  });

  //delete bucket list item
  app.post("/api/delete-bucket", async (req, res, next) => {
    // incoming: id of bucket      // outgoing: error/no error
    ObjectId = require("mongodb").ObjectID;
    const { ID } = req.body;
    var error = "";
    const db = client.db();
    const results = await db
      .collection("Bucket")
      .find({ _id: new ObjectId(ID) })
      .toArray();
    user = results[0].userID;
    item = results[0].itemTitle;
    cap = results[0].caption;
    complete = results[0].completed;
    const deletebucket = {
      _id: new ObjectId(ID),
      userID: user,
      itemTitle: item,
      caption: cap,
      completed: complete,
    };
    try {
      const db = client.db();
      const result = db.collection("Bucket").remove(deletebucket);
    } catch (e) {
      error = e.toString();
    }
    var ret = { error: error };
    res.status(200).json(ret);
  });

  //edit a bucket list item / mark as complete
  app.post("/api/edit-bucket", async (req, res, next) => {
    ObjectId = require("mongodb").ObjectID;
    const { ID, itemTitle, caption, completed } = req.body;
    var error = "";

    var myquery = { _id: new ObjectId(ID) };
    const db = client.db();
    var newvalues = {
      $set: { itemTitle: itemTitle, caption: caption, completed: completed },
    };
    db.collection("Bucket").updateOne(myquery, newvalues);

    var ret = { error: error };
    res.status(200).json(ret);
  });

  //Add a to do list item
  app.post("/api/add-todo", async (req, res, next) => {
    // incoming: sender Id, reciever Id      // outgoing: error/no error
    const { userID, itemTitle } = req.body;
    const newbucket = {
      userID: userID,
      itemTitle: itemTitle,
      completed: false,
    };
    var error = "";
    try {
      const db = client.db();
      const result = db.collection("To Do").insertOne(newbucket);
      var ret = { error: error };
      res.status(200).json(ret);
    } catch (e) {
      error = e.toString();
      console.log(error);
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  //Show all a users to do list items
  app.post("/api/all-todo", async (req, res, next) => {
    // incoming: userId // outgoing: list of all bucket list items, error
    var error = "";
    const { userID } = req.body;
    const db = client.db();
    const results = await db
      .collection("To Do")
      .find({ userID: userID })
      .toArray();

    if (results.length < 1) {
      error = "No to do list items found";
      var ret = { error: error };
      res.status(204).json(ret);
    } else {
      var ret = { results: results, error: error };
      res.status(200).json(ret);
    }
  });

  //delete to do list item
  app.post("/api/delete-todo", async (req, res, next) => {
    // incoming: id of bucket      // outgoing: error/no error
    ObjectId = require("mongodb").ObjectID;
    const { ID } = req.body;
    var error = "";
    const db = client.db();
    const results = await db
      .collection("To Do")
      .find({ _id: new ObjectId(ID) })
      .toArray();
    user = results[0].userID;
    item = results[0].itemTitle;
    complete = results[0].completed;
    const deletebucket = {
      _id: new ObjectId(ID),
      userID: user,
      itemTitle: item,
      completed: complete,
    };
    try {
      const db = client.db();
      const result = db.collection("To Do").remove(deletebucket);
      var ret = { error: error };
      res.status(200).json(ret);
    } catch (e) {
      error = e.toString();
      console.log(error);
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  //edit a to do list item / mark as complete
  app.post("/api/edit-todo", async (req, res, next) => {
    ObjectId = require("mongodb").ObjectID;
    const { ID, itemTitle, completed } = req.body;
    var error = "";
    try {
      var myquery = { _id: new ObjectId(ID) };
      const db = client.db();
      var newvalues = { $set: { itemTitle: itemTitle, completed: completed } };
      db.collection("To Do").updateOne(myquery, newvalues);

      var ret = { error: error };
      res.status(200).json(ret);
    } catch (er) {
      error = er.toString();
      console.log(error);
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  app.post("/api/mark-completed-todo", async (req, res, next) => {
    const { itemTitle, userID, completed } = req.body;
    var error = "";
    const db = client.db();
    try {
      var myQuery = { itemTitle: itemTitle, userID: userID };
      var newVal = { $set: { completed: completed } };
      db.collection("To Do").updateOne(myQuery, newVal, function (err, res) {
        if (err) throw err;
        console.log("Collection Item Updated");
      });
      var ret = { error: error };
      res.status(200).json(ret);
    } catch (er) {
      error = er.toString();
      console.log(error);
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  //search for a bucket list
  app.post("/api/search-bucket", async (req, res, next) => {
    var error = "";
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db();
    const results = await db
      .collection("Bucket")
      .find({ itemTitle: { $regex: _search + ".*", $options: "r" } })
      .toArray();
    var _ret = [];
    if (results.length < 1) {
      error = "No bucket list items found";
      var ret = { error: error };
      res.status(500).json(ret);
    }
    var ret = { results: results, error: error };
    res.status(200).json(ret);
  });

  //search for a to do list
  app.post("/api/search-todo", async (req, res, next) => {
    var error = "";
    const { userId, search } = req.body;
    var _search = search.trim();
    const db = client.db();
    const results = await db
      .collection("To Do")
      .find({ itemTitle: { $regex: _search + ".*", $options: "r" } })
      .toArray();
    var _ret = [];
    if (results.length < 1) {
      error = "No todo list items found";
      var ret = { error: error };
      res.status(500).json(ret);
    }
    var ret = { results: results, error: error };
    res.status(200).json(ret);
  });

  //change the login username
  app.post("/api/change-login", async (req, res, next) => {
    ObjectId = require("mongodb").ObjectID;
    const { userID, login, newLogin, password } = req.body;
    var error = "";
    var id = -1;
    var fn = "";
    var ln = "";
    var em = "";
    var ver = false;
    var emTok = "";
    const db = client.db();
    const results = await db
      .collection("Users")
      .find({
        _id: new ObjectId(userID),
        login: login,
        password: sha256(password),
      })
      .toArray();
    if (results.length < 1) {
      error = "Invalid username/password combination";
      var ret = { error: error };
      res.status(500).json(ret);
    }
    id = results[0]._id;
    var fn = results[0].firstName;
    var ln = results[0].lastName;
    var em = results[0].email;
    var ver = results[0].isVerified;
    var emTok = results[0].emailTok;

    try {
      var myquery = { _id: new ObjectId(id) };
      const db = client.db();
      var newvalues = {
        $set: {
          _id: id,
          firstName: fn,
          lastName: ln,
          login: newLogin,
          email: em,
          emailTok: emTok,
          password: sha256(password),
          isVerified: ver,
        },
      };
      db.collection("Users").updateOne(myquery, newvalues);

      var ret = { error: error };
      res.status(200).json(ret);
    } catch (er) {
      error = er.toString();
      console.log(error);
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  //change the email for a user
  app.post("/api/change-email", async (req, res, next) => {
    ObjectId = require("mongodb").ObjectID;
    const { userID, email, newEmail, password } = req.body;
    var error = "";
    var id = -1;
    var fn = "";
    var ln = "";
    var lg = "";
    var ver = false;
    var emTok = "";
    const db = client.db();
    const results = await db
      .collection("Users")
      .find({
        _id: new ObjectId(userID),
        email: email,
        password: sha256(password),
      })
      .toArray();
    if (results.length < 1) {
      error = "Invalid email/password combination";
      var ret = { error: error };
      res.status(500).json(ret);
    }
    id = results[0]._id;
    var fn = results[0].firstName;
    var ln = results[0].lastName;
    var lg = results[0].login;
    var ver = results[0].isVerified;
    var emTok = results[0].emailTok;

    try {
      var myquery = { _id: new ObjectId(id) };
      const db = client.db();
      var newvalues = {
        $set: {
          _id: id,
          firstName: fn,
          lastName: ln,
          login: lg,
          email: newEmail,
          emailTok: emTok,
          password: sha256(password),
          isVerified: ver,
        },
      };
      db.collection("Users").updateOne(myquery, newvalues);

      var ret = { error: error };
      res.status(200).json(ret);
    } catch (er) {
      error = er.toString();
      console.log(error);
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });

  //change the password for a user
  app.post("/api/change-password", async (req, res, next) => {
    ObjectId = require("mongodb").ObjectID;
    const { userID, login, password, newPassword } = req.body;
    var error = "";
    var id = -1;
    var fn = "";
    var ln = "";
    var em = "";
    var ver = false;
    var emTok = "";
    const db = client.db();
    const results = await db
      .collection("Users")
      .find({
        _id: new ObjectId(userID),
        login: login,
        password: sha256(password),
      })
      .toArray();
    if (results.length < 1) {
      error = "Invalid email/password combination";
      var ret = { error: error };
      res.status(500).json(ret);
    }
    id = results[0]._id;
    var fn = results[0].firstName;
    var ln = results[0].lastName;
    var em = results[0].email;
    var ver = results[0].isVerified;
    var emTok = results[0].emailTok;

    try {
      var myquery = { _id: new ObjectId(id) };
      const db = client.db();
      var newvalues = {
        $set: {
          _id: id,
          firstName: fn,
          lastName: ln,
          login: login,
          email: em,
          emailTok: emTok,
          password: sha256(newPassword),
          isVerified: ver,
        },
      };
      db.collection("Users").updateOne(myquery, newvalues);

      var ret = { error: error };
      res.status(200).json(ret);
    } catch (er) {
      error = er.toString();
      console.log(error);
      var ret = { error: error };
      res.status(500).json(ret);
    }
  });
};
