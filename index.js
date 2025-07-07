// vibe 코딩 스타일로 다른색깔 찾기 게임
const boardSizes = [2, 3, 4, 5, 6, 8]; // 4, 9, 16, 25, 36, 64칸
let level = 1;
let timer = 5;
let timerInterval;
let timerStart = 0;
let answerIdx = 0;
let isPlaying = false;

const gameBoard = document.getElementById('game-board');
const levelSpan = document.getElementById('level');
const timerSpan = document.getElementById('timer');
const resultDiv = document.getElementById('result');
const restartBtn = document.getElementById('restart-btn');

function getRandomColor() {
    const r = Math.floor(Math.random() * 200) + 30;
    const g = Math.floor(Math.random() * 200) + 30;
    const b = Math.floor(Math.random() * 200) + 30;
    return `rgb(${r},${g},${b})`;
}

function getSimilarColor(color) {
    // color: rgb(r,g,b)
    const arr = color.match(/\d+/g).map(Number);
    // 색 차이를 적당히: 50 -> 30
    const diff = Math.random() > 0.5 ? 30 : -30;
    const idx = Math.floor(Math.random() * 3);
    arr[idx] = Math.max(0, Math.min(255, arr[idx] + diff));
    return `rgb(${arr[0]},${arr[1]},${arr[2]})`;
}

function showRestartButton() {
    restartBtn.style.display = 'block';
}

function hideRestartButton() {
    restartBtn.style.display = 'none';
}

function startLevel() {
    isPlaying = true;
    timer = 5;
    timerStart = performance.now();
    updateTimerDisplay(timer);
    levelSpan.textContent = `레벨: ${level}`;
    resultDiv.textContent = '';
    hideRestartButton();
    const size = boardSizes[Math.min(level - 1, boardSizes.length - 1)];
    const total = size * size;
    gameBoard.innerHTML = '';
    gameBoard.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    const baseColor = getRandomColor();
    answerIdx = Math.floor(Math.random() * total);
    for (let i = 0; i < total; i++) {
        const btn = document.createElement('button');
        btn.className = 'color-btn';
        btn.type = 'button'; // 기본 버튼 타입 명시
        btn.style.background = i === answerIdx ? getSimilarColor(baseColor) : baseColor;
        btn.onclick = () => handleClick(i);
        // 64칸(8x8)일 때만 네모 아이콘 표시
        if (size === 8 && i === answerIdx) {
            btn.innerHTML = '<svg width="60%" height="60%" viewBox="0 0 32 32" style="display:block;"><rect x="4" y="4" width="24" height="24" rx="4" fill="#fff" fill-opacity="0.7" stroke="#43c6ac" stroke-width="2"/></svg>';
        }
        gameBoard.appendChild(btn);
    }
    clearInterval(timerInterval);
    let lastTime = performance.now();
    timerInterval = setInterval(() => {
        const now = performance.now();
        const elapsed = (now - timerStart) / 1000;
        const remain = Math.max(0, 5 - elapsed);
        updateTimerDisplay(remain);
        if (remain <= 0) {
            clearInterval(timerInterval);
            isPlaying = false;
            updateTimerDisplay(0);
            resultDiv.textContent = '실패! 다시 도전하세요.';
            showRestartButton();
        }
    }, 50);
}

function updateTimerDisplay(remain) {
    timerSpan.textContent = `${remain.toFixed(1)}초`;
}

function handleClick(idx) {
    if (!isPlaying) return;
    if (idx === answerIdx) {
        clearInterval(timerInterval);
        level++;
        startLevel();
    } else {
        resultDiv.textContent = '틀렸어요!';
    }
}

restartBtn.onclick = () => {
    level = 1;
    startLevel();
};

window.onload = () => {
    startLevel();
};
