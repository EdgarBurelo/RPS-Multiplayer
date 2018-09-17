// Initialize Firebase
var config = {
    apiKey: "AIzaSyChanswKw6AnZYI3B6lec7bLiMIrc_l1P4",
    authDomain: "rps-multiplayer-51613.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-51613.firebaseio.com",
    projectId: "rps-multiplayer-51613",
    storageBucket: "",
    messagingSenderId: "476067623389"
  };
  firebase.initializeApp(config);

  var dataB = firebase.database();

  

var RPSGame = {
    "userCreate": function(usrname,usrpass,usremail) {
        dataB.ref("users").push({
            name: usrname,
            pass: usrpass,
            email: usremail
        });
    },
    "login": function() {

    },


};


  dataB.ref("users").on("child_added", function(childSnapshot) {

    // Log everything that's coming out of snapshot
    console.log(childSnapshot.val());
    
    
    // Handle the errors
  }, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });