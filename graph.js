class graph{
    #xPos;
    #yPos;
    #width;
    #height;
    constructor(xPos, yPos, width, height) {
        this.#xPos = xPos;
        this.#yPos = yPos;
        this.#width = width;
        this.#height = height;
    }

    intersects(point){
        return point.x > this.#xPos
            && point.x < this.#xPos+this.#width
            && point.y > this.#yPos
            && point.y < this.#yPos+this.#width
    }

    draw(context){
        context.fillRect(this.#xPos, this.#yPos, this.#width, this.#height);
    }

    get width() {
        return this.#width;
    }

    get height() {
        return this.#height;
    }
}