/**
 * Created by Windy on 2018/7/9.
 */

import React, {Component} from 'react'
import {
    View,
    StyleSheet,
    FlatList,
    Text,
    TouchableOpacity,
    NativeModules,
} from 'react-native'
import NavigationBar from "../../common/NavigationBar";
import ViewUtils from "../../utils/ViewUtils";
import Constants from "../../common/Constants";
import Utils from "../../utils/Utils";

var PushNative = null;
if (Constants.isIOS) {
    PushNative = NativeModules.PushNative;
}

export default class TestList extends Component {

    constructor(props) {
        super(props);

        this.state = {
            data: [],
        };

        this.initDataSource();
    }

    initDataSource() {
        {
            let Item = {
                title: '夜间模式',
                component: null,
                action: ()=> this._switchTheme(Constants.themes.Dark),
            };
            this.state.data.push(Item);
        }
        {
            let Item = {
                title: '日间模式',
                component: null,
                action: ()=>this._switchTheme(Constants.themes.Light),
            };
            this.state.data.push(Item);
        }
        {
            let Item = {
                title: '阅读',
                component: null,
                action: ()=>this._goToReadPage(),
            };
            this.state.data.push(Item);
        }
    }

    _switchTheme(theme) {
        if (theme) {
            theme.apply();
            if (theme === Constants.themes.Light) {
                Utils.postMsg(Constants.msgName.MSG_SwitchTheme, 'Light');
            } else {
                Utils.postMsg(Constants.msgName.MSG_SwitchTheme, 'Dark');
            }
        }
    }

    _goToReadPage() {
        PushNative && PushNative.goToBookReadPage('123');
    }

    _renderItem(item) {
        return (
            <TouchableOpacity
                style={{
                    paddingLeft: 10,
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(33, 33, 33, 0.3)',
                    height: 44,
                    justifyContent: 'center',
                }}
                onPress={()=>{
                    item.component && this.props.navigator.push(item.component);
                    item.action && item.action();
                }}
            >
                <Text
                    style={{
                        fontSize: 16,
                    }}
                >
                    {item.title}
                </Text>
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>
                <NavigationBar
                    title={'测试'}
                    leftButton={ViewUtils.renderBackItem('main',()=>{
                        this.props.navigator.pop();
                    })}
                />
                <FlatList
                    data={this.state.data}
                    renderItem={({item})=>this._renderItem(item)}
                    keyExtractor={(item, index)=>{return item.title}}
                />
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
});