/*
Copyright (c) 2023 Jefferson Venancius

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.
 */

// TODO - if it's greater?
// TODO - if it's opened?
// TODO - it '
// I'm working on convertIndentation !!!!!


let textArea = document.querySelector('textarea');

 // Needed Regexes
const READABLE_CHARS = /[^\\|\s]/
const FIRST_TAB = /^\t[^\\|\s]/
const NOT_TWO_DOTS = /[^:| ].*/ 
const TABS = /<[\t]*/

function preventTab(e) { // Thanks to Ben Borgers for that.
  if (e.keyCode === 9) {
    e.preventDefault()

    textArea.setRangeText(
      '\t',
      textArea.selectionStart,
      textArea.selectionStart,
      'end'
    )
  }
}

function getSingleLineQuotes(splittedTxt){
  let putItBackArray = [];
  for (i = 0; i < splittedTxt.length; i++) {
    let phrase = splittedTxt[i]
    let lastLetters = phrase.substr(phrase.search(":"))
    let matched = lastLetters.match((NOT_TWO_DOTS))
    if (matched) {
      splittedTxt[i] = phrase.replace(matched,'')
      putItBackArray.push(splittedTxt[i])
      putItBackArray.push(matched[0])
      } else {
        putItBackArray.push(splittedTxt[i])
      }
    }
  return putItBackArray
}

function searchFirstInstanceOf(strArray, pattern) {
  let firsInstance = ''
  for (i = 0; i < strArray.length; i++) {
    if (strArray[i].includes(pattern)) {
      firstInstance = strArray[i]
      break
    }
  }
  return firstInstance
}

function getUntabed(txt) {
  return txt.split('\t')[txt.split('\t').length-1]
}

function countTabs(txt) {
return txt.match(TABS)[0].split('\t').length - 1
}

function convertIndentation(txt) {
  // count number of tabs at the begining of each string
  // if it's greater than before than it is inside
  // elif it is equal or less then it's outside

  let parentTag = searchFirstInstanceOf(txt, '<')
  let tabCount = countTabs(parentTag)
  let newTabCount = tabCount
    
  parentTag = '<' + getUntabed(parentTag)
  let newTxt = [parentTag]

  for (i = 0; i < txt.length; i++) {
    tabCount = countTabs(txt[i])
    if (tabCount < newTabCount) {
      newTxt.push(parentTag.replace('<','</'))
      parentTag = txt[i]
      newTxt.push('<' + getUntabed(parentTag))
      tabCount = newTabCount
    }
    if (i == txt.length-1) {
      newTxt.push('</' + parentTag.split('\t')[parentTag.split('\t').length-1])
  }
  console.log(newTxt)
}}

function createChevrons(txt) {
  let regex = new RegExp(/: */)
  txt = txt.map(i => {
    if (regex.test(i)) {
      i = i.split(':')[0]
      return '<' + i + '>'
    }
    return i
  })
  return txt
}

function markOpenedTags(txt) {
  txt = txt.map(i => {

  })
  return txt
}

function parse2mtml() {
  let txt = textArea.value;
  let splittedTxt = txt.split('\n')
  splittedTxt = getSingleLineQuotes(splittedTxt);
  splittedTxt = createChevrons(splittedTxt)
  convertIndentation(splittedTxt.filter(i => i.length > 2))
  }

