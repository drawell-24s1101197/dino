/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
/**
 * @type {string[]}
 */
const imgNames = ['bird', 'cactus', 'dino'];

class DinoGame {
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
                imgLoadCounter++;
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
        this.createEntity('dino');
        this.timer = setInterval.bind(this,this.ticker, 30)();
    }
    ticker(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        //TODO 敵キャラ作成

        //キャラクタの移動
        this.move('dino')

        //キャラクタの描画
        this.draw('dino')

        //TODO あたり判定

        //カウンタの更新
        this.counter = (this.counter + 1) % 1000000;
    }
    keydown(){
        document.onkeydown = (e) => {
            if(e.code === 'Space' && this.dino.moveY === 0){
                this.dino.moveY = -41
            }
        }
    }
    createEntity(name){
        this[name] = {
            x: this.img[name].width / 2,
            y: this.canvas.height - this.img[name].height / 2,
            moveY: 0,
            width: this.img[name].width,
            height: this.img[name].height,
            image: this.img[name]
        }
    }
    move(name){
        if(name === 'dino'){
            this.dino.y += this.dino.moveY;
            if (this.dino.y >= this.canvas.height - this.dino.height / 2){
                this.dino.y = this.canvas.height - this.dino.height / 2;
                this.dino.moveY = 0;
            } else {
                this.dino.moveY += 3;
            }
        }
    }
    draw(name){
        this.ctx.drawImage(this.img[name],
            this[name].x - this[name].width / 2,
            this[name].y - this[name].height/ 2);
    }
}
const game = new DinoGame(canvas, imgNames);