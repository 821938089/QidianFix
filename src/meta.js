// ==UserScript==
// @name        QidianFix
// @name:zh-CN  起点优化
// @namespace   83ffa0c4-4041-4973-91be-e60b27c7bef9
// @description 修复起点网页无缝阅读模式下浏览器地址栏 URL 不更新的问题
// @match       *://www.qidian.com/chapter/*/*/
// @match       *://read.qidian.com/chapter/*/*/
// @match       *://vipreader.qidian.com/chapter/*/*/
// @grant       GM_addStyle
// @grant       unsafeWindow
// @version     process.env.VERSION
// @author      process.env.AUTHOR
// @require     https://cdn.staticfile.org/jquery/2.1.1/jquery.min.js
// @require     https://cdn.staticfile.org/underscore.js/1.7.0/underscore-min.js
// @require     https://cdn.jsdelivr.net/combine/npm/@violentmonkey/dom@2,npm/@violentmonkey/ui@0.7
// ==/UserScript==

/**
 * The @grant's used in your source code will be added automatically by rollup-plugin-userscript.
 * However you have to add explicitly those used in required resources.
 */
