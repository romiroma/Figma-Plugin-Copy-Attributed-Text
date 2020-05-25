// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.
// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser environment (see documentation).
// This shows the HTML page in "ui.html".
figma.showUI(__html__);
function getAttributes(count, getter) {
    let attributes = [];
    for (var endIndex = 1; endIndex <= count; endIndex++) {
        let startIndex = endIndex - 1;
        let attribute = getter(startIndex, endIndex);
        if (attribute != figma.mixed) {
            attributes.push(attribute);
        }
    }
    return attributes;
}
function getSize(size) {
    return 'font-size: ' + size + 'px;';
}
function getFamily(fontName) {
    let fontWeight;
    // console.log(fontName.style.toLowerCase())
    // console.log(fontName)
    // console.log('some')
    let fontStyle = 'normal';
    switch (fontName.style.toLowerCase()) {
        case 'black': {
            fontWeight = '900';
            break;
        }
        case 'heavy': {
            fontWeight = '800';
            break;
        }
        case 'bold': {
            fontWeight = '700';
            break;
        }
        case 'semibold': {
            fontWeight = '600';
            break;
        }
        case 'medium': {
            fontWeight = '500';
            break;
        }
        case 'regular': {
            fontWeight = '400';
            break;
        }
        case 'thin': {
            fontWeight = '300';
            break;
        }
        case 'light': {
            fontWeight = '200';
            break;
        }
        case 'ultralight': {
            fontWeight = '100';
            break;
        }
        case 'extralight': {
            fontWeight = '100';
            break;
        }
        case 'italic': {
            fontWeight = '400';
            fontStyle = 'italic';
            break;
        }
        case 'ultralight italic': {
            fontWeight = '100';
            fontStyle = 'italic';
            break;
        }
        case 'light italic': {
            fontWeight = '200';
            fontStyle = 'italic';
            break;
        }
        case 'thin italic': {
            fontWeight = '300';
            fontStyle = 'italic';
            break;
        }
        case 'regular italic': {
            fontWeight = '400';
            fontStyle = 'italic';
            break;
        }
        case 'medium italic': {
            fontWeight = '500';
            fontStyle = 'italic';
            break;
        }
        case 'semibold italic': {
            fontWeight = '600';
            fontStyle = 'italic';
            break;
        }
        case 'bold italic': {
            fontWeight = '700';
            fontStyle = 'italic';
            break;
        }
        case 'heavy italic': {
            fontWeight = '800';
            fontStyle = 'italic';
            break;
        }
        case 'black italic': {
            fontWeight = '900';
            fontStyle = 'italic';
            break;
        }
    }
    return 'font-family: ' + fontName.family + ';' + 'font-weight: ' + fontWeight + ';' + 'font-style:' + fontStyle + ';';
}
function getTextAlignHorizontal(textAlign) {
    let result = 'text-align:';
    switch (textAlign) {
        case undefined: {
            result = '';
            break;
        }
        case 'LEFT': {
            result += ' left;';
            break;
        }
        case 'RIGHT': {
            result += ' right;';
            break;
        }
        case 'CENTER': {
            result += ' center;';
            break;
        }
        case 'JUSTIFIED': {
            result += ' justify;';
            break;
        }
    }
    return result;
}
function getTextIndent(indent) {
    if (indent == undefined) {
        return '';
    }
    return 'text-indent: ' + indent + 'px;';
}
function getLineHeight(lineHeight) {
    let result = 'line-height: ';
    if ('value' in lineHeight) {
        result += lineHeight.value;
        switch (lineHeight.unit) {
            case ("PERCENT"):
                {
                    result += '%';
                    break;
                }
            case ("PIXELS"):
                {
                    result += 'px';
                    break;
                }
        }
        result += ';';
    }
    else {
        result += 'auto;';
    }
    return result;
}
function getTextDecoration(textDecoration) {
    let result = 'text-decoration: ';
    switch (textDecoration) {
        case undefined: {
            result = '';
            break;
        }
        case "NONE": {
            result = '';
            break;
        }
        case "STRIKETHROUGH": {
            result += 'line-through;';
            break;
        }
        case "UNDERLINE": {
            result += 'underline;';
            break;
        }
    }
    return result;
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
function getLetterSpacing(letterSpacing) {
    if (letterSpacing == undefined) {
        return '';
    }
    let result = 'letter-spacing: ';
    switch (letterSpacing.unit) {
        case "PERCENT": {
            result += letterSpacing.value / 100 + 'em;';
            break;
        }
        case "PIXELS": {
            result += letterSpacing.value + 'px;';
            break;
        }
    }
    return result;
}
function getTextCase(textCase) {
    let result = 'text-transform: ';
    switch (textCase) {
        case undefined: {
            result = '';
            break;
        }
        case "LOWER": {
            result += 'lowercase';
            break;
        }
        case "ORIGINAL": {
            result += 'none';
            break;
        }
        case "TITLE": {
            result += 'capitalize';
            break;
        }
        case "UPPER": {
            result += 'uppercase';
            break;
        }
    }
    return result;
}
function main() {
    figma.ui.resize(240, 180);
    const selectedTextNode = figma.currentPage.selection[0];
    if ((selectedTextNode != undefined) && (selectedTextNode.characters != undefined)) {
        const fontSizeGetter = (start, end) => {
            return selectedTextNode.getRangeFontSize(start, end);
        };
        const fontNameGetter = (start, end) => {
            return selectedTextNode.getRangeFontName(start, end);
        };
        const fillsGetter = (start, end) => {
            return selectedTextNode.getRangeFills(start, end);
        };
        const lineHeightGetter = (start, end) => {
            return selectedTextNode.getRangeLineHeight(start, end);
        };
        const letterSpacingGetter = (start, end) => {
            return selectedTextNode.getRangeLetterSpacing(start, end);
        };
        const textDecorationGetter = (start, end) => {
            return selectedTextNode.getRangeTextDecoration(start, end);
        };
        const textCaseGetter = (start, end) => {
            return selectedTextNode.getRangeTextCase(start, end);
        };
        const characters = selectedTextNode.characters;
        const charactersCount = characters.length;
        const fontSizes = getAttributes(charactersCount, fontSizeGetter);
        const fontNames = getAttributes(charactersCount, fontNameGetter);
        const fills = getAttributes(charactersCount, fillsGetter);
        const lineHeights = getAttributes(charactersCount, lineHeightGetter);
        const letterSpacings = getAttributes(charactersCount, letterSpacingGetter);
        const textDecorations = getAttributes(charactersCount, textDecorationGetter);
        const textCases = getAttributes(charactersCount, textCaseGetter);
        const textAlignHorizontal = getTextAlignHorizontal(selectedTextNode.textAlignHorizontal);
        const textIndent = getTextIndent(selectedTextNode.paragraphIndent);
        let body = '<p style="' + textIndent + textAlignHorizontal + '">';
        for (var i = 0; i < characters.length; i++) {
            let character;
            if (characters.charCodeAt(i) == 10) {
                character = '<br/>';
            }
            else {
                character = characters[i];
            }
            let span = '<span style="' + getSize(fontSizes[i]) + getFamily(fontNames[i]) + getColor(fills[i]) + getLineHeight(lineHeights[i]) + getLetterSpacing(letterSpacings[i]) + getTextDecoration(textDecorations[i]) + getTextCase(textCases[i]) + '">' + character + '</span>';
            body = body + span;
        }
        body += '</p>';
        let codes = [];
        for (var i = 0; i < characters.length; i++) {
            codes.push(characters.charCodeAt(i));
        }
        console.log(characters);
        console.log(codes);
        console.log(body);
        const copy = true;
        const cuttedText = characters.slice(0, 16) + '...';
        const notification = 'Attributed text (' + cuttedText + ') copied to clipboard';
        figma.ui.postMessage({ body, copy, notification });
    }
    else {
        const copy = false;
        const body = '';
        const notification = 'Select text to copy';
        figma.ui.postMessage({ body, copy, notification });
    }
}
main();
figma.on('selectionchange', () => {
    main();
});
