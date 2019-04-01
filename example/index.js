import m from "mithril";
import { initScrollRestoration, ScrollRestoration } from "mithril-scroll-restoration";

const createContent = title =>
  [...Array(50)].map((x,i) =>
    i == 0 ? m("h1", title) :
    i == 25 ? createNav() :
    m("p", "line " + i)
  )

const createNav = () =>
  m("nav",
    [{'/': 'Home'}, {'/a': 'A'}, {'/a/somekey': 'A/1'}, {'/b': 'B'}]
    .map(link =>
      m('a', {
        href: Object.keys(link),
        oncreate: m.route.link
      }, Object.values(link))
    )
  )

const Layout = {
  view: vnode => [
    createNav(),
    vnode.children,
    createNav()
  ]
}

const Home = {
  view: () => createContent("Home")
}

const A = {
  view: vnode => createContent("A " + (vnode.attrs.key || ''))
}

const B = {
  view: () => createContent("B")
}

const Routes = {
  "/a":      {render: vnode => m(ScrollRestoration, m(Layout, m(A)))},
  "/a/:key": {render: vnode => m(ScrollRestoration, m(Layout, m(A, vnode.attrs)))},
  "/b":      {render: vnode => m(ScrollRestoration, m(Layout, m(B)))},
  "/":       {render: vnode => m(ScrollRestoration, m(Layout, m(Home)))}
}

initScrollRestoration();

m.route.prefix("");

m.route(document.body, "/", Routes);
