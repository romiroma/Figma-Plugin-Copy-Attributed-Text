// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).

// This shows the HTML page in "ui.html".
figma.showUI(__html__);

interface Dictionary<T> {
  [Key: number]: T
}

type Getter<T> = (start: number, end: number) => T

function getAttributes<T>(node: TextNode, getter: Getter<T>): Dictionary<T> {
  let attributes: Dictionary<T> = {}

  for (var endIndex = 1; endIndex <= node.characters.length; endIndex++) {
    let startIndex = endIndex - 1
    let attribute = getter(startIndex, endIndex)
    if (attribute != figma.mixed) {
      attributes[startIndex] = attribute
    }
  }

  return attributes
}

function getSize(size: number): string {
  return 'font-size: ' + size + 'px;'
}

function getFamily(fontName: FontName): string {
  let fontWeight: string
  switch (fontName.style) {
    case 'Black': { fontWeight = '900'; break; }
    case 'Heavy': { fontWeight = '800'; break; }
    case 'Bold': { fontWeight = '700'; break; }
    case 'Semibold': { fontWeight = '600'; break; }
    case 'Medium': { fontWeight = '500'; break; }
    case 'Regular': { fontWeight = '400'; break; }
    case 'Thin': { fontWeight = '300'; break; }
    case 'Light': { fontWeight = '200'; break; }
    case 'Ultralight': { fontWeight = '100'; break; }
  }
  return 'font-family: ' + fontName.family + ';' + 'font-weight: ' + fontWeight + ';'
}

// TODO: RESOLVE  MORE PAINT TYPES
function getColor(paint: Paint[]): string {
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

function main() {
  const selectedTextNode: TextNode = <TextNode>figma.currentPage.selection[0]
    
  if ((selectedTextNode != undefined) && (selectedTextNode.characters != undefined)) {

    let fontSizeGetter = (start: number, end: number): number | PluginAPI["mixed"] => {
      return selectedTextNode.getRangeFontSize(start, end)
    }

    let fontNameGetter = (start: number, end: number): FontName | PluginAPI["mixed"] => {
      return selectedTextNode.getRangeFontName(start, end)
    }

    let fillsGetter = (start: number, end: number): Paint[] | PluginAPI["mixed"] => {
      return selectedTextNode.getRangeFills(start, end)
    }

    let fontSizes = <Dictionary<number>>getAttributes(selectedTextNode, fontSizeGetter)
    let fontNames = <Dictionary<FontName>>getAttributes(selectedTextNode, fontNameGetter)
    let fills = <Dictionary<Paint[]>>getAttributes(selectedTextNode, fillsGetter)
    
    console.log('fontSizes', fontSizes)
    console.log('fontNames', fontNames)
    console.log('fills', fills)

    let body: string = ''

    const characters: string = selectedTextNode.characters
    for (var i = 0; i < characters.length; i++) {
      let span: string = '<span style="'+getSize(fontSizes[i])+getFamily(fontNames[i])+getColor(fills[i])+'">'+characters[i]+'</span>'
      body = body + span
    }

    let copy = true
    figma.ui.postMessage({ body, copy }) 
  } else {
    let copy = false
    let body = 'No text selected'
    figma.ui.postMessage({ body, copy })
  }
}

main()

figma.on('selectionchange', () => {
  main()
})