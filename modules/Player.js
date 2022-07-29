import Modal from "./Modal.js";

export default class Player {
    constructor(name, sign) {
        this.name = name;
        this.sign = sign;
        this.modal = new Modal(".modal-finish", ".modal_text", this.name);
    }

    playerWon() {
            this.modal.showModal(this.name);
    }

}

