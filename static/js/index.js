function onLoad() {
    initialize_start_btn()
    initialize_join_btn()
    initialize_last_games()
}

window.addEventListener("load", onLoad)

function initialize_start_btn() {
    let start_btn = document.querySelector("#start_btn")
    start_btn.addEventListener("click", function() {
        window.location.replace("/create_game")
    })
}

function initialize_join_btn() {
    let join_btn = document.querySelector("#join_btn")
    let join_input = document.querySelector("#join_input")
    join_btn.addEventListener("click", function() {
        console.log("test")
        window.location.replace(`/game/${join_input.value}`)
    })
}

function initialize_last_games() {
    fetch(`/get_games`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(response => {
        response.reverse()

        let x_wins = 0
        let o_wins = 0
        let draws = 0

        let table_main = document.getElementById("table_main")

        for (let item of response) {
            switch (item.game_result) {
                case "Крестики":
                    x_wins += 1
                    break
                case "Нолики":
                    o_wins += 1
                    break
                case "Ничья":
                    draws += 1
                    break
            }

            let table_row = 
            `
            <tr>
                <td>${new Date(item.game_date).toISOString().slice(0, 19).replace('T', ' ')}</td>
                <td>${item.game_result}</td>
            </tr>
            `
            table_main.innerHTML += table_row
        }

        let x_wins_element = document.getElementById("x_wins")
        let o_wins_element = document.getElementById("o_wins")
        let draws_element = document.getElementById("draws")

        x_wins_element.innerHTML = `[${x_wins}]`
        o_wins_element.innerHTML = `[${o_wins}]`
        draws_element.innerHTML = `[${draws}]`
    })
}