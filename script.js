const MIN_INTERVAL = 1000;
const MAX_INTERVAL = 15000;
const HUNGRY_INTERVAL = 2000;
const SAD_INTERVAL = 500;

let score = 0;
let timeIsRunning = false;
let finalScore, timeLeft, timeInterval;

const gameBoard = document.querySelector('.background');
const startBtn = document.querySelector('.btn_start');
const instructions = document.querySelector('.instructions_container');
const winImg = document.querySelector('.win');

const getSadInterval = () => Date.now() + SAD_INTERVAL;
const getGoneInterval = () => Date.now() + MIN_INTERVAL + Math.floor(Math.random() * MAX_INTERVAL);
const getHungryInterval = () => Date.now() + HUNGRY_INTERVAL;
const getKingStatus = () => Math.random() > 0.9;

const moles = [
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-0")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-1")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-2")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-3")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-4")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-5")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-6")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-7")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-8")
  },
  {
    status: "leaving",
    next: getSadInterval(),
    king: true,
    node: document.getElementById("hole-9")
  }
];

// ******** game logic **************

function handleChange() {
  stop();
  init();
  handleDifficulty()
}

function handleDifficulty() {
  switch (true) {
    case document.getElementById('easy').checked:
      finalScore = 5;
      timeLeft = 20;
      break;
    case document.getElementById('medium').checked:
      finalScore = 10;
      timeLeft = 20;
      break;
    case document.getElementById('hard').checked:
      finalScore = 20;
      timeLeft = 25;
      break;
  };
  updateScoresTime();
  document.querySelector('.game-over_container').classList.add('hide');
}

function init() {
  score = 0;
  updateScoresTime();
  winImg.classList.add('hide');
  winImg.classList.remove('show');
  gameBoard.classList.remove('hide');
  gameBoard.style.pointerEvents = 'none';
  document.querySelector('.worm-container').style.width = '5%';
}

function updateScoresTime() {
  document.querySelector('.scores').innerHTML = score;
  document.querySelector('.final_scores').innerHTML = finalScore;
  document.querySelector('.time_left').innerHTML = timeLeft;
}

function updateTime() {
  timeIsRunning = true;
  timeLeft--;
  document.querySelector('.time_left').innerHTML = timeLeft;
  checkResults()
}

function startGame() {
  init();
  runAgainAt = Date.now() + 1000;
  requestAnimationFrame(nextFrame);
  handleDifficulty();
  timeIsRunning = true;
  timeInterval = setInterval(updateTime, 1000);

  if (!timeIsRunning) {
    startBtn.disabled = false;
  } else if (timeIsRunning) {
    gameBoard.style.pointerEvents = 'auto';
    startBtn.disabled = true;
  }
}

function checkResults() {
  if (score >= finalScore) {
    setTimeout(win, 500)
  } else if (timeLeft <= 0 && score < finalScore) {
    stop()
    gameOver()
  }
}

function stop() {
  clearInterval(timeInterval);
  startBtn.disabled = false;
  moles.forEach(mole => mole.status = 'leaving');
  runAgainAt = runAgainAt + Date.now();
  cancelAnimationFrame(nextFrame);
  gameBoard.style.pointerEvents = 'none';
}

function win() {
  gameBoard.classList.add('hide');
  winImg.classList.remove('hide');
  winImg.classList.add('show');
  stop();
}

function gameOver() {
  document.querySelector('.game-over_container').classList.remove('hide');
  document.querySelector('.user-scores').innerHTML = score;
  document.querySelector('.final-scores').innerHTML = finalScore;
}


// ******** changing status **************
const getLeaving = (mole, moleImg) => {
  mole.next = getSadInterval();
  mole.status = 'leaving';
  mole.king ? moleImg.src = 'images/king-mole-leaving.png' : moleImg.src = 'images/mole-leaving.png';
}

const getGone = (mole, moleImg) => {
  mole.next = getGoneInterval();
  mole.status = 'gone';
  moleImg.classList.add('gone');
  moleImg.parentNode.style.backgroundColor = 'black';
}

const getHungry = (mole, moleImg) => {
  mole.status = 'hungry';
  mole.king = getKingStatus();
  mole.next = getHungryInterval();
  moleImg.classList.remove('gone');
  moleImg.classList.add('hungry');
  mole.king ? moleImg.src = 'images/king-mole-hungry.png' : moleImg.src = 'images/mole-hungry.png';
}

const getSad = (mole, moleImg) => {
  mole.status = 'sad';
  mole.next = getSadInterval();
  moleImg.classList.remove('hungry');
  moleImg.parentNode.style.backgroundColor = 'gray';
  mole.king ? moleImg.src = 'images/king-mole-sad.png' : moleImg.src = 'images/mole-sad.png';
}

function getNextStatus(mole) {
  const moleImg = mole.node.children[0]
  switch (mole.status) {
    case 'sad':
    case 'fed':
      getLeaving(mole, moleImg);
      break;
    case 'leaving':
      getGone(mole, moleImg);
      break;
    case 'gone':
      getHungry(mole, moleImg);
      break;
    case 'hungry':
      getSad(mole, moleImg);
      break;
  }
}

// ******** feed event **************
function feed(event) {
  if (event.target.tagName == 'IMG' && event.target.className.includes('hungry')) {
    const mole = moles[Number(event.target.dataset.index)];

    mole.status = 'fed';
    mole.next = getSadInterval();
    mole.node.children[0].classList.remove('hungry');
    if (mole.king) {
      score += 2;
      mole.node.children[0].src = 'images/king-mole-fed.png'
    } else {
      score++;
      mole.node.children[0].src = 'images/mole-fed.png'
    }

    document.querySelector('.worm-container').style.width = `${score / finalScore * 100}%`
    document.querySelector('.scores').innerHTML = score;
  }
}


// ******** requestAnimationFrame **************
let runAgainAt = Date.now() + 1000;
function nextFrame() {
  const now = Date.now();
  if (runAgainAt <= now) {
    for (let i = 0; i < moles.length; i++) {
      if (moles[i].next <= now) {
        getNextStatus(moles[i])
      }
    }
    runAgainAt = now + 1000
  }
  requestAnimationFrame(nextFrame)
}


// ******** event listeners **************
window.onload = handleDifficulty();

gameBoard.addEventListener('click', feed);

startBtn.addEventListener('click', startGame);

document.querySelector('.btn_instructions').addEventListener('click', () => instructions.classList.remove('hide'));

document.querySelector('body').addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn_instructions')) {
    instructions.classList.add('hide')
  }
})



