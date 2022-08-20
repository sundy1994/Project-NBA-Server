# Project: Analysis and Modeling of Traffic Accidents in US
**Key Words:**  SQL, JAVA Script, HTML, Node JS, React JS, Relational Database, Data Wrangling, EDA, Data Grip, AWS, Web Application, Query Optimization


## Overview:
Basketball, the third most popular sport in the United States, based on viewership, has also captured the attention from around the world in the past several decades (Ghoshal). While the sport solidified its status as a household name, basketball and the current NBA landscape can still be foreign to many of those who do not regularly watch sports. We would go a step further in arguing that basketball and the NBA can be daunting for newcomers. We, individually, have friends or met people who often ask, “where I do start?”, “which team should I follow,” or “why is it so complicated?” 

The main goal of this project is to get users, who do not follow basketball, to become more acquainted with current basketball players and NBA teams. Like an art gallery, we want to create an interactive website that allows users to discover new players and teams and build their own dream team. Since there are plenty of basketball players, the app will provide information about starting players of each team and give player statistics and other relevant information, including suggestions of other players with similar statistics. The app will also draw attention to the relationship between NBA and US Colleges and highlight how alumni performance reflects on colleges. We also aim to give users a sense of the financial aspect of professional sports through exposure to player salaries and team building. 

To do these, we selected several data sets, cleaned with Pandas in Python and rearranged them to several relational tables. After uploading them to Relational Database Service (RDS) of AWS (Amazon Web Services) through Data Grip, we started to build the web application based on Node JS and React JS. The backend included many complex SQL queries that can retrive data from the database, while the front end has 4 pages: Home, Matches, Players and Teams, allowing users to build there own team of five and search for contents they are interested. The detailed video description of thes web application can be found [here]().


## Data Sources

The chosen data sets are all from Kaggle, focusing on game details, players, player info, ranking, and team information. Note that the dataset we plan on using contains game data starting from 2004 to 2020, and we'll clean and rearrange them to build a relational database so that our website can retrive data through SQL queries. There should not be any issues with the size of data sets. The original sources are listed below and exact sources per table is also described afterwards. 

[2021-22 NBA Season Active NBA Players - Kaggle](https://www.kaggle.com/buyuknacar/202122-nba-season-active-nba-players)

[NBA Player Stats 2021 All Star Break - Kaggle](https://www.kaggle.com/brandonrufino/nba-player-stats-2021-all-star-break)

[NBA games data - Kaggle](https://www.kaggle.com/nathanlauga/nba-games)

[NBA players - Kaggle](https://www.kaggle.com/justinas/nba-players-data)


## Introduction of Tables

### Relational Schema

 - **games** (GAME_DATE_EST DATE, **GAME_ID**, HOME_TEAM_ID, AWAY_TEAM_ID, SEASON, PTS_HOME, FG_PCT_HOME, FT_PCT_HOME, FG3_PCT_HOME, AST_HOME, REB_HOME, PTS_AWAY, FG_PCT_AWAY, FT_PCT_AWAY, FG3_PCT_AWAY, AST_AWAY, REB_AWAY, HOME_TEAM_WINS); FOREIGN KEY (HOME_TEAM_ID) REFERENCES **teams** (TEAM_ID), FOREIGN KEY (AWAY_TEAM_ID) REFERENCES **teams** (TEAM_ID)

This table provides information about the individual match data such as home team, visitor team, season, points. This data will be heavily referenced for important game details and constructing tables such as game schedule and a team’s season performance based on season. 


 - **Game_Details** (GAME_ID, TEAM_ID, TEAM_ABBREVIATION, PLAYER_ID, PLAYER_NAME,  START_POSITION, MIN, FGM, FGA, FG_PCT, FG3M, FG3A, FG3_PCT, FTM, FTA, FT_PCT, OREB, DREB, REB, AST, STL, BLK, `TO`, PF, PTS, PLUS_MINUS); FOREIGN KEY (GAME_ID) REFERENCES games(GAME_ID), FOREIGN KEY (TEAM_ID) REFERENCES teams(TEAM_ID)

This table provides information about the players’ statistics for each game such as player’s starting position, game stats, team information. This table will be heavily used for individual player information, such as retrieving average FT %, FG %, 3PT %, and other player statistics that can be used to compare the similarity between two players. Moreover, it will be used to search players that are similar to a chosen player. 


 - **Ranking** (TEAM_ID, SEASON, CONFERENCE, NUM_GAME, WIN, LOSE, W_PCT, HOME_RECORD, ROAD_RECORD); FOREIGN KEY (TEAM_ID) REFERENCES teams (TEAM_ID)
 
This provides information about each team’s season statistics such as W/L numbers, conference, win percentage based on season. This will be used to identify standings of different teams based on season.


 - **Teams** (TEAM_ID, NAME, ABBREVIATION, YEAR_FOUNDED, CITY, ARENA, OWNER, GENERAL_MANAGER, HEAD_COACH, LEAGUE_AFFIL)
 
This provides information about each team’s background information, such as arena name, team name, team name abbreviation, and other details related to coaching and management


 - **Players** (Name, TEAM_ID, PLAYER_ID, SEASON); FOREIGN KEY (TEAM_ID) REFERENCES teams(TEAM_ID)

This provides information about each player’s home team depending on season. This will be heavily used in joins to identify a particular player’s team in specific seasons.  


 - **Player_info** (PLAYER_ID, NAME, POSITION, TEAM, AGE, HEIGHT, WEIGHT, COLLEGE, SALARY, FGM_A, FTM_A, GAMES_PLAYED, MIN, FGA, FGM, FG, FTA, FTM, FT, 3PTA, 3PTM, 3PT, PTS, OFF_REB, DEF_REB, REB, AST, ST, BLK, TO, PF, IMPACT_FG, IMPACT_FT)

This provides information regarding all the 2020 season players. This table comes from two different sources and combined into one for certain information. The player_info will be used for current team rosters and as well as querying similar players based on current NBA team rosters. 


### Player Position Encodings

| Position      | Encoding |
| ------------- | -------- |
| Forward       | F        |
| Small Forward | SF       |
| Power Forward | PF       |
| Guard         | G        |
| Point Guard   | PG       |
| Shooting Guard| SG       |
| Center        | C        |

### Stats Encodings

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


### Performance Measuring

**PLUS_MINUS**: Measuring how the team did while that player is on the court.

**IMPACT_FG**: Field Goal - league average

**IMPACT_FG**: Free Throw - league average

All 3 stats are the higher the better


## Relational Database

Before uploading our datasets, we reviewed relationships between certain tables and each of the primary keys and foreign keys. We verified that the data is in 2NF, meaning that there were no partial dependencies. Moreover, for the tables that have more than one primary keys, we did not find any transitive dependencies to ensure that our dataset is in 3NF. To verify the accuracy and validity of the tables, we looked at specific teams and queried statistics for more well-known players such as Lebron James, Stephen Curry, and Nikola Jokić to verify that games table and players_info tables are providing reliable information, given some margin of error. While reviewing table relationships, we also created an ER diagram of the different tables, mapping the different relationships and existing between tables cardinalities (see below).  

![ER Diagram](https://github.com/sundy1994/Project-NBA-Server/blob/main/images/FINAL_ER.png)


## Description of system architecture

The following describes the web pages of our NBA website and individual goals of each page:

**Home Page**:
The home page contains a Team-Building application, allowing users to search for players and add them to create an NBA team of 5. In the searching section, users can search for active players in season 2020-2021 by their name, position as well as annual salary. The search results also contain their stats for the entire season and can be sorted by these stats and salary. Users can choose the players they want by clicking the ‘add’ button. The selected players will be shown in the ‘Your Dream Team’ section as a group of cards along with their photos, and the total salary will be calculated. Users can click the remove button to remove current players and add new ones. The maximum number of the team is 5 and a player cannot be added multiple times.

**Matches Page**:
The main purpose of this page is to provide a detailed statistical information for specific games. In the game table, users can custom year, month, and date to search for games held in specific date. Parameter change is accomplished by 3 select menus and could not be blank. The default time to display games is 2019-12-01, can jump to any day. By clicking the row on the games table, you will get detailed box score information of the specific games you selected below the table. It provides a brief insight of the competitive performance for each player of the away and home teams.

**Players Page**:
The main purpose of this page is to provide an overview of all the NBA players in the most recent season as well as draw attention to the relationship between US colleges, players and NBA. The player’s page is structured to allow the user to learn about a randomly generated college basketball team – specifically average wins and losses and NBA career length of players from those schools. Each page refresh generates a new college 

**Teams Page**:
The main purpose of this page is to provide detailed information of each NBA team and to allow the user to become more acquainted with current NBA landscape regarding teams and overall standings. The teams page is structured to let the user intuitively navigate to each team’s respective information regarding team roster, season game schedule, overall standings, and team background, including ownership and management team. While the information may seem basic, this page has several complex queries that compile game schedules, identify similar (or rival) players based on a particular player’s statistics by calculating similarity value, and each individual team’s overall season statistics. 
