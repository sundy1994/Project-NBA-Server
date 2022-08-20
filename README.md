# Dataset Information

## Introduction
games(GAME_DATE_EST, GAME_ID, HOME_TEAM_ID, AWAY_TEAM_ID, SEASON, PTS_HOME, FG_PCT_HOME, FT_PCT_HOME, FG3_PCT_HOME, AST_HOME, REB_HOME, PTS_AWAY, FG_PCT_AWAY,FT_PCT_AWAY,  FG3_PCT_AWAY, AST_AWAY, REB_AWAY, HOME_TEAM_WINS)
Stats of home and away teams for games From Season 2014 - 2020
24523 rows

Game_Details(GAME_ID,TEAM_ID, TEAM_ABBREVIATION, PLAYER_ID, PLAYER_NAME, START_POSITION, MIN,  FGM, FGA, FG_PCT, FG3M, FG3A,  FG3_PCT,  FTM, FTA,  FT_PCT,  OREB, DREB, REB, AST, STL, BLK, `TO`, PF, PTS, PLUS_MINUS)
Players' personal stats in each game
491613 rows

ranking(TEAM_ID, SEASON, CONFERENCE, NUM_GAME, WIN, LOSE, W_PCT, HOME_RECORD, ROAD_RECORD)
Teams' win rate and record at the end of each season, from 2002 - 2020
568 rows

teams(TEAM_ID, NAME, ABBREVIATION, YEAR_FOUNDED, CITY, ARENA, OWNER, GENERAL_MANAGER, HEAD_COACH, LEAGUE_AFFIL)
Basic information of each NBA team.
30 rows

players (Name, TEAM_ID, PLAYER_ID, SEASON)
Referencing players in all games from Season 2014 - 2020
7228 rows

player_info( PLAYER_ID, NAME, POSITION, TEAM, AGE, HEIGHT, WEIGHT, COLLEGE, SALARY, FGM_A, FTM_A, GAMES_PLAYED, MIN, FGA, FGM, FG, FTA, FTM, FT, 3PTA, 3PTM, 3PT, PTS, OFF_REB, DEF_REB, REB, AST, ST, BLK, `TO`, PF, IMPACT_FG, IMPACT_FT)
Detailed information of active players in Season 2020, including Salary.
327 rows

player_info_2(TO BE ADDED)

## Player Position Encodings

| Position      | Encoding |
| ------------- | -------- |
| Forward       | F        |
| Small Forward | SF       |
| Power Forward | PF       |
| Guard         | G        |
| Point Guard   | PG       |
| Shooting Guard| SG       |
| Center        | C        |

## Stats Encodings

| Stat           | Encoding |
| -------------- | -------- |
| Minutes played | MIN      |
| Field Goal     | FG       |
| Free Throw     | FT       |
| 3-Points       | 3PT      |
| Point Guard    | PG       |
| Rebounds       | REB      |
| Blocks         | BLK      |
| Turnovers      | TO       |
| Personal Fouls | PF       |
| Attempts       | A        |
| Made           | M        |
| Offensive      | O        |
| Defensive      | D        |


## Performance Measuring

PLUS_MINUS: Measuring how the team did while that player is on the court.
IMPACT_FG: Field Goal - league average
IMPACT_FG: Free Throw - league average
All 3 stats are the higher the better

## Sources

[2021-22 NBA Season Active NBA Players - Kaggle](https://www.kaggle.com/buyuknacar/202122-nba-season-active-nba-players)

[NBA Player Stats 2021 All Star Break - Kaggle](https://www.kaggle.com/brandonrufino/nba-player-stats-2021-all-star-break)

[NBA games data - Kaggle](https://www.kaggle.com/nathanlauga/nba-games)

[NBA players - Kaggle](https://www.kaggle.com/justinas/nba-players-data)
