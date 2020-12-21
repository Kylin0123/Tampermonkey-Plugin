// ==UserScript==
// @name         一键去除在线翻译网站的换行符
// @namespace    https://greasyfork.org/zh-CN/scripts/390059-%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6-%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C
// @version      1.5
// @description  在各大在线翻译网站的页面上增加了一个“格式化”按钮，用来移除从PDF等复制过来的文本中包含的回车符、换行符、"\n"等，支持谷歌翻译、百度翻译、网易有道翻译、DeepL翻译
// @author       Kevin Chen
// @match        https://fanyi.baidu.com/*
// @match        http://fanyi.youdao.com/
// @match        https://translate.google.cn/*
// @match        https://translate.google.com/*
// @match        https://www.deepl.com/translator
// @icon         https://translate.google.cn/favicon.ico
// @grant        none
// @run-at       document-end
// @license      MIT
// ==/UserScript==

// Convert string to web element
function parseDom(arg) {
    var d = document.createElement('div');
    d.innerHTML = arg;
    return d.firstChild;
}

const GOOGLE_TRANSLATE_CN = "translate.google.cn";
const GOOGLE_TRANSLATE = "translate.google.com";
const BAIDU_FANYI = "fanyi.baidu.com";
const YOUDAO_FANYI = "fanyi.youdao.com";
const DL_TRANSLATE = "www.deepl.com";

const FORMAT_CN = "格式化";
const FORMAT_EN = "Format";

// Format code
const format = function() {
    const qsDict = {
        [GOOGLE_TRANSLATE_CN]: "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.dHeVVb.UnxENd > span > span > div > textarea",
        [GOOGLE_TRANSLATE]: "#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.OlSOob > c-wiz > div.ccvoYb > div.AxqVh > div.OPPzxe > c-wiz.rm1UF.dHeVVb.UnxENd > span > span > div > textarea",
        [BAIDU_FANYI]: "#baidu_translate_input",
        [YOUDAO_FANYI]: "#inputOriginal",
        [DL_TRANSLATE]: "#dl_translator textarea"
    }
    const host = window.location.host;
    const qs = qsDict[host];
    var txt = document.querySelector(qs).value;
    for (var i=0;i<txt.length;i++) {
        if(txt.indexOf("\n")) txt = txt.replace("\n"," ");
    }
    document.querySelector(qs).value = txt;
};

// Create new button
function createButton(host, txt) {
    var buttonHtml = "";
    var new_button = null;
    switch(host) {
        case GOOGLE_TRANSLATE_CN:
        case GOOGLE_TRANSLATE:
            //buttonHtml = `<div class='tlid-input-button input-button header-button tlid-input-button-docs text-icon' role='tab' tabindex='-1'><div class='text'>${FORMAT_CN}</div></div>`
            buttonHtml = `<div class='cWQYBc'><button class='VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-INsAgc Rj2Mlf OLiIxf PDpWxe irkilc'>格式化</button></div>`;
            new_button = parseDom(buttonHtml);
            new_button.onclick = format;
            break;
        case BAIDU_FANYI:
            var baidu_fanyi_css =
                `text-align: center;
                 margin-left: 14px;
                 width: 106px;
                 height: 30px;
                 line-height: 30px;
                 font-size: 14px;
                 color: #4395ff;
                 letter-spacing: 2px;
                 background-color: #f9f9f9;
                 border: 1px solid #4395ff;
                 border-radius: 3px`;
            new_button = parseDom(`<a href="javascript:" style="${baidu_fanyi_css}">${FORMAT_CN}</a>`);
            new_button.onclick = function() {
                var translate_button = document.querySelector("#translate-button");
                format();
                translate_button.click();
            };
            break;
        case YOUDAO_FANYI:
            new_button = parseDom(`<a class="fanyi__operations--man clog-js" data-clog="AT_BUTTON_CLICK" data-pos="web.i.top" id="transMan" href="javascript:;"> ${FORMAT_CN} </a>`);
            new_button.onclick = function() {
                var translate_button = document.querySelector("#transMachine");
                format();
                translate_button.click();
            }
            break;
        case DL_TRANSLATE:
            new_button = parseDom(`<button type="button" tabindex="100" class="switchOption--1Hyj0 variant_light--23An1"><span style="outline: none;">${FORMAT_CN}</span></button>`);
            new_button.onclick = function() {
                var translate_button = document.querySelector("#dl_translator > div.lmt__docTrans-tab-container > div > button.switchOption--2o-9u.variant_light--1OFSH.active--WFN-c");
                format();
                translate_button.click();
            }
            break;
        default: break;
    }
    return new_button;
}

// Get container
function getContainer(host) {
    var container = null;
    switch(host) {
        case GOOGLE_TRANSLATE_CN:
        case GOOGLE_TRANSLATE:
            //container = document.querySelector("body > div.container > div.frame > div.page.tlid-homepage.homepage.translate-text > div.input-button-container > div");
            container = document.querySelector("#yDmH0d > c-wiz > div > div.WFnNle > c-wiz > div.hgbeOc > nav");
            break;
        case BAIDU_FANYI:
            container = document.querySelector("#main-outer > div > div > div.translate-wrap > div.trans-operation-wrapper.clearfix > div.trans-operation.clearfix");
            break;
        case YOUDAO_FANYI:
            container = document.querySelector("body > div.fanyi > div.fanyi__operations > div.fanyi__operations--left");
            break;
        case DL_TRANSLATE:
            container = document.querySelector("#dl_translator > div.lmt__docTrans-tab-container > div");
            break;
        default: break;
    }
    return container;
}

setTimeout(function(){
    var host = window.location.host;
    var new_button = createButton(host);
    var container = getContainer(host);
    container.appendChild(new_button);
}, 100);



