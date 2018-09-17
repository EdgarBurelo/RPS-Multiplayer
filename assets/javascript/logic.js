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
dataB.ref().on("value", function(childSnapshot) {
    // Log everything that's coming out of snapshot
    //console.log(childSnapshot.val());
    var users1 = childSnapshot.val().users;
    //console.log(Object.getOwnPropertyNames(users1).length);
    RPSGame.numberOfUsrs = Object.getOwnPropertyNames(users1).length+1;
    
    
}, function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
  

var RPSGame = {
    "numberOfUsrs":0,
    "actualUsers":[],
    "logedinUser":"",
    "userGet": function() {
        dataB.ref("users").on("value", function(childSnapshot) {
            // Log everything that's coming out of snapshot
            //console.log(childSnapshot.val());
            var result = childSnapshot.val();
            var newArr = Object.getOwnPropertyNames(childSnapshot.val());
            //console.log(newArr);
            $(newArr).each(function(index,element) {
                //console.log(result[element]);
                RPSGame.actualUsers.push(result[element]);
            });
            
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    },
    "userCreate": function(usrname,usrpass,usremail) {
        var arrayComp = [];
        $(RPSGame.actualUsers).each(function(index,element){
            console.log(element.userName);
            arrayComp.push(element.userName);
        });
        if(arrayComp.indexOf(usrname) == -1) {
            name = RPSGame.numberOfUsrs+usrname;
            console.log(this.numberOfUsrs);
            RPSGame.numberOfUsrs++;
            dataB.ref("users/"+name).set({
                userName: usrname,
                pass: usrpass,
                email: usremail,
                wins: 0,
                loses: 0,
                playedGames: 0,
                WLRatio: 0,
                activeGames: [],
                date: moment().format("DD-MM-YY")
            });
        } else {
            console.log("already Exist");
        }
        
    },
    "login": function() {

    }

};

RPSGame.userGet();
