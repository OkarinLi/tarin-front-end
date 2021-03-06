import React from "react";
import {
  Row,
  Col,
  Card,
  Table,
  Button,
  Input,
  Popconfirm,
  Form,
  InputNumber,
} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
import {
  getUserInfo,
  updateUserInfo,
  deleteContact,
  getTicketById,
  refundTicket
} from "../../service/index";
import umbrella from "umbrella-storage";
import ModalForm from "../forms/ModalForm";

const FormItem = Form.Item;
const EditableContext = React.createContext({});

type EditableRowProps = {
  form: any;
  index: any;
};
const EditableRow = ({ form, index, ...props }: EditableRowProps) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
type EditableCellProps = {
  inputType: string;
  editing: boolean;
  dataIndex: number;
  title: string;
  record: any;
  index: number;
};
class EditableCell extends React.Component<EditableCellProps> {
  getInput = () => {
    if (this.props.inputType === "number") {
      return <InputNumber />;
    }
    return <Input />;
  };
  render() {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      ...restProps
    } = this.props;
    return (
      <EditableContext.Consumer>
        {(form: any) => {
          const { getFieldDecorator } = form;
          return (
            <td {...restProps}>
              {editing ? (
                <FormItem style={{ margin: 0 }}>
                  {getFieldDecorator(dataIndex, {
                    rules: [
                      {
                        required: true,
                        message: `Please Input ${title}!`,
                      },
                    ],
                    initialValue: record[dataIndex],
                  })(this.getInput())}
                </FormItem>
              ) : (
                restProps.children
              )}
            </td>
          );
        }}
      </EditableContext.Consumer>
    );
  }
}
type MyTablesProps = {};
type MyTablesState = {
  dataSource: any;
  editingKey: string;
  TicketData:any
};
class MyTables extends React.Component<MyTablesProps, MyTablesState> {
  constructor(props: any) {
    super(props);
    this.state = {
      dataSource: [],
      TicketData:[],
      editingKey: "",
    };
    this.orderColumns = [
      {
        title: "Train",
        dataIndex: "sequence",
        key: "sequence",
      },
      {
        title: "Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Identity Card",
        dataIndex: "identity_card",
        key: "identity_card",
      },
      {
        title: "Time",
        dataIndex: "travel_time",
        key: "travel_time",
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (text: any, record: any) => {
          return (
            <Button type="primary" onClick={() => this.refundTicket(record)}>
              Refund
            </Button>
          );
        },
      },
    ];
    this.columns = [
      {
        title: "User Name",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Telephone",
        dataIndex: "telephone",
        key: "telephone",
        editable: true,
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
        editable: true,
      },
      {
        title: "Identity Card",
        dataIndex: "id",
        key: "id",
        editable: true,
      },
      {
        title: "operation",
        dataIndex: "operation",
        render: (text: any, record: any) => {
          const editable = this.isEditing(record);
          return (
            <div>
              {editable ? (
                <span>
                  <EditableContext.Consumer>
                    {(form: any) => (
                      <Button
                        onClick={() => this.save(form, record.key)}
                        style={{ marginRight: 8 }}
                      >
                        Save
                      </Button>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                    title="Sure to cancel?"
                    onConfirm={() => this.cancel()}
                  >
                    <Button>Cancel</Button>
                  </Popconfirm>
                </span>
              ) : (
                <Button onClick={() => this.edit(record.key)}>Edit</Button>
              )}
            </div>
          );
        },
      },
    ];
  }

  componentDidMount() {
    this.getUser();
    this.getTicketData()
  }

  refundTicket=(record:any)=>{
    record.travel_time = record.travel_time.substr(0,10)
    delete(record.sequence)
    delete(record.key)
    // debugger
    refundTicket(record).then(res=>{
      this.getTicketData()
    }).catch(e=>{
      console.log(e)
    })
  }
  getTicketData=()=>{
    let user = umbrella.getLocalStorage("user")
    getTicketById(user.id).then(res=>{
        let data = res.data;
        data.map((item:any)=>{
            item.key=item.id
        })
        this.setState({TicketData:res.data})
    })
  }

  
  getUser = () => {
    let user = umbrella.getLocalStorage("user");
    getUserInfo(user.id)
      .then((res) => {
        umbrella.setLocalStorage("user", res.data);
        let data = res.data;
        this.setState({
          dataSource: [
            {
              key: data.id ? data.id : "-",
              name: data.user_name ? data.user_name : "-",
              telephone: data.telephone ? data.telephone : "-",
              email: data.email ? data.email : "-",
              id: data.identity_card ? data.identity_card : "-",
              contact: data.contact,
            },
          ],
        });
      })
      .catch((err) => console.log(err));
  };
  columns: any[];
  orderColumns: any;
  isEditing = (record: any) => {
    return record.key === this.state.editingKey;
  };
  edit(key: string) {
    this.setState({ editingKey: key });
  }
  save(form: any, key: string) {
    form.validateFields((error: any, row: any) => {
      if (error) {
        return;
      }
      const newData = [...this.state.dataSource];
      const index = newData.findIndex((item) => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        this.setState({ editingKey: "" });
        updateUserInfo(newData[0])
          .then((res) => {
            if (res.resultCode === 200) {
              this.getUser();
            }
          })
          .catch((err) => console.log(err));
      } else {
        // newData.push(data);
        this.setState({ editingKey: "" });
      }
    });
  }
  cancel = () => {
    this.setState({ editingKey: "" });
  };
  expandedRow = () => {
    const childColumns = [
      { title: "Contact Name", dataIndex: "name", key: "name" },
      { title: "Telephone", dataIndex: "telephone", key: "telephone" },
      { title: "Identity Card", dataIndex: "id", key: "id" },
      {
        title: "Action",
        dataIndex: "",
        key: "x",
        render: (record: any) => (
          <Button onClick={this.deleteContact.bind(this, record)}>
            Delete
          </Button>
        ),
      },
    ];
    const data: any = [];
    let contact: Array<any> = this.state.dataSource[0]["contact"];
    console.log(contact);
    contact.map((i: any) => {
      data.push({
        key: i.id,
        name: i.name,
        telephone: i.telephone,
        id: i.identity_card,
      });
    });
    return (
      <Table columns={childColumns} dataSource={data} pagination={false} />
    );
  };

  deleteContact = (record: any) => {
    deleteContact(record.key)
      .then((res) => {
        this.getUser();
      })
      .catch((err) => console.log(err));
  };
  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    const orderColumns = this.orderColumns
    const columns = this.columns.map((col) => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: (record: any) => ({
          record,
          inputType: col.dataIndex === "age" ? "number" : "text",
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
      };
    });
    return (
      <div className="gutter-example">
        <BreadcrumbCustom first="Personal Center" />
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card title="My Account" bordered={false}>
                {/* <Button type="primary" onClick={()=>{}}>New Contact</Button> */}
                <ModalForm getUser={this.getUser} />
                <Table
                  components={components}
                  columns={columns}
                  expandedRowRender={this.expandedRow}
                  expandedRowKeys={this.state.dataSource.map(
                    (item: any) => item.key
                  )}
                  dataSource={this.state.dataSource}
                  rowClassName={(record: any, index: number) => "editable-row"}
                  expandIcon={() => <span> </span>}
                />
              </Card>
            </div>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col className="gutter-row" md={24}>
            <div className="gutter-box">
              <Card title="My Orders" bordered={false}>
                <Table columns={orderColumns} dataSource={this.state.TicketData}/>
              </Card>
            </div>
          </Col>
        </Row>
        {/* <Row gutter={16}>
                     <Col className="gutter-row" md={12}>
                         <div className="gutter-box">
                             <Card title="?????????" bordered={false}>
                                 <ExpandedTable />
                             </Card>
                         </div>
                     </Col>
                     <Col className="gutter-row" md={12}>
                         <div className="gutter-box">
                             <Card title="?????????" bordered={false}>
                                 <EditableTable />
                             </Card>
                         </div>
                     </Col>
                 </Row>  */}
      </div>
    );
  }
}

export default MyTables;
