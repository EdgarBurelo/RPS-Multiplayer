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
    "actualUser":"",
    "numberOfUsrs":0,
    "actualUsers":[],
    "logedinUser":"",
    "activeGames":[],
    "numberofActiveGame":0,
    "logStatus":false,
    "userGet": function() {
        RPSGame.actualUsers = [];
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
        RPSGame.userGet();
        
    },
    "activeGamesGet":function() {
        RPSGame.activeGames = [];
        dataB.ref("games").on("value", function(childSnapshot) {
            // Log everything that's coming out of snapshot
            //console.log(childSnapshot.val());
            var result = childSnapshot.val();
            var newArr = Object.getOwnPropertyNames(childSnapshot.val());
            //console.log(newArr);
            RPSGame.numberofActiveGame = Object.getOwnPropertyNames(childSnapshot.val()).length+1;
            $(newArr).each(function(index,element) {
                //console.log(result[element]);
                RPSGame.activeGames.push(result[element]);
            });

            
            
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    },
    "createGame": function() {
        //get Both users review if they already have one playing game.
        
        // $(RPSGame.actualUsers).each(function(index,element){
        //     console.log(element.userName);
        //     arrayComp.push(element.userName);
        // });
        // if(arrayComp.indexOf(usrname) == -1) {
            name = RPSGame.numberofActiveGame+"game";
        //     console.log(this.numberOfUsrs);
        //     RPSGame.numberOfUsrs++;
            dataB.ref("games/"+name).set({
                Challenger: "N",
                Challenged: "N",
                ChallengerChoice:"N",
                ChallengedChoice: "N",
                Active:true,
                winner: 0,
                loser: 0,
                date: moment().format("DD-MM-YY")
            });
        //} else {
            //console.log("already Exist");
        //}
        RPSGame.activeGamesGet();
    },
    "logStatusRev": function() {
        var localusr = localStorage.getItem("user");
        console.log(localusr);
        if(localusr) {
            console.log("logged");
            RPSGame.logStatus = true;
            RPSGame.actualUser = localusr;
        } else {
            console.log("not logged");
        }
    },
    "login": function(usr,password) {
        if(!this.logStatus) {
            $(this.actualUsers).each(function(index,element) {
                if(usr == element.userName && password == element.pass) {
                    RPSGame.logStatus = true;
                    RPSGame.actualUser = usr;
                    localStorage.setItem("user", usr);
                }
            });
            if(RPSGame.logStatus) {
                console.log("you're logged in");
            } else{
                console.log("Wrong Usr or pass");
            }
        } else {
            console.log("you're already logged in");
        }
    },
    "logout": function() {
        if(this.logStatus){
            localStorage.removeItem("user");
            this.actualUser="";
            this.logStatus = false;
        } else{
            console.log("You're already logged out!");
        }
    }
};

RPSGame.userGet();
RPSGame.activeGamesGet();
RPSGame.logStatusRev();
