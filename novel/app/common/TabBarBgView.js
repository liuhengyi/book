/**
 * Created by Windy on 2018/8/9.
 */

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
} from 'react-native'

import {ifIphoneX, isIphoneX} from "../utils/ViewUtils";
import Constants from "./Constants";
import Theme from 'react-native-theming';
import Utils from "../utils/Utils";

export default class TabBarBgView extends Component {

    render() {
        return (
            <View style={[styles.container, this.props.style]}>
                {isIphoneX() ? <Theme.Image
                    style={styles.tabBarBg2}
                    source="@tabBarBg"
                    resizeMode={'cover'}/> : null}
                <Theme.Image
                    style={styles.tabBarBg}
                    source="@tabBarBg"
                    resizeMode={'cover'}/>
            </View>
        )
    }
}

const BgImgHeight = Utils.calcHeight(750/140, Constants.window.width);

const styles = StyleSheet.create({
    container: {
        zIndex: 100,
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        ...ifIphoneX({
            height:BgImgHeight + 34
        },{
            height:BgImgHeight
        })
    },
    tabBarBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: Constants.window.width,
        backgroundColor: 'transparent',
        height: BgImgHeight,
        ...ifIphoneX({
            bottom: 34,
        }, {
            bottom: 0,
        }),
    },
    tabBarBg2: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: Constants.window.width,
        backgroundColor: 'transparent',
        height: 44,
        bottom: 0,
    },
});
