let rootJson = null;
const clsOpenReferralPlus = function () {
    this.idEndpoint = null;
    this.idResource = null;
    this.idParameter = null;
    this.idFormat = null;
    this.objViz = null;

    this.Endpoint = null;
    this.Resource = null;
    this.Parameter = null;

    this.showAll = null;

};

clsOpenReferralPlus.prototype.get = function () {

    const objORP = this;
    const showAll = $("#allTables").val();
    if (showAll === "true") {
        this.showAll = true;
    } else if (showAll === "false") {
        this.showAll = false;
    }


    if (this.Endpoint != null) {
        if (this.idEndpoint) {
            const tagEndpoint = document.getElementById(this.idEndpoint);
            if (tagEndpoint) {
                this.Endpoint = getElementValue(tagEndpoint);
            }
        }
    }
    if (!this.Endpoint) {
        alert('Endpoint not selected');
        return false;
    }
    if (!this.Endpoint.startsWith('http')) {
        alert('Invalid Endpoint');
        return false;
    }
    if (this.Endpoint != null) {
        if (this.idResource) {
            const tagResource = document.getElementById(this.idResource);
            if (tagResource) {
                this.Resource = getElementValue(tagResource);
            }
        }
    }
    if (!this.Resource) {
        alert('Resource not selected');
        return false;
    }
    switch (this.Resource) {
        case 'services':
            break;
        case 'services/complete':
            break;
        case 'organizations':
            break;
        default:
            alert('Unknown Resource');
            return false;
    }
    if (this.Endpoint != null) {
        if (this.idParameter) {
            const tagParameter = document.getElementById(this.idParameter);
            if (tagParameter) {
                this.Parameter = getElementValue(tagParameter);
            }
        }
    }

    if (this.idFormat) {
        const tagFormat = document.getElementById(this.idFormat);
        if (tagFormat) {
            this.Format = getElementValue(tagFormat);
        }
    }

    if (!this.objViz) {
        viz1 = new clsPdViz(null, 'graph', 'graphLoading');
    }

    this.objViz.setLoadingImage(true);
    if (config.hasOwnProperty("schemaType")) {
        if (config.schemaType === "OpenReferral") {
            this.Resource = "services/complete";
        }
    }
    let url = this.Endpoint + '/' + this.Resource + '/';

    if (this.Parameter) {
        url += this.Parameter;
    }


    addApiPanel("Get JSON for visualisation", false);
    addApiPanel(url);
    addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
    updateScroll();

    $("#graph").empty();
    $("#graphLoading").empty();
    $.ajax({
        async: true,
        type: 'GET',
        url: url,
        dataType: "text"
    })
        .done(function (data) {


            const jsonContent = JSON.parse(data);
            rootJson = jsonContent;
            const Dot = objORP.makeDot(jsonContent);

            objORP.objViz.setLoadingImage(false);

            switch (objORP.Format) {
                case 'image':
                    objORP.objViz.Dot = Dot;
                    objORP.objViz.show('image');
                    $("#graph0 > title").val("");
                    break;
                case 'dot script':
                    objORP.objViz.tagElement.innerHTML = '<pre>' + nl2br(htmlEntities(Dot)) + '</pre>';
                    break;
                case 'json':
                    $(objORP.objViz.tagElement).empty();
                    $(objORP.objViz.tagElement).append("<button id='Raw" + jsonContent.id + "' class='btn btn-secondary'>Raw JSON</button>");
                    $(objORP.objViz.tagElement).append("<pre>" + JSON.stringify(jsonContent, undefined, " ").replace("<br>", "") + "</pre>");
                    $("#Raw" + jsonContent.id).on("click", function () {
                        getRawJSON(jsonContent.id);
                    });
                    break;
            }
        })
        .fail(function () {
            $("#graphLoading").empty();
            $("#graphLoading").append("<div>An error has occurred while fetching the service</div>");
            $("#graphLoading").append('<button class="show-error-vis btn btn-secondary">Show error</button>');
            $(".show-error-vis").on("click", function () {
                let win = window.open(url, "_blank");
                win.focus();
            });
        });
    return true;
};


clsOpenReferralPlus.prototype.makeDot = function (jsonContent) {

    const objORP = this;

    objORP.Dot = '';
    objORP.dotNodes = [];
    objORP.nextNodeId = 0;

    objORP.Dot += "digraph  { \n";
    objORP.Dot += "\toverlap=false; \n";
    objORP.Dot += "\tsplines=true; \n";
    objORP.Dot += "\tnode [ color=black, fillcolor=lightblue ,fontname=Arial, fontcolor=black, fontsize=7]; \n";
    objORP.Dot += "\tedge [fontname=Arial, fontsize=7, labelfontname=Arial, labelfontsize=7, len=3.0]; \n";

    if (objORP.Resource === 'services' || (config.schemaType === "OpenReferral" && objORP.Resource === "services/complete")) {
        if (objORP.Parameter) {
            objORP.DotViewService(jsonContent);
        }
    }

    objORP.Dot += "}";

    return objORP.Dot;

};


clsOpenReferralPlus.prototype.DotViewService = function (jsonContent) {

    const objORP = this;

    const NodeIdService = objORP.DotNodeService(jsonContent);

    if (jsonContent.hasOwnProperty('organization')) {
        if (jsonContent.organization) {
            const NodeIdOrganization = objORP.DotNodeOrganization(jsonContent.organization);
            if (NodeIdOrganization) {
                var DotEdge = NodeIdOrganization + ' -> ' + NodeIdService + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }


    if (jsonContent.hasOwnProperty('service_at_locations')) {
        let jsonLength;
        if (jsonContent.service_at_locations === undefined) {
            jsonContent.service_at_locations = {};
            jsonLength = 1;
        } else if (jsonContent.service_at_locations.length === 0 && (this.showAll || (jsonContent.holiday_schedules.length !== 0))) {
            jsonLength = 1;
        } else {
            jsonLength = jsonContent.service_at_locations.length;
        }
        for (let i = 0; i < jsonLength; i++) {
            const jsonServiceAtLocation = jsonContent.service_at_locations[i];
            var NodeIdServiceAtLocation = objORP.DotNodeServiceAtLocation(jsonServiceAtLocation);
            if (NodeIdServiceAtLocation) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdServiceAtLocation + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if ((rootJson.hasOwnProperty('location') || (rootJson.hasOwnProperty('regular_schedule'))) || this.showAll) {
        var NodeIdServiceAtLocation = objORP.DotNodeServiceAtLocation([{}]);
        if (NodeIdServiceAtLocation) {
            var DotEdge = NodeIdService + ' -> ' + NodeIdServiceAtLocation + '\n';
            objORP.Dot += DotEdge;
        }
    }


    if (jsonContent.hasOwnProperty('service_areas')) {
        if (jsonContent.service_areas || this.showAll) {
            const NodeIdServiceAreas = objORP.DotListAreas(jsonContent.service_areas);
            if (NodeIdServiceAreas) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdServiceAreas + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if (jsonContent.hasOwnProperty('service_area')) {
        if (jsonContent.service_areare || this.showAll) {
            const NodeIdServiceAreas = objORP.DotListAreas(jsonContent.service_area);
            if (NodeIdServiceAreas) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdServiceAreas + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if (this.showAll) {
        const NodeIdServiceAreas = objORP.DotListAreas([{}]);
        if (NodeIdServiceAreas) {
            var DotEdge = NodeIdService + ' -> ' + NodeIdServiceAreas + '\n';
            objORP.Dot += DotEdge;
        }
    }

    if (jsonContent.hasOwnProperty('contacts')) {
        if (jsonContent.contacts || this.showAll) {
            const NodeIdContacts = objORP.DotNodeContacts(jsonContent.contacts);
            if (NodeIdContacts) {
                var DotEdge = NodeIdService + " -> " + NodeIdContacts + "\n";
                objORP.Dot += DotEdge;
            }
        }
    }


    if (jsonContent.hasOwnProperty('cost_options')) {
        if (jsonContent.cost_options || this.showAll) {
            let NodeIdCostOptions = objORP.DotNodeCostOptions(jsonContent.cost_options);
            if (NodeIdCostOptions) {
                var DotEdge = NodeIdService + " -> " + NodeIdCostOptions + "\n";
                objORP.Dot += DotEdge;
            }
        }
    } else if (this.showAll) {
        let NodeIdCostOptions = objORP.DotNodeCostOptions([{}]);
        if (NodeIdCostOptions) {
            var DotEdge = NodeIdService + " -> " + NodeIdCostOptions + "\n";
            objORP.Dot += DotEdge;
        }
    }

    if (jsonContent.hasOwnProperty('reviews')) {
        const NodeIdReviews = objORP.DotNodeReviews(jsonContent.reviews);
        if (NodeIdReviews) {
            var DotEdge = NodeIdService + ' -> ' + NodeIdReviews + '\n';
            objORP.Dot += DotEdge;
        }
    } else if (this.showAll) {
        const NodeIdReviews = objORP.DotNodeReviews([{}]);
        if (NodeIdReviews) {
            var DotEdge = NodeIdService + ' -> ' + NodeIdReviews + '\n';
            objORP.Dot += DotEdge;
        }
    }

    if (jsonContent.hasOwnProperty('fundings')) {
        if (jsonContent.fundings) {
            const NodeIdFundings = objORP.DotNodeFundings(jsonContent.fundings);
            if (NodeIdFundings) {
                var DotEdge = NodeIdService + " -> " + NodeIdFundings + "\n";
                objORP.Dot += DotEdge;
            }
        }
    } else if (this.showAll) {
        const NodeIdFundings = objORP.DotNodeFundings([{}]);
        if (NodeIdFundings) {
            var DotEdge = NodeIdService + " -> " + NodeIdFundings + "\n";
            objORP.Dot += DotEdge;
        }
    }

    if (jsonContent.hasOwnProperty('eligibilitys')) {
        if (jsonContent.eligibilitys || this.showAll) {
            const NodeIdEligibilitys = objORP.DotNodeEligibilitys(jsonContent.eligibilitys);
            if (NodeIdEligibilitys) {
                var DotEdge = NodeIdService + " -> " + NodeIdEligibilitys + "\n";
                objORP.Dot += DotEdge;
            }
        }
    } else if (jsonContent.hasOwnProperty('eligibility')) {
        if (jsonContent.eligibility || this.showAll) {
            const NodeIdEligibility = objORP.DotNodeEligibilitys(jsonContent.eligibility);
            if (NodeIdEligibility) {
                var DotEdge = NodeIdService + " -> " + NodeIdEligibility + "\n";
                objORP.Dot += DotEdge;
            }
        }
    } else if (this.showAll) {
        const NodeIdEligibilitys = objORP.DotNodeEligibilitys([{}]);
        if (NodeIdEligibilitys) {
            var DotEdge = NodeIdService + " -> " + NodeIdEligibilitys + "\n";
            objORP.Dot += DotEdge;
        }
    }

    if (jsonContent.hasOwnProperty('regular_schedules')) {
        if (jsonContent.regular_schedules) {
            const NodeIdRegularSchedules = objORP.DotNodeRegularSchedule(jsonContent.regular_schedules);
            if (NodeIdRegularSchedules) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdRegularSchedules + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if (this.showAll) {
        const NodeIdRegularSchedules = objORP.DotNodeRegularSchedule([{}]);
        if (NodeIdRegularSchedules) {
            var DotEdge = NodeIdService + ' -> ' + NodeIdRegularSchedules + '\n';
            objORP.Dot += DotEdge;
        }
    }

    if (jsonContent.hasOwnProperty('holiday_schedules') || this.showAll) {
        if (jsonContent.holiday_schedules || this.showAll) {
            const NodeIdHolidaySchedules = objORP.DotNodeHolidaySchedules(jsonContent.holiday_schedules);
            if (NodeIdHolidaySchedules) {
                var DotEdge = NodeIdServiceAtLocation + ' -> ' + NodeIdHolidaySchedules + '\n';
                objORP.Dot += DotEdge;


            }
        }
    }

    if (jsonContent.hasOwnProperty('languages') || this.showAll) {
        if ((jsonContent.languages && jsonContent.languages.length !== 0) || this.showAll) {
            const NodeIdLanguages = objORP.DotNodeLanguages(jsonContent.languages);
            if (NodeIdLanguages) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdLanguages + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }


    if (jsonContent.hasOwnProperty('service_taxonomys')) {
        let taxonomy = false;
        jsonContent.service_taxonomys.forEach(function (item) {
            if (item.hasOwnProperty('taxonomy')) {
                taxonomy = true;
            }
        });
        if (taxonomy || this.showAll) {
            const NodeIdServiceTaxonomies = objORP.DotListTaxonomies(jsonContent.service_taxonomys);
            if (NodeIdServiceTaxonomies) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdServiceTaxonomies + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if (jsonContent.hasOwnProperty('taxonomy')) {
        let taxonomy = false;
        jsonContent.taxonomy.forEach(function (item) {
            if (item.hasOwnProperty('id')) {
                taxonomy = true;
            }
        });
        if (taxonomy || this.showAll) {
            const NodeIdServiceTaxonomies = objORP.DotListTaxonomies(jsonContent.taxonomy);
            if (NodeIdServiceTaxonomies) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdServiceTaxonomies + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }

};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeService = function (jsonContent) {

    const objORP = this;

    let idService = null;
    if (jsonContent.hasOwnProperty('id')) {
        idService = jsonContent.id;
    }

    if (!idService) {
        return false;
    }

    const NodeId = "\"service_" + idService + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>service</b></td></tr>";
    Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + idService + "</td></tr>";

    if (jsonContent.hasOwnProperty('name')) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.name)) + "</td></tr>";
    } else {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
    }

    if (jsonContent.hasOwnProperty('description')) {
        if (jsonContent.description) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.description)) + "</td></tr>";
        } else {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('url')) {
        if (jsonContent.url) {
            let urlConvert = jsonContent.url.replace("&", "¬");
            urlConvert = nl2br(objORP.objViz.prepareString(urlConvert));
            urlConvert = urlConvert.replace("¬", "&amp;");

            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + urlConvert + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('email')) {
        if (jsonContent.email) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>email  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.email)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>email  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('status')) {
        if (jsonContent.status) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>status  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.status)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>status  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('fees')) {
        if (jsonContent.fees) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>fees  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.fees)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>fees  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('accreditations')) {
        if (jsonContent.accreditations) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>accreditations  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.accreditations)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>accreditations  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('deliverableType')) {
        if (jsonContent.deliverableType) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>deliverable type  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.deliverableType)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>deliverable type  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('attending_type')) {
        if (jsonContent.attending_type) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>attending type  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.attending_type)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>attending type  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('attending_access')) {
        if (jsonContent.attending_access) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>attending access  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.attending_access)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>attending access  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;
};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeOrganization = function (jsonContent) {

    const objORP = this;
    if (config.hasOwnProperty("schemaType"))
        if (config.schemaType === "OpenReferral")
            jsonContent = jsonContent[0];
    let numCols = 0;
    try {
        if (Object.keys(jsonContent).length !== 0) {
            numCols = 2;
        }
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    const NodeId = "\"organization_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    let idOrganization = null;
    if (jsonContent.hasOwnProperty('id')) {
        idOrganization = jsonContent.id;
    } else if (this.showAll) {
        idOrganization = "";
    }

    if (idOrganization === null) {
        return false;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
            }
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        if (Object.keys(jsonContent).length !== 0) {
            jsonLength = 1;
        }
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>organization</b>  </td></tr>";


    try {
        let jsonOrganization = jsonContent;
        if (jsonOrganization.id === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonOrganization.id || (jsonOrganization.id === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonOrganization.id) ? nl2br(objORP.objViz.prepareString(jsonOrganization.id)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    try {
        let jsonOrganization = jsonContent;
        if (jsonOrganization.name === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonOrganization.name || (jsonOrganization.name === "") && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonOrganization.name) ? nl2br(objORP.objViz.prepareString(jsonOrganization.name)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    try {
        let jsonOrganization = jsonContent;
        if (jsonOrganization.description === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonOrganization.description || (jsonOrganization.description === "") && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonOrganization.description) ? nl2br(objORP.objViz.prepareString(jsonOrganization.description)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    try {
        let jsonOrganization = jsonContent;
        if (jsonOrganization.url === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonOrganization.url || (jsonOrganization.url === "") && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonOrganization.url) ? nl2br(objORP.objViz.prepareString(jsonOrganization.url)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    try {
        let jsonOrganization = jsonContent;
        if (jsonOrganization.logo === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonOrganization.logo || (jsonOrganization.logo === "") && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonOrganization.logo) ? nl2br(objORP.objViz.prepareString(jsonOrganization.logo)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonOrganization = jsonContent;
        if (jsonOrganization.uri === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>uri  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonOrganization.uri || (jsonOrganization.uri === "" || jsonOrganization.uri === null) && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>uri  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonOrganization.uri) ? nl2br(objORP.objViz.prepareString(jsonOrganization.uri)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>uri  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;

};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeArea = function (jsonContent) {

    const objORP = this;

    let idArea = null;
    if (jsonContent.hasOwnProperty('id')) {
        idArea = jsonContent.id;
    }

    if (!idArea) {
        idArea = objORP.nextNodeId++;
    }

    const NodeId = "\"area_" + idArea + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>service_area</b></td></tr>";

    if (jsonContent.hasOwnProperty('id')) {
        if (jsonContent.id) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + jsonContent.id + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('service_area')) {
        if (jsonContent.service_area) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>service_area  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.service_area)) + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('description')) {
        if (jsonContent.description) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.description)) + "</td></tr>";
        }
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;

};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeServiceAtLocation = function (jsonContent) {

    const objORP = this;

    let idServiceAtLocation = null;
    if (jsonContent === undefined) {
        jsonContent = [{}];
    }
    if (jsonContent.hasOwnProperty('id')) {
        idServiceAtLocation = jsonContent.id;
    }

    if (!idServiceAtLocation) {
        objORP.nextNodeId++;
    }

    const NodeId = "\"service_at_location_" + idServiceAtLocation + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>service_at_location</b>  </td></tr>";

    if (jsonContent.hasOwnProperty('id')) {
        if (jsonContent.id) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + ((jsonContent.id) ? nl2br(objORP.objViz.prepareString(jsonContent.id)) : '') + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('location')) {
        if (jsonContent.location || this.showAll) {
            const NodeIdLocation = objORP.DotNodeLocation(jsonContent.location);
            if (NodeIdLocation) {
                var DotEdge = NodeId + ' -> ' + NodeIdLocation + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if (rootJson.hasOwnProperty("location")) {
        jsonContent.location = rootJson.location;
        for (let i = 0; i < jsonContent.location.length; i++) {
            if (jsonContent.location[i] || this.showAll) {
                const NodeIdLocation = objORP.DotNodeLocation(jsonContent.location[i]);
                if (NodeIdLocation) {
                    var DotEdge = NodeId + ' -> ' + NodeIdLocation + '\n';
                    objORP.Dot += DotEdge;
                }
            }
        }
    } else if (this.showAll) {
        if (jsonContent.location || this.showAll) {
            const NodeIdLocation = objORP.DotNodeLocation([{}]);
            if (NodeIdLocation) {
                var DotEdge = NodeId + ' -> ' + NodeIdLocation + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }

    if (jsonContent.hasOwnProperty('regular_schedule')) {
        if (jsonContent.regular_schedule) {
            const NodeIdRegularSchedule = objORP.DotNodeRegularSchedule(jsonContent.regular_schedule);
            if (NodeIdRegularSchedule) {
                var DotEdge = NodeId + ' -> ' + NodeIdRegularSchedule + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if (rootJson.hasOwnProperty('regular_schedule')) {
        jsonContent.regular_schedule = rootJson.regular_schedule;
        if (jsonContent.regular_schedule) {
            const NodeIdRegularSchedule = objORP.DotNodeRegularSchedule(jsonContent.regular_schedule);
            if (NodeIdRegularSchedule) {
                var DotEdge = NodeId + ' -> ' + NodeIdRegularSchedule + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if (this.showAll) {
        const NodeIdRegularSchedule = objORP.DotNodeRegularSchedule([{}]);
        if (NodeIdRegularSchedule) {
            var DotEdge = NodeId + ' -> ' + NodeIdRegularSchedule + '\n';
            objORP.Dot += DotEdge;
        }
    }


    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;

};

/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeLocation = function (jsonContent) {

    const objORP = this;
    let numCols = 0;
    try {
        if (Object.keys(jsonContent).length !== 0) {
            numCols = 2;
        }
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }


    const NodeId = "\"location_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
            }
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>location</b>  </td></tr>";

    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.id === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.id || (jsonLocation.id === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.id) ? nl2br(objORP.objViz.prepareString(jsonLocation.id)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.name === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.name || (jsonLocation.name === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>name  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.name) ? nl2br(objORP.objViz.prepareString(jsonLocation.name)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.description === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.description || (jsonLocation.description === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>description  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.description) ? nl2br(objORP.objViz.prepareString(jsonLocation.description)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.latitude === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>latitude  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.latitude || (jsonLocation.latitude === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>latitude  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.latitude) ? nl2br(objORP.objViz.prepareString(jsonLocation.latitude)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>latitude  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.longitude === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>longitude  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.longitude || (jsonLocation.longitude === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>longitude  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.longitude) ? nl2br(objORP.objViz.prepareString(jsonLocation.longitude)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>longitude  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;


    if (jsonContent.hasOwnProperty('physical_addresses')) {
        for (let i = 0; i < jsonContent.physical_addresses.length; i++) {
            const jsonPhysicalAddress = jsonContent.physical_addresses[i];
            const NodeIdPhysicalAddress = objORP.DotNodePhysicalAddress(jsonPhysicalAddress);
            if (NodeIdPhysicalAddress) {
                const DotEdge = NodeId + ' -> ' + NodeIdPhysicalAddress + '\n';
                objORP.Dot += DotEdge;
            }
        }
    } else if (this.showAll) {
        const NodeIdPhysicalAddress = objORP.DotNodePhysicalAddress([{}]);
        if (NodeIdPhysicalAddress) {
            const DotEdge = NodeId + ' -> ' + NodeIdPhysicalAddress + '\n';
            objORP.Dot += DotEdge;
        }
    }


    return NodeId;

};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodePhysicalAddress = function (jsonContent) {

    const objORP = this;

    let idAddress = null;
    if (jsonContent.hasOwnProperty('id')) {
        idAddress = jsonContent.id;
    }

    if (!idAddress) {
        idAddress = objORP.nextNodeId++;
    }

    const NodeId = "\"physical_address_" + idAddress + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>physical_address</b></td></tr>";

    try {
        let jsonPhysicalAddress = jsonContent;
        if (jsonPhysicalAddress.id === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        } else if (jsonPhysicalAddress.id || (jsonPhysicalAddress.id === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonPhysicalAddress.id) ? nl2br(objORP.objViz.prepareString(jsonPhysicalAddress.id)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonPhysicalAddress = jsonContent;
        if (jsonPhysicalAddress.attention === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>attention  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        } else if (jsonPhysicalAddress.attention || (jsonPhysicalAddress.attention === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>attention  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonPhysicalAddress.attention) ? nl2br(objORP.objViz.prepareString(jsonPhysicalAddress.attention)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>attention  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonPhysicalAddress = jsonContent;
        if (jsonPhysicalAddress.address_1 === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>address_1  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        } else if (jsonPhysicalAddress.address_1 || (jsonPhysicalAddress.address_1 === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>address_1  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonPhysicalAddress.address_1) ? nl2br(objORP.objViz.prepareString(jsonPhysicalAddress.address_1)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>address_1  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonPhysicalAddress = jsonContent;
        if (jsonPhysicalAddress.city === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>city  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        } else if (jsonPhysicalAddress.city || (jsonPhysicalAddress.city === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>city  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonPhysicalAddress.city) ? nl2br(objORP.objViz.prepareString(jsonPhysicalAddress.city)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>city  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonPhysicalAddress = jsonContent;
        if (jsonPhysicalAddress.state_province === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>state_province  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        } else if (jsonPhysicalAddress.state_province || (jsonPhysicalAddress.state_province === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>state_province  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonPhysicalAddress.state_province) ? nl2br(objORP.objViz.prepareString(jsonPhysicalAddress.state_province)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>state_province  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonPhysicalAddress = jsonContent;
        if (jsonPhysicalAddress.postal_code === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>postal_code  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        } else if (jsonPhysicalAddress.postal_code || (jsonPhysicalAddress.postal_code === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>postal_code  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonPhysicalAddress.postal_code) ? nl2br(objORP.objViz.prepareString(jsonPhysicalAddress.postal_code)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>postal_code  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonPhysicalAddress = jsonContent;
        if (jsonPhysicalAddress.country === undefined && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>country  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        } else if (jsonPhysicalAddress.country || (jsonPhysicalAddress.country === "") && this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>country  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonPhysicalAddress.country) ? nl2br(objORP.objViz.prepareString(jsonPhysicalAddress.country)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td  align='left' balign='left' valign='top'><b>country  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    Dot += "</table>>";
    Dot += "]; \n";


    objORP.Dot += Dot;

    return NodeId;

};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeRegularSchedule = function (jsonContent) {

    const objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    const NodeId = "\"regular_schedule_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
                jsonContent = [{}];
            }
        } catch (e) {
            jsonLength = 1;
            jsonContent = [{}];
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>regular_schedule</b>  </td></tr>";
    if (jsonContent[0].id !== null || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.id === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.id || ((jsonRegularSchedule.id === "" || jsonRegularSchedule.id === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.id) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.id)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }
    if ((jsonContent[0].opens_at !== null && jsonContent[0].opens_at !== undefined && jsonContent[0].opens_at !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>opens_at  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.opens_at === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.opens_at || ((jsonRegularSchedule.opens_at === "" || jsonRegularSchedule.opens_at === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.opens_at) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.opens_at)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].closes_at !== null && jsonContent[0].closes_at !== undefined && jsonContent[0].closes_at !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>closes_at  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.closes_at === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.closes_at || ((jsonRegularSchedule.closes_at === "" || jsonRegularSchedule.closes_at === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.closes_at) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.closes_at)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].valid_from !== null && jsonContent[0].valid_from !== undefined && jsonContent[0].valid_from !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>valid_from  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.valid_from === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.valid_from || ((jsonRegularSchedule.valid_from === "" || jsonRegularSchedule.valid_from === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.valid_from) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.valid_from)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].valid_to !== null && jsonContent[0].valid_to !== undefined && jsonContent[0].valid_to !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>valid_to  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.valid_to === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.valid_to || ((jsonRegularSchedule.valid_to === "" || jsonRegularSchedule.valid_to === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.valid_to) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.valid_to)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].dtstart !== null && jsonContent[0].dtstart !== undefined && jsonContent[0].dtstart !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>dtstart  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.dtstart === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.dtstart || ((jsonRegularSchedule.dtstart === "" || jsonRegularSchedule.dtstart === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.dtstart) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.dtstart)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].freq !== null && jsonContent[0].freq !== undefined && jsonContent[0].freq !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>freq  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.freq === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.freq || ((jsonRegularSchedule.freq === "" || jsonRegularSchedule.freq === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.freq) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.freq)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].interval !== null && jsonContent[0].interval !== undefined && jsonContent[0].interval !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>interval  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.interval === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.interval || ((jsonRegularSchedule.interval === "" || jsonRegularSchedule.interval === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.interval) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.interval)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if (jsonContent[0].byday !== null && jsonContent[0].byday !== undefined && jsonContent[0].byday !== "") {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>byday  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.byday === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.byday || ((jsonRegularSchedule.byday === "" || jsonRegularSchedule.byday === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.byday) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.byday)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    } else if ((jsonContent[0].weekday !== null && jsonContent[0].weekday !== undefined && jsonContent[0].weekday !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>weekday  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.weekday === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.weekday || ((jsonRegularSchedule.weekday === "" || jsonRegularSchedule.weekday === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.weekday) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.weekday)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].bymonthday !== null && jsonContent[0].bymonthday !== undefined && jsonContent[0].bymonthday !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>bymonthday  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if ((jsonRegularSchedule.bymonthday === undefined || jsonRegularSchedule.bymonthday === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.bymonthday || ((jsonRegularSchedule.bymonthday === "" || jsonRegularSchedule.bymonthday === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.bymonthday) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.bymonthday)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].description !== null && jsonContent[0].description !== undefined && jsonContent[0].description !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.description === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.description || ((jsonRegularSchedule.description === "" || jsonRegularSchedule.description === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.description) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.description)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }
    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;

};

/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeHolidaySchedules = function (jsonContent) {

    const objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    const NodeId = "\"holiday_schedules_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
            }
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>holiday_schedule</b>  </td></tr>";


    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonHolidaySchedule = jsonContent[i];
            if (jsonHolidaySchedule.id === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            } else if (jsonHolidaySchedule.id || (jsonHolidaySchedule.id === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.id) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.id)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonHolidaySchedule = jsonContent[i];
            if (jsonHolidaySchedule.closed === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closed  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.closed || (jsonHolidaySchedule.closed === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closed  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.closed) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.closed)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closed  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
        }
    }
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonHolidaySchedule = jsonContent[i];
            if (jsonHolidaySchedule.opens_at === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>opens_at  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.opens_at || (jsonHolidaySchedule.opens_at === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>opens_at  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.opens_at) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.opens_at)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>opens_at  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonHolidaySchedule = jsonContent[i];
            if (jsonHolidaySchedule.closes_at === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closes_at  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.closes_at || (jsonHolidaySchedule.closes_at === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closes_at  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.closes_at) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.closes_at)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closes_at  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonHolidaySchedule = jsonContent[i];
            if (jsonHolidaySchedule.start_date === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>start_date  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.start_date || (jsonHolidaySchedule.start_date === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>start_date  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.start_date) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.start_date)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>start_date  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
        }
    }
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonHolidaySchedule = jsonContent[i];
            if (jsonHolidaySchedule.end_date === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>end_date  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.end_date || (jsonHolidaySchedule.end_date === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>end_date  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.end_date) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.end_date)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>end_date  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
        }
    }


    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;

};

/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeLanguages = function (jsonContent) {

    const objORP = this;

    NodeId = 'list_taxonomies_' + String(objORP.nextNodeId++);

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>language</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>language</b></td>";


    Dot += "</tr>";
    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            const jsonLanguage = jsonContent[i];

            Dot += "<tr>";
            Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonLanguage.id)) + "</td>";
            Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonLanguage.language)) + "</td>";

            Dot += "</tr>";

        } catch (e) {
            Dot += "<tr>";
            Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
            Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";

            Dot += "</tr>";
        }
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;
};

/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeContacts = function (jsonContent) {

    const objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    const NodeId = "\"contact_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
                jsonContent = [{}];
            }
        } catch (e) {
            jsonLength = 1;
            jsonContent = [{}];
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>contact</b>  </td></tr>";
    if ((jsonContent[0].id !== null && jsonContent[0].id !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonContact = jsonContent[i];
                if (jsonContact.id === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonContact.id || ((jsonContact.id === "" || jsonContact.id === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonContact.id) ? nl2br(objORP.objViz.prepareString(jsonContact.id)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].name !== null && jsonContent[0].name !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonContact = jsonContent[i];
                if (jsonContact.name === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonContact.name || ((jsonContact.name === "" || jsonContact.name === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonContact.name) ? nl2br(objORP.objViz.prepareString(jsonContact.name)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].title !== null && jsonContent[0].title !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>title  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonContact = jsonContent[i];
                if (jsonContact.title === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonContact.title || ((jsonContact.title === "" || jsonContact.title === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonContact.title) ? nl2br(objORP.objViz.prepareString(jsonContact.title)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    for (let i = 0; i < jsonContent.length; i++) {
        if (jsonContent[i].hasOwnProperty('phones')) {
            if (jsonContent[i].phones || this.showAll) {
                const NodeIdPhone = objORP.DotNodePhone(jsonContent[i].phones);
                if (NodeIdPhone) {
                    const DotEdge = NodeId + " -> " + NodeIdPhone + "\n";
                    objORP.Dot += DotEdge;
                }
            }
        } else if (config.hasOwnProperty("schemaType")) {
            if (config.schemaType === "OpenReferral") {
                jsonContent = rootJson;
                if (jsonContent.phones[i] || this.showAll) {
                    const NodeIdPhone = objORP.DotNodePhone([jsonContent.phones[i]]);
                    if (NodeIdPhone) {
                        const DotEdge = NodeId + " -> " + NodeIdPhone + "\n";
                        objORP.Dot += DotEdge;
                    }
                }
            }
        }
    }

    return NodeId;

};
/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodePhone = function (jsonContent) {

    const objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    const NodeId = "\"phone_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>phone</b>  </td></tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id  </b></td>";

    for (let i = 0; i < jsonLength; i++) {
        try {
            var jsonPhone = jsonContent[i];
            Dot += "<td align='left' balign='left' valign='top'>" + ((jsonPhone.id) ? nl2br(objORP.objViz.prepareString(jsonPhone.id)) : '') + "</td>";
        } catch (e) {
            Dot += "<td align='left' balign='left' valign='top'>" + " " + "</td>";
        }
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>number  </b></td>";
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonPhone = jsonContent[i];
            Dot += "<td align='left' balign='left' valign='top'>" + ((jsonPhone.number) ? nl2br(objORP.objViz.prepareString(jsonPhone.number)) : '') + "</td>";
        } catch (e) {
            Dot += "<td align='left' balign='left' valign='top'>" + " " + "</td>";
        }
    }
    Dot += "</tr>";


    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonPhone = jsonContent[i];
            if (jsonPhone.language === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>language  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonPhone.language) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>language  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonPhone.language) ? nl2br(objORP.objViz.prepareString(jsonPhone.language)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>language  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
        }
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;

};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeCostOptions = function (jsonContent) {

    const objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    const NodeId = "\"cost_option_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonContent = [{}];
                jsonLength = 1;
            }
        } catch (e) {
            jsonLength = 1;
            jsonContent = {"id": null};
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>cost_option</b>  </td></tr>";


    if (jsonContent[0].id !== null || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.id === undefined || jsonCostOption.id === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonCostOption.id || ((jsonCostOption.id === "" || jsonCostOption.id === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.id) ? nl2br(objORP.objViz.prepareString(jsonCostOption.id)) : '') + "</td>";
                } else {
                    Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].valid_from !== null && jsonContent[0].valid_from !== undefined && jsonContent[0].valid_from !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>valid_from  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.valid_from === undefined || jsonCostOption.valid_from === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonCostOption.valid_from || ((jsonCostOption.valid_from === "") && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.valid_from) ? nl2br(objORP.objViz.prepareString(jsonCostOption.valid_from)) : '') + "</td>";
                } else {
                    Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].valid_to !== null && jsonContent[0].valid_to !== undefined && jsonContent[0].valid_to !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>valid_to  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.valid_to === undefined || jsonCostOption.valid_to === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonCostOption.valid_to || ((jsonCostOption.valid_to === "") && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.valid_to) ? nl2br(objORP.objViz.prepareString(jsonCostOption.valid_to)) : '') + "</td>";
                } else {
                    Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].option !== null && jsonContent[0].option !== undefined) || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>option  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.option === undefined || jsonCostOption.option === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonCostOption.option || (jsonCostOption.option === "" && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.option) ? nl2br(objORP.objViz.prepareString(jsonCostOption.option)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if (jsonContent[0].amount !== null || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>amount  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.amount === undefined || jsonCostOption.amount === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonCostOption.amount !== null || (jsonCostOption.amount === "" && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.amount) ? jsonCostOption.amount : 0) + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }
    if ((jsonContent[0].amount_description !== null && jsonContent[0].amount_description !== undefined) || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>amount_description  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.amount_description === undefined || jsonCostOption.amount_description === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonCostOption.amount_description || (jsonCostOption.amount_description === "" && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.amount_description) ? nl2br(objORP.objViz.prepareString(jsonCostOption.amount_description)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;
};

/**
 * @return {string}
 */

clsOpenReferralPlus.prototype.DotNodeFundings = function (jsonContent) {

    const objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    const NodeId = "\"language_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
            }
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>funding</b>  </td></tr>";

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonFunding = jsonContent[i];
            if (jsonFunding.id === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            } else if (jsonFunding.id || (jsonFunding.id === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonFunding.id) ? nl2br(objORP.objViz.prepareString(jsonFunding.id)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonFunding = jsonContent[i];
            if (jsonFunding.source === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>source  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            } else if (jsonFunding.source || (jsonFunding.source === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>source  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonFunding.source) ? nl2br(objORP.objViz.prepareString(jsonFunding.source)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>source  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
            }
        }
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;

};

/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeEligibilitys = function (jsonContent) {

    var objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    let NodeId = "\"eligibility_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
                jsonContent = [{}];
            }
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }
    var objORP = this;

    NodeId = 'list_taxonomies_' + String(objORP.nextNodeId++);

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='4' bgcolor='lightgrey'><b>eligibility</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>eligibility</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>min_age</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>max_age</b></td>";

    Dot += "</tr>";


    for (let i = 0; i < jsonContent.length; i++) {
        const jsonLinkTaxonomy = jsonContent[i];

        Dot += "<tr>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonLinkTaxonomy.id) ? nl2br(objORP.objViz.prepareString(jsonLinkTaxonomy.id)) : '') + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonLinkTaxonomy.eligibility) ? nl2br(objORP.objViz.prepareString(jsonLinkTaxonomy.eligibility)) : '') + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonLinkTaxonomy.minimum_age) ? nl2br(objORP.objViz.prepareString(jsonLinkTaxonomy.minimum_age)) : '') + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonLinkTaxonomy.maximum_age) ? nl2br(objORP.objViz.prepareString(jsonLinkTaxonomy.maximum_age)) : '') + "</td>";

        Dot += "</tr>";

    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;
    $.each(jsonContent, function (key, item) {

        if (item.hasOwnProperty('taxonomys')) {
            if (item.taxonomys.length !== 0 || this.showAll) {
                const NodeIdLinkId = objORP.DotNodeLinkTaxonomy(item.taxonomys);
                if (NodeIdLinkId) {
                    var DotEdge = NodeId + " -> " + NodeIdLinkId + "\n";
                    objORP.Dot += DotEdge;
                }
            }
        }
    });

    return NodeId;
};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeLinkTaxonomy = function (jsonContent) {

    var objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    let NodeId = "\"link_taxonomy" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
                jsonContent = [{}];
            }
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }
    var objORP = this;

    NodeId = 'list_link_taxonomies_' + String(objORP.nextNodeId++);

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='4' bgcolor='lightgrey'><b>link_taxonomy</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>name</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>vocabulary</b></td>";

    Dot += "</tr>";


    for (let i = 0; i < jsonContent.length; i++) {
        const jsonLinkTaxonomy = jsonContent[i];

        Dot += "<tr>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonLinkTaxonomy.id) ? nl2br(objORP.objViz.prepareString(jsonLinkTaxonomy.id)) : '') + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonLinkTaxonomy.name) ? nl2br(objORP.objViz.prepareString(jsonLinkTaxonomy.name)) : '') + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonLinkTaxonomy.vocabulary) ? nl2br(objORP.objViz.prepareString(jsonLinkTaxonomy.vocabulary)) : '') + "</td>";
        Dot += "</tr>";

    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;
};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeReviews = function (jsonContent) {

    const objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    const NodeId = "\"review_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
            }
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>review</b>  </td></tr>";

    if ((jsonContent[0].id !== null && jsonContent[0].id !== undefined && jsonContent[0].id !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.id === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.id || ((jsonRegularSchedule.id === "" || jsonRegularSchedule.id === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.id) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.id)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }
    if ((jsonContent[0].title !== null && jsonContent[0].title !== undefined && jsonContent[0].title !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>title  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.title === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.title || ((jsonRegularSchedule.title === "" || jsonRegularSchedule.title === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.title) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.title)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].description !== null && jsonContent[0].description !== undefined && jsonContent[0].description !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.description === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.description || ((jsonRegularSchedule.description === "" || jsonRegularSchedule.description === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.description) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.description)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].date !== null && jsonContent[0].date !== undefined && jsonContent[0].date !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>date  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.date === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.date || ((jsonRegularSchedule.date === "" || jsonRegularSchedule.date === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.date) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.date)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].score !== null && jsonContent[0].score !== undefined && jsonContent[0].score !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>score  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.score === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.score || ((jsonRegularSchedule.score === "" || jsonRegularSchedule.score === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.score) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.score)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].url !== null && jsonContent[0].url !== undefined && jsonContent[0].url !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.url === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.url || ((jsonRegularSchedule.url === "" || jsonRegularSchedule.url === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.url) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.url)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].widget !== null && jsonContent[0].widget !== undefined && jsonContent[0].widget !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>widget  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.widget === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                } else if (jsonRegularSchedule.widget || ((jsonRegularSchedule.widget === "" || jsonRegularSchedule.widget === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.widget) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.widget)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    let organizationReviewer = {};

    for (let i = 0; i < jsonLength; i++) {

        try {
            if (jsonContent[i].hasOwnProperty('organization') === false) {
                var NodeIdReviewOrg = objORP.DotNodeOrganization([{}]);
                if (NodeIdReviewOrg) {
                    var DotEdge = NodeId + ":" + i + ' -> ' + NodeIdReviewOrg + '\n';
                    objORP.Dot += DotEdge;
                }
                continue;
            }
        } catch (e) {
            if (this.showAll) {
                var NodeIdReviewOrg = objORP.DotNodeOrganization([{}]);
                if (NodeIdReviewOrg) {
                    var DotEdge = NodeId + ":" + i + ' -> ' + NodeIdReviewOrg + '\n';
                    objORP.Dot += DotEdge;
                }
            }
            continue;
        }

        try {
            if (jsonContent[i].organization.id in organizationReviewer) {
                var DotEdge = NodeId + ":" + i + ' -> ' + organizationReviewer[jsonContent[i].organization.id] + '\n';
                objORP.Dot += DotEdge;
                continue;
            }
        } catch (e) {
        }

        if (jsonContent[i].hasOwnProperty('organization') || this.showAll) {
            try {
                var NodeIdReviewOrg = objORP.DotNodeOrganization(jsonContent[i].organization);
            } catch (e) {
                var NodeIdReviewOrg = objORP.DotNodeOrganization([{}]);
            }
            if (NodeIdReviewOrg) {
                try {
                    if (!(jsonContent[i].organization.id in organizationReviewer)) {
                        organizationReviewer[jsonContent[i].organization.id] = NodeIdReviewOrg;
                    }
                    var DotEdge = NodeId + ":" + i + ' -> ' + organizationReviewer[jsonContent[i].organization.id] + '\n';
                    objORP.Dot += DotEdge;
                } catch (e) {
                    var DotEdge = NodeId + ":" + i + ' -> ' + NodeIdReviewOrg + '\n';
                    objORP.Dot += DotEdge;
                }
            }
        }
    }
    return NodeId;
};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotListAreas = function (jsonContent) {
    const objORP = this;
    let numCols;
    try {
        numCols = jsonContent.length;
        if (numCols === 0 && this.showAll) {
            numCols = 2;
        }
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    let NodeId = "\"service_area" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    let jsonLength;
    if (this.showAll) {
        try {
            jsonLength = jsonContent.length;
            if (jsonLength === 0 && this.showAll) {
                jsonLength = 1;
                jsonContent = [{}];
            }
        } catch (e) {
            jsonLength = 1;
        }
    } else if (!this.showAll) {
        jsonLength = jsonContent.length;
    }


    NodeId = 'list_taxonomies_' + String(objORP.nextNodeId++);

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='3' bgcolor='lightgrey'><b>service_area</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>service_area</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>uri</b></td>";

    Dot += "</tr>";

    for (let i = 0; i < jsonContent.length; i++) {
        const jsonServiceArea = jsonContent[i];
        Dot += "<tr>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonServiceArea.service_area) ? nl2br(objORP.objViz.prepareString(jsonServiceArea.service_area)) : '') + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonServiceArea.uri) ? nl2br(objORP.objViz.prepareString(jsonServiceArea.uri)) : '') + "</td>";
        Dot += "</tr>";

    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;
};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotListTaxonomies = function (jsonContent) {

    const objORP = this;

    let NodeId = 'list_taxonomies_' + String(objORP.nextNodeId++);

    objORP.dotNodes.push(NodeId);

    let Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='3' bgcolor='lightgrey'><b>service_taxonomy / taxonomy</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>vocabulary</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>name</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>id</b></td>";

    Dot += "</tr>";

    for (let i = 0; i < jsonContent.length; i++) {
        const jsonLinkTaxonomy = jsonContent[i];
        if (jsonLinkTaxonomy.hasOwnProperty('taxonomy') || jsonLinkTaxonomy.hasOwnProperty('id')) {
            let jsonTaxonomy;
            jsonTaxonomy = config.schemaType === "OpenReferral" ? jsonLinkTaxonomy : jsonLinkTaxonomy.taxonomy;
            Dot += "<tr>";
            Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonTaxonomy.vocabulary)) + "</td>";
            Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonTaxonomy.name)) + "</td>";
            Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonTaxonomy.id)) + "</td>";
            Dot += "</tr>";
        }
    }


    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;


};


const clsORP_LoadingImage = function (tagLoading) {

    objLoadingImage = this;

    objLoadingImage.boolOn = false;
    objLoadingImage.tagLoading = tagLoading;
    objLoadingImage.spanLoading = null;

};

clsORP_LoadingImage.prototype.set = function (boolOn) {

    objLoadingImage = this;

    boolOn = (boolOn === undefined) ? true : boolOn;

    if (boolOn) {
        if (objLoadingImage.spanLoading == null) {
            objLoadingImage.spanLoading = document.createElement('span');
            objLoadingImage.tagLoading.appendChild(objLoadingImage.spanLoading);
        }
        objLoadingImage.spanLoading.innerHTML = '<img src="images/ajax-loader.gif" alt="Loading"/>';
    } else {
        if (objLoadingImage.spanLoading !== null) {
            objLoadingImage.spanLoading.parentElement.removeChild(objLoadingImage.spanLoading);
            objLoadingImage.spanLoading = null;
        }
    }

    objLoadingImage.boolOn = boolOn;


};
