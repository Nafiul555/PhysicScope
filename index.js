import * as THREE from 'three';

const titleText = "Welcome!!";
const contentText = "This is a website I created as a passion project to keep track of my PhO prep. Many PhO problems are deeply intriguing but people find them hard to solve because they are hard to visualize. In this website, I try to render the problem setup so that it becomes just a bit easier, a bit more intuitive.";

let titleIndex = 0;
let contentIndex = 0;

// Function to type out the title
function typeTitle() {
    const titleElement = document.getElementById('title');
    
    if (titleIndex < titleText.length) {
        titleElement.textContent += titleText.charAt(titleIndex);
        titleIndex++;
        setTimeout(typeTitle, 150); // Delay for the typing effect
        
    } else {
        typeContent(); // Start typing the content after the title is finished
    }
}

// Function to type out the content
function typeContent() {
    const contentElement = document.getElementById('content');
    if (contentIndex < contentText.length) {
        contentElement.textContent += contentText.charAt(contentIndex);
        contentIndex++;
        setTimeout(typeContent, 10); // Delay for typing content
    } else {
        //addMorseCode(); // Add blinking cursor at the end
    }
}

// Morse code for "I love Physics"
const morseCode = [
    '..', // I
    '.-..', // L
    '---', // O
    '...-', // V
    '.', // E
    ' ', // Space
    '.--.', // P
    '....', // H
    '-.--', // Y
    '...', // S
    '..', // I
    '-.-.', // C
    '...'  // S
];

let morseIndex = 0;
let symbolIndex = 0;
let morseActive = true;

// Function to display the Morse code for "I love Physics"
function addMorseCode() {
    const contentElement = document.getElementById('content');
    const morseElement = document.createElement('span');
    morseElement.classList.add('morse-code');
    contentElement.appendChild(morseElement);

    function displayNextSymbol() {
        if (morseIndex < morseCode.length) {
            const currentSymbol = morseCode[morseIndex];

            if (symbolIndex < currentSymbol.length) {
                morseElement.textContent += currentSymbol.charAt(symbolIndex);
                symbolIndex++;
                setTimeout(displayNextSymbol, 50); // Delay between each dot/dash
            } else {
                morseElement.textContent += ' '; // Space between letters
                morseIndex++;
                symbolIndex = 0;
                setTimeout(displayNextSymbol, 500); // Longer delay between Morse characters
            }
        }
    }

    displayNextSymbol();
}

// Start Morse code display after content is typed
window.onload = function() {
    typeTitle();
}

