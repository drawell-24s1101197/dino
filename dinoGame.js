/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
/**
 * @type {string[]}
 */
const imgNames = ['bird', 'cactus', 'dino'];

class Game {
    constructor(){
        this.counter = 0;
        this.enemys = [];
        this.img = {};
        this.isGameOver = true;
        this.score = 0;
        this.timer = null;
    }
}
const game = new Game();