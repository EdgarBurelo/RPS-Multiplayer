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
    "actualUserGames":[],
    "numberOfUsrs":0,
    "actualUsers":[],
    "logedinUser":"",
    "activeGames":[],
    "selectedGame":"",
    "numberofActiveGame":0,
    "logStatus":false,
    "userGet": function() {
        RPSGame.actualUsers = [];
        dataB.ref("users").once("value").then(function(childSnapshot) {
            // Log everything that's coming out of snapshot
            //console.log(childSnapshot.val());
            var result = childSnapshot.val();
            var newArr = [];
            newArr = Object.getOwnPropertyNames(childSnapshot.val());
            //console.log(newArr);
            $(newArr).each(function(index,element) {
                //console.log(result[element]);
                RPSGame.actualUsers.push(result[element]);
            });
            RPSGame.numberOfUsrs=RPSGame.actualUsers.length;
            
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    },
    "userCreate": function(usrname,usrpass,usremail) {
        if(!this.logStatus){
            localStorage.removeItem("user");
            var arrayComp = [];
            $(RPSGame.actualUsers).each(function(index,element){
                console.log(element.userName);
                arrayComp.push(element.userName);
            });
            
            if(arrayComp.indexOf(usrname) == -1) {
                name = usrname;
                console.log(this.numberOfUsrs);
                dataB.ref("users/"+name).set({
                    userName: usrname,
                    pass: usrpass,
                    email: usremail,
                    wins: 0,
                    loses: 0,
                    ties:0,
                    playedGames: 0,
                    WLRatio: 0,
                    activeGames: [],
                    date: moment().format("DD-MM-YY")
                });
                localStorage.setItem("user", usrname);
                RPSGame.numberOfUsrs++;
                RPSGame.logStatus = true;
                RPSGame.actualUser = usrname;

            } else {
                //Bootstrap alert already exist
                console.log("already Exist");
            }
            RPSGame.userGet();
        }
        //function for loginDOM
        
    },
    "activeGamesGet":function() {
        RPSGame.activeGames = [];
        dataB.ref("games").once("value").then(function(childSnapshot) {
            // Log everything that's coming out of snapshot
            //console.log(childSnapshot.val());
            var result = childSnapshot.val();
            var newArr = Object.getOwnPropertyNames(childSnapshot.val());
            //console.log(newArr);
            RPSGame.numberofActiveGame = Object.getOwnPropertyNames(childSnapshot.val()).length;
            $(newArr).each(function(index,element) {
                //console.log(result[element]);
                RPSGame.activeGames.push(result[element]);
            });

            
            
        }, function(errorObject) {
            console.log("Errors handled: " + errorObject.code);
        });
    },
    "createGame": function(challenger,challenged) {
        //review both users Exists
        var arrayComp = [];
        var arrGame = [];
        $(this.actualUsers).each(function(i,ele) {
            if(ele.userName == challenger || ele.userName == challenged) {
                arrayComp.push(ele.userName);
            }
        });
        //console.log(arrayComp.length);
        $(this.activeGames).each(function(i,ele){
            if((ele.Challenged == challenged || ele.Challenger == challenged) && (ele.Challenged == challenger || ele.Challenger == challenger)){
                arrGame.push(ele.gameName);
            }
        });
        //console.log(arrGame.length);
        //get Both users review if they already have one playing game.
        
        if(arrayComp.length == 2 && arrGame.length == 0) {
            name = RPSGame.numberofActiveGame+"game";
        
            dataB.ref("games/"+name).set({
                gameName: name,
                Challenger: challenger,
                Challenged: challenged,
                ChallengerChoice: false,
                ChallengedChoice: false,
                Active:true,
                status:true,
                winner: 0,
                loser: 0,
                tie:0,
                ChallengerWins:0,
                ChallengedWins:0,
                ChallengedContinue:false,
                ChallengerContinue:false,
                date: moment().format("DD-MM-YY")
            });
        } else {
            console.log("already Exist");
        }
        RPSGame.activeGamesGet();
        RPSGame.userGameGet(challenger);
    },
    "logStatusRev": function() {
        var localusr = localStorage.getItem("user");
        console.log(localusr);
        if(localusr) {
            console.log("logged");
            RPSGame.logStatus = true;
            RPSGame.actualUser = localusr;
            RPSGame.userGameGet(localusr);
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
                    RPSGame.userGameGet(usr);
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
    },
    "startDOM":function() {
        //generate the login for the user, button select for continue, newgame & General Stats
    },
    "continueGameDOM":function() {
        //Generate the area with options of the games that are active for the user and go back button, 
    },
    "newGameDOM":function() {
        //Generate an automatic search for new challenger and a button to look for other users and a button to create game
    },
    "gameDOM":function(game) {
        //once a game is started or continued, generate the game according to the status

    },
    "loginDOM": function(){
        //place to login or create newuser
    },
    "gameStatsDom": function() {

    },
    "userSelectGame":function(game) {
        RPSGame.selectedGame = "";
        $(RPSGame.actualUserGames).each(function(index,element){
            if(game == element.gameName) {
                RPSGame.selectedGame = element;
            }
        });
        
    },
    "userSelectOption":function(user,option) {
        if(user == RPSGame.selectedGame.Challenger && !RPSGame.selectedGame.ChallengerChoice) {
            console.log("Your choice is: "+option);
            RPSGame.selectedGame.ChallengerChoice = option;
            //modify Firebase
            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                ChallengerChoice: option
            });
            RPSGame.finishGameEval();
        } else if(user == RPSGame.selectedGame.Challenged && !RPSGame.selectedGame.ChallengedChoice){
            console.log("Your choice is: "+option);
            RPSGame.selectedGame.ChallengedChoice = option;
            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                ChallengedChoice: option
            });
            RPSGame.finishGameEval();
        }else {
            console.log("already selected");
        }
        RPSGame.activeGamesGet();
        RPSGame.userGameGet(user);
        RPSGame.userSelectGame(RPSGame.selectedGame.gameName);
        

    },
    "userGameGet":function(user) {
        if(this.logStatus) {
            RPSGame.actualUserGames = [];
            dataB.ref("games").once('value').then(function(childSnapshot) {
                // Log everything that's coming out of snapshot
                //console.log(childSnapshot.val());
                var result = childSnapshot.val();
                var newArr = Object.getOwnPropertyNames(childSnapshot.val());
                //console.log(newArr);
                $(newArr).each(function(index,element) {
                    //console.log(result[element]);
                    if(result[element].Challenged == user || result[element].Challenger == user){
                        RPSGame.actualUserGames.push(result[element]);
                    }
                    //RPSGame.activeGames.push(result[element]);
                });
            }, function(errorObject) {
                console.log("Errors handled: " + errorObject.code);
            });

        }
    },
    "finishGameEval":function() {
        if(this.selectedGame.ChallengerChoice != false && this.selectedGame.ChallengedChoice != false) {
            console.log("finish Game");
            var challengerI=[];
            var challengedI=[];
            $(RPSGame.actualUsers).each(function(i,element){
                if(element.userName == RPSGame.selectedGame.Challenger){
                    challengerI.push(i);
                    //console.log(challengerI);
                }else if(element.userName == RPSGame.selectedGame.Challenged){
                    challengedI.push(i);
                }
                //console.log(element.userName+" "+RPSGame.selectedGame.Challenger);
            });
            
            if(this.selectedGame.ChallengedChoice == this.selectedGame.ChallengerChoice) {
                dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                    tie:"tie",
                    status: false
                });
                dataB.ref("users/"+RPSGame.selectedGame.Challenger).update({
                    ties: RPSGame.actualUsers[challengerI[0]].ties+1,
                    playedGames:RPSGame.actualUsers[challengerI[0]].playedGames+1
                });
                dataB.ref("users/"+RPSGame.selectedGame.Challenger).update({
                    ties: RPSGame.actualUsers[challengedI[0]].ties+1,
                    playedGames:RPSGame.actualUsers[challengedI[0]].playedGames+1
                });
            } else {
                switch(this.selectedGame.ChallengerChoice) {
                    case "rock":
                        if(this.selectedGame.ChallengedChoice == "paper"){
                            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                                winner: RPSGame.selectedGame.Challenged,
                                loser: RPSGame.selectedGame.Challenger,
                                ChallengedWins: RPSGame.selectedGame.ChallengedWins+1,
                                status: false
                            });
                            dataB.ref("users/"+this.selectedGame.Challenged).update({
                                wins: RPSGame.actualUsers[challengedI[0]].wins+1,
                                playedGames:RPSGame.actualUsers[challengedI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengedI[0]].wins+1)/(RPSGame.actualUsers[challengedI[0]].loses)
                            });
                            dataB.ref("users/"+this.selectedGame.Challenger).update({
                                loses: RPSGame.actualUsers[challengerI[0]].loses+1,
                                playedGames:RPSGame.actualUsers[challengerI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengerI[0]].wins)/(RPSGame.actualUsers[challengerI[0]].loses+1)
                            });

                        } else {
                            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                                winner: RPSGame.selectedGame.Challenger,
                                loser: RPSGame.selectedGame.Challenged,
                                ChallengerWins: RPSGame.selectedGame.ChallengerWins+1,
                                status: false
                            });
                            dataB.ref("users/"+this.selectedGame.Challenged).update({
                                loses: RPSGame.actualUsers[challengedI[0]].loses+1,
                                playedGames:RPSGame.actualUsers[challengedI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengedI[0]].wins)/(RPSGame.actualUsers[challengedI[0]].loses+1)
                            });
                            dataB.ref("users/"+this.selectedGame.Challenger).update({
                                wins: RPSGame.actualUsers[challengerI[0]].wins+1,
                                playedGames:RPSGame.actualUsers[challengerI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengerI[0]].wins+1)/(RPSGame.actualUsers[challengerI[0]].loses)
                            });

                        }
                    break;
                    case "paper":
                        if(this.selectedGame.ChallengedChoice == "scissors"){
                            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                                winner: RPSGame.selectedGame.Challenged,
                                loser: RPSGame.selectedGame.Challenger,
                                ChallengedWins: RPSGame.selectedGame.ChallengedWins+1,
                                status: false
                            });
                            dataB.ref("users/"+this.selectedGame.Challenged).update({
                                wins: RPSGame.actualUsers[challengedI[0]].wins+1,
                                playedGames:RPSGame.actualUsers[challengedI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengedI[0]].wins+1)/(RPSGame.actualUsers[challengedI[0]].loses)
                            });
                            dataB.ref("users/"+this.selectedGame.Challenger).update({
                                loses: RPSGame.actualUsers[challengerI[0]].loses+1,
                                playedGames:RPSGame.actualUsers[challengerI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengerI[0]].wins)/(RPSGame.actualUsers[challengerI[0]].loses+1)
                            });
                        } else {
                            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                                winner: RPSGame.selectedGame.Challenger,
                                loser: RPSGame.selectedGame.Challenged,
                                ChallengerWins: RPSGame.selectedGame.ChallengerWins+1,
                                status: false
                            });
                            dataB.ref("users/"+this.selectedGame.Challenged).update({
                                loses: RPSGame.actualUsers[challengedI[0]].loses+1,
                                playedGames:RPSGame.actualUsers[challengedI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengedI[0]].wins)/(RPSGame.actualUsers[challengedI[0]].loses+1)
                            });
                            dataB.ref("users/"+this.selectedGame.Challenger).update({
                                wins: RPSGame.actualUsers[challengerI[0]].wins+1,
                                playedGames:RPSGame.actualUsers[challengerI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengerI[0]].wins+1)/(RPSGame.actualUsers[challengerI[0]].loses)
                            });
                        }
                    break;
                    case "scissors":
                        if(this.selectedGame.ChallengedChoice == "rock"){
                            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                                winner: RPSGame.selectedGame.Challenged,
                                loser: RPSGame.selectedGame.Challenger,
                                ChallengedWins: RPSGame.selectedGame.ChallengedWins+1,
                                status: false
                            });
                            dataB.ref("users/"+this.selectedGame.Challenged).update({
                                wins: RPSGame.actualUsers[challengedI[0]].wins+1,
                                playedGames:RPSGame.actualUsers[challengedI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengedI[0]].wins+1)/(RPSGame.actualUsers[challengedI[0]].loses)
                            });
                            dataB.ref("users/"+this.selectedGame.Challenger).update({
                                loses: RPSGame.actualUsers[challengerI[0]].loses+1,
                                playedGames:RPSGame.actualUsers[challengerI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengerI[0]].wins)/(RPSGame.actualUsers[challengerI[0]].loses+1)
                            });

                        } else {
                            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                                winner: RPSGame.selectedGame.Challenger,
                                loser: RPSGame.selectedGame.Challenged,
                                ChallengerWins: RPSGame.selectedGame.ChallengerWins+1,
                                status: false
                            });
                            dataB.ref("users/"+this.selectedGame.Challenged).update({
                                loses: RPSGame.actualUsers[challengedI[0]].loses+1,
                                playedGames:RPSGame.actualUsers[challengedI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengedI[0]].wins)/(RPSGame.actualUsers[challengedI[0]].loses+1)
                            });
                            dataB.ref("users/"+this.selectedGame.Challenger).update({
                                wins: RPSGame.actualUsers[challengerI[0]].wins+1,
                                playedGames:RPSGame.actualUsers[challengerI[0]].playedGames+1,
                                WLRatio: (RPSGame.actualUsers[challengerI[0]].wins+1)/(RPSGame.actualUsers[challengerI[0]].loses)
                            });

                        }
                    break;
                }

            }
            RPSGame.userGet();
            RPSGame.activeGamesGet();
            RPSGame.userGameGet(RPSGame.actualUsers);
            RPSGame.userSelectGame(RPSGame.selectedGame.gameName);
            
            //call gameStatsDom
        } else {
            console.log("Still someone left to choose");
            //call GameDom
        }
    },
    "continueButton":function() {
        if(!this.selectedGame.status){
            if(this.selectedGame.Challenged == this.actualUser){
                this.selectedGame.ChallengedContinue =true;
                dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                    ChallengedContinue:true
                });
                RPSGame.continueEval();
            } else if(this.selectedGame.Challenger == this.actualUser) {
                this.selectedGame.ChallengerContinue =true;
                dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                    ChallengerContinue:true
                });
                RPSGame.continueEval();
            }
            
        }
    },
    "continueEval":function() {
        if(this.selectedGame.ChallengerContinue && this.selectedGame.ChallengedContinue) {
            console.log("continue, reset game");
            this.selectedGame.status = true;
            this.selectedGame.ChallengedChoice = false;
            this.selectedGame.ChallengerChoice = false;
            this.selectedGame.winner = 0;
            this.selectedGame.loser = 0;
            this.selectedGame.tie = 0;
            this.selectedGame.ChallengedContinue = false;
            this.selectedGame.ChallengerContinue = false;
            dataB.ref("games/"+RPSGame.selectedGame.gameName).update({
                status:true,
                ChallengedChoice:false,
                ChallengerChoice:false,
                winner:0,
                loser:0,
                tie:0,
                ChallengedContinue:false,
                ChallengerContinue:false,

            });
            //show general GameDom
            
        } else {
            console.log("Wait for other player to continue");
        }
    },
    "exitGameButton": function() {
        this.selectedGame = "";
        //showDashDom
    }    
};

RPSGame.userGet();
RPSGame.activeGamesGet();
RPSGame.logStatusRev();
