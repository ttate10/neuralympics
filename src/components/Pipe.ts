import p5 from "p5";
import Vec2 from "@/components/Vec2";
import Bird from "@/components/Bird";
import globals from "@/globals";

export default class Pipe {
    p5: p5;
    pos: Vec2;
    width: number;
    gap: number;
    color: p5.Color;
    speed: number;

    constructor(p5: p5, x: number | null = null, y: number | null = null) {
        this.p5 = p5;
        this.pos = new Vec2(x || 0, y || 0);
        this.width = 50;
        this.gap = 250;
        this.color = this.p5.color(0, 255, 0);
        this.speed = 4;

        if (!x) {
            this.pos.x =
                globals.game!.pipes.at(-1)!.pos.x +
                globals.distanceBetweenPipes;
        }
        if (!y) {
            this.pos.y = this.p5.random(
                0 + (globals.HEIGHT * 0.1 + this.gap / 2),
                globals.HEIGHT - (globals.HEIGHT * 0.1 + this.gap / 2)
            );
        }
    }

    update(): void {
        this.pos.x -= this.speed;
    }
    draw(): void {
        this.p5.fill(this.color);
        // lower pipe
        const lowerPipeHeight = globals.HEIGHT - this.pos.y - this.gap / 2;
        this.p5.rect(
            this.pos.x,
            this.pos.y + this.gap / 2,
            this.width,
            lowerPipeHeight
        );
        // upper pipe
        const upperPipeHeight = this.pos.y - this.gap / 2;
        this.p5.rect(this.pos.x, 0, this.width, upperPipeHeight);
    }

    checkCollision(bird: Bird): boolean {
        if (
            bird.pos.x + bird.width / 2 > this.pos.x &&
            bird.pos.x - bird.width / 2 < this.pos.x + this.width
        ) {
            if (
                bird.pos.y + bird.height / 2 > this.pos.y + this.gap / 2 ||
                bird.pos.y - bird.height / 2 < this.pos.y - this.gap / 2
            ) {
                return true;
            }
        }

        return false;
    }
}
