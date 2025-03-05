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
    diagonal2: [[0, 2], [1, 1],[2, 0]]
}

let playedX = [];
let playedO = [];

const tiles = document.querySelectorAll(".tile");
const game = document.querySelector(".game");
let turn;
let table;
const result = document.querySelector(".result");
const audio = document.querySelector("audio");
audio.volume = .1;
const audioIcon = document.querySelector(".audio-icon");

const MUTE_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3zM425 167l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0z"/></svg>`
const AUDIO_ICON = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64l0 384c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352 64 352c-35.3 0-64-28.7-64-64l0-64c0-35.3 28.7-64 64-64l67.8 0L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>`
const initBoard = () => {
    turn = players.CROSS;
    table = JSON.parse(JSON.stringify(TABLE));
    result.style.top = "100%";
    tiles.forEach(tile => tile.className = "tile");
    game.style.pointerEvents = "all";
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
    game.style.pointerEvents = "none";
    result.querySelector("h2").innerHTML = "Winner!";
    setTimeout(() => {
        result.style.top = "0";
    }, 2000);

    const highlight = winningMatches[combination];
    for (let [index, h] of highlight.entries()) {
        const elId = h[0] * 3 + h[1];
        setTimeout(() => {
            document.getElementById(elId).classList.add(`won${turn}`);
        }, 200 * index);
    }
}

const tieGame = () => {
    setTimeout(() => {
        result.querySelector("h2").innerHTML = "Draw!";
        result.style.top = "0";
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


toggleMusic = () => {
    if (audio.paused) {
        audio.play()
        audioIcon.innerHTML = AUDIO_ICON;
        localStorage.setItem("audio", "true");
    }
    else {
        audio.pause();
        audioIcon.innerHTML = MUTE_ICON;
        localStorage.setItem("audio", "false");
    }
}

if(localStorage.getItem("audio") == "false" ) {
    audioIcon.innerHTML = MUTE_ICON;
    audio.pause();
}
else  {
    audioIcon.innerHTML = AUDIO_ICON;
}
initBoard();