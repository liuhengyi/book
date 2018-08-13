/**
 * Created by Windy on 2018/4/9.
 * 检测网络
 */

import React, { Component } from 'react'
import {
    NetInfo,
} from 'react-native'

const NetInfoDecorator = WrappedComponent => class extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isConnected: true,
        }
    }

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this._handleNetworkChanged);
    }

    componentWillUnmount() {

    }

    _handleNetworkChanged = isConnected => this.setState({isConnected});

    render() {
        return <WrappedComponent {...this.props} {...this.state}/>
    }

}

export default NetInfoDecorator
