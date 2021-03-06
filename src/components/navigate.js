import React from 'react';
import '../asset/navigate.css';

import {Layout, Menu, Avatar, Dropdown, Input,Button,Breadcrumb} from 'antd';

import {HomeFilled,DownSquareFilled} from '@ant-design/icons';
import Text from "antd/es/typography/Text";
import axios from 'axios';
import cookie from 'react-cookies';

import { Link,BrowserRouter as Router,Route} from 'react-router-dom';
const {Footer, Content} = Layout;


const {Search} = Input;
const {Header} = Layout;
const loginGithubUrl = "https://github.com/login/oauth/authorize?client_id=d25125e25fe36054a4de&redirect_uri=http://106.12.27.104/callback&scope=user&state=1";


//上方菜单栏实现

const userCenter = (
    <Menu theme="dark">
        <Menu.Item className="userCenterItemStyle">
            <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                个人中心
            </a>
        </Menu.Item>
        <Menu.Item className="userCenterItemStyle">
            <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                我的帖子
            </a>
        </Menu.Item>
        <Menu.Item className="userCenterItemStyle">
            <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                回复我的
            </a>
        </Menu.Item>
    </Menu>
);


//右上角登陆，注册界面下拉框实现
const notLogin = (
    <Menu theme="dark">
        <Menu.Item className="userCenterItemStyle">
            <Link to="/register">
                     {/*使用Link 选择要跳转的页面，button实现点击功能*/}
	     <Button className="e-button" type="primary"> 用 户 注 册 </Button>
             </Link>
        </Menu.Item>
        <Menu.Item className="userCenterItemStyle">
            <Link to="/login">
	     <Button className="e-button" type="primary"> 普 通 登 陆 </Button>
             </Link>
        </Menu.Item>
        <Menu.Item className="userCenterItemStyle">
            <a href={loginGithubUrl}><Button className="e-button" type="primary">GitHub登录</Button></a>

const notLogin = (
    <Menu theme="dark">
        <Menu.Item className="userCenterItemStyle">
            注册 
        </Menu.Item>
        <Menu.Item className="userCenterItemStyle">
            登录
        </Menu.Item>
        <Menu.Item className="userCenterItemStyle">
            <a href={loginGithubUrl}>GitHub登录</a>
        </Menu.Item>
    </Menu>
);


async function ToLogin(urlParam) {
    let code = urlParam.split("&")[0].split("=")[1];
    let state = urlParam.split("&")[1].split("=")[1];
    let formData = new FormData();
    formData.append('code',code);
    formData.append('state',state);
    let person_info = (await axios.post('/api/githubLogin',formData)).data;
    let success = person_info.state;
    if(success){
        let username = person_info.message.split(";")[0];
        let avatar_url = person_info.message.split(";")[1];
        cookie.save('login', success);
        cookie.save('username', username);
        cookie.save('avatarUrl', avatar_url);
    }
    return person_info;
}


class NavigateBar extends React.Component {
    async componentWillMount() {
        let url = document.URL;
        if (url.search("callback") !== -1) {
            let urlParam = url.split("?")[1];
            await ToLogin(urlParam);
            this.forceUpdate();
        }
    }

    render() {
        if (!cookie.load('login'))
            this.loginButton = 
            <Dropdown overlay={notLogin} className="dropdown">
                <a className="ant-dropdown-link" className="ant-dropdown-link" >
                    注册/登录&nbsp;&nbsp;<DownSquareFilled />
                </a>
            </Dropdown>;
        else
            this.loginButton = 
            <Dropdown overlay={userCenter} className="dropdown">
                <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                    {cookie.load('username')}&nbsp;&nbsp;<Avatar shape="square" size={28} src={cookie.load('avatarUrl')}/>
                </a>
            </Dropdown>;

        return (

                <Layout className="layout">
                <Header>
             

                <Header>

                    <div className="logo">
                        <a href="/index.html">
                            <HomeFilled twoToneColor/>
                            <Text style={{color: '#1890ff'}}>&nbsp;&nbsp;校园论坛</Text>
                        </a>
                    </div>
                    <div className="search">
                        <Search placeholder="搜索问题或找人" onSearch={value => console.log(value)} enterButton/>
                    </div>
                    <Menu size="small" theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                        <Menu.Item className="menuItemStyle" key="1">版面列表</Menu.Item>
                        <Menu.Item className="menuItemStyle" key="2">新帖</Menu.Item>
                        <Menu.Item className="menuItemStyle" key="3">通知</Menu.Item>
                        {this.loginButton}
                    </Menu>
                </Header>

       
          <Content style={{padding: '0 50px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>List</Breadcrumb.Item>
                    <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-content">Content</div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Design ©2020 by Group I</Footer>
        </Layout>

        );
    }
}

export default NavigateBar;