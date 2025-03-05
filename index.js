const players = Object.freeze({
    CROSS: "x",
    CIRCLE: "o"
})
const TABLE = [[null, null, null], [null, null, null], [null, null, null]]

const winningMatches = {
    v1: [[0, 0], [1, 0], [2, 0]],
    v2: [[0, 1], [1, 1], [2, 1]],
    v3: [[0, 2], [1, 2], [2, 2]],
    h1: [[0, 0], [0, 1], [0, 2]],
    h2: [[1, 0], [1, 1], [1, 2]],
    h3: [[2, 0], [2, 1], [2, 2]],
    diagonal1: [[0, 0], [1, 1], [2, 2]],
    diagonal2: [[2, 0], [1, 1], [0, 2]]
}

const tiles = document.querySelectorAll(".tile");
const game = document.querySelector(".game");
let turn;
let table;
const result = document.querySelector(".result");

const initBoard = () => {
    turn = players.CROSS;
    table = JSON.parse(JSON.stringify(TABLE));
    result.style.display = "none";
    tiles.forEach(tile => tile.className = "tile");
    const line = document.querySelector(".linethrough");
    game.style.pointerEvents = "all";
    line && game.removeChild(line);
};

const checkBoard = (turn, i, j) => {
    const keys = Object.keys(winningMatches);

    for (let key of keys) {
        const match = winningMatches[key];
        if (!match.find(e => JSON.stringify(e) == JSON.stringify([i, j]))) continue;

        if (
            turn === table[match[0][0]][match[0][1]] &&
            turn === table[match[1][0]][match[1][1]] &&
            turn === table[match[2][0]][match[2][1]]
        ) return key;
    }


    for (let k = 0; k < 3; k++) {
        if (table[k].includes(null)) return null;
    }
    return "draw";
};

const winGame = (combination) => {
    const line = document.createElement("div");
    line.className = "linethrough";
    line.id = combination;

    game.appendChild(line);
    game.style.pointerEvents = "none";
    result.querySelector("h2").innerHTML = "Winner!";
    setTimeout(() => {
        result.style.display = "flex";
    }, 2000);
}

const drawGame = () => {
    setTimeout(() => {
        result.querySelector("h2").innerHTML = "Draw!";
        result.style.display = "flex";
    }, 2000);
}

const chooseTile = () => {
    const i = Math.floor(event.target.id / 3);
    const j = event.target.id % 3;

    if (table[i][j]) return;
    event.target.classList.toggle(turn);
    table[i][j] = turn;

    const winComb = checkBoard(turn, i, j);

    if (winComb === "draw") {
        drawGame();
        return;
    }
    else if (winComb) {
        winGame(winComb);
        return;

    }

    turn = turn === players.CROSS ? players.CIRCLE : players.CROSS;
}

initBoard();