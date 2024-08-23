import p5 from "p5";
import * as tf from "@tensorflow/tfjs";
import globals from "@/globals";

import Bird from "@/components/Bird";
import Pipe from "@/components/Pipe";

export default class Game {
    p5: p5;
    birds: Array<Bird>;
    pipes: Array<Pipe>;
    deadBirds: Array<Bird>;
    pipesAmount: number;
    generation: number;

    constructor(p5: p5) {
        this.p5 = p5;

        this.birds = [];
        this.pipes = [];

        this.deadBirds = [];

        this.pipesAmount =
            Math.ceil(globals.WIDTH / globals.distanceBetweenPipes) + 1;

        this.generation = 1;

        this.setup();
    }

    setup(): void {
        // birds
        for (let i = 0; i < globals.birdsAmount; ++i) {
            this.birds.push(new Bird(this.p5, 100, globals.HEIGHT / 2));
        }

        this.resetPipes();
    }

    update(): void {
        this.updateBirds();
        this.updatePipes();

        if (this.birds.length === 0) {
            this.restart();
        }
    }
    draw(): void {
        this.p5.background(0);
        this.p5.noStroke();

        for (let bird of this.birds) {
            bird.draw();
        }
        for (let pipe of this.pipes) {
            pipe.draw();
        }
    }

    updateBirds(): void {
        for (let bird of this.birds) {
            bird.update();
        }

        for (let i = 0; i < this.birds.length; ++i) {
            if (!this.birds[i].alive) {
                this.deadBirds.push(this.birds.splice(i, 1)[0]);
            }
        }
    }

    updatePipes(): void {
        for (let pipe of this.pipes) {
            pipe.update();
        }

        if (this.pipes[0].pos.x < 0 - this.pipes[0].width) {
            this.pipes.shift();
            this.pipes.push(new Pipe(this.p5));
        }
    }

    resetPipes(): void {
        this.pipes = [];
        for (let i = 0; i < this.pipesAmount; ++i) {
            this.pipes.push(
                new Pipe(
                    this.p5,
                    globals.WIDTH + i * globals.distanceBetweenPipes
                )
            );
        }
    }

    deleteBirds(): void {
        this.birds.forEach((brid) => {
            brid.dispose();
        });
        this.birds = [];
    }
    deleteDeadBirds(): void {
        this.deadBirds.forEach((brid) => {
            brid.dispose();
        });
        this.deadBirds = [];
    }

    hardRestart(): void {
        this.deleteBirds();
        this.deleteDeadBirds();
        this.generation = 1;

        this.setup();

        this.resetPipes();
    }
    manualNewGeneration(): void {
        this.deadBirds.concat(this.birds);
        this.newGeneration();
        this.deadBirds = [];

        this.resetPipes();
    }

    restart(): void {
        //this.birds = [];

        this.newGeneration();
        this.deleteDeadBirds();

        this.resetPipes();
    }

    newGeneration(): void {
        const calculateFitness = () => {
            let sum = 0;
            for (let bird of this.deadBirds) {
                sum += bird.score;
            }
            for (let bird of this.deadBirds) {
                bird.fitness = bird.score / sum;
            }
        };
        const pickOne = () => {
            let index = 0;
            let r = this.p5.random(1);
            while (r > 0) {
                r = r - this.deadBirds[index].fitness;
                index++;
            }
            index--;
            let bird = this.deadBirds[index];
            return bird.brain;
        };
        const reproduce = () => {
            const brainA = pickOne();
            const brainB = pickOne();

            const childBrain = brainA.crossover(brainB);

            childBrain.mutate(0.1);

            return new Bird(this.p5, 100, globals.HEIGHT / 2, childBrain);
        };

        this.generation++;

        calculateFitness();

        while (this.birds.length < globals.birdsAmount) {
            this.birds.push(reproduce());
        }
    }
}
