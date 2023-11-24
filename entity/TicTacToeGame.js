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

    clearField() {
        this.field = [[1,2,3], [4,5,6], [7,8,9]]
        this.turn = 0
    }

    //Входное значение X_0_0
    setFieldValue(value) {
        if (this.game_status != "X Turn" && this.game_status != "O Turn") {
            return "Game not started"
        }

        let splittedValue = value.split("_")

        if (splittedValue[0] != (this.game_status.split(" "))[0] && !isNaN(this.field[splittedValue[1]][splittedValue[2]])) {
            return "Server error"
        }

        this.field[splittedValue[1]][splittedValue[2]] = splittedValue[0]
        this.turn += 1
        this.game_status == "X Turn" ? this.game_status = "O Turn" : this.game_status = "X Turn"
        return [this.checkGameState(), value, splittedValue[0] == "X" ? "O" : "X"]
    }

    checkGameState() {
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

            this.game_status = "Finished"
            return x_count == o_count ? "O Win" : "X Win"
        }

        if (this.turn == 9) {
            this.game_status = "Finished"
            return "Draw"
        }

        return "Continue"
    }
}