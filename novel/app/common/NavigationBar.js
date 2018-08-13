/**
 * Created by Windy on 2018/3/24.
 */

import React, { Component } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Platform,
    StatusBar,
    Image,
} from 'react-native';
import PropTypes from 'prop-types'
import Constants from "./Constants";
import Theme from 'react-native-theming';
import {ifIphoneX} from "../utils/ViewUtils";

const NAV_BAR_HEIGHT_ANDROID = 50;
const NAV_BAR_HEIGHT_IOS = 44;
const STATUS_BAR_HEIGHT = 20;
const StatusBarShape = {
    backgroundColor: PropTypes.string,
    barStyle: PropTypes.oneOf(['default', 'light-content', 'dark-content']),
    hide: PropTypes.bool,
};

export default class NavigationBar extends Component {
    static propTypes = {
        style: View.propTypes.style,
        title: PropTypes.string,
        titleStyle: Text.propTypes.style,
        titleView: PropTypes.element,
        hide: PropTypes.bool,
        leftButton: PropTypes.element,
        rightButton: PropTypes.element,
        statusBar: PropTypes.shape(StatusBarShape),
        lineHide: PropTypes.bool,
        bgImage: PropTypes.any,
    };

    static defaultProps = {
        statusBar: {
            barStyle: 'default',
            hide: false,
        },
        titleStyle: {
            color: '#000',
        },
    };

    constructor(props) {
        super(props);
        this.state = {
            title: '',
            hide: false,
            lineHide: props.lineHide,
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            lineHide: nextProps.lineHide,
        })
    }

    createLine(){
        return(
            <View style={styles.line}/>
        );
    }
    render() {
        //, this.props.statusBar
        const lineComponent = this.state.lineHide ? null :this.createLine();
        let statusBar = <View style={[styles.statusBar]}>
            <StatusBar {...this.props.statusBar}/>
        </View>;
        let titleView = this.props.titleView ? this.props.titleView :
            <Text style={[styles.title, this.props.titleStyle]}>{this.props.title}</Text>
        let content = <View style={styles.navBar}>
            <View style={{zIndex: 10}}>
                {this.props.leftButton}
            </View>
            <View style={styles.titleViewContainer}>
                {titleView}
            </View>
            <View style={{zIndex: 10}}>
                {this.props.rightButton}
            </View>
            {lineComponent}
        </View>;
        let backImage = this.props.bgImage ? <Theme.Image source={this.props.bgImage} style={styles.bgImage}/> : null;
        return (
            <View style={[styles.container, this.props.style]}>
                {backImage}
                {statusBar}
                {content}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
    },
    navBar: {
        justifyContent: 'space-between',
        alignItems: 'center',
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
        // backgroundColor: 'red',
        flexDirection: 'row',
    },
    titleViewContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: 'red',
        position: 'absolute',
        left: 40,
        right: 40,
        top: 0,
        bottom: 0,
        zIndex: 0,
    },
    title: {
        fontSize: 20,
        // color: 'white',
    },
    statusBar: {
        height: Platform.OS === 'ios' ? STATUS_BAR_HEIGHT : 0,
        ...ifIphoneX({
            height: STATUS_BAR_HEIGHT + 24,
        }),
    },
    line: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 0.8,
        backgroundColor: '#333',
        opacity: 0.2,
    },
    bgImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Constants.window.width,
        height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS + STATUS_BAR_HEIGHT : NAV_BAR_HEIGHT_ANDROID,
        ...ifIphoneX({
            height: NAV_BAR_HEIGHT_IOS + STATUS_BAR_HEIGHT + 24,
        }),
    }
});