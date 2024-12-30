/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
/**
 * @type {string[]}
 */
const imgNames = ['bird:enemy', 'cactus:enemy', 'dino:player'];

class DinoGame {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {string[]} imageNames 
     */
    r = (x) =>Math.floor(Math.random() * x);
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
        for (const imgDat of imageNames){
            const [imgName, imgAttr] = imgDat.split(':');
            const imagePath = `image/${imgName}.png`;
            this.img[imgName] = new Image();
            this.img[imgName].src = imagePath;
            this.img[imgName].dataset.entity = imgAttr;
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
        this.createDino('dino');
        this.timer = setInterval(this.ticker, 30, this);
        document.onkeydown = (e) => this.keydown(e);
    }
    /**
     * 
     * @param {DinoGame} self 
     */
    ticker(self){
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        if(self.r(100) === 0)self.createEnemys('cactus');
        else if(self.r(100) === 0)self.createEnemys('bird');

        //キャラクタの移動
        self.move('dino');
        self.move('enemys');

        //キャラクタの描画
        self.draw('dino')
        self.draw('enemys');

        //TODO あたり判定

        //カウンタの更新
        self.counter = (self.counter + 1) % 1000000;
    }
    keydown(e){
        if(e.code === 'Space' && this.dino.moveY === 0){
            this.dino.moveY = -41
        }
    }
    createDino(){
        this["dino"] = {
            x: this.img["dino"].width / 2,
            y: this.canvas.height - this.img["dino"].height / 2,
            moveY: 0,
            width: this.img["dino"].width,
            height: this.img["dino"].height,
            image: this.img["dino"],
            entityType: this.img["dino"].dataset.entity
        }
    }
    createEnemys(name){
        let enemyY = this.canvas.height - this.img[name].height / 2;
        if(name === 'bird')enemyY = this.r(300 - this.img.bird.height) + 150;
        let enemyMoveX = 1;
        if(name === 'bird')enemyMoveX = -15;
        if(name === 'cactus')enemyMoveX = -10;
        this.enemys.push({
            x: this.canvas.width + this.img[name].width / 2,
            y: enemyY,
            moveX: enemyMoveX,
            width: this.img[name].width,
            height: this.img[name].height,
            image: this.img[name]
        });
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
        if(name === 'enemys'){
            for(const enemy of this.enemys){
                enemy.x += enemy.moveX;
            }

            this.enemys = game.enemys.filter(enemy => enemy.x > -enemy.width);
        }
    }
    draw(name){
        if(name === 'dino'){
            this.ctx.drawImage(this.img[name],
                this[name].x - this[name].width / 2,
                this[name].y - this[name].height/ 2);
        }
        if(name === 'enemys'){
            for (const enemy of this.enemys){
                this.ctx.drawImage(enemy.image,
                    enemy.x -enemy.width / 2,
                    enemy.y -enemy.height /2
                )
            }
        }
    }
}
const game = new DinoGame(canvas, imgNames);