import React from 'react';
import { Form, FormInput, FormGroup, Button, CardBody, CardTitle, Progress } from "shards-react";

import {
    Table,
    Pagination,
    Select,
    Row,
    Col,
    Divider,
    Card,
    Slider,
    Rate,
    Popover, 
    Layout,
} from 'antd'
import { RadarChart } from 'react-vis';
import { format } from 'd3-format';

import MenuBar from '../components/MenuBar';
import { getPlayerSearch, getPlayer, getAllPlayers, getCollegeSummary } from '../fetcher'
const wideFormat = format('.3r');

const playerColumns = [
    {
        title: 'Name',
        dataIndex: 'NAME',
        key: 'NAME',
        sorter: (a, b) => a.NAME.localeCompare(b.NAME),
        render: (text, row) => 
        <Popover placement="right" content={(
            <div>
               <p> Age: {row.AGE} </p>
               <p> Position: {row.POSITION} </p>
               <p> Weight: {row.WEIGHT} </p>
               <p> Height: {row.HEIGHT} </p>
               <p> Games Played: {row.GAMES_PLAYED} </p>
               <p> Salary: {row.SALARY} </p>
            </div>
        )} 
        title= "Player Info"> 
        {row.NAME}
        </Popover>
    },
    {
        title: 'Current Team',
        dataIndex: 'TEAM',
        key: 'TEAM',
        sorter: (a, b) => a.TEAM.localeCompare(b.TEAM)
    },
    
];

class PlayersPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            nameQuery: '',
            nationalityQuery: '',
            teamQuery: '',
            ratingHighQuery: 100,
            ratingLowQuery: 0,
            potHighQuery: 100,
            potLowQuery: 0,
            selectedPlayerId: window.location.search ? window.location.search.substring(1).split('=')[1] : 229594,
            selectedPlayerDetails: null,
            playersResults: [],
            collegesummaryResults: [{COLLEGE: 'default', average_career_tenure: 0, average_wins_by_assoc: 0, average_losses_by_assoc: 0}],
            colIndex: 0,

        }
    }


    componentDidMount() {
        getAllPlayers(this.state.nameQuery, this.state.teamQuery)
        .then (res => {
            // console.log(res.results[0])
            this.setState({playersResults : res.results })
        })

        getCollegeSummary()
        . then( res => {
            this.setState({collegesummaryResults : res.results})
            // console.log(this.state.collegesummaryResults[0]);
            this.setState({colIndex : Math.floor( Math.random() * (res.results.length) + 0) })
            // console.log(this.state.colIndex);

        })
    }

    render() {
        return (

            <div>

                <MenuBar />
                <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <h3>NBA Feeder College Spotlight</h3>
                    <h4>Explore one of the more popular and successful colleges!</h4>
                    <Row>
                        <Col span={8}>
                        <img src="https://www.logolynx.com/images/logolynx/3d/3dd36656a1df7af576c4991ba58e6c45.jpeg"
                        width="350" height="260"></img>
                        </Col>

                        <Col span={12}>
                        <Card dataSource={this.state.collegesummaryResults} title= {this.state.collegesummaryResults[this.state.colIndex].COLLEGE} extra={
                            <Popover placement="right"  content={(
                                <div>
                                <p> Average NBA Career Tenure: </p>
                                <p> This is an average based on each players' first NBA appearance following NBA draft up until 2019. </p>
                                </div>
                            )} 
                            title= "Metric Overview">
                                More Info 
                            
                            </Popover>
                            } style={{ width: 308 }}>
                            <p>Average NBA Career Tenure: {this.state.collegesummaryResults[this.state.colIndex].average_career_tenure} </p>
                            <p>Average Associated Wins: {this.state.collegesummaryResults[this.state.colIndex].average_wins_by_assoc} </p>
                            <p>Average Associated Losses: {this.state.collegesummaryResults[this.state.colIndex].average_losses_by_assoc} </p>
                        </Card>
                        </Col>
                    </Row>

                    </div>
                    <br></br>
                <Divider />                  
                    <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    <h3>All NBA Players 2021</h3>
                    <h4>Hover over name for more info!</h4>
                    </div>
                        <Table style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }} 
                            dataSource={this.state.playersResults} columns={playerColumns} pagination={{ pageSizeOptions:[5, 10, 15], defaultPageSize: 10, showQuickJumper:true }}/>
                <Divider />

                {this.state.selectedPlayerDetails ? <div style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
                    

                </div> : null}

            </div>
        )
    }
}

export default PlayersPage

