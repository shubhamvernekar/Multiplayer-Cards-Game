const express = require("express");
const app = express();
const { Game } = require("./game");
const gameObj = new Game();

const GAME_SERVER_URL = "ws://localhost:3080/"

app.set("view engine", "ejs");

app.get('/', (req: any, res: any) => {
    res.render("../client/client", {
        gameUrl: GAME_SERVER_URL
    });
});

app.get('/join_game', (req: any, res: any) => {

});

app.listen(3000, () => {
    console.log("Server started at port 3000");
});