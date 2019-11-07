var clsOpenReferralPlus = function () {

    var objORP = this;

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

    var objORP = this;

    var boolOK = true;

    var showAll = $("#allTables").val();
    if (showAll === "true") {
        this.showAll = true;
    } else if (showAll === "false") {
        this.showAll = false;
    }


    if (this.Endpoint != null) {
        if (this.idEndpoint) {
            var tagEndpoint = document.getElementById(this.idEndpoint);
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
            var tagResource = document.getElementById(this.idResource);
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
        case 'organizations':
            break;
        default:
            alert('Unknown Resource');
            return false;
    }
    if (this.Endpoint != null) {
        if (this.idParameter) {
            var tagParameter = document.getElementById(this.idParameter);
            if (tagParameter) {
                this.Parameter = getElementValue(tagParameter);
            }
        }
    }

    if (this.idFormat) {
        var tagFormat = document.getElementById(this.idFormat);
        if (tagFormat) {
            this.Format = getElementValue(tagFormat);
        }
    }

    if (!this.objViz) {
        alert('Viz object not set');
        return false;
    }

    this.objViz.setLoadingImage(true);

    var url = this.Endpoint + '/' + this.Resource + '/';

    if (this.Parameter) {
        url += this.Parameter;
    }


    addApiPanel("Get JSON for visualisation", false);
    addApiPanel(url);
    addApiPanel('<button class="btn btn-secondary" onclick=\'win = window.open("' + url + '", "_blank"); win.focus()\'>Show results</button>', false);
    updateScroll();

    $("#graph").empty();

    $.ajax({
        async: true,
        type: 'GET',
        url: url,
        dataType: "text",
        success: function (data) {
            var strListResponse = data;
            var jsonContent = JSON.parse(data);
            var Dot = objORP.makeDot(jsonContent);

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
                    $(objORP.objViz.tagElement).append("<button class='btn btn-secondary' onclick='getRawJSON(" + jsonContent.id + ")'>Raw JSON</button>");
                    $(objORP.objViz.tagElement).append('<pre>' + nl2br(htmlEntities(JSON.stringify(jsonContent, null, 1))) + '</pre>');
                    break;
            }
        }
    });


    return true;
};


clsOpenReferralPlus.prototype.makeDot = function (jsonContent) {

    var objORP = this;

    objORP.Dot = '';
    objORP.dotNodes = [];
    objORP.nextNodeId = 0;

    objORP.Dot += "digraph  { \n";
    objORP.Dot += "\toverlap=false; \n";
    objORP.Dot += "\tsplines=true; \n";
    objORP.Dot += "\tnode [ color=black, fillcolor=lightblue ,fontname=Arial, fontcolor=black, fontsize=7]; \n";
    objORP.Dot += "\tedge [fontname=Arial, fontsize=7, labelfontname=Arial, labelfontsize=7, len=3.0]; \n";

    switch (objORP.Resource) {
        case 'services':
            if (objORP.Parameter) {
                objORP.DotViewService(jsonContent);
            }
    }

    objORP.Dot += "}";

    return objORP.Dot;

};


clsOpenReferralPlus.prototype.DotViewService = function (jsonContent) {

    var objORP = this;

    var NodeIdService = objORP.DotNodeService(jsonContent);

    if (jsonContent.hasOwnProperty('organization')) {
        if (jsonContent.organization) {
            var NodeIdOrganization = objORP.DotNodeOrganization(jsonContent.organization);
            if (NodeIdOrganization) {
                var DotEdge = NodeIdOrganization + ' -> ' + NodeIdService + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }


    if (jsonContent.hasOwnProperty('service_at_locations') || this.showAll) {
        let jsonLength;
        if (jsonContent.service_at_locations.length === 0 && (this.showAll || (jsonContent.holiday_schedules.length !== 0))) {
            jsonLength = 1;
        } else {
            jsonLength = jsonContent.service_at_locations.length;
        }
        for (let i = 0; i < jsonLength; i++) {
            var jsonServiceAtLocation = jsonContent.service_at_locations[i];
            var NodeIdServiceAtLocation = objORP.DotNodeServiceAtLocation(jsonServiceAtLocation);
            if (NodeIdServiceAtLocation) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdServiceAtLocation + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }


    if (jsonContent.hasOwnProperty('service_areas')) {
        if (jsonContent.service_areas || this.showAll) {
            var NodeIdServiceAreas = objORP.DotListAreas(jsonContent.service_areas);
            if (NodeIdServiceAreas) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdServiceAreas + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }

    if (jsonContent.hasOwnProperty('contacts')) {
        if (jsonContent.contacts || this.showAll) {
            var NodeIdContacts = objORP.DotNodeContacts(jsonContent.contacts);
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
    }

    if (jsonContent.hasOwnProperty('reviews')) {
        var NodeIdReviews = objORP.DotNodeReviews(jsonContent.reviews);
        if (NodeIdReviews) {
            var DotEdge = NodeIdService + ' -> ' + NodeIdReviews + '\n';
            objORP.Dot += DotEdge;
        }
    }
    if (jsonContent.hasOwnProperty('fundings')) {
        if (jsonContent.fundings) {
            var NodeIdFundings = objORP.DotNodeFundings(jsonContent.fundings);
            if (NodeIdFundings) {
                var DotEdge = NodeIdService + " -> " + NodeIdFundings + "\n";
                objORP.Dot += DotEdge;
            }
        }
    }

    if (jsonContent.hasOwnProperty('eligibilitys')) {
        if (jsonContent.eligibilitys || this.showAll) {
            var NodeIdEligibilitys = objORP.DotNodeEligibilitys(jsonContent.eligibilitys);
            if (NodeIdEligibilitys) {
                var DotEdge = NodeIdService + " -> " + NodeIdEligibilitys + "\n";
                objORP.Dot += DotEdge;
            }
        }
    }
    if (jsonContent.hasOwnProperty('holiday_schedules') || this.showAll) {
        if (jsonContent.holiday_schedules || this.showAll) {
            var NodeIdHolidaySchedules = objORP.DotNodeHolidaySchedules(jsonContent.holiday_schedules);
            if (NodeIdHolidaySchedules) {
                var DotEdge = NodeIdServiceAtLocation + ' -> ' + NodeIdHolidaySchedules + '\n';
                objORP.Dot += DotEdge;


            }
        }
    }

    if (jsonContent.hasOwnProperty('languages') || this.showAll) {
        if ((jsonContent.languages && jsonContent.languages.length !== 0) || this.showAll) {
            var NodeIdLanguages = objORP.DotNodeLanguages(jsonContent.languages);
            if (NodeIdLanguages) {
                var DotEdge = NodeIdService + ' -> ' + NodeIdLanguages + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }


    if (jsonContent.hasOwnProperty('service_taxonomys')) {
        var NodeIdServiceTaxonomies = objORP.DotListTaxonomies(jsonContent.service_taxonomys);
        if (NodeIdServiceTaxonomies) {
            var DotEdge = NodeIdService + ' -> ' + NodeIdServiceTaxonomies + '\n';
            objORP.Dot += DotEdge;
        }
    }


};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodeService = function (jsonContent) {

    var objORP = this;

    var idService = null;
    if (jsonContent.hasOwnProperty('id')) {
        idService = jsonContent.id;
    }

    if (!idService) {
        return false;
    }

    var NodeId = "\"service_" + idService + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

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
            Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
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

    var objORP = this;
    var numCols = 0;
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

    var NodeId = "\"organization_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    var idOrganization = null;
    if (jsonContent.hasOwnProperty('id')) {
        idOrganization = jsonContent.id;
    } else if (this.showAll) {
        idOrganization = "";
    }

    if (idOrganization === null) {
        return false;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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
            Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.name || (jsonLocation.name === "") && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.name) ? nl2br(objORP.objViz.prepareString(jsonLocation.name)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.description === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.description || (jsonLocation.description === "") && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.description) ? nl2br(objORP.objViz.prepareString(jsonLocation.description)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.url === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.url || (jsonLocation.url === "") && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.url) ? nl2br(objORP.objViz.prepareString(jsonLocation.url)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }


    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.logo === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.logo || (jsonLocation.logo === "") && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.logo) ? nl2br(objORP.objViz.prepareString(jsonLocation.logo)) : '') + "</td></tr>";
        }
    } catch (e) {
        if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
        }
    }

    try {
        let jsonLocation = jsonContent;
        if (jsonLocation.uri === undefined && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>uri  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
        }
        if (jsonLocation.uri || (jsonLocation.uri === "" || jsonLocation.uri === null) && this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>uri  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonLocation.uri) ? nl2br(objORP.objViz.prepareString(jsonLocation.uri)) : '') + "</td></tr>";
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

    var objORP = this;

    var idArea = null;
    if (jsonContent.hasOwnProperty('id')) {
        idArea = jsonContent.id;
    }

    if (!idArea) {
        idArea = objORP.nextNodeId++;
    }

    var NodeId = "\"area_" + idArea + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

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

    var objORP = this;

    var idServiceAtLocation = null;
    if (jsonContent.hasOwnProperty('id')) {
        idServiceAtLocation = jsonContent.id;
    }

    if (!idServiceAtLocation) {
        objORP.nextNodeId++;
    }

    var NodeId = "\"service_at_location_" + idServiceAtLocation + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>service_at_location</b>  </td></tr>";

    if (jsonContent.hasOwnProperty('id')) {
        if (jsonContent.id) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + jsonContent.id + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('location')) {
        if (jsonContent.location || this.showAll) {
            var NodeIdLocation = objORP.DotNodeLocation(jsonContent.location);
            if (NodeIdLocation) {
                var DotEdge = NodeId + ' -> ' + NodeIdLocation + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }

    if (jsonContent.hasOwnProperty('regular_schedule') || this.showAll) {
        if (jsonContent.regular_schedule) {
            var NodeIdRegularSchedule = objORP.DotNodeRegularSchedule(jsonContent.regular_schedule);
            if (NodeIdRegularSchedule) {
                var DotEdge = NodeId + ' -> ' + NodeIdRegularSchedule + '\n';
                objORP.Dot += DotEdge;
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
clsOpenReferralPlus.prototype.DotNodeLocation = function (jsonContent) {

    var objORP = this;
    var numCols = 0;
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


    var NodeId = "\"location_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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
            var jsonPhysicalAddress = jsonContent.physical_addresses[i];
            var NodeIdPhysicalAddress = objORP.DotNodePhysicalAddress(jsonPhysicalAddress);
            if (NodeIdPhysicalAddress) {
                var DotEdge = NodeId + ' -> ' + NodeIdPhysicalAddress + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }


    return NodeId;

};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotNodePhysicalAddress = function (jsonContent) {

    var objORP = this;

    var idAddress = null;
    if (jsonContent.hasOwnProperty('id')) {
        idAddress = jsonContent.id;
    }

    if (!idAddress) {
        idAddress = objORP.nextNodeId++;
    }

    var NodeId = "\"physical_address_" + idAddress + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>physical_address</b></td></tr>";

    if (jsonContent.hasOwnProperty('id')) {
        if (jsonContent.id) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + jsonContent.id + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('attention')) {
        if (jsonContent.qttention) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>attention  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.attention)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>attention  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('address1')) {
        if (jsonContent.address1) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>address_1  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.address1)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>address_1  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('city')) {
        if (jsonContent.city) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>city  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.city)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>city  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('stateProvince')) {
        if (jsonContent.stateProvince) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>state_province  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.stateProvince)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>state_province  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('postalCode')) {
        if (jsonContent.postalCode) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>postal_code  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.postalCode)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>postal_code  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('country')) {
        if (jsonContent.country) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>country  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.country)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>country  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
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

    var objORP = this;
    var numCols;
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

    var NodeId = "\"regular_schedule_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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
                }
                if (jsonRegularSchedule.id || ((jsonRegularSchedule.id === "" || jsonRegularSchedule.id === null) && this.showAll)) {
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
                }
                if (jsonRegularSchedule.opens_at || ((jsonRegularSchedule.opens_at === "" || jsonRegularSchedule.opens_at === null) && this.showAll)) {
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
                }
                if (jsonRegularSchedule.closes_at || ((jsonRegularSchedule.closes_at === "" || jsonRegularSchedule.closes_at === null) && this.showAll)) {
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
                }
                if (jsonRegularSchedule.valid_from || ((jsonRegularSchedule.valid_from === "" || jsonRegularSchedule.valid_from === null) && this.showAll)) {
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
                }
                if (jsonRegularSchedule.valid_to || ((jsonRegularSchedule.valid_to === "" || jsonRegularSchedule.valid_to === null) && this.showAll)) {
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
                }
                if (jsonRegularSchedule.dtstart || ((jsonRegularSchedule.dtstart === "" || jsonRegularSchedule.dtstart === null) && this.showAll)) {
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
                }
                if (jsonRegularSchedule.freq || ((jsonRegularSchedule.freq === "" || jsonRegularSchedule.freq === null) && this.showAll)) {
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
                }
                if (jsonRegularSchedule.interval || ((jsonRegularSchedule.interval === "" || jsonRegularSchedule.interval === null) && this.showAll)) {
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

    if ((jsonContent[0].byday !== null && jsonContent[0].byday !== undefined && jsonContent[0].byday !== "") || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>byday  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonRegularSchedule = jsonContent[i];
                if (jsonRegularSchedule.byday === undefined && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                }
                if (jsonRegularSchedule.byday || ((jsonRegularSchedule.byday === "" || jsonRegularSchedule.byday === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonRegularSchedule.byday) ? nl2br(objORP.objViz.prepareString(jsonRegularSchedule.byday)) : '') + "</td>";
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
                }
                if (jsonRegularSchedule.description || ((jsonRegularSchedule.description === "" || jsonRegularSchedule.description === null) && this.showAll)) {
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

    var objORP = this;
    var numCols;
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

    var NodeId = "\"holiday_schedules_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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
            }
            if (jsonHolidaySchedule.id || (jsonHolidaySchedule.id === "") && this.showAll) {
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
            if (jsonHolidaySchedule.startDate === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>startDate  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.startDate || (jsonHolidaySchedule.startDate === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>startDate  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.startDate) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.startDate)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>startDate  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
        }
    }
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonHolidaySchedule = jsonContent[i];
            if (jsonHolidaySchedule.endDate === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>endDate  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.endDate || (jsonHolidaySchedule.endDate === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>endDate  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.endDate) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.endDate)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>endDate  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
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

    var objORP = this;

    NodeId = 'list_taxonomies_' + String(objORP.nextNodeId++);

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>language</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>language</b></td>";


    Dot += "</tr>";
    var jsonLength;
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
            var jsonLanguage = jsonContent[i];

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

    var objORP = this;
    var numCols;
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

    var NodeId = "\"contact_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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
                }
                if (jsonContact.id || ((jsonContact.id === "" || jsonContact.id === null) && this.showAll)) {
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
                }
                if (jsonContact.name || ((jsonContact.name === "" || jsonContact.name === null) && this.showAll)) {
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
                }
                if (jsonContact.title || ((jsonContact.title === "" || jsonContact.title === null) && this.showAll)) {
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
        if (jsonContent[i].hasOwnProperty('phones') || this.showAll) {
            if (jsonContent[i].phones || this.showAll) {
                var NodeIdPhone = objORP.DotNodePhone(jsonContent[i].phones);
                if (NodeIdPhone) {
                    var DotEdge = NodeId + " -> " + NodeIdPhone + "\n";
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
clsOpenReferralPlus.prototype.DotNodePhone = function (jsonContent) {

    var objORP = this;
    var numCols;
    try {
        numCols = jsonContent.length;
    } catch (e) {
        numCols = 2;
    }
    if (!numCols) {
        return false;
    }

    var NodeId = "\"phone_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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
            Dot += "<td align='left' balign='left' valign='top'>" + jsonPhone.id + "</td>";
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

    var objORP = this;
    var numCols;
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

    var NodeId = "\"cost_option_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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


    if (jsonContent.id !== null || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.id === undefined || jsonCostOption.id === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                }
                if (jsonCostOption.id || ((jsonCostOption.id === "" || jsonCostOption.id === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.id) ? nl2br(objORP.objViz.prepareString(jsonCostOption.id)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].valid_from !== null && jsonContent[0].valid_from !== undefined) || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>valid_from  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.valid_from === undefined || jsonCostOption.valid_from === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                }
                if (jsonCostOption.valid_from || ((jsonCostOption.valid_from === "") && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.valid_from) ? nl2br(objORP.objViz.prepareString(jsonCostOption.valid_from)) : '') + "</td>";
                }
            } catch (e) {
                if (this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "&nbsp;&nbsp;&nbsp;" + "</td>";
                }
            }
        }
        Dot += "</tr>";
    }

    if ((jsonContent[0].valid_to !== null && jsonContent[0].valid_to !== undefined) || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>valid_to  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.valid_to === undefined || jsonCostOption.valid_to === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                }
                if (jsonCostOption.valid_to || ((jsonCostOption.valid_to === "") && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.valid_to) ? nl2br(objORP.objViz.prepareString(jsonCostOption.valid_to)) : '') + "</td>";
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
                }
                if (jsonCostOption.option || ((jsonCostOption.option === "") && this.showAll)) {
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

    if (jsonContent.amount !== null || this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>amount  </b></td>";
        for (let i = 0; i < jsonLength; i++) {
            try {
                let jsonCostOption = jsonContent[i];
                if ((jsonCostOption.amount === undefined || jsonCostOption.amount === null) && this.showAll) {
                    Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
                }
                if (jsonCostOption.amount || ((jsonCostOption.amount === "" || jsonCostOption.amount === null) && this.showAll)) {
                    Dot += "<td align='left' balign='left' valign='top'>" + ((jsonCostOption.amount) ? nl2br(objORP.objViz.prepareString(jsonCostOption.amount)) : '') + "</td>";
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

    var objORP = this;
    var numCols;
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

    var NodeId = "\"language_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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
            }
            if (jsonFunding.id || (jsonFunding.id === "") && this.showAll) {
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
            }
            if (jsonFunding.source || (jsonFunding.source === "") && this.showAll) {
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
    var numCols;
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

    var NodeId = "\"eligibility_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='3' bgcolor='lightgrey'><b>eligibility</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>eligibility</b></td>";

    Dot += "</tr>";

    for (let i = 0; i < jsonContent.length; i++) {
        var jsonEligibility = jsonContent[i];
        Dot += "<tr>";
        Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonEligibility.id)) + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonEligibility.eligibility)) + "</td>";
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

    var objORP = this;
    var numCols;
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

    var NodeId = "\"review_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    var jsonLength;
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

    Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td>";
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonReview = jsonContent[i];
            if (jsonReview.id === undefined && this.showAll) {
                Dot += "<td  align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.id || (jsonReview.id === "") && this.showAll) {
                Dot += "<td  align='left' balign='left' valign='top'>" + ((jsonReview.id) ? nl2br(objORP.objViz.prepareString(jsonReview.id)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td  align='left' balign='left' valign='top'>" + "" + "</td>";
            }
        }
    }
    Dot += "</tr>";

    Dot += "<tr><td align='left' balign='left' valign='top'><b>title  </b></td>";
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonReview = jsonContent[i];
            if (jsonReview.title === undefined && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.title || (jsonReview.title === "") && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + ((jsonReview.title) ? nl2br(objORP.objViz.prepareString(jsonReview.title)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
            }
        }
    }
    Dot += "</tr>";

    Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td>";
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonReview = jsonContent[i];
            if (jsonReview.description === undefined && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.description || (jsonReview.description === "") && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + ((jsonReview.description) ? nl2br(objORP.objViz.prepareString(jsonReview.description)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
            }
        }
    }
    Dot += "</tr>";

    Dot += "<tr><td align='left' balign='left' valign='top'><b>date  </b></td>";
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonReview = jsonContent[i];
            if (jsonReview.date === undefined && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.date || (jsonReview.date === "") && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + ((jsonReview.date) ? nl2br(objORP.objViz.prepareString(jsonReview.date)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
            }
        }
    }
    Dot += "</tr>";

    Dot += "<tr><td align='left' balign='left' valign='top'><b>score  </b></td>";
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonReview = jsonContent[i];
            if (jsonReview.score === undefined && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.score || (jsonReview.score === "") && this.showAll) {
                Dot += " <td align='left' balign='left' valign='top'>" + ((jsonReview.score) ? nl2br(objORP.objViz.prepareString(jsonReview.score)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
            }
        }
    }
    Dot += "</tr>";

    Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td>";
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonReview = jsonContent[i];
            if (jsonReview.url === undefined && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.url || (jsonReview.url === "")) {
                Dot += " <td align='left' balign='left' valign='top'>" + ((jsonReview.url) ? nl2br(objORP.objViz.prepareString(jsonReview.url)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
            }
        }
    }
    Dot += "</tr>";

    Dot += "<tr><td align='left' balign='left' valign='top'><b>widget  </b></td>";
    for (let i = 0; i < jsonLength; i++) {

        try {
            let jsonReview = jsonContent[i];
            if (jsonReview.widget === undefined && this.showAll) {
                Dot += "<td PORT='" + i + "' align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.widget || (jsonReview.widget === "")) {
                Dot += " <td PORT='" + i + "' align='left' balign='left' valign='top'>" + ((jsonReview.widget) ? nl2br(objORP.objViz.prepareString(jsonReview.widget)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td PORT='" + i + "' align='left' balign='left' valign='top'>" + "" + "</td>";
            }
        }
    }
    Dot += "</tr>";

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    let organizationReviewer = {};

    for (let i = 0; i < jsonLength; i++) {

        try {
            jsonContent[i].hasOwnProperty('organization');
        } catch (e) {
            if (this.showAll) {
                var NodeIdReviewOrg = objORP.DotNodeOrganization([]);
                if (NodeIdReviewOrg) {
                    var DotEdge = NodeId + ":" + i + ' -> ' + NodeIdReviewOrg + '\n';
                    objORP.Dot += DotEdge;
                }
            }
            continue;
        }

        if (jsonContent[i].organization.id in organizationReviewer) {
            var DotEdge = NodeId + ":" + i + ' -> ' + organizationReviewer[jsonContent[i].organization.id] + '\n';
            objORP.Dot += DotEdge;
            continue;
        }

        if (jsonContent[i].hasOwnProperty('organization') || this.showAll) {
            try {
                var NodeIdReviewOrg = objORP.DotNodeOrganization(jsonContent[i].organization);
            } catch (e) {
                var NodeIdReviewOrg = objORP.DotNodeOrganization([]);
            }
            if (NodeIdReviewOrg) {
                if (!(jsonContent[i].organization.id in organizationReviewer)) {
                    organizationReviewer[jsonContent[i].organization.id] = NodeIdReviewOrg;
                }
                var DotEdge = NodeId + ":" + i + ' -> ' + organizationReviewer[jsonContent[i].organization.id] + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }

    return NodeId;

};


/**
 * @return {string}
 */
clsOpenReferralPlus.prototype.DotListAreas = function (jsonContent) {
    var objORP = this;
    var numCols;
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

    var NodeId = "\"service_area" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.indexOf(NodeId) > -1) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var jsonLength;
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

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='3' bgcolor='lightgrey'><b>service_area</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>service_area</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>uri</b></td>";

    Dot += "</tr>";

    for (let i = 0; i < jsonContent.length; i++) {
        var jsonServiceArea = jsonContent[i];
        Dot += "<tr>";
        Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonServiceArea.service_area)) + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonServiceArea.uri)) + "</td>";
        Dot += "</tr>";

    }

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;
};




clsOpenReferralPlus.prototype.DotListTaxonomies = function (jsonContent) {

    var objORP = this;

    NodeId = 'list_taxonomies_' + String(objORP.nextNodeId++);

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='3' bgcolor='lightgrey'><b>service_taxonomy / taxonomy</b></td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>vocabulary</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>name</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>id</b></td>";

    Dot += "</tr>";

    for (let i = 0; i < jsonContent.length; i++) {
        var jsonLinkTaxonomy = jsonContent[i];
        if (jsonLinkTaxonomy.hasOwnProperty('taxonomy')) {
            var jsonTaxonomy = jsonLinkTaxonomy.taxonomy;
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


var clsORP_LoadingImage = function (tagLoading) {

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
        objLoadingImage.spanLoading.innerHTML = '<img src="images/ajax-loader.gif"/>';
    } else {
        if (objLoadingImage.spanLoading !== null) {
            objLoadingImage.spanLoading.parentElement.removeChild(objLoadingImage.spanLoading);
            objLoadingImage.spanLoading = null;
        }
    }

    objLoadingImage.boolOn = boolOn;


};
