let endpoint;
let taxonomyType;
let vocabulary;
let taxonomyTerm;
let proximity;
let coverage;
let childTaxonomyTerm;
let keywords;
let objOpenReferralPlus;
let viz1;

function setup() {


    $("#tabs").hide();

    if (getUrlParameter("endpoint") !== undefined) {
        $("#endpoint").val(getUrlParameter("endpoint"));
        getVocabulary();
        $("#TaxonomyType").attr('disabled', false);
        $("#Vocabulary").attr('disabled', false);
        $("#Coverage").attr('disabled', false);
        $("#Proximity").attr('disabled', false);
        $("#Keywords").attr('disabled', false);
    } else {
        updateParameters("endpoint", $("#endpoint").val());
        setup();
        return;
    }
    if (getUrlParameter("taxonomyType") !== undefined) {
        $("#TaxonomyType").val(getUrlParameter("taxonomyType"));

    }
    if (getUrlParameter("vocabulary") !== undefined) {
        $("#Vocabulary").val(getUrlParameter("vocabulary"));
        getTaxonomyTerm();
        $("#TaxonomyTerm").attr('disabled', false);
    }
    if (getUrlParameter("taxonomyTerm") !== undefined) {
        $("#TaxonomyTerm").val(getUrlParameter("taxonomyTerm"));
    }

    if (getUrlParameter("coverage") !== undefined) {
        $("#Coverage").val(getUrlParameter("coverage"));
    }
    if (getUrlParameter("proximity") !== undefined) {
        $("#Proximity").val(getUrlParameter("proximity"));
    }

    if (getUrlParameter("keywords") !== undefined) {
        $("#Keywords").val(getUrlParameter("keywords"));
    }

    endpoint = $("#endpoint").val();
    if (endpoint !== "") {
        $("#TaxonomyType").attr('disabled', false);
        $("#Vocabulary").attr('disabled', false);
        $("#Coverage").attr('disabled', false);
        $("#Proximity").attr('disabled', false);
        $("#execute").attr('disabled', false);
        $("#Keywords").attr('disabled', false);
    }
    if (endpoint === "") {
        $("#TaxonomyType").attr('disabled', true);
        $("#Vocabulary").attr('disabled', true);
        $("#Coverage").attr('disabled', true);
        $("#Proximity").attr('disabled', true);
        $("#TaxonomyTerm").attr('disabled', true);
        $("#execute").attr('disabled', true);
        $("#Keywords").attr('disabled', true);
    }

    objOpenReferralPlus = new clsOpenReferralPlus();
    objOpenReferralPlus.idFormat = 'format';

    viz1 = new clsPdViz(null, 'graph', 'graphLoading');
    objOpenReferralPlus.objViz = viz1;

    if (getUrlParameter("execute") === "true") {
        if (getUrlParameter("page") !== undefined) {
            executeForm(getUrlParameter("page"));
        } else
            executeForm();
    }

}


function getVocabulary() {
    if ($("#endpoint").val() === null || $("#endpoint").val() === "") {
        clearForm();
    } else {
        let url = $("#endpoint").val() + "/vocabularies/";
        $("#Vocabulary").empty().append("<option></option>");
        addApiPanel("Get vocabulary list", false);
        addApiPanel(url);
        addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
        updateScroll();

        $.ajax({
            async: false,
            type: 'GET',
            dataType: 'JSON',
            url: url,
            success: function (data) {
                $.each(data, function (key, value) {
                    $("#Vocabulary").append("<option>" + value + "</option>");
                });
                // if (getUrlParameter("vocabulary") !== undefined) {
                //     taxonomyTerm.val(getUrlParameter("vocabulary"));
                // }
            }
        });

    }
}

function getTaxonomyTerm() {
    if ($("#Vocabulary").val() !== null && $("#Vocabulary").val() !== "") {
        let taxonomyTerm = $("#TaxonomyTerm");
        let url = $("#endpoint").val() + "/taxonomies/?vocabulary=" + $("#Vocabulary").val()+"&per_page=200";
        taxonomyTerm.find("option").remove().end().append("<option></option>");
        addApiPanel("Get Taxonomy terms for the vocabulary", false);
        addApiPanel(url);
        addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
        updateScroll();

        $.ajax({
            async: false,
            type: 'GET',
            url: url,
            success: function (data) {
                $.each(data.content, function (key, value) {
                    taxonomyTerm.append("<option value='" + value.id + "'>" + value.name + "</option>");
                });
                // if (getUrlParameter("taxonomyTerm") !== undefined) {
                //     taxonomyTerm.val(getUrlParameter("taxonomyTerm"));
                // }
                $("#TaxonomyTerm").attr('disabled', false);

                if ($("#TaxonomyTerm option").length === 1) {
                    $("#TaxonomyTerm").attr('disabled', true);
                }
            },
            error: function (code, error) {
                taxonomyTerm.empty().append("<option>Error</option>")
            }

        });
    } else {
        $("#TaxonomyTerm").find("option").remove().end().append("<option></option>");
        $("#TaxonomyTerm").empty().attr('disabled', true);
    }

}

function updateEndpoint() {
    $("#results").empty();
    $("#graphTab").addClass("disabled").removeClass("active");
    $("#graphPanel").removeClass("active");
    $("#resultTab").addClass("active");
    $("#resultPanel").addClass("active");

    endpoint = $("#endpoint").val();
    updateParameters("endpoint", endpoint);
    $("#Vocabulary").val("");
    $("#TaxonomyTerm").val("");
    $("#Coverage").val("");
    getVocabulary();

    if (endpoint !== "") {
        $("#TaxonomyType").attr('disabled', false);
        $("#Vocabulary").attr('disabled', false);
        $("#Coverage").attr('disabled', false);
        $("#Proximity").attr('disabled', false);
        $("#execute").attr('disabled', false);
    }
    if (endpoint === "") {
        $("#TaxonomyType").attr('disabled', true);
        $("#Vocabulary").attr('disabled', true);
        $("#Coverage").attr('disabled', true);
        $("#Proximity").attr('disabled', true);
        $("#TaxonomyTerm").attr('disabled', true);
        $("#execute").attr('disabled', false);
    }

    updateParameters("execute", true);
}

function updateTaxonomyType() {
    taxonomyType = $("#TaxonomyType").val();
    updateParameters("taxonomyType", taxonomyType);
}

function updateVocabulary() {
    vocabulary = $("#Vocabulary").val();
    updateParameters("vocabulary", vocabulary);
    getTaxonomyTerm();

}

function updateTaxonomyTerm() {
    taxonomyTerm = $("#TaxonomyTerm").val();
    updateParameters("taxonomyTerm", taxonomyTerm);
}

function updateChildTaxonomyTerm() {
    childTaxonomyTerm = $("#ChildTaxonomyTerm").val();
    updateParameters("childTaxonomyTerm", childTaxonomyTerm);
}

function updateCoverage() {
    coverage = $("#Coverage").val();
    updateParameters("coverage", coverage);
}

function updateProximity() {
    proximity = $("#Proximity").val();
    updateParameters("proximity", proximity);
}

function updateKeywords() {
    keywords = $("#Keywords").val();
    updateParameters("keywords", keywords);
}

function updateParameters(parm, parmVal) {
    window.history.replaceState('', '', updateURLParameter(window.location.href, parm, parmVal));
}

function clearForm(endpoint = null) {
    if (endpoint) {
        window.location.search = "?endpoint=" + endpoint;
    } else {
        window.location.search = "";
    }
}


function executeForm(page=null) {
    let error = false;
    if ($("#endpoint").val() === "") {
        error = true;
        alert("Missing Endpoint");
    }
    if ($("#TaxonomyType").val() === "") {
        alert("Missing Taxonomy Type");
        error = true;
    }
    if ($("#Proximity").val() !== "") {
        if (isNaN($("#Proximity").val())) {
            alert("Proximity must be a number");
            error = true;
        }
    }

    if (error) {
        return;
    }

    updateParameters("execute", true);

    if (page !== null){
        updateParameters("page", page);
    }

    $("#results").empty();
    $("#tabs").show();
    $("#results").empty();
    $("#graphTab").addClass("disabled").removeClass("active");
    $("#graphPanel").removeClass("active");
    $("#resultTab").addClass("active");
    $("#resultPanel").addClass("active");

    coverage = $("#Coverage").val();
    proximity = $("#Proximity").val();
    let postcode = $("#Coverage");
    taxonomyType = $("#TaxonomyType").val();
    taxonomyTerm = $("#TaxonomyTerm").val();
    vocabulary = $("#Vocabulary").val();
    keywords = $("#Keywords").val();

    if (proximity === null || proximity === "" || proximity === undefined) {
        proximity = "";
        postcode = "";
    } else {
        proximity = "&proximity=" + ($("#Proximity").val() * 1000);
        postcode = "&postcode=" + $("#Coverage").val();
    }

    if (coverage === null || coverage === "" || coverage === undefined) {
        coverage = "";
    } else {
        coverage = "&coverage=" + $("#Coverage").val();
    }

    if (keywords === null || keywords === "" || keywords === undefined) {
        keywords = "";
    } else {
        keywords = "&keywords=" + $("#Keywords").val();
    }

    if (taxonomyType === "Any") {
        taxonomyType = "";
    } else {
        taxonomyType = "&taxonomy_type=" + $("#TaxonomyType").val();
    }

    if (vocabulary === null || vocabulary === "") {
        vocabulary = "";
    } else {
        vocabulary = "&vocabulary=" + $("#Vocabulary").val();
    }
    if (taxonomyTerm === null || taxonomyTerm === "" || taxonomyTerm === undefined) {
        taxonomyTerm = "";
    } else {
        taxonomyTerm = "&taxonomy_id=" + $("#TaxonomyTerm").val();
    }
    
    if (page === null || page === "" || page === undefined) {
        page = "";
    } else {
        page = "&page=" + page;
    }


    let url = $("#endpoint").val() + "/services/?" + coverage
        + taxonomyTerm + taxonomyType
        + vocabulary + proximity
        + postcode + keywords + page;


    addApiPanel("Get service(s)", false);
    addApiPanel(url, true);
    addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
    updateScroll();
    $("#results").append("<div><img src='images/ajax-loader.gif' alt='Loading'></div>");

    let results = $("#results");
    $.ajax({
        async: true,
        type: 'GET',
        url: url,
        success: function (data) {
            results.empty();
            if (data.totalElements === 0) {
                results.append("<div><p>No results found</p></div>");
            }
            $.each(data.content, function (key, value) {
                results.append("<div class='row colhover'>"
                    + "<div class='col-sm-1'>" + value.id + "</div>"
                    + "<div class='col-sm-9'>" + value.name + "</div>"
                    + "<div class='col-sm-2'>"
                    + "<div class='container-fluid'><button class='btn btn-secondary btn-sm mb-1' onclick='getVisualise(" + value.id + ")'>Visualise</button>" + "&nbsp;"
                    + "<button class='btn btn-secondary btn-sm mb-1' onclick='getJSON(" + value.id + ")'>JSON</button> </div></div> ");
            });
            pageNo = data.number;
            let firstPage = "";
            if (data.first === true){
                firstPage = "disabled='disabled'";
            }

            let lastPage = "";
            if (data.last === true){
                lastPage = "disabled='disabled'";
            }

            results.append(
                "<div class='row'>" +
                    "<div class='col-sm-1'><button class='btn btn-secondary btn-sm mt-1 mr-1' " + firstPage +
                        "onclick='executeForm("+ (pageNo) +")'>Previous</button>" +
                    "</div>" +
                    "<div class='mt-1'>Page "+(pageNo+1)+"</div>" +
                    "<div class='col-sm-1'><button class='btn btn-secondary btn-sm mt-1 ml-1' " + lastPage +
                        "onclick='executeForm("+ (pageNo + 2) +")'>  Next  </button>" +
                    "</div>" +
                "</div>");
        },
        error: function (status, error) {
            $("#results").empty().append("<div>An error has occurred</div>");
        }
    });
}

function getJSON(id) {
    getVisualise(id, "json");
}

function getRawJSON(id) {
    let url = $("#endpoint").val() + "/" + "services" + "/" + id;
    let win = window.open(url, "_blank");
    win.focus();
}

function getVisualise(id, VisType = "image") {
    $("#resultTab").removeClass("active");
    $("#graphTab").addClass("active");
    $("#resultPanel").removeClass("active");
    $("#graphPanel").addClass("active");
    $("#tabs")[0].scrollIntoView();
    $("#graphTab").removeClass("disabled");

    if (VisType === "image") {
        $("#format").val("image");
        objOpenReferralPlus.format = "image";
    } else if (VisType === "json") {
        $("#format").val("json");
        objOpenReferralPlus.format = "json";
    }

    let showTables = $("#allTables").val();
    if (showTables === "true") {
        objOpenReferralPlus.showAll = true;
    } else if (showTables === "false") {
        objOpenReferralPlus.showAll = false;
    }

    objOpenReferralPlus.Endpoint = $("#endpoint").val();

    objOpenReferralPlus.Resource = "services";

    objOpenReferralPlus.Parameter = id;

    objOpenReferralPlus.get();

}

function addApiPanel(text, code = true) {
    let panel = $("#api");
    let colour = "";
    if (code) {
        colour = "lightgray";
    }
    panel.add("<div style='background-color: " + colour + "'><p class='text-wrap' style='word-wrap: break-word'>" + text + "</p></div>")
        .appendTo(panel);
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

function updateURLParameter(url, param, paramVal) {
    var TheAnchor = null;
    var newAdditionalURL = "";
    var tempArray = url.split("?");
    var baseURL = tempArray[0];
    var additionalURL = tempArray[1];
    var temp = "";

    if (additionalURL) {
        let tmpAnchor = additionalURL.split("#");
        let TheParams = tmpAnchor[0];
        TheAnchor = tmpAnchor[1];
        if (TheAnchor)
            additionalURL = TheParams;

        tempArray = additionalURL.split("&");

        for (var i = 0; i < tempArray.length; i++) {
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

    var rows_txt = temp + "" + param + "=" + paramVal;
    return baseURL + "?" + newAdditionalURL + rows_txt;
}

function updateScroll() {
    var element = document.getElementById("api");
    element.scrollTop = element.scrollHeight;
}