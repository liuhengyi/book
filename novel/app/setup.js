/**
 * Created by Windy on 2018/7/5.
 */

import React, { Component } from 'react'

import Navigator from 'react-native-deprecated-custom-components'
import MainPage from './MainPage'

function setup() {
    // 进行初始化配置
    class Root extends Component {

        renderScene(route, navigator) {
            let Component = route.component;
            return <Component {...route.passProps} navigator={navigator}/>
        }

        render() {
            return (
                // 指定初始化完成后的导航路由
                <Navigator.Navigator
                    initialRoute={{component: MainPage}}
                    renderScene={(route, navigator)=>this.renderScene(route, navigator)}
                />
            )
        }
    }

    return <Root/>
}

module.exports = setup;
