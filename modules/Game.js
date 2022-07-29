import Player from "./Player.js";
import getRandomInt from './../func/getRandom.js';

export default class Game {
    
    constructor(size, callbackDrawStep, callbackNextPlayer) {
        this.size = size;
        this.callbackDrawStep = callbackDrawStep;
        this.callbackNextPlayer = callbackNextPlayer;
        this.field = [];
        this.step = 0;
        this.gameOver = false;
        this.createNewField(size);
        this.startGame();
    }

    startGame() {
        this.playerStep = getRandomInt(0,2);
        this.you = new Player("You", this.playerStep ? "X" : "O");
        this.bot = new Player("Bot", this.playerStep ? "O" : "X");
        this.gameOver = false;

        if( this.playerStep == 0 ) {

            this.callbackNextPlayer("Bot's");
            setTimeout(() => {
                this.botStep()
            }, getRandomInt(1, 3) * 500);
        }
        else {
            this.callbackNextPlayer("Yours");
        }
    }


    createNewField(size) {
        this.field.length = size;
        for( let i = 0; i < size; i++ ) {
            this.field[i] = Array(size).fill(null);
        }
    }

    stepHandler(i,j) {
        if(this.field[i][j] != null) {
            return;
        }
        
        this.playerStep = 0;
        this.field[i][j] = this.you;
        this.callbackDrawStep( i, j, this.you.sign )

        if(this.checkWin(i,j,this.you)) {
           this.gameOver = true;
            this.you.playerWon();
            return
        } else {
            this.callbackNextPlayer("Bot's")
        }


        setTimeout(() => {
            this.botStep()
        }, getRandomInt(1, 3) * 500);
        this.step++;
    }

    botStep() {
        let valid = false;
        let i;
        let j;
  
        if(this.step > this.size*this.size - 1) {
           return
        } 

        do {

            // using random num from 0 to 8 for creating bot step position on the field
            let indexRandom = getRandomInt(0, this.size*this.size);
            i = Math.floor(indexRandom / this.size);
            j = indexRandom % this.size;
            
            if(this.field[i][j] != null) {
                if(this.gameOver) {
                    return
                } else {       
                    continue;
                }
            } 
            else {
                valid = true;
            }

        } while(valid == false)
            

        this.field[i][j] = this.bot;
        this.callbackDrawStep(i,j, this.bot.sign);

        if(this.checkWin(i,j,this.bot)) {
            this.gameOver = true;
            this.bot.playerWon();
        }
        
        this.callbackNextPlayer("Yours");
        this.playerStep = 1;
        this.step++;
    }
    
    checkWin(i, j, player) {

        // create variables of possible winning directions
        let h = 0;
        let v = 0;
        let d1 = 0;
        let d2 = 0;

        // check steps position of player on the field
        for( let k = 0; k < this.size; k++ ) {
            if( this.field[k][j] == player) {
                v++;
            } 
           
            if(this.field[i][k]  == player) {
                h++;
            }


            if(this.field[k][k] != null && this.field[k][k] == player) {
                d1++;
                
            }

            if(this.field[k][this.size - 1 - k] == player) {
                d2++;
            }
        }
        
        return h == this.size || v == this.size || d1 == this.size || d2 == this.size
    }

    resetGame() {

        for( let i = 0; i < this.field.length; i++ ) {
            for( let j = 0; j < this.field[i].length; j++ ) {
                this.field[i][j] = null;
            }
        }

        this.step = 0;
        this.startGame();
    }
}