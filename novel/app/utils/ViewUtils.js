/**
 * Created by Windy on 2018/4/10.
 */

import React from 'react'

import {
    View,
    StyleSheet,
    TouchableOpacity,
    Image,
    Text,
} from 'react-native'
import Constants from "../common/Constants";
import Utils from "./Utils";

export default class ViewUtils {

    /**
     * 生成导航栏返回按钮
     * @param img 可传空/''/'main'/require(...), 为空时默认为白色返回箭头，'main'为带主题颜色的返回箭头
     * @param callback 回调函数，必传
     * @returns {*}
     */
    static renderBackItem(img, callback) {
        if (typeof(img) === 'function') {
            callback = img;
            img = require('../../res/ic_goBack.png');
        }
        if (img === 'main') {
            this.isMainColor = true;
            img = require('../../res/ic_goBack.png');
        } else if (!img || img === '') {
            img = require('../../res/ic_goBack.png');
        }


        if (!callback) throw new Error('导航栏返回按钮未设置回调函数');

        return (
            <TouchableOpacity
                onPress={()=>{callback()}}
                style={{
                    paddingLeft: 10,
                    paddingRight: 10,
                }}
            >
                <Image source={img} style={[this.isMainColor ? {tintColor: Constants.colors.themeMainColor} : null, styles.backItem]}/>
            </TouchableOpacity>
        )
    }

    /**
     * 根据isShow 返回是否显示的样式
     * @param isShow
     * @returns {{display: string}}
     */
    static showStyle(isShow) {
        return {display:isShow?'flex':'none'};
    }

    /**
     * 生成书类别视图
     * @param cats
     * @param style
     * @return {*}
     */
    static renderCategory(cats, style) {
        if (cats.length === 0) return null;

        let categoryList = Utils.cloneArray(cats);
        if (categoryList.length > 3) {
            categoryList = categoryList.splice(0, 3);
        }

        let views = [];

        categoryList.map((category, i)=>{
            views.push(
                <Text style={[styles.row_category_text, style]} key={i}>{category.category_name}&nbsp;</Text>
            );
        });

        return views;
    }

}

// 判断是否是iPhone X
const X_Width = 375;
const X_Height = 812;

/**
 * 判断是否为iphoneX
 * @return {*|boolean}
 */
export function isIphoneX() {
    return (
        Constants.isIOS &&
        ((Constants.window.width === X_Width && Constants.window.height === X_Height) ||
            (Constants.window.width === X_Height && Constants.window.height === X_Width))
    )
}

/**
 * 根据是否是iPhoneX返回不同的样式
 * @param iphoneXStyle
 * @param iosStyle
 * @returns {*}
 */
export function ifIphoneX(iphoneXStyle, iosStyle={}) {
    if (isIphoneX()) {
        return iphoneXStyle;
    } else {
        return iosStyle;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backItem: {
        width: 22,
        height: 22,
    },
    row_category_text: {
        lineHeight: 20,
        color: '#999',
    },
});