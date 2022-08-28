import Game from "./modules/Game.js";

let fieldEls = document.querySelectorAll(".field-elem");
let resetBtn = document.querySelector("#reset");
let modalFinish = document.querySelector(".modal-finish");
let size = 3;

let callbackDrawStep = function(i, j, sign) {
    let index = i*size+j;
    fieldEls[index].innerHTML = sign; 
}

let callbackNextPlayer = function(name) {
    document.querySelector(".player_first").innerHTML = name + " turn";
}

const NewGame = new Game(size, callbackDrawStep, callbackNextPlayer);

// по клику находим в массиве field  элемент, который соответствует e.target. 
for( let k = 0; k < fieldEls.length; k++ ) {
    fieldEls[k].addEventListener("click", (e) => {
       
        let target = e.target;
        let i = Math.floor(target.getAttribute("data-index") / 3);
        let j = target.getAttribute("data-index") % 3;

        if(NewGame.playerStep) {
            NewGame.stepHandler(i,j);
        }

        if(NewGame.gameOver) {
            return;
        }
    });
}


resetBtn.addEventListener("click", () => {
    NewGame.resetGame();

    // clear front-end field
    for ( let k = 0; k < fieldEls.length; k++ ) {
        fieldEls[k].innerHTML = " ";
    }

    modalFinish.style.display = "none";
   
});
