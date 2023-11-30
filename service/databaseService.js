import pool from "../config/database.js"

// Функция для получения информации о всех сыгранных играх
export async function getGames(res) {
    let sqlCommand = "SELECT * FROM game_results";
    const results = await pool.execute(sqlCommand)
    return res.json(results[0])
}

// Функция сохранения результата игры
export function saveGame(game_winner) {
    let sqlCommand = `INSERT INTO game_results SET game_result = ${pool.escape(game_winner)}`;
    pool.execute(sqlCommand)
}