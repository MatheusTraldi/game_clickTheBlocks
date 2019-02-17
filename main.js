const nBlocks = 100;

class Menu {
    constructor(selectionID1, selectionID2, selectionID3) {
        this.selectionVectorID = [selectionID1, selectionID2, selectionID3]
        this.difficultyCode = 2;

        this.select = function(elementID) {
            for(let i = 0; i < this.selectionVectorID.length; i++) {
                if(elementID == this.selectionVectorID[i]) {
                    document.getElementById(this.selectionVectorID[i]).className = 'difficultySelected';
                    this.difficultyCode = (i + 1);
                }
                else
                    document.getElementById(this.selectionVectorID[i]).className = 'difficultyNotSelection';
            }
        }

        this.start = function() {
            let flash = document.createElement('div');
            flash.id = 'flash';
            document.body.appendChild(flash)
            setTimeout(() => {
                window.location.href = 'game.html?' + this.difficultyCode;
            }, 2100);
        }
    }
}

const menu = new Menu('selectionEasy', 'selectionMedium', 'selectionHard');

class GameArea {
    constructor(nBlocks) {
        this.blocksClicked = 0;
        this.blocksRemainining = nBlocks;
        this.clicksNumber = 0;

        this.createBlocks = function() {
            for(let i = 0; i < nBlocks; i++) {
                let block = document.createElement('div');
                block.id = 'block' + i;
                block.className = 'block';
                block.onmousedown = function() {
                    if(block.className == 'block') {
                        block.className = 'blockClicked';
                        ++this.blocksClicked;
                        --this.blocksRemainining;

                        document.getElementById('deletedBlocks').innerHTML = this.blocksClicked;
                        document.getElementById('restingBlocks').innerHTML = this.blocksRemainining;

                        if(this.blocksRemainining == 0) {
                            clearTimeout(clock.clockCounting);
                            gameOver.youWin();
                        }

                    }
                    else {
                        block.className = 'block';
                        --this.blocksClicked;
                        ++this.blocksRemainining;

                        document.getElementById('deletedBlocks').innerHTML = this.blocksClicked;
                        document.getElementById('restingBlocks').innerHTML = this.blocksRemainining;
                    }
                }.bind(this);
                
                document.getElementById('gameBase').appendChild(block);
            }
        }

        this.countingClicks = function() {
            ++this.clicksNumber;
        }
    }
}

const gameArea = new GameArea(nBlocks);

class Clock {
    constructor() {
        this.clockCounting = 0;
        this.runClock = function(initialTime) {
            document.getElementById('clock').innerHTML = initialTime;
    
            if(initialTime == '00:00:00') {
                gameOver.youLose();
                return false;
            }
            
            initialTime = this.decrement10MilisecTimeString(initialTime);
    
            this.clockCounting = setTimeout((arg) => {
                this.runClock(arg);
            }, 10, initialTime);
        }
    }

    decrement10MilisecTimeString(timeString) {
        let milisec = parseInt(timeString.slice(6, 8), 10);
        let sec = parseInt(timeString.slice(3, 5), 10);
        let min = parseInt(timeString.slice(0, 2), 10);
        
        if(milisec !== 0)
            --milisec;

        else if(sec !== 0) {
            milisec = 99;
            --sec;
        }
        else {
            milisec = 59;
            sec = 59;
            --min;
        }

        if(milisec < 10)
            milisec = `0${milisec}`;
        if(sec < 10)
            sec = `0${sec}`;
        if(min < 10)
            min = `0${min}`;    

        return min + ':' + sec + ':' + milisec;
    }

    increment10MilisecTimeString(timeString) {
        let milisec = parseInt(timeString.slice(6, 8), 10);
        let sec = parseInt(timeString.slice(3, 5), 10);
        let min = parseInt(timeString.slice(0, 2), 10);

        if(milisec !== 99)
            ++milisec;

        else if (sec != 59) {
            milisec = 0;
            ++sec;
        }

        else {
            milisec = 0;
            sec = 0;
            ++min;
        }

        if(milisec < 10)
            milisec = `0${milisec}`;
        if(sec < 10)
            sec = `0${sec}`;
        if(min < 10)
            min = `0${min}`;
        
        return min + ':' + sec + ':' + milisec;
    }

    timeStringToNumber(timeString) {
        let milisec = parseInt(timeString.slice(6, 8), 10);
        let sec = parseInt(timeString.slice(3, 5), 10);
        let min = parseInt(timeString.slice(0, 2), 10);

        return milisec + (sec * 100) + (min * 10000);
    }

    timeNumberToString(timeNumber) {
        let timeString = null;

        if(timeNumber < 10)
            timeString = '00:00:0' + timeNumber.toString();
        else if(timeNumber < 100)
            timeString = '00:00:' + timeNumber.toString();
        else if(timeNumber < 1000)
            timeString = '00:0' + timeNumber.toString().slice(0, 1) + ':' + timeNumber.toString().slice(1, 3);
        else if(timeNumber < 10000)
            timeString = '00:' + timeNumber.toString().slice(0, 2) + ':' + timeNumber.toString().slice(2, 4);
        else if(timeNumber < 100000)
            timeString = '0' + timeNumber.toString().slice(0, 1) + ':' + timeNumber.toString().slice(1, 3) + ':' + timeNumber.toString().slice(3, 5);
        else if(timeNumber < 1000000)
            timeString = timeNumber.toString().slice(0, 2) + ':' + timeNumber.toString().slice(2, 4) + ':' + timeNumber.toString().slice(4, 6);

        return timeString;
    }
}

const clock = new Clock();

class GamePanel {
    constructor(nBlocks) {
        this.nBlocks = nBlocks;
        this.setClock = function() {
            let initialTime = null;

            if(window.location.search.replace('?', '') == '1')
                initialTime =  '01:20:00';
            if(window.location.search.replace('?', '') == '2')
                initialTime = '00:50:00';
            if(window.location.search.replace('?', '') == '3')
                initialTime = '00:30:00';

            clock.runClock(initialTime);
        }

        this.setBlocksCounting = function() {
            document.getElementById('deletedBlocks').innerHTML = 0;
            document.getElementById('restingBlocks').innerHTML = this.nBlocks;
        }
    }
}

const gamePanel = new GamePanel(nBlocks);

class GameOver {
    constructor() {
        this.completePorcentage = null;
        this.remainingTime = null;
        this.clicksNumber = null;
        this.effectiveness = null;
        this.points = null;

        this.youLose = function() {
            this.createGameOverPanel();
            document.getElementById('statusBox').className = 'youLose';
            document.getElementById('statusBox').innerHTML = 'YOU LOSE';
            this.setStatistics();
            this.showStatistics();
        }

        this.youWin = function() {
            this.createGameOverPanel();
            document.getElementById('statusBox').className = 'youWin';
            document.getElementById('statusBox').innerHTML = 'YOU WIN';
            this.setStatistics();
            this.showStatistics();
        }
    }

    createGameOverPanel() {
        let gameOverPanel = document.createElement('div');
        gameOverPanel.id = 'gameOverPanel';

        let statusBox = document.createElement('div');
        statusBox.id = 'statusBox';

        let completePorcentageLabel = document.createElement('div');
        completePorcentageLabel.id = 'completePorcentageLabel';
        completePorcentageLabel.className = 'statistcsBox';
        completePorcentageLabel.innerHTML = '% COMPLETE:';

        let completePorcentageValue = document.createElement('div');
        completePorcentageValue.id = 'completePorcentageValue';
        completePorcentageValue.className = 'statistcsBox';
        completePorcentageValue.innerHTML = '000 %';

        let clicksNumberLabel = document.createElement('div');
        clicksNumberLabel.id = 'clicksNumberLabel';
        clicksNumberLabel.className = 'statistcsBox';
        clicksNumberLabel.innerHTML = '# CLICKS:';

        let clicksNumberValue = document.createElement('div');
        clicksNumberValue.id = 'clicksNumberValue';
        clicksNumberValue.className = 'statistcsBox';
        clicksNumberValue.innerHTML = '000';

        let remainingTimeLabel = document.createElement('div');
        remainingTimeLabel.id = 'remainingTimeLabel';
        remainingTimeLabel.className = 'statistcsBox';
        remainingTimeLabel.innerHTML = "REST TIME:";

        let remainingTimeValue = document.createElement('div');
        remainingTimeValue.id = 'remainingTimeValue';
        remainingTimeValue.className = 'statistcsBox';
        remainingTimeValue.innerHTML = '00:00:00'

        let effectivenessLabel = document.createElement('div');
        effectivenessLabel.id = 'effectivenessLabel';
        effectivenessLabel.className = 'statistcsBox';
        effectivenessLabel.innerHTML = 'EFFECTIVENESS:';

        let effectivenessValue = document.createElement('div');
        effectivenessValue.id = 'effectivenessValue';
        effectivenessValue.className = 'statistcsBox';
        effectivenessValue.innerHTML = '000 %';

        let pointsLabel = document.createElement('div');
        pointsLabel.id = 'pointsLabel';
        pointsLabel.innerHTML = 'POINTS:';

        let pointsValue = document.createElement('div');
        pointsValue.id = 'pointsValue';
        pointsValue.innerHTML = '0000000';

        document.body.appendChild(gameOverPanel);
        document.getElementById('gameOverPanel').appendChild(statusBox);
        document.getElementById('gameOverPanel').appendChild(completePorcentageLabel);
        document.getElementById('gameOverPanel').appendChild(completePorcentageValue);
        document.getElementById('gameOverPanel').appendChild(clicksNumberLabel);
        document.getElementById('gameOverPanel').appendChild(clicksNumberValue);
        document.getElementById('gameOverPanel').appendChild(remainingTimeLabel);
        document.getElementById('gameOverPanel').appendChild(remainingTimeValue);
        document.getElementById('gameOverPanel').appendChild(effectivenessLabel);
        document.getElementById('gameOverPanel').appendChild(effectivenessValue);
        document.getElementById('gameOverPanel').appendChild(pointsLabel);
        document.getElementById('gameOverPanel').appendChild(pointsValue);

        for(let i = 0; i < nBlocks; i++) {
            document.getElementById('block' + i).className = 'blockGameOver';
            document.getElementById('block' + i).onmousedown = function () {return false};
        }
    }

    setStatistics() {
        let blocksClicked = document.getElementById('deletedBlocks').innerHTML;
        let difficultyCode = window.location.search.replace('?', '');
        let remainingTimePoints = 0;

        this.completePorcentage = blocksClicked / nBlocks;
        
        this.remainingTime = document.getElementById('clock').innerHTML;

        remainingTimePoints = clock.timeStringToNumber(this.remainingTime);

        this.clicksNumber = gameArea.clicksNumber;

        if (this.clicksNumber != 0)
            this.effectiveness = blocksClicked/this.clicksNumber;
        else this.effectiveness = 0;

        if (difficultyCode == 1)
            difficultyCode = 0.02;
        if(difficultyCode == 3)
            difficultyCode = 2000;
        
        this.points = Math.round(difficultyCode * ((this.completePorcentage * 100) + (remainingTimePoints) + (this.effectiveness * 100)));
    }

    showStatistics() {
        let completePorcentageLimite = Math.round(this.completePorcentage * 100);
        let clicksNumberLimite = this.clicksNumber;
        let remainingTimeLimite = clock.timeStringToNumber(this.remainingTime);
        let effectivenessLimite = Math.round(this.effectiveness * 100);
        let pointsLimite = this.points;

        setTimeout((arg) => {
            let repetitionCounting = 0;

            repetitionCounting = setInterval(() => {
                if(arg >= completePorcentageLimite) {
                    if(completePorcentageLimite < 10)
                        document.getElementById('completePorcentageValue').innerHTML = `00${completePorcentageLimite} %`;
                    else if(completePorcentageLimite < 100)
                        document.getElementById('completePorcentageValue').innerHTML = `0${completePorcentageLimite} %`;
                    else
                        document.getElementById('completePorcentageValue').innerHTML = `${completePorcentageLimite} %`;
                    
                    clearInterval(repetitionCounting);
                    return false;
                }
                
                arg++;

                if(arg < 10)
                    document.getElementById('completePorcentageValue').innerHTML = `00${arg} %`;
                else if(arg < 100)
                    document.getElementById('completePorcentageValue').innerHTML = `0${arg} %`;
                else
                    document.getElementById('completePorcentageValue').innerHTML = `${arg} %`;

            }, 30);

        }, 1000, 0);

        setTimeout((arg) => {
            let repetitionCounting = 0;

            repetitionCounting = setInterval(() => {
                if(arg >= clicksNumberLimite) {
                    if(clicksNumberLimite < 10)
                        document.getElementById('clicksNumberValue').innerHTML = `00${clicksNumberLimite}`;
                    else if(clicksNumberLimite < 100)
                        document.getElementById('clicksNumberValue').innerHTML = `0${clicksNumberLimite}`;
                    else
                        document.getElementById('clicksNumberValue').innerHTML = `${clicksNumberLimite}`;

                    clearInterval(repetitionCounting);
                    return false;
                }
                
                arg++;

                if(arg < 10)
                    document.getElementById('clicksNumberValue').innerHTML = `00${arg}`;
                else if(arg < 100)
                    document.getElementById('clicksNumberValue').innerHTML = `0${arg}`;
                else
                    document.getElementById('clicksNumberValue').innerHTML = `${arg}`;

            }, 30);

        }, 1000, 0);

        setTimeout((arg) => {
            let repetitionCounting = 0;

            repetitionCounting = setInterval(() => {
                if(arg >= remainingTimeLimite) {
                    document.getElementById('remainingTimeValue').innerHTML = clock.timeNumberToString(remainingTimeLimite);
                    
                    clearInterval(repetitionCounting);
                    return false;
                }
                
                arg = arg + 50;

    
                document.getElementById('remainingTimeValue').innerHTML = clock.timeNumberToString(arg);

            }, 10);

        }, 1000, 0);

        setTimeout((arg) => {
            let repetitionCounting = 0;

            repetitionCounting = setInterval(() => {
                if(arg >= effectivenessLimite) {
                    if(arg < 10)
                        document.getElementById('effectivenessValue').innerHTML = `00${arg} %`;
                    else if(arg < 100)
                        document.getElementById('effectivenessValue').innerHTML = `0${arg} %`;
                    else
                        document.getElementById('effectivenessValue').innerHTML = `${arg} %`;
                    
                    clearInterval(repetitionCounting);
                    return false;
                }
                
                arg++;

                if(arg < 10)
                    document.getElementById('effectivenessValue').innerHTML = `00${arg} %`;
                else if(arg < 100)
                    document.getElementById('effectivenessValue').innerHTML = `0${arg} %`;
                else
                    document.getElementById('effectivenessValue').innerHTML = `${arg} %`;

            }, 30);

        }, 1000, 0);

        setTimeout((arg) => {
            let repetitionCounting = 0;
            
            repetitionCounting = setInterval(() => {
                if(arg >= pointsLimite) {
                    for(let i = 0; i >= 0; ++i) { // pseudo-infinite loop
                        if((pointsLimite /  Math.pow(10, i) ) < 10) {
                            let zeroString = '';
                            for(let j = 0; j < (6 - i); j++) {
                                zeroString = '0' + zeroString;
                            }
                            document.getElementById('pointsValue').innerHTML = `${zeroString}${pointsLimite}`;
                            this.restart();
                            break;
                        }
                    }
                    clearInterval(repetitionCounting);
                    return false;
                }
                
                arg = arg + 8157;

                for(let i = 0; i >= 0; ++i) { // pseudo-infinite loop
                    if((arg /  Math.pow(10, i) ) < 10) {
                        let zeroString = '';
                        for(let j = 0; j < (6 - i); j++) {
                            zeroString = '0' + zeroString;
                        }
                        document.getElementById('pointsValue').innerHTML = `${zeroString}${arg}`;
                        break;
                    }
                }

            }, 30);

        }, 5000, 0);
    }

    restart() {
        let restartButtom = document.createElement('div');
        restartButtom.id = 'restartButtom';
        restartButtom.className = 'continueGameButtom'
        restartButtom.innerHTML = 'RESTART';
        restartButtom.onclick = function() {
            let flash = document.createElement('div');
            flash.id = 'flash';
            document.body.appendChild(flash)
            setTimeout(() => {
                window.location.reload();
            }, 2100);
        }
    
        let selectDifficultyButtom = document.createElement('div');
        selectDifficultyButtom.id = 'selectDifficultyButtom';
        selectDifficultyButtom.className = 'continueGameButtom'
        selectDifficultyButtom.innerHTML = 'SELECT DIFFICULTY';
        selectDifficultyButtom.onclick = function() {
            let flash = document.createElement('div');
            flash.id = 'flash';
            document.body.appendChild(flash)
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2100);
        }

        document.getElementById('gameOverPanel').appendChild(restartButtom);
        document.getElementById('gameOverPanel').appendChild(selectDifficultyButtom);
    }

}

const gameOver = new GameOver();
