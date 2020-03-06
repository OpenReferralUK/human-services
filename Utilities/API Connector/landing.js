let endpoint;
let tool;
let size;

function updateURLParameter(url, param, paramVal) {
    let TheAnchor = null;
    let newAdditionalURL = "";
    let tempArray = url.split("?");
    let baseURL = tempArray[0];
    let additionalURL = tempArray[1];
    let temp = "";
    if (additionalURL) {
        let tmpAnchor = additionalURL.split("#");
        let TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheAnchor)
            additionalURL = TheParams;
        tempArray = additionalURL.split("&");
        for (let i = 0; i < tempArray.length; i++) {
            if (tempArray[i].split('=')[0] !== param) {
                newAdditionalURL += temp + tempArray[i];
                temp = "&";
            }
        }
    } else {
        let tmpAnchor = baseURL.split("#");
        let TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheParams)
            baseURL = TheParams;
    }
    if (TheAnchor)
        paramVal += "#" + TheAnchor;
    const rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function updateParameters(parm, parmVal) {
    window.history.replaceState('', '', updateURLParameter(window.location.href, parm, parmVal));
}

const getUrlParameter = function getUrlParameter(sParam) {
    let sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};

function onEndpointChange() {
    $.getJSON("endpoints.json", function (data) {
        $.each(data.endpoints, function (index, item) {
            let current = $("#endpoint").val();
            if (current === item.url) {
                endpoint = item;
                updateParameters("endpoint", item.url);
                return false;
            }
        });
    }).done(function () {
        let endpointDescription =
            (endpoint.title ? ("<p>" + (endpoint.title ? endpoint.title : '') + "</p>") : '') +
            "<table class='table table-responsive table-hover h-100'>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>URL: </td>" +
            "       <td><p class='dont-break-out'><a class='card-text' href=" + (endpoint.url ? endpoint.url : '') + " >" + (endpoint.url ? endpoint.url : '') + "</a></p></td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Description: </td>" +
            "       <td>" + (endpoint.description ? endpoint.description : '') + "</td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Supplier: </td>" +
            "       <td><div class='row d-flex'><div class='col flex-column'>" + (endpoint.supplier ? endpoint.supplier : '') + "</div><div class='col-auto flex-column align-items-end' style='max-height:3em'>" + (endpoint.logo ? endpoint.logo : '') + "</div></div></td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Info: </td>" +
            "       <td><p class='dont-break-out'>" + (endpoint.infoLink ? endpoint.infoLink : '') + "</p></td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Email: </td>" +
            "       <td>" + (endpoint.email ? endpoint.email : '') + "</td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Filters: </td>" +
            "       <td>" + (endpoint.filters ? endpoint.filters.join(', ') : '') + "</td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Output: </td>" +
            "       <td>" + (endpoint.output ? endpoint.output.join(', ') : '') + "</td>" +
            "   </tr>" +
            "</table>";
        $("#endpoint-description").empty().append(endpointDescription);
        $("#apiQueryEndpoint").prop("href", "https://opencommunity.porism.com/ApiQuery/?endpoint=" + endpoint.url);
        typeof tool != "undefined" && toolURL();
        $.when($("#endpoint-description").length > 0).then(function () {
            let svg = $("#endpointSupplier");
            svg.prop("height", svg.parent().height());
            $("#endpointSupplier").on("load", function () {
                let svg = $("#endpointSupplier");
                svg.prop("height", svg.parent().height());
            });
        });
    });
}

function onToolChange() {
    $.getJSON("tools.json", function (data) {
        $.each(data.tools, function (index, item) {
            let current = $("#tool").val();
            if (current === item.url) {
                tool = item;
                updateParameters("tool", item.url);
                $("#endpoint > option").prop("disabled", true);
                $.each($("#endpoint > option"), function (index, item) {
                    if (tool.compatible && tool.compatible.indexOf($(item).val()) > -1) {
                        $(item).prop("disabled", false);
                    }
                });
                if (tool.compatible && tool.compatible.indexOf($("#endpoint").val()) === -1) {
                    $("#endpoint").val(tool.compatible[0]);
                    onEndpointChange();
                }
                return false;
            }
        });
    }).done(function () {
        let toolDescription =
            (tool.title ? ("<p>" + (tool.title ? tool.title : '') + "</p>") : '') +
            "<table class='table table-responsive table-hover h-100'>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>URL: </td>" +
            "       <td><p class='dont-break-out'><a class='card-text' href=" + (tool.url ? tool.url : '') + " >" + (tool.url ? tool.url : '') + "</a></p></td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Supplier: </td>" +
            "       <td><div class='row d-flex'><div class='col flex-column'>" + (tool.supplier ? tool.supplier : '') + "</div><div class='col-auto flex-column align-items-end' style='max-height:3em'>" + (tool.logo ? tool.logo : '') + "</div></div></td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Description: </td>" +
            "       <td>" + (tool.description ? tool.description : '') + "</td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Info: </td>" +
            "       <td><p class='dont-break-out'>" + (tool.infoLink ? tool.infoLink : '') + "</p></td>" +
            "   </tr>" +
            "   <tr>" +
            "       <td style='vertical-align: top'>Email: </td>" +
            "       <td>" + (tool.email ? ("<a href='mailto:" + tool.email + "'>" + tool.email + "</a>") : "") + "</td>" +
            "   </tr>" +
            "</table>";
        $("#tool-description").empty().append(toolDescription);
        endpoint.url && toolURL();
        $.when($("#tool-description").length > 0).then(function () {
            turnArrow();
            let svg = $("#toolSupplier");
            svg.prop("height", svg.parent().height());
            $("#toolSupplier").on("load", function () {
                let svg = $("#toolSupplier");
                svg.prop("height", svg.parent().height());
            });
        });
    });
}

function toolURL() {
    if ($("#tool").val() === "https://docs.google.com/spreadsheets/") {
        // change to individual sheets for each endpoint
        $("#goToTool").prop("href", endpoint.sheet).prop("target", "_blank");
    } else if ($("#tool").val() === "https://opencommunity.porism.com/ServiceFinder/" && endpoint.supplier === "Placecube") {
        $("#goToTool").prop("href", tool.url + "?endpoint=" + endpoint.url + "&placecube=true");
    } else {
        $("#goToTool").prop("href", tool.url + "?endpoint=" + endpoint.url);
    }
}

window.onresize = function () {
    let toolSvg = $("#toolSupplier");
    toolSvg.prop("height", toolSvg.parent().height());

    let endpointSvg = $("#endpointSupplier");
    endpointSvg.prop("height", endpointSvg.parent().height());
};

$(function () {
    $.getJSON("endpoints.json", function (data) {
        $("#endpoint").empty();
        $.each(data.endpoints, function (index, item) {
            $("#endpoint").append("<option value='" + item.url + "'>" + item.name + "</option>");
        });
    }).done(function () {
        getUrlParameter("endpoint") && $("#endpoint").val(getUrlParameter("endpoint"));
        onEndpointChange();
});

    $.getJSON("tools.json", function (data) {
        $("#tool").empty();
        $.each(data.tools, function (index, item) {
            $("#tool").append("<option value='" + item.url + "'>" + item.name + "</option>");
        });
    }).done(function () {
        getUrlParameter("tool") && $("#tool").val(getUrlParameter("tool"));
        onToolChange();
    });


    $("#endpoint").on("change", function () {
        onEndpointChange();
    });

    $("#tool").on("change", function () {
        onToolChange();
    });

    turnArrow();

    $(window).resize(function () {
        turnArrow();
    });
});

function turnArrow() {
    if (size !== "sm" && $(window).width() <= 974) {
        $("#arrow").empty().append("<img class=\"img-fluid align-self-center\" src=\"images/Arrow_south.svg\" alt=\"Arrow\" style=\"max-width: 20px; margin-right: auto; margin-left: auto\">");
        size = "sm";
    } else if (size !== "md" && $(window).width() > 974) {
        $("#arrow").empty().append("<img class=\"img-fluid align-self-center\" src=\"images/Arrow_east.svg\" alt=\"Arrow\" style=\"max-height: 20px; margin-right: auto; margin-left: auto\">");
        size = "md";
    }
}
