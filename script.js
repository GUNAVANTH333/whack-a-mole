let score = 0;
let timeLeft = 30;
let round = 1;
let gameOver = false;
let moleInterval;
let gameInterval;

const moleSpawnSpeed = 500;
const startBtn = document.getElementById('startBtn');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const gameOverDisplay = document.getElementById('gameOver');
const gameBoard = document.getElementById('gameBoard');
const holes = document.querySelectorAll('.hole');
const hammer = document.getElementById('hammer');
const hitSound = new Audio('hammer-hit.mp3');

document.addEventListener('mousemove', (e) => {
    hammer.style.left = `${e.pageX - 60}px`;
    hammer.style.top = `${e.pageY - 60}px`;
});

document.addEventListener('mousedown', () => {
    hammer.classList.add('hit');
});

document.addEventListener('mouseup', () => {
    hammer.classList.remove('hit');
});

startBtn.addEventListener('click', () => {
    startBtn.style.display = 'none';
    startGame();
});

function startGame() {
    score = 0;
    timeLeft = 30;
    round = 1;
    gameOver = false;
    scoreDisplay.textContent = `Score: ${score}`;
    timerDisplay.textContent = `Time: ${timeLeft}s`;
    gameOverDisplay.style.display = 'none';
    gameBoard.className = `round${round}`;

    gameInterval = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);

    startRound();
}

function startRound() {
    gameBoard.className = `round${round}`;
    const allHoles = document.querySelectorAll('.hole');
    allHoles.forEach(hole => hole.style.display = 'none');

    let holesToShow = round === 1 ? 4 : round === 2 ? 8 : 12;
    for (let i = 0; i < holesToShow; i++) {
        allHoles[i].style.display = 'flex';
    }

    moleInterval = setInterval(() => {
        let activeMoles = document.querySelectorAll('.mole');
        if (activeMoles.length < holesToShow - 1) {
            popMole();
        }
    }, moleSpawnSpeed);
}

function popMole() {
    if (gameOver) return;

    const availableHoles = Array.from(holes).filter(hole => !hole.querySelector('.mole'));
    if (availableHoles.length === 0) return;

    const randomHoleIndex = Math.floor(Math.random() * availableHoles.length);
    const hole = availableHoles[randomHoleIndex];

    const mole = document.createElement('div');
    mole.classList.add('mole', 'show');
    hole.appendChild(mole);

    let moleVisibleTime = Math.random() * 800 + 400;

    let moleTimeout = setTimeout(() => {
        mole.classList.add('hide');
        setTimeout(() => {
            if (hole.contains(mole)) {
                hole.removeChild(mole);
            }
        }, 300);
    }, moleVisibleTime);

    mole.addEventListener('click', () => {
        if (gameOver || mole.classList.contains('hit')) return;

        hitSound.currentTime = 0;
        hitSound.play();

        mole.classList.add('hit');
        score++;
        scoreDisplay.textContent = `Score: ${score}`;

        setTimeout(() => {
            mole.classList.add('hide');
            setTimeout(() => {
                if (hole.contains(mole)) {
                    hole.removeChild(mole);
                }
            }, 300);
        }, 300);

        checkRoundProgress();
    });
}

function checkRoundProgress() {
    if ((round === 1 && score >= 5) || (round === 2 && score >= 20)) {
        nextRound();
    }
}

function nextRound() {
    if (round < 3) {
        round++;
        timeLeft = 30;
        startRound();
    } else {
        endGame();
    }
}
function displayResultMessage() {
    let message = '';
    if (score <= 10) {
        message = "You're a Noob! 🐢 Try harder!";
    } else if (score <= 20) {
        message = "Getting Better! 🐣 Keep it up!";
    } else if (score <= 30) {
        message = "Nice Aim! 🎯 You're getting sharp!";
    } else if (score <= 40) {
        message = "Pro Gamer Alert! 🎮 Watch out!";
    } else if (score <= 50) {
        message = "You're a Cheetah! 🐆 Unstoppable!";
    } else {
        message = "Mole Destroyer! 💥 King of the Game!";
    }

    gameOverDisplay.innerHTML = `${message}<br>Final Score: ${score}`;
    gameOverDisplay.style.display = 'block';
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(moleInterval);
    gameOverDisplay.style.display = 'block';
    displayResultMessage();
    startBtn.innerText = 'Restart Game';
    startBtn.style.display = 'block';
    gameOver = true;
    holes.forEach(hole => {
        hole.style.display = 'none';
        if (hole.querySelector('.mole')) {
            hole.removeChild(hole.querySelector('.mole'));
        }
    });
}