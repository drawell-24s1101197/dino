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
        this.backGrounds = [];
        this.enemys = [];
        this.img = {};
        this.isGameOver = true;
        this.score = 0;
        this.timer = null;
        this.canGameOver = true;
        this.enemyCountdown = 0; 

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
        document.onkeydown = (e) => this.keydown(e);
    }
    init(){
        this.counter = 0;
        this.enemys = [];
        this.backGrounds = [];
        this.canGameOver = true;
        this.isGameOver = false;
        this.score = 0;
        this.createDino('dino');
        this.timer = setInterval(this.ticker, 30, this);
        this.enemyCountdown = 0;
    }
    /**
     * 
     * @param {DinoGame} self 
     */
    ticker(self){
        self.ctx.clearRect(0, 0, self.canvas.width, self.canvas.height);

        //敵キャラ作成
        if(self.r(100 - self.score % 100) === 0)
            self.createEnemys('cactus');
        else if(self.r(100 -self.score % 100) === 0)self.createEnemys('bird');
        //背景作成
        if (self.counter % 10 === 0){
            self.createBackGround();
        }

        //キャラクタの移動
        self.move('bg')
        self.move('dino');
        self.move('enemys');

        //キャラクタの描画
        self.draw('bg')
        self.draw('dino')
        self.draw('enemys');
        self.draw('score');


        //あたり判定
        self.hitCheck();

        //カウンタの更新
        self.score += 1;
        self.counter = (self.counter + 1) % 1000000;
        self.enemyCountdown -= 1;
    }
    keydown(e){
        if((e.code === 'Space' || e.code === 'ArrowUp')&& this.dino.moveY === 0){
            this.dino.moveY = -41
        }
        if((e.code === 'Enter' || e.code === 'KeyR')&& this.isGameOver){
            (async (time)=>{
                await new Promise((resolve)=>{
                    setTimeout(resolve, 1000 * time)
                })
            })(0.5);
            this.init();
        };
        if(e.code === 'KeyX'){
            this.canGameOver = !this.canGameOver;
            console.log('無敵:', !this.canGameOver);
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
        let enemyMoveX = 1;
        let enemyX = this.canvas.width + this.img[name].width / 2;
        if(name === 'bird'){
            enemyY = this.r(300 - this.img.bird.height) + 150;
            enemyMoveX = -15
        };
        if(name === 'cactus'){
            switch(this.r(3)){
                case 0,1: break;
                case 2:
                    enemyX = this.canvas.width + this.img[name].width * 3 / 2;
                    break;
            }
            enemyMoveX = -10;
        }
        this.enemys.push({
            x: enemyX,
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
        if(name === 'bg'){
            for (const bg of this.backGrounds){
                bg.x += bg.moveX;
            }
        }
    }
    createBackGround(){
        this.backGrounds = [];
        for (let x = 0; x <= this.canvas.width; x+= 200){
            this.backGrounds.push({
                x: x,
                y: canvas.height,
                width: 200,
                moveX: -20
            });
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
        if(name === 'score'){
            this.ctx.fillStyle = 'black';
            this.ctx.font = '24px serif';
            this.ctx.fillText(`score:${this.score}`, 0, 30);
        }
        if(name === 'bg'){
            this.ctx.fillStyle = 'sienna';
            for (const bg of this.backGrounds){
                this.ctx.fillRect(bg.x, bg.y - 5, bg.width, 5);
                this.ctx.fillRect(bg.x + 20, bg.y - 10, bg.width - 40, 5);
                this.ctx.fillRect(bg.x + 50, bg.y - 15, bg.width - 100, 5);
            }
        }
    }
    hitCheck(){
        if(!this.canGameOver)return;
        const {x, y, width, height} = this.dino;
        for (const enemy of this.enemys){
            if(
                Math.abs(x - enemy.x) < width * 0.8 / 2 + enemy.width * 0.9 &&
                Math.abs(y - enemy.y) < height * 0.5 / 2 + enemy.height * 0.9
            ){
                this.isGameOver = true;
                this.ctx.fillStyle = 'black';
                this.ctx.font = 'bold 100px serif';
                this.ctx.fillText('Game Over!', 150, 200);
                clearInterval(this.timer);
            }
        }
    }
}
const game = new DinoGame(canvas, imgNames);