const path = require('path');
const JsonML = require('jsonml.js/lib/utils');
const transformer = require('bisheng-plugin-react/lib/transformer');

function getCode(node) {
  return JsonML.getChildren(JsonML.getChildren(node)[0])[0];
}

function getChineseIntroStart(contentChildren) {
  return contentChildren.findIndex(node => (
    JsonML.getTagName(node) === 'h2' && JsonML.getChildren(node)[0] === 'zh-CN'
  ));
}

function getEnglishIntroStart(contentChildren) {
  return contentChildren.findIndex(node => (
    JsonML.getTagName(node) === 'h2' && JsonML.getChildren(node)[0] === 'en-US'
  ));
}

function getCodeIndex(contentChildren) {
  return contentChildren.findIndex(node => (
    JsonML.getTagName(node) === 'pre' && JsonML.getAttributes(node).lang === 'jsx'
  ));
}

function getSourceCodeObject(contentChildren, codeIndex) {
  if (codeIndex > -1) {
    return getCode(contentChildren[codeIndex]);
  }

  return null;
}

function isStyleTag(node) {
  return node && JsonML.getTagName(node) === 'style';
}

function getStyleNode(contentChildren) {
  return contentChildren.filter(node => (
    isStyleTag(node) || (JsonML.getTagName(node) === 'pre' && JsonML.getAttributes(node).lang === 'css')
  ))[0];
}

module.exports = (markdownData) => {
  const isDemo = /\/demo$/i.test(path.dirname(markdownData.meta.filename));
  if (!isDemo) return markdownData;
  const contentChildren = JsonML.getChildren(markdownData.content);
  const chineseIntroStart = getChineseIntroStart(contentChildren);
  const englishIntroStart = getEnglishIntroStart(contentChildren);
  const codeIndex = getCodeIndex(contentChildren);
  const introEnd = codeIndex === -1 ? contentChildren.length : codeIndex;
  if (chineseIntroStart > -1 /* equal to englishIntroStart > -1 */) {
    markdownData.content = {
      'zh-CN': contentChildren.slice(chineseIntroStart + 1, englishIntroStart),
      'en-US': contentChildren.slice(englishIntroStart + 1, introEnd),
    };
  } else {
    markdownData.content = contentChildren.slice(0, introEnd);
  }

  // Add preview and highlightedCode to markdown data
  const sourceCodeObject = getSourceCodeObject(contentChildren, codeIndex);

  if (sourceCodeObject) {
    markdownData.highlightedCode = contentChildren[codeIndex].slice(0, 2);
    markdownData.preview = {
      __BISHENG_EMBEDED_CODE: true,
      code: transformer(sourceCodeObject),
    };
  }

  // Add style node to markdown data.
  const styleNode = getStyleNode(contentChildren);

  if (isStyleTag(styleNode)) {
    markdownData.style = JsonML.getChildren(styleNode)[0];
  } else if (styleNode) {
    const styleTag = contentChildren.filter(isStyleTag)[0];

    markdownData.style = getCode(styleNode) + (styleTag ? JsonML.getChildren(styleTag)[0] : '');
    markdownData.highlightedStyle = JsonML.getAttributes(styleNode).highlighted;
  }

  return markdownData;
};
