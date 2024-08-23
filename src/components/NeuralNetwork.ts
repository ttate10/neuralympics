import * as tf from "@tensorflow/tfjs";

interface NeuralNetworkInputs {
    y: number;
    yVel: number;
    distToPipe: number;
    pipeGapTop: number;
    pipeGapBottom: number;
}

export default class NeuralNetwork {
    model: tf.Sequential;

    constructor() {
        this.model = tf.sequential();

        this.model.add(
            tf.layers.dense({ units: 10, activation: "relu", inputShape: [5] })
        );
        this.model.add(tf.layers.dense({ units: 8, activation: "relu" }));
        this.model.add(tf.layers.dense({ units: 2, activation: "softmax" }));
    }

    predict(inputs: NeuralNetworkInputs): number[] {
        return tf.tidy(() => {
            const inputArray = [
                inputs.y,
                inputs.yVel,
                inputs.distToPipe,
                inputs.pipeGapTop,
                inputs.pipeGapBottom,
            ];
            const inputTensor = tf.tensor2d(inputArray, [1, 5]);
            const outputTensor = this.model.predict(inputTensor) as tf.Tensor;
            const outputData = outputTensor.dataSync();
            return Array.from(outputData);
        });
    }

    crossover(partner: NeuralNetwork): NeuralNetwork {
        const weights = this.model.getWeights();
        const partnerWeights = partner.model.getWeights();
        const newWeights: tf.Tensor[] = [];

        for (let i = 0; i < weights.length; i++) {
            const weightsShape = weights[i].shape;
            const weightsData = weights[i].dataSync().slice();
            const partnerWeightsData = partnerWeights[i].dataSync().slice();
            const newWeightsData: any = [];

            for (let j = 0; j < weightsData.length; j++) {
                if (Math.random() < 0.5) {
                    newWeightsData.push(weightsData[j]);
                } else {
                    newWeightsData.push(partnerWeightsData[j]);
                }
            }

            const newWeightsTensor = tf.tensor(
                newWeightsData,
                weightsShape
            ) as tf.Tensor;
            newWeights.push(newWeightsTensor);
        }

        const child = new NeuralNetwork();
        child.model.setWeights(newWeights);
        return child;
    }

    mutate(rate: number): void {
        const weights = this.model.getWeights();
        const mutatedWeights: tf.Tensor[] = [];

        for (let i = 0; i < weights.length; i++) {
            const originalWeights = weights[i].dataSync().slice();
            const mutatedLayerWeights = tf.tidy(() => {
                for (let j = 0; j < originalWeights.length; j++) {
                    if (Math.random() < rate) {
                        originalWeights[j] += Math.random() - 0.5;
                    }
                }
                return tf.tensor(originalWeights, weights[i].shape);
            });

            mutatedWeights.push(mutatedLayerWeights);
        }

        this.model.setWeights(mutatedWeights);
    }

    dispose(): void {
        this.model.dispose();
    }
}
