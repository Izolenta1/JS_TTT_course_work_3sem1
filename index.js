import express from "express"
import path, { dirname, extname } from "path";
import { fileURLToPath } from "node:url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import { WebSocketServer } from "ws";
import queryString from 'query-string';
import { v4 as uuidv4 } from 'uuid';
import cookie from "cookie"
import cookieParser from "cookie-parser";

import routes from "./routes.js"
import { TicTacToe } from "./entity/TicTacToe.js";
import { setField } from "./service/tictactoeService.js";
import { secondPlayerJoined } from "./service/tictactoeService.js";
import { startGame } from "./service/tictactoeService.js";
import { getGameInfo } from "./service/tictactoeService.js";

//Класс с играми
let tictactoe = new TicTacToe()
global.tictactoe = tictactoe

//WebSocket сервер
const wss = new WebSocketServer({ port: 8001 });

wss.on('connection', function connection(ws, req) {
    ws.on('error', console.error);

    //Получаем id игры
    let query_params = queryString.parse(req.url)
    let gameID = query_params["/?gameID"]

    let currentPlayerUUID = (cookie.parse(req.headers.cookie))["ttt_playerUUID"]

    //Определяем сторону игрока и сохраняем его подключение
    let game = global.tictactoe.findGameById(gameID)
    if (game == "Game not found") {
        ws.send('Игра не найдена')
    }

    if (game.getPlayer1_ws() == "" || game.getPlayer1_uuid() == currentPlayerUUID) {
        game.setPlayer1_ws(ws)

        //Проверяем, создан ли uuid уже
        let playerUUID = ""
        if (game.getPlayer1_uuid() == "") {
            playerUUID = uuidv4()
        }
        else {
            playerUUID = game.getPlayer1_uuid()
        }

        game.setPlayer1_uuid(playerUUID)

        let gameInfo = getGameInfo(gameID)

        //Отправляем сообщение
        let payload = {
            action: "DEFINE_X",
            playerUUID: playerUUID,
            gameStatus: gameInfo[0],
            gameField: gameInfo[1]
        }
        ws.send(JSON.stringify(payload))
    }
    else if (game.getPlayer2_ws() == "" || game.getPlayer2_uuid() == currentPlayerUUID) {
        game.setPlayer2_ws(ws)

        //Проверяем, создан ли uuid уже
        let playerUUID = ""
        if (game.getPlayer2_uuid() == "") {
            playerUUID = uuidv4()
            secondPlayerJoined(gameID)
        }
        else {
            playerUUID = game.getPlayer2_uuid()
        }

        game.setPlayer2_uuid(playerUUID)

        let gameInfo = getGameInfo(gameID)

        //Отправляем сообщение
        let payload = {
            action: "DEFINE_O",
            playerUUID: playerUUID,
            gameStatus: gameInfo[0],
            gameField: gameInfo[1]
        }
        ws.send(JSON.stringify(payload))
    }
    else {
        //Отправляем сообщение
        let payload = {
            action: "GAME_FULL"
        }
        ws.send(JSON.stringify(payload))
    }

    ws.on('message', function message(event) {
        let message = JSON.parse(event.toString())
        switch (message.action) {
            case "START_GAME":
                startGame(message.gameID)
                break
            case "SET_FIELD":
                setField(message.fieldInfo, message.gameID)
                break
        }
    });
});



//HTTP сервер
const app = express()
app.use(express.static(path.resolve(__dirname, "static")))
app.use(routes)
app.use(cookieParser())


app.get("/", function(req, res) {
    return res.sendFile(__dirname + '/static/html/index.html');
})

app.get("/game/:game_id", function(req, res) {
    // Проверяем, есть ли места в игре
    let game = global.tictactoe.findGameById(req.params.game_id)

    if (game == "Game not found") {
        return res.status(400).send("Игра не найдена")
    }

    if (game.getPlayer1_uuid() != req.cookies.ttt_playerUUID && game.getPlayer2_uuid() != req.cookies.ttt_playerUUID && game.getPlayer2_ws() != "") {
        return res.status(400).send("Игра заполнена")
    }

    return res.sendFile(__dirname + '/static/html/game.html');
})

app.listen(3000, () => {
    console.log("Server has been started")
})