class Shape{
    #xPos;
    #yPos;
    #isHole;
    constructor(xPos, yPos) {
        this.#xPos = xPos;
        this.#yPos = yPos;
    }

    get xPos() {
        return this.#xPos;
    }

    set xPos(value) {
        this.#xPos = value;
    }

    get yPos() {
        return this.#yPos;
    }

    set yPos(value) {
        this.#yPos = value;
    }

    get isHole() {
        return this.#isHole;
    }

    set isHole(value) {
        this.#isHole = value;
    }
}

class Circle extends Shape{
    #radius;
    constructor(xPos, yPos, radius) {
        super(xPos, yPos);
        this.#radius = radius;
    }


    get radius() {
        return this.#radius;
    }

    set radius(value) {
        this.#radius = value;
    }

    get area() {
        if(this.isHole){
            return -Math.PI * this.#radius ** 2;
        }
        return Math.PI * this.#radius ** 2;
    }

    get xCentroid() {
        return super.xPos
    }
    get yCentroid() {
        return super.yPos
    }
}

class Rectangle extends Shape{
    #width;
    #height;
    constructor(xPos, yPos, width, height) {
        super(xPos, yPos)
        this.#width = width;
        this.#height = height;
    }

    get width() {
        return this.#width;
    }

    set width(value) {
        this.#width = value;
    }

    get height() {
        return this.#height;
    }

    set height(value) {
        this.#height = value;
    }

    get area(){
        if(this.isHole){
            return -this.#height * this.#width;
        }
        return this.#height * this.#width;
    }

    get xCentroid() {
        return super.xPos;
    }
    get yCentroid() {
        return super.yPos;
    }
}

class Triangle extends Rectangle{
    #orientation;

    constructor(xPos, yPos, width, height, orientation,) {
        super(xPos, yPos, width, height);
        this.#orientation = orientation;
    }

    get orientation() {
        return this.#orientation;
    }

    set orientation(value) {
        this.#orientation = value;
    }

    get area(){
        return super.area()/2;
    }

    get xCentroid() {
        switch(this.#orientation){
            case 1:
                return this.xPos - this.width/6;
            case 2:
                return this.xPos + this.width/6;
            case 3:
                return this.xPos - this.width/6;
            case 4:
                return this.xPos + this.width/6;
        }
    }
    get yCentroid() {
        switch(this.#orientation){
            case 1:
                return this.yPos - this.height/6;
            case 2:
                return this.yPos - this.height/6;
            case 3:
                return this.yPos + this.height/6;
            case 4:
                return this.yPos + this.height/6;
        }
    }

}

class CompositeShape{
    #shapes;
    constructor() {
        this.#shapes = new Array(0)
    }

    set add_shape(shape){
        this.#shapes.push(shape);
    }

    compute_centroid(){
        if (this.#shapes.length > 0) {
            let totalArea = 0;
            let yTimesArea = 0;
            let xTimesArea = 0;

            for (const shape of this.#shapes) {
                totalArea += shape.area();
                xTimesArea += shape.xCentroid() * shape.area();
                yTimesArea += shape.yCentroid() * shape.area();
            }
            if (totalArea > 0) {
                let xCentroidPos=xTimesArea / totalArea;
                let yCentroidPos=yTimesArea / totalArea;
                return [xCentroidPos, yCentroidPos];
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }

    renderShapes(context, canvas){
        for(const shape of this.#shapes) {
            if (typeof shape === Rectangle){
                let rectXPos= shape.xPos - shape.width/2;
                let rectYpos=canvas.width-(shape.yPos + shape.width/2);
                context.fillRect(rectXPos, rectYpos, shape.width, shape.height);

            } else if (typeof shape === Circle) {
                context.beginPath();
                context.beginPath();
                context.arc(shape.xPos, -shape.yPos, shape.radius, 0, Math.PI * 2);
                context.fill();
                context.closePath();

            } else if (typeof shape === Triangle){
                context.beginPath()
                const yCenter = this.canvas.height - shape.yPos;
                const xCenter = shape.xPos;
                switch (shape.orientation) {
                    case 1:
                        context.moveTo(xCenter - shape.width / 2, yCenter - shape.height / 2);
                        context.lineTo(xCenter - shape.width / 2, yCenter + shape.height / 2);
                        context.lineTo(xCenter + shape.width / 2, yCenter + shape.height / 2)
                        context.closePath()
                        break;
                    case 2:
                        context.moveTo(xCenter - shape.width / 2, yCenter + shape.height / 2);
                        context.lineTo(xCenter - +hape.width / 2, yCenter + shape.height / 2);
                        context.lineTo(xCenter + shape.width / 2, yCenter - shape.height / 2)
                        context.closePath()
                        break;
                    case 3:
                        context.moveTo(xCenter + shape.width / 2, yCenter - shape.height / 2);
                        context.lineTo(xCenter - shape.width / 2, yCenter - shape.height / 2);
                        context.lineTo(xCenter - shape.width / 2, yCenter + shape.height / 2)
                        context.closePath()
                        break;
                    case 4:
                        context.moveTo(xCenter + shape.width / 2, yCenter + shape.height / 2);
                        context.lineTo(xCenter + shape.width / 2, yCenter - shape.height / 2);
                        context.lineTo(xCenter - shape.width / 2, yCenter - shape.height / 2)
                        context.closePath()
                        break;
                }
                context.fill();
            }
        }
    }
}

class Button{
    #rectBG;
    #icon;
    #iconScaler=0.7;
    #triangleOrientation =1;
    constructor(xPos, yPos, size, iconType) {
        this.#rectBG = new Rectangle(xPos, yPos, size, size);
        const iconSize = size * this.#iconScaler;
        switch (iconType){
            case "rectangle":
                this.#icon = new Rectangle(xPos, yPos, iconSize, iconSize);
                break;
            case "circle":
                this.#icon = new Circle(xPos, yPos, iconSize);
                break;
            case "triangle":
                this.#icon = new Triangle(xPos, yPos, iconSize, iconSize, this.#triangleOrientation);
        }
    }

    get triangleOrientation() {
        return this.#triangleOrientation;
    }

    set triangleOrientation(value) {
        if (typeof this.#icon === Triangle) {
            this.#triangleOrientation = value;
            const xPos = this.#icon.xPos;
            const yPos = this.#icon.yPos;
            this.#icon = new Triangle(xPos, yPos, iconSize, iconSize, this.#triangleOrientation)
        }
    }

    draw(context){
        let rectXPos=this.#rectBG.xPos - this.#rectBG.width/2;
        let rectYpos=this.#rectBG.yPos - this.#rectBG.height/2;
        context.fillRect(rectXPos, rectYpos, this.#rectBG.width, this.#rectBG.height);

        if (typeof this.#icon === Rectangle){
                let rectXPos= this.#icon.xPos - this.#icon.width/2;
                let rectYpos=this.#icon.yPos - this.#icon.width/2;
                context.fillRect(rectXPos, rectYpos, this.#icon.width, this.#icon.height);

        } else if (typeof this.#icon === Circle) {
            context.beginPath();
            context.beginPath();
            context.arc(this.#icon.xPos, -this.#icon.yPos, this.#icon.radius, 0, Math.PI * 2);
            context.fill();
            context.closePath();

        } else if (typeof this.#icon === Triangle){
            context.beginPath()
            const yCenter = this.#icon.yPos;
            const xCenter = this.#icon.xPos;
            switch (this.#icon.orientation) {
                case 1:
                    context.moveTo(xCenter - this.#icon.width / 2, yCenter - this.#icon.height / 2);
                    context.lineTo(xCenter - this.#icon.width / 2, yCenter + this.#icon.height / 2);
                    context.lineTo(xCenter + this.#icon.width / 2, yCenter + this.#icon.height / 2)
                    context.closePath()
                    break;
                case 2:
                    context.moveTo(xCenter - this.#icon.width / 2, yCenter + this.#icon.height / 2);
                    context.lineTo(xCenter - +hape.width / 2, yCenter + this.#icon.height / 2);
                    context.lineTo(xCenter + this.#icon.width / 2, yCenter - this.#icon.height / 2)
                    context.closePath()
                    break;
                case 3:
                    context.moveTo(xCenter + this.#icon.width / 2, yCenter - this.#icon.height / 2);
                    context.lineTo(xCenter - this.#icon.width / 2, yCenter - this.#icon.height / 2);
                    context.lineTo(xCenter - this.#icon.width / 2, yCenter + this.#icon.height / 2)
                    context.closePath()
                    break;
                case 4:
                    context.moveTo(xCenter + this.#icon.width / 2, yCenter + this.#icon.height / 2);
                    context.lineTo(xCenter + this.#icon.width / 2, yCenter - this.#icon.height / 2);
                    context.lineTo(xCenter - this.#icon.width / 2, yCenter - this.#icon.height / 2)
                    context.closePath()
                    break;
            }
            context.fill();

        }
    }
}

const myCanvas=document.getElementById("centroidCanvas");
const canvasCtx=myCanvas.getContext('2d');
const uiPos = [0,0];

let mouseX=0;
let mouseY=0;

let placingShape="none";
let addTriangleButton= new Button(20, 20, 30, "triangle");
let addRectButton=new Button(20, 60, 30, "rectangle");
let addCircleButton=new Button(20, 100, 30, "circle");

myCanvas.addEventListener("mousemove", function (info){
    mouseX=info.offsetX;
    mouseY=info.offsetY;
})

myCanvas.addEventListener("click", function (info){
    let point={x:info.offsetX, y:info.offsetY};
    if(isInsideRect(point, addTriangleButton, canvasCtx)){
        placingShape = "triangle"
    } else if(isInsideRect(point, addRectButton, canvasCtx)){
        placingShape = "rectangle"
    } else if (isInsideRect(point, addCircleButton, canvasCtx)){
        placingShape = "circle"
    }
})

function isInsideRect(point, rect, canvas){
    const xPos=rect.xPos;
    const yPos=canvas.height-rect.yPos;
    const width = rect.width;
    const height = rect.height;

    return point.x >= xPos-width/2 && point.x <= xPos+width/2 && point.y >= yPos-height/2 && point.y <= yPos+height/2;
}

function drawRectangle(rect, context, canvas){
    let rectXPos=rect.xPos - rect.width/2;
    let rectYpos=rect.yPos - rect.height/2;
    context.fillRect(rectXPos, rectYpos, rect.width, rect.height);
}

function draw(){
    canvasCtx.clearRect(0, 0, myCanvas.width, myCanvas.height)
    canvasCtx.fillStyle="white"
    addTriangleButton.draw(canvasCtx);
    addRectButton.draw(canvasCtx);
    addCircleButton.draw(canvasCtx);

    requestAnimationFrame(draw);
}

draw();