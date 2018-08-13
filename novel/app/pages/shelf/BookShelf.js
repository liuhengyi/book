/**
 * Created by liuhengyi on 2018/8/1.
 */

import React, {Component} from 'react'
import {FlatList, Image, Text, TouchableOpacity, View,} from 'react-native'
import NavigationBar from "../../common/NavigationBar";
import BookShelfState from "../../mobx/BookShelfState";
import Constants from "../../common/Constants";
import BookShelfItem from "./BookShelfItem";
import {observer} from "mobx-react";
import {createStyle} from "react-native-theming";
import Theme from 'react-native-theming';
import images from "../../images";


import Utils from "../../utils/Utils";
import TabBarBgView from "../../common/TabBarBgView";
import {isIphoneX} from "../../utils/ViewUtils";


const windowWidth = Constants.window.width;
const windowHeight = Constants.window.height;

const separatorWidth = 10;
const separatorHeight = 10;
const itemWidth = parseInt(windowWidth - 4 * separatorWidth) / 3;

const store = new BookShelfState();
const BgImgHeight = Utils.calcHeight(750 / 140, Constants.window.width);
const tabBarHeight = isIphoneX() ? BgImgHeight + 34 : BgImgHeight;

@observer
export default class BookShelf extends Component {


    constructor(props) {
        super(props);
        this.state = {
            isSelect: false,
            dataSource: [],

        }
    }

    componentDidMount() {
        setTimeout(() => {
            let responsData = [{bookId: 1, newUpdate: true}, {bookId: 2, newUpdate: false}, {
                bookId: 3,
                newUpdate: false
            }, {bookId: 4, newUpdate: false}, {bookId: 5, newUpdate: true},
                {bookId: 6, newUpdate: false}, {bookId: 7, newUpdate: true}, {bookId: 8, newUpdate: false}, {
                    bookId: 9,
                    newUpdate: true
                }, {bookId: 10, newUpdate: false}, {bookId: 11, newUpdate: true},
                {bookId: 12, newUpdate: false}, {bookId: 13, newUpdate: true}, {
                    bookId: 14,
                    newUpdate: true
                }, {bookId: 15, newUpdate: false}, {bookId: 16, newUpdate: true}, {bookId: 17, newUpdate: true}];
            responsData.map(item => {
                item.checked = false;
            });
            store.initData(responsData);

            this.setState({
                dataSource: responsData
            });
            console.log('data' + responsData)
        }, 1000)

    }

    _renderRightButton = () => {
        let rightButton = this.state.isSelect ?
            <TouchableOpacity style={{paddingRight: 15, paddingLeft: 15, paddingTop: 10, paddingBottom: 10}}
                              onPress={() => this._SelectDone()}>
                <Text style={{color: 'white', fontSize: 16}}>完成</Text>
            </TouchableOpacity> : null;
        return (
            <View>
                {rightButton}
            </View>
        );
    };


    _SelectDone = () => {
        this.setState({
            isSelect: false
        });
        store.resetData();

        if (this.props.store) {
            this.props.store.show();
            store.showTabBar();
        }

    };

    _keyExtractor = (item, index) => index;

    _itemPress = (item) => {
        if (this.state.isSelect) {
            store.onCheck(item.bookId);
        } else {
            alert('跳转')
        }


    };

    _itemLongPress = () => {
        if (!this.state.isSelect) {
            if (this.props.store) {
                this.props.store.hide();
                store.hideTabBar();
            }
            this.setState({
                isSelect: true
            });
        }
    };

    _renderRow = ({item, index}) => {
        console.log(index + '====');
        const itemStyle = parseInt(index + 2) % 3 === 0 ? bookShelfStyles.itemContainerCenter : bookShelfStyles.itemContainer;
        return (
            <TouchableOpacity style={itemStyle} onPress={() => this._itemPress(item)}
                              onLongPress={() => this._itemLongPress()}>
                <BookShelfItem data={store.bookList[index]} index={index} store={store} isSelect={this.state.isSelect}/>
            </TouchableOpacity>
        );
    };

    _renderSeparator = () => {
        return <View style={{height: separatorHeight}}/>
    };

    _selectAll = () => {
        store.onCheckedAll();
    };

    _delete = () => {
        store.onDelete();
        this.setState({
            dataSource: store.bookList
        });
    };

    _renderFooter = () => {
        return (
            <View style={bookShelfStyles.footerContainer}>
                <Text style={bookShelfStyles.footerText}>{'我是有底线的'}</Text>
            </View>
        );
    };

    _renderEmptyCp = () => {
        return (
            <Image style={{flex: 1}} source={images.test_bg_image}/>
        );
    };

    render() {
        const selectText = store.checkedAll ? '取消全选' : '全选';
        const selectView = this.state.isSelect ?
            <View style={bookShelfStyles.selectContainer}>
                <TouchableOpacity style={bookShelfStyles.selectBtn} onPress={() => this._selectAll()}>
                    <Image source={images.book_shelf_select_all} style={bookShelfStyles.selectImage}/>
                    <Text style={bookShelfStyles.selectText}>{selectText}</Text>
                </TouchableOpacity>
                <View style={{width: 0.5, height: 0.08 * windowWidth, backgroundColor: '#e9e9e9'}}/>
                <TouchableOpacity style={bookShelfStyles.selectBtn} onPress={() => this._delete()}>
                    <Image source={images.book_shelf_delete} style={bookShelfStyles.selectImage}/>
                    <Text style={bookShelfStyles.selectText}>{'删除'}</Text>
                </TouchableOpacity>
            </View> : null;

        return (
            <View style={{flex: 1}}>
                <Theme.Image source="@backgroundImage" style={bookShelfStyles.backgroundImage}/>
                <TabBarBgView style={{bottom: store.tabBarBgBottom}}/>
                <NavigationBar
                    title={'书架'}
                    titleStyle={{color: 'white'}}
                    bgImage={'@navBarBg'}
                    rightButton={this._renderRightButton()}
                />
                <FlatList
                    style={{flex: 1, marginLeft: 10, marginRight: 10, marginTop: 10}}
                    keyExtractor={this._keyExtractor}
                    data={store.bookList.slice()}
                    renderItem={this._renderRow}
                    numColumns={3}
                    ListEmptyComponent={this._renderEmptyCp}
                    ListFooterComponent={this._renderFooter}
                    ItemSeparatorComponenet={this._renderSeparator}
                    getItemLayout={(data, index) => ({
                        length: 1.4 * itemWidth + 40,
                        offset: (1.4 * itemWidth + 40 + separatorHeight) * index,
                        index
                    })}
                />
                {selectView}

            </View>
        );
    }
}
const bookShelfStyles = createStyle({
    backgroundImage:{
        position: 'absolute',
        left: 0,
        right: 0,
        top:0,
        bottom:0,
        width: windowWidth,
        height:windowHeight
    },
    itemContainer: {
        width: itemWidth,
        height: 1.4 * itemWidth + 40,
    },
    itemContainerCenter: {
        width: itemWidth,
        height: 1.4 * itemWidth + 40,
        marginLeft: separatorWidth,
        marginRight: separatorWidth,
    },
    selectContainer: {
        width: windowWidth,
        height: 44,
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        borderTopColor: '#e9e9e9',
        borderWidth: 0.5
    },
    selectBtn: {
        flex: 1,
        height: 44,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    selectImage: {
        width: 20,
        height: 20,
        marginRight: 5
    },
    selectText: {
        fontSize: 15,
        textAlign: 'center'
    },
    footerContainer: {
        width: windowWidth,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center'
    },
    footerText: {
        fontSize: 15
    },
});
