export default class Modal {
    constructor(el, elText, winner) {
        this.el = el;
        this.elText = elText;
        this.winner = winner;
    }

    showModal(winner) {
        document.querySelector("" + this.elText).innerHTML =  winner + " won";
        setTimeout(() => {
            document.querySelector("" + this.el).style.display = "flex";
        }, 500);
    }
}