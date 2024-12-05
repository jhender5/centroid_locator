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

    addShape(shape){
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
    #iconType=undefined;
    #triangleOrientation =1;
    constructor(xPos, yPos, size, iconType) {
        this.#rectBG = new Rectangle(xPos, yPos, size, size);
        const iconSize = size * this.#iconScaler;
        switch (iconType){
            case "rectangle":
                this.#icon = new Rectangle(xPos, yPos, iconSize, iconSize);
                this.#iconType=iconType;
                break;
            case "circle":
                this.#icon = new Circle(xPos, yPos, iconSize/2);
                this.#iconType=iconType;
                break;
            case "triangle":
                this.#icon = new Triangle(xPos, yPos, iconSize, iconSize, this.#triangleOrientation);
                this.#iconType=iconType;
                break;
            case "none":
                this.#iconType = "none";
                break;
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
        context.fillStyle="white"
        let rectXPos=this.#rectBG.xPos - this.#rectBG.width/2;
        let rectYpos=this.#rectBG.yPos - this.#rectBG.height/2;
        context.fillRect(rectXPos, rectYpos, this.#rectBG.width, this.#rectBG.height);
        context.fillStyle="red"
        if (this.#iconType === "rectangle"){
            let rectXPos= this.#icon.xPos - this.#icon.width/2;
            let rectYpos=this.#icon.yPos - this.#icon.width/2;
            context.fillRect(rectXPos, rectYpos, this.#icon.width, this.#icon.height);

        } else if (this.#iconType === "circle") {
            context.beginPath();
            context.arc(this.#icon.xPos, this.#icon.yPos, this.#icon.radius, 0, Math.PI * 2);
            context.fill();
            context.closePath();

        } else if (this.#iconType === "triangle"){
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

    intersects(point){
        return point.x >= this.#rectBG.xPos-this.#rectBG.width/2
            && point.x <= this.#rectBG.xPos+this.#rectBG.width/2
            && point.y >= this.#rectBG.yPos-this.#rectBG.height/2
            && point.y <= this.#rectBG.yPos+this.#rectBG.height/2;
    }
}

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
}

//This function draws the user interface and canvas
function draw(){

    bgCanvasCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
    addTriangleButton.draw(bgCanvasCtx);
    addRectButton.draw(bgCanvasCtx);
    addCircleButton.draw(bgCanvasCtx);

    graphCanvasCTX.fillStyle="white";
    shapeGraph.draw(graphCanvasCTX);

    //TODO: render composite shape

    //TODO: make UI for modifying shapes

    //TODO: move shapes with mouse if a shape has been clicked
    if(mouseDomain === 'bg') {
        if(placingShape === 'circle') {
            bgCanvasCtx.beginPath();
            bgCanvasCtx.arc(bgMouseX, bgMouseY, 15, 0, Math.PI * 2);
            bgCanvasCtx.fillStyle = 'pink';
            bgCanvasCtx.fill();
            bgCanvasCtx.closePath();
        } else if(placingShape === 'rectangle'){
            bgCanvasCtx.fillStyle = 'pink';
            bgCanvasCtx.fillRect(bgMouseX-15, bgMouseY-15, 30, 30);
        }else if(placingShape=== 'triangle'){
            drawTriangle(bgCanvasCtx, bgMouseX, bgMouseY, 30, 30, 1, 'pink');
        }

    } else if(mouseDomain === 'graph'){
        if(placingShape === 'circle') {
            graphCanvasCTX.beginPath();
            graphCanvasCTX.arc(graphCanvasMouseX, graphCanvasMouseY, 15, 0, Math.PI * 2);
            graphCanvasCTX.fillStyle = 'pink';
            graphCanvasCTX.fill();
            graphCanvasCTX.closePath();
        } else if(placingShape === 'rectangle'){
            graphCanvasCTX.fillStyle = 'pink';
            graphCanvasCTX.fillRect(graphCanvasMouseX-15, graphCanvasMouseY-15, 30, 30);
        } else if(placingShape=== 'triangle'){
            drawTriangle(graphCanvasCTX, graphCanvasMouseX, graphCanvasMouseY, 30, 30, 1, 'pink');
        }
    }
    requestAnimationFrame(draw);
}

function drawTriangle(context, xCenter, yCenter, width, height, orientation, color){
    context.beginPath()
    context.fillStyle=color
            switch (orientation) {
                case 1:
                    context.moveTo(xCenter - width / 2, yCenter - height / 2);
                    context.lineTo(xCenter - width / 2, yCenter + height / 2);
                    context.lineTo(xCenter + width / 2, yCenter + height / 2)
                    context.closePath()
                    break;
                case 2:
                    context.moveTo(xCenter - width / 2, yCenter + height / 2);
                    context.lineTo(xCenter + width / 2, yCenter + height / 2);
                    context.lineTo(xCenter + width / 2, yCenter - height / 2)
                    context.closePath()
                    break;
                case 3:
                    context.moveTo(xCenter + width / 2, yCenter - height / 2);
                    context.lineTo(xCenter - width / 2, yCenter - height / 2);
                    context.lineTo(xCenter - width / 2, yCenter + height / 2)
                    context.closePath()
                    break;
                case 4:
                    context.moveTo(xCenter + width / 2, yCenter + height / 2);
                    context.lineTo(xCenter + width / 2, yCenter - height / 2);
                    context.lineTo(xCenter - width / 2, yCenter - height / 2)
                    context.closePath()
                    break;
            }
            context.fill();
}



const bgCanvas=document.getElementById("centroidCanvas");
const bgCanvasCtx=bgCanvas.getContext('2d');

bgCanvas.width=window.innerWidth;
bgCanvas.height=window.innerHeight;


//TODO: figure out why canvas not show up
let graphCanvas=document.getElementById("graphSpace");
let graphCanvasCTX=graphCanvas.getContext('2d');

let shapeGraphDimensions={x:window.innerWidth*(1/10),
                                y:window.innerHeight*(2/10),
                                width:window.innerWidth*(8/10),
                                height:window.innerHeight*(8/10)};

let shapeGraph = new graph(0,0, shapeGraphDimensions.width, shapeGraphDimensions.height);

graphCanvas.style.top=shapeGraphDimensions.y+'px';
graphCanvas.style.left=shapeGraphDimensions.x+'px';
graphCanvas.width=shapeGraphDimensions.width;
graphCanvas.height=shapeGraphDimensions.height;

//Mouse action variables
let bgMouseX=0;
let bgMouseY=0;
let graphCanvasMouseX=0;
let graphCanvasMouseY=0;
let placingShape="none";
let mouseDomain="none"

//Shape drawing variables
let drawnShapes = new CompositeShape();
let triangleOrientation = 1;

//UI variables
let shapeButtonSize=(bgCanvas.height+bgCanvas.width)/40;
let shapeButtonXOffset=bgCanvas.width/20;
let shapeButtonYOffest=bgCanvas.height/20;
let addTriangleButton= new Button(shapeButtonXOffset, shapeButtonYOffest, shapeButtonSize, "triangle");
let addRectButton=new Button(shapeButtonXOffset, shapeButtonYOffest*3, shapeButtonSize, "rectangle");
let addCircleButton=new Button(shapeButtonXOffset, shapeButtonYOffest*5, shapeButtonSize, "circle");



//event listeners
bgCanvas.addEventListener("mousemove", function (info){
    bgMouseX=info.x;
    bgMouseY=info.y;
})

bgCanvas.addEventListener("mouseenter", function (){
    mouseDomain="bg"
})

graphCanvas.addEventListener("mouseenter", function (){
    mouseDomain="graph"
})

window.addEventListener("mouseleave", function (){
    mouseDomain='none'
})

graphCanvas.addEventListener("mousemove", function (info){
    graphCanvasMouseX=info.offsetX;
    graphCanvasMouseY=info.offsetY;
})

graphCanvas.addEventListener("click", function (info){
    graphCanvasMouseX=info.offsetX
    graphCanvasMouseY=info.offsetY
    if(placingShape === "none"){
    } else if(placingShape === "triangle"){
        drawnShapes.addShape(Triangle(graphCanvasMouseX,graphCanvas.width-graphCanvasMouseY, 30, 30, triangleOrientation));
    } else if(placingShape === "rectangle"){
        drawnShapes.addShape(Rectangle(graphCanvasMouseX, graphCanvas.width-graphCanvasMouseY, 30, 30));
    } else if(placingShape === "circle"){
        drawnShapes.addShape(Circle(graphCanvasMouseX, graphCanvas.width-graphCanvasMouseY, 15));
    }
})


bgCanvas.addEventListener("click", function (info){
    bgMouseX=info.offsetX;
    bgMouseY=info.offsetY;
    let point={x:info.offsetX, y:info.offsetY};

    if(addTriangleButton.intersects(point)){
         if(placingShape === "triangle"){
            placingShape = "none";
        } else placingShape = "triangle";
    } else if(addRectButton.intersects(point)){
         if(placingShape === "rectangle"){
            placingShape = "none";
        } else placingShape = "rectangle";
    } else if (addCircleButton.intersects(point)){
        if(placingShape === "circle"){
            placingShape = "none";
        } else placingShape = "circle"
    }
    console.log(placingShape);
})

draw();
