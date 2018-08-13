/**
 * Created by liuhengyi on 2018/8/2.
 */

import React, {Component} from 'react'
import {action, configure, observable} from "mobx";
//严格模式
import {isIphoneX} from "../utils/ViewUtils";
import Constants from "../common/Constants";
import Utils from "../utils/Utils";

configure({enforceActions: true});

const BgImgHeight = Utils.calcHeight(750 / 140, Constants.window.width);

export default class BookShelfState {
    @observable bookList = [];
    @observable checkedAll = false;

    // 通过控制背景图片距底部的位置来控制背景图片的显示/隐藏
    @observable tabBarBgBottom = 0;

    @action
    initData(responsData) {
        this.bookList = this.init(responsData);
    }

    //默认全不选
    init(dataList) {
        let newArray = [];
        for (let i = 0; i < dataList.length; i++) {
            let dict = dataList[i];
            dict.checked = false;
            newArray.push(dict);
        }
        return newArray;
    }

    // 隐藏tabBar的背景图片
    @action
    hideTabBar() {
        this.tabBarBgBottom = isIphoneX() ? -(BgImgHeight + 34) : -BgImgHeight;
    }

    // 显示tabBar的背景图片
    @action
    showTabBar() {
        this.tabBarBgBottom = 0;
    }

    //重置全为全不选
    @action resetData = () => {
        this.bookList.forEach(item => item.checked = false);
    };

    //存取选中状态
    getSelectArray() {
        let newArray = [];
        for (let i = 0; i < newArray.length; i++) {
            let dict = this.bookList[i];
            if (dict.checked === true) {
                newArray.push(dict);
            }
        }
        return newArray;
    }

    @action onCheck = (bookId) => {

        this.bookList.forEach(item => {
            console.log(item.bookId + '=======' + bookId);
            if (item.bookId === bookId) {
                console.log(item.bookId + '=======' + bookId + '---' + item.checked);
                item.checked ? this.checkedAll = false : null;
                item.checked = !item.checked;
                console.log(item.bookId + '=======' + bookId + '---' + item.checked);
            }
        });
        //手动全选切换全选状态
        !this.bookList.some((item) => item.checked === false) ? this.checkedAll = true : null;
    };

    @action onCheckedAll = () => {
        this.checkedAll = !this.checkedAll;
        this.checkedAll ? this.bookList.forEach(item => item.checked = true) : this.bookList.forEach(item => item.checked = false);
    };

    @action onDelete = () => {
        // this.bookList = this.bookList.filter(function (element,index,array) {
        //     return !element.checked;
        // });
        for (let i = 0; i < this.bookList.length; i++) {
            if (this.bookList[i].checked) {
                this.bookList.splice(i, 1);
                i--;
            }
        }
    };


}
