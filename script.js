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



let textArea = document.querySelector('textarea');

// Needed Regexes
const NOT_TWO_DOTS = /[^:| ].*/ 
const TWO_DOTS = /: *$/
const OPEN_QUOTE = / *['|"]/
const TABS = /[^<| |'|"][\t]*/

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


function getUntabed(txt) {
  return txt.split('\t')[txt.split('\t').length-1]
}


function countTabs(txt) {
return txt.split('\t').length
}


function getTabs(tabsNumber, endOfTabs) {
  let tabs = ''
  for (let i = 0; i <= tabsNumber; i++) {
    tabs += '\t'
  }
  if (!tabs) endOfTabs = ''
  return tabs + endOfTabs
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
  let cascade = []
  newTxt = txt.slice()

  for (let i = 0; i < txt.length; i++) {
    if (twoDots.test(txt[i])) {
      cascade.push(getCascade(txt, i))
      newTxt[i] = createTag(txt[i], '<')
    } else if (openQuote.test(txt[i])) {
      newTxt[i] = txt[i].replace(OPEN_QUOTE, "")
    } else {
      newTxt[i] = createTag(txt[i], '<')
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
  if (twoDots.test(txt[txt.length - 1])) { newTxt.push(createTag(txt[txt.length - 1], '</')) }
  return newTxt
}

function createTag(txt, how) {
return closeTag(getTabs(countTabs(txt), how) + getUntabed(txt))
}

function closeTag(txt) {
  let twoDots = new RegExp(TWO_DOTS)
  if (twoDots.test(txt)) {
    return txt.replace(':', '>')
  }
  return txt + '>'
}

function parse2mtml() {
  let txt = textArea.value;
  if (txt) {
    txt = txt.split('\n')
    txt = getSingleLineQuotes(txt);
    txt = convertIndentation(txt)
    txt = txt.join('\n')
    textArea.value = txt
  }
}

