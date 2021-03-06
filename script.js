guessTheAnimalGame = {

    randomAnimal : {},

    totalPoints : 0,

    numberOfGames : 0,

    guessesLeft : 5,

    cluesLeft : 0,

    currentClue : 1,


    startGame : function() {
        // selects randomly an animal from the list and resets variables
        var invitationMessage = "Guess the animal"
        var randomN = 0;
        var min = 0;
        var max = faunaData.length;  //faunaData is a variable declared at the bottom, that stores the JSON data
        randomN = Math.floor(Math.random() * (max - min)) + min;
        this.randomAnimal = faunaData[randomN]; //a random animal from the JSON array
        this.cluesLeft = Object.values(this.randomAnimal).length - 1;
        this.guessesLeft = 5;
        this.currentClue = 1;
        view.updatePoints("guesses left only");
        view.printInBoard(invitationMessage);
        view.isVisible("gameArea", true);
        view.isVisible("startButton", false);
        view.isVisible("continueBtn", false);
        view.inputFocus();
        
    },


    evaluation : function(userInput) { 
        userInput = userInput.toLowerCase();
        var tryAgainMessage = "Try again. ";
        var clueMessage = "Clue: ";
        var youLose = "You lose. The animal was " + this.randomAnimal["name"];
        var youWin = "Yes!"

        if (userInput !== this.randomAnimal["name"]) {
            this.guessesLeft -= 1;
            view.printInBoard(tryAgainMessage);
            view.updatePoints("guesses left only");

            if (this.guessesLeft > 0) {

                if (this.currentClue < Object.values(this.randomAnimal).length) {
                    view.printInBoard(clueMessage + Object.values(this.randomAnimal)[this.currentClue])
                    this.cluesLeft -= 1;
                    this.currentClue += 1;
                } else { //this for future versions, just need to raise the initial value of guessesLeft 
                    view.printInBoard(clueMessage + "la primera letra es la t. ") //would give first letter of animal name
                } 
                
            } else {
                view.printInBoard(youLose);
                view.isVisible("continueBtn", true);
                view.isVisible("gameArea", false);
            }
            

        } else { 
            this.totalPoints += this.guessesLeft; // RIGHT ANSWER, YOU WIN
            view.printInBoard(youWin); 
            view.updatePoints();
            view.isVisible("continueBtn", true);
            view.isVisible("gameArea", false);
        }

        view.inputFocus();

    },

    surrender : function() {
        view.printInBoard(youLose); //should show cotinue btn
    },


    exitGame : function() {} //take us back to start screen, reset counters
};

handlers = {
    startButton : function() {
        guessTheAnimalGame.startGame();
    },

    sendButton : function() {
        var userInput = document.getElementById("userInput").value;
        guessTheAnimalGame.evaluation(userInput);
        return false;
    },

    continueButton : function() {
        guessTheAnimalGame.startGame();
    }

};


view = {

    isVisible : function(element, OnOff) {
        var element = document.getElementById(element);
        if (OnOff === true) {
            element.style.display = 'block';
        } else {
            element.style.display = 'none';
        }
    },


    updatePoints : function(x) {
        var board1 = document.getElementById("totalPoints");
        var board2 = document.getElementById("guessesLeft");
        board2.textContent = guessTheAnimalGame.guessesLeft;
        if (x!=="guesses left only") { 
            board1.textContent = guessTheAnimalGame.totalPoints;
            board2.textContent = "";
        }
    },


    printInBoard : function(lastNews) {
        var newsfeed = document.getElementById("newsfeed");
        newsfeed.textContent = lastNews;
    },

    inputFocus : function() {
        var emptyAndFocus = document.getElementById("userInput");
        emptyAndFocus.value = "";
        emptyAndFocus.focus();
    }
    

};

//accessing the json update 08122017

var faunaData; //this variable will contain the json data
var request = new XMLHttpRequest();
request.open('GET', 'https://raw.githubusercontent.com/alaminos/fauna-data/master/faunaData.json'); // GET because we want to RECEIVE data, the second parameter of this method is the URL we are taking data from
request.responseType = 'json';
request.onload = function() {
    faunaData = request.response;
};
request.send();

/*view.setUpEventListeners();*/ //could be better to set this up?