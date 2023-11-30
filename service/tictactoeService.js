import { v4 as uuidv4 } from 'uuid';

import { TicTacToeGame } from '../entity/TicTacToeGame.js';

// Функция создания лобби игры на 2 человека
export function createGame(req, res) {
    let newGameID = uuidv4()

    // Создаем новый объект класса игры
    let newGame = new TicTacToeGame(newGameID)
    global.tictactoe.addGame(newGame)

    // Перенаправляем на созданную игру
    res.redirect(`/game/${newGameID}`)
}

// Функция получения информации об игре
export function getGameInfo(gameID) {
    let game = global.tictactoe.findGameById(gameID)
    let gameStatus = game.getGameStatus()
    let gameField = game.getGameField()
    let gameFieldProcessed = []

    // Узнаем информацию о полях, на которых стоят отметки
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (gameField[i][j] == "O" || gameField[i][j] == "X") {
                gameFieldProcessed.push(`${gameField[i][j]}_${i}_${j}`)
            }
        }
    }

    // Возвращаем статус игры и массив строк, в которых описаны занятые поля
    return [gameStatus, gameFieldProcessed]
}

// Функция обработки подключения второго игрока
export function secondPlayerJoined(gameID) {
    // Находим игру и меняем ее статус
    let game = global.tictactoe.findGameById(gameID)
    game.setGameStatus("Waiting to Start")

    let player1_ws = game.getPlayer1_ws()
    let player2_ws = game.getPlayer2_ws()

    // Посылаем двум клиентам, что к игре присоединился второй игрок
    let payload = {
        action: "SECOND_PLAYER_JOINED"
    }
    player1_ws.send(JSON.stringify(payload))
    player2_ws.send(JSON.stringify(payload))
}

// Функция старта игры в определенном лобби
export function startGame(gameID) {
    // Находим игру и проверяем статус игры
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

    // Отправляем клиентам сообщение, что игра началась
    let payload = {
        action: "GAME_STARTED"
    }
    player1_ws.send(JSON.stringify(payload))
    player2_ws.send(JSON.stringify(payload))
}

// Функция установка отметки (крестика или нолика) в конкретную ячейку
// На вход получаем fieldInfo в формате X_0_0 и ID игры
export function setField(fieldInfo, gameID) {
    // Находим игру и вызываем метод установки отметки. Получаем результат установки
    let game = global.tictactoe.findGameById(gameID)
    let setResult = game.setFieldValue(fieldInfo)

    let player1_ws = game.getPlayer1_ws()
    let player2_ws = game.getPlayer2_ws()

    if (setResult == "Server error") {
        return
    }

    // Результат Continue - отсылаем информацию о продолжении игры
    if (setResult[0] == "Continue") {
        let payload = {
            action: "UPDATE_CLIENT_FIELD",
            fieldInfo: setResult[1],
            nextTurn: setResult[2]
        }
        player1_ws.send(JSON.stringify(payload))
        player2_ws.send(JSON.stringify(payload))
    }

    // Результат X Win или O Win - отсылаем информацию об окончании игры с результатом игры
    if (setResult[0] == "X Win" || setResult[0] == "O Win") {
        let payload = {
            action: "FINISH_GAME",
            winner: ((setResult[0]).split(" "))[0],
            fieldInfo: setResult[1]
        }
        player1_ws.send(JSON.stringify(payload))
        player2_ws.send(JSON.stringify(payload))
    }

    // Результат Draw - отсылаем информацию об окончании игры с результатом игры
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