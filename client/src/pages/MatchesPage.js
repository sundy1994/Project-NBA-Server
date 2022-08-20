import React from 'react';
import { Form, FormInput, FormGroup, Button, Card, CardBody, CardTitle, Progress } from "shards-react";


import {
    Table,
    Pagination,
    Row,
    Col,
    Divider,
    Select

} from 'antd'

import { getMatchSearch, getMatch, getMatchCard } from '../fetcher'


import MenuBar from '../components/MenuBar';

const { Column, ColumnGroup } = Table;
const { Option } = Select;

const day = [];
day.push(<Option value={''}>any</Option>);
for (let i = 1; i < 32; i++) {
  day.push(<Option value={'-'+i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}>{i}</Option>);
}
const season_list = [];
season_list.push(<Option value='' disabled> any </Option>)
for (let i = 2014; i < 2021; i++) {
    season_list.push(<Option value={i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}>{i}</Option>);
}
const year_list = [];
year_list.push(<Option value={''}>any</Option>);
for (let i = 2014; i < 2021; i++) {
    year_list.push(<Option value={i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})}>{i}</Option>);
}
const month_list = [];
month_list.push(<Option value={''}>any</Option>);
for (let i = 1; i < 13; i++) {
    month_list.push(<Option value={'-'+i.toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false})+'-'}>{i}</Option>);
}

class MatchesPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            awayQuery: "",
            homeQuery: "",
            yearQuery: "",
            monthQuery: "",
            dateQuery: "",
            seasonQuery: "",
            matchesResults: [],
            selectedMatchId: 0,
            selectedMatchHomeDetails: [],
            selectedMatchAwayDetails: [],
            selectedMatchcardResults: null
            

        }

        this.handleAwayQueryChange = this.handleAwayQueryChange.bind(this)
        this.handleHomeQueryChange = this.handleHomeQueryChange.bind(this)
        this.handleYearQueryChange = this.handleYearQueryChange.bind(this)
        this.handleMonthQueryChange = this.handleMonthQueryChange.bind(this)
        this.handleDateQueryChange = this.handleDateQueryChange.bind(this)
        this.handleSeasonQueryChange = this.handleSeasonQueryChange.bind(this)
        this.updateSearchResults = this.updateSearchResults.bind(this)
        this.goToMatch = this.goToMatch.bind(this)

    }



    handleAwayQueryChange(event) {
        this.setState({ awayQuery: event.target.value })
    }

    handleHomeQueryChange(event) {
        this.setState({ homeQuery: event.target.value })
    }
    handleYearQueryChange(value) {
        this.setState({ yearQuery: value })
    }
    handleMonthQueryChange(value) {
        this.setState({ monthQuery: value })
    }
    handleDateQueryChange(value) {
        this.setState({ dateQuery: value })
    }
    handleSeasonQueryChange(value) {
        this.setState({ seasonQuery: value })
    }
    goToMatch(matchId) {
        this.setState({selectedMatchId:matchId},()=>{
            getMatchCard(this.state.selectedMatchId).then(res =>{
                this.setState({selectedMatchcardResults:res.results[0]})
            });
    
            getMatch(this.state.selectedMatchId,'home').then(res => {
                this.setState({ selectedMatchHomeDetails: res.results }) 
            });
            getMatch(this.state.selectedMatchId,'away').then(res => {
                this.setState({ selectedMatchAwayDetails: res.results }) 
            });
        });
    }

    updateSearchResults() {
        getMatchSearch(this.state.homeQuery, this.state.awayQuery,this.state.yearQuery,this.state.monthQuery,
            this.state.dateQuery,this.state.seasonQuery, null, null).then(res => {
            this.setState({ matchesResults: res.results });
        })
    }

    componentDidMount() {
        getMatchSearch(this.state.homeQuery, this.state.awayQuery,this.state.yearQuery,this.state.monthQuery,
            this.state.dateQuery,this.state.seasonQuery, null, null).then(res => {
            this.setState({ matchesResults: res.results });
        })
    }

    render() {
        return (
            <div>
                <MenuBar />
                <Divider orientation="left">All games time filter</Divider>
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <Row style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
                        <Col flex={1}>
                        <label>Season:  </label>
                        <Select defaultValue="2019" name = "Season" style={{ width: 120, margin: "0px 10px" }} onChange={this.handleSeasonQueryChange}>
                            {season_list}
                        </Select></Col>
                        <Col flex={1}>
                        <label>Year:  </label>
                        <Select defaultValue="any" name = "Year" style={{ width: 120, margin: "0px 10px" }} onChange={this.handleYearQueryChange}>
                            {year_list}
                        </Select></Col>
                        <Col flex={1}>
                        <label>Month:  </label>
                        <Select defaultValue="any" name = "Month" style={{ width: 120, margin: "0px 10px"  }} onChange={this.handleMonthQueryChange}>
                            {month_list}
                        </Select></Col>
                        <Col flex={1}>
                        <label>Date:  </label>
                        <Select defaultValue="any" name = "Date" style={{ width: 120, margin: "0px 10px"  }} onChange={this.handleDateQueryChange}>
                            {day}
                        </Select></Col>
                        <Col flex={2}>
                        <Button  theme = "dark" onClick={this.updateSearchResults}>Search</Button>
                        </Col>
                    </Row>
                </div>
                <Form style={{ width: '40vw', margin: '0 auto', marginTop: '2vh' ,marginLeft:'20vh'}}>
                    <Row>
                        <Col flex={2}><FormGroup style={{ width: '10vw', margin: '0 auto' }}>
                            <label>Home Team</label>
                            <FormInput placeholder="Home Team" value={this.state.homeQuery} onChange={this.handleHomeQueryChange} />
                        </FormGroup></Col>
                        <Col flex={2}><FormGroup style={{ width: '10vw', margin: '0 auto' }}>
                            <label>Away Team</label>
                            <FormInput placeholder="Away Team" value={this.state.awayQuery} onChange={this.handleAwayQueryChange} />
                        </FormGroup></Col>

                    </Row>
                </Form>

                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                <Table  size = "small" bordered = {true} onRow={(record, rowIndex) => {
                return {
                style:{backgroundColor:'burlywood'},
                onClick: () => {this.goToMatch(record.GAME_ID)},   
                };
            }} dataSource={this.state.matchesResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }}>
                        <ColumnGroup title="Teams" >
                    
                        <Column title="Home" dataIndex="Home" key="Home" sorter= {(a, b) => a.Home.localeCompare(b.Home)}/>
                        
                
                        <Column title="Away" dataIndex="Away" key="Away" sorter= {(a, b) => a.Away.localeCompare(b.Away)}/>
                        </ColumnGroup>
                        <ColumnGroup title="Goals">
                                
                        <Column title="PTS_HOME" dataIndex="PTS_HOME" key="PTS_HOME"  sorter= {(a, b) => a.PTS_HOME - b.PTS_HOME}/>
                        <Column title="PTS_AWAY" dataIndex="PTS_AWAY" key="PTS_AWAY"  sorter= {(a, b) => a.PTS_AWAY - b.PTS_AWAY}/>
                        </ColumnGroup>
                        <ColumnGroup title="Assist">
                                
                        <Column title="AST_HOME" dataIndex="AST_HOME" key="AST_HOME" sorter= {(a, b) => a.AST_HOME - b.AST_HOME}/>
                        <Column title="AST_AWAY" dataIndex="AST_AWAY" key="AST_AWAY" sorter= {(a, b) => a.AST_AWAY - b.AST_AWAY}/>
                        </ColumnGroup>
                        <ColumnGroup title="Rebound">
                                
                        <Column title="REB_HOME" dataIndex="REB_HOME" key="REB_HOME" sorter= {(a, b) => a.REB_HOME - b.REB_HOME}/>
                        <Column title="REB_AWAY" dataIndex="REB_AWAY" key="REB_AWAY" sorter= {(a, b) => a.REB_AWAY - b.REB_AWAY}/>
                        </ColumnGroup>

                        <ColumnGroup>
                        <Column title = "Date" dataIndex="Date" key="Date"></Column>
                        </ColumnGroup>

                    </Table> 
                </div> 
                
                <Divider />
                
                {this.state.selectedMatchcardResults ? <div style={{ width: '50vw', margin: '0 auto', marginTop: '2vh' }}>
                <Divider orientation="middle">Box Score</Divider>
                    <Card style={{backgroundColor:'burlywood'}}>
                        <CardBody>
                            <Row gutter='30' align='middle' justify='center'>
                                <Col flex={1} style={{ textAlign: 'left' }}>
                                    <CardTitle>{this.state.selectedMatchcardResults.Home}</CardTitle>
                                    <img src={'https://cdn.nba.com/logos/nba/'+this.state.selectedMatchcardResults.Home_ID+'/primary/L/logo.svg'}
                                    width="60" height="60"></img>
                                </Col>
                                <Col flex={2} style={{ textAlign: 'center', fontSize:30,fontWeight:500}}>
                                    <label style={{textAlign: 'center',color:'black'}}>{this.state.selectedMatchcardResults.Date}</label>
                                </Col>
                                

                                <Col flex={1} style={{ textAlign: 'right' }}>
                                     <CardTitle>{this.state.selectedMatchcardResults.Away}</CardTitle>
                                     <img src={'https://cdn.nba.com/logos/nba/'+this.state.selectedMatchcardResults.Away_ID+'/primary/L/logo.svg'}
                                    width="60" height="60"></img>
                                </Col>


                            </Row>
                            <Row gutter='30' align='middle' justify='center' style={{ marginTop:'2vh'}}>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                    <h3>{this.state.selectedMatchcardResults.PTS_HOME}</h3>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center',fontSize:30 }}>
                                    <label style={{textAlign: 'center',color:'black'}}>Goals</label>
                                </Col >
                                <Col span={9} style={{ textAlign: 'Right' }}>
                                    <h3>{this.state.selectedMatchcardResults.PTS_AWAY}</h3>
                                </Col >
                            </Row>

                           

                            <Row gutter='30' align='middle' justify='center' style={{ marginTop:'3vh'}}>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                <Progress value={this.state.selectedMatchcardResults.FG_PCT_HOME*100}>{Number(this.state.selectedMatchcardResults.FG_PCT_HOME*100).toFixed(2)+'%'}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' ,fontSize:20}}>
                                    <label style={{textAlign: 'center',color:'black'}}>Field Goal %</label>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                   
                                <Progress value={this.state.selectedMatchcardResults.FG_PCT_AWAY*100}>{Number(this.state.selectedMatchcardResults.FG_PCT_AWAY*100).toFixed(2)+'%'}</Progress>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center' style={{ marginTop:'3vh'}}>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                <Progress value={this.state.selectedMatchcardResults.FG3_PCT_HOME*100}>{Number(this.state.selectedMatchcardResults.FG3_PCT_HOME*100).toFixed(2)+'%'}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' ,fontSize:20}}>
                                    <label style={{textAlign: 'center',color:'black'}}>3Point %</label>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                   
                                <Progress value={this.state.selectedMatchcardResults.FG3_PCT_AWAY*100}>{Number(this.state.selectedMatchcardResults.FG3_PCT_AWAY*100).toFixed(2)+'%'}</Progress>
                                </Col>
                            </Row>
                            <Row gutter='30' align='middle' justify='center' style={{ marginTop:'3vh'}}>
                                <Col span={9} style={{ textAlign: 'left' }}>
                                <Progress value={this.state.selectedMatchcardResults.FT_PCT_HOME*100}>{Number(this.state.selectedMatchcardResults.FT_PCT_HOME*100).toFixed(2)+'%'}</Progress>
                                </Col >
                                <Col span={6} style={{ textAlign: 'center' ,fontSize:20}}>
                                    <label style={{textAlign: 'center',color:'black'}}>Field Throw %</label>
                                </Col >
                                <Col span={9} style={{ textAlign: 'right' }}>
                                   
                                <Progress value={this.state.selectedMatchcardResults.FT_PCT_AWAY*100}>{Number(this.state.selectedMatchcardResults.FT_PCT_AWAY*100).toFixed(2)+'%'}</Progress>
                                </Col>
                            </Row>

                        </CardBody>
                    </Card>
                </div> : null}
                <Divider orientation="left">Game deteil</Divider>
                {(this.state.selectedMatchHomeDetails.length>1 && this.state.selectedMatchcardResults) ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh',backgroundColor:'#F3F2E7'}}>
                <Row style={{ fontSize:40,fontWeight:'900', margin: '10px auto', marginTop: '10vh',marginLeft:'10vh' }}>
                    <label > Home Team</label>
                    
                </Row>
                <Row style={{ fontSize:40,fontWeight:'900', margin: '0 auto' ,marginLeft:'10vh'}}>
                    <label> {this.state.selectedMatchcardResults.Home}</label>
                </Row>
                <Table  size = "small" bordered = {true} onRow={(record, rowIndex) => {
                return {
                style:{backgroundColor:'burlywood'},
                };
            }} dataSource={this.state.selectedMatchHomeDetails} pagination={{ pageSizeOptions:[10, 15], defaultPageSize: 15, showQuickJumper:true }}>
            
                        <Column title="Name" dataIndex="PLAYER_NAME" key="PLAYER_NAME" />
                        <Column title="Position" dataIndex="START_POSITION" key="START_POSITION" />
                                
                        <Column title="time" dataIndex="MIN" key="MIN"  sorter= {(a, b) => a.MIN - b.MIN}/>
                        <Column title="PTS" dataIndex="PTS" key="PTS"  sorter= {(a, b) => a.PTS - b.PTS}/>
                      
                        <Column title="REB" dataIndex="REB" key="REB" sorter= {(a, b) => a.REB - b.REB}/>
                        <Column title="AST" dataIndex="AST" key="AST" sorter= {(a, b) => a.AST - b.AST}/>    
                        <Column title="STL" dataIndex="STL" key="STL" sorter= {(a, b) => a.STL - b.STL}/>
                        <Column title="BLK" dataIndex="BLK" key="BLK" sorter= {(a, b) => a.BLK - b.BLK}/>
                        
                        <Column title = "+/-" dataIndex="PLUS_MINUS" key="PLUS_MINUS"></Column>
                    

                    </Table>  
                    
                </div> : null}

                {(this.state.selectedMatchAwayDetails.length>1 && this.state.selectedMatchcardResults)  ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh', backgroundColor:'#F3F2E7'}}>
                <Row style={{ fontSize:40,fontWeight:'900', margin: '10px auto', marginTop: '10vh', marginLeft:'10vh' }}>
                    <label > Away Team</label>
                    
                </Row>
                <Row style={{ fontSize:40,fontWeight:'900',margin: '0 auto' ,marginLeft:'10vh'}}>
                    <label> {this.state.selectedMatchcardResults.Away}</label>
                </Row>
                <Table   size = "small" bordered = {true} onRow={(record, rowIndex) => {
                return {
                style:{backgroundColor:'burlywood'},
                };
            }} dataSource={this.state.selectedMatchAwayDetails} pagination={{ pageSizeOptions:[10, 15], defaultPageSize: 15, showQuickJumper:true }}>
            
                        <Column title="Name" dataIndex="PLAYER_NAME" key="PLAYER_NAME" />
                        <Column title="Position" dataIndex="START_POSITION" key="START_POSITION" />
                                
                        <Column title="time" dataIndex="MIN" key="MIN"  sorter= {(a, b) => a.MIN - b.MIN}/>
                        <Column title="PTS" dataIndex="PTS" key="PTS"  sorter= {(a, b) => a.PTS - b.PTS}/>
                      
                        <Column title="REB" dataIndex="REB" key="REB" sorter= {(a, b) => a.REB - b.REB}/>
                        <Column title="AST" dataIndex="AST" key="AST" sorter= {(a, b) => a.AST - b.AST}/>    
                        <Column title="STL" dataIndex="STL" key="STL" sorter= {(a, b) => a.STL - b.STL}/>
                        <Column title="BLK" dataIndex="BLK" key="BLK" sorter= {(a, b) => a.BLK - b.BLK}/>
                        
                        <Column title = "+/-" dataIndex="PLUS_MINUS" key="PLUS_MINUS"></Column>
                    

                    </Table>  
                    
                </div> : null}
                <Divider />

            </div>
        )
    }
}

export default MatchesPage

