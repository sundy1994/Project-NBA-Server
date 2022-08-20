import React from 'react';
import { Form, FormInput, FormGroup, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Slider,
    Button,
    Space, 
    Card,
    Rate 
} from 'antd'
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';
import MenuBar from '../components/MenuBar';

import { 
    getRoster,
    getSchedule,
    getStats, 
    getBackground, 
    getRanking, 
    getRivals, 
    getCurrent 
} from '../fetcher'
const wideFormat = format('.3r');

const { Option } = Select;

const schedule = [

    {
        title: 'Date',
        dataIndex: 'GAME_DATE_EST',
        key: 'GAME_DATE_EST',
        sorter: (a, b) => a.GAME_DATE_EST.localeCompare(b.GAME_DATE_EST),
    },
    {
        title: 'Home',
        dataIndex: 'HOME',
        key: 'HOME',
        sorter: (a, b) => a.HOME.localeCompare(b.HOME)
    },
    {
        title: 'Home Score',
        dataIndex: 'PTS_HOME',
        key: 'PTS_HOME',
        sorter: (a, b) => a.PTS_HOME - (b.PTS_HOME)
    },

    {
        title: 'Away Score',
        dataIndex: 'PTS_AWAY',
        key: 'PTS_AWAY',
        sorter: (a, b) => a.PTS_AWAY - b.PTS_AWAY
    },

    {
        title: 'Away',
        dataIndex: 'NAME',
        key: 'NAME',
        sorter: (a, b) => a.NAME.localeCompare(b.NAME)
    }
];

const rosterColumns = [
    {
        title: 'Name',
        dataIndex: 'NAME',
        key: 'NAME',
        sorter: (a, b) => a.NAME.localeCompare(b.NAME),
    },
    {
        title: 'Player ID',
        dataIndex: 'PLAYER_ID',
        key: 'PLAYER_ID',
        sorter: (a, b) => a.PLAYER_ID - b.PLAYER_ID
    },
    {
        title: 'Position',
        dataIndex: 'POSITION',
        key: 'POSITION',
        sorter: (a, b) => a.POSITION.localeCompare(b.POSITION)
    },
    {
        title: 'HT',
        dataIndex: 'HEIGHT',
        key: 'HEIGHT',
        sorter: (a, b) => a.HEIGHT - b.HEIGHT

    },
    {
        title: 'WT',
        dataIndex: 'WEIGHT',
        key: 'WEIGHT',
        sorter: (a, b) => a.WEIGHT - b.WEIGHT
    },
    {
        title: 'Age',
        dataIndex: 'AGE',
        key: 'AGE',
        sorter: (a, b) => a.AGE - b.AGE
    },

    {
        title: 'College',
        dataIndex: 'COLLEGE',
        key: 'COLLEGE',
        
    },
    {
        title: 'FG%',
        dataIndex: 'FG',
        key: 'FG',
        sorter: (a, b) => a.FG - b.FG
    },
    {
        title: 'FT%',
        dataIndex: 'FT',
        key: 'FT',
        sorter: (a, b) => a.FT - b.FT
    },
    {
        title: '3PT%',
        dataIndex: 'threePT',
        key: 'threePT',
        sorter: (a, b) => a.threePT - b.threePT
    },
];

const rival = [
    {
        title: 'Close Rivals',
        dataIndex: 'name',
        key: 'name',
        
    },
    {
        title: 'Field Goal',
        dataIndex: 'fg',
        key: 'fg',
        sorter: (a, b) => a.fg - (b.fg)
    },
    {
        title: '3Point Field Goal',
        dataIndex: 'tfg',
        key: 'tfg',
        sorter: (a, b) => a.tfg - (b.tfg)
    },
    {
        title: 'Free Throws',
        dataIndex: 'ft',
        key: 'ft',
        sorter: (a, b) => a.ft - (b.ft)
    },
    {
        title: 'Rebounds',
        dataIndex: 'ft',
        key: 'ft',
        sorter: (a, b) => a.reb - (b.reb)
    },
    {
        title: 'Assists',
        dataIndex: 'ast',
        key: 'ast',
        sorter: (a, b) => a.ast - (b.ast)
    },
    {
        title: 'Points',
        dataIndex: 'pts',
        key: 'pts',
        sorter: (a, b) => a.pts - (b.pts)
    }

];

const current = [
    {
        title: 'Selected Player',
        dataIndex: 'PLAYER_NAME',
        key: 'PLAYER_NAME',
    },
    ,
    {
        title: 'Field Goal',
        dataIndex: 'FGP',
        key: 'FGP',
    },
    {
        title: '3Point Field Goal',
        dataIndex: 'TFGP',
        key: 'TFGP',
    },
    {
        title: 'Free Throws',
        dataIndex: 'FTP',
        key: 'FTP',
    },
    {
        title: 'Rebounds',
        dataIndex: 'REBP',
        key: 'REBP',
    },
    {
        title: 'Assists',
        dataIndex: 'ASTP',
        key: 'ASTP',
    },
    {
        title: 'Points',
        dataIndex: 'PTSP',
        key: 'PTSP',
    }
];

const conference = [
    {
        title: 'Team',
        dataIndex: 'NAME',
        key: 'NAME',
        sorter: (a, b) => a.NAME.localeCompare(b.NAME),
    },

    {
        title: 'Conference',
        dataIndex: 'CONFERENCE',
        key: 'CONFERENCE',
        sorter: (a, b) => a.CONFERENCE.localeCompare(b.CONFERENCE),
    },
    {
        title: 'Wins',
        dataIndex: 'WIN',
        key: 'WIN',
        sorter: (a, b) => a.WIN - b.WIN
    },
    {
        title: 'Losses',
        dataIndex: 'LOSE',
        key: 'LOSE',
        sorter: (a, b) => a.LOSE - b.LOSE

    },
    {
        title: 'W/L Ratio',
        dataIndex: 'W_PCT',
        key: 'W_PCT',
        sorter: (a, b) => a.W_PCT - b.W_PCT
    }
];

class TeamsPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            //show table
            show_standing: '',

            //scheduleQuery
            schedule_home: '',
            schedule_away: '',

            //rivals
            playerID: '',
            rivals:[],
            currentID: '',
            current: [],

            //RankingsQuery
            rankings_season: 2020,
            conference: '',
            rankings_Team: '',
            rankings:[],

            // Season these can all change by season 
            overall_stats_season: 2020,
            team_stats_season: 2020,
            schedule_season: 2020,

            //Other
            playersResults: [],
            statsResults: [],
            scheduleResults: [],
            background:[],
            Team:'',
            Icon:'',
            Season:''

        }
        //standings table
        this.update_showStandings_conference = this.update_showStandings_conference.bind(this)
        this.update_showStandings_season = this.update_showStandings_season.bind(this)
        this.update_showStandings_team = this.update_showStandings_team.bind(this)
        this.Handle_showStandings = this.Handle_showStandings.bind(this)
        
        //schedule
        this.updateSchedule_Home = this.updateSchedule_Home.bind(this)
        this.updateSchedule_Away = this.updateSchedule_Away.bind(this)
        
        //For refreshing all team 
        this.updateTeamResults = this.updateTeamResults.bind(this)

        //rivals
        this.updateRivals = this.updateRivals.bind(this)
    }

    //======================Schedule Table===================================
    updateSchedule_Home(value)  {
        this.setState({schedule_home: value.target.value}, () => getSchedule(this.state.Team, this.state.schedule_home, this.state.schedule_away).then(res => {
            this.setState({ scheduleResults: res.results })
        }));
    }

    updateSchedule_Away(value)  {
        this.setState({schedule_away: value.target.value}, () => getSchedule(this.state.Team, this.state.schedule_home, this.state.schedule_away).then(res => {
            this.setState({ scheduleResults: res.results })
        }));
    }
    //=======================================================================

    //======================Rivals Table===================================

    updateRivals(value)  {
        this.setState({playerID: value.target.value}, () => getRivals(this.state.playerID).then(res => {
            this.setState({ rivals: res.results })
        }));

        this.setState({currentID: value.target.value}, () => getCurrent(this.state.currentID).then(res => {
            this.setState({ current: res.results })
        }));
    }

    //=====================================================================

    //Select Team button to render respective team 
    updateTeamResults(value) {
        console.log("here")
        console.log("value: " + value)

        this.setState({Team: value}, () => getStats(this.state.Team).then(res => {
            this.setState({statsResults: res.results })
            console.log("statsresults: " + this.state.statsResults)
        }));

        this.setState({Team: value}, () => getRoster(this.state.Team).then(res => {
            this.setState({playersResults: res.results })
            console.log(this.state.playersResults)
        }));


        this.setState({Team: value}, () => getSchedule(this.state.Team, this.state.schedule_home, this.state.schedule_away).then(res => {
            this.setState({scheduleResults: res.results })
            
        }));

        this.setState({Team: value}, () => getBackground(this.state.Team).then(res => {
            this.setState({background: res.results })
        }));
    }

    //======================Standings table===================================
    //Toggle table
    Handle_showStandings(value) {
        this.setState({show_standings : value})
    }
    update_showStandings_season(value) {
       this.setState({rankings_season: value.target.value}, () => getRanking(this.state.rankings_season, this.state.conference, this.state.rankings_Team).then(res => {
       this.setState({rankings: res.results })
       }));
    }
    update_showStandings_team(value) {
        this.setState({rankings_Team: value.target.value}, () => getRanking(this.state.rankings_season, this.state.conference, this.state.rankings_Team).then(res => {
        this.setState({rankings: res.results })
        }));
     }
    update_showStandings_conference(value) {
        this.setState({conference : value}, () => getRanking(this.state.rankings_season, this.state.conference, this.state.rankings_Team).then(res => {
            this.setState({rankings: res.results })
        }));
    }
    //===============================================================================


    //================================GENERAL MOUNTS=================================
    componentDidMount() {
        getRoster(this.Team).then(res => {
            this.setState({ playersResults: res.results })
        })

        getStats(this.Team).then(res => {
            this.setState({ statsResults: res.results })
        })

        getSchedule(this.Team, this.schedule_home, this.schedule_away).then(res => {
            this.setState({ scheduleResults: res.results })
        })

        getBackground(this.Team).then(res => {
            this.setState({ background: res.results })
        })

        getRanking(this.state.rankings_season, this.state.conference, this.state.rankings_Team).then(res => {
            this.setState({ rankings: res.results })
        })

        getRivals(this.state.playerID).then(res => {
            this.setState({ rivals: res.results })
        })

        getCurrent(this.state.currentID).then(res => {
            this.setState({ current: res.results })
        })
    }
    //================================GENERAL MOUNTS=================================

    render() {
        return (

            <div>
                <MenuBar />

            {/* ========================================================================== */}
                <Divider orientation="left">NBA Teams</Divider>

                {/*================NBA TEAM GRID===============*/}
                {/*Region1*/}
                <Row justify="center" gutter={[24, 30]}>
                    <Col span={5}><b>ATLANTIC</b></Col>

                    <Col span={5}><b>CENTRAL</b></Col>

                    <Col span={5}><b>SOUTHEAST</b></Col>
                </Row>

                {/*Region1 Teams and Buttons*/}
                <Row justify="center" gutter={[24, 30]}>

                    {/*Atlantic*/}
                    <Col span={5}>
                    <img src="https://cdn.nba.com/logos/nba/1610612738/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = {() => this.updateTeamResults("Boston Celtics")}
                          >Boston Celtics</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612751/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Brooklyn Nets")}
                          >Brooklyn Nets</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612752/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("New York Knicks")}
                          >New York Knicks</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612755/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Philadelphia")}
                          >Philadelphia 76ers</Button> 
                    <br></br>
                    

                    <img src="https://cdn.nba.com/logos/nba/1610612761/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Toronto Raptors")}
                          >Toronto Raptors</Button> 
                    <br></br>

                    </Col>

                    {/*Central*/}
                    <Col span={5}>
                    <img src="https://cdn.nba.com/logos/nba/1610612741/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Chicago Bulls")}
                          >Chicago Bulls</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612739/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Cleveland Cavaliers")}
                          >Cleveland Cavaliers</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612765/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Detroit Pistons")}
                          >Detroit Pistons</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612754/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Indiana Pacers")}
                          >Indiana Pacers</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612749/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Milwaukee Bucks")}
                          >Milwaukee Bucks</Button> 
                    <br></br>







                    </Col>

                    {/*Southeast*/}
                    <Col span={5}>  
                    <img src="https://cdn.nba.com/logos/nba/1610612737/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Atlanta Hawks")}
                          >Atlanta Hawks</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612766/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Charlotte Hornets")}
                          >Charlotte Hornets</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612748/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Miami Heat")}
                          >Miami Heat</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612753/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Orlando Magic")}
                          >Orlando Magic</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612764/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Washington Wizards")}
                          >Washington Wizards</Button> 
                    <br></br>

                    </Col>
                </Row>

                {/*Region2*/}
                <Row justify="center" gutter={[24, 30]}>
                    <Col span={5}><b>NORTHWEST</b></Col>


                    <Col span={5}><b>PACIFIC</b></Col>

                    <Col span={5}><b>SOUTHWEST</b></Col>
                </Row>

                {/*Region2 Teams and Buttons*/}
                <Row justify="center" gutter={[24, 30]}>
                    <Col span={5}>
                    <img src="https://cdn.nba.com/logos/nba/1610612743/primary/L/logo.svg"
                        width="30" height="30"></img>
                         <Button type="text" onClick = { () => this.updateTeamResults("Denver Nuggets")}
                          >Denver Nuggets</Button>  
                    <br></br>
             
                    <img src="https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Minnesota Timberwolves")}
                          >Minnesota Timberwolves</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612760/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Oklahoma City Thunder")}
                          >Oklahoma City Thunder</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612757/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Portland Trail Blazers")}
                          >Portland Trail Blazers</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612762/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Utah Jazz")}
                          >Utah Jazz</Button> 
                    <br></br>
                    
                    </Col>

                    <Col span={5}>
                    <img src="https://cdn.nba.com/logos/nba/1610612750/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Golden State Warriors")}
                          >Golden State Warriors</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612746/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Los Angeles Clippers")}
                          >Los Angeles Clippers</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612747/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Los Angeles Lakers")}
                          >Los Angeles Lakers</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612756/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Phoenix Suns")}
                          >Phoenix Suns</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612758/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Kings")}
                          >Sacramento Kings</Button> 
                    <br></br>

                  
                    </Col>

                    <Col span={5}>  
                    <img src="https://cdn.nba.com/logos/nba/1610612742/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Dallas Mavericks")}
                          >Dallas Mavericks</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612745/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Houston Rockets")}
                          >Houston Rockets</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612763/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("Memphis Grizzlies")}
                          >Memphis Grizzlies</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612740/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("New Orleans Pelicans")}
                          >New Orleans Pelicans</Button> 
                    <br></br>

                    <img src="https://cdn.nba.com/logos/nba/1610612759/primary/L/logo.svg"
                        width="30" height="30"></img>
                        <Button type="text" onClick = { () => this.updateTeamResults("San Antonio Spurs")}
                          >San Antonio Spurs</Button> 
                    <br></br>
                    </Col>
                </Row>

                <Divider />

                {/* show table when Team is selected */}
                <Button type="link" onClick = {() => this.Handle_showStandings("SHOW")}
                          >Show Standings</Button> 

                <Button type="link" onClick = {() => this.Handle_showStandings("")}
                                        >Remove Standings</Button> 

                {/* Ranking table */}
                {this.state.show_standings ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                <Divider orientation="center">{this.state.rankings_season} Standings</Divider>
                <Select style={{ width: 120 }} onChange={this.update_showStandings_conference}>
                        <Option value="West">West</Option>
                        <Option value="East">East</Option>
                        <Option value="">None</Option>
                </Select>

                <Row>
                <Col flex={2}>
                <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Season</label>
                            <FormInput placeholder="YYYY"  onChange={this.update_showStandings_season} /> </FormGroup> </Col>

                
                <Col flex={2}>
                <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Team</label>
                            <FormInput placeholder="Team Name"  onChange={this.update_showStandings_team} /> </FormGroup> </Col>
                </Row>
                <Table style={{ width: '50vw', margin: '0 auto', marginTop: '2vh' }} 
                        dataSource={this.state.rankings} columns={conference} 
                            pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}/>

                </div> : null}


                {/* Schedule Games Table */}
                {this.state.Team ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                
                <Button type="link" onClick = {() => this.updateTeamResults("")}
                                        >Hide {this.state.Team} Details</Button> 


                <Divider orientation="left">{this.state.Team} 2020-21 Season Games </Divider>
                
                <Row>
                <Col flex={2}>
                <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Home</label>
                            <FormInput placeholder="Team Name"  onChange={this.updateSchedule_Home} /> </FormGroup> </Col>

                
                <Col flex={2}>
                <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                            <label>Away</label>
                            <FormInput placeholder="Team Name"  onChange={this.updateSchedule_Away} /> </FormGroup> </Col>
                </Row>


                <Table style={{ width: '50vw', margin: '0 auto', marginTop: '2vh' }} 
                        dataSource={this.state.scheduleResults} columns={schedule} 
                            pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 3, showQuickJumper:true }}/>



                <Divider orientation="left">{this.state.Team} Team Roster</Divider>
                    

                    {/* Table for Roster */}
                    <Table style={{ width: '50vw', margin: '0 auto', marginTop: '2vh' }} 
                        dataSource={this.state.playersResults} columns={rosterColumns} 
                            pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 7, showQuickJumper:true }}/>
                   
                    <Row>                    
                    <Col flex={2}>
              
                    <FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                                <label>Search Close Rivals</label>
                                <FormInput placeholder="Player ID"  onChange={this.updateRivals} /> </FormGroup> </Col>
                    </Row>

                    {this.state.playerID ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>

                    <Table style={{ width: '50vw', margin: '0 auto', marginTop: '2vh' }} 
                        dataSource={this.state.current} columns={current} 
                            pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 3, showQuickJumper:true }}/>


                    <Table style={{ width: '50vw', margin: '0 auto', marginTop: '2vh' }} 
                        dataSource={this.state.rivals} columns={rival} 
                            pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 3, showQuickJumper:true }}/>


                    </div> : null}

                    <br></br>

                    {/* Cards for team info */}
                    
                    <br></br>

                    <Row>
                    <Col flex={1}> </Col>
                    <Col flex={1}>
                        {/* Statistics Card */}
                        <Card dataSource={this.state.statsResults} title="Team Statistics" style={{ width: 300 }}>
                            {/* <p>Card content {this.state.statsResults[0].NAME}</p> */}

                            {this.state.statsResults.length > 0 &&
                                    <p>
                                    Average Points Per Game: {this.state.statsResults[0].PTS}
                                    </p>
                            }
                            {this.state.statsResults.length > 0 &&
                                    <p>
                                    Free Throws: {this.state.statsResults[0].FT}
                                    </p>
                            }
                            {this.state.statsResults.length > 0 &&
                                    <p>
                                    Average Assists Per Game: {this.state.statsResults[0].AST}
                                    </p>
                            }

                            {this.state.statsResults.length > 0 &&
                                    <p>
                                    Average Rebounds Per Game: {this.state.statsResults[0].REB}
                                    </p>
                            }
   
                        </Card> </Col>
                        
                        <Col flex={1}>
                        {/* Background Card */}
                        <Card dataSource={this.state.background} title="Team Background" style={{ width: 300 }}>
                            
                            {this.state.background.length > 0 &&
                                    <p>
                                    Founded: {this.state.background[0].YEAR}
                                    </p>
                            }                           
                            {this.state.background.length > 0 &&
                                    <p>
                                    City: {this.state.background[0].CITY}
                                    </p>
                            }                             
                            {this.state.background.length > 0 &&
                                    <p>
                                    Arena: {this.state.background[0].ARENA}
                                    </p>
                            }                               
                            {this.state.background.length > 0 &&
                                    <p>
                                    G-league: {this.state.background[0].GLEAGUE}
                                    </p>
                            }
                            {this.state.background.length > 0 &&
                                    <p>
                                    Owner: {this.state.background[0].OWNER}
                                    </p>
                            }
                            {this.state.background.length > 0 &&
                                    <p>
                                    General Manager: {this.state.background[0].GENERAL_MANAGER}
                                    </p>
                            }
                            {this.state.background.length > 0 &&
                                    <p>
                                    Head Coach: {this.state.background[0].HEAD_COACH}
                                    </p>
                            }
                            
                        </Card> </Col>
                    </Row>
                <Divider />

                </div> : null}

            </div>
        )
    }
}

export default TeamsPage

