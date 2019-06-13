# bisheng-plugin-preview

[![npm package](https://img.shields.io/npm/v/bisheng-plugin-preview.svg?style=flat-square)](https://www.npmjs.org/package/bisheng-plugin-preview)
[![NPM downloads](http://img.shields.io/npm/dm/bisheng-plugin-preview.svg?style=flat-square)](https://npmjs.org/package/bisheng-plugin-preview)

Generate a preview for Markdown files in bisheng.

## Usage

Install:

```bash
npm i --save bisheng-plugin-preview
```

Add 'bisheng-plugin-preview' to `bisehng.config.js`'s plugins.

```js
module.exports = {
  plugins: ['bisheng-plugin-preview'],
};
```

In Markdown:

<pre>
---
title: ...
...
---

This is description.

---

Add preview and highlightedCode to markdown data

```jsx
import { Input } from 'co-ui';

ReactDOM.render(
  <div className="container">
    <Input className="example" />
  </div>, 
  mountNode
);
```

Add highlightedStyle to markdown data

```css
.example {
  color: red;
}
```

Add style to markdown data

<style>
  .container {
    color: red;
  }
</style>
</pre>

In template:

```jsx
const { preview, highlightedCode, highlightedStyle, style } = pageData;

// use preview
<div> 
  {preview(React, ReactDOM)}
</div>

// use highlightedCode
<div> 
  {props.utils.toReactComponent(highlightedCode)}
</div>

// use highlightedStyle
<pre>
  <code dangerouslySetInnerHTML={{ __html: highlightedStyle }} />
</pre>

// use style 
<style dangerouslySetInnerHTML={{ __html: style }} />
```

## Liscense

MIT
