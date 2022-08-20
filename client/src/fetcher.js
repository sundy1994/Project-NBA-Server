import config from './config.json'

// *******************************************************
//               Home Page fetch Yuxuan's Query
// *******************************************************
const getPlayers = async (Name, Position, SalaryLow, SalaryHigh) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/random_player?Name=${Name}&Position=${Position}&SalaryLow=${SalaryLow}&SalaryHigh=${SalaryHigh}`, {
        method: 'GET',
    })
    return res.json()
}

// *******************************************************
//               Team Page fetch Daniel's Query
// *******************************************************

const getRoster = async (team) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/roster/?Team=${team}`, {
        method: 'GET',
    })
    return res.json()
    
}

const getStats = async (team) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/o_stats/?Team=${team}`, {
        method: 'GET',
    })
    return res.json()
}

const getSchedule = async (team, home, away) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/schedule/?Team=${team}&home=${home}&away=${away}`, {
        method: 'GET',
    })
    return res.json()
}

const getBackground = async (team) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/background/?Team=${team}`, {
        method: 'GET',
    })
    return res.json()
}

const getRanking = async (season, conference, team) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/ranking/?Season=${season}&Conference=${conference}&Team=${team}`, {
        method: 'GET',
    })
    return res.json()
}

const getRivals= async (playerid) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/rivals/?Playerid=${playerid}`, {
        method: 'GET',
    })
    return res.json()
}

const getCurrent = async (currentid) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/current/?Currentid=${currentid}`, {
        method: 'GET',
    })
    return res.json()
}

// *******************************************************

// *******************************************************
//               Player Page fetch Oliver's Query
// *******************************************************
const getPlayer = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/player?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getAllPlayers = async (page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/players2020?page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}


const getCollegeSummary = async () => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/collegesummary`, {
        method: 'GET',
    })
    return res.json()
}



// *******************************************************




// *******************************************************
//               Game Page fetch Haoxiang's Query
// *******************************************************


const getMatch = async (id,homeplayer) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/game_deteil?id=${id}&home=${homeplayer}`, {
        method: 'GET',
    })
    return res.json()
}

const getMatchCard = async (id) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/match?id=${id}`, {
        method: 'GET',
    })
    return res.json()
}

const getMatchSearch = async (home, away, year, month, date, season, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/matches?Home=${home}&Away=${away}&Year=${year}&Month=${month}&Date=${date}&Season=${season}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

const getPlayerSearch = async (name, nationality, club, rating_high, rating_low, pot_high, pot_low, page, pagesize) => {
    var res = await fetch(`http://${config.server_host}:${config.server_port}/search/players?Name=${name}&Nationality=${nationality}&Club=${club}&RatingLow=${rating_low}&RatingHigh=${rating_high}&PotentialHigh=${pot_high}&PotentialLow=${pot_low}&page=${page}&pagesize=${pagesize}`, {
        method: 'GET',
    })
    return res.json()
}

export {
    getPlayers,

    getRoster,
    getStats,
    getSchedule,
    getBackground,
    getRanking,
    getRivals,
    getCurrent, 

    getMatch,
    getMatchCard,
    getMatchSearch,
    getPlayerSearch,

    getCollegeSummary,
    getAllPlayers,
    getPlayer,
}
    
