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
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {string[]} imageNames 
     */
    constructor(canvas, imageNames){
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.counter = 0;
        this.enemys = [];
        this.img = {};
        this.isGameOver = true;
        this.score = 0;
        this.timer = null;
        let imgLoadCounter = 0;
        for (const imgName of imageNames){
            const imagePath = `image/${imgName}.png`;
            this.img[imgName] = new Image();
            this.img[imgName].src = imagePath;
            this.img[imgName].onload = () => {
                imgLoadCounter[0]++;
                if(imgLoadCounter === imageNames.length){
                    console.log('コンプリート：画像のロード');
                    this.init();
                }
            }

        }
    }
    init(){
        this.counter = 0;
        this.enemys = [];
        this.isGameOver = false;
        this.score = 0;
        this.ctx.drawImage(this.img.bird, 500, 320);
        this.ctx.drawImage(this.img.cactus, 300, 320);
        this.ctx.drawImage(this.img.dino, 100, 320);
    }
}
const game = new Game();