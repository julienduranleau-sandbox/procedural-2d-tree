class Game {
    constructor() {
        createCanvas(window.innerWidth, window.innerHeight)

        this.tree = null

        this.button = createButton('Make a new tree')
        this.button.position(width - 140, 20)
        this.button.mousePressed(() => this.drawNewTree())

        this.drawNewTree()
    }

    drawNewTree() {
        background(225, 225, 225)

        let initialDrawStart = new p5.Vector(width * 0.5, height * 0.9)
        let initialAngle = PI * -0.5
        let initialWeight = 10
        let initialLength = 200
        let initialRecruseLevel = 0

        this.tree = new Branch(initialDrawStart, initialAngle, initialWeight, initialLength, initialRecruseLevel)
    }

    draw() {
        this.tree.draw()
    }

}


class Branch {
    constructor(drawStart, angle, lineWeight, length, recurseLevel) {
        this.branches = []
        this.progress = 0
        this.drawStart = drawStart
        this.angle = angle
        this.lineWeight = lineWeight
        this.lengthToDraw = length
        this.recurseLevel = recurseLevel
    }

    draw() {
        if (this.progress < 1) {
            let drawEndX = this.drawStart.x
            let drawEndY = this.drawStart.y

            let drawEndXOffset = random(-0.5, 0.5) * (0.4 + 0.1 * this.recurseLevel)

            drawEndX += cos(this.angle + drawEndXOffset) * (this.lengthToDraw * 0.1)
            drawEndY += sin(this.angle) * (this.lengthToDraw * 0.1)

            if (this.recurseLevel >= 3) {
                let redShade = 190 + random(0, 50)
                redShade *= 0.5 + ((drawEndX - width * 0.5) + 200) / 400
                redShade *= 0.5 * (600 / ((drawEndY - height * 0.9) + 600))

                stroke(redShade, 37, 170)
                strokeWeight(random(2, 7))
            } else {
                stroke(40, 19, 7)
                strokeWeight(this.lineWeight)
            }

            line(this.drawStart.x, this.drawStart.y, drawEndX, drawEndY)

            this.drawStart.set(drawEndX, drawEndY)
            this.progress += 0.1

            if (random(0, 1) > 0.5 && this.progress > 0.35) {
                this.spawnBranch()
            }

            if(this.progress >= 1) {
                this.spawnBranches()
            }

        } else {
            for (let i = 0; i < this.branches.length; i++) {
                this.branches[i].draw()
            }
        }
    }

    spawnBranch() {
        if (this.recurseLevel >= 4) {
            return
        }

        let angleChange = PI * 0.3 + (PI * (0.2 * this.recurseLevel))
        let angle = this.angle + random(-angleChange, angleChange)
        let lineWeight = this.lineWeight * 0.5
        let lengthToDraw = this.lengthToDraw * (0.7 - this.recurseLevel * 0.15)
        let recurseLevel = this.recurseLevel + 1
        let branch = new Branch(this.drawStart.copy(), angle, lineWeight, lengthToDraw, recurseLevel)
        this.branches.push(branch)
    }

    spawnBranches() {
        let nBranches = (this.recurseLevel >= 2) ? floor(random(0, 8)) : 2 + floor(random(0, 3))

        for (let i = 0; i < nBranches; i++) {
            this.spawnBranch()
        }
    }
}
