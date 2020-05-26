// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

type Getter<T> = (start: number, end: number) => T | PluginAPI['mixed']

function getAttributes<T>(count: number, getter: Getter<T>): T[] {
  let attributes: T[] = []

  for (var endIndex = 1; endIndex <= count; endIndex++) {
    let startIndex = endIndex - 1
    let attribute  = getter(startIndex, endIndex)
    if (attribute != figma.mixed) {
      attributes.push(attribute)
    } else {
      attributes.push(null)
    }
  }

  return attributes
}

function getSize(size: number | PluginAPI['mixed']): string {
  if (size == figma.mixed) {
    return ''
  } else {
    return 'font-size:' + size + 'px;'
  }
}

function getFamily(fontName: FontName | PluginAPI['mixed']): string {
  if (fontName == figma.mixed) {
    return ''
  }
  let fontWeight: string
  let fontStyle = 'normal'
  switch (fontName.style.toLowerCase()) {
    case 'black': { fontWeight = '900'; break; }
    case 'heavy': { fontWeight = '800'; break; }
    case 'bold': { fontWeight = '700'; break; }
    case 'semibold': { fontWeight = '600'; break; }
    case 'medium': { fontWeight = '500'; break; }
    case 'regular': { fontWeight = '400'; break; }
    case 'thin': { fontWeight = '300'; break; }
    case 'light': { fontWeight = '200'; break; }
    case 'ultralight': { fontWeight = '100'; break; }
    case 'extralight': { fontWeight = '100'; break; }
    case 'italic': { fontWeight = '400'; fontStyle = 'italic'; break; }
    case 'ultralight italic': { fontWeight = '100'; fontStyle = 'italic'; break; }
    case 'light italic': { fontWeight = '200'; fontStyle = 'italic'; break; }
    case 'thin italic': { fontWeight = '300'; fontStyle = 'italic'; break; }
    case 'regular italic': { fontWeight = '400'; fontStyle = 'italic'; break; }
    case 'medium italic': { fontWeight = '500'; fontStyle = 'italic'; break; }
    case 'semibold italic': { fontWeight = '600'; fontStyle = 'italic'; break; }
    case 'bold italic': { fontWeight = '700'; fontStyle = 'italic'; break; }
    case 'heavy italic': { fontWeight = '800'; fontStyle = 'italic'; break; }
    case 'black italic': { fontWeight = '900'; fontStyle = 'italic'; break; }
    
  }
  return 'font-family: \'' + fontName.family + '\';' + 'font-weight: ' + fontWeight + ';' + 'font-style:' + fontStyle +';'
}

function getTextAlignHorizontal(textAlign: string): string {
  let result = 'text-align:'
  switch (textAlign) {
    case undefined: { result = ''; break; }
    case 'LEFT': { result += ' left;'; break; }
    case 'RIGHT': { result += ' right;'; break; }
    case 'CENTER': { result += ' center;'; break; }
    case 'JUSTIFIED': { result += ' justify;'; break; }
  }
  return result
}

function getTextIndent(indent: number): string {
  if (indent == undefined) {
    return ''
  }
  return 'text-indent: ' + indent + 'px;'
}

function getLineHeight(lineHeight: LineHeight | PluginAPI['mixed']): string {
  if (lineHeight == figma.mixed) {
    return ''
  }
  let result = 'line-height: '
  if ('value' in lineHeight) {
    result += lineHeight.value
    switch (lineHeight.unit) {
      case "PERCENT":
        { result += '%'; break; }
      case "PIXELS":
        { result += 'px'; break; }
    }
    result += ';';
    
  } else {
    result += 'auto;'
  }
  return result
}

function getTextDecoration(textDecoration: TextDecoration | PluginAPI['mixed']) {
  if (textDecoration == figma.mixed) {
    return ''
  }
  let result = 'text-decoration: '
  switch (textDecoration) {
    case undefined: { result = ''; break; }
    case "NONE": { result = ''; break; }
    case "STRIKETHROUGH": { result += 'line-through;'; break; }
    case "UNDERLINE": { result += 'underline;'; break; }
  }
  return result
}

// TODO: RESOLVE  MORE PAINT TYPES
function getColor(paint: Paint[] | PluginAPI['mixed']): string {
  if (paint == figma.mixed) {
    return ''
  }
  let p = paint[0]
  if (p.type == "SOLID") {
    let a: number
    if (p.opacity === undefined) {
      a = 1
    } else {
      a = p.opacity
    }
    return 'color: rgba(' + p.color.r * 255 + ',' + p.color.g * 255 + ',' + p.color.b * 255 + ',' + a + ');'
  } else {
    return ''
  }
}

function getLetterSpacing(letterSpacing: LetterSpacing | PluginAPI['mixed']): string {
  if ((letterSpacing == undefined) || (letterSpacing == figma.mixed)) {
    return ''
  }
  let result = 'letter-spacing: '
  switch (letterSpacing.unit) {
    case "PERCENT": { result += letterSpacing.value / 100 + 'em;'; break; }
    case "PIXELS": { result += letterSpacing.value + 'px;'; break; }
  }
  return result
}

function getTextCase(textCase: TextCase | PluginAPI['mixed']): string {
  if ((textCase == undefined) || (textCase == figma.mixed)) {
    return ''
  }
  let result = 'text-transform: '
  switch (textCase) {
    case undefined: { result = ''; break; }
    case "LOWER": { result += 'lowercase'; break; }
    case "ORIGINAL": { result += 'none'; break; }
    case "TITLE": { result += 'capitalize'; break; }
    case "UPPER": { result += 'uppercase'; break; }
  }
  return result
}

function main() {

  figma.ui.resize(240, 180)

  const selectedTextNode = <TextNode>figma.currentPage.selection[0]
  if ((selectedTextNode != undefined) && (selectedTextNode.characters != undefined)) {

    const characters: string = selectedTextNode.characters
    const charactersCount = characters.length

    const textAlignHorizontal = getTextAlignHorizontal(selectedTextNode.textAlignHorizontal)
    const textIndent = getTextIndent(selectedTextNode.paragraphIndent)

    let body: string = '<p style="' + textIndent + textAlignHorizontal + '">'
    for (var i = 0; i < characters.length; i++) {

      const startIndex = i
      const endIndex = startIndex + 1

      const fontSize = selectedTextNode.getRangeFontSize(startIndex, endIndex)
      const family = selectedTextNode.getRangeFontName(startIndex, endIndex)
      const fill = selectedTextNode.getRangeFills(startIndex, endIndex)
      const lineHeight = selectedTextNode.getRangeLineHeight(startIndex, endIndex)
      const letterSpacing = selectedTextNode.getRangeLetterSpacing(startIndex, endIndex)
      const textDecoration = selectedTextNode.getRangeTextDecoration(startIndex, endIndex)
      const textCase = selectedTextNode.getRangeTextCase(startIndex, endIndex)

      let character: string
      if (characters.charCodeAt(i) == 10) {
        character = '<br/>'
      } else {
        character = characters[i]
      }
      let span: string = '<span style="' + getSize(fontSize)+getFamily(family)+getColor(fill)+getLineHeight(lineHeight)+getLetterSpacing(letterSpacing)+getTextDecoration(textDecoration)+getTextCase(textCase)+'">'+character+'</span>'
      body = body + span
    }
    body += '</p>'

    let codes = []
    for (var i=0; i< characters.length; i++) {
      codes.push(characters.charCodeAt(i))
    }
    // console.log(characters)
    // console.log(codes)
    // console.log(body)

    const copy = true
    const cuttedText = characters.slice(0, 16) + '...';
    const notification = 'Attributed text (' + cuttedText + ') copied to clipboard'
    figma.ui.postMessage({ body, copy, notification }) 
  } else {
    const copy = false
    const body = ''
    const notification = 'Select text to copy'
    figma.ui.postMessage({ body, copy, notification })
  }
}

main()

figma.on('selectionchange', () => {
  main()
})