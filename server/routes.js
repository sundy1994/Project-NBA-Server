const config = require('./config.json')
const mysql = require('mysql');
const e = require('express');

const connection = mysql.createConnection({
    host: config.rds_host,
    user: config.rds_user,
    password: config.rds_password,
    port: config.rds_port,
    database: config.rds_db
});
connection.connect();

// ********************************************
//            Yuxuan Zhang - Main Page
// ********************************************

async function random_player(req, res) {
    // Randomly display 5 players' basic stats on main page
    const name = req.query.Name ? req.query.Name : '';
    const position = req.query.Position ? req.query.Position : '';
    var SalaryLow = req.query.SalaryLow ? req.query.SalaryLow : 0
    var SalaryHigh = req.query.SalaryHigh ? req.query.SalaryHigh : 46000000
    connection.query(`
        SELECT NAME, PLAYER_ID, POSITION, TEAM, PTS AS POINTS, REB AS REBOUND, AST AS ASSIST, ST AS STEAL, BLK AS BLOCK, Salary
        FROM player_info
        WHERE Name LIKE '%${name}%' AND POSITION LIKE '%${position}%' 
        AND Salary >= ${SalaryLow} AND Salary <= ${SalaryHigh}
        ORDER BY NAME`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    })
}

// ********************************************
//                  Daniel's routes
// ********************************************


async function players2020(req, res) {

    let team = req.query.Team ? req.query.Team : "";

    if (req.query.page && !isNaN(req.query.page)) {
        if (req.query.pagesize && !isNaN(req.query.pagesize)) {

            let page = req.query.page;
            const pageSize = req.query.pagesize;

            let offset;

            if (page == 1) {
                offset = 0;
            } else {
                offset = ((page - 1) * pageSize);
            }

            connection.query(`SELECT PLAYER_ID, NAME, POSITION, TEAM,
                AGE, HEIGHT, WEIGHT, SALARY, GAMES_PLAYED,
                MIN, FG, FT, 3PT, PTS, REB, AST, ST, BLK, IMPACT_FG, IMPACT_FT
            FROM player_info
            ORDER BY NAME
            LIMIT ${pageSize} OFFSET ${offset}
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        } else {

            //path if pagesize is not provided
            const TenSize = 10;
            let page = req.query.page;

            let offset;

            //unspecified pageSize
            if (page == 1) {
                offset = 0;
            } else {
                offset = ((page - 1) * TenSize);
            }

            connection.query(`SELECT PLAYER_ID, NAME, POSITION, TEAM,
                AGE, HEIGHT, WEIGHT, SALARY, GAMES_PLAYED,
                MIN, FG, FT, 3PT, PTS, REB, AST, ST, BLK, IMPACT_FG, IMPACT_FT
            FROM player_info
            ORDER BY NAME
            LIMIT ${TenSize} OFFSET ${offset}`, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
    } else {
        connection.query(`SELECT PLAYER_ID, NAME, POSITION, TEAM,
            AGE, HEIGHT, WEIGHT, SALARY, GAMES_PLAYED,
            MIN, FG, FT, 3PT, PTS, REB, AST, ST, BLK, IMPACT_FG, IMPACT_FT
        FROM player_info
        ORDER BY NAME`, function (error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}


async function search2020(req, res) {
    let name = req.query.Name ? req.query.Name : "";
    let team = req.query.Team ? req.query.Team : "";
    let position = req.query.Position ? req.query.Position : "";

    let ftl = req.query.FtLOW ? req.query.FtLOW : 0;
    let fth = req.query.FtHIGH ? req.query.FtHIGH : 1;
    let threeL = req.query.threeLOW ? req.query.threeLOW : 0;
    let threeH = req.query.threeHIGH ? req.query.threeHIGH : 1;
    let fgl = req.query.FgLOW ? req.query.FgLOW : 0;
    let fgh = req.query.FgHIGH ? req.query.FgHIGH : 1;

    if (req.query.page && !isNaN(req.query.page)) {

        if (req.query.pagesize && !isNaN(req.query.pagesize)) {

            let page = req.query.page;
            let pageSize = req.query.pagesize;

                let offset;

                if (page == 1) {
                    offset = 0;
                } else {
                    offset = ((page - 1) * pageSize);
                }

                connection.query(`SELECT PLAYER_ID, NAME, POSITION, TEAM,
                    AGE, SALARY, MIN, FG, FT, 3PT, PTS, REB, AST, ST, BLK, IMPACT_FG, IMPACT_FT
                FROM player_info
                WHERE Name LIKE '%${name}%' AND POSITION LIKE '%${position}%'
                    AND TEAM LIKE '%${team}%' AND FT >= ${ftl} AND FT <= ${fth} 
                        AND 3PT >= ${threeL} AND 3PT <= ${threeH}
                             AND FG >= ${fgl} AND FG <= ${fgh} 
                ORDER BY NAME
                LIMIT ${pageSize} OFFSET ${offset}`, function (error, results, fields) {

                        if (error) {
                            console.log(error)
                            res.json({ error: error })
                        } else if (results) {
                            res.json({ results: results })
                    }
                });

        } else {

                //if pagesize is not provided
                const tenSize = 10;
                let page = req.query.page;

                let offset;

                if (page == 1) {
                    offset = 0;
                } else {
                    offset = ((page - 1) * tenSize);
                }

                connection.query(`SELECT PLAYER_ID, NAME, POSITION, TEAM,
                    AGE, SALARY, MIN, FG, FT, 3PT, PTS, REB, AST, ST, BLK, IMPACT_FG, IMPACT_FT
                FROM player_info
                WHERE Name LIKE '%${name}%' AND POSITION LIKE '%${position}%'
                    AND TEAM LIKE '%${team}%' AND FT >= ${ftl} AND FT <= ${fth}
                         AND 3PT >= ${threeL} AND 3PT <= ${threeH}
                            AND FG >= ${fgl} AND FG <= ${fgh} 
                ORDER BY NAME
                LIMIT ${tenSize} OFFSET ${offset}`, function (error, results, fields) {

                        if (error) {
                            console.log(error)
                            res.json({ error: error })
                        } else if (results) {
                            res.json({ results: results })
                    }
                });
        }
    } else {
        //show all
        connection.query(`SELECT PLAYER_ID, NAME, POSITION, TEAM,
             AGE, SALARY, MIN, FG, FT, 3PT, PTS, REB, AST, ST, BLK, IMPACT_FG, IMPACT_FT
        FROM player_info
        WHERE Name LIKE '%${name}%' AND POSITION LIKE '%${position}%'
            AND TEAM LIKE '%${team}%' AND FT >= ${ftl} AND FT <= ${fth} 
                AND 3PT >= ${threeL} AND 3PT <= ${threeH}
                    AND FG >= ${fgl} AND FG <= ${fgh} 
        ORDER BY NAME`, function (error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
            }
        });
    }
}

// ********************************************
//               Team specific Queries - Daniel Xu 
// ********************************************

async function background(req, res) {
    let team = req.query.Team ? req.query.Team : "Lakers";

    if (req.query.Team) {
        connection.query(`
            SELECT YEAR_FOUNDED as YEAR, CITY, ARENA, 
                LEAGUE_AFFIL as GLEAGUE, OWNER, 
                GENERAL_MANAGER, HEAD_COACH
            FROM teams
            WHERE NAME LIKE '%${team}%';
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    } else {
        connection.query(`
        SELECT YEAR_FOUNDED as YEAR, CITY, ARENA, 
            LEAGUE_AFFIL as GLEAGUE, OWNER, 
            GENERAL_MANAGER, HEAD_COACH
        FROM teams
        WHERE NAME LIKE '%${team}%';
        `, function(error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }        
}

async function schedule(req, res) {

    let team = req.query.Team ? req.query.Team : "Lakers";
    let season = req.query.Season ? req.query.Season : 2020;
    let home = req.query.home ? req.query.home : "";
    let away = req.query.away? req.query.away : "";


    if (req.query.Team) {
        connection.query(`
            WITH HOME AS (
                SELECT g.HOME_TEAM_ID, t.NAME as HOME, g.AWAY_TEAM_ID, GAME_DATE_EST, g.PTS_HOME, g.PTS_AWAY
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.HOME_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            
            HOMEAWAY AS (
                SELECT h.HOME_TEAM_ID, h.HOME, h.AWAY_TEAM_ID, t.NAME, h.GAME_DATE_EST, h.PTS_HOME, h.PTS_AWAY
                FROM teams t left outer join HOME h on t.TEAM_ID = h.AWAY_TEAM_ID
            ),
            AWAY AS (
                SELECT g.HOME_TEAM_ID, g.AWAY_TEAM_ID,  t.NAME as AWAY, GAME_DATE_EST, g.PTS_HOME, g.PTS_AWAY
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.AWAY_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            
            AWAYHOME AS (
                SELECT a.HOME_TEAM_ID, t.NAME, a.AWAY_TEAM_ID, a.AWAY, a.GAME_DATE_EST, a.PTS_HOME, a.PTS_AWAY
                FROM teams t left outer join AWAY a on t.TEAM_ID = a.HOME_TEAM_ID
            ),
            COMBINE AS (
                SELECT * FROM HOMEAWAY
                UNION
                SELECT  * FROM AWAYHOME)
            SELECT * FROM COMBINE
            WHERE HOME_TEAM_ID IS NOT NULL
            AND HOME LIKE '%${home}%'
            AND NAME LIKE '%${away}%'
            ORDER BY GAME_DATE_EST;
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    } else {
        connection.query(`
            WITH HOME AS (
                SELECT g.HOME_TEAM_ID, t.NAME as HOME, g.AWAY_TEAM_ID, GAME_DATE_EST, g.PTS_HOME, g.PTS_AWAY
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.HOME_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            
            HOMEAWAY AS (
                SELECT h.HOME_TEAM_ID, h.HOME, h.AWAY_TEAM_ID, t.NAME, h.GAME_DATE_EST, h.PTS_HOME, h.PTS_AWAY
                FROM teams t left outer join HOME h on t.TEAM_ID = h.AWAY_TEAM_ID
            ),
            AWAY AS (
                SELECT g.HOME_TEAM_ID, g.AWAY_TEAM_ID,  t.NAME as AWAY, GAME_DATE_EST, g.PTS_HOME, g.PTS_AWAY
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.AWAY_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            
            AWAYHOME AS (
                SELECT a.HOME_TEAM_ID, t.NAME, a.AWAY_TEAM_ID, a.AWAY, a.GAME_DATE_EST, a.PTS_HOME, a.PTS_AWAY
                FROM teams t left outer join AWAY a on t.TEAM_ID = a.HOME_TEAM_ID
            ),
            COMBINE AS (
                SELECT * FROM HOMEAWAY
                UNION
                SELECT  * FROM AWAYHOME)
            SELECT * FROM COMBINE
            WHERE HOME_TEAM_ID IS NOT NULL
                AND HOME LIKE '%${home}%'
                AND NAME LIKE '%${away}%'
            ORDER BY GAME_DATE_EST;
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    }       
}

async function roster(req, res) {

    let team = req.query.Team ? req.query.Team : "Lakers";

    if (req.query.Team) {
        connection.query(`
            SELECT PLAYER_ID, NAME, POSITION, 
                HEIGHT, WEIGHT, AGE, COLLEGE,
                FG, FT, 3PT AS threePT
            FROM player_info
            WHERE TEAM LIKE '%${team}%'
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    } else {
        connection.query(`
            SELECT PLAYER_ID, NAME, POSITION, 
                HEIGHT, WEIGHT, AGE, COLLEGE,
                FG, FT, 3PT AS threePT
            FROM player_info
            WHERE TEAM LIKE '%${team}%'
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    }         
}

async function o_stats(req, res) {

    let team = req.query.Team ? req.query.Team : "Lakers";
    let season = req.query.Season ? req.query.Season : 2020;
    if (req.query.Team) {
        connection.query(`
            WITH HOME AS (
                SELECT g.HOME_TEAM_ID, t.NAME, 0 as ROAD, GAME_DATE_EST,
            
                    g.PTS_HOME as PTS, g.FT_PCT_HOME as FT, g.FG3_PCT_HOME as 3FG, AST_HOME as AST,
                    REB_HOME as REB, PTS_HOME as THISTEAM, PTS_AWAY as OTHERTEAM
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.HOME_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            
            AWAY AS (
                SELECT g.AWAY_TEAM_ID, t.NAME, 1 as ROAD, GAME_DATE_EST,
            
                    g.PTS_AWAY as PTS, g.FT_PCT_AWAY as FT, g.FG3_PCT_AWAY as 3FG, AST_AWAY as AST,
                    REB_AWAY as REB, PTS_AWAY AS THISTEAM, PTS_HOME AS OTHERTEAM
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.AWAY_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            
            COMBINE AS (
                SELECT * FROM HOME
                UNION
                SELECT  * FROM AWAY)
            
            SELECT HOME_TEAM_ID, NAME, avg(PTS) as PTS, avg(FT) as FT,
                avg(3FG) as 3FG, avg(AST) as AST, avg(REB) as REB
            FROM COMBINE
            GROUP BY HOME_TEAM_ID, NAME
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    } else {
        connection.query(`
            WITH HOME AS (
                SELECT g.HOME_TEAM_ID, t.NAME, 0 as ROAD, GAME_DATE_EST,
            
                    g.PTS_HOME as PTS, g.FT_PCT_HOME as FT, g.FG3_PCT_HOME as 3FG, AST_HOME as AST,
                    REB_HOME as REB, PTS_HOME as THISTEAM, PTS_AWAY as OTHERTEAM
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.HOME_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            
            AWAY AS (
                SELECT g.AWAY_TEAM_ID, t.NAME, 1 as ROAD, GAME_DATE_EST,
            
                    g.PTS_AWAY as PTS, g.FT_PCT_AWAY as FT, g.FG3_PCT_AWAY as 3FG, AST_AWAY as AST,
                    REB_AWAY as REB, PTS_AWAY AS THISTEAM, PTS_HOME AS OTHERTEAM
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.AWAY_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            
            COMBINE AS (
                SELECT * FROM HOME
                UNION
                SELECT  * FROM AWAY)
            
            SELECT HOME_TEAM_ID, NAME, avg(PTS) as PTS, avg(FT) as FT,
                avg(3FG) as 3FG, avg(AST) as AST, avg(REB) as REB
            FROM COMBINE
            GROUP BY HOME_TEAM_ID, NAME
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    }      
}

async function ranking(req, res) {

    let conf = req.query.Conference ? req.query.Conference : "";
    let Season = req.query.Season ? req.query.Season : 2020;
    let Team = req.query.Team ? req.query.Team : "";

    if (req.query.Conference) {
        connection.query(`
            SELECT r.TEAM_ID, t.NAME, t.ABBREVIATION, r.CONFERENCE, r.WIN, r.LOSE, r.W_PCT
            FROM teams t, ranking r
            WHERE t.TEAM_ID = r.TEAM_ID AND r.SEASON = ${Season}
                AND CONFERENCE LIKE '%${conf}%' AND t.NAME LIKE '%${Team}%' 
            ORDER BY W_PCT DESC
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    } else {
        connection.query(`
            SELECT r.TEAM_ID, t.NAME, t.ABBREVIATION, r.CONFERENCE, r.WIN, r.LOSE, r.W_PCT
            FROM teams t, ranking r
            WHERE t.TEAM_ID = r.TEAM_ID AND r.SEASON = ${Season}
                AND CONFERENCE LIKE '%${conf}%' AND t.NAME LIKE '%${Team}%' 
            ORDER BY W_PCT DESC
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    }      
}


async function rivals(req, res) {


    let player = req.query.Playerid ? req.query.Playerid : 2544;

    if (req.query.Player) {
        connection.query(`
        WITH GETPLAYER AS (
            SELECT player_info.PLAYER_ID, player_info.NAME, player_info.POSITION,
                player_info.TEAM
            FROM player_info
            WHERE player_info.PLAYER_ID = ${player}
        ),
    
        GETTEAM AS (
            SELECT p.player_id, p.NAME, p.POSITION, p.team, t.TEAM_ID
            FROM GETPLAYER p, teams t
            WHERE p.TEAM = t.NAME
        ),
    
        PLAYERSEASONGAMES AS (
            SELECT g.GAME_ID as GAME
            FROM games g, GETTEAM t
            WHERE (g.HOME_TEAM_ID = t.TEAM_ID OR g.AWAY_TEAM_ID = t.TEAM_ID) AND g.SEASON = 2020
        ),
    
        PLAYERAVG AS (
            SELECT c.PLAYER_ID, c.PLAYER_NAME, AVG(c.FG_PCT) AS FGP,
                    AVG(c.FG3_PCT) AS TFGP,
                    AVG(c.FT_PCT) AS FTP,
                    AVG(c.REB) AS REBP,
                    AVG(c.AST) AS ASTP,
                    AVG(c.PTS) AS PTSP
            FROM PLAYERSEASONGAMES p, Game_Details c
            WHERE p.GAME = c.GAME_ID AND c.PLAYER_ID = ${player}
            GROUP BY c.PLAYER_ID, c.PLAYER_NAME
        ),
    
        ALLGAMES AS (
            SELECT games.GAME_ID as GAME
            FROM games
            WHERE games.SEASON = 2020
        ),
    
        OTHERAVG AS (
            SELECT c.PLAYER_ID AS PLAYER, c.PLAYER_NAME AS NAME, AVG(c.FG_PCT) AS FG,
                    AVG(c.FG3_PCT) AS TFG,
                    AVG(c.FT_PCT) AS FT,
                    AVG(c.REB) AS REB,
                    AVG(c.AST) AS AST,
                    AVG(c.PTS) AS PTS
            FROM ALLGAMES a, Game_Details c
            WHERE a.GAME = c.GAME_ID AND PLAYER_ID <> ${player}
            GROUP BY PLAYER, NAME
        ),
    
        SIMILAR AS (
            SELECT o.player, name, fg, tfg, ft, reb, ast, pts
            FROM OTHERAVG o, PLAYERAVG p
            WHERE o.FG >= (p.FGP -.05) AND
                    o.TFG >= (p.TFGP -.05) AND
                    o.FT >= (p.FTP -.05) AND
                    o.REB >= p.REBP AND
                    o.PTS >= (p.PTSP)
            LIMIT 3
        )
        SELECT * FROM SIMILAR;
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    } else {
        connection.query(`
            WITH GETPLAYER AS (
                SELECT player_info.PLAYER_ID, player_info.NAME, player_info.POSITION,
                    player_info.TEAM
                FROM player_info
                WHERE player_info.PLAYER_ID = ${player}
            ),
        
            GETTEAM AS (
                SELECT p.player_id, p.NAME, p.POSITION, p.team, t.TEAM_ID
                FROM GETPLAYER p, teams t
                WHERE p.TEAM = t.NAME
            ),
        
            PLAYERSEASONGAMES AS (
                SELECT g.GAME_ID as GAME
                FROM games g, GETTEAM t
                WHERE (g.HOME_TEAM_ID = t.TEAM_ID OR g.AWAY_TEAM_ID = t.TEAM_ID) AND g.SEASON = 2020
            ),
        
            PLAYERAVG AS (
                SELECT c.PLAYER_ID, c.PLAYER_NAME, AVG(c.FG_PCT) AS FGP,
                        AVG(c.FG3_PCT) AS TFGP,
                        AVG(c.FT_PCT) AS FTP,
                        AVG(c.REB) AS REBP,
                        AVG(c.AST) AS ASTP,
                        AVG(c.PTS) AS PTSP
                FROM PLAYERSEASONGAMES p, Game_Details c
                WHERE p.GAME = c.GAME_ID AND c.PLAYER_ID = ${player}
                GROUP BY c.PLAYER_ID, c.PLAYER_NAME
            ),
        
            ALLGAMES AS (
                SELECT games.GAME_ID as GAME
                FROM games
                WHERE games.SEASON = 2020
            ),
        
            OTHERAVG AS (
                SELECT c.PLAYER_ID AS PLAYER, c.PLAYER_NAME AS NAME, AVG(c.FG_PCT) AS FG,
                        AVG(c.FG3_PCT) AS TFG,
                        AVG(c.FT_PCT) AS FT,
                        AVG(c.REB) AS REB,
                        AVG(c.AST) AS AST,
                        AVG(c.PTS) AS PTS
                FROM ALLGAMES a, Game_Details c
                WHERE a.GAME = c.GAME_ID AND PLAYER_ID <> ${player}
                GROUP BY PLAYER, NAME
            ),
        
            SIMILAR AS (
                SELECT o.player, name, fg, tfg, ft, reb, ast, pts
                FROM OTHERAVG o, PLAYERAVG p
                WHERE o.FG >= (p.FGP -.05) AND
                        o.TFG >= (p.TFGP -.05) AND
                        o.FT >= (p.FTP -.05) AND
                        o.REB >= p.REBP AND
                        o.PTS >= (p.PTSP)
                LIMIT 3
            )
            SELECT * FROM SIMILAR;
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    }      
}

async function currentPlayer(req, res) {


    let player = req.query.Currentid ? req.query.Currentid : 2544;

    if (req.query.Currentid) {
        connection.query(`
        WITH GETPLAYER AS (
            SELECT player_info.PLAYER_ID, player_info.NAME, player_info.POSITION,
                player_info.TEAM
            FROM player_info
            WHERE player_info.PLAYER_ID = ${player}
        ),
    
        GETTEAM AS (
            SELECT p.player_id, p.NAME, p.POSITION, p.team, t.TEAM_ID
            FROM GETPLAYER p, teams t
            WHERE p.TEAM = t.NAME
        ),
    
        PLAYERSEASONGAMES AS (
            SELECT g.GAME_ID as GAME
            FROM games g, GETTEAM t
            WHERE (g.HOME_TEAM_ID = t.TEAM_ID OR g.AWAY_TEAM_ID = t.TEAM_ID) AND g.SEASON = 2020
        ),
    
        PLAYERAVG AS (
            SELECT c.PLAYER_ID, c.PLAYER_NAME, AVG(c.FG_PCT) AS FGP,
                    AVG(c.FG3_PCT) AS TFGP,
                    AVG(c.FT_PCT) AS FTP,
                    AVG(c.REB) AS REBP,
                    AVG(c.AST) AS ASTP,
                    AVG(c.PTS) AS PTSP
            FROM PLAYERSEASONGAMES p, Game_Details c
            WHERE p.GAME = c.GAME_ID AND c.PLAYER_ID = ${player}
            GROUP BY c.PLAYER_ID, c.PLAYER_NAME
        )
    
        SELECT * FROM PLAYERAVG;
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    } else {
        connection.query(`
            WITH GETPLAYER AS (
                SELECT player_info.PLAYER_ID, player_info.NAME, player_info.POSITION,
                    player_info.TEAM
                FROM player_info
                WHERE player_info.PLAYER_ID = ${player}
            ),
        
            GETTEAM AS (
                SELECT p.player_id, p.NAME, p.POSITION, p.team, t.TEAM_ID
                FROM GETPLAYER p, teams t
                WHERE p.TEAM = t.NAME
            ),
        
            PLAYERSEASONGAMES AS (
                SELECT g.GAME_ID as GAME
                FROM games g, GETTEAM t
                WHERE (g.HOME_TEAM_ID = t.TEAM_ID OR g.AWAY_TEAM_ID = t.TEAM_ID) AND g.SEASON = 2020
            ),
        
            PLAYERAVG AS (
                SELECT c.PLAYER_ID, c.PLAYER_NAME, AVG(c.FG_PCT) AS FGP,
                        AVG(c.FG3_PCT) AS TFGP,
                        AVG(c.FT_PCT) AS FTP,
                        AVG(c.REB) AS REBP,
                        AVG(c.AST) AS ASTP,
                        AVG(c.PTS) AS PTSP
                FROM PLAYERSEASONGAMES p, Game_Details c
                WHERE p.GAME = c.GAME_ID AND c.PLAYER_ID = ${player}
                GROUP BY c.PLAYER_ID, c.PLAYER_NAME
            )
        
            SELECT * FROM PLAYERAVG;
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
    }      
}




// ********************************************
//               Haoxiang ROUTES
// ********************************************


// Route 1 (box score complex query)
async function game_deteil(req, res) {
    // TOD
    const homeplayer = req.query.home ? req.query.home : 'home';
    console.log();
    console.log(req.query.id);
    if (req.query.id && !isNaN(req.query.id)) {
        if (homeplayer.localeCompare('home')==0){
            let id = req.query.id;
            connection.query(`SELECT d.PLAYER_NAME, d.START_POSITION, d.MIN, d.FGM, d.FGA, d.FG_PCT, d.FT_PCT,d.OREB,d.DREB,d.REB,d.AST,d.STL,d.BLK,d.PF,d.PTS,
            d.PLUS_MINUS
            FROM Game_Details d join games g ON g.HOME_TEAM_ID = d.TEAM_ID AND g.GAME_ID = d.GAME_ID
            WHERE g.GAME_ID = ${id}
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
        else {
            let id = req.query.id;
            connection.query(`SELECT d.PLAYER_NAME, d.START_POSITION, d.MIN, d.FGM, d.FGA, d.FG_PCT, d.FT_PCT,d.OREB,d.DREB,d.REB,d.AST,d.STL,d.BLK,d.PF,d.PTS,
            d.PLUS_MINUS
            FROM Game_Details d join games g ON g.AWAY_TEAM_ID = d.TEAM_ID AND g.GAME_ID = d.GAME_ID
            WHERE g.GAME_ID = ${id} 
            `, function(error, results, fields) {

                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        
        }
    }
}

const college_summary = async (req, res) => {    
        if (req.query.page && !isNaN(req.query.page)) {
            if (req.query.pagesize && !isNaN(req.query.pagesize)) {
    
                let page = req.query.page;
                const pageSize = req.query.pagesize;
    
                let offset;
    
                if (page == 1) {
                    offset = 0;
                } else {
                    offset = ((page - 1) * pageSize);
                }
    
                connection.query(`
                WITH cte_colleges AS (
                    SELECT DISTINCT COLLEGE AS PLAYER_COLLEGE, NAME,
                                    MAX(AGE) - MIN(AGE) + 1 AS PLAYER_TENURE
                    FROM player_info_2 p
                    WHERE COLLEGE NOT LIKE '%NONE%'
                    GROUP BY NAME
                ),
                
                      cte_rank AS (
                          SELECT p.PLAYER_COLLEGE,
                                 p.NAME,
                                 p.PLAYER_TENURE,
                                 TEAM_ABBREVIATION,
                                 SEASON,
                                 CONFERENCE,
                                 NUM_GAME,
                                 WIN,
                                 LOSE,
                                 g.GAME_ID
                          FROM cte_colleges p
                                   JOIN Game_Details g
                                        ON p.NAME = g.PLAYER_NAME
                                   JOIN ranking r
                                        ON r.TEAM_ID = g.TEAM_ID
                          WHERE SEASON = 2019
                )
                
                SELECT PLAYER_COLLEGE AS COLLEGE,
                       ROUND(AVG(PLAYER_TENURE)) AS average_career_tenure,
                       ROUND(AVG(WIN)) as average_wins_by_assoc,
                       ROUND(AVG(LOSE)) as average_losses_by_assoc
                FROM cte_rank
                GROUP BY COLLEGE
                LIMIT ${pageSize} OFFSET ${offset}
                `
                , function(error, results, fields) {
    
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                });
            } else {
    
                //path if pagesize is not provided
                const TenSize = 10;
                let page = req.query.page;
    
                let offset;
    
                //unspecified pageSize
                if (page == 1) {
                    offset = 0;
                } else {
                    offset = ((page - 1) * TenSize);
                }
    
                connection.query(`WITH cte_colleges AS (
                    SELECT DISTINCT COLLEGE AS PLAYER_COLLEGE, NAME,
                                    MAX(AGE) - MIN(AGE) + 1 AS PLAYER_TENURE
                    FROM player_info_2 p
                    WHERE COLLEGE NOT LIKE '%NONE%'
                    GROUP BY NAME
                ),
                
                      cte_rank AS (
                          SELECT p.PLAYER_COLLEGE,
                                 p.NAME,
                                 p.PLAYER_TENURE,
                                 TEAM_ABBREVIATION,
                                 SEASON,
                                 CONFERENCE,
                                 NUM_GAME,
                                 WIN,
                                 LOSE,
                                 g.GAME_ID
                          FROM cte_colleges p
                                   JOIN Game_Details g
                                        ON p.NAME = g.PLAYER_NAME
                                   JOIN ranking r
                                        ON r.TEAM_ID = g.TEAM_ID
                          WHERE SEASON = 2019
                )
                
                SELECT PLAYER_COLLEGE AS COLLEGE,
                       ROUND(AVG(PLAYER_TENURE)) AS average_career_tenure,
                       ROUND(AVG(WIN)) as average_wins_by_assoc,
                       ROUND(AVG(LOSE)) as average_losses_by_assoc
                FROM cte_rank
                GROUP BY COLLEGE`, function(error, results, fields) {
    
                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                });
            }
        } else {
            connection.query(`WITH cte_colleges AS (
                SELECT DISTINCT COLLEGE AS PLAYER_COLLEGE, NAME,
                                MAX(AGE) - MIN(AGE) + 1 AS PLAYER_TENURE
                FROM player_info_2 p
                WHERE COLLEGE NOT LIKE '%NONE%'
                GROUP BY NAME
            ),
            
                  cte_rank AS (
                      SELECT p.PLAYER_COLLEGE,
                             p.NAME,
                             p.PLAYER_TENURE,
                             TEAM_ABBREVIATION,
                             SEASON,
                             CONFERENCE,
                             NUM_GAME,
                             WIN,
                             LOSE,
                             g.GAME_ID
                      FROM cte_colleges p
                               JOIN Game_Details g
                                    ON p.NAME = g.PLAYER_NAME
                               JOIN ranking r
                                    ON r.TEAM_ID = g.TEAM_ID
                      WHERE SEASON = 2019
            )
            
            SELECT PLAYER_COLLEGE AS COLLEGE,
                   ROUND(AVG(PLAYER_TENURE)) AS average_career_tenure,
                   ROUND(AVG(WIN)) as average_wins_by_assoc,
                   ROUND(AVG(LOSE)) as average_losses_by_assoc
            FROM cte_rank
            GROUP BY COLLEGE;`, function (error, results, fields) {
    
                if (error) {
                    console.log(error)
                    res.json({ error: error })
                } else if (results) {
                    res.json({ results: results })
                }
            });
        }
}

// Maybe use this for matches
//route 2 game card
async function match(req, res) {
    if (req.query.id && !isNaN(req.query.id)) {
        let id = req.query.id;

        connection.query(`SELECT t1.NAME AS Home, t2.NAME AS Away, LEFT(g.GAME_DATE_EST,11) AS Date,
        g.HOME_TEAM_ID AS Home_ID, g.AWAY_TEAM_ID AS Away_ID, g.PTS_HOME, g.PTS_AWAY,g.FG_PCT_HOME,g.FG_PCT_AWAY,
        g.FG3_PCT_HOME,g.FG3_PCT_AWAY,g.FT_PCT_HOME,g.FT_PCT_AWAY
        FROM games g join teams t1 on g.HOME_TEAM_ID = t1.TEAM_ID join teams t2 on g.AWAY_TEAM_ID = t2.TEAM_ID
        WHERE GAME_ID = ${id}`, function(error, results, fields) {

            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// game time search table complex query
async function search_matches(req, res) {


    let home = req.query.Home ? req.query.Home : '';
    let away = req.query.Away ? req.query.Away : '';
    let season = req.query.Season ? req.query.Season : '2019';
    let year = req.query.Year ? req.query.Year : '';
    let month = req.query.Month ? req.query.Month : '';
    let date = req.query.Date ? req.query.Date : '';


    console.log();
    console.log(season);
    console.log(year);
    console.log(month);
    console.log(date);
    connection.query(`WITH TIME_GAME (GAME_ID, Date, PTS_HOME, PTS_AWAY, AST_HOME, REB_HOME, AST_AWAY, REB_AWAY, HOME_TEAM_ID, AWAY_TEAM_ID)
    AS ( SELECT GAME_ID, LEFT(GAME_DATE_EST,11) AS Date, PTS_HOME, PTS_AWAY, AST_HOME, REB_HOME, AST_AWAY, REB_AWAY, HOME_TEAM_ID, AWAY_TEAM_ID
         FROM games
         WHERE GAME_DATE_EST LIKE '${year}%' AND SEASON = '${season}' AND GAME_DATE_EST LIKE '%${month}%' AND GAME_DATE_EST LIKE '%${date}'
       ) 
    SELECT g.GAME_ID,  g.Date, t1.Home, t2.Away, g.PTS_HOME, g.PTS_AWAY, g.AST_HOME, g.REB_HOME, g.AST_AWAY, g.REB_AWAY
    From TIME_GAME g  Join ( SELECT ABBREVIATION AS Home, TEAM_ID
                              From teams
                              WHERE ABBREVIATION LIKE '${home}%' )  t1 ON g.HOME_TEAM_ID = t1.TEAM_ID
                       Join ( SELECT ABBREVIATION AS Away, TEAM_ID
                              From teams
                              WHERE ABBREVIATION LIKE '${away}%' )  t2 ON g.AWAY_TEAM_ID = t2.TEAM_ID
    ORDER BY Home, Away`, function (error, results, fields) {
        if (error) {
                console.log(error)
                res.json({ error: error })
        } else if (results) {
                res.json({ results: results })
        }
    });
}



module.exports = {
    random_player,

    currentPlayer,
    players2020,
    search2020,
    schedule,
    ranking,
    background,
    o_stats,
    roster,
    rivals,
    college_summary, 
    rivals, 
    game_deteil,
    match,
    search_matches,
}
