const express = require('express');
const mysql = require('mysql');

const routes = require('./routes')
const config = require('./config.json')
const cors = require('cors');


const app = express();
app.use(cors({
    origin: '*'
}));


app.get('/players2020', routes.players2020)
app.get('/search2020', routes.search2020) //have to update to games, not select from players_info

//===================Yuxuan's Routes===================
app.get('/random_player', routes.random_player)

//====================Team Specific======================
//===================Daniel's Routes===================
app.get('/background', routes.background)
app.get('/schedule', routes.schedule)
app.get('/roster', routes.roster)
app.get('/o_stats', routes.o_stats)
app.get('/ranking', routes.ranking)

app.get('/rivals', routes.rivals)
app.get('/current', routes.currentPlayer)

//====================Haoxiang's Routes=================================


app.get('/game_deteil', routes.game_deteil)
app.get('/match', routes.match)
app.get('/search/matches', routes.search_matches)

// Route 8
app.get('/collegesummary', routes.college_summary);







app.listen(config.server_port, () => {
    console.log(`Server running at http://${config.server_host}:${config.server_port}/`);
});

module.exports = app;
