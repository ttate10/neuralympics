# Flappy Bird NeuroEvolution AI

A [NeuroEvolution](https://en.wikipedia.org/wiki/Neuroevolution) AI for the game Flappy Bird.

[Demo](https://ttate10.github.io/neuralympics/)

![Example Screenshot](https://raw.githubusercontent.com/ttate10/neuralympics/main/docs/screenshot.png)

# Tech Stack
[![Tensorflow](https://img.shields.io/badge/-Tensorflow-05122A?style=flat&logo=tensorflow)](https://www.tensorflow.org/)
[![Tensorflow.js](https://img.shields.io/badge/-Tensorflow.js-05122A?style=flat&logo=tensorflow)](https://www.tensorflow.org/js)
[![p5.js](https://img.shields.io/badge/-p5.js-05122A?style=flat&logo=p5.js)](https://p5js.org/)
[![Vite](https://img.shields.io/badge/-Vite-05122A?style=flat&logo=vite)](https://vitejs.dev/)
[![Svelte](https://img.shields.io/badge/-Svelte-05122A?style=flat&logo=svelte)](https://svelte.dev/)
[![Typescript](https://img.shields.io/badge/-Typescript-05122A?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Github Actions](https://img.shields.io/badge/-Github%20Actions-05122A?style=flat&logo=github-actions)](https://github.com/features/actions)

# How it works
The algorithm used is a [NeuroEvolution](https://en.wikipedia.org/wiki/Neuroevolution) algorithm.
NeuroEvolution is a technique inspired by the process of natural evolution, where a population of AI agents undergoes a genetic algorithm-based optimization to improve their performance over generations.

The process starts with the initialization of a population of AI agents (with random [Neural Networks](https://en.wikipedia.org/wiki/Neural_network)).
Each agent is then evaluated by playing the game and receiving a fitness score based on how well it performed. The fitness score is calculated by the distance the agent has traveled.
The agents with the highest fitness scores are then selected to reproduce and create the next generation of agents.
The process is then repeated until the agents are able to play the game.

## Neural Network
![Neural Network](https://raw.githubusercontent.com/ttate10/neuralympics/main/docs/neural-network.png)



# How to run
```bash
git clone https://github.com/ttate10/neuralympics.git

pnpm install

pnpm run dev
```