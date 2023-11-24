import { Router } from "express";

import { createGame } from "./service/tictactoeService.js";

const router = Router()

router.get("/create_game", (req, res) => {
    createGame(req, res)
})

router.post("/set_playerUUID/:player_UUID", (req, res) => {
    res.cookie("ttt_playerUUID", req.params.player_UUID, {httpOnly: true})
    return res.status(200).send()
})

export default router