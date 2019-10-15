var clsOpenReferralPlus = function () {

    var objORP = this;

    this.idEndpoint = null;
    this.idResource = null;
    this.idParameter = null;
    // this.idVisualize = null;
    // this.idLoading = null;
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
                    $(objORP.objViz.tagElement).append("<button class='btn btn-secondary btn-sm' onclick='getRawJSON(" + jsonContent.id + ")'>Raw JSON</button>");
                    $(objORP.objViz.tagElement).append('<pre>' + nl2br(htmlEntities(JSON.stringify(jsonContent, null, 2))) + '</pre>');
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
        if (jsonContent.service_at_locations.length === 0 && (this.showAll || (jsonContent.holiday_schedules.length !== 0))){
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
        var NodeIdServiceAreas = objORP.DotListAreas(jsonContent.service_areas);
        if (NodeIdServiceAreas) {
            var DotEdge = NodeIdService + ' -> ' + NodeIdServiceAreas + '\n';
            objORP.Dot += DotEdge;
        }
    }

    if (jsonContent.hasOwnProperty('contacts')) {
        if (jsonContent.contacts) {
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

                var DotEdge = NodeIdService + ' -> ' + NodeIdHolidaySchedules + '\n';
                objORP.Dot += DotEdge;


                var DotEdge = NodeIdServiceAtLocation + ' -> ' + NodeIdHolidaySchedules + '\n';
                objORP.Dot += DotEdge;


            }
        }
    }

    if (jsonContent.hasOwnProperty('languages') || this.showAll) {
        if (jsonContent.languages || this.showAll) {
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
    if (objORP.dotNodes.includes(NodeId)) {
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

    var idOrganization = null;
    if (jsonContent.hasOwnProperty('id')) {
        idOrganization = jsonContent.id;
    }

    if (!idOrganization) {
        return false;
    }

    var NodeId = "\"organization_" + idOrganization + "\"";
    if (objORP.dotNodes.includes(NodeId)) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>organization</b></td></tr>";
    Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + idOrganization + "</td></tr>";

    if (jsonContent.hasOwnProperty('name')) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.name)) + "</td></tr>";
    } else if (this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
    }

    if (jsonContent.hasOwnProperty('description')) {
        if (jsonContent.description) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.description)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    } else if (this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
    }

    if (jsonContent.hasOwnProperty('url')) {
        if (jsonContent.url) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.url)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    } else if (this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>url  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
    }

    if (jsonContent.hasOwnProperty('logo')) {
        if (jsonContent.logo) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.logo)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    } else if (this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>logo  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
    }

    if (jsonContent.hasOwnProperty('uri')) {
        if (jsonContent.uri) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>uri  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.uri)) + "</td></tr>";
        } else if (this.showAll) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>uri  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
        }
    } else if (this.showAll) {
        Dot += "<tr><td align='left' balign='left' valign='top'><b>uri  </b></td><td align='left' balign='left' valign='top'>" + '' + "</td></tr>";
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
    if (objORP.dotNodes.includes(NodeId)) {
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
    if (objORP.dotNodes.includes(NodeId)) {
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
        if (jsonContent.location) {
            var NodeIdLocation = objORP.DotNodeLocation(jsonContent.location);
            if (NodeIdLocation) {
                var DotEdge = NodeId + ' -> ' + NodeIdLocation + '\n';
                objORP.Dot += DotEdge;
            }
        }
    }

    if (jsonContent.hasOwnProperty('regular_schedule')) {
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

    var idLocation = null;
    if (jsonContent.hasOwnProperty('id')) {
        idLocation = jsonContent.id;
    }

    if (!idLocation) {
        idLocation = objORP.nextNodeId++;
    }

    var NodeId = "\"location_" + idLocation + "\"";
    if (objORP.dotNodes.includes(NodeId)) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='2' bgcolor='lightgrey'><b>location</b></td></tr>";

    if (jsonContent.hasOwnProperty('id')) {
        if (jsonContent.id) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + jsonContent.id + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('name')) {
        if (jsonContent.name) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>name  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.name)) + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('description')) {
        if (jsonContent.description) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>description  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.description)) + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('latitude')) {
        if (jsonContent.latitude) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>latitude  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.latitude)) + "</td></tr>";
        }
    }

    if (jsonContent.hasOwnProperty('longitude')) {
        if (jsonContent.longitude) {
            Dot += "<tr><td align='left' balign='left' valign='top'><b>longitude  </b></td><td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonContent.longitude)) + "</td></tr>";
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
    if (objORP.dotNodes.includes(NodeId)) {
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

    let numCols = jsonContent.length;
    if (!numCols) {
        return false;
    }

    var NodeId = "\"schedule_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.includes(NodeId)) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>regular_schedule</b>  </td></tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + jsonSchedule.id + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>description  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.description) ? nl2br(objORP.objViz.prepareString(jsonSchedule.description)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>dtstart  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.dtstart) ? nl2br(objORP.objViz.prepareString(jsonSchedule.dtstart)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>freq  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.freq) ? nl2br(objORP.objViz.prepareString(jsonSchedule.freq)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>interval  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.interval) ? nl2br(objORP.objViz.prepareString(jsonSchedule.interval)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>byday  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.byday) ? nl2br(objORP.objViz.prepareString(jsonSchedule.byday)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>bymonthday  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.bymonthday) ? nl2br(objORP.objViz.prepareString(jsonSchedule.bymonthday)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>opensAt  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.opensAt) ? nl2br(objORP.objViz.prepareString(jsonSchedule.opensAt)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>closesAt  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.closesAt) ? nl2br(objORP.objViz.prepareString(jsonSchedule.closesAt)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>validFrom  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.validFrom) ? nl2br(objORP.objViz.prepareString(jsonSchedule.validFrom)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>validTo  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonSchedule = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonSchedule.validTo) ? nl2br(objORP.objViz.prepareString(jsonSchedule.validTo)) : '') + "</td>";
    }
    Dot += "</tr>";

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
    if (objORP.dotNodes.includes(NodeId)) {
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
            if (jsonHolidaySchedule.opensAt === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>opensAt  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.opensAt || (jsonHolidaySchedule.opensAt === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>opensAt  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.opensAt) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.opensAt)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>opensAt  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonHolidaySchedule = jsonContent[i];
            if (jsonHolidaySchedule.closesAt === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closesAt  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
            }
            if (jsonHolidaySchedule.closesAt || (jsonHolidaySchedule.closesAt === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closesAt  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonHolidaySchedule.closesAt) ? nl2br(objORP.objViz.prepareString(jsonHolidaySchedule.closesAt)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>closesAt  </b></td><td align='left' balign='left' valign='top'>" + " " + "</td></tr>";
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
    if (objORP.dotNodes.includes(NodeId)) {
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

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>language</b>  </td></tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id  </b></td>";

    for (let i = 0; i < jsonLength; i++) {
        try {
            var jsonLanguage = jsonContent[i];
            Dot += "<td align='left' balign='left' valign='top'>" + jsonLanguage.id + "</td>";
        } catch (e) {
            Dot += "<td align='left' balign='left' valign='top'>" + "  " + "</td>";
        }
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>language  </b></td>";
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonLanguage = jsonContent[i];
            Dot += "<td align='left' balign='left' valign='top'>" + ((jsonLanguage.language) ? nl2br(objORP.objViz.prepareString(jsonLanguage.language)) : '') + "</td>";
        } catch (e) {
            Dot += "<td align='left' balign='left' valign='top'>" + "  " + "</td>";
        }
    }
    Dot += "</tr>";


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

    let numCols = jsonContent.length;
    if (!numCols) {
        return false;
    }

    var NodeId = "\"contact_" + objORP.nextNodeId++ + "\"";
    if (objORP.dotNodes.includes(NodeId)) {
        return NodeId;
    }

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>contact</b>  </td></tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>id  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        var jsonContact = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + jsonContact.id + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>name  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        let jsonContact = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonContact.name) ? nl2br(objORP.objViz.prepareString(jsonContact.name)) : '') + "</td>";
    }
    Dot += "</tr>";

    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>title  </b></td>";
    for (let i = 0; i < jsonContent.length; i++) {
        let jsonContact = jsonContent[i];
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonContact.title) ? nl2br(objORP.objViz.prepareString(jsonContact.title)) : '') + "</td>";
    }
    Dot += "</tr>";

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
    if (objORP.dotNodes.includes(NodeId)) {
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
    if (objORP.dotNodes.includes(NodeId)) {
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

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>cost_option</b>  </td></tr>";


    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonCostOption = jsonContent[i];
            if (jsonCostOption.id === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            }
            if (jsonCostOption.id) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonCostOption.id) ? nl2br(objORP.objViz.prepareString(jsonCostOption.id)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonCostOption = jsonContent[i];
            if (jsonCostOption.validFrom === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>validFrom  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            }
            if (jsonCostOption.validFrom) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>validFrom  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonCostOption.validFrom) ? nl2br(objORP.objViz.prepareString(jsonCostOption.validFrom)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>validFrom  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonCostOption = jsonContent[i];
            if (jsonCostOption.validTo === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>validTo  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            }
            if (jsonCostOption.validTo) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>validTo  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonCostOption.validTo) ? nl2br(objORP.objViz.prepareString(jsonCostOption.validTo)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>validTo  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonCostOption = jsonContent[i];
            if (jsonCostOption.option === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>option  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            }
            if (jsonCostOption.option || (jsonCostOption.option === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>option  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonCostOption.option) ? nl2br(objORP.objViz.prepareString(jsonCostOption.option)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>option  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
            }
        }
    }

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonCostOption = jsonContent[i];
            if (jsonCostOption.amount === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>amount  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            }
            if (jsonCostOption.amount) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>amount  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonCostOption.amount) ? nl2br(objORP.objViz.prepareString(jsonCostOption.amount)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>amount  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
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
    if (objORP.dotNodes.includes(NodeId)) {
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
    if (objORP.dotNodes.includes(NodeId)) {
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

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='" + (numCols + 1) + "' bgcolor='lightgrey'><b>eligibility</b>  </td></tr>";

    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonEligibility = jsonContent[i];
            if (jsonEligibility.id === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            }
            if (jsonEligibility.id || (jsonEligibility.id === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonEligibility.id) ? nl2br(objORP.objViz.prepareString(jsonEligibility.id)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>id  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
            }
        }
    }
    for (let i = 0; i < jsonLength; i++) {
        try {
            let jsonEligibility = jsonContent[i];
            if (jsonEligibility.eligibility === undefined && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>eligibility  </b></td><td align='left' balign='left' valign='top'>" + "    " + "</td></tr>";
            }
            if (jsonEligibility.eligibility || (jsonEligibility.eligibility === "") && this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>eligibility  </b></td> <td align='left' balign='left' valign='top'>" + ((jsonEligibility.eligibility) ? nl2br(objORP.objViz.prepareString(jsonEligibility.eligibility)) : '') + "</td></tr>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<tr><td align='left' balign='left' valign='top'><b>eligibility  </b></td><td align='left' balign='left' valign='top'>" + "" + "</td></tr>";
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
    if (objORP.dotNodes.includes(NodeId)) {
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
                Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.id || (jsonReview.id === "") && this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + ((jsonReview.id) ? nl2br(objORP.objViz.prepareString(jsonReview.id)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
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
                Dot += "<td align='left' balign='left' valign='top'>" + "    " + "</td>";
            }
            if (jsonReview.widget || (jsonReview.widget === "")) {
                Dot += " <td align='left' balign='left' valign='top'>" + ((jsonReview.widget) ? nl2br(objORP.objViz.prepareString(jsonReview.widget)) : '') + "</td>";
            }
        } catch (e) {
            if (this.showAll) {
                Dot += "<td align='left' balign='left' valign='top'>" + "" + "</td>";
            }
        }
    }
    Dot += "</tr>";

    Dot += "</table>>";
//	Dot += ", URL='' ";
    Dot += "]; \n";

    objORP.Dot += Dot;

    return NodeId;

};


clsOpenReferralPlus.prototype.DotListAreas = function (jsonContent) {

    var objORP = this;

    NodeId = 'list_areas_' + String(objORP.nextNodeId++);

    objORP.dotNodes.push(NodeId);

    var Dot = '\n';

    Dot += NodeId + " [  shape=plaintext,  label=<<table border='0' cellborder='1' cellspacing='0'><tr><td colspan='3' bgcolor='lightgrey'><b>service_area</b>  </td></tr>";
    Dot += "<tr>";
    Dot += "<td align='left' balign='left' valign='top'><b>service_area</b></td>";
    Dot += "<td align='left' balign='left' valign='top'><b>uri  </b></td>";

    Dot += "</tr>";

    for (let i = 0; i < jsonContent.length; i++) {
        var jsonArea = jsonContent[i];
        Dot += "<tr>";
        Dot += "<td align='left' balign='left' valign='top'>" + nl2br(objORP.objViz.prepareString(jsonArea.service_area)) + "</td>";
        Dot += "<td align='left' balign='left' valign='top'>" + ((jsonArea.uri) ? nl2br(objORP.objViz.prepareString(jsonArea.uri)) : '') + "</td>";
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
