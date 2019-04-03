import m from "mithril";

// Cross browser get / set of scrollTop / scrollTopMax

const elementToScroll = document.scrollingElement || document.documentElement || document.body;

const elementForClientHeight = document.documentElement || document.body;

const setScrollTop = (scrollTop) => {
    elementToScroll.scrollTop = scrollTop;
}

const getScrollTop = () => {
    return elementToScroll.scrollTop;
}

const getScrollTopMax = elementToScroll.scrollTopMax != null
    ? () => elementToScroll.scrollTopMax
    : () => (elementToScroll.scrollHeight - elementForClientHeight.clientHeight)

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
        history.replaceState({ scrollTop: scrollTopValue }, null);
    }, 250, scrollTop);
}

export const initScrollRestoration = () => {
    // Disable browser scroll restoration.
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
