// startsWith is not valid in IE11
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (searchString, position) {
        position = position || 0;
        return this.substr(position, searchString.length) === searchString;
    };
}

function removeTagsFromString(inString) {
    const div = document.createElement("div");
    div.innerHTML = inString;
    return div.textContent || div.innerText || "";
}


function validateDate(inDate) {

    const date = inDate.value;
    const pattern = /^([0-9]{1,2})\/([0-9]{1,2})\/([0-9]{4})$/;

    if (date == null || date === "") {
        return true;
    }
    if (!pattern.test(date)) {
        alert('invalid date format');
        inDate.focus();
        return false;
    }
}

function validateTime(inTime) {

    const time = inTime.value;

    const pattern = /^([0-2][0-9]):([0-5][0-9])(:[0-5][0-9])?$/;

    if (time == null || time === "") {
        return true;
    }
    if (!pattern.test(time)) {
        alert('invalid time format');
        inTime.focus();
        return false;
    }
}


function clearFilters(DivId) {

    DivId = (DivId === undefined) ? '' : DivId;


    const all = document.getElementsByTagName("*");
    let i = 0;
    const max = all.length;
    for (; i < max; i++) {
        let boolFilter = false;
        let FilterName = '';
        if (all[i].id.substring(0, 7) === "filter_") {
            boolFilter = true;
            FilterName = all[i].id;
        }
        const DivFilter = DivId + '_filter_';
        if (all[i].id.substring(0, DivFilter.length) === DivFilter) {
            boolFilter = true;
            FilterName = all[i].id.replace(DivFilter + '_', '');
        }

        if (boolFilter === true) {
            all[i].value = '';
        }
    }

}

function getElementValue(Element) {

    switch (Element.tagName.toLowerCase()) {
        case "select":
            return Element.options[Element.selectedIndex].value;
        case "input":
            return Element.value;
    }

    return null;

}

function nl2br(str, is_xhtml) {
    const breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function addRowInnerHtml(rowParent, innerHtml) {

    try {
        rowParent.innerHTML += innerHtml;
    } catch (err) {

        const divTemp = rowParent.ownerDocument.createElement('div');
        divTemp.innerHTML = '<table>' + innerHtml + '</table>';

        const tbodyTemp = divTemp.firstChild.tBodies[0];
        for (let i = 0; i < tbodyTemp.rows.length; i++) {
            const newRow = tbodyTemp.rows[i].cloneNode(true);
            rowParent.appendChild(newRow);
        }

    }

}

function htmlDecode(input) {
    const e = document.createElement('div');
    e.innerHTML = input;
    return e.childNodes.length === 0 ? "" : e.childNodes[0].nodeValue;
}


const clsPdViz = function (Dot, ElementId, LoadingId, DeveloperId) {



    this.Generated = false;

    this.tagElement = null;
    this.spanLoading = null;

    Dot = (Dot === undefined) ? null : Dot;

    this.Dot = Dot;

    ElementId = (ElementId === undefined) ? null : ElementId;
    LoadingId = (LoadingId === undefined) ? null : LoadingId;
    DeveloperId = (DeveloperId === undefined) ? null : DeveloperId;

    if (LoadingId == null) {
        LoadingId = ElementId;
    }


    if (DeveloperId) {
        tagDeveloper = document.getElementById(DeveloperId);
    }

    this.ElementId = ElementId;
    this.tagElement = document.getElementById(ElementId);


    this.tagLoading = document.getElementById(LoadingId);


};


clsPdViz.prototype.prepareString = function (inString, MaxLength, BreakLength) {

    MaxLength = (MaxLength === undefined) ? 100 : MaxLength;
    BreakLength = (BreakLength === undefined) ? 30 : BreakLength;

    let outString = removeTagsFromString(inString);

    if (MaxLength) {
        if (outString.length > MaxLength) {
            outString = outString.substring(0, MaxLength) + ' ...';
        }
    }

    outString = htmlEntities(outString);


    if (BreakLength) {
        outString = this.splitStringIntoLines(outString, BreakLength, '<br/>');
    }


    return outString;

};

clsPdViz.prototype.splitStringIntoLines = function (inString, BreakLength, Delimiter) {

    Delimiter = (Delimiter === undefined) ? '<br/>' : Delimiter;

    const arrLines = [];

    const arrWords = inString.split(' ');
    let Line = '';
    for (let WordCount = 0; WordCount < arrWords.length; WordCount++) {
        if ((Line.length + arrWords[WordCount].length) > BreakLength) {
            if (Line) {
                arrLines.push(Line);
                Line = '';
            }
        }

        Line += arrWords[WordCount] + ' ';
        while (Line.length > BreakLength) {
            arrLines.push(Line.substring(0, BreakLength));
            Line = Line.substring(BreakLength);
        }

    }
    if (Line) {
        arrLines.push(Line);
        Line = '';
    }

    return arrLines.join(Delimiter);

};

clsPdViz.prototype.show = function (Format, Layout) {

    const objViz = this;

    objViz.setLoadingImage(true);

    Format = (Format === undefined) ? 'image' : Format;
    Layout = (Layout === undefined) ? 'dot' : Layout;

    switch (Format) {
        case 'image':

            try {
                objViz.tagElement.innerHTML = '';
//			var vizImage = Viz(objViz.Dot,'svg');

                const vizImage = Viz(objViz.Dot, {format: "svg", engine: Layout});


                objViz.butZoomIn = document.createElement("input");
                objViz.butZoomIn.type = "submit";
                objViz.butZoomIn.value = "+";
                objViz.butZoomIn.onclick = function () {
                    Width = objViz.svg.width.animVal.value * 1.1;
                    Height = objViz.svg.height.animVal.value * 1.1;
                    objViz.svg.setAttribute("width", Width);
                    objViz.svg.setAttribute("height", Height);
                };
                objViz.tagElement.appendChild(objViz.butZoomIn);

                objViz.butZoomOut = document.createElement("input");
                objViz.butZoomOut.type = "submit";
                objViz.butZoomOut.value = "-";
                objViz.butZoomOut.onclick = function () {
                    Width = objViz.svg.width.animVal.value * 0.9;
                    Height = objViz.svg.height.animVal.value * 0.9;
                    objViz.svg.setAttribute("width", Width);
                    objViz.svg.setAttribute("height", Height);
                };
                objViz.tagElement.appendChild(objViz.butZoomOut);


                objViz.divSvg = document.createElement("div");
                objViz.tagElement.appendChild(objViz.divSvg);


                objViz.divSvg.innerHTML = vizImage;


                objViz.svg = null;
                numSvgChildNodes = objViz.divSvg.childNodes.length;
                for (let i = 0; i < numSvgChildNodes; i++) {
                    if (objViz.divSvg.childNodes[i].nodeName === 'svg') {
                        objViz.svg = objViz.divSvg.childNodes[i];
                    }
                }


//			if (objViz.svg !== null){
//				objViz.svg.setAttribute("width","100%");
//				objViz.svg.setAttribute("height","100%");
//			}


            } catch (err) {
                alert('iframe');
                objViz.makeIframe();
            }
            break;
        case 'dot script':
            objViz.tagElement.innerHTML = '<pre>' + nl2br(htmlEntities(objViz.Dot)) + '</pre>';
            break;
    }

    objViz.setLoadingImage(false);


};


clsPdViz.prototype.makeIframe = function () {

    const objViz = this;

    objViz.tagElement.innerHTML = "";
    const iframe = document.createElement("iframe");
    iframe.height = "1200px";
    iframe.width = "95%";

    let dot = objViz.Dot;
    dot = dot.replace(/<b>/g, "");
    dot = dot.replace(/<\/b>/g, "");

    iframe.onload = function () {

        const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

        iframe.onload = function () {
        };

        const frm = iframeDoc.createElement('form');
        frm.method = 'POST';
        frm.action = 'https://chart.googleapis.com/chart';
        iframeDoc.body.appendChild(frm);


        const cht = iframeDoc.createElement('input');
        cht.type = 'hidden';
        cht.name = 'cht';
        cht.value = 'gv';
        frm.appendChild(cht);

        const chl = iframeDoc.createElement('input');
        chl.type = 'hidden';
        chl.name = 'chl';
        chl.value = dot;
        frm.appendChild(chl);


        if (frm) {
            frm.submit();
        }


    };
    objViz.tagElement.appendChild(iframe);


};


clsPdViz.prototype.setLoadingImage = function (boolOn) {

    boolOn = (boolOn === undefined) ? true : boolOn;

    const objThis = this;


    if (boolOn) {
        if (objThis.spanLoading == null) {
            objThis.spanLoading = document.createElement('span');
            objThis.tagLoading.appendChild(objThis.spanLoading);
        }
        objThis.spanLoading.innerHTML = '<img src="images/ajax-loader.gif" alt="loading"/>';
    } else {
        if (objThis.spanLoading !== null) {
            if (objThis.spanLoading.parentElement) {
                objThis.spanLoading.parentElement.removeChild(objThis.spanLoading);
            }
            objThis.spanLoading = null;
        }

    }


};


(function () {
    if (typeof window.CustomEvent === "function") return false; //If not IE

    function CustomEvent(event, params) {
        params = params || {bubbles: false, cancelable: false, detail: undefined};
        const evt = document.createEvent('CustomEvent');
        evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();
