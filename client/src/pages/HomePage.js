import React from 'react';
import { Form, FormInput, FormGroup, Row, Col, Card, CardBody, CardImg, CardTitle, CardSubtitle, Button, CardGroup, Slider } from "shards-react";
import { Table, Divider} from 'antd';
import MenuBar from '../components/MenuBar';
import { getPlayers } from '../fetcher'
const { Column } = Table;
class HomePage extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      playersResults: [],
      nameQuery: '',
      positionQuery: '',
      salary: [0, 46000000],
      total: 0,
      team: []
    }
    this.updateSearchResults = this.updateSearchResults.bind(this)
    this.handleNameQueryChange = this.handleNameQueryChange.bind(this)
    this.handlePositionQueryChange = this.handlePositionQueryChange.bind(this)
    this.handleSalaryChange = this.handleSalaryChange.bind(this)
    this.removeTeamMember = this.removeTeamMember.bind(this);
    this.addTeamMember = this.addTeamMember.bind(this);
  }
  
  handleNameQueryChange(event) {
    this.setState({ nameQuery: event.target.value })
  }

  handlePositionQueryChange(event) {
      this.setState({ positionQuery: event.target.value })
  }

  handleSalaryChange(value) {
      this.setState({ salary: [parseFloat(value[0]), parseFloat(value[1])] })
  }

  updateSearchResults() {
    getPlayers(this.state.nameQuery, this.state.positionQuery, this.state.salary[0], this.state.salary[1]).then(res => {
        this.setState({ playersResults: res.results })
    })
  }

  removeTeamMember(TeamMember) {
    let teamMembers = this.state.team.filter(function(item) {
      return item.PLAYER_ID !== TeamMember.PLAYER_ID;
    });
    let sum = teamMembers.reduce((total, item) => {
      return total + item.Salary;
    }, 0);
    this.setState({ team: teamMembers, total: sum });
  }

  addTeamMember(newTeamMember) {
    if(this.state.team.length < 5 && !this.state.team.includes(newTeamMember) ) {
    let newTeam = this.state.team.concat([newTeamMember]);
    let sum = newTeam.reduce((total, item) => {
      return total + item.Salary;
    }, 0);
    this.setState({ team: newTeam, total: sum });
    }
  }

  componentDidMount() {

    getPlayers(this.state.nameQuery, this.state.positionQuery, this.state.salary[0], this.state.salary[1]).then(res => {
      this.setState({ playersResults: res.results })
  })

  }


  render() {

    return (
      <div>
        <MenuBar />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
        <Card>
          <CardBody>
            <CardTitle>Welcome to NBA Hub!</CardTitle>
            On this page you can build your dream NBA team with active players in season 2020-2021.
            If you are interested in more information about NBA, don't hesitate to check our Game, Player and Team pages.
          </CardBody>
        </Card>
        </div>
        <Divider />
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h4>Your Dream Team</h4>
          <h6>Total Salary: ${this.state.total}</h6>
          <div style={{ width: '100vw', margin: '0 auto', marginTop: '2vh' }}></div>
          <CardGroup>
            {this.state.team.map((card) =>(
                <Card>
                  <CardImg src={`https://ak-static.cms.nba.com/wp-content/uploads/headshots/nba/latest/260x190/${card.PLAYER_ID}.png`} />
                  <CardBody>
                    <CardTitle>{card.NAME}</CardTitle>
                    <CardSubtitle>{card.TEAM}</CardSubtitle>
                    <div className='new-line'><b>Position</b>: <i>{card.POSITION}</i></div>
                    <div className='new-line'><b>Points</b>: <i>{card.POINTS}</i></div>
                    <div className='new-line'><b>Rebounds</b>: <i>{card.REBOUND}</i></div>
                    <div className='new-line'><b>Assists</b>: <i>{card.ASSIST}</i></div>
                    <div className='new-line'><b>Steals</b>: <i>{card.STEAL}</i></div>
                    <div className='new-line'><b>Blocks</b>: <i>{card.BLOCK}</i></div>
                    <div className='new-line'><b>Salary</b>: <i>{card.Salary}</i></div>
                    <button className="btn btn-danger" onClick={this.removeTeamMember.bind(this, card)} type="button">Remove</button>
                  </CardBody>
                </Card>
              ))}
          </CardGroup>
        <Divider />
        </div>

        <Form style={{ width: '80vw', margin: '0 auto', marginTop: '5vh' }}>
        <div style={{ width: '70vw', margin: '0 auto', marginTop: '5vh' }}>
          <h4>Search Players Here</h4>
          </div>
          <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                  <label>Name</label>
                  <FormInput placeholder="Name" value={this.state.nameQuery} onChange={this.handleNameQueryChange} />
              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                  <label>Position</label>
                  <FormInput placeholder="Position" value={this.state.positionQuery} onChange={this.handlePositionQueryChange} />
              </FormGroup></Col>
          </Row>
          <br></br>
          <Row>
              <Col flex={2}><FormGroup style={{ width: '20vw', margin: '0 auto' }}>
                  <label>Salary: {JSON.stringify(this.state.salary)}</label>
                  <Slider theme="danger" pips={{ mode: "steps", stepped: true, density: 3 }} range={{ min: 0, max: 46000000 }} connect start={this.state.salary} onSlide={this.handleSalaryChange} />

              </FormGroup></Col>
              <Col flex={2}><FormGroup style={{ width: '10vw' }}>
                  <Button theme="danger" style={{ marginTop: '8vh' }} onClick={this.updateSearchResults}>Search</Button>
              </FormGroup></Col>
          </Row>
        </Form>
        <Divider />
        <Table dataSource={this.state.playersResults} pagination={{ pageSizeOptions:[5, 10], defaultPageSize: 5, showQuickJumper:true }} style={{ width: '70vw', margin: '0 auto', marginTop: '2vh' }}>
          <Column title="Name" dataIndex="NAME" key="NAME" />
          <Column title="Position" dataIndex="POSITION" key="POSITION" />
          <Column title="Team" dataIndex="TEAM" key="TEAM" />
          <Column sorter={(a, b) => a.POINTS - b.POINTS} title="PTS" dataIndex="POINTS" key="POINTS" />
          <Column sorter={(a, b) => a.REBOUND - b.REBOUND} title="REB" dataIndex="REBOUND" key="REBOUND" />
          <Column sorter={(a, b) => a.ASSIST - b.ASSIST} title="AST" dataIndex="ASSIST" key="ASSIST" />
          <Column sorter={(a, b) => a.STEAL - b.STEAL} title="STL" dataIndex="STEAL" key="STEAL" />
          <Column sorter={(a, b) => a.BLOCK - b.BLOCK} title="BLK" dataIndex="BLOCK" key="BLOCK" />
          <Column sorter={(a, b) => a.Salary - b.Salary} title="Salary" dataIndex="Salary" key="Salary" />
          <Column title="Action" key="action" render={(text, row) => <button className="btn btn-primary" onClick={this.addTeamMember.bind(this, row)} type="button">Add</button>} />
        </Table>

      </div>
    )
  }

}

export default HomePage

