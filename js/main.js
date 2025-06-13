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

class Enemy {
    constructor(x, y) {
        this.width = 20;
        this.height = 20;
        this.x = x;
        this.y = y;
        this.speed = 2;
    }

    draw() {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    update() {
        this.y += this.speed;
    }
}

const player = new Player();
const bullets = [];
const enemies = [];
const keys = {};
let score = 0;
let spawnTimer = 0;
const spawnInterval = 60; // frames

function update() {
    player.update();
    // spawn enemies periodically
    spawnTimer++;
    if (spawnTimer >= spawnInterval) {
        const x = Math.random() * (canvas.width - 20);
        enemies.push(new Enemy(x, -20));
        spawnTimer = 0;
    }

    // update bullets and handle collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.update();
        if (b.y + b.height < 0) {
            bullets.splice(i, 1);
            continue;
        }
        for (let j = enemies.length - 1; j >= 0; j--) {
            const e = enemies[j];
            if (b.x < e.x + e.width &&
                b.x + b.width > e.x &&
                b.y < e.y + e.height &&
                b.y + b.height > e.y) {
                bullets.splice(i, 1);
                enemies.splice(j, 1);
                score++;
                break;
            }
        }
    }

    // update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.update();
        if (e.y > canvas.height) {
            enemies.splice(i, 1);
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
    enemies.forEach(e => e.draw());
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText('Score: ' + score, 10, 20);
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
