# mithril-scroll-restoration

Scroll restoration handling for MithrilJS.

## Integration

Please install the npm package:

```
$ npm install @pdehne/mithril-scroll-restoration
```

Then, in your top level JavaScript file, import mithril-scroll-restoration and initialize it:

```
import { initScrollRestoration, ScrollRestoration } from "./src/mithril-scroll-restoration";
...
initScrollRestoration();
m.route(document.body, "/", Routes);
```

Finally wrap your top level component in the provided ScrollRestoration component, for example:

```
const Layout = {
  view: vnode => m(ScrollRestoration, [
      m(NavBar),
      vnode.children,
      m(Footer)
  ])
}
```

## Example

See example.html / example.js / example.css for a working example. To run the example clone this repository, open a terminal, cd to the top level folder of the repository and run `npm install` followed by `npm start`.
