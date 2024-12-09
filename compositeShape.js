class CompositeShape{
    #shapes;
    constructor() {
        this.#shapes = new Array(0)
    }

    addShape(shape){
        this.#shapes.push(shape);
    }

    computeCentroid(steps, graph) {
        let largestXValue = 0;
        let largestYValue = 0;

        if (this.#shapes.length === 0) {
            return undefined;
        }
        for (const shape of this.#shapes) {
            switch (shape.type) {
                case "rectangle":
                    if (largestXValue < shape.xPos + shape.width / 2) {
                        largestXValue = shape.xPos + shape.width / 2;
                    }
                    if (largestYValue < graph.height-shape.yPos + shape.height / 2) {
                        largestYValue = graph.height-shape.yPos + shape.height / 2;
                    }
                    break;
                case "circle":
                    if (largestXValue < shape.xPos + shape.radius) {
                        largestXValue = shape.xPos + shape.radius;
                    }
                    if (largestYValue < graph.height-shape.yPos + shape.radius) {
                        largestYValue = graph.height-shape.yPos + shape.radius;
                    }
                    break;
                case "triangle":
                    if (largestXValue < shape.xPos + shape.width / 2) {
                        largestXValue = shape.xPos + shape.width / 2;
                    }
                    if (largestYValue < graph.height-shape.yPos + shape.height / 2) {
                        largestYValue = graph.height-shape.yPos + shape.height / 2;
                    }
                    break;
                default:
                    break;
            }
        }

        let dA = largestXValue / steps * largestYValue / steps;
        let area = 0;
        let xdA = 0;
        let ydA = 0;
        for (let x = 0; x <= largestXValue; x += largestXValue / steps) {
            for (let y = 0; y <= largestYValue; y += largestYValue / steps) {

                if (this.invertedIntersectsCompositeShape({x: x, y: y}, graph)) {
                    area += dA;
                    xdA += x * dA;
                    ydA += y * dA;
                }
            }
        }
        if (area > 0) {
            return {x: xdA / area, y: ydA / area};
        }
        return undefined;
    }

    renderShapes(context, canvas){
        let shapeColor;
        for(const shape of this.#shapes) {
            if(shape.isHole){
                shapeColor="white";
            } else {
                shapeColor='pink';
            }
            context.fillStyle=shapeColor;
            if (shape.type === "rectangle"){
                let rectXPos= shape.xPos - shape.width/2;
                let rectYpos=shape.yPos - shape.width/2;
                context.fillRect(rectXPos, rectYpos, shape.width, shape.height);

            } else if (shape.type === 'circle') {
                context.beginPath();
                context.beginPath();
                context.arc(shape.xPos, shape.yPos, shape.radius, 0, Math.PI * 2);
                context.fill();
                context.closePath();

            } else if (shape.type === 'triangle'){
                drawTriangle(context, shape.xPos, shape.yPos, shape.width, shape.height, shape.orientation, shapeColor);
            }
        }
    }

    modifyShapeByID(id, ...attributes){
        const matchesID = (element) => element.id === id;
        let index=this.#shapes.findIndex(matchesID);
        if(index >= 0){
            let type = this.#shapes[index].type;
            attributes=attributes[0];
            if(attributes.invertIsHole){
                this.#shapes[index].invert();
            }
            switch (type) {
                case 'triangle':
                    if(attributes.width){
                        this.#shapes[index].width = attributes.width;
                    }
                    if(attributes.height){
                        this.#shapes[index].height = attributes.height;
                    }
                    if(attributes.xPos){
                        this.#shapes[index].xPos = attributes.xPos;
                    }
                    if (attributes.yPos){
                        this.#shapes[index].yPos = attributes.yPos;
                    }
                    if(attributes.rotate){
                        this.#shapes[index].orientation = this.#shapes[index].orientation + 1;
                        if (this.#shapes[index].orientation > 4) {
                            this.#shapes[index].orientation = 1;
                        }
                    }
                    break;
                case 'circle':
                    if(attributes.radius){
                        this.#shapes[index].radius = attributes.radius;
                    }
                    if(attributes.xPos){
                        this.#shapes[index].xPos = attributes.xPos;
                    }
                    if (attributes.yPos){
                        this.#shapes[index].yPos = attributes.yPos;
                    }
                    break;
                case 'rectangle':
                    if(attributes.width){
                        this.#shapes[index].width = attributes.width;
                    }
                    if(attributes.height){
                        this.#shapes[index].height = attributes.height;
                    }
                    if(attributes.xPos){
                        this.#shapes[index].xPos = attributes.xPos;
                    }
                    if (attributes.yPos){
                        this.#shapes[index].yPos = attributes.yPos;
                    }
                    break;
                default:
                    return false;
            }
            return true;
        }
        return false;
    }

    getPropertiesByID(id){
        const matchesID = (element) => element.id === id;
        const index=this.#shapes.findIndex(matchesID);
        if (index>=0){
            const data={id:this.#shapes[index].id, type:this.#shapes[index].type};

            switch (this.#shapes[index].type) {
                case 'triangle':
                    data.width = this.#shapes[index].width;
                    data.height = this.#shapes[index].height;
                    data.xPos = this.#shapes[index].xPos;
                    data.yPos = this.#shapes[index].yPos;
                    data.orientation = this.#shapes[index].orientation;
                    break;
                case 'circle':
                    data.radius = this.#shapes[index].radius;
                    data.xPos = this.#shapes[index].xPos;
                    data.yPos = this.#shapes[index].yPos;
                    break;
                case 'rectangle':
                    data.width = this.#shapes[index].width;
                    data.height = this.#shapes[index].height;
                    data.xPos = this.#shapes[index].xPos;
                    data.yPos = this.#shapes[index].yPos;
                    break;
                default:
                    throw new Error("Unknown shape type");
            }
            return data;
        }
        return undefined;
    }

    getIntersectingShape(point){
        for(const shape of this.#shapes){
            if(shape.intersects(point)){
                return{id:shape.id, type:shape.type};
                
            }
        }
        return undefined;
    }

    intersectsCompositeShape(point){
        let intersectsShape = false;
        for(const shape of this.#shapes){
            if(shape.intersects(point)){
                if(shape.isHole){
                    return false;
                }
                intersectsShape = true;
            }
        }
        return intersectsShape;
    }


    invertedIntersectsCompositeShape(point, graph) {
        let intersectsShape = false;
        for (const shape of this.#shapes) {
            let invertedPoint = {x: point.x, y: graph.height - point.y};
            if (shape.intersects(invertedPoint)) {
                if (shape.isHole) {
                    return false;
                }
                intersectsShape = true;
            }
        }
        return intersectsShape;
    }

    deleteShapeByID(id) {
        const matchesID = (element) => element.id === id;
        const index = this.#shapes.findIndex(matchesID);
        if (index >= 0) {
            this.#shapes.splice(index, 1);
            return true;
        }
        return false;
    }
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
