//  ES Module vs CommonJS?

// https://github.com/ludbek/mithril-componentx
// https://github.com/isiahmeadows/mithril-helpers

// https://diveintohtml5.info/detect.html
// https://diveintohtml5.info/everything.html
// const hasHistorySupport = () => {
//     return !!(window.history && window.history.pushState);
// }

import m from "mithril";

const setScrollTop = (scrollTop) => document.documentElement.scrollTop = scrollTop;

const getScrollTop = () => document.documentElement.scrollTop || document.body.scrollTop;

const getScrollTopMax = document.scrollingElement.scrollTopMax != null
    ? () => document.scrollingElement.scrollTopMax
    : () => (document.scrollingElement.scrollHeight - document.documentElement.clientHeight)

// Save the scroll position of the current page in its browser history state.
// Debounce, to make sure this is only done once, after scrolling
// has finished, not for every small incremental change.

let saveScrollTopTimer = null;

const saveScrollTop = (scrollTop) => {
    if(saveScrollTopTimer) {
        clearTimeout(saveScrollTopTimer);
        saveScrollTopTimer = null;
    }

    saveScrollTopTimer = setTimeout((scrollTopValue) => {
        console.log("ScrollRestoration.saveScrollTop", m.route.get(), scrollTopValue);

        m.route.set(m.route.get(), null, { replace: true, state: { scrollTop: scrollTopValue } });
    }, 250, scrollTop);
}

export const initScrollRestoration = () => {
    // Disable browser scroll restoration. This is available since Chrome 46
    // Otherwise the browser will try to restore the scroll position as well, which
    // results in the page jumping around on route changes
    // Also see https://developers.google.com/web/updates/2015/09/history-api-scroll-restoration

    if ('scrollRestoration' in history)
        history.scrollRestoration = 'manual';

    // Keep track of the current scroll position and store it
    // in the current pages browser history state

    document.addEventListener ('scroll', (e) => {
        saveScrollTop(getScrollTop());
    });

    // Also store the current scroll position if the user
    // navigates away

    window.addEventListener("beforeunload", () => {
        saveScrollTop(getScrollTop());
    });
};

export const ScrollRestoration = () => {
    let currentRoute = "";

    const scrollTo = (scrollTop) => {
        // By default, scroll to the beginning of the page
    
        // getScrollMax returns an int, getScrollTop returns a float sometimes, round down
        // to make sure we scroll to the end of a page if needed
    
        const scrollTopValue = (typeof scrollTop !== 'undefined') ? Math.floor(scrollTop) : 0;
    
        // Scroll only if enough content is available, otherwise try again in subsequent
        // calls when more content may be available
    
        if (scrollTopValue > getScrollTopMax())
            return false;
    
        setScrollTop(scrollTopValue);
    
        return true;
    }    

    const restoreScrollPosition = () => {
        if (currentRoute !== m.route.get()) {
            const scrollTop = history.state ? history.state.scrollTop : 0;

            console.log("ScrollRestoration.restoreScrollPosition", currentRoute, m.route.get(), scrollTop, getScrollTopMax());

            if (scrollTo(scrollTop))
                currentRoute = m.route.get();
        }
    };

    return {
        oncreate: () => restoreScrollPosition(),
        onupdate: () => restoreScrollPosition(),
        view: vnode => vnode.children
    }
}

export default ScrollRestoration;
