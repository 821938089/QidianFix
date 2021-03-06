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

import { C } from "./log";
import qidianCss from './qidian.css'


class App {
    static bookTitle = $('.crumbs-nav > a:last').text();
    static curUrl = location.href.split('qidian.com')[1];

    static init() {
        // 调整本章说评论回复弹窗
        document.head.appendChild(<style>{qidianCss}</style>);

        // 无缝阅读模式 g_data.readSetting.rt = 1
        if (g_data.readSetting.rt) {
            C.log('[QidianFix] 脚本开始运行。');
            addEventListener(
                'scroll',
                _.throttle(App.updateChapterUrl, 600),
                true
            );
            
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
            App.loadChapterList()
        }
    }

    static loadChapterList() {
        // https://stackoverflow.com/a/27145432
        const event = new MouseEvent('mouseover', {
            view: unsafeWindow,
            bubbles: true,
            cancelable: true,
        });
        // Object.defineProperty(event, 'target', {
        //     value: document.querySelector('#j_navCatalogBtn > a > i'),
        //     enumerable: true,
        // });
        document.querySelector('#j_navCatalogBtn > a > i')?.dispatchEvent(event);
    }

    static scrollChapter() {
        //获取所有章节list
        var chapterList = $('.text-wrap'),
            win = $(window),
            scHeight = win.height(),
            scrollTop = win.scrollTop() + scHeight / 2;
        
        //章节遍历
        var chapterIdList = chapterList.map(function () {
            var that = $(this),
                //获取当前章节距离页面顶部的距离
                chapterItem = that.offset().top;
            //当章节scrollTop 小于 当前屏幕显示距顶部距离时,获取返回改章节id
            if (chapterItem < scrollTop) return that.data('cid');
        });

        //返回当前显示的章节id
        return chapterIdList[chapterIdList.length - 1];
    }
}

export default App;