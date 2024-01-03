function Graph(id) {
    this.canvas = document.getElementById(id);
    this.ctx = this.canvas.getContext('2d');
    this.xRange = [];
    this.yRange = [];
    this.vectors = [];
    this.blockSize = [];

    this.draw = function() {
        // if size 0 in any dimension, then throw error
        let xChange = this.xRange[1] - this.xRange[0];
        let yChange = this.yRange[1] - this.yRange[0];
        if (xChange == 0 || yChange == 0) {
            throw new Error('not enough data in graph');
        }

        // get size of each square
        let sizes = this.getUnitSize();

        // draw grid
        this.ctx.strokeStyle = 'gray';
        this.ctx.lineWidth = .5;

        this.ctx.beginPath();
        for (let i = this.xRange[0]; i < this.xRange[1] + 1; i++) {
            this.ctx.moveTo(i * sizes[0], 0);
            this.ctx.lineTo(i * sizes[0], this.canvas.height);
            this.ctx.stroke();
        }

        for (let i = this.yRange[0]; i < this.yRange[1] + 1; i++) {
            this.ctx.moveTo(0, i * sizes[1]);
            this.ctx.lineTo(this.canvas.width, i * sizes[1]);
            this.ctx.stroke();
        }
        this.ctx.closePath();

        // draw vectors
        this.ctx.strokeStyle = 'black';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        for (let i = 0; i < this.vectors.length; i++) {
            let x = this.vectors[i][2][0];
            let y = this.vectors[i][2][1];

            this.ctx.moveTo(
                x * sizes[0], (y + this.vectors[i][1]) * sizes[1]);
            this.ctx.lineTo(
                (x + this.vectors[i][0]) * sizes[0],
                y * sizes[1]
            );
            this.ctx.stroke();
        }
        this.ctx.closePath();

        return 1;
    }

    this.addVector = function(x, y, start, label) {
        let xVec = (start[0], start[0] + x);
        let yVec = (start[1], start[1] + y);

        if (this.xRange.length == 0) {
            this.xRange.push(Math.min(xVec));
            this.xRange.push(Math.max(xVec));
            this.yRange.push(Math.min(yVec));
            this.yRange.push(Math.max(yVec));
        } else {
            if (Math.min(xVec) < this.xRange[0]) {
                this.xRange[0] = Math.min(xVec);
            }
            if (Math.max(xVec) > this.xRange[1]) {
                this.xRange[1] = Math.max(xVec);
            }
            if (Math.min(yVec) < this.yRange[0]) {
                this.yRange[0] = Math.min(yVec);
            }
            if (Math.max(yVec) > this.yRange[1]) {
                this.yRange[1] = Math.max(yVec);
            }
        }

        this.vectors.push([x, y, start, label]);
        return 1;
    }

    this.getUnitSize = function() {
        let xSize = this.canvas.width / (
            this.xRange[1] - this.xRange[0]);
        let ySize = this.canvas.height / (
            this.yRange[1] - this.yRange[0]);

        return [xSize, ySize];
    }

    this.realCoords = function(x, y) {
        // TODO: normalize coords
    }
}