import p5 from "p5";
import Vec2 from "./Vec2";
import globals from "@/globals";
import NeuralNetwork from "./NeuralNetwork";

export default class Bird {
    p5: p5;
    pos: Vec2;
    vel: Vec2;
    oldPos: Vec2;
    gravity: Vec2;
    jumpPower: Vec2;
    width: number;
    height: number;
    color: p5.Color;
    alive: boolean;
    score: number;
    brain: NeuralNetwork;
    fitness: number;

    constructor(p5: p5, x: number, y: number, brain: any = null) {
        this.p5 = p5;
        this.pos = new Vec2(x, y);
        this.vel = new Vec2(0, 0);
        this.oldPos = new Vec2(x, y);

        this.gravity = new Vec2(0, 0.5);
        this.jumpPower = new Vec2(0, 10);

        this.width = 30;
        this.height = 30;
        this.color = this.p5.color(255);

        if (brain) {
            this.brain = brain;
        } else {
            this.brain = new NeuralNetwork();
        }

        this.score = 0;
        this.alive = true;
        this.fitness = 0;
    }
    update(): void {
        this.think();

        this.vel.set(this.pos);
        this.vel.sub(this.oldPos);

        this.oldPos.set(this.pos);
        this.pos.add(this.vel);
        this.pos.add(this.gravity);

        this.checkCollisions();
        ++this.score;
    }

    draw(): void {
        //this.p5.fill(this.color);
        //this.p5.ellipse(this.pos.x, this.pos.y, this.width, this.height);

        this.p5.imageMode(this.p5.CENTER);

        this.p5.push();
        this.p5.translate(this.pos.x, this.pos.y);
        this.p5.rotate(this.p5.map(this.vel.y, -10, 10, -0.5, 0.5));
        this.p5.image(globals.birdImage, 0, 0, this.width, this.height);
        this.p5.pop();
    }

    jump(): void {
        this.oldPos.set(this.pos);
        this.oldPos.add(this.jumpPower);
    }

    checkCollisions() {
        // collisions with ground
        // only checking collisions on the y axis since the bird is only moving on the y axis
        const birdRadius = this.width / 2;
        if (this.pos.y + birdRadius > globals.HEIGHT) {
            this.pos.y = globals.HEIGHT - birdRadius;
        } else if (this.pos.y - birdRadius < 0) {
            this.pos.y = 0 + birdRadius;
        }

        // collisions with pipes
        for (let pipe of globals.game!.pipes) {
            const collision = pipe.checkCollision(this);
            if (collision) {
                this.alive = false;
                return;
            }
        }
    }
    think() {
        let closestPipe = globals.game!.pipes[0];
        for (let pipe of globals.game!.pipes) {
            if (pipe.pos.x < closestPipe.pos.x && pipe.pos.x > this.pos.x) {
                closestPipe = pipe;
            }
        }

        const inputs = {
            y: this.pos.y,
            yVel: this.vel.y,
            distToPipe: closestPipe.pos.x - this.pos.x,
            pipeGapTop: closestPipe.pos.y - closestPipe.gap / 2,
            pipeGapBottom: closestPipe.pos.y + closestPipe.gap / 2,
        };
        // const output = this.brain.classifySync(Object.values(inputs));
        /*if (output[0].label === "up") {
            this.jump();
        }*/
        const output = this.brain.predict(inputs);
        if (output[0] > output[1]) {
            this.jump();
        }
    }

    dispose() {
        this.brain.dispose();
    }
}
