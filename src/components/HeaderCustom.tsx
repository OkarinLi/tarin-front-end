
import React, { Component } from 'react';
import screenfull from 'screenfull';
import avater from '../style/imgs/b1.jpg';
import SiderCustom from './SiderCustom';
import { Menu, Icon, Layout, Badge, Popover } from 'antd';
import { gitOauthToken, gitOauthInfo } from '../service';
import { queryString } from '../utils';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { PwaInstaller } from './widget';
import { connectAlita } from 'redux-alita';
import umbrella from 'umbrella-storage';
const { Header } = Layout;
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

type HeaderCustomProps = RouteComponentProps<any> & {
    toggle: () => void;
    collapsed: boolean;
    user: any;
    responsive?: any;
    path?: string;
};
type HeaderCustomState = {
    user: any;
    visible: boolean;
};

class HeaderCustom extends Component<HeaderCustomProps, HeaderCustomState> {
    state = {
        user: '',
        visible: false,
    };
    componentDidMount() {
        const QueryString = queryString() as any;
        let storageUser = umbrella.getLocalStorage('user');

        // _user = (storageUser && JSON.parse(storageUser)) || '测试';
        if (!storageUser && QueryString.hasOwnProperty('code')) {
            gitOauthToken(QueryString.code).then((res: any) => {
                gitOauthInfo(res.access_token).then((info: any) => {
                    this.setState({
                        user: info,
                    });
                    umbrella.setLocalStorage('user', info);
                });
            });
        } else {
            this.setState({
                user: storageUser,
            });
        }
    }
    screenFull = () => {
        if (screenfull.isEnabled) {
            screenfull.request();
        }
    };
    menuClick = (e: { key: string }) => {
        e.key === 'logout' && this.logout();
    };
    logout = () => {
        umbrella.removeLocalStorage('user');
        this.props.history.push('/login');
    };
    popoverHide = () => {
        this.setState({
            visible: false,
        });
    };
    handleVisibleChange = (visible: boolean) => {
        this.setState({ visible });
    };
    render() {
        const { responsive } = this.props;
        return (
            <Header className="custom-theme header">
                {responsive.data.isMobile ? (
                    <Popover
                        content={<SiderCustom popoverHide={this.popoverHide} />}
                        trigger="click"
                        placement="bottomLeft"
                        visible={this.state.visible}
                        onVisibleChange={this.handleVisibleChange}
                    >
                        <Icon type="bars" className="header__trigger custom-trigger" />
                    </Popover>
                ) : (
                    <Icon
                        className="header__trigger custom-trigger"
                        type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'}
                        onClick={this.props.toggle}
                    />
                )}
                <Menu
                    mode="horizontal"
                    style={{ lineHeight: '64px', float: 'right' }}
                    onClick={this.menuClick}
                >
                    {/* <Menu.Item key="pwa">
                        <PwaInstaller />
                    </Menu.Item>
                    <Menu.Item key="full" onClick={this.screenFull}>
                        <Icon type="arrows-alt" onClick={this.screenFull} />
                    </Menu.Item>
                    <Menu.Item key="1">
                        <Badge count={25} overflowCount={10} style={{ marginLeft: 10 }}>
                            <Icon type="notification" />
                        </Badge>
                    </Menu.Item> */}
                    <SubMenu
                        title={
                            <span>
                                Settings
                            </span>
                        }
                    >
                        <MenuItemGroup title="">
                            {/* <Menu.Item key="setting:1">你好 - {this.props.user.userName}</Menu.Item>
                            <Menu.Item key="setting:2">个人信息</Menu.Item> */}
                            <Menu.Item key="logout">
                                <span onClick={this.logout}>Logout</span>
                            </Menu.Item>
                        </MenuItemGroup>
                        {/* <MenuItemGroup title="设置中心">
                            <Menu.Item key="setting:3">个人设置</Menu.Item>
                            <Menu.Item key="setting:4">系统设置</Menu.Item>
                        </MenuItemGroup> */}
                    </SubMenu>
                </Menu>
            </Header>
        );
    }
}

// 重新设置连接之后组件的关联类型
const HeaderCustomConnect: React.ComponentClass<
    HeaderCustomProps,
    HeaderCustomState
> = connectAlita([{ responsive: { isMobile: false } }])(HeaderCustom);

export default withRouter(HeaderCustomConnect);
