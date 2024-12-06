
class Shape{
    #xPos;
    #yPos;
    #isHole;
    #type;
    #id;
    constructor(xPos, yPos, id) {
        this.#xPos = xPos;
        this.#yPos = yPos;
        this.#id = id;
    }

    get id() {
        return this.#id;
    }

    set id(value) {
        this.#id = value;
    }

    get type() {
        return this.#type;
    }

    set type(value) {
        this.#type = value;
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

    intersects(point){
        throw new Error('You have to implement the method intersect!');
    }
}

class Circle extends Shape{
    #radius;
    constructor(xPos, yPos, radius, id) {
        super(xPos, yPos, id);
        this.#radius = radius;
        super.type="circle"
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

    intersects(point) {
       const dx=point.x - this.xPos;
       const dy=point.y - this.yPos;
       const distance=Math.sqrt(dx**2 + dy**2);
       return distance <= this.#radius;
    }
}

class Rectangle extends Shape{
    #width;
    #height;
    constructor(xPos, yPos, width, height, id) {
        super(xPos, yPos, id)
        this.#width = width;
        this.#height = height;
        super.type='rectangle'
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
    intersects(point){
        return point.x >= this.xPos-this.#width/2
            && point.x <= this.xPos+this.#width/2
            && point.y >= this.yPos-this.#height/2
            && point.y <= this.yPos+this.#height/2;
    }
}

class Triangle extends Rectangle{
    #orientation;

    constructor(xPos, yPos, width, height, orientation, id) {
        super(xPos, yPos, width, height, id);
        this.#orientation = orientation;
        super.type='triangle'
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
    intersects(point) {
        if(super.intersects(point)){
            const rectTopL={x:this.xPos-this.width/2, y:this.yPos-this.height};
            const x=point.x-rectTopL.x;
            const y=point.y-rectTopL.y;
            const m=this.height/this.width;
            const h=this.height;
            switch (this.#orientation) {
                case 1:
                    return y > m * x;

                case 2:
                    return y > h - m * x;
                case 3:
                    return y < h - m * x;
                case 4:
                    return y < m * x;
            }
        } else return false;
    }
}

