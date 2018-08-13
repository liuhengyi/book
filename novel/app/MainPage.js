/**
 * Created by Windy on 2018/7/5.
 */

import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    Image,
    DeviceEventEmitter,
    TouchableOpacity,
} from 'react-native'

import TabNavigator from 'react-native-tab-navigator'
import Toast, { DURATION } from 'react-native-easy-toast'
import NetInfoDecorator from './common/NetInfoDecorator'
import Constants from './common/Constants'
import Utils from "./utils/Utils"
import images from  "./images"
import HomePage from "./pages/home/HomePage";
import Theme from 'react-native-theming';
import {ifIphoneX, isIphoneX} from "./utils/ViewUtils";
import BookShelf from "./pages/shelf/BookShelf";
import {observable, action} from 'mobx';
import {observer} from 'mobx-react';

const TAB_BAR_HEIGHT = Utils.calcHeight(750/140, Constants.window.width);
const TAB_BAR_BOTTOM = isIphoneX() ? 34 : 0;
class MobxStore {
    @observable
    tabBarHeight = TAB_BAR_HEIGHT;

    @observable
    tabBarBottom = TAB_BAR_BOTTOM;

    @action
    hide() {
        this.tabBarHeight = 0;
        this.tabBarBottom = -10;
        console.log('隐藏了');
    }

    @action
    show() {
        this.tabBarHeight = TAB_BAR_HEIGHT;
        this.tabBarBottom = TAB_BAR_BOTTOM;
        console.log('显示了');
    }
}

const store = new MobxStore();

@NetInfoDecorator
@observer
export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: Constants.tabName.Tab_Home,  // tb_shelf, tb_community, tb_discovery, tb_mine
            show: false,
            showComponent: null,
            theme: 'Dark',
        };
        Constants.themes.Dark.apply();
    }

    componentDidMount() {
        this.listener = DeviceEventEmitter.addListener(Constants.msgName.MSG_ShowToast, (text)=>{
            this.toast.show(text, DURATION.LENGTH_SHORT);
        });
        this.listener = DeviceEventEmitter.addListener(Constants.msgName.MSG_ShowFullScreen, (component)=>{
            this.setState({
                show: true,
                showComponent: component,
            });
        });
        this.listener = Utils.addListener(Constants.msgName.MSG_HiddenFullScreen, ()=>{
            this.dismissFullScreen();
        });

        this.listener = Utils.addListener(Constants.msgName.MSG_SwitchTheme, (theme)=>{
           if (!theme || theme === this.state.theme) return;
           this.setState({
               theme: theme,
           })
        });
    }

    componentWillUnmount() {
        this.listener && this.listener.remove();
    }

    componentWillReceiveProps(nextProps) {
        const {isConnected} = nextProps;
        if (!isConnected) {
            console.log(isConnected);
            this.toast.show('请检查网络状态', 2000);
        }
    }

    renderIcon(img, isSelected) {
        return (
            <Image
                style={isSelected ? styles.tabImageSelected : styles.tabImage}
                source={img}
                />
        )
    }

    genTabItem(Component, tabName, title, img, img_selected, badgeText) {

        let titleColor = {color: this.state.theme === 'Light' ?  Constants.colors.tabBarTitleColor_Light: Constants.colors.tabBarTitleColor_Dark};
        let titleSelectedColor = {color: this.state.theme === 'Light' ?  Constants.colors.tabBarTitleSelectedColor_Light: Constants.colors.tabBarTitleSelectedColor_Dark};
        return (
            <TabNavigator.Item
                selected={this.state.selectedTab === tabName}
                selectedTitleStyle={titleSelectedColor}
                title={title}
                titleStyle={[styles.tabTitle, titleColor]}
                renderIcon={()=> this.renderIcon(img, false)}
                renderSelectedIcon={()=>this.renderIcon(img_selected, true)}
                onPress={()=>this.setState({selectedTab: tabName})}
                badgeText={badgeText}>
                <Component {...this.props} store={store}/>
            </TabNavigator.Item>
        )
    }

    dismissFullScreen() {
        this.setState({
            show: false,
            showComponent: null,
        });
    }

    renderScreenLoad() {
        if (!this.state.showComponent) return null;
        return (
            <TouchableOpacity
                onPress={()=>this.dismissFullScreen()}
                activeOpacity={1}
                style={styles.fullScreen}
            >
                {this.state.showComponent}
            </TouchableOpacity>
        )
    }

    render() {
        return (
            <View style={styles.container}>

                {/*{isIphoneX() ? <Theme.Image
                    style={styles.tabBarBg2}
                    source="@tabBarBg"
                    resizeMode={'cover'}/> : null}
                <Theme.Image
                    style={styles.tabBarBg}
                    source="@tabBarBg"
                    resizeMode={'cover'}/>*/}

                <TabNavigator
                    tabBarStyle={[styles.tabBar, {height: store.tabBarHeight, bottom: store.tabBarBottom}]}
                    tabBarShadowStyle={{backgroundColor: 'transparent'}}
                    sceneStyle={styles.tabBarSceneStyle}
                    removeClippedSubviews={false}
                >
                    {this.genTabItem(HomePage, Constants.tabName.Tab_Home, '首页', images.tab_home, images.tab_home_selected)}
                    {this.genTabItem(BookShelf, Constants.tabName.Tab_Shelf, '书架', images.tab_shelf, images.tab_shelf_selected)}
                    {this.genTabItem(View, Constants.tabName.Tab_BookCity, '书城', images.tab_bookcity, images.tab_bookcity_selected, '1')}
                    {this.genTabItem(View, Constants.tabName.Tab_Community, '社区', images.tab_community, images.tab_community_selected)}
                    {this.genTabItem(View, Constants.tabName.Tab_Mine, '我的', images.tab_mine, images.tab_mine_selected)}
                </TabNavigator>
                <Toast ref={toast=>this.toast=toast}/>
                {this.renderScreenLoad()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    tabBar: {
        position: 'absolute',
        left: 0,
        right: 0,
        backgroundColor: 'transparent',
    },
    tabBarSceneStyle: {
      paddingBottom: 0,
    },
    tabBarBg: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: Constants.window.width,
        backgroundColor: 'transparent',
        ...ifIphoneX({
            height: Utils.calcHeight(750/140, Constants.window.width),
            bottom: 34,
        }, {
            height: Utils.calcHeight(750/140, Constants.window.width),
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
    tabImage: {
        width: 45,
        height: 45,
    },
    tabImageSelected: {
        width: 55,
        height: 55,
    },
    tabTitle: {
        fontSize: 12,
    },
    fullScreen: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
    },
});
