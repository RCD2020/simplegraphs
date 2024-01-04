function Label(text, pos, color='black', size=15) {
    this.pos = pos;

    this.text = text;
    this.color = color;
    this.size = size;
}


function Vector(movement, start, label, color='black') {
    this.x1 = start[0];
    this.y1 = start[1];
    this.vecX = movement[0];
    this.vecY = movement[1];
    this.x2 = this.x1 + this.vecX;
    this.y2 = this.y1 + this.vecY;
    
    this.color = color;

    if (typeof(label) == 'string') {
        let angle = Math.atan(this.vecY / this.vecX);
        if (this.vecX < 0 == this.vecY < 0) {
            angle += 270 * (Math.PI / 180);
        } else {
            angle += 90 * (Math.PI / 180);
        }
        let xlabadj = Math.cos(angle) * .1;
        let ylabadj = Math.sin(angle) * .1;

        this.label = new Label(
            label, [
                this.x1 + this.vecX / 2 + xlabadj,
                this.y1 + this.vecY / 2 + ylabadj
            ]
        );
    } else {
        this.label = label;
    }

    this.packageCoords = function() {
        // [[start], [end]]
        return [
            [this.x1, this.y1],
            [this.x2, this.y2]
        ]
    }
}


function Graph(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.xRange = [];
    this.yRange = [];
    this.vectors = [];
    this.xSize = NaN;
    this.ySize = NaN;
    this.labels = [];

    this.draw = function() {
        // if bounds not set, then throw error
        if (this.xRange.length == 0 || this.yRange.length == 0) {
            throw new Error('not enough data in graph');
        }

        // draw grid
        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = .5;

        // TODO: label axis
        this.ctx.beginPath();
        for (let i = this.xRange[0]; i < this.xRange[1] + 1; i++) {
            this.ctx.moveTo(i * this.xSize, 0);
            this.ctx.lineTo(i * this.xSize, this.canvas.height);
            this.ctx.stroke();
        }

        for (let i = this.yRange[0]; i < this.yRange[1] + 1; i++) {
            this.ctx.moveTo(0, i * this.ySize);
            this.ctx.lineTo(this.canvas.width, i * this.ySize);
            this.ctx.stroke();
        }
        this.ctx.closePath();

        // draw vectors
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;

        for (let i = 0; i < this.vectors.length; i++) {
            this.ctx.beginPath();
            let coords = this.vectors[i].packageCoords();
            let start = this.getDrawCoords(coords[0]);
            let end = this.getDrawCoords(coords[1]);

            // draw vector line
            this.ctx.moveTo(...start);
            this.ctx.lineTo(...end);
            this.ctx.stroke();
            this.ctx.closePath();

            // draw arrow
            this.ctx.beginPath();
            // adjust angle
            let newAngle = Math.atan(-1 * (end[1] - start[1]) / (end[0] - start[0]));
            if (end[0] - start[0] < 0) {
                newAngle += Math.PI;
            }
            newAngle -= .25;
        
            let xArrow = Math.cos(newAngle) * 25;
            let yArrow = Math.sin(newAngle) * 25;
            this.ctx.lineTo(end[0] - xArrow, end[1] + yArrow);

            newAngle += .5;
            xArrow = Math.cos(newAngle) * 25;
            yArrow = Math.sin(newAngle) * 25;
            this.ctx.lineTo(end[0] - xArrow, end[1] + yArrow);

            this.ctx.lineTo(...end);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();

            // label vector
            this.ctx.beginPath();
            this.ctx.font = this.vectors[i].label.size + 'px Arial';

            this.ctx.fillText(
                this.vectors[i].label.text,
                ...this.getDrawCoords(this.vectors[i].label.pos)
            );

            this.ctx.closePath();
        }

        return 1;
    }

    this.addVector = function(x, y, vecX, vecY, label, color='black') {
        let vector = new Vector([vecX, vecY], [x, y], label, color);

        this.pushVector(vector);
    }

    this.pushVector = function(vector) {
        this.increaseBounds(
            vector.x1, vector.y1,
            vector.x2, vector.y2
        );

        this.vectors.push(vector)
    }

    this.increaseBounds = function(x1, y1, x2, y2) {
        if (this.xRange.length == 0) {
            this.xRange.push(Math.min(x1, x2));
            this.xRange.push(Math.max(x1, x2));
            this.yRange.push(Math.min(y1, y2));
            this.yRange.push(Math.max(y1, y2));
        } else {
            if (Math.min(x1, x2) < this.xRange[0]) {
                this.xRange[0] = Math.min(x1, x2);
            }
            if (Math.max(x1, x2) > this.xRange[1]) {
                this.xRange[1] = Math.max(x1, x2);
            }
            if (Math.min(y1, y2) < this.yRange[0]) {
                this.yRange[0] = Math.min(y1, y2);
            }
            if (Math.max(y1, y2) > this.yRange[1]) {
                this.yRange[1] = Math.max(y1, y2);
            }
        }
        this.generateBlockSize();
    }

    this.generateBlockSize = function() {
        let xSize = this.canvas.width / (
            this.xRange[1] - this.xRange[0]);
        let ySize = this.canvas.height / (
            this.yRange[1] - this.yRange[0]);

        this.xSize = xSize;
        this.ySize = ySize;
    }

    this.getDrawCoords = function(coords) {
        return [
            this.xSize * (coords[0] - this.xRange[0]),
            this.canvas.height - this.ySize * (coords[1] - this.yRange[0])
        ]
    }

    this.pushLabel = function(label) {
        this.labels.push(label);
    }
}