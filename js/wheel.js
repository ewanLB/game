const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const optionInput = document.getElementById('optionInput');
const addBtn = document.getElementById('addBtn');
const spinBtn = document.getElementById('spinBtn');
const optionListEl = document.getElementById('optionList');
const resultEl = document.getElementById('result');

let options = JSON.parse(localStorage.getItem('wheelOptions')) || ['A', 'B', 'C', 'D'];
let rotation = 0; // in degrees

function saveOptions() {
    localStorage.setItem('wheelOptions', JSON.stringify(options));
}

function drawWheel() {
    const num = options.length;
    const arcSize = (2 * Math.PI) / num;
    const radius = canvas.width / 2;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < num; i++) {
        const start = i * arcSize;
        const end = start + arcSize;
        ctx.beginPath();
        ctx.moveTo(radius, radius);
        ctx.arc(radius, radius, radius, start, end);
        ctx.closePath();
        ctx.fillStyle = `hsl(${(i * 360) / num}, 70%, 50%)`;
        ctx.fill();
        ctx.save();
        ctx.translate(radius, radius);
        ctx.rotate(start + arcSize / 2);
        ctx.textAlign = 'right';
        ctx.fillStyle = '#fff';
        ctx.font = '16px Arial';
        ctx.fillText(options[i], radius - 10, 5);
        ctx.restore();
    }
}

function updateOptionList() {
    optionListEl.innerHTML = '';
    options.forEach((opt, idx) => {
        const li = document.createElement('li');
        li.textContent = opt;
        li.addEventListener('click', () => {
            options.splice(idx, 1);
            saveOptions();
            updateOptionList();
            drawWheel();
        });
        optionListEl.appendChild(li);
    });
}

function spin() {
    if (options.length === 0) return;
    const extra = Math.random() * 360 + 720; // at least 2 turns
    rotation = (rotation + extra) % 360;
    canvas.style.transition = 'transform 4s ease-out';
    canvas.style.transform = `rotate(${rotation}deg)`;
    canvas.addEventListener('transitionend', onSpinEnd, { once: true });
}

function onSpinEnd() {
    const arc = 360 / options.length;
    const index = Math.floor(((360 - rotation % 360) % 360) / arc);
    const choice = options[index];
    resultEl.textContent = `Result: ${choice}`;
}

addBtn.addEventListener('click', () => {
    const val = optionInput.value.trim();
    if (!val) return;
    options.push(val);
    optionInput.value = '';
    saveOptions();
    updateOptionList();
    drawWheel();
});

spinBtn.addEventListener('click', spin);

// init
updateOptionList();
drawWheel();
