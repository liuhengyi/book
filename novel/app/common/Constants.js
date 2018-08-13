/**
 * Created by Windy on 2018/7/5.
 */

import {
    Dimensions,
    Platform,
} from 'react-native'
import { createTheme } from "react-native-theming";
import images from "../images";
const NAV_BAR_HEIGHT_ANDROID = 50;
const NAV_BAR_HEIGHT_IOS = 44;

let colors = {
    transparent: 'transparent',
    transparentGrey2: 'rgba(0,0,0,0.2)',
    transparentGrey4: 'rgba(0,0,0,0.4)',
    transparentGrey7: 'rgba(0,0,0,0.7)',
    themeMainColor: '#FBA572',
    tabBarTitleColor_Dark: '#0D7798',
    tabBarTitleColor_Light: '#FFFFFF',
    tabBarTitleSelectedColor_Dark: '#D9291C',
    tabBarTitleSelectedColor_Light: '#D9291C',
    homeBannerDotColor: '#E2E2E2',
    homeBannerActiveDotColor: '#F0AB83',
    themeBlackColor: '#333333',
    lightBlack:'#555555',
    textDarkGreyColor: '#666666',
    themeColorWhite: '#ffffff',
    themeDivideGrey: '#444444',
    themeDivideDarkGrey: '#2b2b2b',
    themeTextColorDef: '#cccccc',
};

let tab = {
    Tab_Home: 'tb_home',
    Tab_Shelf: 'tb_shelf',
    Tab_BookCity: 'tb_bookcity',
    Tab_Community: 'tb_community',
    Tab_Mine: 'tb_mine',
};

let messageName = {
    MSG_ShowToast: 'msg_show_toast',
    MSG_ShowFullScreen: 'msg_show_fullScreen',
    MSG_HiddenFullScreen: 'msg_hidden_fullScreen',
    MSG_SwitchTheme: 'msg_switch_theme',
};

let window = {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    scale: Dimensions.get('window').scale,
};

let tabHeight = {
    height: Platform.OS === 'ios' ? NAV_BAR_HEIGHT_IOS : NAV_BAR_HEIGHT_ANDROID,
};

let StorageKey = {
    user: 'kUSERINFO',
    uid: 'kUID',
    token: 'kTOKEN',
};

let ErrorCode = {
    None: 1, // 无错误
    NoChannelBinding: 200094, // 设备未绑定男女频
};

let ComTips = {
    NoNetwork: '隔壁老王又拔网线了~~~',
};


let LimitCount = 10;

const themes = [
    createTheme({
        tabBarBg: images.tab_bg_dark,
        navBarBg: images.nav_bg_dark,
        backgroundImage:images.background_image_dark,
        tabBarTitleColor: '#0D7798',
    }, 'Dark'),
    createTheme({
        tabBarBg: images.tab_bg_light,
        navBarBg: images.nav_bg_light,
        tabBarTitleColor: '#D9291C',
        backgroundImage:images.background_image_dark,
    }, 'Light'),
];

export default {
    colors: colors,
    tabName: tab,
    msgName: messageName,
    window: window,
    platform: Platform.OS,
    isIOS: Platform.OS === 'ios',
    tabHeight:tabHeight,
    storageKey: StorageKey,
    errorCode: ErrorCode,
    comTips: ComTips,
    limitCount: LimitCount,
    themes: {Dark:themes[0], Light:themes[1]},
}
