/**
 * Created by Windy on 2018/7/9.
 */

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
} from 'react-native'
import NavigationBar from "../../common/NavigationBar";
import images from "../../images";
import TestList from "../test/TestList";
import TabBarBgView from "../../common/TabBarBgView";

export default class HomePage extends Component {
    constructor(props) {
        super(props);

    }

    _renderSearchButton() {
        return(
            <TouchableOpacity
                style={{paddingRight: 15, paddingLeft: 15, paddingTop: 10, paddingBottom: 10}}
                activeOpacity={1}
                onPress={()=>{this._onSearchPress()}}
            >
                <Image source={images.search} style={styles.searchBtn}/>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <TabBarBgView/>
                <NavigationBar
                    title={'首页'}
                    titleStyle={{color:'white'}}
                    bgImage={'@navBarBg'}
                    rightButton={this._renderSearchButton()}
                />
            </View>
        )
    }

    _onSearchPress() {
        this.props.navigator.push({
            component: TestList,
        })
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    searchBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 20,
        height: 20,
    },
});
