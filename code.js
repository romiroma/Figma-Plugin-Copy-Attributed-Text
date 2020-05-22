// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
function getAttributes(node, getter) {
    let attributes = {};
    for (var endIndex = 1; endIndex <= node.characters.length; endIndex++) {
        let startIndex = endIndex - 1;
        let attribute = getter(startIndex, endIndex);
        if (attribute != figma.mixed) {
            attributes[startIndex] = attribute;
        }
    }
    return attributes;
}
function getSize(size) {
    return 'font-size: ' + size + 'px;';
}
function getFamily(fontName) {
    let fontWeight;
    switch (fontName.style) {
        case 'Black': {
            fontWeight = '900';
            break;
        }
        case 'Heavy': {
            fontWeight = '800';
            break;
        }
        case 'Bold': {
            fontWeight = '700';
            break;
        }
        case 'Semibold': {
            fontWeight = '600';
            break;
        }
        case 'Medium': {
            fontWeight = '500';
            break;
        }
        case 'Regular': {
            fontWeight = '400';
            break;
        }
        case 'Thin': {
            fontWeight = '300';
            break;
        }
        case 'Light': {
            fontWeight = '200';
            break;
        }
        case 'Ultralight': {
            fontWeight = '100';
            break;
        }
    }
    return 'font-family: ' + fontName.family + ';' + 'font-weight: ' + fontWeight + ';';
}
// TODO: RESOLVE  MORE PAINT TYPES
function getColor(paint) {
    let p = paint[0];
    if (p.type == "SOLID") {
        let a;
        if (p.opacity === undefined) {
            a = 1;
        }
        else {
            a = p.opacity;
        }
        return 'color: rgba(' + p.color.r * 255 + ',' + p.color.g * 255 + ',' + p.color.b * 255 + ',' + a + ');';
    }
    else {
        return '';
    }
}
function main() {
    const selectedTextNode = figma.currentPage.selection[0];
    if ((selectedTextNode != undefined) && (selectedTextNode.characters != undefined)) {
        let fontSizeGetter = (start, end) => {
            return selectedTextNode.getRangeFontSize(start, end);
        };
        let fontNameGetter = (start, end) => {
            return selectedTextNode.getRangeFontName(start, end);
        };
        let fillsGetter = (start, end) => {
            return selectedTextNode.getRangeFills(start, end);
        };
        let fontSizes = getAttributes(selectedTextNode, fontSizeGetter);
        let fontNames = getAttributes(selectedTextNode, fontNameGetter);
        let fills = getAttributes(selectedTextNode, fillsGetter);
        console.log('fontSizes', fontSizes);
        console.log('fontNames', fontNames);
        console.log('fills', fills);
        let body = '';
        const characters = selectedTextNode.characters;
        for (var i = 0; i < characters.length; i++) {
            let span = '<span style="' + getSize(fontSizes[i]) + getFamily(fontNames[i]) + getColor(fills[i]) + '">' + characters[i] + '</span>';
            body = body + span;
        }
        let copy = true;
        figma.ui.postMessage({ body, copy });
    }
    else {
        let copy = false;
        let body = 'No text selected';
        figma.ui.postMessage({ body, copy });
    }
}
main();
figma.on('selectionchange', () => {
    main();
});
