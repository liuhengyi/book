/**
 * Created by Windy on 2018/4/2.
 */

import {
    AsyncStorage
} from 'react-native'

import MD5 from 'crypto-js/md5'
import Constants from "../common/Constants";
import DeviceInfo from 'react-native-device-info'
import Utils from "./Utils";
import JSONModel from "../libs/jsonModel/JSONModel";


/*正式服*/
// const BaseUrl = 'http://api.kuman.com';
/*测试服*/
const BaseUrl = 'http://test.api2.kuman.com';
const CacheUrls = [];

export default class HttpUtils {
    /**
     * post网络请求 请求参数为form表单
     * @param url
     * @param params
     * @returns {Promise}
     */
    static postForm(url,params) {
        let formData = parseArgsToForm(params);
        return new Promise((resolve, reject)=>{
            fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then(response=>response.json())
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
    }

    /**
     * get网络请求
     * @param url
     * @returns {Promise}
     */
    static get(url) {
        return new Promise((resolve, reject)=> {
            fetch(url)
                .then(response=>response.json())
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
    }

    /**
     * 网络请求，请求接口使用该方法
     * @param url
     * @param params
     * @returns {Promise<any>}
     */
    static fetchData(url, params) {
        let fullParams = fillParams(params);
        return new Promise((resolve, reject)=>{
            fetchNetData(url, fullParams)
                .then(response=>{
                    resolve(response);
                })
                .catch(error=>{
                    if (shouldCache(url)) {
                        // 如果需要缓存，则有可能有缓存，则取出缓存数据
                        fetchLocalData(url, params)
                            .then(response=>{
                                if (response) {
                                    resolve(response);
                                } else {
                                    reject(error);
                                }
                            })
                            .catch(err=>{
                                console.log(err);
                                reject(error);
                            })
                    } else {
                        reject(error);
                    }
                })
        })
    }

    /**
     *
     * @param url 上传文件url
     * @param fileKey 上传文件对应服务器上的名称
     * @param filePath 上传文件的路径
     * @param params 如有其它参数可一并上传
     * @returns {Promise<any>}
     */
    static uploadFile(url, fileKey, filePath, params) {
        let requestUrl = BaseUrl + url;
        let formData = parseArgsToForm(params);
        formData = addFileToForm(formData, fileKey, filePath);
        return new Promise((resolve, reject)=>{
            fetch(requestUrl, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            })
                .then(response=>response.json())
                .then(result=>{
                    resolve(result);
                })
                .catch(error=>{
                    reject(error);
                })
        })
    }


}


/* 缓存处理 */

/**
 * 将response保存在Cache中
 * @param key
 * @param data
 * @param callback
 */
function saveCache(key, data, callback) {
    if (!(key&&data)) return;
    AsyncStorage.setItem(key, JSON.stringify(data), callback);
}

/**
 * 生成缓存key，MD5值
 * @param url
 * @param params
 * @returns md5-string
 */
function genCacheKey(url, params) {
    let cacheKey = url+'&'+parseArgs(params);
    return MD5(cacheKey);
}

/**
 * 判断url是否应该缓存
 * @param url
 * @returns {boolean}
 */
function shouldCache(url) {
    for (let i = 0, len = CacheUrls; i < len; i++) {
        if (url === CacheUrls[i]) {
            return true;
        }
    }

    return false;
}

/* 参数处理 */

/**
 * 添加默认参数
 * @param params
 * @returns {*}
 */
function fillParams(params) {
    if (!params) params = {};
    if (!params['platform']) {
        params['platform'] = Constants.platform;
    }

    if (!params['channel']) {
        if (Constants.isIOS) {
            params['channel'] = 'appstore';
        } else {
            params['channel'] = 'andorid';
        }
    }

    if (!params['version']) {
        params['version'] = DeviceInfo.getVersion();
        // console.log("App Version", DeviceInfo.getVersion());
    }

    if (!params['device_id']) {
        params['device_id'] = DeviceInfo.getUniqueID();
    }

    if (!params['uid']) {
        params['uid'] = Utils.getUid();
    }

    if (!params['token']) {
        params['token'] = Utils.getToken();
    }

    return params;
}

/**
 * 将参数转成form表单结构
 * @param params
 * @returns {FormData}
 */
function parseArgsToForm(params) {
    let formData = new FormData();
    for (let key in params) {
        if (params[key]) {
            formData.append(key, params[key]);
        }
    }

    return formData;
}

/**
 * 将上传文件填充到表单
 * @param form 表单
 * @param key 上传到服务器对应的参数
 * @param filePath 上传文件的路径
 * @returns {*} 返回表单
 */
function addFileToForm(form, key, filePath) {
    if (!form) form = new FormData();

    // 将上传文件路径分段，获取到文件的名称：xxx.jpg/xxx.png
    let pathArr = filePath.split('/');
    let name = '';
    if (pathArr.length > 0) {
        name = pathArr[pathArr.length - 1];
    }

    form.append(key, {uri: filePath, type : 'application/octet-stream', name: name});

    return form;
}

/**
 * 将params对象转化成string
 * @param params
 * @returns {string}
 */
function parseArgs(params) {
    let args = '';
    // 参数为空则返回空字符串
    if (!params) return args;
    // 否则，遍历params对象
    for (let key in params) {
        if (params[key] && params[key].length > 0) {
            let value = encodeURI(params[key]);
            args += key + '=' + value + '&';
        }
    }

    // 删除末尾的&
    if (args.endsWith('&')) {
        args = args.substr(0, args.length-1);
    }

    return args;
}

/* 网络请求/本地请求 */

/**
 * 获取网络数据
 * @param url
 * @param params
 * @returns {Promise}
 */
function fetchNetData(url, params) {
    return new Promise((resolve, reject)=>{
        HttpUtils.postForm(url, params)
            .then(response=>{
                // 处理其他情况
                resolve(response);

                if (shouldCache(url)) {
                    // 需要缓存，则把数据保存下来
                    let key = genCacheKey(url, params);
                    saveCache(key, response, ()=>{})
                }
            })
            .catch(error=>{
                reject(error);
            })
    })
}

/**
 * 获取本地缓存数据
 * @param url
 * @param params
 * @returns {Promise}
 */
function fetchLocalData(url, params) {
    return new Promise((resolve, reject)=>{
        let key = genCacheKey(url, params);
        AsyncStorage.getItem(key, (error, result)=>{
            if (!error) {
                try {
                    resolve(JSON.parse(result))
                } catch (e) {
                    reject(e)
                }
            } else {
                reject(error)
            }
        })
    })
}

export class Status extends JSONModel {
    status = 0;
    message = '';
}

export const API = {
    /*--------------------首页--------------------*/
    /**
     * 获取首页
     */
    API_preference_all: BaseUrl + '/preference/all',
    API_book_shelf: BaseUrl + '/bookshelf/getUserBookshelf',
    API_content_detail: BaseUrl + '/content/detail',
    /**
     * 更多推荐
     */
    API_preference_moreRecommend: BaseUrl + '/preference/moreRecommend',
    /*-------------------- END --------------------*/

    /*----------推荐模块----------*/
    /**
     * 绑定男女频
     */
    API_genderManage_bindGender: BaseUrl + '/GenderManage/bindGender',
    /*-------------------- END --------------------*/

    /*--------------------漫画相关--------------------*/
    /**
     * 新上架漫画
     */
    API_comic_newComic: BaseUrl + '/comic/newComic',

    /**
     * 漫画详情
     */
    API_comic_detail: BaseUrl + '/comic/detail',

    /**
     * 漫画阅读页
     */
    API_comic_chapter: BaseUrl + '/comic/chapter',

    /**
     * 漫画章节图片下载地址
     */
    API_comic_comicChapterImageList: 'http://api.kuman.com/comic/comicChapterImageList',
    /*-------------------- END --------------------*/

};