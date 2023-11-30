import { Router } from "express";

import { getGames } from "./service/databaseService.js";
import { createGame } from "./service/tictactoeService.js";

// Создаем переменную, для определения путей
const router = Router()

// Путь для получения на главной странице инфомрации о сыгранных играх
router.get("/get_games", (req, res) => {
    getGames(res)
})

// Путь для создания нового лобби на два человека
router.get("/create_game", (req, res) => {
    createGame(req, res)
})

// Путь для установки ID игрока конкретной игры
router.post("/set_playerUUID/:player_UUID", (req, res) => {
    res.cookie("ttt_playerUUID", req.params.player_UUID, {httpOnly: true})
    return res.status(200).send()
})

export default router