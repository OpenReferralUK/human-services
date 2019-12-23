export const getHTMLServicesList = (items) => {
    const date = new Date();
    var isIE = false || !!document.documentMode;
    var userAgent = window.navigator.userAgent;
    const URLparams = window.location;
    const host = `${URLparams.protocol}//${URLparams.hostname}${URLparams.port ? `:${URLparams.port}/` : '/'}`;
    if (userAgent.match(/iPad/i) || userAgent.match(/iPhone/i) || isIE) {
        let stringHTML = `List of saved searches from Service Finder (on ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}):\n\n`;
        items.map(item => {
            let html = `${item.name}:\n${host}service/${item.id}\n`
            return stringHTML += html + '\n';
        });
        textToClipboard(stringHTML);
    } else {
        let stringHTML = `<div><h3 style="color: black"><b>List of saved searches from Service Finder (on ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}):</b></h3><ul>`;

        items.map(item => {
            let html = `<li><a href="${host}service/${item.id}">${item.name}</a></li>`
            return stringHTML += html;
        });
        stringHTML += "</ul></div>"
        copyToClip(stringHTML);
    }
}

export const copyToClip = (str) => {
    const listener = (e) => {
        e.clipboardData.setData("text/html", str);
        e.clipboardData.setData("text/plain", str);
        e.preventDefault();
    }
    document.addEventListener("copy", listener);
    document.execCommand("copy");
    document.removeEventListener("copy", listener);
};

export const textToClipboard = (text) => {
    var dummy = document.createElement("textarea");
    document.body.appendChild(dummy);
    dummy.value = text;
    dummy.select();
    let res = document.execCommand("copy");
    document.body.removeChild(dummy);
    if (res) return true;
    return false;
}