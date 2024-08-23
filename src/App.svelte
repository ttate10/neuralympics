<script lang="ts">
    import P5, { type p5 } from "p5-svelte";
    import * as tf from "@tensorflow/tfjs";
    import globals from "@/globals";
    import Game from "@/components/Game";

    import ModelView from "tfjs-model-view";

    import Switch from "./components/Switch.svelte";

    let birdsAlive = 0;
    let gameSpeed = 1;
    let generation = 1;
    let scale = 1;

    let showNetworkVisualization = false;

    let modelElement: HTMLElement;

    const p5 = (p5: p5) => {
        p5.preload = () => {
            globals.birdImage = p5.loadImage("bird.png");
        };
        p5.setup = () => {
            p5.createCanvas(globals.WIDTH, globals.HEIGHT);
            p5.frameRate(globals.FPS);
            tf.setBackend("cpu");

            adjustCanvasSizeToScreen();

            globals.game = new Game(p5);
        };
        p5.draw = () => {
            p5.background(0);
            p5.scale(scale);

            for (let i = 0; i < gameSpeed; ++i) {
                globals.game!.update();
            }
            globals.game!.draw();

            if (
                showNetworkVisualization &&
                globals.game?.birds.length != birdsAlive
            ) {
                updateModelVisualization();
            }
            birdsAlive = globals.game?.birds.length;
            generation = globals.game?.generation;
        };
        p5.windowResized = () => {
            adjustCanvasSizeToScreen();
        };

        const adjustCanvasSizeToScreen = () => {
            if (p5.windowWidth < globals.WIDTH) {
                scale = 0.5;
                p5.resizeCanvas(
                    Math.max(p5.windowWidth * 0.8, 150),
                    globals.HEIGHT * 0.5
                );
            } else {
                scale = 1;
                p5.resizeCanvas(globals.WIDTH, globals.HEIGHT);
            }
        };
    };

    function handleNetworkVisualizationChange(
        e: CustomEvent<{ checked: boolean }>
    ) {
        const checked = e.detail.checked;
        if (checked) {
            updateModelVisualization();
        } else {
            modelElement.innerHTML = "";
        }
    }

    function updateModelVisualization() {
        new ModelView(globals.game?.birds[0].brain.model, {
            printStats: true,
            renderLinks: true,
            radius: 25,
            groupPadding: 10,
            layerPadding: 30,
            nodePadding: 5,
            xPadding: 40,
            Padding: 20,
            xOffset: 100,

            onRendererInitialized: (renderer) => {
                modelElement.innerHTML = "";
                modelElement.appendChild(renderer.canvas);
            },

            renderNode(ctx, node) {
                const { x, y, value } = node;
                ctx.font = "10px Arial";
                ctx.fillStyle = "#aaa";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.fillText(Math.round(value * 100) / 100, x, y);
            },
            onBeginRender: (renderer) => {
                const { renderContext } = renderer;
                renderContext.fillStyle = "#fff";
                renderContext.textAlign = "end";
                renderContext.font = "12px Arial";
                renderContext.fillText("Bird Y position", 130, 100);
                renderContext.fillText("Bird Y velocity", 130, 130);
                renderContext.fillText("Distance to next Pipe", 130, 163);
                renderContext.fillText("Pipe top", 130, 190);
                renderContext.fillText("Pipe bottom", 130, 220);

                renderContext.textAlign = "start";
                renderContext.fillText("jump", renderer.width - 70, 145);
                renderContext.fillText("dont jump", renderer.width - 70, 175);
            },
        });
    }
</script>

<header>
    <h1>neuralympics</h1>
</header>

<section>
    <P5 sketch={p5} />

    <div class="controls">
        <div class="info">
            <p>Birds Alive: {birdsAlive}<br /> Generation: {generation}</p>
        </div>

        <div class="speed">
            <label>
                Game Speed: {gameSpeed}
                <div>
                    1
                    <input
                        type="range"
                        name="gameSpeed"
                        id="gameSpeed"
                        min="1"
                        max="20"
                        bind:value={gameSpeed}
                    />
                    20
                </div>
            </label>
        </div>

        <div>
            <button on:click={() => globals.game.hardRestart()}>Restart</button>
            <button on:click={() => globals.game.manualNewGeneration()}
                >New Generation</button
            >
        </div>
    </div>
</section>

<section>
    <div class="model-visualization-toggle-wrapper">
        <Switch
            bind:checked={showNetworkVisualization}
            label="Show Network"
            on:toggle={handleNetworkVisualizationChange}
        />
    </div>
    <h2>Neural Network Visualization</h2>
    <div class="model-visualization" bind:this={modelElement} />
</section>

<footer>
    <p>
        Repo is <a href="https://github.com/ttate10" target="_blank"
            >available</a
        >
    </p>
</footer>

<style>
    :global(.p5Canvas) {
        border-radius: 15px;
        box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
    }

    section {
        display: flex;
        flex-direction: column;
        align-items: center;

        margin: 0 1rem;
        padding: 1.5rem;

        background: #141723;
        border: 1px solid #2a3448;
        border-radius: 15px;
        box-shadow: 5px 5px 20px rgba(0, 0, 0, 0.5);
    }

    section:not(:first-child) {
        margin: 1rem;
    }

    .controls {
        width: 100%;

        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        align-items: center;
    }

    .controls * {
        text-align: start;
    }

    .controls *:nth-child(3) {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
    }

    .speed label {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    button {
        background: linear-gradient(#564cfc, #6a5bfc);
        box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
        color: #fff;
    }

    input[type="range"] {
        accent-color: #6a5bfc;
    }

    .model-visualization {
        height: 330px;
    }
    .model-visualization-toggle-wrapper {
        width: 100%;
        display: flex;
        justify-content: flex-end;
    }

    footer {
        margin-top: 5rem;
        margin-bottom: 2rem;
        text-align: center;
    }

    @media (max-width: 720px) {
        header h1 {
            font-size: 2.5rem;
        }
        section {
            padding: 1rem;
        }
        .controls {
            display: flex;
            gap: 1rem;
            flex-direction: column;
            align-items: center;
        }
    }
</style>
