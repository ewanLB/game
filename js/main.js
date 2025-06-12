const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

class Player {
    constructor() {
        this.width = 20;
        this.height = 20;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = 'cyan';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        if (keys['ArrowLeft'] && this.x > 0) {
            this.x -= this.speed;
        }
        if (keys['ArrowRight'] && this.x + this.width < canvas.width) {
            this.x += this.speed;
        }
    }
}

class Bullet {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 5;
        this.height = 10;
        this.speed = 7;
    }

    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y -= this.speed;
    }
}

const player = new Player();
const bullets = [];
const keys = {};

function update() {
    player.update();
    bullets.forEach((b, i) => {
        b.update();
        if (b.y + b.height < 0) bullets.splice(i, 1);
    });
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    bullets.forEach(b => b.draw());
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', e => {
    keys[e.key] = true;
    if (e.key === ' ') {
        bullets.push(new Bullet(player.x + player.width / 2 - 2, player.y));
    }
});

window.addEventListener('keyup', e => {
    keys[e.key] = false;
});

requestAnimationFrame(gameLoop);
