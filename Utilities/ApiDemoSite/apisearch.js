let endpoint;
let taxonomyType;
let vocabulary;
let taxonomyTerm;
let proximity;
let coverage;
let childTaxonomyTerm;
let childChildTaxonomyTerm;
let day;
let startTime;
let endTime;
let keywords;
let objOpenReferralPlus;
objOpenReferralPlus = new clsOpenReferralPlus();
let viz1;
let config;


function getVocabulary() {
    if ($("#endpoint").val() === null || $("#endpoint").val() === "") {
        clearForm();
    } else if (config.schemaType === "OpenReferral") {
        let url = $("#endpoint").val() + "/taxonomy/";
        $("#Vocabulary").empty().append("<option></option>");
        addApiPanel("Get vocabulary list", false);
        addApiPanel(url);
        addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
        updateScroll();

        $.ajax({
            async: true,
            type: 'GET',
            dataType: 'JSON',
            url: url,
            success: function (data) {
                $.each(data.items, function (key, value) {
                    if (value.parent_id === "") {
                        $("#Vocabulary").append("<option value='" + value.id + "'>" + value.name + "</option>");
                    }

                });

                const options = $('#Vocabulary option');
                const arr = options.map(function (_, o) {
                    return {t: $(o).text(), v: o.value};
                }).get();
                arr.sort(function (o1, o2) {
                    return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
                });
                options.each(function (i, o) {
                    o.value = arr[i].v;
                    $(o).text(arr[i].t);
                });
                if ($('#Vocabulary option').length === 1) {
                    $("#Vocabulary").prop("disabled", true);
                }
                updateEndpointUpdate();
                setupPageVocabulary();
            },
            error: function (e1, e2) {
                $("#Vocabulary").prop("disabled", true);
                updateEndpointUpdate();
                setupPageVocabulary();
            }

        });
    } else {
        let url = $("#endpoint").val() + "/vocabularies/";
        $("#Vocabulary").empty().append("<option></option>");
        addApiPanel("Get vocabulary list", false);
        addApiPanel(url);
        addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
        updateScroll();

        $.ajax({
            async: true,
            type: 'GET',
            dataType: 'JSON',
            url: url,
            timeout: 1000,
            success: function (data) {
                $.each(data, function (key, value) {
                    $("#Vocabulary").append("<option>" + value + "</option>");
                });

                const options = $('#Vocabulary option');
                const arr = options.map(function (_, o) {
                    return {t: $(o).text(), v: o.value};
                }).get();
                arr.sort(function (o1, o2) {
                    return o1.t > o2.t ? 1 : o1.t < o2.t ? -1 : 0;
                });
                options.each(function (i, o) {
                    o.value = arr[i].v;
                    $(o).text(arr[i].t);
                });
                if ($('#Vocabulary option').length === 1) {
                    $("#Vocabulary").prop("disabled", true);
                }
                updateEndpointUpdate();
                setupPageVocabulary();
            },
            error: function () {
                // $("#tabs").show();
                // $("#graphTab").hide();
                // $("#validateTab").hide();
                // $("#richnessTab").hide();
                // $("#results").empty().append("<div>An error has occurred</div>");
                // $("#results").append('<button class="show-error btn btn-secondary">Show error</button>');
                // $(".show-error").on("click", function () {
                //     let win = window.open(url, "_blank");
                //     win.focus();
                // });
                $("#Vocabulary").prop("disabled", true);
                updateEndpointUpdate();
                setupPageVocabulary();
            }

        });

    }
}


function getTaxonomyTerm() {
    if ($("#Vocabulary").val() !== null && $("#Vocabulary").val() !== "") {
        if (config.schemaType === "OpenReferral") {
            let taxonomyTerm = $("#TaxonomyTerm");
            let url = $("#endpoint").val() + "/taxonomy/";
            taxonomyTerm.find("option").remove().end().append("<option></option>");
            addApiPanel("Get Taxonomy terms for the vocabulary", false);
            addApiPanel(url);
            addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
            updateScroll();

            $.ajax({
                async: true,
                type: 'GET',
                url: url,
                success: function (data) {

                    $.each(data.items, function (key, value) {
                        if (value.parent_id === $("#Vocabulary").val()) {
                            taxonomyTerm.append("<option value='" + value.id + "'>" + value.name.substring(0, 49) + "</option>");
                        }
                    });

                    const options = $('#TaxonomyTerm option');
                    options.sort(function (a, b) {
                        if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
                        else if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
                        else return 0;
                    });
                    $("#TaxonomyTerm").empty().append(options);
                    $("#TaxonomyTerm").val("");

                    $("#TaxonomyTerm").prop('disabled', false);

                    if ($("#TaxonomyTerm option").length === 1) {
                        $("#TaxonomyTerm").attr('disabled', true);
                    }

                    if (getUrlParameter("taxonomyTerm") === undefined || getUrlParameter("taxonomyTerm") === "") {
                        $("#TaxonomyTerm").val($("#TaxonomyTerm option:first").val());
                    }

                    setupPageTaxonomyTerm();
                },
                error: function (code, error) {
                    taxonomyTerm.empty().append("<option>Error</option>");
                    setupPageTaxonomyTerm();
                }

            });
        } else {
            let taxonomyTerm = $("#TaxonomyTerm");
            let url = $("#endpoint").val() + "/taxonomies/?vocabulary=" + $("#Vocabulary").val() + "&per_page=500&root_only=true";
            taxonomyTerm.find("option").remove().end().append("<option></option>");
            addApiPanel("Get Taxonomy terms for the vocabulary", false);
            addApiPanel(url);
            addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
            updateScroll();

            $.ajax({
                async: true,
                type: 'GET',
                url: url,
                success: function (data) {

                    $.each(data.content, function (key, value) {
                        taxonomyTerm.append("<option value='" + value.id + "'>" + value.name.substring(0, 49) + "</option>");
                    });

                    const options = $('#TaxonomyTerm option');
                    options.sort(function (a, b) {
                        if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
                        else if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
                        else return 0;
                    });
                    $("#TaxonomyTerm").empty().append(options);
                    $("#TaxonomyTerm").val("");

                    $("#TaxonomyTerm").prop('disabled', false);

                    if ($("#TaxonomyTerm option").length === 1) {
                        $("#TaxonomyTerm").attr('disabled', true);
                    }

                    if (getUrlParameter("taxonomyTerm") === undefined || getUrlParameter("taxonomyTerm") === "") {
                        $("#TaxonomyTerm").val($("#TaxonomyTerm option:first").val());
                    }

                    setupPageTaxonomyTerm();
                },
                error: function (code, error) {
                    taxonomyTerm.empty().append("<option>Error</option>");
                    setupPageTaxonomyTerm();
                }

            });
        }
    } else {
        $("#TaxonomyTerm").find("option").remove().end().append("<option></option>");
        $("#TaxonomyTerm").empty().attr('disabled', true);
    }

}

function getChildTaxonomyTerm() {
    if ($("#TaxonomyTerm").val() !== null && $("#TaxonomyTerm").val() !== "") {
        if (config.schemaType === "OpenReferral") {
            let childTaxonomyTerm = $("#ChildTaxonomyTerm");
            let url = $("#endpoint").val() + "/taxonomy/";
            childTaxonomyTerm.find("option").remove().end().append("<option></option>");
            addApiPanel("Get Taxonomy terms for the parent term", false);
            addApiPanel(url);
            addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
            updateScroll();

            $.ajax({
                async: true,
                type: 'GET',
                url: url,
                success: function (data) {
                    let found = [];
                    $.each(data.items, function (key, value) {
                        if (value.parent_id === $("#TaxonomyTerm").val()) {
                            $("#ChildTaxonomyTerm").append("<option value='" + value.id + "'>" + value.name.substring(0, 49) + "</option>");
                        }
                    });

                    const options = $('#ChildTaxonomyTerm option');
                    options.sort(function (a, b) {
                        if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
                        else if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
                        else return 0;
                    });
                    $("#ChildTaxonomyTerm").empty().append(options);
                    $("#ChildTaxonomyTerm").val("");

                    $("#ChildTaxonomyTerm").prop('disabled', false);

                    if ($("#ChildTaxonomyTerm option").length === 1) {
                        $("#ChildTaxonomyTerm").prop('disabled', true);
                    }
                    setupPageChildTaxonomyTerm();
                },
                error: function (code, error) {
                    childTaxonomyTerm.empty().append("<option>Error</option>");
                    setupPageChildTaxonomyTerm();
                }
            });
        } else {
            let childTaxonomyTerm = $("#ChildTaxonomyTerm");
            let url = $("#endpoint").val() + "/taxonomies/?vocabulary=" + $("#Vocabulary").val() + "&per_page=500" +
                "&parent_id=" + $("#TaxonomyTerm").val();
            childTaxonomyTerm.find("option").remove().end().append("<option></option>");
            addApiPanel("Get Taxonomy terms for the parent term", false);
            addApiPanel(url);
            addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
            updateScroll();

            $.ajax({
                async: true,
                type: 'GET',
                url: url,
                success: function (data) {
                    let found = [];
                    $.each(data.content, function (key, value) {
                        if (!(found.indexOf(value.name) > -1)) {
                            found.push(value.name);
                            childTaxonomyTerm.append("<option value='" + value.id + "'>" + value.name + "</option>");
                        }
                    });

                    const options = $('#ChildTaxonomyTerm option');
                    options.sort(function (a, b) {
                        if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
                        else if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
                        else return 0;
                    });
                    $("#ChildTaxonomyTerm").empty().append(options);
                    $("#ChildTaxonomyTerm").val("");

                    $("#ChildTaxonomyTerm").prop('disabled', false);

                    if ($("#ChildTaxonomyTerm option").length === 1) {
                        $("#ChildTaxonomyTerm").prop('disabled', true);
                    }
                    setupPageChildTaxonomyTerm();
                },
                error: function (code, error) {
                    childTaxonomyTerm.empty().append("<option>Error</option>");
                    setupPageChildTaxonomyTerm();
                }
            });
        }
    } else {
        $("#ChildTaxonomyTerm").find("option").remove().end().append("<option></option>");
        $("#ChildTaxonomyTerm").empty().prop('disabled', true);
        setupPageChildTaxonomyTerm();
    }
}

function getChildChildTaxonomyTerm() {
    if ($("#ChildTaxonomyTerm").val() !== null && $("#ChildTaxonomyTerm").val() !== "") {
        if (config.schemaType === "OpenReferral"){
            let childChildTaxonomyTerm = $("#ChildChildTaxonomyTerm");
            let url = $("#endpoint").val() + "/taxonomy/";
            childChildTaxonomyTerm.find("option").remove().end().append("<option></option>");
            addApiPanel("Get Taxonomy terms for the parent term", false);
            addApiPanel(url);
            addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
            updateScroll();

            $.ajax({
                async: true,
                type: 'GET',
                url: url,
                success: function (data) {
                    let found = [];
                    $.each(data.items, function (key, value) {
                        if (value.parent_id === $("#ChildTaxonomyTerm").val()) {
                            $("#ChildChildTaxonomyTerm").append("<option value='" + value.id + "'>" + value.name.substring(0, 49) + "</option>");
                        }
                    });

                    const options = $('#ChildChildTaxonomyTerm option');
                    options.sort(function (a, b) {
                        if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
                        else if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
                        else return 0;
                    });
                    $("#ChildChildTaxonomyTerm").empty().append(options);
                    $("#ChildChildTaxonomyTerm").val("");

                    $("#ChildChildTaxonomyTerm").prop('disabled', false);

                    if ($("#ChildChildTaxonomyTerm option").length === 1) {
                        $("#ChildChildTaxonomyTerm").prop('disabled', true);
                        $("#ChildChildTaxonomyTermDiv").css('display', 'none');
                    } else {
                        $("#ChildChildTaxonomyTermDiv").css('display', 'block');
                    }
                    setupPageChildChildTaxonomyTerm();
                },
                error: function (code, error) {
                    childChildTaxonomyTerm.empty().append("<option>Error</option>");
                    setupPageChildChildTaxonomyTerm();
                }

            });
        } else {
            let childChildTaxonomyTerm = $("#ChildChildTaxonomyTerm");
            let url = $("#endpoint").val() + "/taxonomies/?vocabulary=" + $("#Vocabulary").val() + "&per_page=200" +
                "&parent_id=" + $("#ChildTaxonomyTerm").val();
            childChildTaxonomyTerm.find("option").remove().end().append("<option></option>");
            addApiPanel("Get Taxonomy terms for the parent term", false);
            addApiPanel(url);
            addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
            updateScroll();

            $.ajax({
                async: true,
                type: 'GET',
                url: url,
                success: function (data) {
                    let found = [];
                    $.each(data.content, function (key, value) {
                        if (!(found.indexOf(value.name) > -1)) {
                            found.push(value.name);
                            childChildTaxonomyTerm.append("<option value='" + value.id + "'>" + value.name + "</option>");
                        }
                    });

                    const options = $('#ChildChildTaxonomyTerm option');
                    options.sort(function (a, b) {
                        if (a.text.toUpperCase() > b.text.toUpperCase()) return 1;
                        else if (a.text.toUpperCase() < b.text.toUpperCase()) return -1;
                        else return 0;
                    });
                    $("#ChildChildTaxonomyTerm").empty().append(options);
                    $("#ChildChildTaxonomyTerm").val("");

                    $("#ChildChildTaxonomyTerm").prop('disabled', false);

                    if ($("#ChildChildTaxonomyTerm option").length === 1) {
                        $("#ChildChildTaxonomyTerm").prop('disabled', true);
                        $("#ChildChildTaxonomyTermDiv").css('display', 'none');
                    } else {
                        $("#ChildChildTaxonomyTermDiv").css('display', 'block');
                    }
                    setupPageChildChildTaxonomyTerm();
                },
                error: function (code, error) {
                    childChildTaxonomyTerm.empty().append("<option>Error</option>");
                    setupPageChildChildTaxonomyTerm();
                }

            });
        }
    } else {
        $("#ChildChildTaxonomyTerm").empty().append("<option></option>");
        $("#ChildChildTaxonomyTerm").empty().prop('disabled', true);
        setupPageChildChildTaxonomyTerm();
    }

}

function updateEndpoint() {
    $("#results").empty();
    $("#graphTab").addClass("disabled").removeClass("active");
    $("#validatePanel").addClass("disabled").removeClass("active");
    $("#validateTab").addClass("disabled").removeClass("active");
    $("#graphPanel").removeClass("active");
    $("#resultTab").addClass("active");
    $("#resultPanel").addClass("active");

    endpoint = $("#endpoint").val();
    updateParameters("endpoint", endpoint);
    clearForm(endpoint);
    $("#Vocabulary").val("");
    $("#TaxonomyTerm").val("");
    $("#Coverage").val("");
    getVocabulary();

}

function updateEndpointUpdate() {

    if (endpoint !== "") {
        // $("#TaxonomyType").prop('disabled', false);
        // $("#Vocabulary").prop('disabled', false);
        $("#execute").prop('disabled', false);
    }
    if (endpoint === "") {
        $("#TaxonomyType").prop('disabled', true);
        $("#Vocabulary").prop('disabled', true);
        $("#TaxonomyTerm").prop('disabled', true);
        $("#execute").prop('disabled', false);
    }

    // updateParameters("execute", true);
}

function updateTaxonomyType() {
    taxonomyType = $("#TaxonomyType").val();
    updateParameters("taxonomyType", taxonomyType);
}

function updateVocabulary() {
    vocabulary = $("#Vocabulary").val();
    updateParameters("vocabulary", vocabulary);
    $("#ChildTaxonomyTerm").val("").prop("disabled", true);
    $("#ChildChildTaxonomyTerm").val("").prop("disabled", true);
    $("#ChildChildTaxonomyTermDiv").css('display', 'none');
    getTaxonomyTerm();

}

function updateTaxonomyTerm() {
    taxonomyTerm = $("#TaxonomyTerm").val();
    updateParameters("taxonomyTerm", taxonomyTerm);
    $("#ChildTaxonomyTerm").val("").prop("disabled", true);
    $("#ChildChildTaxonomyTerm").val("").prop("disabled", true);
    $("#ChildChildTaxonomyTermDiv").css('display', 'none');
    getChildTaxonomyTerm();
    getChildChildTaxonomyTerm();
}

function updateChildTaxonomyTerm() {
    childTaxonomyTerm = $("#ChildTaxonomyTerm").val();
    updateParameters("childTaxonomyTerm", childTaxonomyTerm);
    getChildChildTaxonomyTerm();
}

function updateChildChildTaxonomyTerm() {
    childChildTaxonomyTerm = $("#ChildChildTaxonomyTerm").val();
    updateParameters("childChildTaxonomyTerm", childChildTaxonomyTerm);
}

function updateCoverage() {
    coverage = $("#Coverage").val();
    updateParameters("coverage", coverage);
}

function updateProximity() {
    proximity = $("#Proximity").val();
    updateParameters("proximity", proximity);
}

function updateDay() {
    day = $("#Day").val();
    updateParameters("day", day);
}

function updateStartTime() {
    startTime = $("#StartTime").val();
    updateParameters("startTime", startTime);
}

function updateEndTime() {
    endTime = $("#EndTime").val();
    updateParameters("endTime", endTime);
}

function updateKeywords() {
    keywords = $("#Keywords").val();
    updateParameters("keywords", keywords);
}

// noinspection SpellCheckingInspection
function updateParameters(parm, parmVal) {
    window.history.replaceState('', '', updateURLParameter(window.location.href, parm, parmVal));
}

function clearForm(endpoint) {

    if (endpoint) {
        window.location.search = "?endpoint=" + endpoint;
    } else {
        window.location.search = "";
    }
}


function executeForm(pageNumber) {
    if (pageNumber === undefined) {
        pageNumber = null;
    }
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

    if (pageNumber !== null) {
        updateParameters("page", pageNumber);
    }

    $("#results").empty();
    $("#tabs").show();
    $("#results").empty();
    $("#graphTab").addClass("disabled").removeClass("active");
    $("#graphPanel").removeClass("active");
    $("#validateTab").removeClass("active").hide();
    $("#validatePanel").removeClass("active");
    $("#richnessTab").removeClass("active").hide();
    $("#richnessPanel").removeClass("active");
    $("#resultTab").addClass("active");
    $("#resultPanel").addClass("active");

    coverage = $("#Coverage").val();
    proximity = $("#Proximity").val();
    let postcode = $("#Coverage");
    vocabulary = $("#Vocabulary").val();
    taxonomyType = $("#TaxonomyType").val();
    taxonomyTerm = $("#TaxonomyTerm").val();
    childTaxonomyTerm = $("#ChildTaxonomyTerm").val();
    childChildTaxonomyTerm = $("#ChildChildTaxonomyTerm").val();
    day = $("#Day").val();
    startTime = $("#StartTime").val();
    endTime = $("#EndTime").val();
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

    if (day === null || day === "" || day === undefined) {
        day = "";
    } else {
        day = "&day=" + $("#Day").val();
    }

    if (startTime === null || startTime === "" || startTime === undefined) {
        startTime = "";
    } else {
        startTime = "&start_time=" + $("#StartTime").val();
    }

    if (endTime === null || endTime === "" || endTime === undefined) {
        endTime = "";
    } else {
        endTime = "&end_time=" + $("#EndTime").val();
    }

    if (keywords === null || keywords === "" || keywords === undefined) {
        keywords = "";
    } else {
        keywords = "&text=" + $("#Keywords").val();
    }

    if (taxonomyType === "Any") {
        taxonomyType = "";
    } else if (config.schemaType === "OpenReferral") {
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
        if (!(childChildTaxonomyTerm === null || childChildTaxonomyTerm === "" || childChildTaxonomyTerm === undefined)) {
            taxonomyTerm = "&taxonomy_id=" + $("#ChildChildTaxonomyTerm").val();
        } else if (!(childTaxonomyTerm === null || childTaxonomyTerm === "" || childTaxonomyTerm === undefined)) {
            taxonomyTerm = "&taxonomy_id=" + $("#ChildTaxonomyTerm").val();
        } else {
            taxonomyTerm = "&taxonomy_id=" + $("#TaxonomyTerm").val();
        }

    }

    if (pageNumber === null || pageNumber === "" || pageNumber === undefined) {
        pageNumber = "";
    } else {
        pageNumber = "&page=" + pageNumber;
    }
    let url = "";
    if (config.schemaType === "Placecube") {
        url = $("#endpoint").val() + "/services/?" + coverage + taxonomyTerm + taxonomyType
            + vocabulary + proximity + postcode + day + startTime + endTime + keywords + pageNumber;
    } else if (config.schemaType === "OpenReferral") {
        if (vocabulary === null || vocabulary === "" || vocabulary === undefined) {
            taxonomyTerm = "";
        } else {
            if (!(childChildTaxonomyTerm === null || childChildTaxonomyTerm === "" || childChildTaxonomyTerm === undefined)) {
                taxonomyTerm = $("#ChildChildTaxonomyTerm").find('option:selected').text();
            } else if (!(childTaxonomyTerm === null || childTaxonomyTerm === "" || childTaxonomyTerm === undefined)) {
                taxonomyTerm = $("#ChildTaxonomyTerm").find('option:selected').text();
            } else if (!(taxonomyTerm === null || taxonomyTerm === "" || taxonomyTerm === undefined)) {
                taxonomyTerm = $("#TaxonomyTerm").find('option:selected').text();
            } else {
                taxonomyTerm = $("#Vocabulary").find('option:selected').text();
            }

        }
        url = $("#endpoint").val() + "/services/complete/"+ taxonomyTerm + "?" + pageNumber;
    } else {
        if (pageNumber === undefined || pageNumber === "") {
            pageNumber = "&page=1";
        }
        url = $("#endpoint").val() + "/hservices/?" + coverage + taxonomyTerm + taxonomyType
            + vocabulary + proximity + postcode + day + startTime + endTime + keywords + pageNumber;
    }

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
        timeout: 30000,
        success: function (data) {
            results.empty();
            if (data.totalElements === 0 || data.total_items === 0) {
                results.append("<div><p>No results found</p></div>");
            }
            $.each(data.content ? data.content : data.items, function (_, value) {
                results.append(
                    "<div id='col" + value.id + "' class='row rowhover'>" +
                    "<div id='text" + value.id + "' class='col-md-1 col-sm-2 text-truncate'> " + value.id + "</div>" +
                    "<div class='col-md-6 col-sm-5'>" + value.name + "</div>" +
                    "<div class='col d-flex justify-content-end no-gutters'>" +
                    "<div class='visualise'>" +
                    "<div class='row d-flex no-gutters ml-1 justify-content-end'>" +
                    "<div class='col-sm-12 col-md-6 d-flex no-gutters d-flex justify-content-end'>" +
                    "<button id='" + value.id + "' class='btn btn-secondary btn-sm mb-1 visualiseButton'>Visualise</button>&nbsp;" +
                    "<button id='json" + value.id + "' class='btn btn-secondary btn-sm mb-1 mr-1'> JSON </button>&nbsp;" +
                    "</div>" +
                    "<div class='col-sm-12 col-md-6 d-flex no-gutters d-flex justify-content-end'>" +
                    "<button id='validate" + value.id + "' class='btn btn-secondary btn-sm mb-1 ml-1'>Validate</button> &nbsp;" +
                    "<button id='richness" + value.id + "' class='btn btn-secondary btn-sm mb-1'>Richness</button>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>" +
                    "</div>"
                );
                $("#" + value.id).on("click", function () {
                    getVisualise(value.id);
                });
                $("#json" + value.id).on("click", function () {
                    getJSON(value.id);
                });
                $("#validate" + value.id).on("click", function () {
                    getValidate(value.id);
                });
                $("#richness" + value.id).on("click", function () {
                    getRichness(value.id);
                });

                if (value.id.length > 8) {
                    $("#col" + value.id).hover(function () {
                        $("#text" + value.id).removeClass("text-truncate");
                        $("#text" + value.id).prop("style", "font-size: 70%");
                    }, function () {
                        $("#text" + value.id).addClass("text-truncate");
                        $("#text" + value.id).prop("style", "font-size: 100%");
                    });
                }

            });

            let pageNo = data.number ? data.number : data.page;
            let firstPage = "";
            if (data.first === true) {
                firstPage = "disabled='disabled'";
            }

            let lastPage = "";
            if (data.last === true) {
                lastPage = "disabled='disabled'";
            }

            results.append(
                "<div class='container-fluid'>" +
                "<div class='row'>" +
                "<div><button id='previousPage' class='btn btn-secondary btn-sm mt-1 mr-1' " + firstPage + ">Previous</button>" +
                "</div>" +
                "<div class=' mt-1'>Page " + (pageNo) + "</div>" +
                "<div><button id='nextPage' class='btn btn-secondary btn-sm mt-1 ml-1' " + lastPage + ">  Next  </button>" +
                "</div>" +
                "</div>" +
                "</div>");
            $("#nextPage").on("click", function () {
                executeForm(parseInt(pageNo) + 1);
            });
            $("#previousPage").on("click", function () {
                executeForm(parseInt(pageNo) - 1);
            });
        },
        error: function () {
            $("#results").empty().append("<div>An error has occurred</div>");
            if (config.schemaType === "OpenReferral"){
                $("#results").append("<div></div>");
            }
            $("#results").append('<button class="show-error btn btn-secondary">Show error</button>');
            $(".show-error").on("click", function () {
                let win = window.open(url, "_blank");
                win.focus();
            });

        }
    });
}

function populateEndpointsFromJson() {
    $.getJSON("config.json", function (data) {
        $("#endpoint").empty();
        $.each(data.endpoints, function (index, item) {
            $("#endpoint").append("<option value='" + item.url + "'>" + item.name + "</option>");
        });
    }).done(function () {
        setupEndpointFilter();
        setupPageEndpoints();
    });
}

function setupEndpointFilter() {
    $.getJSON("config.json", function (data) {
        $("#RegularScheduleRow").show();
        $("#api").css("height", "450px");
        updateScroll();
        $.each(data.endpoints, function (index, item) {
            if (item.url === $("#endpoint option:selected").val()) {
                config = item;
                $.each(item.filters, function (index2, item2) {
                    $("#" + item2).attr('disabled', false);
                });
                if (!((item.filters.indexOf("Day") > -1) || (item.filters.indexOf("StartTime") > -1) || (item.filters.indexOf("EndTime") > -1))) {
                    $("#RegularScheduleRow").hide();
                    $("#api").css("height", "400px");
                    updateScroll();
                }
            }
        });
    }).done(function () {
        $("#TaxonomyTerm").prop("disabled", true);
        $("#ChildTaxonomyTerm").prop("disabled", true);
        $("#ChildChildTaxonomyTerm").prop("disabled", true);
    });
}

function getJSON(id) {
    getVisualise(id, "json");
}

function getRawJSON(id) {
    let url;
    url = config.schemaType === "OpenReferral" ? $("#endpoint").val() + "/" + "services" + "/complete/" + id : $("#endpoint").val() + "/" + "services" + "/" + id;
    let win = window.open(url, "_blank");
    win.focus();
}

function getVisualise(id, VisType) {
    VisType = VisType || "image";
    $("#resultTab").removeClass("active");
    $("#validateTab").removeClass("active");
    $("#graphTab").addClass("active");
    $("#resultPanel").removeClass("active");
    $("#validatePanel").removeClass("active");
    $("#graphPanel").addClass("active");
    $("#tabs")[0].scrollIntoView();
    $("#graphTab").removeClass("disabled");
    $("#validateTab").addClass("disabled");
    $("#validateTab").hide();
    $("#richnessTab").hide();

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

function getValidate(id) {
    $("#resultTab").removeClass("active");
    $("#resultPanel").removeClass("active");

    $("#graphTab").removeClass("active");
    $("#graphPanel").removeClass("active");

    $("#validateTab").addClass("active");
    $("#validatePanel").addClass("active");
    $("#tabs")[0].scrollIntoView();
    $("#validateTab").removeClass("disabled");

    $("#richnessTab").hide();

    $("#validateTab").show();

    let url = $("#endpoint").val() + "/services/" + id;

    addApiPanel("Get JSON for validate", false);
    addApiPanel(url);
    addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
    updateScroll();
    $.ajax({
        async: true,
        type: 'GET',
        url: url,
        dataType: "json",
        success: function (data) {
            postValidate(data);
        }
    });

}

function postValidate(data) {
    let url = "https://api.porism.com/ServiceDirectoryService/services/validate";
    // console.log(data);
    // console.log(typeof data);
    // console.log(JSON.stringify(data));
    addApiPanel("Post JSON for validate", false);
    addApiPanel(url);
    updateScroll();
    $("#validatePanel").empty();
    $("#validatePanel").append('<img alt="loading" src="images/ajax-loader.gif">');

    $.post({url: url, contentType: "application/json"}, JSON.stringify(data), function (resBody) {
        $("#validatePanel").empty();

        // console.log(resBody);
        // let res = JSON.stringify(resBody, null, 1);

        // $("#validatePanel").append(
        //     "<div class='container-fluid'><p class='mt-1'><pre>" + res + "</pre></p></div>"
        // );
        $("#validatePanel").append('<h5>' + data.name + '</h5><h6>' + data.id + '</h6>');
        $("#validatePanel").append("<h5>Issues</h5>");
        for (let i = 0; i < resBody.length; i++) {
            $("#validatePanel").append("<p>" + resBody[i].message + "</p>");
        }

    }, "json");

}

function getRichness(id) {
    $("#resultTab").removeClass("active");
    $("#resultPanel").removeClass("active");

    $("#graphTab").removeClass("active");
    $("#graphPanel").removeClass("active");

    $("#validateTab").removeClass("active");
    $("#validatePanel").removeClass("active");

    $("#richnessTab").addClass("active");
    $("#richnessPanel").addClass("active");

    $("#tabs")[0].scrollIntoView();
    $("#richnessTab").removeClass("disabled");

    $("#validateTab").hide();

    $("#richnessTab").show();
    let url;
    if (config.schemaType === "OpenReferral") {
        url = $("#endpoint").val() + "/services/complete/" + id;
    } else {
        url = $("#endpoint").val() + "/services/" + id;
    }
    addApiPanel("Get JSON for richness", false);
    addApiPanel(url);
    addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
    updateScroll();
    $.ajax({
        async: true,
        type: 'GET',
        url: url,
        dataType: "json",
        success: function (data) {
            postRichness(data);
        }
    });

}

function postRichness(data) {
    let url = "https://api.porism.com/ServiceDirectoryService/services/richness";
    // console.log(data);
    // console.log(typeof data);
    // console.log(JSON.stringify(data));
    addApiPanel("Post JSON for richness", false);
    addApiPanel(url);
    updateScroll();

    $("#richness").empty();
    $("#richness").append('<img alt="loading" src="images/ajax-loader.gif">');

    $.post({url: url, contentType: "application/json"}, JSON.stringify(data), "json").done(function (resBody) {
        $("#richness").empty();
        if (resBody.populated === undefined && resBody.not_populated === undefined) {
            $("#richness").append("<h3>Error</h3><p>" + resBody[0].message + "</p>");
            return;
        }
        $("#richness").append('<h5>' + data.name + '</h5><h6>' + data.id + '</h6>');
        let Richness = "";
        let populated = "";
        for (let i = 0; i < resBody.populated.length; i++) {
            populated = populated + "<div class='row rowhover'><div class='col-sm-8'>" + resBody.populated[i].name + "</div><div class='col-sm-4'>" + resBody.populated[i].percentage + "%</div></div>";
        }
        Richness = Richness + "<div class='card-group mt-2'>";
        Richness = Richness + (
            '<div class="card">' +
            '<div class="card-header bg-light"><h4>Populated</h4></div>' +
            '<div class="card-body">' + populated + '</div>' +
            '</div>');

        let not_populated = "";
        for (let i = 0; i < resBody.not_populated.length; i++) {
            not_populated = not_populated + "<div class='row rowhover'><div class='col-sm-8'>" + resBody.not_populated[i].name + "</div><div class='col-sm-4'>" + resBody.not_populated[i].percentage + "%</div></div>";
        }
        Richness = Richness +
            '<div class="card">' +
            '<div class="card-header bg-light"><h4>Not populated</h4></div>' +
            '<div class="card-body">' + not_populated + '</div>' +
            '</div></div>';

        $("#richness").append(Richness);

        $("#richness").append("<h3>Overall</h3>" +
            "<p>Score: " + resBody.richness_percentage + "%</p>");
    }).fail(function (error) {
        $("#richness").empty().append("<div>An error has occurred</div>");
        $("#richness").append('<div>' + error.responseJSON.message + '</div>');
    });

}

function addApiPanel(text, code) {
    if (code === undefined) {
        code = true;
    }
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

function updateScroll() {
    const element = document.getElementById("api");
    element.scrollTop = element.scrollHeight;
}

function setupPage() {
    populateEndpointsFromJson();
}

function setupPageEndpoints() {

    $("#endpoint").on("change", function () {
        updateEndpoint();
    });

    $("#clear").on("click", function () {
        clearForm($("#endpoint").val());
    });
    $("#execute").on("click", function () {
        executeForm();
    });
    $("#format").on("change", function () {
        objOpenReferralPlus.get();
    });
    $("#allTables").on("change", function () {
        objOpenReferralPlus.get();
    });
    $("#TaxonomyType").on("change", function () {
        updateTaxonomyType();
    });
    $("#Keywords").on("change", function () {
        updateKeywords();
    });
    $("#Vocabulary").on("change", function () {
        updateVocabulary();
    });
    $("#TaxonomyTerm").on("change", function () {
        updateTaxonomyTerm();
    });
    $("#ChildTaxonomyTerm").on("change", function () {
        updateChildTaxonomyTerm();
    });
    $("#ChildChildTaxonomyTerm").on("change", function () {
        updateChildChildTaxonomyTerm();
    });
    $("#Coverage").on("change", function () {
        updateCoverage();
    });
    $("#Proximity").on("change", function () {
        updateProximity();
    });
    $("#Day").on("change", function () {
        updateDay();
    });
    $("#StartTime").on("change", function () {
        updateStartTime();
    });
    $("#EndTime").on("change", function () {
        updateEndTime();
    });


    $("#tabs").hide();

    if (getUrlParameter("endpoint") !== undefined) {
        $("#endpoint").val(getUrlParameter("endpoint"));
        $.getJSON("config.json", function (data) {
            $.each(config.endpoints, function (index, item) {
                if (item.url === $("#endpoint option:selected").val()) {
                    config = item;
                }
            });
        }).done(function () {
            getVocabulary();
        });
    } else {
        updateParameters("endpoint", $("#endpoint").val());
        setupPage();
    }

}

function setupPageVocabulary() {

    if (getUrlParameter("taxonomyType") !== undefined) {
        $("#TaxonomyType").val(getUrlParameter("taxonomyType"));

    }
    if (getUrlParameter("vocabulary") !== undefined) {
        $("#Vocabulary").val(getUrlParameter("vocabulary"));
        $("#TaxonomyTerm").attr('disabled', false);
        getTaxonomyTerm();

    } else {
        setupPageTaxonomyTerm();
    }
}

function setupPageTaxonomyTerm() {

    if (getUrlParameter("taxonomyTerm") !== undefined) {
        $("#TaxonomyTerm").val(getUrlParameter("taxonomyTerm"));
        getChildTaxonomyTerm();
    } else {
        $("#ChildTaxonomyTerm").prop("disabled", true);
        $("#ChildChildTaxonomyTerm").prop("disabled", true);
        setupPageChildTaxonomyTerm();
    }
}

function setupPageChildTaxonomyTerm() {
    if (getUrlParameter("childTaxonomyTerm") !== undefined) {
        $("#ChildTaxonomyTerm").val(getUrlParameter("childTaxonomyTerm"));
        getChildChildTaxonomyTerm();
    } else {
        $("#ChildChildTaxonomyTerm").prop("disabled", true);
        setupPageChildChildTaxonomyTerm();
    }
}

function setupPageChildChildTaxonomyTerm() {
    if (getUrlParameter("childChildTaxonomyTerm") !== undefined) {
        $("#ChildChildTaxonomyTerm").val(getUrlParameter("childChildTaxonomyTerm"));

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

    if (getUrlParameter("day") !== undefined) {
        $("#Day").val(getUrlParameter("day"));
    }
    if (getUrlParameter("startTime") !== undefined) {
        $("#StartTime").val(getUrlParameter("startTime"));
    }
    if (getUrlParameter("endTime") !== undefined) {
        $("#EndTime").val(getUrlParameter("endTime"));
    }

    $("#validateTab").hide();
    $("#richnessTab").hide();

    endpoint = $("#endpoint").val();
    if (endpoint !== "") {

    }
    if (endpoint === "") {
        $("#TaxonomyType").attr('disabled', true);
        $("#Vocabulary").attr('disabled', true);
        $("#Coverage").attr('disabled', true);
        $("#Proximity").attr('disabled', true);
        $("#TaxonomyTerm").attr('disabled', true);
        $("#execute").attr('disabled', true);
        $("#Keywords").attr('disabled', true);
        $("#Day").attr('disabled', true);
        $("#StartTime").attr('disabled', true);
        $("#EndTime").attr('disabled', true);
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


$(document).ready(setupPage());