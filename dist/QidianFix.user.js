
// ==UserScript==
// @name        QidianFix
// @name:zh-CN  起点优化
// @namespace   83ffa0c4-4041-4973-91be-e60b27c7bef9
// @description 修复起点网页无缝阅读模式下浏览器地址栏 URL 不更新的问题
// @match       *://read.qidian.com/chapter/*/*/
// @match       *://vipreader.qidian.com/chapter/*/*/
// @version     0.0.7
// @author      Horis
// @require     https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require     https://cdn.staticfile.org/underscore.js/1.7.0/underscore-min.js
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// @grant       unsafeWindow
// ==/UserScript==

(function () {
'use strict';

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

var nullFn = function () {};

var C;
function toggleConsole(debug) {
  if (debug) {
    C = _extends({}, unsafeWindow.console);
  } else {
    C = {
      log: nullFn,
      debug: nullFn,
      error: nullFn,
      group: nullFn,
      groupCollapsed: nullFn,
      groupEnd: nullFn,
      time: nullFn,
      timeEnd: nullFn
    };
  }
}

var css_248z = ".review-replies-modal{top:50%;transform:translateY(-50%)}.review-replies-popup>.review-wrap .big-emoji{max-height:120px}";

// // global CSS

class App {
  static init() {
    // 调整本章说评论回复弹窗
    document.head.appendChild(VM.hm("style", null, css_248z)); // 无缝阅读模式 g_data.readSetting.rt = 1

    if (g_data.readSetting.rt) {
      C.log('[QidianFix] 脚本开始运行。');
      addEventListener('scroll', _.throttle(App.updateChapterUrl, 600), true);
    } else {
      C.log('[QidianFix] 当前阅读模式为经典翻页模式，脚本已关闭。');
    }
  }

  static updateChapterUrl() {
    // c = chapter
    const cId = App.scrollChapter();
    const cDom = $(`#nav-chapter-${cId} > a`);

    if (cDom.length) {
      const cName = cDom.text();
      const cUrl = cDom.attr('href').split('qidian.com')[1];
      if (App.curUrl === cUrl) return;
      App.curUrl = cUrl;
      history.pushState(null, '', cUrl);
      document.title = `${App.bookTitle} - ${cName}`;
    } else {
      App.loadChapterList();
    }
  }

  static loadChapterList() {
    // https://stackoverflow.com/a/27145432
    const event = new MouseEvent('mouseover', {
      view: unsafeWindow,
      bubbles: true,
      cancelable: true
    }); // Object.defineProperty(event, 'target', {
    //     value: document.querySelector('#j_navCatalogBtn > a > i'),
    //     enumerable: true,
    // });

    document.querySelector('#j_navCatalogBtn > a > i').dispatchEvent(event);
  }

  static scrollChapter() {
    //获取所有章节list
    var chapterList = $('.text-wrap'),
        win = $(window),
        scHeight = win.height(),
        scrollTop = win.scrollTop() + scHeight / 2; //章节遍历

    var chapterIdList = chapterList.map(function () {
      var that = $(this),
          //获取当前章节距离页面顶部的距离
      chapterItem = that.offset().top; //当章节scrollTop 小于 当前屏幕显示距顶部距离时,获取返回改章节id

      if (chapterItem < scrollTop) return that.data('cid');
    }); //返回当前显示的章节id

    return chapterIdList[chapterIdList.length - 1];
  }

}

App.bookTitle = $('.crumbs-nav > a:last').text();
App.curUrl = location.href.split('qidian.com')[1];

// import { getGreetings } from './app';
toggleConsole(true);
App.init();

})();
