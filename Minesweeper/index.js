let spillBrett = document.getElementById('spillBrett');
let firkanter = [];
let restart = document.getElementById('restart');
let timer = document.getElementById('timer');

restart.addEventListener('click', () => {
    location.reload();
});

let flagg = document.getElementById('flagg');

function toggleFlagg() {
    flagg.classList.toggle('pressed');

    if (flagg.classList.contains('pressed')) {
        flagg.style.backgroundColor = 'orange';
        firkanter.forEach((firkant) => {
            if (!firkant.classList.contains('flagget') && !firkant.classList.contains('aktivert')) {
                firkant.style.color = 'black';
                firkant.innerText = '·';
                firkant.style.fontWeight = 'normal'
            }
        });
    } else {
        flagg.style.backgroundColor = '#c0c0c0';
        firkanter.forEach((firkant) => {
            if (!firkant.classList.contains('flagget') && !firkant.classList.contains('aktivert')) {
                firkant.innerText = '';
                firkant.style.fontWeight = 'bold'
            }
        });
    }
}

flagg.addEventListener('click', toggleFlagg);

document.addEventListener('keydown', (event) => {
    if (event.key === 'f' || event.key === 'F') {
        toggleFlagg();
    }
});

let antallBomber = 40;
let firkanterMedBomber = new Set();

while (firkanterMedBomber.size < antallBomber) {
    firkanterMedBomber.add(Math.floor(Math.random() * 400));
}

let timerId;
let seconds = 0;

function startTimer() {
    timerId = setInterval(() => {
        seconds++;
        let minutes = Math.floor(seconds / 60);
        let restSeconds = seconds % 60;
        document.getElementById('timer').textContent = `${minutes.toString().padStart(2, '0')}:${restSeconds.toString().padStart(2, '0')}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerId);
}

let gameIsOver = false;
let gameIsStarted = false;

for (let i = 0; i < 400; i++) {
    let firkant = document.createElement('div');
    firkant.classList.add('firkant');

    firkant.style.height = '30px';
    firkant.style.width = '30px';
    firkant.style.float = 'left';
    firkant.style.backgroundColor = '#ffffff';
    firkant.style.boxSizing = 'border-box';
    firkant.style.borderRight = '1px solid grey';
    firkant.style.borderBottom = '1px solid grey';
    firkant.style.fontSize = '20px';
    firkant.style.fontWeight = 'bold'
    firkant.style.textAlign = 'center';
    firkant.style.lineHeight = '30px';
    firkant.style.color = 'white';
    firkant.style.cursor = 'pointer';

    if (i % 20 === 0) {
        firkant.style.borderLeft = '1px solid grey';
    };

    if (i < 20) {
        firkant.style.borderTop = '1px solid grey';
    };

    firkant.addEventListener('click', () => {
        if (!gameIsStarted) {
            startTimer();
        }
        gameIsStarted = true;
        if (flagg.classList.contains('pressed')) {
            if (firkant.classList.contains('flagget')) {
                firkant.textContent = '';
                firkant.classList.remove('flagget');
            } else {
                firkant.textContent = '🚩';
                firkant.style.fontSize = '15px'
                firkant.classList.add('flagget');
            }
            return;
        };

        if (flagg.classList.contains('pressed') && firkant.classList.contains('flagget')) {
            firkant.textContent = '';
            firkant.classList.remove('flagget');
            return;
        };

        let omringendeFirkanter;
        let isLeftEdge = i % 20 === 0;
        let isRightEdge = i % 20 === 19;

        if (isLeftEdge) {
            omringendeFirkanter = [
                i-20, i-19,
                i+1,
                i+20, i+21
        ];
        } else if (isRightEdge) {
            omringendeFirkanter = [
                i-21, i-20,
                i-1,
                i+19, i+20
            ];
        } else {
            omringendeFirkanter = [
                i-21, i-20, i-19,
                i-1, i+1,
                i+19, i+20, i+21
            ];
        }

        let antallBomber = 0;
        omringendeFirkanter.forEach((index) => {
            if (index >= 0 && index < 400) {
                if (firkanterMedBomber.has(index)) {
                    antallBomber++;
                }
            }
        });
        
        console.log('Trykket på knapp: ' + i);
        if (firkant.getAttribute('Bombe') === 'true' && !firkant.classList.contains('flagget')) {
            firkant.classList.add('aktivert');
            firkant.style.backgroundColor = '#c0c0c0';
            firkant.textContent = '💣';
            setTimeout(() => {
                if (!gameIsOver) {
                    stopTimer();
                    alert('Du tapte!');
                    gameIsOver = true;
                }

                let alleFirkanter = document.querySelectorAll('.firkant');
                alleFirkanter.forEach((firkant) => {
                    firkant.classList.remove('flagget');
                    if (firkant.getAttribute('Bombe') === 'true') {
                        firkant.classList.add('aktivert');
                        firkant.style.backgroundColor = '#c0c0c0';
                        firkant.textContent = '💣';
                    } else {
                        firkant.classList.add('aktivert');
                        firkant.style.backgroundColor = '#c0c0c0';
                        firkant.textContent = '';
                    }
                });
            }, 20);
            
        } else if (firkant.classList.contains('flagget')) {
            return;

        } else {
            firkant.classList.add('aktivert');
            firkant.style.backgroundColor = '#c0c0c0';
            if (antallBomber > 0) {
                firkant.textContent = antallBomber;
                switch (antallBomber) {
                    case 1:
                        firkant.style.color = 'blue';
                        break;
                    case 2:
                        firkant.style.color = 'green';
                        break;
                    case 3:
                        firkant.style.color = 'red';
                        break;
                    case 4:
                        firkant.style.color = 'purple';
                        break;
                    case 5:
                        firkant.style.color = 'maroon';
                        break;
                    case 6:
                        firkant.style.color = 'turquoise';
                        break;
                    case 7:
                        firkant.style.color = 'black';
                        break;
                    case 8:
                        firkant.style.color = 'darkgrey';
                        break;
                }

            } else {
                omringendeFirkanter.forEach((index) => {
                    if (index >= 0 && index < 400) {
                        let isLeftEdge = i % 20 === 0;
                        let isRightEdge = i % 20 === 19;

                        if (
                            (!isLeftEdge || index !== i - 1 - 20 && index !== i - 1 && index !== i - 1 + 20) &&
                            (!isRightEdge || index !== i + 1 - 20 && index !== i + 1 && index !== i + 1 + 20)
                        ) {
                            if (!firkanter[index].classList.contains('aktivert')) {
                                firkanter[index].click();
                            }
                        }
                    }
                });
            };
            if (400 - Number(firkanterMedBomber.size) === document.querySelectorAll('.aktivert').length && !gameIsOver) {
                stopTimer();
                setTimeout(() => {
                    alert('Du VANT!');
                    gameIsOver = true;

                    let alleFirkanter = document.querySelectorAll('.firkant');
                    alleFirkanter.forEach((firkant) => {
                        firkant.classList.remove('flagget');
                        if (firkant.getAttribute('Bombe') === 'true') {
                            firkant.classList.add('aktivert');
                            firkant.style.backgroundColor = 'lightgrey';
                            firkant.textContent = '💣';
                        }
                    });
                }, 20);
            }
        };
    });

    if (firkanterMedBomber.has(i)) {
        firkant.setAttribute('Bombe', 'true');
    }

    spillBrett.appendChild(firkant);
    firkanter.push(firkant);
};

