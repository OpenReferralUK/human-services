 var AjaxRequests = Array();

function loadXMLDoc(filename, force){

	force = (force === undefined) ? false : force;

	if (force === true){
		var rand = parseInt(Math.random()*999999999999999);
		if (filename.indexOf('?') > -1){
			filename = filename + "&rand=" + rand;			
		}
		else
		{
			filename = filename + "?rand=" + rand;			
		}
	}
	
	
	if (window.ActiveXObject !== undefined) {
		xhttp = new ActiveXObject("Msxml2.XMLHTTP");

		xhttp.open("GET", filename, false);
		
		try {xhttp.responseType = "msxml-document"} catch(err) {} // Helping IE11
		
		xhttp.send();
		
//		if (!xhttp.responseXML.xml){
			
			xmldom = new ActiveXObject("Msxml2.DomDocument.6.0");
			xmldom.loadXML(xhttp.responseText);
			
			return xmldom;
//		}
		
//		return xhttp.responseXML;
	
	}
	else {
		xhttp = new XMLHttpRequest();
		
		xhttp.open("GET", filename, false);
		
		xhttp.send("");

		return xhttp.responseXML;
		
	}
		
	return ;
}


function makeXsltProc(xslDoc){
	
	if (window.ActiveXObject !== undefined) {
		var xslt = new ActiveXObject("Msxml2.XSLTemplate.6.0");
		var xslProc;

		xslt.stylesheet = xslDoc;
	    xslproc = xslt.createProcessor();
		return xslProc;

	}
	else {
		xslProc=new XSLTProcessor();
		xslProc.importStylesheet(xslDoc);
		return xslProc;
	}
		
	return;
}

function setXslParam(xslProc,Name,Value){

	if (window.ActiveXObject !== undefined) {
		xslProc.addParameter(Name, Value);
	}
	else
	{
		xslProc.setParameter(null,Name,Value);
	}
		
}


function transformXml(xslProc, xmlDoc){

	if (window.ActiveXObject !== undefined) {
		  xslProc.input = xmlDoc;
	      xslProc.transform();
	      return xslProc.output;		
	}
	else
	{
		  result = xslProc.transformToFragment(xmlDoc,document);
		  return XmlToString(result);

	}
		
}





function getRequest(){
	
    var req = false;

    try {
        req = new XMLHttpRequest();
    }
    catch(err) {	
    	try {
            req = new ActiveXObject("Msxml2.XMLHTTP");
    	}
    	catch (err) {
    		try {
    			req = new ActiveXObject("Microsoft.XMLHTTP");
    		}
    		catch (err) {
    			req = false;
    		}
    	}
    }
    	
	return req;
}


function xsltTransform(xml,xslt,ParamArray){

	var proc;
	var result;
	if (window.ActiveXObject !== undefined) {
		
		 proc = new ActiveXObject("Msxml2.DOMDocument.6.0");
		 proc.loadXML(xml.xml);

	 //-----
	 
		 var template = new ActiveXObject("Msxml2.XSLTemplate.6.0");
		 var xsldoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument.6.0");

		 xsldoc.documentElement = xsldoc.importNode(xslt.documentElement,true);
	 
		 template.stylesheet = xsldoc;
		 var xslproc = template.createProcessor();
		 xslproc.input = proc;

		 for(var ParamName in ParamArray)
		 {
			 xslproc.addParameter(ParamName, ParamArray[ParamName]);
		 }

		 

		 
		 xslproc.transform();
//       WScript.Echo(xslproc.output);

		 return xslproc.output;
	 
	 
	 //-----
	 
	 result = proc.transformNode(xslt);	
	 
	 return result;

	} else {
	 proc = new XSLTProcessor();

	 proc.importStylesheet(xslt);	 
	 for(var ParamName in ParamArray)
	 {
		 proc.setParameter('', ParamName, ParamArray[ParamName]);
	 }

//	 result = proc.transformToXML(xml);
//	 return result;
	 	 
	 result = proc.transformToFragment(xml, document);	 
	 return XmlToString(result);

	}
	
	return;
	
}




function setTBodyInnerHTML(tbody, html) {
	var temp = tbody.ownerDocument.createElement('div');
	temp.innerHTML = '<table>' + html + '</table>';

	tbody.parentNode.replaceChild(temp.firstChild.firstChild, tbody);
}

function XmlToString(xml){
	var xmlstr = xml.xml ? xml.xml : (new XMLSerializer()).serializeToString(xml);
	
	return xmlstr;
	
}


function makeDom(){
	
	if (window.ActiveXObject !== undefined) {
		var xmlDom = new ActiveXObject("Msxml2.DomDocument.6.0");
		return xmlDom;
	}
	else
	{
		var xmlDom = document.implementation.createDocument("", "", null);
		return xmlDom;		
	}

	return ;
}









// --------


var pdXpathNodeList = function (Dom,Query, ContextNode, nsArray){

	nsArray = (nsArray === undefined) ? {} : nsArray;

	
	this.nodeList = false;
	this.index = -1;
	this.NumberOfRows = 0;
	
	if (window.ActiveXObject !== undefined) {
		Dom.setProperty("SelectionLanguage", "XPath");

		var ns = '';
		

//		if (nsArray.length > 0){
			for(var Prefix in nsArray) {
				ns += "xmlns:"+Prefix + "='" + nsArray[Prefix] + "' ";
			}
//		}
//		else
//		{
//			for (index = 0; index < Dom.documentElement.attributes.length; ++index) {
//				var att = Dom.documentElement.attributes[index];
//				var attName = att.nodeName;
//			    if (attName.slice(0, 6) == 'xmlns:'){
//			    	var prefix = attName.slice(6);
//			    	ns += attName + "='" + att.nodeValue + "' ";
//			    }
//			}
			
//		}

		
		Dom.setProperty("SelectionNamespaces",ns);
		
		this.nodeList = ContextNode.selectNodes(Query);
		this.NumberOfRows = this.nodeList.length;
		
	}
	else
	{
//		var nsResolver = document.createNSResolver( Dom.documentElement );
		
		
		var nsResolver = function (prefix) {
			return nsArray[prefix] || null;
		};
//		this.nodeList = Dom.evaluate(Query, ContextNode, nsResolver, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
		this.nodeList = Dom.evaluate(Query, ContextNode, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		this.NumberOfRows = this.nodeList.snapshotLength;
	}
	
};


pdXpathNodeList.prototype.iterateNext = function(){
	
	var xmlNode;

	this.index++
	
	if (window.ActiveXObject !== undefined) {
		xmlNode = this.nodeList.item(this.index);
	}
	else
	{
//		xmlNode = this.nodeList.iterateNext();
		xmlNode = this.nodeList.snapshotItem(this.index);
	}
	
	return xmlNode;
	
};



var pdDom = function (){
	
	this.Dom = false;
	
	if (window.ActiveXObject !== undefined) {
		this.Dom = new ActiveXObject("Msxml2.DomDocument.6.0");
	}
	else
	{
		this.Dom = document.implementation.createDocument("", "", null);
	}
	
};


pdDom.prototype.loadXML = function(xmlString){

	if (window.ActiveXObject !== undefined) {
		this.Dom.loadXML(xmlString);
	}
	else
	{
		this.Dom = new DOMParser().parseFromString(xmlString,'text/xml');
	}
	
};

pdDom.prototype.createElementNS = function(ns,TagName){

	var xmlElement = false;
	
	if (window.ActiveXObject !== undefined) {
		xmlElement = this.Dom.createNode(1,TagName,ns);
	}
	else
	{
		xmlElement = this.Dom.createElementNS(ns,TagName);
	}
	
	return xmlElement;
	
};




function pdXmlElementValue(xmlElement){
	if (xmlElement){
		return xmlElement.textContent || xmlElement.nodeTypedValue;
	}
	else
	{
		return null;
	}
}


function pdXmlSetElementValue(xmlElement,Value){

	if (window.ActiveXObject !== undefined) {
		xmlElement.nodeTypedValue = Value;
	}
	else
	{
		xmlElement.textContent = Value;
	}
	return;

}

function pdCleanStringForXpath(str)  {
	
	if (str === null){
		return "''";
	}
	
    var parts = str.match(/[^'"]+|['"]/g);
    parts = parts.map(function(part){
        if (part === "'")  {
            return '"\'"'; // output "'"
        }

        if (part === '"') {
            return "'\"'"; // output '"'
        }
        return "'" + part + "'";
    });
    return "concat(" + parts.join(",") + ",'')";
}
