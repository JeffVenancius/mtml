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

function countTabs(txt) { // P.S - not tabbed items should be read as one so everything muist be offseted.
return txt.split('\t').length
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
  // let twoDots = new RegExp(TWO_DOTS)
  let openQuote = new RegExp(OPEN_QUOTE)
  if (openQuote.test(txt)) {
      return "'" + txt.replace(OPEN_QUOTE, "")
  // if (twoDots.test(txt)) {
  //   return '<' + txt + '>'
  // } else if (openQuote.test(txt)) {
  //     return "'" + txt.replace(OPEN_QUOTE, "")
  // } else {
  //   return txt // tag without closing.
  }
  return '<' + txt + '>'
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

function compareArrays(prevArray, nextArray) {
  // if (firstArr.length == secondArr.length) // could do that but I do know they are so... I won't.
  for (let i = 0; i < prevArray.length; i++) {
    if (prevArray[i] !== nextArray[i]) {
      return i
    }
  }
  return false
}

function dealWithLine(txt) {
  switch (txt[0]) {
    case '<':
      txt = txt.replace(':>', '>')
      break
    case '^':
      txt = txt.replace('^', '</')
      break
    case "'":
      txt = txt.replace("'", "")
      break
    default:
      txt = ' ' + txt
  }
      txt = getTabs(countTabs(txt), txt[0] == ' ' ? '': txt[0]) + getUntabed(txt)
  return txt
}


function filtering(cascadeArr) {
  return cascadeArr
  }

function getCascade(txt, i) {
      for (let ij = i; ij < txt.length; ij++) {
        if (i != ij){
          if (countTabs(txt[ij]) <= countTabs(txt[i])) {
            return [getTabs(countTabs(txt[i]), '</') + getUntabed(txt[i].replace(':','>')) , ij]
          }
        }
      }
  return ''
}

function convertIndentation(txt) {
  let twoDots = new RegExp(TWO_DOTS)
  let openQuote = new RegExp(OPEN_QUOTE)
  let newTxt = []
  let countTotalTabs = getTotalTabs(txt)
  let cascade = []
  newTxt = txt.slice()


  for (let i = 0; i < txt.length; i++) {
    if (twoDots.test(txt[i])) {
      cascade.push(getCascade(txt, i))
      newTxt[i] = getTabs(countTabs(txt[i]), '<') + getUntabed(txt[i].replace(':','>')) 
    } else if (openQuote.test(txt[i])) {
      newTxt[i] = txt[i].replace(OPEN_QUOTE, "")
    } else {
      newTxt[i] = getTabs(countTabs(txt[i]), '<') + getUntabed(txt[i]) + '>' 
    }
  }

  cascade = cascade.filter(i => i != "")
  for (let i = 0; i < cascade.length; i++) {
    newTxt.splice(cascade[i][1], 0, cascade[i][0])
  for (let j = i; j < cascade.length; j++) {
    if (cascade[i][1] < cascade[j][1]) {
      cascade[j][1] += 1
    }
    }
  }
  if (twoDots.test(txt[txt.length - 1])) { newTxt.push(getTabs(countTabs(txt[txt.length - 1]), '</') + getUntabed(txt[txt.length - 1].replace(':','>'))) }
  return newTxt
}

function createChevrons(txt) {
  let regex = new RegExp(/: */)
  txt = txt.map(i => {
    if (regex.test(i)) {
      i = i.spit(':')[0]
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
  splittedTxt = convertIndentation(splittedTxt)
  splittedTxt = splittedTxt.join('\n')
  console.log(splittedTxt)
  }

