function onLoad() {
    initialize_start_btn()
    initialize_join_btn()
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