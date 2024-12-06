class TextBox{
    #boxMessage;
    #input = '';
    #bgRect;
    #bgColor;
    #inputRect;
    #typing;
    constructor(xPos, yPos, width, height, message) {
        this.#bgRect = new Rectangle(xPos, yPos, width, height);
        this.#inputRect = new Rectangle(xPos, yPos+width*0.15, width, height*0.7);
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

    render(context) {
        const ctx = context;
        
        ctx.fillStyle = this.#bgColor || 'white';
        ctx.fillRect(this.#bgRect.x-this.#bgRect.width/2, this.#bgRect.y-this.#bgRect.height/2, this.#bgRect.width, this.#bgRect.height);

        // Render the message in the middle of the bgRect
        ctx.fillStyle = 'black';
        ctx.font = `${this.#bgRect.height * 0.3}px Ariel`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.#boxMessage, this.#bgRect.x + this.#bgRect.width / 2, this.#bgRect.y + this.#bgRect.height * 0.15);
        
        ctx.fillStyle = 'lightgrey';
        ctx.fillRect(this.#inputRect.x, this.#inputRect.y, this.#inputRect.width, this.#inputRect.height);

        ctx.fillStyle = 'black'; // Render the input text
        ctx.font = `${this.#inputRect.height * 0.7}px Arial`;
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.#input, this.#inputRect.x + 5, this.#inputRect.y + this.#inputRect.height / 2);
    }
}