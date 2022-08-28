import Player from "./Player.js";
import getRandomInt from "./../func/getRandom.js";
import Modal from "./Modal.js";

export default class Game {
    
    constructor(size, callbackDrawStep, callbackNextPlayer) {
        this.size = size;
        this.callbackDrawStep = callbackDrawStep;
        this.callbackNextPlayer = callbackNextPlayer;
        this.field = [];
        this.createNewField(size);
        this.startGame();
        this.modal = new Modal(".modal-finish", ".modal_text", "")
    }

    isMovesLeft(field) {
        for(let i = 0; i < this.size; i++) {
            for(let j = 0; j < this.size; j++) {
                if (field[i][j] == null) {   
                    return true;
                }    
            }
        }
        return false;
    }


    startGame() {
        this.playerStep = getRandomInt(0,2);
        this.you = new Player("You", this.playerStep ? "X" : "O");
        this.bot = new Player("Bot", this.playerStep ? "O" : "X");
        
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

        if(this.checkWin(i,j) == -10) {
            this.you.playerWon();
            return
        } else {
            this.callbackNextPlayer("Bot's")
        }

        setTimeout(() => {
            this.botStep()
        }, getRandomInt(1, 3) * 500);
        
        if(this.isMovesLeft(this.field) == false) {
            this.modal.showModal('Nobody')
        } 
    }

    botStep() {

        let move = this.findBestMove(this.field);

        this.field[move[0]][move[1]] = this.bot;
        this.callbackDrawStep(move[0],move[1], this.bot.sign);

        // Check if bot won
        if(this.checkWin(move[0],move[1]) == 10) {
            this.bot.playerWon();
        }
        
        this.callbackNextPlayer("Yours");
        this.playerStep = 1;

        if(this.isMovesLeft(this.field) == false) {
            this.modal.showModal('Nobody')
        } 
        
    }

    minimax(field, depth, isMax, i, j) {
        let score = this.checkWin(i,j);
    
        // If Maximizer has won the game
        // return his/her evaluated score
        if (score == 10) {
            return score;
        }
    
        // If Minimizer has won the game
        // return his/her evaluated score
        if (score == -10) {
            return score;
        }
    
        // If there are no more moves and
        // no winner then it is a tie
        if (this.isMovesLeft(this.field) == false) {
            return 0;
        } 
    
        // If this maximizer's move
        if (isMax) {

            let best = -1000;

            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    
                    // Check if cell is empty
                    if (field[i][j] == null) {
                        
                        // Make the move
                        field[i][j] = this.bot;
    
                        // Call minimax recursively
                        // and choose the maximum value
                        best = Math.max(best, this.minimax(field, depth + 1, !isMax, i,j));
    
                        // Undo the move
                        field[i][j] = null;
                    }
                }
            }
            return best;
        }
    
        // If this minimizer's move
        else {
            let best = 1000;
    
            // Traverse all cells
            for(let i = 0; i < 3; i++) {
                for(let j = 0; j < 3; j++) {
                    
                    // Check if cell is empty
                    if (field[i][j] == null) {
                        
                        // Make the move
                        field[i][j] = this.you;
    
                        // Call minimax recursively and
                        // choose the minimum value
                        best = Math.min(best, this.minimax(field,
                                        depth + 1, !isMax, i, j));
    
                        // Undo the move
                        field[i][j] = null;
                    }
                }
            }
            return best;
        }
    }
 
    // This will return the best possible
    // move for the player
    findBestMove(field) {
        let bestVal = -1000;
        let h = null;
        let k = null;
    
        // Evaluate minimax function for all empty
        // cells. And return the cell
        // with optimal value.
        for(let i = 0; i < 3; i++) {
            for(let j = 0; j < 3; j++) {
                
                // Check if cell is empty
                if (field[i][j] == null) {
                    
                    // Make the move
                    field[i][j] = this.bot;
    
                    // compute evaluation function
                    // for this move.
                    let moveVal = this.minimax(field, 0, false, i, j);
    
                    // Undo the move
                    field[i][j] = null;
    
                    // If the value of the current move
                    // is more than the best value, then
                    // update best
                    if (moveVal > bestVal) {
                        h = i;
                        k = j;
                        bestVal = moveVal;
                    }
                }
            }   
        }
        return [h,k]
    }
    
    checkWin(i,j) {
        let h = 0;
        let v = 0;
        let d1 = 0;
        let d2 = 0;
        let player = this.field[i][j];

        for( let k = 0; k < this.size; k++ ) {
            if( this.field[k][j] == player ) {
                v++;
            } 
        
            if(this.field[i][k] == player) {
                h++;
            }

            if(this.field[k][k] != null && this.field[k][k] == player) {
                d1++;
            }

            if(this.field[k][this.size - 1 - k] == player) {
                d2++;
            }
        }

        if( h == this.size || v == this.size || d1 == this.size || d2 == this.size) {
            if(player.name == "Bot") {
                return 10;
            } else if(player.name == "You") {
                return -10;
            }
        }
        return 0;
    }

    resetGame() {
        for( let i = 0; i < this.field.length; i++ ) {
            for( let j = 0; j < this.field[i].length; j++ ) {
                this.field[i][j] = null;
            }
        }

        this.startGame();
    }
}


