'use client';

import dynamic from 'next/dynamic';
import p5 from 'p5';
import type { SketchMeta } from './types';

const P5Wrapper = dynamic(() => import('@/components/P5Wrapper'), { ssr: false });

export const meta: SketchMeta = {
  chapter: 0,
  type: 'exercise',
  number: 2,
  title: 'Two Aces Probability',
  description: 'Monte Carlo simulation comparing probability of drawing two aces with and without reshuffling.',
};

export default function TwoAces() {
  const sketch = (p: p5) => {
    const SIMULATIONS = 100000;
    const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
    const CARD_SUITS = ['♥', '♦', '♣', '♠'];

    let reshuffleSuccesses = 0;
    let noReshuffleSuccesses = 0;
    let simulationsRun = 0;
    let isRunning = false;
    let progress = 0;

    function createDeck() {
      const deck = [];
      for (const suit of CARD_SUITS) {
        for (const value of CARD_VALUES) {
          deck.push({ value, suit });
        }
      }
      return deck;
    }

    function shuffleDeck(deck: { value: string; suit: string }[]) {
      const newDeck = [...deck];
      for (let i = newDeck.length - 1; i > 0; i--) {
        const j = Math.floor(p.random(i + 1));
        [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
      }
      return newDeck;
    }

    function drawCard(deck: { value: string; suit: string }[], removeCard = true) {
      const index = Math.floor(p.random(deck.length));
      const card = deck[index];
      if (removeCard) {
        deck.splice(index, 1);
      }
      return card;
    }

    function isAce(card: { value: string; suit: string }) {
      return card.value === 'A';
    }

    function simulateWithReshuffle() {
      const deck = createDeck();
      const shuffledDeck = shuffleDeck(deck);
      const firstCard = drawCard(shuffledDeck, false);
      const secondCard = drawCard(shuffledDeck, false);
      return isAce(firstCard) && isAce(secondCard);
    }

    function simulateWithoutReshuffle() {
      const deck = createDeck();
      const shuffledDeck = shuffleDeck(deck);
      const firstCard = drawCard(shuffledDeck, true);
      const secondCard = drawCard(shuffledDeck, true);
      return isAce(firstCard) && isAce(secondCard);
    }

    function runSimulations() {
      reshuffleSuccesses = 0;
      noReshuffleSuccesses = 0;
      simulationsRun = 0;
      progress = 0;
      isRunning = true;
    }

    function formatPercentage(number: number) {
      return (number * 100).toFixed(3) + '%';
    }

    function formatFraction(numerator: number, denominator: number) {
      return `${numerator}/${denominator} (${formatPercentage(numerator / denominator)})`;
    }

    p.setup = () => {
      p.createCanvas(640, 400);
      p.textAlign(p.LEFT, p.CENTER);
      p.textSize(14);
      p.background(240);
    };

    p.draw = () => {
      p.background(240);

      if (isRunning) {
        const chunkSize = 100;
        for (let i = 0; i < chunkSize && simulationsRun < SIMULATIONS; i++) {
          if (simulateWithReshuffle()) reshuffleSuccesses++;
          if (simulateWithoutReshuffle()) noReshuffleSuccesses++;
          simulationsRun++;
        }
        progress = simulationsRun / SIMULATIONS;
        if (simulationsRun >= SIMULATIONS) isRunning = false;
      }

      // Progress bar
      p.fill(200);
      p.rect(50, 50, 500, 30);
      p.fill(100, 180, 100);
      p.rect(50, 50, 500 * progress, 30);
      p.fill(0);
      p.text(`Progress: ${(progress * 100).toFixed(1)}%`, 60, 65);

      // Theoretical probabilities
      p.text('Theoretical Probabilities:', 50, 120);
      p.text(`With Reshuffling: ${formatFraction(1, 169)}`, 70, 150);
      p.text(`Without Reshuffling: ${formatFraction(1, 221)}`, 70, 180);

      // Results
      p.text('Simulation Results:', 50, 220);
      const reshuffleProb = simulationsRun > 0 ? reshuffleSuccesses / simulationsRun : 0;
      const noReshuffleProb = simulationsRun > 0 ? noReshuffleSuccesses / simulationsRun : 0;
      p.text(`With Reshuffling: ${reshuffleSuccesses} / ${simulationsRun} = ${formatPercentage(reshuffleProb)}`, 70, 250);
      p.text(`Without Reshuffling: ${noReshuffleSuccesses} / ${simulationsRun} = ${formatPercentage(noReshuffleProb)}`, 70, 280);

      // Comparison
      if (simulationsRun >= SIMULATIONS) {
        p.text('Comparison with Theoretical Values:', 50, 320);
        const reshuffleError = Math.abs(reshuffleProb - 1 / 169) / (1 / 169) * 100;
        const noReshuffleError = Math.abs(noReshuffleProb - 1 / 221) / (1 / 221) * 100;
        p.text(`With Reshuffling: Error = ${reshuffleError.toFixed(2)}%`, 70, 350);
        p.text(`Without Reshuffling: Error = ${noReshuffleError.toFixed(2)}%`, 70, 380);
      }

      // Button
      p.fill(isRunning ? 150 : 100, 100, isRunning ? 100 : 150);
      p.rect(250, 340, 100, 40);
      p.fill(255);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(isRunning ? 'Running...' : 'Start', 300, 360);
      p.textAlign(p.LEFT, p.CENTER);
    };

    p.mousePressed = () => {
      if (p.mouseX > 250 && p.mouseX < 350 && p.mouseY > 340 && p.mouseY < 380 && !isRunning) {
        runSimulations();
      }
    };
  };

  return <P5Wrapper sketch={sketch} />;
}
