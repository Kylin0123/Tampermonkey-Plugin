// ==UserScript==
// @name         一键去除在线翻译网站的换行符
// @namespace    https://greasyfork.org/zh-CN/scripts/390059-%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6-%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C
// @version      2.1
// @description  在各大在线翻译网站的页面上增加了一个“格式化”按钮，用来移除从PDF等复制过来的文本中包含的回车符、换行符、"\n"等，支持DeepL翻译、谷歌翻译、百度翻译、网易有道翻译
// @author       Kevin Chen
// @match        https://fanyi.baidu.com/*
// @match        https://fanyi.youdao.com/
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @match        https://www.deepl.com/translator
// @icon         https://translate.google.cn/favicon.ico
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// ==/UserScript==

const LOADING_WAIT_TIME = 500;

// Convert string to web element
function parseDom(arg) {
    var d = document.createElement('div');
    d.innerHTML = arg;
    return d.firstChild;
}

GM_addStyle('.myCustomGoogleButtonClass { color: #1967d2; background: transparent; border-width: 1px; border-radius: 4px; border-style: solid; padding: 0 15px 0 15px; height: 36px; font-size: .875rem; border-color: #dadce0; cursor:pointer} .myCustomGoogleButtonClass:hover {background-color: #f1f5f9; color: #174ea6}');
GM_addStyle('.myCustomBaiduButtonClass {text-align: center; margin-left: 14px; width: 106px; height: 30px; line-height: 30px; font-size: 14px; color: #4395ff; letter-spacing: 2px; background-color: #f9f9f9; border: 1px solid #4395ff;border-radius: 3px}');
GM_addStyle('.myCustomDeeplButtonClass {background-color: #fff; border: 1px solid #e3e3e3; border-radius: 8px; cursor: pointer; margin-right: 10px;margin-bottom: 7px; height: 66px; min-width: 160px; box-shadow: 0px 4px 16px rgb(0 0 0 / 8%); font-weight: 400; font-size: 20px;           }');

// 谷歌翻译（中国）CONFIG配置文件
const GOOGLE_TRANSLATE_CN = {
    host: "translate.google.cn",
    inputAreaSelector: "textarea",
    containerSelector: "#yDmH0d > c-wiz nav",
    translateButtonSelector: "",
    buttonClass: "myCustomGoogleButtonClass"
};

// 谷歌翻译（国际）CONFIG配置文件
const GOOGLE_TRANSLATE = {
    host: "translate.google.com",
    inputAreaSelector: "textarea",
    containerSelector: "#yDmH0d > c-wiz nav",
    translateButtonSelector: "",
    buttonClass: "myCustomGoogleButtonClass"
};


// 百度翻译CONFIG配置文件
const BAIDU_FANYI = {
    host: "fanyi.baidu.com",
    inputAreaSelector: "#baidu_translate_input",
    containerSelector: "#main-outer > div > div > div.translate-wrap > div.trans-operation-wrapper.clearfix > div.trans-operation.clearfix",
    translateButtonSelector: "#translate-button",
    buttonClass: "myCustomBaiduButtonClass"
};

// 有道翻译CONFIG配置文件
const YOUDAO_FANYI = {
    host: "fanyi.youdao.com",
    inputAreaSelector: "#inputOriginal",
    containerSelector: "body > div.fanyi > div.fanyi__operations > div.fanyi__operations--left",
    translateButtonSelector: "#transMachine",
    buttonClass: ""
};

// DeepL翻译CONFIG配置文件
const DL_TRANSLATE = {
    host: "www.deepl.com",
    inputAreaSelector: "#dl_translator textarea",
    containerSelector: "#dl_translator > div.lmt__docTrans-tab-container: first",
    translateButtonSelector: "#dl_translator > div.lmt__docTrans-tab-container > div > button.switchOption--2o-9u.variant_light--1OFSH.active--WFN-c",
    buttonClass: "myCustomDeeplButtonClass"
};

const FORMAT_CN = "格式化";
const FORMAT_EN = "Format";

// Format code
const format = function(hostClass) {
    var txt = document.querySelector(hostClass.inputAreaSelector).value;
    for (var i=0;i<txt.length;i++) {
        if(txt.indexOf("\n")) txt = txt.replace("\n"," ");
    }
    document.querySelector(hostClass.inputAreaSelector).value = txt;
};

// Create new button
function createButton(host) {
    var buttonHtml = "";
    var new_button = null;
    var container = null;
    if(host == GOOGLE_TRANSLATE_CN.host) {
        new_button = document.createElement("input");
        new_button.value = FORMAT_CN;
        new_button.setAttribute('class', 'myCustomGoogleButtonClass');
        new_button.type = "button";
        new_button.onclick = function() {
            format(GOOGLE_TRANSLATE_CN)
        };
        container = document.querySelector(GOOGLE_TRANSLATE_CN.containerSelector);
    }
    else if(host == GOOGLE_TRANSLATE.host) {
        new_button = document.createElement("input");
        new_button.value = FORMAT_EN;
        new_button.setAttribute('class', 'myCustomGoogleButtonClass');
        new_button.type = "button";
        new_button.onclick = function() {
            format(GOOGLE_TRANSLATE)
        };
        container = document.querySelector(GOOGLE_TRANSLATE_CN.containerSelector);
    }
    else if (host == BAIDU_FANYI.host) {
        new_button = parseDom(`<a href="javascript:" class="myCustomBaiduButtonClass">${FORMAT_CN}</a>`);
        new_button.onclick = function() {
            var translate_button = document.querySelector(BAIDU_FANYI.translateButtonSelector);
            format(BAIDU_FANYI);
            translate_button.click();
        };
        container = document.querySelector(BAIDU_FANYI.containerSelector);
    }
    else if (host == YOUDAO_FANYI.host) {
        new_button = parseDom(`<a class="fanyi__operations--man clog-js" data-clog="AT_BUTTON_CLICK" data-pos="web.i.top" id="transMan" href="javascript:;"> ${FORMAT_CN} </a>`);
        new_button.onclick = function() {
            var translate_button = document.querySelector(YOUDAO_FANYI.translateButtonSelector);
            format(YOUDAO_FANYI);
            translate_button.click();
        }
        container = document.querySelector(YOUDAO_FANYI.containerSelector);
    }
    else if (host == DL_TRANSLATE.host) {
        new_button = parseDom(`<button type="button" tabindex="100" class="myCustomDeeplButtonClass"><span style="outline: none;">${FORMAT_CN}</span></button>`);
        new_button.onclick = function() {
            var translate_button = document.querySelector(DL_TRANSLATE.translateButtonSelector);
            format(DL_TRANSLATE);
            translate_button.click();
        }
        container = document.querySelector(DL_TRANSLATE.containerSelector);
    }
    container.appendChild(new_button);
    return;
}


setTimeout(function(){
    createButton(window.location.host);
}, LOADING_WAIT_TIME);



