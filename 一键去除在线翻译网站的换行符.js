// ==UserScript==
// @name         一键去除在线翻译网站的换行符
// @namespace    https://greasyfork.org/zh-CN/scripts/390059-%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6-%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C
// @version      2.3.2
// @description  在各大在线翻译网站的页面上增加了一个“格式化”按钮，用来移除从PDF等复制过来的文本中包含的回车符、换行符、"\n"等，支持DeepL翻译、谷歌翻译、百度翻译、网易有道翻译
// @author       Kevin Chen
// @match        https://fanyi.baidu.com/*
// @match        https://fanyi.youdao.com/*
// @match        https://translate.google.com.hk/*
// @match        https://translate.google.com/*
// @match        https://www.deepl.com/translator
// @icon         https://translate.google.cn/favicon.ico
// @grant        GM_addStyle
// @run-at       document-end
// @license      MIT
// ==/UserScript==

const FORMAT_CN = '格式化'
const LOADING_WAIT_TIME = 500

const CONFIGS = [

]

// DeepL翻译CONFIG配置文件
const DEEPL_TRANSLATE_CONFIG = {
  host: 'www.deepl.com',
  inputAreaSelector: '#dl_translator textarea',
  containerSelector: '#dl_translator > div.lmt__docTrans-tab-container > nav > div',
  translateButtonSelector: '#dl_translator > div.lmt__docTrans-tab-container > nav > button.switchOption--2o-9u.variant_light--1OFSH.active--WFN-c',
  createButtonHtml: `<button type="button" tabindex="100" class="myCustomDeepLButtonClass"><span style="outline: none;">${FORMAT_CN}</span></button>`,
}

// 谷歌翻译（中国）CONFIG配置文件
const GOOGLE_FANYI_CONFIG = {
  host: 'translate.google.com.hk',
  inputAreaSelector: 'textarea',
  containerSelector: '#yDmH0d > c-wiz nav',
  translateButtonSelector: null,
  createButtonHtml: `<input class="myCustomGoogleButtonClass" type="button" value="${FORMAT_CN}">`,
}

// 谷歌翻译（国际）CONFIG配置文件
const GOOGLE_TRANSLATE_CONFIG = {
  host: 'translate.google.com',
  inputAreaSelector: 'textarea',
  containerSelector: '#yDmH0d > c-wiz nav',
  translateButtonSelector: null,
  createButtonHtml: `<input class="myCustomGoogleButtonClass" type="button" value="${FORMAT_CN}">`,
}

// 百度翻译CONFIG配置文件
const BAIDU_FANYI_CONFIG = {
  host: 'fanyi.baidu.com',
  inputAreaSelector: '#baidu_translate_input',
  containerSelector: '#main-outer > div > div > div.translate-wrap > div.trans-operation-wrapper.clearfix > div.trans-operation.clearfix',
  translateButtonSelector: '#translate-button',
  createButtonHtml: `<a href="javascript:" class="myCustomBaiduButtonClass">${FORMAT_CN}</a>`,
}

// 有道翻译CONFIG配置文件
const YOUDAO_FANYI_CONFIG = {
  host: 'fanyi.youdao.com',
  inputAreaSelector: '#js_fanyi_input',
  containerSelector: '#app > div.index.os_Windows > div.translate-tab-container > div.tab-header > div.tab-left',
  translateButtonSelector: '#TextTranslate > div.fixedBottomActionBar-border-box > div > div.sourceActionContainer > div > div > div.opt-right.yd-form-container > a',
  createButtonHtml: `<div class="tab-item color_text_3" data-v-6e71f92b=""><span class="color_text_1" data-v-6e71f92b="">${FORMAT_CN}</span></div>`,
}

// button class styles
GM_addStyle(`
    .myCustomGoogleButtonClass {
        color: #1967d2; 
        background: transparent; 
        border-width: 1px; 
        border-radius: 4px; 
        border-style: solid; 
        padding: 0 15px 0 15px; 
        height: 36px; 
        font-size: .875rem; 
        border-color: #dadce0; 
        cursor:pointer
    }
    .myCustomGoogleButtonClass:hover {
        background-color: #f1f5f9; 
        color: #174ea6
    }
`)
GM_addStyle(`
    .myCustomBaiduButtonClass {
        text-align: center; 
        margin-left: 14px; 
        width: 106px; 
        height: 30px; 
        line-height: 30px; 
        font-size: 14px; 
        color: #4395ff; 
        letter-spacing: 2px; 
        background-color: #f9f9f9; 
        border: 1px solid #4395ff;
        border-radius: 3px
    }
`)
GM_addStyle(`
    .myCustomDeepLButtonClass {
        background-color: #fff; 
        border: 1px solid #e3e3e3; 
        border-radius: 8px; 
        cursor: pointer; 
        height: 66px; 
        min-width: 160px;
        box-shadow: 0px 4px 16px rgb(0 0 0 / 8%); 
        font-weight: 400; 
        font-size: 20px;
    }
`)

// convert string to web element
function parseDom(html) {
  console.log("parse dom")
  const e = document.createElement('div')
  e.innerHTML = html
  return e.firstChild
}

// format code
const format = function (config) {
  const inputArea = document.querySelector(config.inputAreaSelector)
  var txt = inputArea.value != null ? inputArea.value : inputArea.innerHTML
  for (var i = 0; i < txt.length; i++) {
    if (txt.indexOf('\n')) txt = txt.replace('\n', ' ')
  }
  if (inputArea.value != null) {
    inputArea.value = txt
  } else {
    inputArea.innerHTML = txt
  }

  // click translate button
  if (config.translateButtonSelector != null) {
    const translateButton = document.querySelector(config.translateButtonSelector)
    translateButton.click()
  }
}

// create new button by config
function createButtonByConfig(config) {
  console.log("开始创建自定义button", config.createButtonHtml)
  const newButton = parseDom(config.createButtonHtml)
  console.log("创建的button:", newButton)
  if (newButton == null) {
    console.info('创建的新按钮为空')
    return
  }
  newButton.onclick = () => {
    format(config)
  }
  const container = document.querySelector(config.containerSelector)
  if (container != null) {
    container.appendChild(newButton)
  } else {
    console.info('无法找到container')
  }
}

function findConfigByHost(host) {
  console.info('当前网页host:', host)
  switch (host) {
    case DEEPL_TRANSLATE_CONFIG.host:
      return DEEPL_TRANSLATE_CONFIG
    case GOOGLE_FANYI_CONFIG.host:
      return GOOGLE_FANYI_CONFIG
    case GOOGLE_TRANSLATE_CONFIG.host:
      return GOOGLE_TRANSLATE_CONFIG
    case BAIDU_FANYI_CONFIG.host:
      return BAIDU_FANYI_CONFIG
    case YOUDAO_FANYI_CONFIG.host:
      return YOUDAO_FANYI_CONFIG
    default:
      return null
  }
}

;(function () {
  //'use strict';
  console.log('%s毫秒后加载格式化按钮', LOADING_WAIT_TIME)
  window.setTimeout(function () {
    const config = findConfigByHost(window.location.host)
    createButtonByConfig(config)
    console.log('加载格式化按钮完成')
  }, LOADING_WAIT_TIME)
})()
