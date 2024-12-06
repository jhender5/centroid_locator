class TextBox{
    #boxMessage;
    #input = '';
    #bgRect;
    #bgColor;
    #inputRect;
    #typing;
    constructor(xPos, yPos, width, height, message) {
        this.#bgRect = new Rectangle(xPos, yPos, width, height);
        this.#inputRect = new Rectangle(xPos, yPos+height*0.5, width, height*0.6);
        this.#boxMessage = message;
    }
    
    get boxMessage() {
        return this.#boxMessage;
    }

    set boxMessage(value) {
        this.#boxMessage = value;
    }

    get input() {
        return this.#input;
    }

    set input(value) {
        this.#input = value;
    }

    get bgColor() {
        return this.#bgColor;
    }

    set bgColor(value) {
        this.#bgColor = value;
    }

    get typing() {
        return this.#typing;
    }

    set typing(value) {
        this.#typing = value;
    }
    
    textBoxClicked(point){
        return this.#inputRect.intersects(point);
    }

    render(ctx) {

        ctx.fillStyle = 'white';
        ctx.fillRect(this.#bgRect.xPos, this.#bgRect.yPos, this.#bgRect.width, this.#bgRect.height);

        ctx.fillStyle = 'black';
        ctx.font = `${this.#bgRect.height * 0.25}px Ariel`;
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.#boxMessage, this.#bgRect.xPos+ this.#bgRect.width / 2, this.#bgRect.yPos+ this.#bgRect.height * 0.15);
        
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(this.#inputRect.xPos, this.#inputRect.yPos, this.#inputRect.width, this.#inputRect.height);

        ctx.fillStyle = 'black';
        ctx.font = `${this.#inputRect.height * 0.7}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.#input, this.#inputRect.xPos, this.#inputRect.yPos+ this.#inputRect.height / 2);
    }
}