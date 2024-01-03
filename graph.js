function Vector(movement, start, label, color='black') {
    this.x1 = start[0];
    this.y1 = start[1];
    this.vecX = movement[0];
    this.vecY = movement[1];
    this.x2 = this.x1 + this.vecX;
    this.y2 = this.y1 + this.vecY;
    
    this.label = label;
    this.color = color;
}


function Graph(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.xRange = [];
    this.yRange = [];
    this.vectors = [];
    this.xSize = NaN;
    this.ySize = NaN;

    this.draw = function() {
        // if bounds not set, then throw error
        if (this.xRange.length == 0 || this.yRange.length == 0) {
            throw new Error('not enough data in graph');
        }

        // draw grid
        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = .5;

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
        // this.ctx.strokeStyle = 'black';
        // this.ctx.lineWidth = 2;

        // this.ctx.beginPath();
        // for (let i = 0; i < this.vectors.length; i++) {
        //     let x1 = this.getDrawCoord(this.vectors[i][2][0]);
        //     let x2 = this.getDrawCoord(this.vectors[i][2][0] + );
        //     let y1 = this.getDrawCoord(this.vectors[i][2][1], false);

        //     this.ctx.moveTo(
        //         x * sizes[0], (y + this.vectors[i][1]) * sizes[1]);
        //     this.ctx.lineTo(
        //         (x + this.vectors[i][0]) * sizes[0],
        //         y * sizes[1]
        //     );
        //     this.ctx.stroke();
        // }
        // this.ctx.closePath();

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

    this.getDrawCoord = function(coord, isX = true) {
        if (isX) {
            let coord1 = coord - xRange[0];
            coord1 *= this.xSize;
        } else {
            let coord1 = coord - yRange[0];
            coord1 *= this.ySize;
        }

        return coord
    }
}