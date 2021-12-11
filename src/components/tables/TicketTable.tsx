/**
 * Created by hao.cheng on 2017/4/15.
 */
import React from "react";
import { Row, Col, Card, Select, Button,Table } from "antd";
import BasicTable from "./BasicTable";
import { getStationList,getTrainTicket } from "../../service/index";
import BreadcrumbCustom from "../BreadcrumbCustom";


const { Option } = Select;
const columns = [
    {
        title: 'Train Number',
        dataIndex: 'sequence',
        key: 'sequence',
    },
    {
        title: 'Seat Amount',
        dataIndex: 'seat_amount',
        key: 'seat_amount',
    }]

class TicketTable extends React.Component {
  state = {
    stationList: [],
    departureStation:'',
    arrivalStation:'',
    tableData:[]
  };
  componentDidMount() {
    this.getStationList();
  }
  getStationList = () => {
    getStationList().then((res) => {
      this.setState({ stationList: res.data });
    });
  };
  handleChangeDeparture= (value:String) => {
    this.setState({departureStation:value})
  };
  handleChangeArrival= (value:String) => {
    this.setState({arrivalStation:value})
  };

  handleSearch=()=>{
      const{departureStation,arrivalStation} = this.state
    getTrainTicket(departureStation,arrivalStation).then(res=>{
        this.setState({tableData:res.data})
    })
  }
  render() {
    return (
      <div className="gutter-example">
        <BreadcrumbCustom first="Ticket Purchase" />
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card title="Ticket Purchase" bordered={false}>
                <Select
                  style={{ width: 160,marginRight:'20px' }}
                  onChange={this.handleChangeDeparture}
                  defaultValue='Departure Station'
                >
                    {this.state.stationList.map((item:any)=>{
                        return(<Option value={item.station_name}>
                        {item.station_name}
                        </Option>)
                    })
                    }
                </Select>
                <Select
                  style={{ width: 160, marginRight:'20px' }}
                  onChange={this.handleChangeArrival}
                  defaultValue='Arrival Station'
                >
                    {this.state.stationList.map((item:any)=>{
                        return(<Option value={item.station_name}>
                        {item.station_name}
                        </Option>)
                    })
                    }
                </Select>
                <Button type='primary' onClick={this.handleSearch}>Search</Button>
                <Table columns={columns} dataSource={this.state.tableData} />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TicketTable;
