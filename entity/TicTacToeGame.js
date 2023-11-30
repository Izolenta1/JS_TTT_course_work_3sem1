import { saveGame } from "../service/databaseService.js"

export class TicTacToeGame {
    game_id = ""
    player1_ws = ""
    player1_uuid = ""
    player2_ws = ""
    player2_uuid = ""
    turn = 0
    field = [[1,2,3], [4,5,6], [7,8,9]]
    game_status = "Waiting Second Player"

    constructor(game_id) {
        this.game_id = game_id
    }

    getGameID() {
        return this.game_id
    }

    getPlayer1_ws() {
        return this.player1_ws
    }

    getPlayer2_ws() {
        return this.player2_ws
    }

    setPlayer1_ws(ws) {
        this.player1_ws = ws
    }

    setPlayer2_ws(ws) {
        this.player2_ws = ws
    }

    getPlayer1_uuid() {
        return this.player1_uuid
    }

    getPlayer2_uuid() {
        return this.player2_uuid
    }

    setPlayer1_uuid(uuid) {
        this.player1_uuid = uuid
    }

    setPlayer2_uuid(uuid) {
        this.player2_uuid = uuid
    }

    getGameStatus() {
        return this.game_status
    }

    setGameStatus(status) {
        this.game_status = status
    }

    getGameField() {
        return this.field
    }

    // Метод очистки поля
    clearField() {
        this.field = [[1,2,3], [4,5,6], [7,8,9]]
        this.turn = 0
    }

    // Метод устанавливающи значение
    // Входное значение X_0_0 - информация о поле, что надо изменить
    setFieldValue(value) {
        // Проверка, в процессе ли игра
        if (this.game_status != "X Turn" && this.game_status != "O Turn") {
            return "Game not started"
        }

        let splittedValue = value.split("_")

        // Проверка разбитого входного значения
        if (splittedValue[0] != (this.game_status.split(" "))[0] && !isNaN(this.field[splittedValue[1]][splittedValue[2]])) {
            return "Server error"
        }

        // Изменения значения в матрице поля
        this.field[splittedValue[1]][splittedValue[2]] = splittedValue[0]
        // Прибавление хода. Необходимо для определения ничьи
        this.turn += 1
        // Изменение стороны, которой принадлежит следующий ход
        this.game_status == "X Turn" ? this.game_status = "O Turn" : this.game_status = "X Turn"
        // Возвращение массива, содержащего статуса игры, поставленного значения и следующей стороны
        return [this.checkGameState(), value, splittedValue[0] == "X" ? "O" : "X"]
    }

    // Метод проверки текущего поля на наличие победителя или ничьи
    // Вызывается автоматически в методе setFieldValue()
    checkGameState() {
        // Проверочный If, сравнивающий текущие поля
        // Если собран ряд или диагональ из 3-х одинаковых знаков - определяется победитель
        if ((this.field[0][0] == this.field[0][1] && this.field[0][1] == this.field[0][2]) ||
            (this.field[1][0] == this.field[1][1] && this.field[1][1] == this.field[1][2]) ||
            (this.field[2][0] == this.field[2][1] && this.field[2][1] == this.field[2][2]) ||
            (this.field[0][0] == this.field[1][0] && this.field[1][0] == this.field[2][0]) ||
            (this.field[0][1] == this.field[1][1] && this.field[1][1] == this.field[2][1]) ||
            (this.field[0][2] == this.field[1][2] && this.field[1][2] == this.field[2][2]) ||
            (this.field[0][0] == this.field[1][1] && this.field[1][1] == this.field[2][2]) ||
            (this.field[0][2] == this.field[1][1] && this.field[1][1] == this.field[2][0])) {

            let x_count = 0
            let o_count = 0

            // Подсчет установленных знаков
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.field[i][j] == "X") {
                        x_count += 1
                    }
                    if (this.field[i][j] == "O") {
                        o_count += 1
                    }
                }
            }

            // Изменение статуса игры на завершенный
            this.game_status = "Finished"
            // Сохранение в БД сторону победителя игры
            x_count == o_count ? saveGame("Нолики") : saveGame("Крестики")
            // Если крестиков равное количество с ноликами на момент окончания игры
            // это означает, что победили нолики, иначе - крестики
            return x_count == o_count ? "O Win" : "X Win"
        }

        // Если победитель не был определен до этого, проверяется текущее количество ходов
        // Если кол-во сделанных ходов равняется 9, свободных полей больше нет и объявляется ничья
        if (this.turn == 9) {
            this.game_status = "Finished"
            // Сохрание в БД результат игры
            saveGame("Ничья")
            return "Draw"
        }

        // Если ни одно из условий до этого момента не было выполнено - игра продолжается
        return "Continue"
    }
}