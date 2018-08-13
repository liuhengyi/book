/**
 * Created by Windy on 2018/4/3.
 */

import {
    AsyncStorage,
    DeviceEventEmitter,
} from 'react-native';
import Constants from "../common/Constants";

export default class Utils {
     /**
     * 根据宽高比计算实际高度
     * @param scale 宽高比
     * @param width 实际宽度，不传表示使用屏幕实际宽度
     * @returns {number}
     */
    static calcHeight(scale, width) {
        if (!width) width = Constants.window.width;

        // console.log(scale, width, width / scale);
        return width / (scale);
    }

    /**
     * 生成随机颜色
     * @returns {string}
     */
    static randomColor() {
        return '#'+('00000'+(Math.random()*0x1000000<<0).toString(16)).substr(-6);
    }

    /**
     * 复制一个数组
     * @param arr
     * @returns {Array}
     */
    static cloneArray(arr) {
        var newArr = [];
        if (!arr || arr.length <= 0) return newArr;
        for (let i = 0, len = arr.length; i < len; i++) {
            newArr.push(arr[i]);
        }

        return newArr;
    }

    /**
     * 获取本地uid
     * @returns {string}
     */
    static getUid() {
        let uid = '';

        AsyncStorage.getItem(Constants.storageKey.uid, (error, result)=>{
            if (!error) {
                uid = result;
            } else {
                console.log('获取uid失败', error);
            }
        })

        return uid;
    }

    /**
     * 获取本地token
     * @returns {string}
     */
    static getToken() {
        let token = '';
        AsyncStorage.getItem(Constants.storageKey.token, (error, result)=>{
            if (!error) {
                token = result;
            } else {
                console.log('获取uid失败', error);
            }
        })

        return token;
    }

    /*--------------------日期时间--------------------*/
    /**
     * 获取当前时间戳(秒级)
     * @returns {number}
     */
    static getCurrentTimeTicket() {
        return Math.floor((new Date().getTime())/1000);
    }

    /**
     * 格式化时间戳
     * @param timeTicket 时间戳(string/number)
     * @param format 'yyyy-MM-dd hh:mm:ss'
     * @return {*}
     */
    static formatDate(timeTicket, format) {
        if (!timeTicket) return '';
        if (!format || format === '') format = 'yyyy-MM-dd hh:mm:ss';

        if (typeof timeTicket === 'string') timeTicket = parseInt(timeTicket);

        if (isNaN(timeTicket)) return '';

        let date = new Date();
        // 需要毫秒级
        date.setTime(timeTicket * 1000);

        // console.log('date =>', date);
        // console.log('date =>', timeTicket);

        let o = {
            'M+':date.getMonth() + 1,
            'd+':date.getDate(),
            'h+':date.getHours(),
            'm+':date.getMinutes(),
            's+':date.getSeconds()
        };

        if(/(y+)/.test(format)){
            format = format.replace(RegExp.$1,(date.getFullYear()+'').substr(4-RegExp.$1.length));
        }

        // 遍历这个对象
        for (let k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length === 1
                    ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }

        return format;
    }

    /**
     * 和当前时间作比较
     *
     * @param time 作比较的时间戳
     * @return {*}
     */
    static compareCurrentTime(time) {
        if (!isNaN(time)) time = parseInt(time);

        if (time <= 0) throw new Error('time is invalide');

        let currentTime = this.getCurrentTimeTicket();
        let timeInterval = currentTime - time;

        if (timeInterval < 0) throw new Error('time is bigger than currentTime, expect less');

        let temp = 0;
        let result = '';
        // 小于60秒 显示--刚刚
        if (timeInterval < 60) {
            return '刚刚';
        }
        // 小于60分钟 显示-- xx分钟前
        if ((temp = Math.floor(timeInterval/60)) < 60) {
            return temp + '分钟前';
        }
        // 小于24小时 显示-- xx小时前
        else if ((temp = Math.floor(temp / 60)) < 24) {
            return temp + '小时前';
        }
        // 24小时-48小时之间 显示-- 昨天
        else if (temp < 48) {
            return '昨天';
        }
        // 更早时间 显示-- 20xx-MM-DD
        else {
            return this.formatDate(time);
        }

    }

    /*--------------------  END  --------------------*/

    /*--------------------通知/广播--------------------*/
    /**
     * 发送通知/广播
     * @param msgName 通知/广播名称
     * @param content 通知/广播内容
     */
    static postMsg(msgName, content=null) {
        DeviceEventEmitter.emit(msgName, content);
    }

    /**
     * 添加通知/广播监听
     * @param msgName 通知/广播名称
     * @param func 通知/广播回调函数
     * @return {*} Listener
     */
    static addListener(msgName, func=null) {
        return DeviceEventEmitter.addListener(msgName, func);
    }

    /**
     * 显示Toast文字
     * @param text toast内容
     */
    static showToast(text) {
        this.postMsg(Constants.msgName.MSG_ShowToast, text);
    }

    /**
     * 显示无网络提示文字
     */
    static showNoNetworkTip() {
        this.showToast(Constants.comTips.NoNetwork);
    }
    /*--------------------  END  --------------------*/

    /*--------------------数据转换--------------------*/
    /**
     * 将热度数字转化为字符串，并按**万、**百万、**亿显示
     * @param count
     * @return {string}
     */
    static convertCount2Str(count) {
        if (!count || count<=0) return '0';

        if (count > 100000000) return (count/100000000).toFixed(2) + '亿';
        if (count > 1000000) return (count/1000000).toFixed(2) + '百万';
        if (count > 10000) return (count/10000).toFixed(2) + '万';

        return count + '';
    }

    /*--------------------  END  --------------------*/
}

/*-------------------- String添加属性 --------------------*/
/**
 * 字符串替换 - 全部
 * @param s1
 * @param s2
 * @return {string}
 */
String.prototype.replaceAll = function(s1,s2){
    return this.replace(new RegExp(s1,"gm"),s2);
};

/**
 * 转义
 * @return {*}
 */
String.prototype.unEscape = function(){
    let str = this.replaceAll('&middot;', '·');
    str = str.replaceAll('&ldquo;', '“');
    str = str.replaceAll('&rdquo;', '”');
    str = str.replaceAll('&asymp;', '≈');
    str = str.replaceAll('&mdash;', '—');
    str = str.replaceAll('&ndash;', '–');

    return str;
};
/*--------------------  END  --------------------*/

/**
 * 判断字符串是否为空
 * @param obj
 * @returns {boolean}
 */
export function isEmptyStr(obj){
    return (typeof obj === "undefined" || obj == null || obj === "");
}

/**
 * 判断字符串是否有效
 * @param obj
 * @returns {boolean}
 */
export function validStr(obj) {
    return !isEmptyStr(obj);
}
