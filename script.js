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
// TODO - if '
// I'm working on convertIndentation !!!!!


let textArea = document.querySelector('textarea');

 // Needed Regexes
const READABLE_CHARS = /[^\\|\s]/
const FIRST_TAB = /^\t[^\\|\s]/
const NOT_TWO_DOTS = /[^:| ].*/ 
const TWO_DOTS = /: *$/
const OPEN_QUOTE = / *['|"]/
const TABS = /[^<| |'|"][\t]*/
const SELF_CLOSED_TAG = /[^'|"| |\t]./

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
      putItBackArray.push(splittedTxt[i] + matched[0])
      } else {
        putItBackArray.push(splittedTxt[i])
      }
    }
  return putItBackArray
}

function searchFirstInstanceOf(strArray, pattern) {
  let isItThere = new RegExp(pattern)
  let firstInstance = ''
  for (i = 0; i < strArray.length; i++) {
    if (isItThere.test(strArray[i])) {
      firstInstance = strArray[i]
      break
    }
  }
  return strArray.indexOf(firstInstance)
}

function getUntabed(txt) {
  return txt.split('\t')[txt.split('\t').length-1]
}

function countTabs(txt) {
return txt.match(TABS)[0].split('\t').length - 1
}

function getTotalTabs(txt) {
  let numberOfTabs = 0

  for (let i = 0; i < txt.length; i++) {
    let tabsCounted = countTabs(txt[i])
    if (tabsCounted > numberOfTabs) {numberOfTabs = tabsCounted}
  }
  return numberOfTabs
}

function getTabs(tabsNumber, endOfTabs) {
  let tabs = ''
  for (let i = 0; i <= tabsNumber; i++) {
    tabs += '\t'
  }
  if (!tabs) endOfTabs = ''
  return tabs + endOfTabs
}

function conversion(txt) {
  let twoDots = new RegExp(TWO_DOTS)
  let openQuote = new RegExp(OPEN_QUOTE)
  if (twoDots.test(txt)) {
    return '<' + txt + '>'
  } else if (openQuote.test(txt)) {
      return "$value$" + txt.replace(openQuote, '')
  } else {
    return txt // tag without closing.
  }
}

function sanatize(txt, mark) {
  if (mark == '<') {

    txt = getTabs(countTabs(txt), '<') + getUntabed(txt)
    txt = txt.replace(':>', '>')
  } else if (mark == '$') {
    txt = txt.replace('$value$', '')
    txt = getTabs(countTabs, '') + getUntabed(txt)
  } else {
    txt = getTabs(countTabs(txt), '<') + getUntabed(txt) + '>'
  }
  return txt
}

function convertIndentation(txt) {
  // count number of tabs at the begining of each string
  // if it's greater than before than it is inside
  // elif it is equal or less then it's outside
  let parentTag = () => {
    let instanceArr = [searchFirstInstanceOf(txt,'<'), searchFirstInstanceOf(txt,SELF_CLOSED_TAG)] 

      if (instanceArr[0] < instanceArr[1]) { 
        return instanceArr[0]
      }
      return instanceArr[1]
    }
  let firstOf = txt[parentTag()].includes(':')
  let tabsArray = []
  let totalTabs = getTotalTabs(txt) + 1
  for (i = 0; i < totalTabs; i++) tabsArray.push('')
  tabsArray[parentTag()] = txt[parentTag()]
  parentTag = txt[parentTag()]
  let newTxt = []
  let tabCount = countTabs(parentTag) + 1 
  let newTabCount = tabCount

  for (i = 0; i < txt.length; i++) {
    newTabCount = countTabs(txt[i]) + 1
    // let sanatized = sanatize(txt[i], txt[i][0])
    switch (txt[i][0]) {
      case '<':
        let oldParentTag = parentTag
        if (newTabCount <= tabCount ) {
          if (firstOf) {
            newTxt.push(oldParentTag.replace('<', '</').replace(':>','>'))
            parentTag = sanatized
            console.log(parentTag, oldParentTag)
            // sanatized = oldParentTag.replace('<', '</').replace(':>','>')
          }
          parentTag = txt[i]
          firstOf = txt[i].includes(':')
          tabCount = newTabCount + 1
        } else {
          // console.log(sanatize(txt[i], txt[i][0]))
        }
        break

        case "$":
        break
      
      default:
        break
    }
    newTxt.push(sanatized)
}
console.log(newTxt)
// newTxt.shift()
// if (firstOf) {
//   parentTag = parentTag.replace('<','</')
//   parentTag = parentTag.replace(':>','>')
//   newTxt.push(parentTag)
// }
}

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
  splittedTxt = splittedTxt.map(i => (conversion(i)))
  convertIndentation(splittedTxt)
  }

