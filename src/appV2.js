import { C } from './log';
import { getCookieValue } from './utils';

class AppV2 {
    static bookTitle = $('#r-breadcrumbs > a:last').text();
    static curUrl = location.href.split('qidian.com')[1];
    static bookId = '';

    static init() {
        const qdrs = getCookieValue('qdrs');
        const enableScrollPage = decodeURIComponent(qdrs).split('|')[3] === '1';
        if (enableScrollPage) {
            const json = $(document)
                .find('#vite-plugin-ssr_pageContext')
                .text();
            const { pageContext } = JSON.parse(json);
            const { bookId } = pageContext.pageProps.pageData.bookInfo;
            AppV2.bookId = bookId;
            C.log('[QidianFix] 脚本开始运行。');
            addEventListener(
                'scroll',
                _.throttle(AppV2.updateChapterUrl, 600),
                true
            );
        } else {
            C.log('[QidianFix] 当前阅读模式为经典翻页模式，脚本已关闭。');
        }
    }

    static updateChapterUrl() {
        const chapterElement = AppV2.scrollChapter();
        if (!chapterElement) {
            return;
        }
        const element = chapterElement.find('.print');
        const chapterId = element.data('id');
        const titleElement = element.find('h1').clone();
        titleElement.find('.review').remove();
        const chapterName = titleElement.text();

        const cUrl = `/chapter/${AppV2.bookId}/${chapterId}/`;

        if (AppV2.curUrl === cUrl) return;

        AppV2.curUrl = cUrl;
        history.pushState(null, '', cUrl);
        document.title = `${AppV2.bookTitle} - ${chapterName}`;
    }

    static scrollChapter() {
        //获取所有章节list
        var chapterList = $('#reader-content > div.min-h-100vh > div'),
            win = $(window),
            scHeight = win.height(),
            scrollTop = win.scrollTop() + scHeight / 2;

        //章节遍历
        var chapterIdList = chapterList.map(function () {
            var that = $(this),
                //获取当前章节距离页面顶部的距离
                chapterItem = that.offset().top;
            //当章节scrollTop 小于 当前屏幕显示距顶部距离时,获取返回章节元素
            if (chapterItem < scrollTop) return that;
        });

        //返回当前显示的章节元素
        return chapterIdList[chapterIdList.length - 1];
    }
}

export default AppV2;
