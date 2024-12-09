const bgCanvas=document.getElementById("centroidCanvas");
const bgCanvasCtx=bgCanvas.getContext('2d');

bgCanvas.width=window.innerWidth;
bgCanvas.height=window.innerHeight;

let graphCanvas=document.getElementById("graphSpace");
let graphCanvasCTX=graphCanvas.getContext('2d');

let shapeGraphDimensions={x:Math.floor(bgCanvas.width*(2/10)),
                                y:Math.floor(bgCanvas.height*(2/10)),
                                width:Math.floor(bgCanvas.width*(3/4)),
                                height:Math.floor(bgCanvas.height*(6/10))};

graphCanvas.style.top=shapeGraphDimensions.y+'px';
graphCanvas.style.left=shapeGraphDimensions.x+'px';
graphCanvas.width=shapeGraphDimensions.width;
graphCanvas.height=shapeGraphDimensions.height;

let shapeGraph = new graph(0,0, graphCanvas.width, graphCanvas.height);

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
let nextID=1;

//UI variables
//shape button section
let buttonSize=(bgCanvas.height+bgCanvas.width)/40;
let shapeButtonXOffset=bgCanvas.width/10;
let shapeButtonYOffset=bgCanvas.height/20;
let textSize = 16;
let addTriangleButton= new ShapeButton(shapeButtonXOffset, shapeButtonYOffset*3, buttonSize, "triangle");
let addRectButton=new ShapeButton(shapeButtonXOffset, shapeButtonYOffset*5, buttonSize, "rectangle");
let addCircleButton=new ShapeButton(shapeButtonXOffset, shapeButtonYOffset*7, buttonSize, "circle");

//calculate centroid section of the UI
let centroid = undefined;
let calculateCentroidButton=new TextButton(bgCanvas.width*2/20, bgCanvas.height*9/10, buttonSize, "Calculate Centroid");
calculateCentroidButton.rectBGWidth=buttonSize*2.5;

//shape modifying section
let rotateTriangleButton=new ShapeButton(bgCanvas.width*3/10, bgCanvas.height/10, buttonSize, "triangle");
let editingShapeID=undefined;

let xBox = document.getElementById('xPositionInput');
xBox.style.left = (bgCanvas.width / 4) + 'px';
xBox.style.top = (bgCanvas.height / 20) + 'px';
let yBox = document.getElementById('yPositionInput');
yBox.style.left = (bgCanvas.width / 4) + 'px';
yBox.style.top = (bgCanvas.height / 10) + 'px';
let widthBox = document.getElementById('widthInput');
widthBox.style.left = (bgCanvas.width / 2) + 'px';
widthBox.style.top = (bgCanvas.height / 20) + 'px';
let heightBox = document.getElementById('heightInput');
heightBox.style.left = (bgCanvas.width / 2) + 'px';
heightBox.style.top = (bgCanvas.height / 10) + 'px';
let radiusBox = document.getElementById('radiusInput');
radiusBox.style.left = (bgCanvas.width / 2) + 'px';
radiusBox.style.top = (bgCanvas.height / 10) + 'px';

let xEnterButton=document.getElementById('xPositionEnter');
let yEnterButton=document.getElementById('yPositionEnter');
let widthEnterButton=document.getElementById('widthEnter');
let heightEnterButton=document.getElementById('heightEnter');
let radiusEnterButton=document.getElementById('radiusEnter');
xEnterButton.style.left = (bgCanvas.width / 4 + xBox.offsetWidth + 10) + 'px';
xEnterButton.style.top = xBox.style.top;
yEnterButton.style.left = (bgCanvas.width / 4 + yBox.offsetWidth + 10) + 'px';
yEnterButton.style.top = yBox.style.top;
widthEnterButton.style.left = (bgCanvas.width / 2 + widthBox.offsetWidth + 10) + 'px';
widthEnterButton.style.top = widthBox.style.top;
heightEnterButton.style.left = (bgCanvas.width / 2 + heightBox.offsetWidth + 10) + 'px';
heightEnterButton.style.top = heightBox.style.top;
radiusEnterButton.style.left = (bgCanvas.width / 2 + radiusBox.offsetWidth + 10) + 'px';
radiusEnterButton.style.top = radiusBox.style.top;

let deleteButton=document.getElementById('Delete');
deleteButton.style.left = (bgCanvas.width * 3/4) + 'px';
deleteButton.style.top = (bgCanvas.height / 20) + 'px';

let invertShapeButton=document.getElementById('Invert');
invertShapeButton.style.left = (bgCanvas.width * 3/4) + 'px';
invertShapeButton.style.top = (bgCanvas.height / 10) + 'px';

let rotateShapeButton=document.getElementById('Rotate');
rotateShapeButton.style.left = (bgCanvas.width * 7/8) + 'px';
rotateShapeButton.style.top = (bgCanvas.height / 20) + 'px';

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
    const point={x:graphCanvasMouseX, y: graphCanvasMouseY};

    if(placingShape === "none"){
        info=drawnShapes.getIntersectingShape(point);
        if(info){
            editingShapeID = info;
        } else {
            editingShapeID = undefined;
        }
    } else if(placingShape === "triangle"){
        drawnShapes.addShape(new Triangle(graphCanvasMouseX,graphCanvasMouseY, 30, 30, triangleOrientation, nextID));
        nextID++;
        placingShape='none';
    } else if(placingShape === "rectangle"){
        drawnShapes.addShape(new Rectangle(graphCanvasMouseX, graphCanvasMouseY, 30, 30, nextID));
        nextID++;
        placingShape='none';
    } else if(placingShape === "circle"){
        drawnShapes.addShape(new Circle(graphCanvasMouseX, graphCanvasMouseY, 15, nextID));
        nextID++;
        placingShape='none';
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
    } else if(calculateCentroidButton.intersects(point)){
        centroid = drawnShapes.computeCentroid(5000, shapeGraph);
    }
})


xEnterButton.addEventListener("click", function () {
    const xValue = parseFloat(xBox.value);
    if (!isNaN(xValue) && editingShapeID) {
        console.log(xValue);
        drawnShapes.modifyShapeByID(editingShapeID.id, {xPos: xValue});
        xBox.value = '';
    }
});

yEnterButton.addEventListener("click", function () {
    const yValue = parseFloat(yBox.value);
    if (!isNaN(yValue) && editingShapeID) {
        let inverseYValue = graphCanvas.height - yValue;
        drawnShapes.modifyShapeByID(editingShapeID.id, {yPos: inverseYValue});
        yBox.value = '';
    }
});

widthEnterButton.addEventListener("click", function () {
    const widthValue = parseFloat(widthBox.value);
    if (!isNaN(widthValue) && editingShapeID) {
        drawnShapes.modifyShapeByID(editingShapeID.id, {width: widthValue});
        widthBox.value = '';
    }
});

heightEnterButton.addEventListener("click", function () {
    const heightValue = parseFloat(heightBox.value);
    if (!isNaN(heightValue) && editingShapeID) {
        drawnShapes.modifyShapeByID(editingShapeID.id, {height: heightValue});
        heightBox.value = '';
    }
});

radiusEnterButton.addEventListener("click", function () {
    const radiusValue = parseFloat(radiusBox.value);
    if (!isNaN(radiusValue) && editingShapeID) {
        drawnShapes.modifyShapeByID(editingShapeID.id, {radius: radiusValue});
        radiusBox.value = '';
    }
});

deleteButton.addEventListener("click", function () {
    if (editingShapeID) {
        drawnShapes.deleteShapeByID(editingShapeID.id);
        editingShapeID = undefined;
    }
});

invertShapeButton.addEventListener("click", function () {
    if (editingShapeID) {
        drawnShapes.modifyShapeByID(editingShapeID.id, {invertIsHole: "invert"});
    }
});

rotateShapeButton.addEventListener("click", function () {
    if (editingShapeID) {
        drawnShapes.modifyShapeByID(editingShapeID.id, {rotate: "rotate"});
    }
});

//This function draws the user interface and canvas
function draw(){
    //clear last frame
    bgCanvasCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
    graphCanvasCTX.clearRect(0,0, graphCanvas.width, graphCanvas.height)

    if(editingShapeID){
        const shapeData=drawnShapes.getPropertiesByID(editingShapeID.id)
        if(shapeData){
            deleteButton.style.zIndex = 3;
            invertShapeButton.style.zIndex = 3;
            switch (shapeData.type) {
                case 'triangle':
                    xBox.style.zIndex = 3;
                    yBox.style.zIndex = 3;
                    widthBox.style.zIndex = 3;
                    heightBox.style.zIndex = 3;
                    radiusBox.style.zIndex = 0;

                    xEnterButton.style.zIndex = 3;
                    yEnterButton.style.zIndex = 3;
                    widthEnterButton.style.zIndex = 3;
                    heightEnterButton.style.zIndex = 3;
                    rotateShapeButton.style.zIndex = 3;
                    radiusEnterButton.style.zIndex = 0;
                    break;
                case 'rectangle':
                    xBox.style.zIndex = 3;
                    yBox.style.zIndex = 3;
                    widthBox.style.zIndex = 3;
                    heightBox.style.zIndex = 3;
                    radiusBox.style.zIndex = 0;

                    xEnterButton.style.zIndex = 3;
                    yEnterButton.style.zIndex = 3;
                    widthEnterButton.style.zIndex = 3;
                    heightEnterButton.style.zIndex = 3;
                    rotateShapeButton.style.zIndex = 0;
                    radiusEnterButton.style.zIndex = 0;
                    break;
                case 'circle':
                    xBox.style.zIndex = 3;
                    yBox.style.zIndex = 3;
                    radiusBox.style.zIndex = 3;
                    heightBox.style.zIndex = 0;
                    widthBox.style.zIndex = 0;

                    xEnterButton.style.zIndex = 3;
                    yEnterButton.style.zIndex = 3;
                    radiusEnterButton.style.zIndex = 3;
                    widthEnterButton.style.zIndex = 0;
                    heightEnterButton.style.zIndex = 0;
                    rotateShapeButton.style.zIndex = 0;

                    break;
                default:
                    xBox.style.zIndex = 0;
                    yBox.style.zIndex = 0;
                    widthBox.style.zIndex = 0;
                    heightBox.style.zIndex = 0;
                    radiusBox.style.zIndex = 0;

                    xEnterButton.style.zIndex = 0;
                    yEnterButton.style.zIndex = 0;
                    widthEnterButton.style.zIndex = 0;
                    heightEnterButton.style.zIndex = 0;
                    radiusEnterButton.style.zIndex = 0;
                    rotateShapeButton.style.zIndex = 0;

            }
        } else {
            xBox.style.zIndex = 0;
            yBox.style.zIndex = 0;
            widthBox.style.zIndex = 0;
            heightBox.style.zIndex = 0;
            radiusBox.style.zIndex = 0;

            xEnterButton.style.zIndex = 0;
            yEnterButton.style.zIndex = 0;
            widthEnterButton.style.zIndex = 0;
            heightEnterButton.style.zIndex = 0;
            radiusEnterButton.style.zIndex = 0;
            deleteButton.style.zIndex = 0;
            invertShapeButton.style.zIndex = 0;
            rotateShapeButton.style.zIndex = 0;
        }
    } else {
        xBox.style.zIndex = 0;
        yBox.style.zIndex = 0;
        widthBox.style.zIndex = 0;
        heightBox.style.zIndex = 0;
        radiusBox.style.zIndex = 0;

        xEnterButton.style.zIndex = 0;
        yEnterButton.style.zIndex = 0;
        widthEnterButton.style.zIndex = 0;
        heightEnterButton.style.zIndex = 0;
        radiusEnterButton.style.zIndex = 0;
        deleteButton.style.zIndex = 0;
        invertShapeButton.style.zIndex = 0;
        rotateShapeButton.style.zIndex = 0;

        xBox.value = '';
        yBox.value = '';
        widthBox.value = '';
        heightBox.value = '';
        radiusBox.value = '';
    }

    //ui for adding shapes
    addTriangleButton.draw(bgCanvasCtx);
    addRectButton.draw(bgCanvasCtx);
    addCircleButton.draw(bgCanvasCtx);

    bgCanvasCtx.fillStyle='black'
    bgCanvasCtx.font = `${textSize}px Arial`; // Text font and size
    bgCanvasCtx.textAlign = "center";
    bgCanvasCtx.textBaseline = "middle";
    let xCenter = shapeButtonXOffset;
    let yCenter = shapeButtonYOffset;
    bgCanvasCtx.fillText("Select shape to draw", xCenter, yCenter);

    //make graph BG
    graphCanvasCTX.fillStyle="white";
    shapeGraph.draw(graphCanvasCTX);

    drawnShapes.renderShapes(graphCanvasCTX, graphCanvas);
    //TODO: make UI for modifying shapes



    //draw ui for calculating Centroid
    calculateCentroidButton.draw(bgCanvasCtx);
    if(centroid){
        bgCanvasCtx.fillStyle='black'
        bgCanvasCtx.font = `${textSize}px Arial`; // Text font and size
        bgCanvasCtx.textAlign = "center";
        bgCanvasCtx.textBaseline = "middle";
        xCenter=bgCanvas.width/2;
        yCenter=bgCanvas.height*9/10;
        let message="The Centroid is: "
        message=message.concat("(", centroid.x.toFixed(1), ", ", centroid.y.toFixed(1), ")")
        bgCanvasCtx.fillText(message, xCenter, yCenter);

        graphCanvasCTX.beginPath();
        graphCanvasCTX.arc(centroid.x, graphCanvas.height-centroid.y, 5, 0, Math.PI * 2);
        graphCanvasCTX.fillStyle = 'black';
        graphCanvasCTX.fill();
        graphCanvasCTX.closePath();
    }


    //put shapes on mouse
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

    if(centroid){
        graphCanvasCTX.beginPath();
        graphCanvasCTX.arc(centroid.x, graphCanvas.height- centroid.y, 5, 0, Math.PI * 2);
        graphCanvasCTX.fillStyle = 'black';
        graphCanvasCTX.fill();
        graphCanvasCTX.closePath();
    }
    requestAnimationFrame(draw);
}


draw();
