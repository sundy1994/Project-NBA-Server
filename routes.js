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

// Route 1 (handler)
async function hello(req, res) {
    // Welcome route
    if (req.query.name) {
        res.send(`Hello, ${req.query.name}! Welcome to the NBA server!`)
    } else {
        res.send(`Hello! Welcome to the FIFA server!`)
    }
}

// Route 2 (handler)
async function random_player(req, res) {
    // Randomly display 5 players' basic stats on main page
    connection.query(`
        SELECT NAME, POSITION, TEAM, PTS AS POINTS, REB AS REBOUND, AST AS ASSIST, ST AS STEAL, BLK AS BLOCK
        FROM Player_info
        ORDER BY RAND()
        LIMIT 5`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    })
}

// Route 3 (handler)
async function win_rate(req, res) {
    // Show the player with the highest win rate through his career
    connection.query(`
        SELECT p.Name, p.PLAYER_ID, SUM(r.W_PCT)/COUNT(p.PLAYER_ID) AS w_pct
        FROM players p join ranking r on r.SEASON = p. SEASON AND r.TEAM_ID = p.TEAM_ID
        GROUP BY p.PLAYER_ID, p.Name
        ORDER BY w_pct DESC`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    })
}

// Route 4 (handler)
async function coordinate(req, res) {
    // Find the level of players that can coordinate better(previous play in the same team)
    connection.query(`
        With relation(player1,player2,ID1,ID2, relation_level)
        AS(
        Select  p1.Name as player1,p2.Name as player2, 
        p1.PLAYER_ID as ID1,p2.PLAYER_ID as ID2,
        1 AS relation_level
        FROM Players p1 join Players p2 ON 
        p1.TEAM_ID = p2.TEAM_ID AND p1.SEASON = p2.SEASON
        )
        
        Select pi1.NAME as player1, pi2.NAME as player2, 0 AS relation_level
        FROM player_info pi1 join player_info pi2 
        WHERE NOT EXIST(SELECT * 
        FROM relation
        WHERE relation.ID1 = pi1.PLAYER_ID AND relation.ID2 = pi2.PLAYER_ID)
        UNION (SELECT player1,player2, relation_level FROM relation)
        ORDER BY relation_level, DESC
        LIMIT 1`, function (error, results, fields) {

        if (error) {
            console.log(error)
            res.json({ error: error })
        } else if (results) {
            res.json({ results: results })
        }
    })
}

// Route 5 (handler)
async function hundred_points(req, res) {
    // Find teams that scored over 100 points as home teams during SEASON 2020, along with number of such games.
    connection.query(`
        SELECT t.NAME, COUNT(*) AS num_games
        FROM teams t, games g
        WHERE t.TEAM_ID = g.HOME_TEAM_ID AND
                g.SEASON = 2020 AND
                g.PTS_HOME > 100
        GROUP BY t.NAME`, function (error, results, fields) {

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

async function query(req, res) {
    // a GET request to /hello?name=Steve
    if (req.query.guy) {
        res.send(`Hello, ${req.query.guy}! Welcome to the NBA server!`)
    } else {
        res.send(`Hello! Welcome to the NBA server!`)
    }
}

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
//               Team specific 
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

async function teamStats(req, res) {

    let team = req.query.Team ? req.query.Team : "";
    let season  = req.query.Season ? req.query.Season : 2020;
    if (req.query.Team) {
        connection.query(`
            WITH HOME AS (
                SELECT g.HOME_TEAM_ID as ID, t.NAME as name, avg(PTS_HOME) as PPG, avg(REB_HOME) as RPG, avg(AST_HOME) as APG, AVG(PTS_AWAY) as OPPG
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.HOME_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            AWAY AS (
                SELECT g.AWAY_TEAM_ID as ID, t.NAME as name, avg(PTS_AWAY) as PPG, avg(REB_AWAY) as RPG, avg(AST_AWAY) as APG, AVG(PTS_HOME) as OPPG
                FROM games g, teams t
                WHERE (t.TEAM_ID = g.AWAY_TEAM_ID) AND t.NAME LIKE '%${team}%'
                    AND SEASON = ${season}),
            COMBINE AS (
                SELECT * FROM HOME
                UNION
                SELECT  * FROM AWAY),
            FIN AS (
                SELECT ID, name, avg(PPG) as PPG, avg(RPG) as RPG, avg(APG) as APG, avg(OPPG) as OPPG
                FROM COMBINE
                WHERE NAME LIKE '%${team}%'
            )
            SELECT * FROM FIN
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
                HEIGHT, WEIGHT, AGE, COLLEGE
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
                HEIGHT, WEIGHT, AGE, COLLEGE
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

    let conf = req.query.Conference ? req.query.Conference : "West";
    let season = req.query.Season ? req.query.Season : 2020;

    if (req.query.Conference) {
        connection.query(`
            SELECT r.TEAM_ID, t.NAME, t.ABBREVIATION, r.CONFERENCE, r.WIN, r.LOSE, r.W_PCT
            FROM teams t, ranking r
            WHERE t.TEAM_ID = r.TEAM_ID AND r.SEASON = ${season}
                AND CONFERENCE LIKE '%${conf}%'
            ORDER BY W_PCT DESC
            LIMIT 5
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
            WHERE t.TEAM_ID = r.TEAM_ID AND r.SEASON = ${season}
                AND CONFERENCE LIKE '%${conf}%'
            ORDER BY W_PCT DESC
            LIMIT 5
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

// Route 1 (handler)
async function all_matches(req, res) {
    
    const season = req.params.season ? req.params.season : 2019

    if (req.query.page && !isNaN(req.query.page)) {

        if (req.query.pagesize && !isNaN(req.query.pagesize)) {

            let page = req.query.page;
            const pageSize = req.query.pagesize;

                //ASSUMING 0 INDEXED ------IF NOT ZERO INDEX REMOVED 1 in x = ... - 1
                //If pageSize = 10, page = 2, then x = 9 (offset, starting at 10) and include up to y = 19
                let offset;

                if (page == 1) {
                    offset = 0;
                } else {
                    offset = ((page - 1) * pageSize);
                }

                connection.query(`SELECT GAME_ID, GAME_DATE_EST, t1.ABBREVIATION AS Home, t2.ABBREVIATION AS Away, PTS_HOME, PTS_AWAY,AST_HOME,
                REB_HOME,AST_AWAY,REB_AWAY,HOME_TEAM_WINS
                FROM games g join teams t1 on g.HOME_TEAM_ID = t1.TEAM_ID join teams t2 on g.AWAY_TEAM_ID = t2.TEAM_ID
                WHERE g.SEASON = '${season}'
                ORDER BY Home, Away
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
                const tenSize = 10;
                let page = req.query.page;

                let offset;

                //unspecified pageSize
                if (page == 1) {
                    offset = 0;
                } else {
                    offset = ((page - 1) * tenSize);
                }

                connection.query(`SELECT GAME_ID, GAME_DATE_EST, t1.ABBREVIATION AS Home, t2.ABBREVIATION AS Away, PTS_HOME, PTS_AWAY,AST_HOME,
                REB_HOME,AST_AWAY,REB_AWAY,HOME_TEAM_WINS
                FROM games g join teams t1 on g.HOME_TEAM_ID = t1.TEAM_ID join teams t2 on g.AWAY_TEAM_ID = t2.TEAM_ID
                WHERE g.SEASON = '${season}'
                ORDER BY Home, Away
                LIMIT ${tenSize} OFFSET ${offset}
                `, function(error, results, fields) {

                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                });
        }
    } else {
        connection.query(`SELECT GAME_ID, GAME_DATE_EST, t1.ABBREVIATION AS Home, t2.ABBREVIATION AS Away, PTS_HOME, PTS_AWAY,AST_HOME,
                REB_HOME,AST_AWAY,REB_AWAY,HOME_TEAM_WINS
                FROM games g join teams t1 on g.HOME_TEAM_ID = t1.TEAM_ID join teams t2 on g.AWAY_TEAM_ID = t2.TEAM_ID
                WHERE g.SEASON = '${season}'
                ORDER BY Home, Away
                `, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}

// Route 4 (handler)
async function game_deteil(req, res) {
    // TOD
    const homeplayer = req.query.home ? req.query.home : true
    if (req.query.id && !isNaN(req.query.id)) {
        if (homeplayer){
            let id = req.query.id;
            connection.query(`SELECT d.PLAYER_NAME, d.START_POSITION, d.MIN, d.FGM, d.FGA, d.FG_PCT, d.FT_PCT,d.OREB,d.DREB,d.REB,d.AST,d.STL,d.BLK,d.PF,d.PTS,
            d.PLUS_MINUS
            FROM Game_Details d join games g ON g.AWAY_TEAM_ID = d.TEAM_ID
            WHERE d.GAME_ID = ${id}
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
            FROM Game_Details d join games g ON g.AWAY_TEAM_ID = d.TEAM_ID
            WHERE d.GAME_ID = ${id} 
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

// Maybe use this for matches
async function match(req, res) {
    if (req.query.id && !isNaN(req.query.id)) {
        let id = req.query.id;

        connection.query(`SELECT *
        FROM games
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

// Maybe use this for searching matches
async function search_matches(req, res) {


    let home = req.query.Home ? req.query.Home : '';
    let away = req.query.Away ? req.query.Away : '';
    let season = req.query.season ? req.query.season : 2019;
    let date = req.query.date ? req.query.date : '2019-01-01';


    console.log();
    console.log(req.query.pagesize);
    console.log(req.query.page);
    console.log(req.query.Home);
    console.log(req.query.Away);


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

                connection.query(`SELECT g.GAME_ID, g.GAME_DATE_EST, t1.ABBREVIATION AS Home, t2.ABBREVIATION AS Away, g.PTS_HOME, g.PTS_AWAY,g.AST_HOME,
                g.REB_HOME,g.AST_AWAY,g.REB_AWAY,g.HOME_TEAM_WINS
                FROM games g join teams t1 on g.HOME_TEAM_ID = t1.TEAM_ID join teams t2 on g.AWAY_TEAM_ID = t2.TEAM_ID
                WHERE t1.ABBREVIATION LIKE '%${home}%' AND t2.ABBREVIATION LIKE '%${away}%' AND g.GAME_DATE_EST= '${date}' AND g.SEASON = '${season}'
                ORDER BY Home, Away
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
                const tenSize = 10;
                let page = req.query.page;

                let offset;

                //unspecified pageSize
                if (page == 1) {
                    offset = 0;
                } else {
                    offset = ((page - 1) * tenSize);
                }

                connection.query(`SELECT g.GAME_ID, g.GAME_DATE_EST, t1.ABBREVIATION AS Home, t2.ABBREVIATION AS Away, g.PTS_HOME, g.PTS_AWAY,g.AST_HOME,
                g.REB_HOME,g.AST_AWAY,g.REB_AWAY,g.HOME_TEAM_WINS
                FROM games g join teams t1 on g.HOME_TEAM_ID = t1.TEAM_ID join teams t2 on g.AWAY_TEAM_ID = t2.TEAM_ID
                WHERE t1.ABBREVIATION LIKE '%${home}%' AND t2.ABBREVIATION LIKE '%${away}%' AND g.GAME_DATE_EST= '${date}' AND g.SEASON = '${season}'
                ORDER BY Home, Away
                LIMIT ${tenSize} OFFSET ${offset}
                `, function(error, results, fields) {

                    if (error) {
                        console.log(error)
                        res.json({ error: error })
                    } else if (results) {
                        res.json({ results: results })
                    }
                });
        }
    } else {
        // we have implemented this for you to see how to return results by querying the database
        connection.query(`SELECT g.GAME_ID, g.GAME_DATE_EST, t1.ABBREVIATION AS Home, t2.ABBREVIATION AS Away, g.PTS_HOME, g.PTS_AWAY,g.AST_HOME,
                g.REB_HOME,g.AST_AWAY,g.REB_AWAY,g.HOME_TEAM_WINS
                FROM games g join teams t1 on g.HOME_TEAM_ID = t1.TEAM_ID join teams t2 on g.AWAY_TEAM_ID = t2.TEAM_ID
                WHERE t1.ABBREVIATION LIKE '%${home}%' AND t2.ABBREVIATION LIKE '%${away}%' AND g.GAME_DATE_EST= '${date}' AND g.SEASON = '${season}'
                ORDER BY Home, Away`, function (error, results, fields) {
            if (error) {
                console.log(error)
                res.json({ error: error })
            } else if (results) {
                res.json({ results: results })
            }
        });
    }
}



module.exports = {
    hello,
    random_player,
    win_rate,
    coordinate,
    hundred_points,
    query,
    players2020,
    teamStats,
    search2020,
    schedule,
    ranking,
    background,
    o_stats,
    roster, 
    all_matches,
    game_deteil,
    match,
    search_matches,
}
