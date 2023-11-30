export class TicTacToe {
    // Единый массив всех игр
    game_list = []

    // Метод добавления игры
    addGame(game) {
        this.game_list.push(game)
    }

    // Метод удаления игры по ID
    deleteGameById(id) {
        let game_index = this.game_list.findIndex((element) => element.getGameID() == id)
        if (game_index === -1) {
            return "Game not found"
        }

        this.sessionsList.splice(game_index, 1)
    }

    // Метод поиска игры по ID
    findGameById(id) {
        let game_index = this.game_list.findIndex((element) => element.getGameID() == id)
        if (game_index === -1) {
            return "Game not found"
        }

        return this.game_list[game_index]
    }
}