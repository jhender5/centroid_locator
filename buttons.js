class Button{
    #rectBG;
    constructor(xPos, yPos, size) {
        this.#rectBG = new Rectangle(xPos, yPos, size, size);
    }

    
    get rectBGHeight() {
        return this.#rectBG.height;
    }

    set rectBGHeight(value) {
        this.#rectBG.height = value;
    }

    get rectBGWidth() {
        return this.#rectBG.width;
    }

    set rectBGWidth(value) {
        this.#rectBG.width = value;
    }


    get rectBGXPos() {
        return this.#rectBG.xPos;
    }

    set rectBGXPos(value) {
        this.#rectBG.xPos = value;
    }

    get rectBGYPos() {
        return this.#rectBG.yPos;
    }

    set rectBGYPos(value) {
        this.#rectBG.yPos = value;
    }
    
    draw(context){
        context.fillStyle="white"
        let rectXPos=this.#rectBG.xPos - this.#rectBG.width/2;
        let rectYpos=this.#rectBG.yPos - this.#rectBG.height/2;
        context.fillRect(rectXPos, rectYpos, this.#rectBG.width, this.#rectBG.height);
    }

    intersects(point){
        return point.x >= this.#rectBG.xPos-this.#rectBG.width/2
            && point.x <= this.#rectBG.xPos+this.#rectBG.width/2
            && point.y >= this.#rectBG.yPos-this.#rectBG.height/2
            && point.y <= this.#rectBG.yPos+this.#rectBG.height/2;
    }
}

class ShapeButton extends Button{
    #icon;
    iconScalar=0.7;
    #triangleOrientation =1;

    constructor(xPos, yPos, size, iconType) {
        super(xPos, yPos, size);
        const iconSize = size * this.iconScalar;

        switch (iconType){
            case "rectangle":
                this.#icon = new Rectangle(xPos, yPos, iconSize, iconSize);
                break;
            case "circle":
                this.#icon = new Circle(xPos, yPos, iconSize/2);
                break;
            case "triangle":
                this.#icon = new Triangle(xPos, yPos, iconSize, iconSize, this.#triangleOrientation);
                break;
        }
    }


    get triangleOrientation() {
        return this.#triangleOrientation;
    }

    set triangleOrientation(value) {
        if (this.#icon.type === "triangle") {
            this.#triangleOrientation = value;
            const xPos = this.#icon.xPos;
            const yPos = this.#icon.yPos;
            this.#icon = new Triangle(xPos, yPos, iconSize, iconSize, this.#triangleOrientation)
        }
    }

    draw(context) {
        super.draw(context);
        context.fillStyle="red"
        if (this.#icon.type === "rectangle"){
            let rectXPos= this.#icon.xPos - this.#icon.width/2;
            let rectYpos=this.#icon.yPos - this.#icon.width/2;
            context.fillRect(rectXPos, rectYpos, this.#icon.width, this.#icon.height);

        } else if (this.#icon.type === "circle") {
            context.beginPath();
            context.arc(this.#icon.xPos, this.#icon.yPos, this.#icon.radius, 0, Math.PI * 2);
            context.fill();
            context.closePath();

        } else if (this.#icon.type === "triangle"){
            context.beginPath()
            const yCenter = this.#icon.yPos;
            const xCenter = this.#icon.xPos;
            drawTriangle(context, xCenter, yCenter, this.#icon.width, this.#icon.height, this.#triangleOrientation, 'red');
        }
    }
}


class TextButton extends Button {
    #text;
    #textColor;

    constructor(xPos, yPos, size, text, textColor = "black") {
        super(xPos, yPos, size);
        this.#text = text;
        this.#textColor = textColor;
    }

    set textColor(color) {
        this.#textColor = color;
    }

    get textColor() {
        return this.#textColor;
    }

    draw(context) {
        super.draw(context);

        context.fillStyle = this.#textColor;
        context.font = `${this.rectBGHeight / 4}px Arial`; // Text font and size
        context.textAlign = "center";
        context.textBaseline = "middle";

        const xCenter = this.rectBGXPos;
        const yCenter = this.rectBGYPos;
        context.fillText(this.#text, xCenter, yCenter);
    }
}

