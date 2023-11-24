export class TicTacToe {
    game_list = []

    addGame(game) {
        this.game_list.push(game)
    }

    deleteGameById(id) {
        let game_index = this.game_list.findIndex((element) => element.getGameID() == id)
        if (game_index === -1) {
            return "Game not found"
        }

        this.sessionsList.splice(game_index, 1)
    }

    findGameById(id) {
        let game_index = this.game_list.findIndex((element) => element.getGameID() == id)
        if (game_index === -1) {
            return "Game not found"
        }

        return this.game_list[game_index]
    }
}