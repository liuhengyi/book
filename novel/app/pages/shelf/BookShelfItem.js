/**
 * Created by liuhengyi on 2018/8/3.
 */

import React, {Component} from 'react'
import {Image, Text, View} from 'react-native'
import {observer} from "mobx-react";
import Constants from "../../common/Constants";
import images from "../../images";
import {createStyle} from "react-native-theming";


const windowWidth = Constants.window.width;
const windowHeight = Constants.window.height;

@observer
export default class BookShelfItem extends Component {

    constructor(props) {
        super(props);
    }


    render() {
        const {data, store, index, isSelect} = this.props;
        const imageStyle = parseInt(index + 2) % 3 === 0 ? bookShelfItemStyles.imageContainerCenter : bookShelfItemStyles.imageContainer;
        const selectImageSoure = store.bookList[index].checked ? images.book_shelf_select : images.book_shelf_not_select;
        const selectView = isSelect ?
            <View style={bookShelfItemStyles.selectImageContainer}>
                <Image style={bookShelfItemStyles.selectImage}
                       source={selectImageSoure}
                />
            </View> : null;

        const newText = data.newUpdate ?
            <View style={bookShelfItemStyles.newText}>
                <Text style={{color: 'white'}}>NEW</Text>
            </View>
            : null;
        return (
            <View style={bookShelfItemStyles.container}>
                <View style={bookShelfItemStyles.imageContainer}>
                    <Image style={bookShelfItemStyles.image}
                           source={images.test_bg_image}/>
                    {newText}
                    {selectView}
                </View>
                <Text style={bookShelfItemStyles.bookName}>{store.bookList[index].bookId}</Text>
                <Text style={bookShelfItemStyles.bookSpeed}>6666666</Text>
            </View>
        );
    }
}

const separatorWidth = 10;
const itemWidth = parseInt(windowWidth - 4 * separatorWidth) / 3;

const bookShelfItemStyles = createStyle({
    container: {
        flex: 1,
        backgroundColor: 'transparent'
    },
    imageContainer: {
        width: itemWidth,
        height: 1.4 * itemWidth,
    },
    imageContainerCenter: {
        width: itemWidth,
        height: 1.4 * itemWidth,
        marginLeft: separatorWidth,
        marginRight: separatorWidth,
    },
    image: {
        width: itemWidth,
        height: 1.4 * itemWidth,
        resizeMode: 'cover',

    },
    newText: {
        width: 0.3 * itemWidth,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'red',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1
    },
    selectImageContainer: {
        width: 20,
        height: 20,
        marginRight: 8,
        marginBottom: 8,
        zIndex: 1,
        position: 'absolute',
        alignContent: 'flex-start',
        alignItems: 'flex-end',
        bottom: 0,
        right: 0
    },
    selectImage: {
        width: 20,
        height: 20,
        resizeMode: 'cover'
    },
    bookName: {
        width: itemWidth,
        height: 20,
        fontSize: 15,
        color: '#333333',
        textAlign: 'left',
        textAlignVertical: 'center',
        overflow: 'hidden'
    },
    bookSpeed: {
        width: itemWidth,
        height: 15,
        fontSize: 12,
        color: '#999',
        textAlign: 'left',
        textAlignVertical: 'center',
        overflow: 'hidden'
    },
});


