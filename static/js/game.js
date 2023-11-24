function onLoad() {
    initializeGameCode()
    initializeFields()
    initializeStartBTN()
}

window.addEventListener("load", onLoad)

let ws = new WebSocket(`ws://localhost:8001/?gameID=${(location.pathname.split("/"))[2]}`)
ws.addEventListener('message', (event) => {
    let message = JSON.parse(event.data)
    switch (message.action) {
        case "DEFINE_X":
            initializeX(message.playerUUID, message.gameStatus, message.gameField)
            break
        case "DEFINE_O":
            initializeO(message.playerUUID, message.gameStatus, message.gameField)
            break
        case "GAME_FULL":
            gameFull()
            break
        case "SECOND_PLAYER_JOINED":
            secondPlayerJoined(message.fieldInfo)
            break
        case "GAME_STARTED":
            initializeStart()
            break
        case "UPDATE_CLIENT_FIELD":
            updateClientField(message.fieldInfo, message.nextTurn)
            break
        case "FINISH_GAME":
            finishGame(message.winner, message.fieldInfo)
            break
    }
    console.log(message)
});

function initializeGameCode() {
    let game_code = document.getElementById("game_code")
    game_code.innerHTML = (location.pathname.split("/"))[2]
}

let currentRole = ""
let gameID = (location.pathname.split("/"))[2]

function activateBoxesOnLoad(nextTurn) {
    if (nextTurn == currentRole) {
        let fields = document.getElementsByName("ttt_box")
        for (let item of fields) {
            if (item.checked != true) {
                item.classList.replace("ttt_box_inactive", "ttt_box")
            }
        }
    }
}

function initializeX(playerUUID, gameStatus, gameField) {
    let role_obj = document.getElementById("role")
    role_obj.innerHTML = "Крестик"
    currentRole = "X"

    fetch(`/set_playerUUID/${playerUUID}`, {
        method: "POST",
        credentials: 'include'
    })

    for (let item of gameField) {
        let splittedFieldInfo = item.split("_")
        let ttt_box = document.getElementById(`${splittedFieldInfo[1]}_${splittedFieldInfo[2]}`)
        ttt_box.innerHTML = splittedFieldInfo[0]
        ttt_box.checked = true
        ttt_box.classList.replace("ttt_box", "ttt_box_inactive")
    }

    let game_status = document.getElementById("game_status")
    let start_game_btn = document.getElementById("start_game_btn")
    switch (gameStatus) {
        case "Waiting Second Player":
            game_status.innerHTML = "Ожидание оппонента"
            start_game_btn.disabled = true
            start_game_btn.classList.remove("start_game_btn_hover")
            break
        case "Waiting to Start":
            game_status.innerHTML = "Ожидание старта"
            start_game_btn.disabled = false
            start_game_btn.classList.add("start_game_btn_hover")
            break
        case "X Turn":
            activateBoxesOnLoad("X")
            game_status.innerHTML = "Ход крестиков"
            start_game_btn.disabled = true
            start_game_btn.classList.remove("start_game_btn_hover")
            break
        case "O Turn":
            activateBoxesOnLoad("O")
            game_status.innerHTML = "Ход ноликов"
            start_game_btn.disabled = true
            start_game_btn.classList.remove("start_game_btn_hover")
            break
        case "Finished":
            game_status.innerHTML = "Игра завершена"
            start_game_btn.disabled = false
            start_game_btn.classList.add("start_game_btn_hover")
            start_game_btn.innerHTML = "Перезапустить"
            break
    }
}

function initializeO(playerUUID, gameStatus, gameField) {
    let role_obj = document.getElementById("role")
    role_obj.innerHTML = "Нолик"
    currentRole = "O"

    fetch(`/set_playerUUID/${playerUUID}`, {
        method: "POST",
        credentials: 'include'
    })

    for (let item of gameField) {
        let splittedFieldInfo = item.split("_")
        let ttt_box = document.getElementById(`${splittedFieldInfo[1]}_${splittedFieldInfo[2]}`)
        ttt_box.innerHTML = splittedFieldInfo[0]
        ttt_box.checked = true
        ttt_box.classList.replace("ttt_box", "ttt_box_inactive")
    }

    let game_status = document.getElementById("game_status")
    let start_game_btn = document.getElementById("start_game_btn")
    switch (gameStatus) {
        case "Waiting Second Player":
            game_status.innerHTML = "Ожидание оппонента"
            start_game_btn.disabled = true
            start_game_btn.classList.remove("start_game_btn_hover")
            break
        case "Waiting to Start":
            game_status.innerHTML = "Ожидание старта"
            start_game_btn.disabled = false
            start_game_btn.classList.add("start_game_btn_hover")
            break
        case "X Turn":
            activateBoxesOnLoad("X")
            game_status.innerHTML = "Ход крестиков"
            start_game_btn.disabled = true
            start_game_btn.classList.remove("start_game_btn_hover")
            break
        case "O Turn":
            activateBoxesOnLoad("O")
            game_status.innerHTML = "Ход ноликов"
            start_game_btn.disabled = true
            start_game_btn.classList.remove("start_game_btn_hover")
            break
        case "Finished":
            game_status.innerHTML = "Игра завершена"
            start_game_btn.disabled = false
            start_game_btn.classList.add("start_game_btn_hover")
            start_game_btn.innerHTML = "Перезапустить"
            break
    }
}

function gameFull() {
    window.location.replace("/")
}

function initializeFields() {
    let fields = document.getElementsByName("ttt_box")
    for (let item of fields) {
        item.addEventListener("click", function() {
            //Отправляем сообщение
            let payload = {
                action: "SET_FIELD",
                fieldInfo: `${currentRole}_${item.id}`,
                gameID: gameID
            }
            ws.send(JSON.stringify(payload))
        })
    }
}

function secondPlayerJoined() {
    let game_status = document.getElementById("game_status")
    game_status.innerHTML = "Ожидание старта"

    let start_game_btn = document.getElementById("start_game_btn")
    start_game_btn.disabled = false
    start_game_btn.classList.add("start_game_btn_hover")
}

function initializeStartBTN() {
    let start_game_btn = document.getElementById("start_game_btn")

    if (currentRole != "X") {
        start_game_btn.classList.add("start_game_btn_hidden")
    }

    start_game_btn.addEventListener("click", function() {
        start_game_btn.disabled = true
        start_game_btn.classList.remove("start_game_btn_hover")
        //Отправляем сообщение
        let payload = {
            action: "START_GAME",
            gameID: gameID
        }
        ws.send(JSON.stringify(payload))
    })
}

function initializeStart() {
    let game_status = document.getElementById("game_status")
    game_status.innerHTML = "Ход крестиков"

    let fields = document.getElementsByName("ttt_box")
    if (currentRole == "X") {
        for (let item of fields) {
            item.classList.replace("ttt_box_inactive", "ttt_box")
        }
    }

    for (let item of fields) {
        item.innerHTML = ""
        item.checked = false
    }
}

function updateClientField(fieldInfo, nextTurn) {
    let splittedFieldInfo = fieldInfo.split("_")
    let game_status = document.getElementById("game_status")
    let ttt_box = document.getElementById(`${splittedFieldInfo[1]}_${splittedFieldInfo[2]}`)
    ttt_box.innerHTML = splittedFieldInfo[0]
    ttt_box.checked = true
    ttt_box.classList.replace("ttt_box", "ttt_box_inactive")

    if (currentRole == nextTurn) {
        let fields = document.getElementsByName("ttt_box")
        for (let item of fields) {
            if (item.checked != true) {
                item.classList.replace("ttt_box_inactive", "ttt_box")
            }
        }

        if (nextTurn == "O") {
            game_status.innerHTML = "Ход ноликов"
        }
        else {
            game_status.innerHTML = "Ход крестиков"
        }
    }
    else {
        let fields = document.getElementsByName("ttt_box")
        for (let item of fields) {
            if (item.checked != true) {
                item.classList.replace("ttt_box", "ttt_box_inactive")
            }
        }

        if (nextTurn == "O") {
            game_status.innerHTML = "Ход ноликов"
        }
        else {
            game_status.innerHTML = "Ход крестиков"
        }
    }
}

function finishGame(winner, fieldInfo) {
    let splittedFieldInfo = fieldInfo.split("_")
    let ttt_box = document.getElementById(`${splittedFieldInfo[1]}_${splittedFieldInfo[2]}`)
    ttt_box.innerHTML = splittedFieldInfo[0]
    ttt_box.checked = true
    ttt_box.classList.replace("ttt_box", "ttt_box_inactive")

    let game_status = document.getElementById("game_status")
    if (winner == "Draw") {
        game_status.innerHTML = "Конец игры. Ничья"
    }
    else {
        game_status.innerHTML = `Конец игры. Победа ${winner == "X" ? "крестиков" : "ноликов"}`
    }

    let fields = document.getElementsByName("ttt_box")
    for (let item of fields) {
        if (item.checked != true) {
            item.classList.replace("ttt_box", "ttt_box_inactive")
        }
    }

    let start_game_btn = document.getElementById("start_game_btn")
    start_game_btn.disabled = false
    start_game_btn.classList.add("start_game_btn_hover")
    start_game_btn.innerHTML = "Перезапустить"
}