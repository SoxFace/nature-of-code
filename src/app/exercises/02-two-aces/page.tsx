"use client";

import P5Wrapper from '@/components/P5Wrapper';
import SketchLayout from '@/components/SketchLayout';
import p5 from 'p5';

export default function TwoAces() {
    // Define the sketch function
    const sketch = (p: p5) => {
        // Constants
        const SIMULATIONS = 100000;
        const CARD_VALUES = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
        const CARD_SUITS = ['♥', '♦', '♣', '♠'];
        
        // Variables to track results
        let reshuffleSuccesses = 0;
        let noReshuffleSuccesses = 0;
        let simulationsRun = 0;
        let isRunning = false;
        let progress = 0;
        
        // Create a standard deck of cards
        function createDeck() {
            const deck = [];
            for (const suit of CARD_SUITS) {
                for (const value of CARD_VALUES) {
                    deck.push({ value, suit });
                }
            }
            return deck;
        }
        
        // Shuffle a deck using Fisher-Yates algorithm
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function shuffleDeck(deck: any[]) {
            const newDeck = [...deck];
            for (let i = newDeck.length - 1; i > 0; i--) {
                const j = Math.floor(p.random(i + 1));
                [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
            }
            return newDeck;
        }
        
        // Draw a card from the deck
        function drawCard(deck: unknown[], removeCard = true) {
            const index = Math.floor(p.random(deck.length));
            const card = deck[index];
            
            if (removeCard) {
                deck.splice(index, 1);
            }
            
            return card;
        }
        
        // Check if card is an ace
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        function isAce(card: any) {
            return card.value === 'A';
        }
        
        // Run one iteration with reshuffling
        function simulateWithReshuffle() {
            const deck = createDeck();
            const shuffledDeck = shuffleDeck(deck);
            
            // First draw
            const firstCard = drawCard(shuffledDeck, false); // Don't remove card
            
            // Second draw (independent)
            const secondCard = drawCard(shuffledDeck, false);
            
            return isAce(firstCard) && isAce(secondCard);
        }
        
        // Run one iteration without reshuffling
        function simulateWithoutReshuffle() {
            const deck = createDeck();
            const shuffledDeck = shuffleDeck(deck);
            
            // First draw
            const firstCard = drawCard(shuffledDeck, true); // Remove card
            
            // Second draw
            const secondCard = drawCard(shuffledDeck, true);
            
            return isAce(firstCard) && isAce(secondCard);
        }
        
        // Run the entire simulation
        function runSimulations() {
            resetResults();
            isRunning = true;
        }
        
        // Reset simulation results
        function resetResults() {
            reshuffleSuccesses = 0;
            noReshuffleSuccesses = 0;
            simulationsRun = 0;
            progress = 0;
        }
        
        // Format number as percentage
        function formatPercentage(number: number) {
            return (number * 100).toFixed(3) + '%';
        }
        
        // Format theoretical probability as fraction
        function formatFraction(numerator: number, denominator: number) {
            return `${numerator}/${denominator} (${formatPercentage(numerator/denominator)})`;
        }

        p.setup = () => {
            p.createCanvas(640, 400);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(14);
            p.background(240);
        };

        p.draw = () => {
            p.background(240);
            
            // Run simulations in chunks to avoid freezing
            if (isRunning) {
                const chunkSize = 100;
                for (let i = 0; i < chunkSize && simulationsRun < SIMULATIONS; i++) {
                    if (simulateWithReshuffle()) {
                        reshuffleSuccesses++;
                    }
                    
                    if (simulateWithoutReshuffle()) {
                        noReshuffleSuccesses++;
                    }
                    
                    simulationsRun++;
                }
                
                progress = simulationsRun / SIMULATIONS;
                
                if (simulationsRun >= SIMULATIONS) {
                    isRunning = false;
                }
            }
            
            // Draw progress bar
            p.fill(200);
            p.rect(50, 50, 500, 30);
            p.fill(100, 180, 100);
            p.rect(50, 50, 500 * progress, 30);
            p.fill(0);
            p.text(`Progress: ${(progress * 100).toFixed(1)}%`, 60, 65);
            
            // Display theoretical probabilities
            p.text("Theoretical Probabilities:", 50, 120);
            p.text(`With Reshuffling: ${formatFraction(1, 169)}`, 70, 150);
            p.text(`Without Reshuffling: ${formatFraction(1, 221)}`, 70, 180);
            
            // Display simulation results
            p.text("Simulation Results:", 50, 220);
            
            const reshuffleProb = simulationsRun > 0 ? reshuffleSuccesses / simulationsRun : 0;
            const noReshuffleProb = simulationsRun > 0 ? noReshuffleSuccesses / simulationsRun : 0;
            
            p.text(`With Reshuffling: ${reshuffleSuccesses} / ${simulationsRun} = ${formatPercentage(reshuffleProb)}`, 70, 250);
            p.text(`Without Reshuffling: ${noReshuffleSuccesses} / ${simulationsRun} = ${formatPercentage(noReshuffleProb)}`, 70, 280);
            
            // Comparison with theory
            if (simulationsRun >= SIMULATIONS) {
                p.text("Comparison with Theoretical Values:", 50, 320);
                const reshuffleError = Math.abs(reshuffleProb - (1/169)) / (1/169) * 100;
                const noReshuffleError = Math.abs(noReshuffleProb - (1/221)) / (1/221) * 100;
                
                p.text(`With Reshuffling: Error = ${reshuffleError.toFixed(2)}%`, 70, 350);
                p.text(`Without Reshuffling: Error = ${noReshuffleError.toFixed(2)}%`, 70, 380);
            }
            
            // Button
            p.fill(isRunning ? 150 : 100, 100, isRunning ? 100 : 150);
            p.rect(250, 340, 100, 40);
            p.fill(255);
            p.textAlign(p.CENTER, p.CENTER);
            p.text(isRunning ? "Running..." : "Start", 300, 360);
            p.textAlign(p.LEFT, p.CENTER);
        };
        
        // Handle mouse clicks
        p.mousePressed = () => {
            // Check if button was clicked
            if (p.mouseX > 250 && p.mouseX < 350 && p.mouseY > 340 && p.mouseY < 380 && !isRunning) {
                runSimulations();
            }
        };
    };

    return (
        <SketchLayout
            title="Exercise 0.2: Two Aces"
            description="Probability of drawing two aces in a row, if you reshuffle your first draw back into the deck before making your second draw. And if you didn't reshuffle after your first draw. Simulation runs 100,000 times."
        >
            <P5Wrapper sketch={sketch} />
        </SketchLayout>
    );
}