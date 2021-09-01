const minefield = document.querySelector(".minefield");

const numberOfBombs = 10;
const width = 10;
const height = 10;
const field = [];

// create minefield
function createMinefield() {
    let k = 0;
    for (let i = 0; i < height; i++) {
        field[i] = [];
        for (let j = 0; j < width; j++) {
            const square = document.createElement("div");
            square.setAttribute("id", k);
            square.setAttribute("class", "cell");
            square.classList.add("hidden");
            square.addEventListener("click", function (e) {
                control(square, i, j);
            });
            minefield.appendChild(square);
            field[i][j] = square;
            k++;
        }
    }
}

// place bombs at random locations on the minefield
function placeBombs() {
    for (let i = 0; i < numberOfBombs; i++) {
        const randomI = Math.floor(Math.random() * height);
        const randomJ = Math.floor(Math.random() * width);
        field[randomI][randomJ].setAttribute("class", "bomb");
        field[randomI][randomJ].classList.add("hidden");
    }
}

// count the number of bombs touching a cell
function countBombs(row, col) {
    if (field[row][col].classList.contains("bomb")) {
        return;
    }

    var mineCounter = 0;
    var i = row - 1;
    while (i <= row + 1) {
        var j = col - 1;
        while (j <= col + 1) {
            if (i >= 0 && i <= height - 1 && j >= 0 && j <= width - 1) {
                if (field[i][j].classList.contains("bomb")) mineCounter++;
            }

            j++;
        }

        i++;
    }

    return mineCounter;
}

// fill each cell with the number of bombs touching it
function fillBoard() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            field[i][j].classList.remove("hidden");
            field[i][j].classList.add("revealed");
            if (field[i][j].classList.contains("bomb")) {
                field[i][j].innerHTML = "💣";
            } else {
                const numberOfNearbyBombs = countBombs(i, j);
                field[i][j].innerHTML = numberOfNearbyBombs;
            }
        }
    }
}

// control for the game
function control(square, i, j) {
    if (square.classList.contains("bomb")) {
        square.classList.add("clicked");
        square.innerHTML = "💣";
        updateGameStatus("Game Over!");
    } else if (checkForWin() === true) {
        updateGameStatus("Game Won!");
    } else {
        square.classList.remove("hidden");
        square.classList.add("revealed");
        reveal(i, j);
    }
}

function revealRecursive(i, j) {
    if (i < 0 || i >= height || j < 0 || j >= width) return;
    if (field[i][j].classList.contains("bomb")) return;
    field[i][j].classList.remove("hidden");
    field[i][j].classList.add("revealed");
    field[i][j].innerHTML = countBombs(i, j);
    setTimeout(() => {
        reveal(i + 1, j);
    }, 1);
    setTimeout(() => {
        reveal(i - 1, j);
    }, 1);
    setTimeout(() => {
        reveal(i, j - 1);
    }, 1);
    setTimeout(() => {
        reveal(i, j + 1);
    }, 1);
}

function reveal(row, col) {
    const numberOfNearbyBombs = countBombs(row, col);
    if (numberOfNearbyBombs > 0) {
        field[row][col].classList.remove("hidden");
        field[row][col].classList.add("revealed");
        field[row][col].innerHTML = numberOfNearbyBombs;
        return;
    }

    var i = row - 1;
    while (i <= row + 1) {
        var j = col - 1;
        while (j <= col + 1) {
            if (i >= 0 && i <= height - 1 && j >= 0 && j <= width - 1) {
                field[i][j].classList.remove("hidden");
                field[i][j].classList.add("revealed");
                field[i][j].innerHTML = countBombs(i, j);
            }

            j++;
        }

        i++;
    }
}

function checkForWin() {
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            if (
                field[i][j].classList.contains("hidden") &&
                !field[i][j].classList.contains("bomb")
            )
                return false;
        }
    }

    return true;
}

function updateGameStatus(status) {
    fillBoard();
    var gameTitle = document.querySelector("header");
    gameTitle.innerHTML = status;
    const modal = document.createElement("div");
    const modalContent = document.createElement("div");
    const modalCloseButton = document.createElement("span");
    modalCloseButton.innerHTML = "&times";
    modal.setAttribute("class", "modal");
    modalContent.setAttribute("class", "modal-content");
    modalCloseButton.setAttribute("class", "close-button");
    modal.appendChild(modalCloseButton);
    modal.appendChild(modalContent);
    setTimeout(() => {
        modal.classList.add("show-modal");
    }, 1000);
    document.body.appendChild(modal);

    modalContent.innerHTML = status;
    modalCloseButton.addEventListener("click", function () {
        modal.classList.remove("show-modal");
        location.reload();
    });
}

function main() {
    createMinefield();
    placeBombs();
}

main();
