import { v4 as uuidv4 } from 'uuid';

import { TicTacToeGame } from '../entity/TicTacToeGame.js';

export function createGame(req, res) {
    let newGameID = uuidv4()

    let newGame = new TicTacToeGame(newGameID)
    global.tictactoe.addGame(newGame)

    res.redirect(`/game/${newGameID}`)
}

export function getGameInfo(gameID) {
    let game = global.tictactoe.findGameById(gameID)
    let gameStatus = game.getGameStatus()
    let gameField = game.getGameField()
    let gameFieldProcessed = []

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameField[i][j] == "O" || gameField[i][j] == "X") {
                gameFieldProcessed.push(`${gameField[i][j]}_${i}_${j}`)
            }
        }
    }

    return [gameStatus, gameFieldProcessed]
}

export function secondPlayerJoined(gameID) {
    let game = global.tictactoe.findGameById(gameID)
    game.setGameStatus("Waiting to Start")

    let player1_ws = game.getPlayer1_ws()
    let player2_ws = game.getPlayer2_ws()

    let payload = {
        action: "SECOND_PLAYER_JOINED"
    }
    player1_ws.send(JSON.stringify(payload))
    player2_ws.send(JSON.stringify(payload))
}

export function startGame(gameID) {
    let game = global.tictactoe.findGameById(gameID)
    if (game.getGameStatus() == "Waiting to Start" || game.getGameStatus() == "Finished") {
        game.setGameStatus("X Turn")
        game.clearField()
    }
    else {
        return
    }

    let player1_ws = game.getPlayer1_ws()
    let player2_ws = game.getPlayer2_ws()

    let payload = {
        action: "GAME_STARTED"
    }
    player1_ws.send(JSON.stringify(payload))
    player2_ws.send(JSON.stringify(payload))
}

export function setField(fieldInfo, gameID) {
    let game = global.tictactoe.findGameById(gameID)
    let setResult = game.setFieldValue(fieldInfo)

    let player1_ws = game.getPlayer1_ws()
    let player2_ws = game.getPlayer2_ws()

    if (setResult == "Server error") {
        return
    }

    if (setResult[0] == "Continue") {
        let payload = {
            action: "UPDATE_CLIENT_FIELD",
            fieldInfo: setResult[1],
            nextTurn: setResult[2]
        }
        player1_ws.send(JSON.stringify(payload))
        player2_ws.send(JSON.stringify(payload))
    }

    if (setResult[0] == "X Win" || setResult[0] == "O Win") {
        let payload = {
            action: "FINISH_GAME",
            winner: ((setResult[0]).split(" "))[0],
            fieldInfo: setResult[1]
        }
        player1_ws.send(JSON.stringify(payload))
        player2_ws.send(JSON.stringify(payload))
    }

    if (setResult[0] == "Draw") {
        let payload = {
            action: "FINISH_GAME",
            winner: "Draw",
            fieldInfo: setResult[1]
        }
        player1_ws.send(JSON.stringify(payload))
        player2_ws.send(JSON.stringify(payload))
    }
}