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

let playedX = [];
let playedO = [];

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
    playedX = [];
    playedO = [];
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
    }, 3000);

    const highlight = winningMatches[combination];
    for (let [index, h] of highlight.entries()) {
        const elId = h[0] * 3 + h[1];
        setTimeout(() => {
            document.getElementById(elId).classList.add(`won${turn}`);
        }, 400 * index);
    }
}

const tieGame = () => {
    setTimeout(() => {
        result.querySelector("h2").innerHTML = "Draw!";
        result.style.display = "flex";
    }, 2000);
}

const choseNextToDisappear = () => {
    if (turn === players.CIRCLE && playedO.length === 3) {
        playedO[0].classList.add("next");
    }
    else if (turn === players.CROSS && playedX.length === 3) {
        playedX[0].classList.add("next");
    }
}

const getIndexesFromId = (id) => {
    return [Math.floor(id / 3), id % 3];
}

const chooseTile = () => {
    const [i, j] = getIndexesFromId(event.target.id);

    if (table[i][j]) return;
    event.target.classList.toggle(turn);
    table[i][j] = turn;

    if (turn === players.CIRCLE) {
        const disappearedTile = playedO.length === 3 ? playedO.shift() : null;
        if (disappearedTile) {
            disappearedTile.className = "tile";
            const [i, j] = getIndexesFromId(disappearedTile.id);
            table[i][j] = null;
        }
        playedO.push(event.target);
    }
    else {
        const disappearedTile = playedX.length === 3 ? playedX.shift() : null;
        if (disappearedTile) {
            disappearedTile.className = "tile";
            const [i, j] = getIndexesFromId(disappearedTile.id);
            table[i][j] = null;
        }
        playedX.push(event.target);
    }

    const winComb = checkBoard(turn, i, j);

    if (winComb === "draw") {
        tieGame();
        return;
    }
    else if (winComb) {
        winGame(winComb);
        return;

    }

    turn = turn === players.CROSS ? players.CIRCLE : players.CROSS;
    choseNextToDisappear();
}

initBoard();