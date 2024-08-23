import Game from "./components/Game";

interface Iglobals {
    WIDTH: number;
    HEIGHT: number;
    FPS: number;
    score: number;
    game: Game | null;
    birdsAmount: number;
    distanceBetweenPipes: number;
    birdImage: any;
    [key: string]: any;
}

const globals: Iglobals = {
    WIDTH: 1000,
    HEIGHT: 720,
    FPS: 60,
    score: 0,
    game: null,
    birdsAmount: 100,
    neuralNetworkOptions: {
        inputs: 5,
        outputs: ["up", "down"],
        task: "classification",
        noTraining: true,
    },
    distanceBetweenPipes: 400,
    birdImage: null,
};
export default globals;
