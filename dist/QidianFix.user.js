
// ==UserScript==
// @name        QidianFix
// @name:zh-CN  起点优化
// @namespace   83ffa0c4-4041-4973-91be-e60b27c7bef9
// @description 修复起点网页无缝阅读模式下浏览器地址栏 URL 不更新的问题
// @match       *://read.qidian.com/chapter/*/*/
// @match       *://vipreader.qidian.com/chapter/*/*/
// @version     0.0.0
// @author      Horis
// @require     https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require     https://cdn.staticfile.org/underscore.js/1.7.0/underscore-min.js
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// @grant       GM_addStyle
// @grant       unsafeWindow
// ==/UserScript==

(function () {
'use strict';

// // global CSS
// import globalCss from './style.css';
// // CSS modules
// import styles, { stylesheet } from './style.module.css';
// export function getGreetings() {
//   return (
//     <>
//       <div className={styles.panel}>
//         hello
//       </div>
//       <style>{globalCss}</style>
//       <style>{stylesheet}</style>
//     </>
//   );
// }
class App {
  static init() {
    // 无缝阅读模式 g_data.readSetting.rt = 1
    if (g_data.readSetting.rt) {
      addEventListener('scroll', _.throttle(App.updateChapterUrl, 200), true);
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
    });
    Object.defineProperty(event, 'target', {
      value: document.querySelector('#j_navCatalogBtn > a > i'),
      enumerable: true
    });
    document.querySelector('.theme-0').dispatchEvent(event);
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

function toggleConsole(debug) {
  if (debug) {
    _extends({}, unsafeWindow.console);
  }
}

// import { getGreetings } from './app';
toggleConsole(true);
App.init();

})();
