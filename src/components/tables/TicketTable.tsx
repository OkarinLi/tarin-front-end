
import React from "react";
import { Row, Col, Card, Select, Button, Table, DatePicker, Modal, message } from "antd";
import BasicTable from "./BasicTable";
import { getStationList, getTrainTicket,addTicket } from "../../service/index";
import BreadcrumbCustom from "../BreadcrumbCustom";
import moment from "moment";
import umbrella from "umbrella-storage";

const dateFormat = "YYYY-MM-DD";
const { Option } = Select;

class TicketTable extends React.Component {
  state = {
    stationList: [],
    departureStation: "",
    arrivalStation: "",
    tableData: [],
    time: moment().format("YYYY-MM-DD"),
    modalShow: false,
    train_id: "",
    modalData: [],
    selectedContact:{
      name:'',
      identity_card:''
    }
  };

  columns = [
    {
      title: "Train Number",
      dataIndex: "sequence",
      key: "sequence",
    },
    {
      title: "Seat Amount",
      dataIndex: "seat_amount",
      key: "seat_amount",
    },
    {
      title: "operation",
      dataIndex: "operation",
      render: (text: any, record: any) => {
        return (
          <Button type="primary" onClick={() => this.showModal(record.key)}>
            Purchase
          </Button>
        );
      },
    },
  ];

  modalColumns = [
    { title: "Contact Name", dataIndex: "name", key: "name" },
    { title: "Telephone", dataIndex: "telephone", key: "telephone" },
    { title: "Identity Card", dataIndex: "identity_card", key: "identity_card" },
  ];
  componentDidMount() {
    this.getStationList();
  }
  getStationList = () => {
    getStationList().then((res) => {
      this.setState({ stationList: res.data });
    });
  };
  handleChangeDeparture = (value: String) => {
    this.setState({ departureStation: value });
  };
  handleChangeArrival = (value: String) => {
    this.setState({ arrivalStation: value });
  };
  disabledDate = (current: any) => {
    // You cannot select dates before today
    return current && current < moment().subtract(1, "days");
  };
  handleTimeChange = (value: any) => {
    this.setState({ time: value.format("YYYY-MM-DD") });
  };

  handleSearch = () => {
    const { departureStation, arrivalStation, time } = this.state;
    getTrainTicket(departureStation, arrivalStation, time).then((res) => {
      let data = res.data;
      data.map((item: any) => (item.key = item.id));
      this.setState({ tableData: data });
    });
  };

  showModal = (key: any) => {
    debugger
    let user = umbrella.getLocalStorage("user");
    let contact = user.contact
    contact.map((item:any)=>item.key = item.id)
    this.setState({ modalShow: true, train_id: key, modalData: contact });
  };

  purchaseTicket = () => {
    let user = umbrella.getLocalStorage("user");
    const {train_id,selectedContact,time} = this.state
    let data:any = {}
    data.train_id = train_id
    data.user_id = user.id
    data.identity_card = selectedContact.identity_card
    data.name = selectedContact.name
    data.travel_time = time
    addTicket(data).then(res=>{
      console.log(res)
      message.success('Purchase success!')
      this.setState({modalShow:false})
      this.handleSearch()
    }).catch(e=>{
      console.log(e)
    })
  };

  handleCancel = () => {
    this.setState({ modalShow: false });
  };


  render() {
    return (
      <div className="gutter-example">
        <Modal
          title=""
          visible={this.state.modalShow}
          onOk={this.purchaseTicket}
          onCancel={this.handleCancel}
          okText="Confirm"
        >
          <Table
          pagination={false}
            columns={this.modalColumns}
            dataSource={this.state.modalData}
            rowSelection={{
              type: "radio",
              onChange: (selectedRowKeys:any, selectedRows:any) => {
                console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
                this.setState({selectedContact:selectedRows[0]})
              },
              getCheckboxProps: (record:any) => ({
                // disabled: record.name === 'Disabled User', // Column configuration not to be checked
                name: record.name,
              }),
            }}
          />
        </Modal>
        <BreadcrumbCustom first="Ticket Purchase" />
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card title="Ticket Purchase" bordered={false}>
                <Select
                  style={{ width: 160, marginRight: "20px" }}
                  onChange={this.handleChangeDeparture}
                  defaultValue="Departure Station"
                >
                  {this.state.stationList.map((item: any) => {
                    return (
                      <Option value={item.station_name}>
                        {item.station_name}
                      </Option>
                    );
                  })}
                </Select>
                <Select
                  style={{ width: 160, marginRight: "20px" }}
                  onChange={this.handleChangeArrival}
                  defaultValue="Arrival Station"
                >
                  {this.state.stationList.map((item: any) => {
                    return (
                      <Option value={item.station_name}>
                        {item.station_name}
                      </Option>
                    );
                  })}
                </Select>
                <DatePicker
                  disabledDate={this.disabledDate}
                  format={dateFormat}
                  style={{ marginRight: "20px" }}
                  onChange={this.handleTimeChange}
                  defaultValue={moment()}
                />
                <Button type="primary" onClick={this.handleSearch}>
                  Search
                </Button>
                <Table
                  columns={this.columns}
                  dataSource={this.state.tableData}
                />
              </Card>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TicketTable;
