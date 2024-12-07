const bgCanvas=document.getElementById("centroidCanvas");
const bgCanvasCtx=bgCanvas.getContext('2d');

bgCanvas.width=window.innerWidth;
bgCanvas.height=window.innerHeight;

let graphCanvas=document.getElementById("graphSpace");
let graphCanvasCTX=graphCanvas.getContext('2d');

let shapeGraphDimensions={x:Math.floor(window.innerWidth*(2/10)),
                                y:Math.floor(window.innerHeight*(2/10)),
                                width:Math.floor(window.innerWidth*(3/4)),
                                height:Math.floor(window.innerHeight*(6/10))};



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
        //TODO: code to modify shapes

    } else if(placingShape === "triangle"){
        drawnShapes.addShape(new Triangle(graphCanvasMouseX,graphCanvasMouseY, 30, 30, triangleOrientation));
        placingShape='none';
    } else if(placingShape === "rectangle"){
        drawnShapes.addShape(new Rectangle(graphCanvasMouseX, graphCanvasMouseY, 30, 30));
        placingShape='none';
    } else if(placingShape === "circle"){
        drawnShapes.addShape(new Circle(graphCanvasMouseX, graphCanvasMouseY, 15));
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
        centroid = drawnShapes.computeCentroid(100, shapeGraph);
    }
})


//This function draws the user interface and canvas
function draw(){

    //clear last frame
    bgCanvasCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height)
    graphCanvasCTX.clearRect(0,0, graphCanvas.width, graphCanvas.height)

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
        console.log(message);
        bgCanvasCtx.fillText(message, xCenter, yCenter);
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

    requestAnimationFrame(draw);
}


draw();
