var main  = {};



function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};


GHVHS = {
  Elements: {},
  Classes: {}
};

GHVHS.DOM = {
  IntranetMsg:"Welcome To The Intranet",
  TotalNavs:[],
  ajaxReq: function (){
    var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] // activeX versions to check for in IE
    if (window.ActiveXObject){ // Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
      for (var i=0; i<activexmodes.length; i++){
        try{
          return new ActiveXObject(activexmodes[i])
        }
        catch(e){}
      }
    }
    else if (window.XMLHttpRequest) // if Mozilla, Safari etc
      return new XMLHttpRequest();
    else
      return false;
  },

  create: function(p){
    var dom = (p.Parent && p.Parent.document) ? p.Parent.document : (p.Window && p.Window.document) ? p.Window.document : document;

    if (!dom.createElement)
      return null;

    var element = dom.createElement(p.Type || "div")

    if (p.Class)
      element.className = p.Class;

    if (p.Id)
      element.id = p.Id;

    if (p.Content) {
      if (typeof p.Content == "string"){
        if (p.Content.search(/<|&/ig) == -1) {
          if (typeof element.textContent != "undefined")
            element.textContent = p.Content;
          else
            element.innerText = p.Content;
        }
      } else {
        element.appendChild(p.Content);
      }
    }
    if (p.Src)
      element.setAttribute("src",  p.Src);

    switch (p.Type) {
      case "input":
        if (p.InputType)
          element.setAttribute("type", p.InputType);
        else
          element.setAttribute("type", "Text");
        if (p.Value)
          element.value = p.Value;
        if (p.Id)
          element.name = p.Id;
        break;
      case "a":
        if (p.Href)
          element.href = p.Href;
        else
          element.href = "javascript: void(0);";
        break;
      case "script":
        var firstElm = dom.documentElement.firstChild;
        for (var i = 0; i < firstElm.childNodes.length; i++) {
          if (firstElm.childNodes[i].src == p.Src) return firstElm.childNodes[i];
        }
        element.setAttribute("type", "text/javascript");
        firstElm.appendChild(element);
        break;
      // stylesheet
      case "link":
        if (p.Href)
          element.href = p.Href;
        else
          return;

        element.setAttribute("type", "text/css");
        element.setAttribute("rel", "stylesheet");

        var firstElm = dom.documentElement.firstChild;
        for (var i = 0; i < firstElm.childNodes.length; i++) {
          if (firstElm.childNodes[i].href == element.href) return firstElm.childNodes[i];
        }
        firstElm.appendChild(element);
        break;
      default:
        break;
    }

    if (p.Style)
      element.setAttribute("style", p.Style);

    if (p.Parent)
      p.Parent.appendChild(element);

    if (p.Title)
      element.setAttribute("title", p.Title);

    return element;
  },

  send: function(p){
    var ajax = new GHVHS.DOM.ajaxReq();

    ajax.onreadystatechange = function(){
      if (ajax.readyState==4){
        if (ajax.status==200 || window.location.href.indexOf("http")==-1){
          var jsondata=eval("("+ajax.responseText+")");
          if (p.Callback){
            if (p.CallbackBindTo){
              return p.Callback.call(p.CallbackBindTo, jsondata, p.CallbackParams || { });
            } else {
              return p.Callback(jsondata, p.CallbackParams || { });
            }
          }
        }
      }
    }
    ajax.open(p.Method || "GET", p.URL, true);
    if (p.ContentType) {
      ajax.setRequestHeader('Content-Type', p.ContentType);
    }
    if (p.SharePoint){
        ajax.setRequestHeader( 'accept', 'application/json;odata=verbose');
    }
    if (p.Test){
        ajax.responseType = 'arraybuffer';
        ajax.onload = function (e) {
            var tiff = new Tiff({ buffer: e.response });
            var canvas = tiff.toCanvas();
            document.body.append(canvas);
        };
    }
    ajax.send(p.PostData ? p.PostData : null);
  },

  CreateDropDown: function (Array){
    var DropdownHeight = Array.Height;
    var dropDownId = "";
    if (!DropdownHeight) {
      if (Array.todraw) {
        if (Array.todraw != "input") {
          DropdownHeight = "400px";
        }else {
          DropdownHeight = "200px";
        }
      }else {
        DropdownHeight = "200px";
      }
    }
    var getElem = document.getElementById(Array.Element);
    for (var i = 0; i < 1000; i++) {
      if (!Array.dropDownId) {
        if (!document.getElementById("DropDown"+i)) {
          Array.dropDownId = "DropDown"+i;
          if (Array.todraw) {
            if (Array.todraw != "input") {
              getElem.id = Array.todraw+"||"+i;
            }else {
              getElem.id = "input||"+i;
            }
          }else {
            getElem.id = "input||"+i;
          }

        }
      }
    }
    if (Array.placeholder) {
        getElem.setAttribute("placeholder", Array.placeholder);
    }
    if (getElem.id == "div||1") {

        getElem.style.paddingLeft = "2%";
    }
    var getDrop = Array.dropDownId;

    var DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown hide", "Id": getDrop, "Parent": getElem.parentElement });
    var test = "N";
    if (getElem.id == "input||8" && window.location.href.indexOf("PnP") < 0) {
        test = "Y";
    }
    if (getElem.id == "div||0" || test == "Y") {
      var setTime  = setTimeout(function(){
        DropDown.style.position = "absolute";
        DropDown.style.top = (getElem.offsetHeight + getElem.offsetTop)+"px";
        DropDown.style.width = getElem.offsetWidth +  "px";
        DropDown.style.left = getElem.offsetLeft +  "px";
        DropDown.style.backgroundColor = "white";
        DropDown.style.boxShadow = "0.5px 0.5px 3px grey";
        DropDown.style.transition = "height 0.3s ease-out";
        DropDown.style.overflow  = "auto";
        DropDown.style.borderRadius = "5px";
        DropDown.style.height = "1px";

      },100);
    } else {
      DropDown.style.position = "absolute";
      DropDown.style.top = (getElem.offsetHeight + getElem.offsetTop - 1)+"px";
      if (getElem.className == "NavItem") {
        if (document.getElementById("canvas").offsetWidth < 1800) {
            getElem.style.backgroundPosition = "99% 50%";
        }
        var dropContainer = GHVHS.DOM.create({ "Type": "div", "Class": "dropContainer", "Id": "dropContainer", "Parent": DropDown });
        DropDown.style.width = (document.getElementById('canvas').offsetWidth ) +  "px";
        DropDown.style.zIndex = "2000000000000";
        DropDown.style.left = (0) +  "px";
        DropDown.style.backgroundColor = "white";
        var singletemp = GHVHS.DOM.create({ "Type": "div", "Style": "width:10%;", "Class": "singleColoum", "Parent": dropContainer });
        var singleColoum1 = GHVHS.DOM.create({ "Type": "div", "Class": "singleColoum", "Parent": dropContainer });
        var singleColoum2 = GHVHS.DOM.create({ "Type": "div", "Style": "margin-left:-5%;", "Class": "singleColoum", "Parent": dropContainer });
        var singleColoum3 = GHVHS.DOM.create({ "Type": "div", "Class": "singleColoum", "Style": "margin-left:-5%;", "Parent": dropContainer });
      }else {
        DropDown.style.width = (getElem.offsetWidth -2) + "px";
        DropDown.style.zIndex = "2000000";
        DropDown.style.left = getElem.offsetLeft +  "px";
        DropDown.style.backgroundColor = "white";
        DropDown.style.boxShadow = "0.5px 0.5px 3px grey";
        DropDown.style.borderRadius = "5px";
      }

      DropDown.style.transition = "height 0.3s ease-out";
      DropDown.style.overflow  = "auto";

      DropDown.style.height = "1px";
    }
    if (Array.Options) {
      for (var i = 0; i < Array.Options.length; i++) {
        var toDraw = "";
        if (Array.todraw) {
              toDraw = Array.todraw;
            }else {
              toDraw = "input";
            }

        if (toDraw != "input") {
            if (Array.Options[i]["Name"] != "" || Array.Options[i]["Name"] != " ") {
            var NameToUse = Array.Options[i]["Name"] + "";
            var toUse = NameToUse.replace("&nbsp;", "");

            var debug = i %3;
            if (Array.Options.length < 8) {
                var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "DropNav", "Id": Array.Options[i]["Name"], "Href": Array.Options[i]["Link"], "Parent": singleColoum2 });
                singleColoum2.style.width = "45%";
                singleColoum3.style.width = "25%";
                singleColoum1.style.width = "23%";

            } else if (i < 8) {
                var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "DropNav", "Id": Array.Options[i]["Name"], "Href": Array.Options[i]["Link"], "Parent": singleColoum1 });
            } else if (i < 17 && i > 7) {
                var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "DropNav", "Id": Array.Options[i]["Name"], "Href": Array.Options[i]["Link"], "Parent": singleColoum2 });
            } else if ( i > 17) {
                var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "DropNav", "Id": Array.Options[i]["Name"], "Href": Array.Options[i]["Link"], "Parent": singleColoum3 });
            } else if (DropDown.id == "DropDown0") {
              SingleOption.style.width = "100%";
            } else {
                var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "DropNav", "Id": Array.Options[i]["Name"], "Href": Array.Options[i]["Link"], "Parent": singleColoum1 });
            }
            if (document.getElementById("canvas").offsetWidth < 1200) {
                SingleOption.style.fontSize = "14px";

            }

            SingleOption.innerHTML = decodeURI(toUse);
            SingleOption.style.display = "block";
            SingleOption.onclick = function(){
              var clicked = this.parentElement.id.split("Down");
              var getInput = document.getElementById("input||"+clicked[1]);
              var drop = this.parentElement.parentElement.parentElement;
              drop.style.height = "1px";
              var setTimeOut = setTimeout(function(){
                drop.className = "DropDown hide"
              },300);

          }

          }
        }else {

            if (Array.Options[i]["Label"]) {
                var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption",  "Parent": DropDown });
                SingleOption.innerHTML = Array.Options[i]["Label"];
                SingleOption.innerHTML = Array.Options[i]["Label"];
            } else {
                var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Id": Array.Options[i], "Content": Array.Options[i], "Parent": DropDown });
            }
            if (Array.fontSize) {
                SingleOption.style.fontSize = Array.fontSize + "px";
            }
            if (Array.NoClear) {
                SingleOption.onclick = function () {
                    var clicked = this.parentElement.id.split("Down");
                    var getInput = document.getElementById("input||" + clicked[1]);
                    getInput.value = this.id;


                    var drop = this.parentElement;
                    drop.style.height = "1px";
                    var setTimeOut = setTimeout(function () {
                        drop.className = "DropDown hide"
                    }, 300);
                }
            } else {
                SingleOption.onclick = function () {
                    var clicked = this.parentElement.id.split("Down");
                    var getInput = document.getElementById("input||" + clicked[1]);
                    getInput.value = this.id;
                    if (!document.getElementById("Clearbutton||" + clicked[1])) {
                        var clearButton = GHVHS.DOM.create({ "Type": "div", "Class": "Clearbutton", "Id": "Clearbutton||" + clicked[1], "Content": "Clear", "Parent": getInput.parentElement });
                        var getInput2 = document.getElementById("input||" + (Number(clicked[1]) + 1));

                        clearButton.style.width = "1px";
                        clearButton.style.transition = "width 0.3s ease-out";
                        clearButton.style.position = "absolute";
                        clearButton.style.height = (getInput.offsetHeight) + "px";
                        clearButton.style.left = (getInput.offsetLeft + getInput.offsetWidth) + "px";
                        clearButton.style.top = (getInput.offsetTop) + "px";
                        clearButton.style.width = "40px";
                        clearButton.onmouseover = function () {
                            var clicked = this.id.split("||");
                            var getInput = document.getElementById("input||" + clicked[1]);
                            getInput.style.border = "1px solid blue";
                            getInput.style.backgroundImage = "URL(/img/x.png)";

                        }
                        clearButton.onmouseout = function () {
                            var clicked = this.id.split("||");
                            var getInput = document.getElementById("input||" + clicked[1]);
                            getInput.style.border = "1px solid silver";
                            getInput.style.backgroundImage = "URL(/img/index.png)";

                        }
                        clearButton.onclick = function () {
                            var clicked = this.id.split("||");
                            var getInput = document.getElementById("input||" + clicked[1]);
                            getInput.value = "";
                            getInput.style.border = "1px solid silver";
                            getInput.style.backgroundImage = "URL(/img/index.png)";
                            this.style.width = "1px";
                            var that = this;
                            var deleted = setTimeout(function () {

                                getInput.parentElement.removeChild(that);
                            }, 100);
                        }
                    }

                    var drop = this.parentElement;
                    drop.style.height = "1px";
                    var setTimeOut = setTimeout(function () {
                        drop.className = "DropDown hide"
                    }, 300);
                }
            }
        }
      }
    }

    getElem.onclick = function(getDrop){
      if (this.id == "div||1") {


        window.location.href = "/Home/MyAppications";

		//window.location.href = "http://ghinfo/secure2/UserID/myapplications.aspx";

1      } else if (this.id == "div||0") {
        var linktoIframe = "/Search/search.asp";
        GHVHS.DOM.drawslideUpIframe(linktoIframe);
        document.getElementById('IFrame').style.backgroundColor = "white";
      }else {
        var clicked = this.id.split("||");
        var that = this;
        var getDropDown = document.getElementById("DropDown" + clicked[1]);
        var thisName = this.innerText;
        if (getDropDown.className.indexOf(" hide") > 0) {
          getDropDown.className = "DropDown";

          var setTimeOut = setTimeout(function(){
            if (that.className == "NavItem") {
              var AllVanItems = document.getElementById('canvas').querySelectorAll(".NavItem");
              for (var i = 0; i < AllVanItems.length; i++) {

                      if (AllVanItems[i].style.backgroundColor == "rgb(92, 10, 58)") {
                          if (AllVanItems[i].id != "div||1") {
                              AllVanItems[i].click();
                          } else {
                              AllVanItems[i].style.backgroundColor = "white";
                              AllVanItems[i].style.color = "rgb(92, 10, 58)";
                          }
                      }

              }
              that.style.backgroundColor = "rgb(92, 10, 58)";
              that.style.color = "white";
              that.style.backgroundImage = "URL(/img/downWhite.png)";
              getDropDown.style.zindex = "200";
            }
            if (thisName == "Quick Links") {
                getDropDown.style.height = "350px";
                getDropDown.style.maxHeight = "350px";
            } else {
                getDropDown.style.height = "320px";
            }
            getDropDown.style.top = (that.offsetHeight + that.offsetTop - 1) + "px";
          },10);
        }else {
          getDropDown.style.height = "1px";
          var setTimeOut = setTimeout(function(){
            getDropDown.className = "DropDown hide"
            if (that.className == "NavItem") {
                that.style.backgroundColor = " white";
                that.style.color = "rgb(92, 10, 58)";
                if (document.getElementById("canvas").offsetWidth > 1400) {
                    that.style.backgroundImage = "URL(/img/blackDrop.png)";
                    getDropDown.style.zindex = "0";
                }
            }
          },300);
        }

      }
    };
  },
  drawMulptieDropDowns:function(p,q) {
    for (var i = 0; i < p.length; i++) {
      var todraw = "input";
      var options = [];
      var clasToUse = "text";
      if (p[i].Elements) {

        todraw = p[i].Elements;
      }else {
        todraw == "input";
      }
      if (p[i].ElementClass) {
        clasToUse = p[i].ElementClass;
      }
      var input  = GHVHS.DOM.create({"Type":todraw,"Class":clasToUse, "Id":"input", "Parent":document.getElementById(p[i].parentID)});
      if (p[i].Content) {
        input.innerHTML = p[i].Content;
      }
      if (p[i].data) {
        options = p[i].data;

      }else {
        options =  ["Test1","Test2","Test3","Test4","Test5"];
      }
      GHVHS.DOM.CreateDropDown({"Element":input.id,"dropDownId":"", "Options":options,"todraw":todraw});
      if (q) {
        if (input.innerHTML != "My Applications") {
          input.onmouseover = function(){
            var clicked = this.id.split("||");
            var getDropDown =  document.getElementById("DropDown"+clicked[1]);
            if (getDropDown.className == "DropDown hide") {
              this.click();
            }
          };

        }else {
            input.style.backgroundImage = "url()";
            input.onmouseover = function () {
                var clicked = this.id.split("||");
                var allNavItems = this.parentElement.querySelectorAll(".NavItem");
                for (var i = 0; i < allNavItems.length; i++) {
                    if (this.id != allNavItems[i].id) {
                        if (allNavItems[i].style.backgroundColor == "rgb(92, 10, 58)") {
                            allNavItems[i].click();
                        }
                    }
                }
                this.style.backgroundColor = "rgb(92, 10, 58)";
                this.style.color = "white";
            };
        }
      }
    }
  },
  drawDropDowns:function(p){
      for (var i = 0; i < p.amount; i++) {
          options =  ["Test1","Test2","Test3","Test4","Test5"];
          var input  = GHVHS.DOM.create({"Type":"input","Class":"text", "Id":"input", "Parent":document.getElementById(p.parentID)});
          GHVHS.DOM.CreateDropDown({"Element":input.id,"dropDownId":"", "Options":options});
      }
  },
  DrawFooter: function () {

      var masterElem = GHVHS.DOM.create({ "Type": "div", "Class": "footer", "Id": "Footer", "Parent": document.getElementById("MainContent") });
      if (document.getElementById("canvas").offsetHeight < 800) {
          masterElem.style.marginTop = "8.5%";
      }
      var getURl = window.location.href.toLowerCase();
      if (getURl.indexOf("/pnp/") >= 0){
          masterElem.style.display = "none";
      }
      var Department = [
               { "Link": "/Files/BioMedical/", "Name": "Biomedical Engineering" },
              { "Link": "/Files/AuditCompliance/", "Name": "Compliance, Audit &amp; HIPAA Privacy" },
              { "Link": "/Files/CME/", "Name": "Continuing Medical Education" },
              { "Link": "/Files/EmergencyManagement/", "Name": "Emergency Management" },
              { "Link": "/Files/Foundation/", "Name": "Foundation" }, { "Link": "/Files/MedicalStaff/Graduate%20Medical%20Education%20Program/", "Name": "Grad Medical Education" },
              { "Link": "/Files/HR/", "Name": "Human Resources" }, { "Link": "http://intranet/IT/index.html", "Name": "Information Technology" },
              { "Link": "/Files/Laboratory/", "Name": "Laboratory" },
              { "Link": "/Files/ORMG/", "Name": "Medical Group" }, { "Link": "/Files/Nursing/", "Name": "Nursing" },
              { "Link": "/Files/EmployeeHealth/", "Name": "Occupational Health" },
              { "Link": "/Files/ODL/", "Name": "Organizational Development &amp; Learning" },
              { "Link": "/Files/Pharmacy/", "Name": "Pharmacy" },
               { "Link": "/Files/Purchasing/", "Name": "Purchasing" },
              { "Link": "/Files/Quality/", "Name": "Quality" },
              { "Link": "/Files/TrainingAndEducation/", "Name": "Training And Education" },
              { "Link": "/Files/Security/", "Name": "Security" },
              { "Link": "/Files/Vocera/", "Name": "Vocera" }
      ];
      var hospitalLogo = ["https://www.ormc.org/wp-content/uploads/2016/11/ormc-logo-sm-1.png", "https://www.crmcny.org/wp-content/themes/test-crmc/images/crmc_logo.svg", "https://www.crmcny.org/wp-content/themes/test-crmc/images/crmg_logo.svg"];
      var bottomImgs = ["http://intranet.ormc.org//BrowseFiles/Nursing/.page_content/Magnet.png", "http://garnethealth.org/patterns/dist/assets/images/logo-white@2x.png", "http://intranet.ormc.org//BrowseFiles/Nursing/.page_content/NICHE_Banner.jpg"]
      var QuickLinks =  [
              { "Link": "http://www.advisory.com/", "Name": "Advisory Board" },
              { "Link": "http://ghaswsp01:8080/ERPWeb/eReq.jsp ", "Name": "Allscripts HSS" },
              { "Link": "/Files/API/", "Name": "API Instructions" }, { "Link": "https://orangeregional793.aimsasp.net/EasyNet", "Name": "BME Work Request" },
              { "Link": "https://login.canceriq.com/", "Name": "CancerIQ" },
              { "Link": "http://access.ghvhs.org/", "Name": "Citrix" },
              { "Link": "https://www.clinicalkey.com/nursing/#!/", "Name": "ClinicalKey for Nursing" },
              { "Link": "https://lms.elsevierperformancemanager.com/ContentArea/NursingSkills?virtualname=ORMCTR", "Name": "Clinical Skills for Nursing" },
              { "Link": "http://pfmweb.ormc.org/SPFM/SPFM.HTML", "Name": "Eclipsys" },
              { "Link": "https://login.elsevierperformancemanager.com/systemlogin.aspx?virtualname=ORMCTR", "Name": "Elsevier Training" },
              { "Link": "http://intranet/WorkRequest/Default.aspx", "Name": "Facilities Work Request" },
              { "Link": "http://intranet/EOC/SmokeZonesFireResponse.pdf", "Name": "Fire Response - Affected Depts by Zone" }, { "Link": "https://pacs.ghvhs.org/synapse", "Name": "Fuji PACS - Synapse" },
              { "Link": "http://ghpacstest/Synapse", "Name": "Fuji PACS - Downtime Synapse" }, { "Link": "https://mobility.ghvhs.org/viewer", "Name": "Fuji PACS - Mobility " },
              { "Link": "https://www.gallup.com/access/", "Name": "Gallup Access" }, { "Link": "http://www.ormc.org/", "Name": "Garnet Health Medical Center Website" },
              { "Link": "http://www.crmcny.org/", "Name": "Garnet Health Medical Center - Catskills Website" },
              { "Link": "/Files/healthstream/", "Name": "HealthStream" },
              { "Link": "http://www.hvias.com", "Name": "HVIAS" }, { "Link": "/Files/Nursing/Magnet/Magnet%20Champions%20Newsletter/", "Name": "Magnet Newsletters" },
              { "Link": "/Files/Nursing/Magnet/", "Name": "Magnet Program" },
              { "Link": "http://intranet/DynamicPacs/PACS.html", "Name": "Old PACS - Dynamic PACs" }, { "Link": "http://www.onesourcedocs.com", "Name": "One Source" },
              { "Link": "http://intranet/Secure/LeanAdmin/Default.aspx", "Name": "Process Improvement" },
              { "Link": "http://intranet/RenderHtmlFile?htmlFileURL=http%3a%2f%2fghinfo.ormc.org%3a100%2fSDSInformation%2f.%2finfo.htm", "Name": "Safety Data Sheets Information" },
              { "Link": "/Files/MedicalStaff/Telemedicine/", "Name": "TeleMedicine SOC" },
              { "Link": "/Files/Tigr/", "Name": "TIGR" },
              { "Link": "https://email.ghvhs.org/", "Name": "Webmail" }
      ];
      var FooterContainer = GHVHS.DOM.create({ "Type": "div", "Class": "FooterContainer", "Id": "FooterContainer", "Parent": masterElem });



      var FooterColContainer2 = GHVHS.DOM.create({ "Type": "div", "Class": "FooterColContainer1", "Id": "FooterColContainer1", "Style": "width: 46%;margin-left:4%;", "Parent": FooterContainer });
      var Titlel = GHVHS.DOM.create({ "Type": "div", "Class": "Titlel", "Id": "Titlel", "Style": "color:rgb(64, 0, 23);height:25px; font-size:22px;Padding-top:3%;margin-left:1%;margin-bottom:0.3%;width:80%;", "Content": "Departments", "Parent": FooterColContainer2 });
      for (var i = 0; i < Department.length; i++) {
          var NameToUse = Department[i]["Name"] + "";
          var toUse = NameToUse.replace("&nbsp;", "");
          var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "footerNav", "Id": Department[i]["Name"], "Style": "height: auto;text-align:left;width: auto;font-size: 18px; padding: 1.5%;padding-bottom: 4px;", "Href": Department[i]["Link"], "Parent": FooterColContainer2 });
          if (document.getElementById("MainContent").offsetWidth < 1200) {
              SingleOption.style.fontSize = "12px";
          }
          SingleOption.innerHTML = toUse;
      }

      var FooterColContainer3 = GHVHS.DOM.create({ "Type": "div", "Class": "FooterColContainer1", "Id": "FooterColContainer1", "Style": "width: 48%;", "Parent": FooterContainer });

      var Titlel = GHVHS.DOM.create({ "Type": "div", "Class": "Titlel", "Id": "Titlel", "Style": "color:rgb(64, 0, 23);height:25px; font-size:22px;Padding-top:3%;margin-left:1%;margin-bottom:0.2%;width:80%;margin-right:20%;", "Content": "Quick Links", "Parent": FooterColContainer3 });
      for (var i = 0; i < QuickLinks.length; i++) {
          var NameToUse = QuickLinks[i]["Name"] + "";
          var toUse = NameToUse.replace("&nbsp;", "");
          var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "footerNav", "Id": QuickLinks[i]["Name"], "Style": "height: auto;text-align:left;width: auto;font-size: 18px; padding: 1.5%;padding-bottom: 4px;", "Href": QuickLinks[i]["Link"], "Parent": FooterColContainer3 });
          if (document.getElementById("MainContent").offsetWidth < 1200) {
              SingleOption.style.fontSize = "12px";
          }
          SingleOption.innerHTML = toUse;
      }

      var FooterImageContainer = GHVHS.DOM.create({ "Type": "div", "Class": "FooterImageContainer", "Id": "FooterImageContainer", "Parent": FooterContainer });
      var imgContain = GHVHS.DOM.create({ "Type": "div", "Class": "imgContain", "Id": "imgContain", "Parent": FooterImageContainer });
      if (document.getElementById("MainContent").offsetWidth < 1200) {
          imgContain.style.marginLeft = "16%";
          imgContain.style.width = "72%";
      }
      for (var i = 0; i < bottomImgs.length; i++) {
          var smallImg = GHVHS.DOM.create({ "Type": "img", "Class": "smallImg", "Id": "smallImg", "Parent": imgContain });
          smallImg.src = bottomImgs[i];
          smallImg.onclick = function () {
              GHVHS.DOM.EasterEgg += 1;
              if (GHVHS.DOM.EasterEgg == 15) {
                  GHVHS.DOM.drawslideUpIframe("/Home/SpaceInvaders");
                  setTimeout(function () {
                      document.getElementById("IFrame").focus();
                  }, 100);
                  GHVHS.DOM.EasterEgg = 0;
              }
          }

      }

  },
  EasterEgg:0,
  DrawSideMenu:function(p){
    var sideContainer = GHVHS.DOM.create({"Type":"div","Class":"SideContainer", "Id":"input", "Parent":document.getElementById("canvas")});
    for (var i = 0; i < p.length; i++) {
      var SingleSideContainer = GHVHS.DOM.create({"Type":"div","Class":"SingleSideContainer", "Id":"input","Content":p[i], "Parent":sideContainer});
    }
  },
  decodeJson: function (json, SubLevel) {
      var jsonHolder = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "jsonHolder", "Parent": document.getElementById('MainContent') });
      if (SubLevel) {
          jsonHolder.innerHTML = json;
      } else {
          jsonHolder.innerHTML = json.data;
      }
      var jsonDrop = JSON.parse(jsonHolder.innerHTML);
      document.getElementById('MainContent').removeChild(jsonHolder);
      return jsonDrop;
  },
  formateSQLDate: function (date) {
      var dateTime = date.split("T");

      var date = dateTime[0];
      var splitDate = date.split("-");
      var newDate = splitDate[1] + "/" + splitDate[2] + "/" + splitDate[0];
      var time = dateTime[1];
      var splitTime = time.split(":");
      var pmAM = "";
      var HourToUse = "";
      var newTime = "";
      if (Number(splitTime[0]) > 12) {
          pmAM = "PM";
          HourToUse = (Number(splitTime[0]) - 12) + "";
      } else {
          pmAM = "AM";
          HourToUse = (Number(splitTime[0])) + "";
      }
      newTime = HourToUse + ":" + splitTime[1] + " " + pmAM;
      return newDate + "   " + newTime;
  },
  getstaffuploads:function(){
      GHVHS.DOM.send({ "URL": "/Api/staffUploads/", "Callback": GHVHS.DOM.staffuploads, "CallbackParams": [] });
  },
  GlobalScrollLeftStaff:0,
  staffuploads:function(json){
      var jsonData = GHVHS.DOM.decodeJson(json);
      var uploadStrip = GHVHS.DOM.create({ "Type": "div", "Class": "uploadStrip", "Id": "uploadStrip", "Parent": document.getElementById("subMainCon") });
      var newsContainerHeader = GHVHS.DOM.create({ "Type": "div", "Class": "newsContainerHeader", "Id": "newsContainerHeader", "Parent": uploadStrip });
      newsContainerHeader.style.backgroundImage = "url(/img/camera.png)";
      newsContainerHeader.innerHTML = "Staff Uploads:";
      var SeeAllLink = GHVHS.DOM.create({ "Type": "a", "Class": "SeeAllLink", "Id": "SeeAllLink", "Href": "/Uploader/Index/", "Content": "See All Posts:", "Parent": uploadStrip });

      Arrow3 = GHVHS.DOM.create({ "Type": "img", "Class": "rightArrowUp", "Id": "rightArrowUp", "Src": "/img/blueNavArrow.png", "Parent": uploadStrip });
      Arrow3.onclick = function () {
          if (GHVHS.DOM.GlobalScrollLeftStaff > 0) {
              GHVHS.DOM.GlobalScrollLeftStaff = 750;
              var getAll = this.parentElement.querySelectorAll(".SingleUpload");
              for (var i = 0; i < getAll.length; i++) {
                  var getLeft = getAll[i].style.left;
                  getLeft = getLeft.replace("px", "");
                  if ((getAll[0].offsetLeft + 550) < uploadStripContainer.offsetLeft) {
                      getAll[i].style.left = (Number(getLeft) + GHVHS.DOM.GlobalScrollLeftStaff) + "px";
                  } else {
                      GHVHS.DOM.GlobalScrollLeftStaff = 0;
                  }
              }
          }
      }
      var uploadStripContainer = GHVHS.DOM.create({ "Type": "div", "Class": "uploadStripContainer","Style":"height:260px;", "Id": "uploadStripContainer", "Parent": uploadStrip });
      if (document.getElementById("MainContent").offsetWidth > 1900) {
          uploadStripContainer.style.width = "95%";
      } else if (document.getElementById("MainContent").offsetWidth < 1330 && document.getElementById("MainContent").offsetWidth > 1200) {
          uploadStripContainer.style.width = "92%";
          newsContainerHeader.style.backgroundPosition = "24% 55%";
          uploadStrip.style.marginTop = "10%";
      } else if (document.getElementById("MainContent").offsetWidth < 1200) {
          uploadStripContainer.style.width = "90%";
          newsContainerHeader.style.backgroundPosition = "24% 55%";
          uploadStrip.style.marginTop = "13%";
      } else {
          newsContainerHeader.style.backgroundPosition = "27% 55%";
      }
      var currentZindex = 0;
      for (var i = 0; i < jsonData.length; i++) {
          SingleUpload = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUpload", "Id": "SingleUpload", "Parent": uploadStripContainer });
          SingleUpload.onmouseover = function () {
              var info = this.querySelector(".SingleUploadInfo");
              info.style.backgroundColor = "rgba(255, 255, 255, 0.9)";
              this.style.transform = "scale(1.02)";
              this.style.marginTop = "0.25%";
          }
          SingleUpload.onmouseout = function () {
              var info = this.querySelector(".SingleUploadInfo");
              info.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
              this.style.transform = "unset";
              this.style.marginTop = "0.5%";
          }
          SingleUpload.style.height = "88%";
          SingleUpload.style.marginTop = "0.5%";
          SingleUpload.style.width = "24%";
          SingleUpload.style.position = "absolute";
          SingleUpload.style.float = "none";
          SingleUpload.style.zIndex = currentZindex;
          currentZindex += 1;
          SingleUpload.style.left = ((SingleUpload.parentElement.offsetWidth * .245) * i) + "px";
          SingleUpload.style.transition = "all 0.25s ease-out";
          SingleUpload.id = jsonData[i]["UploadId"] + "";
          SingleUpload.onclick = function () {
              GHVHS.DOM.drawslideUpIframe("/Uploader/Details/" + this.id);
          }
          if (jsonData[i]["Filename"].indexOf("mp4") >= 0) {
              UpLoadImageVideo = GHVHS.DOM.create({ "Type": "iframe", "Class": "UpLoadImageView", "Id": "UpLoadImageVideo", "Src": "/img/" + jsonData[0]["Filename"], "Parent": SingleUpload });
              UpLoadImageVideo.style.width = SingleUpload.offsetWidth + "px";
              UpLoadImageVideo.style.maxWidth = "100%";
              UpLoadImageVideo.style.border = "none";
              UpLoadImageVideo.style.marginTop = "0px";
              UpLoadImageVideo.style.maxHeight = "99%";
              UpLoadImageVideo.style.border = "none";
              UpLoadImageVideo.style.height = SingleUpload.offsetHeight + "px";
              UpLoadImageVideo.style.borderRadius = "10px";
              SingleUploadInfo = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUploadInfo", "Id": "SingleUploadInfo", "Parent": SingleUpload });
              SingleUploadInfo.style.position = "absolute";
          }else{
              SingleUpload.style.backgroundImage = "url(/img/" + jsonData[i]["Filename"] + ")";
              SingleUploadInfo = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUploadInfo", "Id": "SingleUploadInfo", "Parent": SingleUpload });
           }


          SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "Top", "Id": "Top", "Style": "Width:40%;", "Content": "Likes: " + jsonData[i]["Likes"], "Parent": SingleUploadInfo });
          SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "Top", "Id": "Top", "Style": "Width:55%;Text-align:right;", "Content": GHVHS.DOM.formateSQLDate(jsonData[i]["UploadDateTime"]), "Parent": SingleUploadInfo });
          SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "Top", "Id": "Top", "Content": "Uploaded By: " + jsonData[i]["Username"], "Parent": SingleUploadInfo });
          SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "Top", "Id": "Top", "Style": "Text-align:right;Width:45%;", "Content": "Location: " + jsonData[i]["Location"], "Parent": SingleUploadInfo });

          SingleInfo = GHVHS.DOM.create({ "Type": "div", "Class": "bottom", "Id": "bottom", "Content": jsonData[i]["Caption"], "Parent": SingleUploadInfo });
      }
      Arrow = GHVHS.DOM.create({ "Type": "img", "Class": "LeftArrowUp", "Id": "LeftArrowUp", "Src": "/img/blueNavArrow.png", "Parent": uploadStrip });
      Arrow.onclick = function () {
          if (GHVHS.DOM.GlobalScrollLeftStaff >= 0) {
              GHVHS.DOM.GlobalScrollLeftStaff = 750;
              var getAll = this.parentElement.querySelectorAll(".SingleUpload");
              for (var i = 0; i < getAll.length; i++) {
                  var getLeft = getAll[i].style.left;
                  getLeft = getLeft.replace("px", "");
                  if (getAll[getAll.length - 1].offsetLeft > this.parentElement.offsetLeft + (getAll[getAll.length - 1].offsetWidth * 4)) {
                      getAll[i].style.left = (Number(getLeft) - GHVHS.DOM.GlobalScrollLeftStaff) + "px";
                  }


              }
          }

      }
      GHVHS.DOM.DrawFooter();
  },
  Header:function(p){
      var json = {
          "Resources": [
             { "Link": "/Files/Cafeteria/", "Name": "Cafeteria Menus" },
             { "Link": "http://intranet/Files/PatientEducation/", "Name": "Education - Patient Education" }, { "Link": "/Files/StaffEducation/", "Name": "Education - Staff Education" },
             { "Link": "/Files/TrainingAndEducation/", "Name": "Education - Training And Education" }, { "Link": "/Files/EnvironmentOfCare/", "Name": "Environment of Care" },
             { "Link": "http://intranet/HospitalistPaging/HVHPPaging.aspx", "Name": "Hospitalist On-Call Texting" }, { "Link": "/Files/InfectionPrevention/", "Name": "Infection Prevention" },
             { "Link": "/Files/InterpretationServices/", "Name": "Interpretation Services" }, { "Link": "/Files/Iodine/", "Name": "Iodine Safety" },
             { "Link": "/Files/MedicalStaff/Graduate%20Medical%20Education%20Program/Medical%20Library/", "Name": "Medical Library" }, { "Link": "/Files/MedicalRecords/", "Name": "Medical Records" },
             { "Link": "/Files/MedicalStaff/", "Name": "Medical Staff" }, { "Link": "http://policy/Site_Published/intranet/PolicyManualView.aspx", "Name": "Medworxx" },
             { "Link": "http://intranet/OnCall/PhonesOnCall.aspx", "Name": "On Call" }, { "Link": "/Files/Midas/", "Name": "Midas/RDEs" },
             { "Link": "/Files/Planning/", "Name": "Planning &amp; Grants" }, { "Link": "http://ghinfo/PnP2/", "Name": "Policies &amp; Procedures" },
             { "Link": "/Files/RDEOccurance/", "Name": "Reports - RDE Occurrence" },
             { "Link": "/Files/Softmed/", "Name": "Reports - Softmed" },
			 { "Link": "/Files/SchwartzCenterRounds/", "Name": "Schwartz Center Rounds" },
             { "Link": "/Files/RL6/", "Name": "RL Solutions" },
              { "Link": "/Files/SafePatientHandling/", "Name": "Safe Patient Handling" },
             { "Link": "/Files/Strata/", "Name": "Strata" }

          ],
          "Department": [
              { "Link": "/Files/BioMedical/", "Name": "Biomedical Engineering" },
              { "Link": "/Files/AuditCompliance/", "Name": "Compliance, Audit &amp; HIPAA Privacy" },
              { "Link": "/Files/CME/", "Name": "Continuing Medical Education" },
              { "Link": "/Files/DiversityEquityInclusion/", "Name": "Diversity, Equity, & Inclusion" },
              { "Link": "/Files/EmergencyManagement/", "Name": "Emergency Management" },
              { "Link": "/Files/Foundation/", "Name": "Foundation" }, { "Link": "/Files/MedicalStaff/Graduate%20Medical%20Education%20Program/", "Name": "Grad Medical Education" },
              { "Link": "/Files/HR/", "Name": "Human Resources" }, { "Link": "http://intranet/IT/index.html", "Name": "Information Technology" },
              { "Link": "/Files/Laboratory/", "Name": "Laboratory" },
              { "Link": "/Files/ORMG/", "Name": "Medical Group" }, { "Link": "/Files/Nursing/", "Name": "Nursing" },
              { "Link": "/Files/EmployeeHealth/", "Name": "Occupational Health" },
              { "Link": "/Files/ODL/", "Name": "Organizational Development &amp; Learning" },
              { "Link": "/Files/Pharmacy/", "Name": "Pharmacy" },
              { "Link": "/Files/Purchasing/", "Name": "Purchasing" },
              { "Link": "/Files/Quality/", "Name": "Quality" },
              { "Link": "/Files/TrainingAndEducation/", "Name": "Training And Education" },
              { "Link": "/Files/Security/", "Name": "Security" },
              { "Link": "/Files/Vocera/", "Name": "Vocera" }
          ],
          "Quick Links": [
              { "Link": "http://www.advisory.com/", "Name": "Advisory Board" },
              { "Link": "http://ghaswsp01:8080/ERPWeb/eReq.jsp ", "Name": "Allscripts HSS" },
              { "Link": "/Files/API/", "Name": "API Instructions" }, { "Link": "https://orangeregional793.aimsasp.net/EasyNet", "Name": "BME Work Request" },
              { "Link": "https://login.canceriq.com/", "Name": "CancerIQ" },
              { "Link": "http://access.ghvhs.org/", "Name": "Citrix" },
              { "Link": "https://www.clinicalkey.com/nursing/#!/", "Name": "ClinicalKey for Nursing" },
              { "Link": "https://lms.elsevierperformancemanager.com/ContentArea/NursingSkills?virtualname=ORMCTR", "Name": "Clinical Skills for Nursing" },
              { "Link": "http://pfmweb.ormc.org/SPFM/SPFM.HTML", "Name": "Eclipsys" },
              { "Link": "https://login.elsevierperformancemanager.com/systemlogin.aspx?virtualname=ORMCTR", "Name": "Elsevier Training" },
              { "Link": "http://intranet/WorkRequest/Default.aspx", "Name": "Facilities Work Request" },
              { "Link": "http://intranet/EOC/SmokeZonesFireResponse.pdf", "Name": "Fire Response - Affected Depts by Zone" }, { "Link": "https://pacs.ghvhs.org/synapse", "Name": "Fuji PACS - Synapse" },
              { "Link": "http://ghpacstest/Synapse", "Name": "Fuji PACS - Downtime Synapse" }, { "Link": "https://mobility.ghvhs.org/viewer", "Name": "Fuji PACS - Mobility " },
              { "Link": "https://www.gallup.com/access/", "Name": "Gallup Access" }, { "Link": "http://www.ormc.org/", "Name": "Garnet Health Medical Center Website" },
              { "Link": "http://www.crmcny.org/", "Name": "Garnet Health Medical Center - Catskills Website" },
              { "Link": "/Files/healthstream/", "Name": "HealthStream" },
              { "Link": "http://www.hvias.com", "Name": "HVIAS" }, { "Link": "/Files/Nursing/Magnet/Magnet%20Champions%20Newsletter/", "Name": "Magnet Newsletters" },
              { "Link": "/Files/Nursing/Magnet/", "Name": "Magnet Program" },
              { "Link": "http://intranet/DynamicPacs/PACS.html", "Name": "Old PACS - Dynamic PACs" }, { "Link": "http://www.onesourcedocs.com", "Name": "One Source" },
              { "Link": "http://intranet/Secure/LeanAdmin/Default.aspx", "Name": "Process Improvement" },
              { "Link": "http://intranet/RenderHtmlFile?htmlFileURL=http%3a%2f%2fghinfo.ormc.org%3a100%2fSDSInformation%2f.%2finfo.htm", "Name": "Safety Data Sheets Information" },
              { "Link": "/Files/MedicalStaff/Telemedicine/", "Name": "TeleMedicine SOC" },
              { "Link": "/Files/Tigr/", "Name": "TIGR" },
              { "Link": "https://email.ghvhs.org/", "Name": "Webmail" }
          ],
          "Epic": [
              // { "Link": "http://ghepbcaweb.ormc.org/BCAWeb-8.3/login.aspx?redirect=folderlist.aspx%3fgroup%3dcrmc", "Name": "BCA Web - Garnet Health Medical Center %2D Catskills" }, { "Link": "http://ghepbcaweb.ormc.org/BCAWeb-8.3/login.aspx?redirect=folderlist.aspx%3fgroup%3dormc", "Name": "BCA Web - Garnet Health Medical Center" },
              { "Link": "https://bcaweb.garnethealth.org/BCAWeb/", "Name": "BCA Web Data Entry" }, { "Link": "/Files/Epic/Epic/", "Name": "Epic Documents" }, { "Link": "/Files/Epic/Epic%20Update/", "Name": "Epic Update" },
               { "Link": "http://intranet/MyChart/MyChart%20Activation%20Form.pdf", "Name": "MyChart Activation Form" }
          ],
          "Maps": [
              { "Link": "/Files/DrivingDirections/", "Name": "Directions to Transfer Facility" }, { "Link": "http://intranet/Maps/New%20Hospital%20Staff%20Map.pdf", "Name": "Map - Main Hospital" },
              { "Link": "http://intranet/Maps/160916_ORMC_OBCC_Maps_r2.pdf", "Name": "Map - Outpatient/CC" }, { "Link": "http://intranet/Maps/ORMC%20Parking%20Map%202016.pdf", "Name": "Map - Parking" }
          ],
          "Phone": [
              { "Link": "http://intranet/phones/CRMC%20Outpatient%20Services.pdf", "Name": "Garnet Health Medical Center %2D Catskills Outpatient" },
              { "Link": "http://intranet/phones/PhoneSearchEmployeeCombined.aspx", "Name": "Garnet Health Employee Search" },
              { "Link": "http://intranet/GetOrgChart/All?v=2", "Name": "Garnet Health Organizational Chart" },
              { "Link": "http://intranet/phones/PhoneListExcel.aspx", "Name": "Garnet Health Phone List %2D All Campuses" },
              { "Link": "http://intranet/phones/PhoneSearchPhysician.aspx", "Name": "Garnet Health Medical Center Physician Search" },
              { "Link": "http://intranet/phones/2017%20Outpatient%20Services.pdf", "Name": "Garnet Health Medical Center Outpatient" },
          ]
      };
      var DropDownData = [{
      "parentID":"headerPartOne",
      "Elements":"div",
      "ElementClass":"NavItem",
      "Content":"My Applications",
      "data":[]
    },
    {
      "parentID":"headerPartOne",
      "Elements":"div",
      "ElementClass":"NavItem",
      "Content":"Resources And Apps",
      "data":[]
    },
    {
      "parentID":"headerPartOne",
      "Elements":"div",
      "ElementClass":"NavItem",
      "Content":"Department",
      "data":[]
    },
    {
      "parentID":"headerPartOne",
      "Elements":"div",
      "ElementClass":"NavItem",
      "Content":"Quick Links",
      "data":[]
    },{
      "parentID":"headerPartOne",
      "Elements":"div",
      "ElementClass":"NavItem",
      "Content":"Epic",
      "data":[]
    },
    {
      "parentID":"headerPartOne",
      "Elements":"div",
      "ElementClass":"NavItem",
      "Content":"Maps & Directions",
      "data":[]
    },
    {
      "parentID":"headerPartOne",
      "Elements":"div",
      "ElementClass":"NavItem",
      "Content":"Phone Directory",
      "data":[]
    }];
    var jsonHeaders = ["Resources","Department","Quick Links","Epic","Maps","Phone"];
    for (var i = 0; i < jsonHeaders.length; i++) {
      for (var p = 0; p < json[jsonHeaders[i]].length; p++) {
        DropDownData[(i+1)]["data"].push(json[jsonHeaders[i]][p]);
        GHVHS.DOM.TotalNavs.push(json[jsonHeaders[i]][p]);
      }
    }
    var header = GHVHS.DOM.create({"Type":"div","Class":"header", "Id":"header", "Parent":document.getElementById("canvas")});
    var headerPartOneTwo = GHVHS.DOM.create({"Type":"div","Class":"headerPartOneTwo", "Id":"headerPartOneTwo", "Parent":header});
    headerPartOneTwo.onmouseover = function(){
      var getHeaderNav = document.getElementById('headerPartOne');
      var navs = getHeaderNav.querySelectorAll(".NavItem");
      for (var i = 0; i < navs.length; i++) {
          if (navs[i].style.backgroundColor == "rgb(92, 10, 58)") {
              if (navs[i].id != "div||1") {
                  navs[i].click();
              } else {
                  navs[i].style.backgroundColor = "white";
                  navs[i].style.color = "#5c0a3a";
              }

        }

      }
    };
    var headerImg = GHVHS.DOM.create({ "Type": "img", "Class": "headerImg1", "Id": "headerImg1", "Src": "/img/logoTrans.png", "Parent": headerPartOneTwo });
    headerImg.onclick = function () {
        window.location.href = "/";
    }
    var Filler = GHVHS.DOM.create({ "Type": "div", "Class": "Filler", "Id": "Filler", "Parent": headerPartOneTwo });
    var Welcome = GHVHS.DOM.create({ "Type": "div", "Class": "Welcome", "Id": "Welcome", "Parent": Filler });
    var SearchBox = GHVHS.DOM.create({ "Type": "div", "Class": "SearchBox", "Id": "SearchBox", "Parent": headerPartOneTwo });
    var hotboxImg = GHVHS.DOM.create({ "Type": "img", "Class": "SearchBoxImg", "Id": "SearchBoxImg", "Src": "/img/hotline.png", "Parent": SearchBox });
    hotboxImg.style.marginTop = "1.5%";
    hotboxImg.style.marginLeft = "75%";
    hotboxImg.style.paddingRight = "5%";
    hotboxImg.onclick = function () {
        window.open("https://www.complianceresource.com/hotline/", "_blank");
    }
    var SearchBoxImg = GHVHS.DOM.create({ "Type": "img", "Class": "SearchBoxImg", "Id": "SearchBoxImg", "Src": "/img/searchIcon.png", "Parent": SearchBox });
    SearchBoxImg.style.marginTop = "2.5%";
    SearchBoxImg.style.display = "none";
    var SearchBoxView = GHVHS.DOM.create({ "Type": "input", "Class": "text SearchBoxView", "Id": "SearchBoxView", "Parent": SearchBox });
    SearchBoxView.style.marginTop = "2%";
    SearchBoxView.style.display = "none";
    options =  GHVHS.DOM.TotalNavs;
    GHVHS.DOM.CreateDropDown({"Element":"SearchBoxView","dropDownId":"", "Options":options,"todraw":"div"});
    SearchBoxView.setAttribute("placeholder", "Search GH Intranet");

    var headerPartOne = GHVHS.DOM.create({"Type":"div","Class":"headerPartOne", "Id":"headerPartOne", "Parent":header});
    GHVHS.DOM.drawMulptieDropDowns(DropDownData,"Y");
    if (document.getElementById("canvas").offsetWidth < 1500 && document.getElementById("canvas").offsetWidth > 1050) {
        Filler.style.width = "20%";
        SearchBox.style.width = "50%";
        SearchBoxView.marginLeft = "1%";
    } else if (document.getElementById("canvas").offsetWidth < 1050) {
        Filler.style.width = "10%";
        SearchBox.style.width = "60%";
        SearchBoxView.marginLeft = "1%";
    }
  },

  getWeatherdata:function (p) {
    if (p.Forcast) {
      GHVHS.DOM.send({"URL":"https://api.weather.gov/points/41.4020,-74.3243", "Callback":GHVHS.DOM.RedrawFocast, "CallbackParams":{Elm:p} });
    }else {
      GHVHS.DOM.send({"URL":"https://api.weather.gov/points/41.4020,-74.3243", "Callback":GHVHS.DOM.DrawWeatherWidget, "CallbackParams":{Elm:p} });
    }
  },
  DrawWeatherWidget: function(json,p){
      var getElement = document.getElementById(p.Elm.id);
      function DrawWidget(json,p) {
          var WeatherContainer = GHVHS.DOM.create({ "Type": "div", "Class": "WeatherContainer", "Id": "WeatherContainer", "Parent": getElement });
          if (document.getElementById("EventWidgetAccounments")) {
              document.getElementById("BottomContainer").style.marginTop = "-15%";
          }
          if (document.getElementById("canvas").offsetWidth < 1200) {
              WeatherContainer.style.display = "none";
          }
          WeatherContainer.onmouseover = function () {
              if (document.getElementById("TableWeather").className != "hide") {
                  WeatherContainer.style.height = "105%";
                  document.getElementById("BottomContainer").style.marginTop = "0.5%";
                  if (document.getElementById("CalanderButton")) {
                      document.getElementById("CalanderButton").style.display = "none";
                  }
                  WeatherContainer.style.boxShadow = "2px 2px 16px grey";
                  document.getElementById('WeatherContainerBody').style.overflow = "auto";
                  document.getElementById('WeatherContainerHeaderLable').style.paddingTop = "2%";
                  var getOption = document.getElementById('WeatherContainerSearchBox');
                  getOption.style.display = "block";
                  var getAllTable = document.getElementById('canvas').querySelectorAll(".SingleWeatherSmall");
                  for (var i = 0; i < getAllTable.length; i++) {
                      getAllTable[i].className = "SingleWeatherSmall hide";
                  }
                  document.getElementById('WeatherContainerHeaderLable').style.fontSize = "22px";
                  document.getElementById('TableWeather').className = "hide";
                  var getValue = document.getElementById('SearchBoxView').innerText;
                  //document.getElementById('input||8').setAttribute("placeholder","Switch To Hourly");
                  var getAllViews2 = document.getElementById('canvas').querySelectorAll(".SingleWeatherHourly");
                  var getAllViews = document.getElementById('canvas').querySelectorAll(".SingleWeather");

                  if (getValue == "Switch To Daily View") {
                      if (getAllViews2.length > 0) {
                          for (var j = 0; j < getAllViews2.length; j++) {
                              getAllViews2[j].className = "SingleWeatherHourly";
                          }
                          for (var j = 0; j < getAllViews.length; j++) {
                              getAllViews[j].className = "SingleWeather hide";
                          }
                      } else {
                          for (var j = 0; j < getAllViews.length; j++) {
                              getAllViews[j].className = "SingleWeather hide";
                          }
                          GHVHS.DOM.getWeatherdata({ "Forcast": "forecastHourly" });
                      }
                  } else {
                      if (getAllViews[0].className.indexOf("hide") >= 0) {
                          for (var j = 0; j < getAllViews2.length; j++) {
                              getAllViews2[j].className = "SingleWeatherHourly hide";
                          }
                          for (var j = 0; j < getAllViews.length; j++) {
                              getAllViews[j].className = "SingleWeather";
                          }
                      }
                  }
              }

          };
          document.getElementById("SideContainer").style.paddingLeft = "0.1%";
          document.getElementById("SideContainer").style.paddingRight = "1%";
          document.getElementById("SideContainer").onmouseover = function (e) {
              var AnnSlide = document.getElementById("sideSlide2");
              var EventSlide = document.getElementById("sideSlide");
              if (EventSlide && AnnSlide) {
                  if (e.target.id != "CalanderButton2" && e.target.id != "sideSlide2" && e.target.id != "CalanderButton" && e.target.id != "sideSlide" && e.target.id != "Singlelinks") {
                      if (AnnSlide.style.width == "55%") {
                          document.getElementById("CalanderButton2").click();
                      }
                      if (EventSlide.style.width == "55%") {
                          document.getElementById("CalanderButton").click();
                      }
                  }
              }
              if (e.target.id == "TopSideContainer" || e.target.id == "MainContent" || e.target.id == "SideContainer" || e.target.id == "EventWidgetAccounments" || e.target.id == "EventWidget" || e.target.id == "CalanderButton" || e.target.id == "BottomContainer") {
                  WeatherContainer.style.height = "65%";

                  document.getElementById("BottomContainer").style.marginTop = "-15%";
                  WeatherContainer.style.boxShadow = "2px 2px 8px Silver";
                  document.getElementById("CalanderButton").style.display = "block";
                  WeatherContainer.scrollHeight = 0;
                  var getOption = document.getElementById('WeatherContainerSearchBox');
                  getOption.style.display = "none";
                  document.getElementById('WeatherContainerHeaderLable').style.fontSize = "18px";
                  document.getElementById('WeatherContainerHeaderLable').style.paddingTop = "1%";
                  var getAllTable = document.getElementById('canvas').querySelectorAll(".SingleWeatherSmall");
                  for (var i = 0; i < getAllTable.length; i++) {
                      getAllTable[i].className = "SingleWeatherSmall";
                  }
                  document.getElementById('TableWeather').className = "TableWeather";
                  var setTime = setTimeout(function () {
                      if (document.getElementById('WeatherContainer').style.height == "18%") {
                          document.getElementById('WeatherContainerBody').scrollHeight = "0";
                          document.getElementById('WeatherContainerBody').style.overflow = "hidden";
                      }
                  }, 80);
                  var getAllViews = document.getElementById('canvas').querySelectorAll(".SingleWeather");
                  for (var j = 0; j < getAllViews.length; j++) {
                      getAllViews[j].className = "SingleWeather hide";
                  }
                  var getAllViews2 = document.getElementById('canvas').querySelectorAll(".SingleWeatherHourly");
                  for (var j = 0; j < getAllViews2.length; j++) {
                      getAllViews2[j].className = "SingleWeatherHourly hide";
                  }
              }
          };

          var WeatherContainerHeader = GHVHS.DOM.create({"Type":"div","Class":"WeatherContainerHeader", "Id":"WeatherContainerHeader", "Parent":WeatherContainer});
          var WeatherContainerHeaderLable = GHVHS.DOM.create({"Type":"div","Class":"WeatherContainerHeaderLable", "Id":"WeatherContainerHeaderLable", "Content":"Local Forecast","Parent":WeatherContainerHeader});
          var WeatherContainerHeaderFiller = GHVHS.DOM.create({"Type":"div","Class":"WeatherContainerHeaderFiller", "Id":"WeatherContainerHeaderFiller","Parent":WeatherContainerHeader});
          var WeatherContainerSearchBox = GHVHS.DOM.create({"Type":"div","Class":"WeatherContainerSearchBox", "Id":"WeatherContainerSearchBox", "Parent":WeatherContainerHeader});
          var SearchBoxView = GHVHS.DOM.create({ "Type": "div", "Class": "text ", "Content": "Switch To Hourly View", "Id": "SearchBoxView", "Parent": WeatherContainerSearchBox });
          SearchBoxView.onclick = function () {
              var getAllViews2 = document.getElementById('canvas').querySelectorAll(".SingleWeatherHourly");
              var getAllViews = document.getElementById('canvas').querySelectorAll(".SingleWeather");
              if (this.innerText == "Switch To Hourly View") {
                  this.innerHTML = "Switch to Daily View";
                  if (getAllViews2.length > 0) {
                      for (var j = 0; j < getAllViews2.length; j++) {
                          getAllViews2[j].className = "SingleWeatherHourly";
                      }
                      for (var j = 0; j < getAllViews.length; j++) {
                          getAllViews[j].className = "SingleWeather hide";
                      }
                  } else {
                      for (var j = 0; j < getAllViews.length; j++) {
                          getAllViews[j].className = "SingleWeather hide";
                      }
                      GHVHS.DOM.getWeatherdata({ "Forcast": "forecastHourly" });
                  }

              } else {

                  for (var j = 0; j < getAllViews2.length; j++) {
                      getAllViews2[j].className = "SingleWeatherHourly hide";
                  }
                  for (var j = 0; j < getAllViews.length; j++) {
                      getAllViews[j].className = "SingleWeather";
                  }
              }
              this.innerText = "Switch To Hourly View";

          }

        SearchBoxView.style.width = "100%";
        SearchBoxView.style.height = "40%";
        SearchBoxView.style.display = "none";
          /* var options =  ["","Hourly","Daily"];
          GHVHS.DOM.CreateDropDown({"Element":"SearchBoxView","dropDownId":"", "Options":options,"todraw":"input"});

          var drop8 = document.getElementById('DropDown8');
          drop8.style.height = "100px";
        drop8.style.top = (SearchBoxView.offsetHeight + SearchBoxView.offsetTop)+"px";
        drop8.style.width = SearchBoxView.offsetWidth +  "px";
        drop8.style.left = SearchBoxView.offsetLeft + "px";*/
        var time = setTimeout(function () {
            WeatherContainerSearchBox.style.display = "none";
        }, 100);

        var WeatherContainerBody = GHVHS.DOM.create({"Type":"div","Class":"WeatherContainerBody", "Id":"WeatherContainerBody", "Parent":WeatherContainer});
        TableWeather = GHVHS.DOM.create({"Type":"div","Class":"TableWeather", "Id":"TableWeather", "Parent":WeatherContainerBody});
        for (var i = 0; i < json["properties"]["periods"].length; i++) {
          var currentData = json["properties"]["periods"][i];
          GHVHS.DOM.DrawSingleWeather({"data":currentData,"parent":WeatherContainerBody,"Count":i});
        }
      }
       GHVHS.DOM.send({"URL":json["properties"]["forecast"], "Callback":DrawWidget, "CallbackParams":{Elm:p} });

  },
  RedrawFocast:function(json,p) {
    function reDrawSingleWeather(json,p) {
      for (var i = 0; i < 48; i++) {
        var currentData = json["properties"]["periods"][i];
        GHVHS.DOM.DrawSingleWeather({"data":currentData,"parent":document.getElementById("WeatherContainerBody"),"Forcast":p.Elm,"Count":i,});
      }

    }
    GHVHS.DOM.send({"URL":json["properties"][p.Elm.Forcast], "Callback":reDrawSingleWeather, "CallbackParams":{Elm:p.Elm} });
  },
  DrawSingleWeather:function(p){
    var data = p.data;
    var forcast = "";
    if (p.Forcast) {
      if (p.Forcast.Forcast) {
        forcast = p.Forcast.Forcast;

      }
    }
    var d = new Date();
    var n = d.getHours();
    var  i = p.Count;
    var w = d.getMinutes();
    if (w < 10) {
        var temp = "0"+w;
        w = temp;
    }

    if (p.Count < 4 && forcast == "") {
      SingleWeatherSmall = GHVHS.DOM.create({"Type":"div","Class":"SingleWeatherSmall", "Id":data["name"], "Parent":document.getElementById('TableWeather')});
      if (p.Count == 0) {
        SingleWeatherSmall.style.borderBottomLeftRadius= "8px";
      }else if (p.Count == 3) {
        SingleWeatherSmall.style.borderBottomRightRadius= "8px";
      }
      if (document.getElementById("canvas").offsetWidth < 1400) {
          SingleWeatherSmall.style.width = "23.5%";
      }
      TableWeatherHeader = GHVHS.DOM.create({"Type":"div","Class":"TableWeatherHeader", "Id":"TableWeatherHeader", "Parent":SingleWeatherSmall});
      TableWeatherName = GHVHS.DOM.create({"Type":"div","Class":"TableWeatherName", "Id":"TableWeatherName", "Parent":TableWeatherHeader});
      TableWeatherName.innerHTML = data["name"];
      TableWeatherIcon = GHVHS.DOM.create({"Type":"img","Class":"TableWeatherIcon", "Id":"TableWeatherIcon", "Parent":SingleWeatherSmall});
      TableWeatherIcon.src = data["icon"];
      if (document.getElementById("canvas").offsetWidth < 1200) {
          TableWeatherIcon.style.marginLeft = "10%";

      }
      TableWeatherTemp = GHVHS.DOM.create({"Type":"div","Class":"TableWeatherTemp", "Id":"TableWeatherTemp", "Parent":SingleWeatherSmall});
      TableWeatherTemp.innerHTML =  data["temperature"] + "&deg" +"F";
      TableWeatherForcast = GHVHS.DOM.create({"Type":"div","Class":"TableWeatherForcast", "Id":"TableWeatherForcast", "Parent":SingleWeatherSmall});
      TableWeatherForcast.innerHTML = data["shortForecast"];
    }




      if (forcast != "forecastHourly") {
        SingleWeather = GHVHS.DOM.create({"Type":"div","Class":"SingleWeather hide", "Id":data["name"], "Parent":p.parent});
        SingleWeatherHeader = GHVHS.DOM.create({"Type":"div","Class":"SingleWeatherHeader", "Id":"SingleWeatherHeader", "Parent":SingleWeather});
        SingleWeatherName = GHVHS.DOM.create({"Type":"div","Class":"SingleWeatherName", "Id":"SingleWeatherName", "Parent":SingleWeatherHeader});
        SingleWeatherIcon = GHVHS.DOM.create({"Type":"img","Class":"SingleWeatherIcon", "Id":"SingleWeatherIcon", "Parent":SingleWeather});
        SingleWeatherIcon.src = data["icon"];
        SingleWeatherName.innerHTML = data["name"];
      }else {
        SingleWeather = GHVHS.DOM.create({"Type":"div","Class":"SingleWeatherHourly", "Id":data["name"], "Parent":p.parent});
        SingleWeatherHeader = GHVHS.DOM.create({"Type":"div","Class":"SingleWeatherHeader", "Id":"SingleWeatherHeader", "Parent":SingleWeather});
        SingleWeatherName = GHVHS.DOM.create({"Type":"div","Class":"SingleWeatherName", "Id":"SingleWeatherName", "Parent":SingleWeatherHeader});
        SingleWeatherIcon = GHVHS.DOM.create({"Type":"img","Class":"SingleWeatherIcon", "Id":"SingleWeatherIcon", "Parent":SingleWeather});
        SingleWeatherIcon.src = data["icon"];
        n = Number(n +(i+1));
        if (n > 24 && n < 48) {
          var temp = (n - 24);
          n =(d.getMonth()+1)+"/"+(d.getDate()+1)+"/"+d.getFullYear()+"<br>" +temp;

        }else if (n >= 48 && n < 72) {
          var temp = (n - 48);

          n =(d.getMonth()+1)+"/"+(d.getDate()+2)+"/"+d.getFullYear()+"<br>" +temp;

        }else if (n >= 72 && n < 96) {
          var temp = (n - 48);

          n =(d.getMonth()+1)+"/"+(d.getDate()+3)+"/"+d.getFullYear()+"<br>" +temp;

        }else {
          var temp = (n);

          n ="Today"+"<br>" +temp;
        }
        if (temp >= 12) {
          w += " pm";
        }else {
          w += " am";
        }
        SingleWeatherName.innerHTML = n + ":"+w;

      }
      SingleWeatherTable = GHVHS.DOM.create({ "Type": "table", "Class": "SingleWeatherTable", "Id": "SingleWeatherTable", "Parent": SingleWeather });
      if (document.getElementById("canvas").offsetWidth < 1550) {
          SingleWeatherTable.style.width = "64%";
      }
      tableRow = GHVHS.DOM.create({"Type":"tr","Class":"tableRow", "Id":"tableRow", "Parent":SingleWeatherTable});
      if (forcast != "forecastHourly") {
        SingleWeatherShortCast = GHVHS.DOM.create({"Type":"td","Class":"SingleWeatherTemp", "Id":"SingleWeatherShortCast", "Parent":tableRow});
        SingleWeatherShortCast.innerHTML =  data["shortForecast"];
        SingleWeatherShortCast.style.fontSize = "14px";
        SingleWeatherShortCast.style.paddingTop = "1%";
        SingleWeatherShortCast.style.width = "60%";
      }
      SingleWeatherTemp = GHVHS.DOM.create({"Type":"td","Class":"SingleWeatherTemp", "Id":"SingleWeatherTemp", "Parent":tableRow});
      SingleWeatherTemp.style.textAlign = "right";
      SingleWeatherTemp.innerHTML =  data["temperature"] + "&deg" +"F";
      if (data["detailedForecast"].indexOf("snow") > 0) {
        var warningicon  = GHVHS.DOM.create({"Type":"img","Class":"SingleWeatherTemp", "Id":"", "Parent":SingleWeatherTemp});
        warningicon.src = "img/warning.png";
        warningicon.style.minWidth = "20px";
        warningicon.style.width = "20px";
        warningicon.style.height = "20px";
        warningicon.style.paddingLeft = "3%";
      }else {
          SingleWeatherTemp.style.paddingRight = "3%";
      }
      SingleWeatherRow = GHVHS.DOM.create({"Type":"tr","Class":"tableRow", "Id":"tableRow", "Parent":SingleWeatherTable});
      SingleWeatherWind = GHVHS.DOM.create({"Type":"td","Class":"SingleWeatherWind", "Id":"SingleWeatherWind", "Parent":SingleWeatherRow});
      SingleWeatherWind.innerHTML =  "Wind Speed: "+	data["windSpeed"] ;

      if (forcast == "forecastHourly") {
        SingleWeatherRow2 = GHVHS.DOM.create({"Type":"tr","Class":"tableRow", "Id":"tableRow", "Parent":SingleWeatherTable});
        SingleWeatherWind2 = GHVHS.DOM.create({"Type":"td","Class":"SingleWeatherWind", "Id":"SingleWeatherWind2", "Parent":SingleWeatherRow2});
        SingleWeatherWind2.innerHTML =  " Wind Direction: " +data["windDirection"];
      }else {
        SingleWeatherWind2 = GHVHS.DOM.create({"Type":"td","Class":"SingleWeatherWind", "Id":"SingleWeatherWind2", "Parent":SingleWeatherRow});
        SingleWeatherWind2.innerHTML = " Wind Direction: " + data["windDirection"];
        SingleWeatherWind2.style.textAlign = "right";
      }
      SingleWeatherForcast = GHVHS.DOM.create({ "Type": "div", "Class": "SingleWeatherForcast", "Id": "SingleWeatherForcast", "Parent": SingleWeather });
      if (forcast == "forecastHourly") {
        SingleWeatherForcast.innerHTML = data["shortForecast"];
        if (data["shortForecast"].indexOf("Snow") > 0) {
          var warningicon  = GHVHS.DOM.create({"Type":"img","Class":"SingleWeatherTemp", "Id":"", "Parent":SingleWeather});
          warningicon.src = "img/warning.png";
          warningicon.style.marginLeft= ((SingleWeatherTemp.offsetWidth)*0.58) + "px";
          warningicon.style.width = "20px";

        }
        SingleWeatherTemp.style.fontSize = "14px";
        SingleWeather.style.width = "47.5%";
        SingleWeatherTable.style.width = "60%";
        SingleWeatherTemp.style.paddingLeft = "0%";
        SingleWeatherName.style.fontSize = "12px";
        SingleWeatherName.style.paddingTop = "0.5%";
        SingleWeatherForcast.style.fontSize = "12px";
        SingleWeatherWind2.style.fontSize = "9px";
        SingleWeatherWind.style.fontSize = "10px";
      }else {

        SingleWeather.style.gridTemplateRows = "30% 70%";
        SingleWeatherForcast.innerHTML = data["detailedForecast"];
      }



  },
  ReturnAList: function(){

    /*var resources = {
    "Resources":[],
    "Department":[],
    "Quick Links":[],
    "Epic":[],
    "Maps":[],
    "Phone":[]

  };*/
    var Values = {"Data":[]};
    var links = document.getElementById('canvas').querySelectorAll(".bottomlink");
    for (var i = 0; i < links.length; i++) {
      var currentData = {
          "links":[]

      };
      var x = links[i].querySelectorAll("img,a");
      for (var j = 0; j < x.length; j++) {
        if (x[j].nodeName == "img") {
          currentData.push({"image":x[j].src});
        }else if (x[j].nodeName == "A"){
          var checkLink = x[j].href +"";
          var linktoUse = "";

          if (checkLink.includes("http:")== false && checkLink.includes("https:")== false) {
            linktoUse = "http://intranet"+checkLink.replace("file://","");
          }else {
            linktoUse = x[j].href;
          }
          currentData["links"].push({"Link":linktoUse, "Name":x[j].innerHTML});
        }
      }
      /*if (linktoUse != "") {
        if (i < 26) {
          resources["Resources"].push({"Link":linktoUse, "Name":links[i].innerHTML});
        }else if (i > 26 && i < 43 ) {
          resources["Department"].push({"Link":linktoUse, "Name":links[i].innerHTML});
        }else if (i > 43 && i < 63) {
          resources["Quick Links"].push({"Link":linktoUse, "Name":links[i].innerHTML});
        }else if (i > 63 && i < 68) {
          resources["Epic"].push({"Link":linktoUse, "Name":links[i].innerHTML});
        }else if (i > 68 && i < 73) {
          resources["Maps"].push({"Link":linktoUse, "Name":links[i].innerHTML});
        }else {
          resources["Phone"].push({"Link":linktoUse, "Name":links[i].innerHTML});
        }

      }*/
      Values["Data"].push(currentData);
    }
    console.log(JSON.stringify(Values));
  },

  DrawCards:function(){
      var links = {
          "data": [
              ["Clergy", "N", { "Link": "http://garnetinfo/Files/PastoralCare/Clergy%20Lists/", "Name": "Clergy Lists" }, { "img": "/img/PastoralCare.png" }, { "Link": "http://sharepoint/_layouts/15/FormServer.aspx?XsnLocation=http://sharepoint/NODA_Requests/Forms/template.xsn&OpenIn=browser&SaveLocation=http://sharepoint/NODA_Requests&Source=http://sharepoint/NODA_Requests", "Name": "No One Dies Alone Service Request" }],
              ["HelpDesk", "N", { "Link": "http://intranet/IT/HelpDesk/", "img": "http://intranet/IT/HelpDesk/include/ITHelpDesk.png" }, { "Link": "http://intranet/IT/HelpDesk/", "Name": "Help Desk" }],
              ["EmergencyManagement", "N", { "Link": "/Files/EmergencyManagement/", "img": "http://intranet/images/emergmgmtcycle.jpg" }, { "Link": "/Files/EmergencyManagement/", "Name": "Emergency Management" }],
              ["compliance", "N", { "Link": "", "img": "http://intranet/images/compliance.png" }, { "Link": "/Files/AuditCompliance/", "Name": "Compliance Audit & HIPAA Privacy " }],
              ["Innovation", "N", { "Link": "", "img": "http://intranet//images/Innovation_CI_Title.png" }, { "Link": "http://sharepoint/_layouts/15/FormServer.aspx?XsnLocation=http://sharepoint/Innovation%20Ideas/Forms/template.xsn&OpenIn=browser&SaveLocation=http://sharepoint/Innovation%20Ideas&Source=http://sharepoint/Innovation%20Ideas", "Name": "Submit Your Idea" }, { "Link": "/Files/Innovation/", "Name": "Forms" }, { "Link": "http://sharepoint/Innovation%20Ideas/Forms/GHVHS%202.aspx", "Name": "View Submitted Ideas" }],
              ["halesmeds", "N", { "Link": "https://www.halesmeds.com/", "img": "http://ghinfo/images/hales.jpg" }, { "Link": "https://www.halesmeds.com/", "Name": "Hales Medications & Mothers' Milk" }],
              ["peoplecube", "N", { "Link": "", "img": "http://intranet/images/peoplecube.jpg" }, { "Link": "http://peoplecube/resourcescheduler", "Name": "Login to People Cube" }, { "Link": "http://peoplecube/RSEvents/eventcal.asp?ID=8", "Name": "Conference Room Schedules" }],
              ["Medtrics2", "N", { "Link": "", "img": "http://intranet/images/Medtrics2.png" }, { "Link": "https://garnethealth.medtricslab.com/users/login/", "Name": "Resident/Preceptor Login" }, { "Link": "https://garnethealth.medtricslab.com/credentialing_check/", "Name": "Credentialing Check" }],
              ["EmployeeResource", "Y", "http://ghinfo/images/empres_sm2.png", { "Link": "https://identity.pressganey.com/?TargetResource=/misconfiguredSSO&ReturnUrl=%2f", "img": "http://intranet/images/pg_sm.png" }, { "Link": "https://identity.pressganey.com/?TargetResource=/misconfiguredSSO&ReturnUrl=%2f", "Name": "Press Ganey Login" }],
              ["EmployeeResource", "Y", "http://ghinfo/images/empres_sm2.png", { "Link": "http://ghinfo/files/healthstream/", "img": "http://intranet/images/healthstream_sm.png" }, { "Link": "http://ghinfo/files/healthstream/", "Name": "HealthStream" }],
              ["EmployeeResource", "Y", "http://ghinfo/images/empres_sm2.png", { "Link": "/Files/EmployeeHealth/Wellness/", "Name": "Employee Wellness" }],
              ["Drug", "N", { "Link": "/files/Pharmacy/Drug%20Shortages/", "img": "http://intranet/images/drug.jpg" }, { "Link": "/files/Pharmacy/Drug%20Shortages/", "Name": "Drug Shortages" }],
              ["FujiPACS", "N", { "Link": "/Files/FujiPACS/Training/", "img": "http://ghinfo/images/fujifilm.jpg" }, { "Link": "/Files/FujiPACS/Training/", "Name": "Fuji PACS Training Documents" }, { "Link": "https://pacs.ghvhs.org/synapse", "Name": "Synapse" }, { "Link": "https://mobility.ghvhs.org/viewer", "Name": "Mobility" }],
              /*["Feedback", "Y", "http://ghinfo/images/feedback.png", { "Link": "http://ghinfo/Files/Quality/Good%20Catch%20Award%20Program.expand/", "img": "http://intranet/images/GoodCatchProgram_2.png" }, { "Link": "/Files/Quality/Good%20Catch%20Award%20Program.expand/", "Name": "Good Catch" }],*/
              /*["Feedback", "Y", "http://ghinfo/images/feedback.png", { "Link": "http://hmcfp010/MidasWeb/HMCFP010/MAA/FocusStudy/default.aspx?Internal=407", "img": "http://intranet/images/doggie_2.png" }, { "Link": "http://hmcfp010/MidasWeb/HMCFP010/MAA/FocusStudy/default.aspx?Internal=407", "Name": "Family Feedback" }],*/
              /*["Feedback", "Y", "http://ghinfo/images/feedback.png", { "Link": "http://sharepoint/Lists/GHVHS%20Bee%20Award/Item/newifs.aspx?List=5e0b53ca%2Dbdcc%2D4161%2Da820%2D3280acc661ca", "img": "http://intranet/images/beeaward.png" }, { "Link": "http://sharepoint/Lists/GHVHS%20Bee%20Award/Item/newifs.aspx?List=5e0b53ca%2Dbdcc%2D4161%2Da820%2D3280acc661ca", "Name": "Bee Award" }],*/
              ["Trauma", "N", { "Link": "", "img": "http://intranet/images/traumaLOGO_2.jpg" }, { "Link": "/Files/Trauma/", "Name": "The Trauma Care of Tomorrow...Today" }],
              ["Reward and Recognition", "N", { "Link": "", "img": "http://garnetinfo/BrowseFiles/RewardAndRecognition/.page_content/Reward%20and%20Recogniton%20Logo.png" }, { "Link": "/Files/RewardAndRecognition/", "Name": "Reward and Recognition" }],
              ["Video", "N", { "Link": "", "img": "/img/videoImg.png" }, { "Link": "http://garnetinfo/Files/Marketing/", "Name": "Videos" }]

          ]
      };

      CardContainer = GHVHS.DOM.create({ "Type": "div", "Class": "CardContainer", "Id": "CardContainer", "Parent": MainContent });
      CardContainer.onmouseover = function () {
          if (document.getElementById("WeatherContainer")) {
              WeatherContainer.style.height = "65%";

              document.getElementById("BottomContainer").style.marginTop = "-15%";
              WeatherContainer.style.boxShadow = "2px 2px 8px Silver";
              document.getElementById("CalanderButton").style.display = "block";
              WeatherContainer.scrollHeight = 0;
              var getOption = document.getElementById('WeatherContainerSearchBox');
              getOption.style.display = "none";
              document.getElementById('WeatherContainerHeaderLable').style.fontSize = "18px";
              document.getElementById('WeatherContainerHeaderLable').style.paddingTop = "1%";
              var getAllTable = document.getElementById('canvas').querySelectorAll(".SingleWeatherSmall");
              for (var i = 0; i < getAllTable.length; i++) {
                  getAllTable[i].className = "SingleWeatherSmall";
              }
              document.getElementById('TableWeather').className = "TableWeather";
              var setTime = setTimeout(function () {
                  if (document.getElementById('WeatherContainer').style.height == "18%") {
                      document.getElementById('WeatherContainerBody').scrollHeight = "0";
                      document.getElementById('WeatherContainerBody').style.overflow = "hidden";
                  }
              }, 80);
              var getAllViews = document.getElementById('canvas').querySelectorAll(".SingleWeather");
              for (var j = 0; j < getAllViews.length; j++) {
                  getAllViews[j].className = "SingleWeather hide";
              }
              var getAllViews2 = document.getElementById('canvas').querySelectorAll(".SingleWeatherHourly");
              for (var j = 0; j < getAllViews2.length; j++) {
                  getAllViews2[j].className = "SingleWeatherHourly hide";
              }
          }
      }
        SideContainer = GHVHS.DOM.create({"Type":"div","Class":"SideContainer", "Id":"SideContainer", "Parent":MainContent});
        TopSideContainer = GHVHS.DOM.create({"Type":"div","Class":"TopSideContainer", "Id":"TopSideContainer", "Parent":SideContainer});
        BottomContainer = GHVHS.DOM.create({ "Type": "div", "Class": "BottomContainer", "Id": "BottomContainer", "Parent": SideContainer });

        var values = {
          "data":[]
        }
        for (var i = 0; i < links["data"].length; i++) {
            var existingCard = document.getElementById(links["data"][i][0]);
            var flag = "N";
            if (!existingCard) {
                if (links["data"][i][1] == "N") {
                    var SingleCard = GHVHS.DOM.create({ "Type": "div", "Class": "SingleCard", "Id": links["data"][i][0], "Parent": CardContainer });
                    if (document.getElementById("canvas").offsetWidth < 1350) {
                        SingleCard.style.width = "18%";
                        CardContainer.style.paddingBottom = (SingleCard.offsetHeight + 30) + "px";
                    }
                    var CardImage = GHVHS.DOM.create({ "Type": "div", "Class": "CardImage", "Id": "CardImage", "Parent": SingleCard });

                    var CardLink = GHVHS.DOM.create({ "Type": "div", "Class": "CardLink", "Id": "CardLink", "Parent": SingleCard });
                } else {
                    var SingleCard = GHVHS.DOM.create({ "Type": "div", "Class": "SingleCard", "Id": links["data"][i][0], "Parent": CardContainer });
                    var TopImage = GHVHS.DOM.create({ "Type": "div", "Class": "CardImage", "Id": "CardImage", "Parent": SingleCard });
                    var MainImage = GHVHS.DOM.create({ "Type": "img", "Class": "CImage", "Id": "CImage", "Src": links["data"][i][2], "Parent": TopImage });
                    MainImage.style.marginTop = "20px";
                    MainImage.style.marginBottom = "10px";
                    var LinkWithImage = GHVHS.DOM.create({ "Type": "div", "Class": "LinkWithImage", "Id": "LinkWithImage", "Parent": SingleCard });
                    var CardImage = GHVHS.DOM.create({ "Type": "div", "Class": "LinkImage", "Id": "LinkImage", "Parent": LinkWithImage });
                    var CardLink = GHVHS.DOM.create({ "Type": "div", "Class": "CardLink", "Id": "CardLink", "Style": "width:80%;text-align:left;", "Parent": LinkWithImage });
                    if (document.getElementById("canvas").offsetWidth < 1200) {
                        CardLink.style.width = "75%";
                    }
                    flag = "Y";
                }
            } else {
                flag = "Y";
                var LinkWithImage = GHVHS.DOM.create({ "Type": "div", "Class": "LinkWithImage", "Id": "LinkWithImage", "Parent": existingCard });
                var CardImage = GHVHS.DOM.create({ "Type": "div", "Class": "LinkImage", "Id": "LinkImage", "Parent": LinkWithImage });
                var CardLink = GHVHS.DOM.create({ "Type": "div", "Class": "CardLink", "Id": "CardLink", "Style": "width:80%;text-align:left;", "Parent": LinkWithImage });
                if (document.getElementById("canvas").offsetWidth < 1200) {
                    CardLink.style.width = "75%";
                }
            }


          for (var j = 0; j < links["data"][i].length; j++) {
            if (links["data"][i][j]["img"]) {
                var CImage = GHVHS.DOM.create({ "Type": "img", "Class": "CImage", "Id": "CImage", "Src": links["data"][i][j]["img"], "Parent": CardImage });
                if (CImage.src == "http://intranet/images/beeaward.png") {
                    CImage.onmouseover = function () {
                        this.src = "/img/beeFlap.gif";
                    }
                    CImage.onmouseout = function () {
                        this.src = "http://intranet/images/beeaward.png";
                    }

                }

                if (flag == "N") {
                    CImage.onload = function () {
                        var cL = this.parentElement.parentElement.querySelectorAll(".CardLink");
                        cL[0].style.marginTop = ((this.parentElement.parentElement.offsetHeight - (cL[0].offsetHeight + this.parentElement.offsetHeight)) / 3) + "px";
                    }
                    if (CardImage.parentElement.id == "halesmeds") {
                        CImage.style.maxWidth = "65%";
                    } else if (CardImage.parentElement.id == "Clergy") {
                        CImage.style.maxWidth = "52%";
                    } else {
                        CImage.style.marginTop = "30px";
                    }
                } else {
                    CImage.style.marginTop = "5px";
                }
            }else if (links["data"][i][j]["Name"]) {
              var CLink = GHVHS.DOM.create({"Type":"a","Class":"CLink","Href":links["data"][i][j]["Link"], "Id":"CLink", "Parent":CardLink});

              CLink.innerHTML = links["data"][i][j]["Name"];
              CArrow = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "", "Src": "http://intranet/images/right_arrow.png", "Style": "height:10px;", "Parent": CLink });
              CArrow.style.marginTop = "5px";
              CArrow.style.paddingLeft = "5px";
              if (flag == "Y"){
                  CardLink.parentElement.style.marginTop = "4%";
              }
              if (links["data"][i][j]["Name"] == "Credentialing Check") {
                  var ChromeMsg = GHVHS.DOM.create({ "Type": "div", "Class": "ChromeMsg", "Content": "Please Use Chrome", "Id": "ChromeMsg", "Parent": CardLink });
              }
              if (document.getElementById("canvas").offsetWidth < 1200) {
                  CLink.style.fontSize = "10px";
              }
              if (document.getElementById("canvas").offsetHeight < 800) {
                  CLink.style.fontSize = "11px";
              }
            }
          }
          if (document.getElementById("canvas").offsetWidth < 1500){
              SingleCard.style.height = "38%";
              SingleCard.style.width = "22%";
              CImage.style.maxWidth = "65%";
          }
          if (document.getElementById("canvas").offsetHeight < 800 ) {
              SingleCard.style.height = "48%";
          }


        }


  },
  GetNewData: function(){
    var p = [];
    GHVHS.DOM.send({ "URL": "https://api.rss2json.com/v1/api.json?rss_url=https://garnethealth.org/news-rss.xml", "Callback": GHVHS.DOM.drawNews, "CallbackParams": { Elm: p } });
  },
  NewStories: [],
  drawNews: function (json) {

      var subMainCon = GHVHS.DOM.create({ "Type": "div", "Class": "subMainCon", "Id": "subMainCon", "Parent": document.getElementById('MainContent') });
      if (document.getElementById("canvas").offsetWidth > 1500) {
          subMainCon.style.marginTop = "15%";
      }
      var newsContainer = GHVHS.DOM.create({ "Type": "div", "Class": "newsContainer", "Id": "newsContainer", "Parent": subMainCon });
      var newsContainerHeader = GHVHS.DOM.create({ "Type": "div", "Class": "newsContainerHeader", "Id": "newsContainerHeader", "Parent": newsContainer });
      newsContainerHeader.style.paddingTop = "5%";
      newsContainerHeader.style.backgroundPosition = "33% 105%";

      Arrow2 = GHVHS.DOM.create({ "Type": "img", "Class": "rightArrowUp", "Id": "rightArrowUp", "Src": "/img/blueNavArrow.png", "Parent": newsContainer });
      Arrow2.onclick = function () {
          if (GHVHS.DOM.GlobalScrollLeft > 0) {
              GHVHS.DOM.GlobalScrollLeft = 550;
              var getAll = this.parentElement.querySelectorAll(".singleNewsContainer");
              for (var i = 0; i < getAll.length; i++) {
                  var getLeft = getAll[i].style.left;
                  getLeft = getLeft.replace("px", "");
                  if ((getAll[0].offsetLeft + 150) < uploadStripContainer.offsetLeft) {
                      getAll[i].style.left = (Number(getLeft) + GHVHS.DOM.GlobalScrollLeft) + "px";
                  } else {
                      GHVHS.DOM.GlobalScrollLeft = 0;
                  }


              }
          }
      }
      var uploadStripContainer = GHVHS.DOM.create({ "Type": "div", "Class": "uploadStripContainer","Style":"height:325px;", "Id": "uploadStripContainer", "Parent": newsContainer });
      newsContainerHeader.innerHTML = " Local News:";
      if (document.getElementById("MainContent").offsetWidth > 1900) {
          uploadStripContainer.style.width = "95%";
      } else if (document.getElementById("MainContent").offsetWidth < 1330 && document.getElementById("MainContent").offsetWidth > 1200) {
          uploadStripContainer.style.width = "92%";
          newsContainerHeader.style.backgroundPosition = "24% 55%";
          newsContainerHeader.style.backgroundPosition = "30% 115%";
      } else if (document.getElementById("MainContent").offsetWidth < 1200) {
          uploadStripContainer.style.width = "90%";
          newsContainerHeader.style.backgroundPosition = "24% 55%";
          newsContainerHeader.style.backgroundPosition = "30% 125%";
      } else {
          newsContainerHeader.style.backgroundPosition = "27% 95%";
      }
      var currentZindex = 0;
      for (var i = 0; i < json["items"].length; i++) {
          var singleNewsContainer = GHVHS.DOM.create({ "Type": "div", "Class": "singleNewsContainer", "Id": "singleNewsContainer", "Parent": uploadStripContainer });
          singleNewsContainer.style.height = "88%";
          singleNewsContainer.style.width = "25%";
          singleNewsContainer.style.position = "absolute";
          singleNewsContainer.style.float = "none";
          singleNewsContainer.style.zIndex = currentZindex;
          singleNewsContainer.style.left = (((singleNewsContainer.offsetWidth + 10) * i)) + "px";
          currentZindex += 1;
          if (json["items"][i]["thumbnail"]) {
              var thumb = GHVHS.DOM.create({ "Type": "img", "Class": "Image", "Id": "", "Parent": singleNewsContainer });
              thumb.src = json["items"][i]["thumbnail"];
              var title = GHVHS.DOM.create({ "Type": "div", "Class": "fullText", "Parent": singleNewsContainer });

              var hide = GHVHS.DOM.create({ "Type": "a", "Class": "hide", "Href": json["items"][i]["link"], "Id": "hidden", "Parent": singleNewsContainer });
              title.style.textDecoration = "none";
              var checkLength = json["items"][i]["title"].split("");
              if (checkLength.length > 65) {
                  thumb.style.maxHeight = "50%";
                  title.style.height = "auto";
              }
              title.innerHTML = json["items"][i]["title"];
              title.style.fontSize = "17px";
              title.style.width = "85%";
              title.style.minHeight = "15%";
              title.style.marginLeft = "7.5%";
              title.style.fontWeight = "bold";
              var author = GHVHS.DOM.create({ "Type": "div", "Class": "fullText", "Id": "author", "Parent": singleNewsContainer });
              author.innerHTML = "Published By " + json["items"][i]["author"];
              var Published = GHVHS.DOM.create({ "Type": "div", "Class": "fullText", "Id": "Published", "Parent": singleNewsContainer });
              Published.innerHTML = json["items"][i]["pubDate"];
          } else {
              var thumb = GHVHS.DOM.create({ "Type": "img", "Class": "Image", "Id": "", "Parent": singleNewsContainer });
              thumb.src = "/img/logo.png";
              thumb.style.paddingTop = "13%";
              thumb.style.paddingBottom = "5%";
              var title = GHVHS.DOM.create({ "Type": "div", "Class": "fullText", "Parent": singleNewsContainer });
              title.style.fontWeight = "bold";
              var link = json["items"][i]["link"].toLowerCase();
              if (link.indexOf(".org/news") < 0){
                  link = link.replace(".org/", ".org/news/");
              }
              var hide = GHVHS.DOM.create({ "Type": "a", "Class": "hide", "Href": link, "Id": "hidden", "Parent": singleNewsContainer });
              title.style.textDecoration = "none";
              title.innerHTML = json["items"][i]["title"];
              title.style.fontSize = "16px";
              title.style.width = "85%";
              title.style.minHeight = "15%";
              title.style.marginLeft = "7.5%";
              var author = GHVHS.DOM.create({ "Type": "div", "Class": "fullText", "Id": "author", "Parent": singleNewsContainer });
              author.innerHTML = "Published By " + json["items"][i]["author"];
              var Published = GHVHS.DOM.create({ "Type": "div", "Class": "fullText", "Id": "Published", "Parent": singleNewsContainer });
              Published.innerHTML = json["items"][i]["pubDate"];
          }
          if (document.getElementById("canvas").offsetWidth < 1550) {
              singleNewsContainer.style.width = "25%";
              newsContainer.style.paddingBottom = (SingleCard.singleNewsContainer) + "px";
              thumb.style.maxHeight = "45%";
              title.style.fontSize = "14px";
              title.style.height = "auto";
              author.style.height = "auto";
          }
          if (document.getElementById("canvas").offsetHeight < 1000) {
              subMainCon.style.marginTop = "22%";
          }
          singleNewsContainer.onclick = function () {
              var getHide = this.querySelectorAll(".hide");
              GHVHS.DOM.drawslideUpIframe(getHide[0].href);
          };
      }
      Arrow = GHVHS.DOM.create({ "Type": "img", "Class": "LeftArrowUp", "Id": "LeftArrowUp", "Src": "/img/blueNavArrow.png", "Parent": newsContainer });
      Arrow.onclick = function () {
          if (GHVHS.DOM.GlobalScrollLeft >= 0) {
              GHVHS.DOM.GlobalScrollLeft = 550;
              var getAll = this.parentElement.querySelectorAll(".singleNewsContainer");
              for (var i = 0; i < getAll.length; i++) {
                  var getLeft = getAll[i].style.left;
                  getLeft = getLeft.replace("px", "");
                  if (getAll[getAll.length - 1].offsetLeft > this.parentElement.offsetLeft + (getAll[getAll.length - 1].offsetWidth * 4)) {
                      getAll[i].style.left = (Number(getLeft) - GHVHS.DOM.GlobalScrollLeft) + "px";
                  }


              }
          }

      }
      //GHVHS.DOM.getstaffuploads();
      document.getElementById("subMainCon").style.height = "55%";
      GHVHS.DOM.DrawFooter();
  },
  GlobalScrollLeft:0,
  GlobalJson: [],

  drawslideUpIframe: function (source, isImage, Arrows, beginLink, Elem) {
      if (!Elem) {
          Elem = 'canvas';
      }
      var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById(Elem) });

      if (!document.getElementById("top_menu")) {
          document.getElementById("MainContent").style.filter = "blur(2px)";
          document.getElementById("header").style.filter = "blur(2px)";
      }

      var X = GHVHS.DOM.create({ "Type": "img", "Class": "whiteX", "Id": "whiteX", "Src": "/img/xWhite.png", "Parent": canvas2 });
      /*X.onclick = function () {
          var broswer = GHVHS.DOM.getBrowserType();
          if (broswer == "IE") {
              window.location.href = window.location.href;
          }
          document.getElementById('canvas').removeChild(document.getElementById('canvas2'));

          if (!document.getElementById("top_menu")) {
              document.getElementById("MainContent").style.filter = "unset";
              document.getElementById("header").style.filter = "unset";
          }
      }*/
      if (Arrows) {
          var LeftArrow = GHVHS.DOM.create({ "Type": "img", "Class": "LeftArrow", "Id": "LeftArrow", "Src": "/img/downwhite.png", "Parent": canvas2 });

          LeftArrow.onclick = function () {
              var Framed = document.getElementById("IFrame");
              Framed.style.transition = "left 0.3s ease ";
              var height = setTimeout(function () {
                  if (screen.width > 1000) {
                      Framed.style.left = "3000px";
                  } else {
                      Framed.style.left = "1000px";
                  }

                  var getCal2 = Framed;
                  var changeBC = setTimeout(function () {
                      Framed.parentElement.removeChild(getCal2);
                      var framed = GHVHS.DOM.create({ "Type": "iframe", "Class": "IFrame2", "Id": "IFrame", "Style": "left:-200%;", "Parent": document.getElementById("canvas2") });
                      framed.style.transition = "left 0.3s ease ";
                      GHVHS.DOM.GlobalNumberFax = (Number(GHVHS.DOM.GlobalNumberFax) - 1) + "";

                      if (beginLink.indexOf("PTFax") > 0) {
                          var dataTemp = GHVHS.DOM.GlobalJson[Number(GHVHS.DOM.GlobalNumberFax)]["FaxPtDetailID"];
                          framed.src = beginLink + dataTemp + "?faxId=" + GHVHS.DOM.GlobalJson[Number(GHVHS.DOM.GlobalNumberFax)].FaxID;
                      } else {
                          framed.src = beginLink + GHVHS.DOM.GlobalJson[Number(GHVHS.DOM.GlobalNumberFax)].FaxID;
                      }
                      var height2 = setTimeout(function () {
                          framed.style.left = "20%";
                      }, 20);
                  }, 280);
              }, 20);
          }
          var RightArrow = GHVHS.DOM.create({ "Type": "img", "Class": "RightArrow", "Id": "RightArrow", "Src": "/img/downwhite.png", "Parent": canvas2 });
          RightArrow.onclick = function () {
              var Framed = document.getElementById("IFrame");
              Framed.style.transition = "left 0.3s ease ";
              var height = setTimeout(function () {
                  if (screen.width > 1000) {
                      Framed.style.left = "-3000px";
                  } else {
                      Framed.style.left = "-1000px";
                  }

                  var getCal2 = Framed;
                  var changeBC = setTimeout(function () {
                      Framed.parentElement.removeChild(getCal2);
                      var framed = GHVHS.DOM.create({ "Type": "iframe", "Class": "IFrame2", "Id": "IFrame", "Style": "left:200%;", "Parent": document.getElementById("canvas2") });
                      framed.style.transition = "left 0.3s ease ";
                      GHVHS.DOM.GlobalNumberFax = (Number(GHVHS.DOM.GlobalNumberFax) + 1) + "";
                      if (beginLink.indexOf("PTFax") > 0) {
                          var dataTemp = GHVHS.DOM.GlobalJson[Number(GHVHS.DOM.GlobalNumberFax)]["FaxPtDetailID"];
                          framed.src = beginLink + dataTemp + "?faxId=" + GHVHS.DOM.GlobalJson[Number(GHVHS.DOM.GlobalNumberFax)].FaxID;
                      } else {
                          framed.src = beginLink + GHVHS.DOM.GlobalJson[Number(GHVHS.DOM.GlobalNumberFax)].FaxID;
                      }
                      var height2 = setTimeout(function () {
                          framed.style.left = "20%";
                      }, 20);
                  }, 280);
              }, 20);
          }
      }
      if (isImage) {
          if (isImage == "audio") {
              var framed = GHVHS.DOM.create({ "Type": "div", "Class": "IFrame", "Id": "IFrame","Style":"background:none;", "Parent": canvas2 });
              framed.style.height = "40%";
              framed.style.backgroundcolor = "";
              framed.style.width = "40%";
              framed.style.left = "30%";
              framed.style.height = "40%";
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "lodingImg", "Id": "lodingImg", "Style": "height:50%; margin-top:10%;", "Src": "/img/mp4icon.png", "Parent": framed });
              lodingImg.style.height = "auto";
              lodingImg.style.width = framed.offsetwidth / 2 + "px";
              lodingImg.style.marginRight = "40%";
              var broswer = GHVHS.DOM.getBrowserType();
              document.getElementById("IFrame").style.backgroundColor = 'none';
              if (source.indexOf(".wav") >= 0 && broswer == "IE") {
                  var audio = GHVHS.DOM.create({ "Type": "embed", "Class": "", "Id": "IFrameAudio", "Parent": framed });
                  audio.setAttribute("controls", 1);
                  audio.setAttribute("enablejavascript", "true");
                  audio.style.width = "100%";
                  audio.style.height = "45px";
                  audio.style.marginTop = "5%";
                  audio.src = source;
                  if (source.indexOf(".wav") >= 0) {
                      lodingImg.src = "/img/waz.png";
                      var exit = GHVHS.DOM.create({ "Type": "div", "Class": "exit", "Id": "exit", "Content": "Exit", "Parent": framed });
                      exit.onclick = function () {
                          X.click();
                      }
                  }
              }else {
                  var audio = GHVHS.DOM.create({ "Type": "audio", "Class": "", "Id": "IFrameAudio", "Parent": framed });
                  audio.setAttribute("controls", 1);
                  audio.style.marginTop= "10%";
                  var source2 = GHVHS.DOM.create({ "Type": "source", "Class": "", "Id": "", "Parent": audio });
                  source2.src = source;
                  if (source.indexOf(".wav") >= 0) {
                      lodingImg.src = "/img/waz.png";
                      source2.setAttribute("type", "audio/x-wav");
                      var exit = GHVHS.DOM.create({ "Type": "div", "Class": "exit", "Id": "exit", "Content": "Exit", "Parent": framed });
                      exit.onclick = function () {
                          X.click();
                      }
                  } else if (source.indexOf(".mp3") >= 0) {
                      lodingImg.src = "/img/mp3.png";
                      var exit = GHVHS.DOM.create({ "Type": "div", "Class": "exit", "Id": "exit", "Content": "Exit", "Parent": framed });
                      exit.onclick = function () {
                          X.click();
                      }
                  }
              }


          } else if (isImage == "Flash") {
              var my_awesome_script = document.createElement('script');
              my_awesome_script.setAttribute('src', 'http://vjs.zencdn.net/c/video.js');
              document.head.appendChild(my_awesome_script);

              var framed = GHVHS.DOM.create({ "Type": "video", "Class": "IFrame", "Id": "IFrame", "Style": "background:black;", "Parent": canvas2 });

              framed.setAttribute("controls", 1);
              var soure = GHVHS.DOM.create({ "Type": "source", "Class": "source", "Id": "source", "Style": "background:none;", "Parent": framed });
              soure.type = 'video/x-flv';
              soure.src = source;

          }else {
              var framed = GHVHS.DOM.create({ "Type": "img", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
              framed.src = source;
              framed.style.height = "auto";
              framed.style.width = "40%";
              framed.style.left = "30%";
              var loding = GHVHS.DOM.create({ "Type": "div", "Class": "loding", "Id": "loding", "Parent": canvas2 });
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "lodingImg", "Id": "lodingImg", "Src": "/img/loader.gif", "Parent": loding });
              loding.style.height = framed.offsetHeight + "px";
              loding.style.width = framed.offsetwidth + "px";

              var ToNewLink = GHVHS.DOM.create({ "Type": "div", "Class": "ToNewLink", "Id": "ToNewLink", "Parent": canvas2 });
              var ToNewLinkIMG = GHVHS.DOM.create({ "Type": "img", "Class": "ToNewLinkIMG", "Id": "ToNewLinkIMG", "Src": "/img/NewLink.png", "Parent": ToNewLink });
              ToNewLink.onmouseover = function () {
                  document.getElementById("ToNewLinkIMG").style.transform = "scale(1.1)";

                  this.style.transform = "scale(1.1)";

              }
              ToNewLink.onmouseout = function () {
                  document.getElementById("ToNewLinkIMG").style.transform = "scale(1)";

                  this.style.transform = "scale(1)";

              }

              framed.onload = function () {
                  if (document.getElementById('loding')) {
                      this.parentElement.removeChild(document.getElementById('loding'));
                  }

                  var c = document.getElementById("console");

                  if (window.frameElement) {

                      document.getElementById('ToNewLink').click();
                      document.getElementById('canvas2').click();
                  }
              }
              ToNewLink.onclick = function () {
                  var s = document.getElementById("IFrame").src;
                  if (!document.getElementById("top_menu")) {
                      document.getElementById("MainContent").style.filter = "unset";
                      document.getElementById("header").style.filter = "unset";
                  }
                  window.open(s, "_blank");
              }
          }



          canvas2.onclick = function (e) {
              if (e.target.id == "whiteX") {
                  if (!document.getElementById("top_menu")) {
                      document.getElementById("MainContent").style.filter = "unset";
                      document.getElementById("header").style.filter = "unset";
                  }
                  document.getElementById('canvas').removeChild(document.getElementById('canvas2'));
              }
         }
      } else {
          var framed = GHVHS.DOM.create({ "Type": "iframe", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
          var loding = GHVHS.DOM.create({ "Type": "div", "Class": "loding", "Id": "loding", "Parent": canvas2 });
          var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "lodingImg", "Id": "lodingImg", "Src": "/img/loader.gif", "Parent": loding });
          loding.style.height = framed.offsetHeight + "px";
          loding.style.width = framed.offsetwidth + "px";
          if (source.indexOf("Fax") > 0 && source.indexOf("PTFax") <= 0 && source.indexOf("View") <= 0) {
              var ToNewLink2 = GHVHS.DOM.create({ "Type": "div", "Class": "ToNewLink", "Id": "ToNewLink", "Parent": canvas2 });
              ToNewLink2.style.bottom = "150px";
              ToNewLink2.style.backgroundColor = "#FF5733";
              var ToNewLinkIMG = GHVHS.DOM.create({ "Type": "img", "Class": "ToNewLinkIMG", "Id": "ToNewLinkIMG2", "Src": "/img/edit.png", "Parent": ToNewLink2 });
              ToNewLinkIMG.style.width = "50px";
              ToNewLinkIMG.style.height = "50px";
              ToNewLinkIMG.style.marginTop = "10px";
              ToNewLinkIMG.style.marginLeft = "25px";
              var Label = GHVHS.DOM.create({ "Type": "div", "Class": "ToNewLinkIMG", "Id": "Label", "Style": "color:white;Font-size:20px;text-align:center;", "Content": "Edit", "Parent": ToNewLink2 });
              ToNewLink2.onmouseover = function () {
                  this.style.transform = "scale(1.1)";
              }
              ToNewLink2.onmouseout = function () {
                  this.style.transform = "scale(1)";
              }
              ToNewLink2.onclick = function () {
                  window.location = source + "?edit=Y";
              }

          }
          var ToNewLink = GHVHS.DOM.create({ "Type": "div", "Class": "ToNewLink", "Id": "ToNewLink", "Parent": canvas2 });
          var ToNewLinkIMG = GHVHS.DOM.create({ "Type": "img", "Class": "ToNewLinkIMG", "Id": "ToNewLinkIMG", "Src": "/img/NewLink.png", "Parent": ToNewLink });
          ToNewLink.onmouseover = function () {
              document.getElementById("ToNewLinkIMG").style.transform = "scale(1.1)";

              this.style.transform = "scale(1.1)";

          }
          ToNewLink.onmouseout = function () {
              document.getElementById("ToNewLinkIMG").style.transform = "scale(1)";

              this.style.transform = "scale(1)";

          }
          framed.src = source;
          framed.onload = function () {
              if (document.getElementById('loding')) {
                  this.parentElement.removeChild(document.getElementById('loding'));
              }

              var c = document.getElementById("console");

              if (window.frameElement) {

                  document.getElementById('ToNewLink').click();
                  document.getElementById('canvas2').click();
              }
          }
          ToNewLink.onclick = function () {
              var s = document.getElementById("IFrame").src;
              window.open(s, "_blank");
          }
          canvas2.onclick = function (e) {
              if (e.target.id == "whiteX") {
                   if (!document.getElementById("top_menu")) {
                       document.getElementById("MainContent").style.filter = "unset";
                       document.getElementById("header").style.filter = "unset";
                      }
                   document.getElementById('canvas').removeChild(document.getElementById('canvas2'));
              }
          }
      }

  },
  getUpComingEvents:function(){
    var p = [];
    GHVHS.DOM.send({"URL":"http://ghinfo/services/sharepoint/api/GetCalendarItemsUpcoming/45/", "Callback":GHVHS.DOM.drawUpComingEvents, "CallbackParams":{Elm:p} });
  },
  drawUpComingEvents:function(json){
      if (json[0]) {
          var EventWidget = GHVHS.DOM.create({"Type":"div","Class":"EventWidget", "Id":"EventWidget","Style":"height:65%", "Parent":document.getElementById('BottomContainer')});
          var EventHeader = GHVHS.DOM.create({"Type":"div","Class":"EventHeader", "Id":"EventHeader","Content":"Upcoming Events", "Parent":EventWidget});
          var EventBody = GHVHS.DOM.create({"Type":"div","Class":"EventBody", "Id":"EventBody","Parent":EventWidget});
          var AllEventsContainer = GHVHS.DOM.create({"Type":"div","Class":"AllEventsContainer", "Id":"AllEventsContainer","Parent":EventBody});
          for (var i = 0; i < json.length; i++) {
              var singleEvent = GHVHS.DOM.create({ "Type": "div", "Class": "singleEvent2", "Id": "singleEvent", "Parent": AllEventsContainer });

              var singleEventHeader = GHVHS.DOM.create({"Type":"div","Class":"singleEventHeader", "Id":"singleEventHeader","Parent":singleEvent});
              singleEventHeader.innerHTML = json[i]["DateTitle"];
              var singleEventBody = GHVHS.DOM.create({"Type":"div","Class":"singleEventBody", "Id":"singleEventBody","Parent":singleEvent});
              var link = "http://sharepoint/ghvhscalendar/Lists/GHVHS Calendar/DispForm.aspx?ID="+json[i]["events"][0]["Id"]+"&ghv_mp=Y&ghv_title="+json[i]["events"][0]["Title"]+"&Source=http%3A%2F%2Fghinfo%2Fdefault_20170713.aspx";
              var hide = GHVHS.DOM.create({"Type":"a","Class":"hide","Href":link,"Id":"hidden", "Parent":singleEvent});
              singleEventBody.innerHTML = json[i]["events"][0]["StartTime"] + "-" + json[i]["events"][0]["Title"];
              if (document.getElementById("canvas").offsetWidth < 1200) {
                  singleEvent.style.minHeight = "35%";

              } else {
                  singleEvent.style.minHeight = "15%";
                  singleEvent.style.marginTop = "0px";
                  singleEvent.style.marginBottom = "0px";
                  singleEventBody.style.marginTop = "1%";
              }
              singleEventBody.onclick = function(){
                var getHide = this.parentElement.querySelectorAll(".hide");
                GHVHS.DOM.drawslideUpIframe(getHide[0].href);
              }
          }
      } else {
          var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "EventWidget", "Id": "EventWidget", "Style": "height:13%;", "Parent": document.getElementById('BottomContainer') });
          var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "EventHeader", "Id": "EventHeader", "Style": "height:100%;", "Content": "No Upcoming Events", "Parent": EventWidget });
          if (!document.getElementById("EventWidgetAccounments")) {
              EventWidget.style.marginTop = "15%";
          }

        }
      CalanderButton = GHVHS.DOM.create({"Type":"div","Class":"CalanderButton","Content":"Select Full Calendar","Id":"CalanderButton", "Parent":document.getElementById('BottomContainer')});
      var sideSlide = GHVHS.DOM.create({ "Type": "div", "Class": "sideSlide", "Id": "sideSlide", "Style": "height:90px;", "Parent": document.getElementById('BottomContainer') });
      var data = [{ "Link": "http://sharepoint/ghvhscalendar/Lists/GHVHS%20Calendar/GHVHS%20Events.aspx", "Name": "All Events" }, { "Link": "http://sharepoint/ghvhscalendar/Lists/GHVHS%20Calendar/CRMC%20Events.aspx", "Name": "Garnet Health Medical Center Catskills" }, { "Link": "http://sharepoint/ghvhscalendar/Lists/GHVHS%20Calendar/ORMC%20Events.aspx", "Name": "Garnet Health Medical Center" }];
      for (var i = 0; i < data.length; i++) {
          Singlelinks = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Content": data[i]["Name"], "Id": "Singlelinks", "Parent": document.getElementById('sideSlide') });
          if (document.getElementById("canvas").offsetWidth < 1550) {
              Singlelinks.style.fontSize = "13px";
          } else {
              Singlelinks.style.fontSize = "14px";
          }
          Singlelinks.style.cursor = "pointer";
        Singlelinks.onclick = function(){
          for (var j = 0; j < data.length; j++) {
            if (data[j]["Name"] == this.innerHTML) {
              CalanderButton.click();
              window.open(data[j]["Link"]);
            }
          }
        }
      }
      CalanderButton.onclick = function () {
        this.style.transform = "scale(1.05)";
        var that = this;
        var sideSlideCurrent = document.getElementById("sideSlide");
        var anotherone = setTimeout(function(){
            that.style.transform = "scale(1.00)";
        },40);
        if (sideSlideCurrent.style.width != "55%") {
            sideSlideCurrent.style.width = "55%";
            sideSlideCurrent.style.border = "1px solid silver";
            var time = setTimeout(function(){
            var lks = sideSlideCurrent.querySelectorAll(".hide");
            for (var g = 0; g < lks.length; g++) {
                lks[g].className = "Singlelinks";
            }
          },100);
        }else {
            sideSlideCurrent.style.width = "0";
            sideSlideCurrent.style.border = "none";
            var time = setTimeout(function(){
            var lks = sideSlideCurrent.querySelectorAll(".Singlelinks");
            for (var g = 0; g < lks.length; g++) {
              lks[g].className = "hide";
            }
          },100);
        }
      }

  },
  getAccounments: function () {
      var p = [];
      GHVHS.DOM.send({ "URL": "http://ghinfo/services/sharepoint/api/GetAnnouncements", "Callback": GHVHS.DOM.drawAccounments, "CallbackParams": { Elm: p } });
  },
  drawAccounments: function (json) {

      if (json[0]) {
          var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "EventWidget", "Id": "EventWidgetAccounments", "Style": "height:60%;Margin-Top:5%;", "Parent": document.getElementById('BottomContainer') });
          if (!document.getElementById("WeatherContainer")){
              document.getElementById("BottomContainer").style.marginTop = "10%";
          }
          var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "EventHeader", "Id": "EventHeader", "Style": "height:13%;", "Content": "Announcements", "Parent": EventWidget });
          var EventBody = GHVHS.DOM.create({ "Type": "div", "Class": "EventBody", "Id": "EventBody", "Parent": EventWidget });
          var AllEventsContainer = GHVHS.DOM.create({ "Type": "div", "Class": "AllEventsContainer", "Id": "AllEventsContainer", "Parent": EventBody });
          for (var i = 0; i < json.length; i++) {
              var singleEvent = GHVHS.DOM.create({ "Type": "div", "Class": "singleEvent", "Id": "singleEvent", "Style": "margin-top:0.5%;margin-bottom:4%;", "Parent": AllEventsContainer });
              if (document.getElementById("canvas").offsetWidth < 1500 && i > 0) {
                  singleEvent.style.marginTop = "4.5%";
              }
              var singleEventBody = GHVHS.DOM.create({ "Type": "div", "Class": "singleEventBody", "Id": "singleEventBody", "Style": "padding-bottom:0.5%;padding-top:0.5%;", "Parent": singleEvent });
              var link = "http://sharepoint/ghvhscalendar/Lists/GHVHS%20Announcements/DispForm.aspx?ID=" + json[i]["Id"] + "&ghv_mp=Y&ghv_title=" + json[i]["Title"] + "&Source=http%3A%2F%2Fghinfo%2Fdefault_20170713.aspx";
              var hide = GHVHS.DOM.create({ "Type": "a", "Class": "hide", "Href": link, "Id": "hidden", "Parent": singleEvent });
              singleEventBody.innerHTML = json[i]["Title"];
              singleEventBody.onclick = function () {
                  var getHide = this.parentElement.querySelectorAll(".hide");
                  GHVHS.DOM.drawslideUpIframe(getHide[0].href);
              }
          }
      } else {
          var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "EventWidget", "Id": "EventWidgetAccounments", "Style": "height:13%;Margin-Top:5%;", "Parent": document.getElementById('BottomContainer') });
          var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "EventHeader", "Id": "EventHeader", "Style": "height:100%;", "Content": "No Announcements", "Parent": EventWidget });
          if (!document.getElementById("WeatherContainer")) {
              if (!document.getElementById("EventWidget")) {
                  EventWidget.style.marginTop = "15%";
              }
          }
      }

      var CalanderButton2 = GHVHS.DOM.create({ "Type": "div", "Class": "CalanderButton", "Content": "Select Announcements", "Style": "margin-bottom:2%;", "Id": "CalanderButton2", "Parent": document.getElementById('BottomContainer') });
      if (document.getElementById("canvas").offsetWidth < 1500 && document.getElementById("canvas").offsetWidth > 1250) {
          CalanderButton2.style.fontSize = "15px";

      } else if (document.getElementById("canvas").offsetWidth < 1250) {
          CalanderButton2.style.fontSize = "13px";
      }
      var sideSlide2 = GHVHS.DOM.create({ "Type": "div", "Class": "sideSlide", "Id": "sideSlide2", "Style":"height:90px;", "Parent": document.getElementById('BottomContainer') });

      var data = [{ "Link": "http://sharepoint/ghvhscalendar/Lists/GHVHS%20Announcements/GHVHS%20Announcements.aspx", "Name": "All Announcements " }, { "Link": "http://sharepoint/ghvhscalendar/Lists/GHVHS%20Announcements/CRMC%20Announcement.aspx", "Name": "Garnet Health Medical Center Catskills" }, { "Link": "http://sharepoint/ghvhscalendar/Lists/GHVHS%20Announcements/ORMC%20Announcement.aspx", "Name": "Garnet Health Medical Center" }];
      for (var i = 0; i < data.length; i++) {
          Singlelinks = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Content": data[i]["Name"], "Id": "Singlelinks", "Parent": document.getElementById('sideSlide2') });
       if (document.getElementById("canvas").offsetWidth < 1550) {
           Singlelinks.style.fontSize = "13px";
       } else {
           Singlelinks.style.fontSize = "14px";
       }
       Singlelinks.style.cursor = "pointer";
          Singlelinks.onclick = function () {
              for (var j = 0; j < data.length; j++) {
                  if (data[j]["Name"] == this.innerHTML) {
                      CalanderButton2.click();
                      window.open(data[j]["Link"]);
                  }
              }
          }
      }
      CalanderButton2.onclick = function () {
          this.style.transform = "scale(1.05)";
          var anotherone = setTimeout(function () {
              CalanderButton2.style.transform = "scale(1.00)";
          }, 40);
          if (sideSlide2.style.width != "55%") {
              sideSlide2.style.width = "55%";
              sideSlide2.style.border = "1px solid silver";
              var time = setTimeout(function () {
                  var lks = sideSlide2.querySelectorAll(".hide");
                  for (var g = 0; g < lks.length; g++) {
                      lks[g].className = "Singlelinks";
                  }
              }, 100);
          } else {
              sideSlide2.style.width = "0";
              sideSlide2.style.border = "none";
              var time = setTimeout(function () {
                  var lks = sideSlide2.querySelectorAll(".Singlelinks");
                  for (var g = 0; g < lks.length; g++) {
                      lks[g].className = "hide";
                  }
              }, 100);
          }
      }

  },
  drawClearButton:function(filter){
      var getInput = filter;
      var clearButton = GHVHS.DOM.create({ "Type": "div", "Class": "Clearbutton", "Id": "Clearbutton", "Content": "Clear", "Parent": filter.parentElement });
      clearButton.style.width = "1px";
      clearButton.style.transition = "width 0.3s ease-out";
      clearButton.style.position = "absolute";
      clearButton.style.fontWeight = "bold";
      clearButton.style.height = (getInput.offsetHeight -10)  + "px";
      clearButton.style.left = (getInput.offsetLeft + getInput.offsetWidth) + "px";
      clearButton.style.top = (getInput.offsetTop ) + "px";
      clearButton.style.width = "40px";
      clearButton.style.width = "40px";
      clearButton.style.cursor = "pointer";
      clearButton.style.paddingTop = "10px";
      clearButton.style.boxShadow = "2px 2px 6px grey";
      clearButton.onmouseover = function () {
          var clicked = this.id.split("||");
          getInput.style.border = "1px solid blue";
          getInput.style.backgroundImage = "URL(/img/x.png)";

      }
      clearButton.onmouseout = function () {
          getInput.style.border = "1px solid silver";
          getInput.style.backgroundImage = "url(/img/blueSearch.png)";

      }
      clearButton.onclick = function () {
          getInput.value = "";
          getInput.click();
          getInput.style.border = "1px solid silver";
          getInput.style.backgroundImage = "url(/img/blueSearch.png)";
          this.style.width = "1px";
          var that = this;
          var deleted = setTimeout(function () {

              getInput.parentElement.removeChild(that);
          }, 100);
      }
  },
  getAudioFiles: function () {
      var url = window.location.href.split("/MediaFiles");
      var getParts = url[1].split("/");
      var ajaxUrl = "";
      if (getParts.length > 2) {
          ajaxUrl = "?route=" + getParts[1] + "&path=" + getParts[2];
      } else {
          var thisurl = url[1].replace("/","");
          ajaxUrl = "?route=" + thisurl;
      }
      GHVHS.DOM.send({ "URL": "http://sqldev/MediaFiles/getFileLinks" + ajaxUrl, "Callback": GHVHS.DOM.ScanAudioFiles, "CallbackParams": [] });
  },
  ScanAudioFiles:function(json){
      var root = json["fileModel"];
      var mainElem = GHVHS.DOM.create({ "Type": "div", "Class": "FileElem", "Id": "FileElem", "Style": "width:80%;", "Parent": document.getElementById("canvas") });
      var linkObj = root["links"].split("||");
      var ContentObj = root["Content"].split("||");
      var newContent = "";
      var newLinks = "";
      var CObj = [];
      var lObj = [];

      var dateToCompare;
      for (var j = 0; j < ContentObj.length; j++) {
              CObj.unshift(ContentObj[j]);
              lObj.unshift(linkObj[j]);

      }
      for (var j = 0; j < CObj.length; j++) {
          newContent += CObj[j] + "||";
          newLinks += lObj[j] + "||";
      }
      GHVHS.DOM.ScanFiles(json, mainElem)
  },
  getFiles: function (route, path) {

      GHVHS.DOM.send({ "URL": "/GetFiles/Files?route=" + route + "&path=" + path, "Callback": GHVHS.DOM.ScanFiles, "CallbackParams": document.getElementById('Files') });
  },
  GlobalLinkObj: [],
  DrawContacts:function(Contacts, Element){
      var backg = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "sidebackground", "Style": "z-index:7000000000000000000000000009;display:none", "Parent": document.getElementById("canvas") });
      backg.onclick = function () {
          document.getElementById("menu").click();
      }
      SideMenu = GHVHS.DOM.create({ "Type": "div", "Class": "ContactMenu", "Id": "SideMenu", "Parent": document.getElementById("canvas") });

      var menu = GHVHS.DOM.create({ "Type": "img", "Src": "/img/menu.png", "Class": "menubutton", "Id": "menu", "Parent": SideMenu });
      menu.onclick = function () {
          var getMenu = document.getElementById("SideMenu");
          getMenu.style.left = "-2000px";
          if (document.getElementById("sidebackground").style.display == "block") {
              setTimeout(function () {
                  document.getElementById("sidebackground").style.display = "none";
              }, 10);
              document.getElementById("canvas").style.overflowY = "auto";
          }
      }
      if (Contacts.contacts.section.length != null) {
          for (var j = 0; j < Contacts.contacts.section.length; j++) {
              Section = GHVHS.DOM.create({ "Type": "div", "Class": "Section", "Id": "Section", "Parent": SideMenu });
              if (j == 0){
                  Section.style.border = "none";
              }
              SectionTitle = GHVHS.DOM.create({ "Type": "div", "Class": "SectionTitle", "Id": "SectionTitle", "Parent": Section });
              if (Contacts.contacts.section[j]["@title"]) {
                  SectionTitle.innerHTML = Contacts.contacts.section[j]["@title"];
              } else {
                  SectionTitle.innerHTML = Contacts.contacts.section[j]["title"];
              }
            if ( Array.isArray(Contacts.contacts.section[j].contact) == true){
                for (var i = 0; i < Contacts.contacts.section[j].contact.length; i++) {

                    Contact = GHVHS.DOM.create({ "Type": "div", "Class": "Contact", "Id": "Contact", "Parent": Section });
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/greyCarrot.png", "Style": "height:15px;transform:rotate(270deg);", "Parent": Contact });

                    Contact.innerHTML += Contacts.contacts.section[j].contact[i];
                }
            }else{
                Contact = GHVHS.DOM.create({ "Type": "div", "Class": "Contact", "Id": "Contact", "Parent": Section });
                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/greyCarrot.png", "Style": "height:15px;transform:rotate(270deg);", "Parent": Contact });
                Contact.innerHTML += Contacts.contacts.section[j].contact;
            }

          }
      } else {
          Section = GHVHS.DOM.create({ "Type": "div", "Class": "Section", "Id": "Section","Style":"border:none;", "Parent": SideMenu });
          SectionTitle = GHVHS.DOM.create({ "Type": "div", "Class": "SectionTitle", "Id": "SectionTitle", "Parent": Section });
          if (Contacts.contacts.section["@title"]) {
              SectionTitle.innerHTML = Contacts.contacts.section["@title"];
          } else {
              SectionTitle.innerHTML = Contacts.contacts.section["title"];
          }
          for (var i = 0; i < Contacts.contacts.section.contact.length; i++) {
              Contact = GHVHS.DOM.create({ "Type": "div", "Class": "Contact", "Id": "Contact", "Parent": Section });
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/greyCarrot.png", "Style": "height:15px;transform:rotate(270deg);", "Parent": Contact });
              Contact.innerHTML += Contacts.contacts.section.contact[i];

          }
      }

  },
  drawFilesSearch:function(optionElem){
      Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "transition: height .25s ease; display:none; height:1px;text-align:center;margin-top:0.5%;margin-left:22.5%;Width:55%;margin-bottom:0px;", "Parent": optionElem });
      Filter.setAttribute("placeholder", "Type To Search Current Page....");
      Filter.setAttribute("autocomplete", "Off");
      Filter.onfocus = function () {

          this.style.boxShadow = "2px 2px 6px grey";
      }
      Filter.onblur = function () {
          this.style.boxShadow = "0px 0px 0px grey";
      }
      Filter.onclick = function () {
          if (this.value == "") {
              var getFilesBody = document.getElementById("Files");
              var getLinks = getFilesBody.querySelectorAll(".SingleDivFilelinks, .SingleFilelinks");
              for (var j = 0; j < getLinks.length; j++) {
                  getLinks[j].style.display = "block";
              }
          }
      }
      Filter.onkeyup = function () {
          var getClearbutt = document.getElementById("Clearbutton");
          if (this.value != "") {
              this.style.boxShadow = "2px 2px 6px grey";
              if (!getClearbutt) {
                  GHVHS.DOM.drawClearButton(this);
              }
          } else {
              if (getClearbutt) {
                  getClearbutt.click();
              }
          }
          var getFilesBody = document.getElementById("Files");
          var getLinks = getFilesBody.querySelectorAll(".SingleDivFilelinks, .SingleFilelinks");
          var value = this.value.toLowerCase();
          for (var j = 0; j < getLinks.length; j++){
              var linkContent = getLinks[j].innerText.toLowerCase();
              if (value != "") {
                  if (linkContent.indexOf(value) >= 0) {
                      getLinks[j].style.display = "block";
                  } else {
                      getLinks[j].style.display = "none";
                  }
              } else {
                  getLinks[j].style.display = "block";
              }
          }

      }
  },
  getFileToScan: function (route, path, Elem) {
      var d = new Date();
      var n = d.getTime();
      GHVHS.DOM.send({ "URL": "/GetFiles/TestNewFiles?route=" + route + "&path=" + path + "&Dummy=" + n, "Callback": GHVHS.DOM.ScanFiles, "CallbackParams": [route, path, Elem] });

  },


  ScanFiles: function (json, p) {
      var route = p[0];
      var path = p[1];
      var Elem = p[2];
      if (document.getElementById("LoadingFiles")) {
          Elem.removeChild(document.getElementById("LoadingFiles"));
      }
      json = json.fileModel;
      var AllFiles = GHVHS.DOM.decodeJson(json.files, "Y");
      var sites = JSON.parse(json.websites);
      var Contacts = JSON.parse(json.Contacts);
      var pageSections = JSON.parse(json.pageSections);
      var Titlel = json.Title;
      if (!Titlel) {
          Titlel = json.route;
      }
      var Images = json.Images;
      var SubHeader = json.SubHeader;
      if (route == "Quality") {
          SubHeader = "<span style='font-size:14pt'>Have a Patient Safety Concern? Email <a href='mailto:QualityReferrals@garnethealth.org' style='text-decoration:underline'>QualityReferrals@garnethealth.org (GHMC)</a>";
          SubHeader += " or <a href='mailto:QualityResources@garnethealth.org' style='text-decoration:underline'>QualityResources@garnethealth.org (GHMC  Catskills)</a></span>";
      } else if (route == "AuditCompliance" ) {
          SubHeader = "<div style = 'width:70%;margin-left:15%;padding-top:1%;padding-bottom:1%;border-radius:10px;background-color:white; border:1px solid silver;><br><div style='width:100%; text-align:center;margin-top:-30px;'>";
          SubHeader += "<span id='ccat'>Report concerns online at <a href='http://www.hotline-services.com' style='text-decoration:underline' target=''>http://www.hotline-services.com</a>";
          SubHeader += "<br><br> Or <br><br> Click the HSC button below:</span><br>";
          SubHeader += "<span style=''><br><br><div style='width:100%; text-align:center;margin-top:-30px'><a href='https://www.complianceresource.com/hotline/' target='dotherightthing' title='Click here to access the Hotline Service Center login portal'><img src='/img/hotline.png'></a></div>";
          SubHeader += "</div></span><br><div style='width:100%; text-align:center;font-size:12pt;'><span >You can also report a compliance concern by emailing:</span></div> <span id='ccat_email'><a href='mailto:dotherightthing@garnethealth.org'>dotherightthing@garnethealth.org</a></span><br><br>";
          Images = "http://ghinfo/images/WME_Current.png||" + Images + "http://ghinfo/images/wmec125pxW.jpg||";
      } else if (path == "Daisy Award/") {
          Images = "http://intranet.ormc.org//BrowseFiles/Nursing/.page_content/DaisyLogo.jpg||";
          SubHeader = "Daisy Award honorees personify Orange Regional Medical Center's remarkable patient experience. These nurses consistently demonstrate excellence through their clinical expertise and extraordinary compassionate care, and they are recognized as outstanding role models in out nursing community.";
      } else if (route == "CME") {
          SubHeader = "The Continuing Medical Education mission of our organization is to educate our physicians and healthcare team with innovative, evidence based content in order to reduce professional practice gaps, and improve patient care and satisfaction by providing our healthcare team with opportunities to learn and improve medical knowledge and skills";
          Images = "";
      } else if (route == "ODL") {
          SubHeader = "Contact <a href='mailto:ODL@garnethealth.org' style='text-decoration:underline'>ODL@garnethealth.org</a> for HealthStream assistance"
          Images = "http://intranet.ormc.org/BrowseFiles/ODL/1%20-%20Contact%20Information.png||";
          Contacts = {
              "contacts": {"section": { "@title": "The ODL Team","contact": [
                          "Scott Bush, Sr Specialist - Ext 0223",
                          "Elizabeth DiDomenico-Conklin, Specialist - Ext 0226",
                          "Dorothy Heilbrunn, Sr Specialist - 845-794-3300 Ext 2816",
                          "Naomi Lippin, Manager - Ext 0228",
                          "Lorin Mask, Director - Ext 0227 | Cell:914-648-9821"] }}};
      }else if (route == "FujiPACS"){
          Images = "http://ghinfo/images/fujifilm.jpg||";
      } else if (route == "healthstream") {
          Titlel = "HealthStream";
          Images = "http://intranet.ormc.org/BrowseFiles/healthstream/.page_content/healthstream.jpg||";
      } else if (route == "EmployeeHealth") {
          Titlel = "Occupational Health";
          Images = "https://www.gannett-cdn.com/presto/2020/06/30/NTHR/5c5250b5-2240-47d5-9dc1-ed85aed55b56-erbgarnethealth02-.jpg||";
          SubHeader = "<br> Contact <a href='mailto:employeehealth@garnethealth.org' style='text-decoration:underline'>employeehealth@garnethealth.org</a> for Occupational Health assistance";
      }
      if (Titlel == "GHVHS Weekly Meetings") {
          Titlel = "Garnet Health Weekly Meetings";
      }
      if (Titlel == "AuditCompliance") {
          Titlel = "Compliance, Audit & HIPAA Privacy";
      }

      var optionElem;
      if (!Elem) {
          optionElem = document.getElementById('MainContent');
      }else {
          optionElem = Elem;
      }

      var CenterAllImages = 0;
      if (Titlel) {
          var TitleElement = GHVHS.DOM.create({ "Type": "div", "Class": "TitleElement", "Id": "TitleElement", "Parent": optionElem });
          var Title = GHVHS.DOM.create({ "Type": "div", "Class": "Title", "Id": "Title", "Parent": TitleElement });
          var newT = Titlel.replace("&amp;", "&");
          Title.innerHTML = newT;
          if (Contacts) {
              var ContactsImg = GHVHS.DOM.create({ "Type": "img", "Class": "ContactsImg", "Id": "ContactsImg", "Src": "/img/ContactsIcon.png", "Parent": TitleElement });
              GHVHS.DOM.DrawContacts(Contacts);
              ContactsImg.onclick = function () {
                  var getMenu = document.getElementById("SideMenu");
                  getMenu.style.left = "0px";
                  document.getElementById("SideMenu").style.top = document.getElementById("canvas").scrollTop + "px";
                  if (document.getElementById("sidebackground").style.display == "none") {
                      setTimeout(function () {
                          document.getElementById("sidebackground").style.display = "block";
                      }, 10);
                      document.getElementById("canvas").style.overflowY = "hidden";
                  }
              }
          } else {
              Title.style.width = "90%";
              Title.style.marginLeft = "3%";
          }
          var ContactsImg2 = GHVHS.DOM.create({ "Type": "img", "Class": "ContactsImg", "Id": "ContactsImg2","Style":"width:4%;margin-top:0.5%;", "Src": "/img/blueSearchIcon.png", "Parent": TitleElement });
          ContactsImg2.onclick = function () {
              if (this.className == "ContactsImg") {
                  this.className = "ContactsImgSelected";
                  var getFilter = document.getElementById("Filter");
                  getFilter.style.display = "block";
                  setTimeout(function () {
                      getFilter.style.height = "40px";
                  }, 10);
              } else {
                  this.className = "ContactsImg";
                  this.style.width = "4%";
                  this.style.marginTop = "0.5%";
                  var getFilter = document.getElementById("Filter");
                  getFilter.style.height = "1px";
                  if (document.getElementById("Clearbutton")){
                      document.getElementById("Clearbutton").click();
                  }
                  setTimeout(function () {
                      getFilter.style.display = "none";
                  }, 200);
              }
          }
      }
      GHVHS.DOM.drawFilesSearch(optionElem);


      if (Images) {
          var allImages = Images.split("||");
          var ImageContainer = GHVHS.DOM.create({ "Type": "div", "Class": "ImageContainer", "Id": "ImageContainer", "Parent": optionElem });
          for (var i = 0; i < allImages.length - 1; i++) {
              SingleImageContainer = GHVHS.DOM.create({ "Type": "img", "Class": "SingleImageContainerDouble", "Id": i + "", "Parent": ImageContainer });
              if (allImages.length - 1 == 1) {
                  SingleImageContainer.style.marginLeft = (window.offsetWidth - SingleImageContainer.offsetWidth) + "px";
              }
              SingleImageContainer.src = allImages[i];
              SingleImageContainer.style.maxHeight = ImageContainer.offsetHeight + "px";
              if (allImages.length-1 == 1) {
                  SingleImageContainer.className = "SingleImageContainerSingle";
                  if (route == "EmployeeHealth") {
                      SingleImageContainer.style.maxHeight = "200px";
                      ImageContainer.style.height = "200px";
                  }
              } else if (allImages.length - 1 == 2) {
                  SingleImageContainer.className = "SingleImageContainerDouble";
                  if (route == "EmployeeHealth") {

                      SingleImageContainer.style.marginLeft = "20%";
                      if (i == 1) {
                          SingleImageContainer.style.marginLeft = "20%";
                      }
                  }


              } else if (allImages.length - 1 >= 3) {
                  SingleImageContainer.className = "SingleImageContainerTripple";
                  if (route == "Nursing") {
                      SingleImageContainer.style.marginLeft = "16.5%";
                  } else if (route == "AuditCompliance" ) {
                      SingleImageContainer.style.marginLeft = "20%";
                      if (i == 2 || i == 0) {
                          SingleImageContainer.style.maxHeight = "80px";
                          SingleImageContainer.style.marginTop = "25px";
                      }
                  }else if (route == "EmployeeHealth"){
                      if ( i == 2) {
                          SingleImageContainer.style.maxHeight = "80px";
                          SingleImageContainer.style.marginTop = "25px";
                      } else if (i == 1) {
                          SingleImageContainer.style.maxHeight = "70px";
                          SingleImageContainer.style.marginTop = "25px";
                      }
                      SingleImageContainer.style.marginLeft = "5%";
                  }
              }
              /*SingleImageContainer.onload = function () {
                  if (this.offsetHeight < (document.getElementById("ImageContainer").offsetHeight - 60)) {
                      this.style.marginTop = ((document.getElementById("ImageContainer").offsetHeight - this.offsetHeight) / 2) + "px";
                  }
                  CenterAllImages += this.offsetWidth + "px";
                  if (allImages.length - 1 == 1) {
                      this.style.marginLeft = ((document.getElementById("ImageContainer").offsetWidth - this.offsetWidth)/2) + "px";
                  }
                  if (allImages.length - 1 == 2) {
                      document.getElementById("ImageContainer").style.width = "50%";
                      document.getElementById("ImageContainer").style.marginLeft = "25%";
                      this.style.marginLeft = "24%";
                  }else if (this.id == allImages.length - 2) {
                      document.getElementById("ImageContainer").style.width = CenterAllImages + "px";
                      document.getElementById("ImageContainer").style.marginLeft = (window.offsetWidth - CenterAllImages) + "px";
                  }

              }*/
              SingleImageContainer.onclick = function () {
                  if (this.src == "http://intranet.ormc.org//BrowseFiles/HR/.page_content/cmore.jpg") {
                      window.open("https://cmore.ormc.org/lawson/portal/");
                  } else if (this.src == "http://intranet.ormc.org//BrowseFiles/Nursing/.page_content/NICHE_Banner.jpg") {
                      window.open("http://www.nicheprogram.org/");
                  } else if (this.src == "http://intranet.ormc.org//BrowseFiles/Nursing/.page_content/DaisyLogo.jpg") {
                      window.open("/Files/Nursing/Daisy%20Award/");
                  } else {
                      var linktoIframe = this.src;
                      GHVHS.DOM.drawslideUpIframe(linktoIframe, "Y");
                  }

              }
          }

      }

      if (SubHeader) {

          var SubHeaders = GHVHS.DOM.create({ "Type": "div", "Class": "SubHeader", "Id": "SubHeader", "Parent": optionElem });
          SubHeaders.style.height = "auto";
          var SubHeaderhide = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "SubHeaderhide", "Parent": optionElem });
          var newT = SubHeader.replace("&amp;", "&");
          if (route == "AuditCompliance") {
              var phoneMessage = GHVHS.DOM.create({
                  "Type": "div", "Class": "phoneMessage", "Id": "phoneMessage",
                  "Content": "Anonymous Compliance Hotline Number - 845-333-HERO (4376)", "Parent": SubHeaders
              });
              SubHeaders.innerHTML += SubHeader;
              SubHeaders.style.fontSize = "120%";
          } else if (route == "EmployeeHealth") {
              var phoneMessage = GHVHS.DOM.create({ "Type": "div", "Class": "OCH", "Id": "OCH", "Content": "", "Parent": SubHeaders });
              phoneMessage.innerHTML = "The Occupational Health number: <a href='callto:333 2060' style='text-decoration:underline'>333-2060</a> <br>";
              phoneMessage.innerHTML += "<br> The Catskill Number: <a href='callto:845 794 3300 2073'>(845)-794-3300-2073</a> <br><br> The Fax for both- <a href='callto:845 333 2063' style='text-decoration:underline'>(845)-333-2063</a><br>";
              phoneMessage.innerHTML += "<br> Business hours for Middletown Mon-Friday 7am to 4:30pm <br>"
              SubHeaders.innerHTML += SubHeader;
              SubHeaders.style.fontSize = "120%";
          } else {
              SubHeaders.innerHTML = SubHeader;
          }

          if (route == "AuditCompliance") {
              SubHeaders.style.height = "auto";
              SubHeaders.style.paddingBottom = "0%";
              SubHeaders.style.paddingTop = "0.1%";
          }
      }

      var getDirectory = window.location.href.split("/Files/");
      if (Elem.id != "Files") {
          getDirectory = window.location.href.split("/MediaFiles/");
      }
      var NewURL2 = getDirectory[1].replace("%20", " ");
      var NewURL3 = NewURL2.replace("%20", " ");
      var NewURL4 = NewURL3.replace("%20", " ");
      var NewURL5 = NewURL4.replace("%20", " ");
      var NewURL6 = NewURL5.replace("%20", " ");
      var NewURL7 = NewURL6.replace("%20", " ");
      var NewURL = NewURL7.replace("%20", " ");
      var getDirectoryParts = NewURL.split("/");
      if (getDirectoryParts.length > 2) {
          var BreadCrumbs = GHVHS.DOM.create({ "Type": "div", "Class": "BreadCrumbs", "Id": "BreadCrumbs", "Parent": optionElem });
         for (var i = 0; i < getDirectoryParts.length -1  ; i++) {
             if (i == 0){
                 SinglelinksSmall = GHVHS.DOM.create({ "Type": "a", "Class": "SinglelinksSmall", "Href": "/Files/" + getDirectoryParts[i] + "/", "Content": getDirectoryParts[i] + " /", "Id": "SingleFilelinks", "Parent": BreadCrumbs });
                 SinglelinksSmall.innerHTML = Titlel +" /";
                 SinglelinksSmall.style.borderTopLeftRadius= "7px";
                 SinglelinksSmall.style.borderBottomLeftRadius= "7px";

             } else if (i < getDirectoryParts.length - 2) {
                 var subURL = "";
                 for (var j = 0; j < getDirectoryParts.length - 1  ; j++) {
                     if (j < i) {
                         subURL = subURL+ getDirectoryParts[j] + "/";
                     }
                 }
                 SinglelinksSmall = GHVHS.DOM.create({ "Type": "a", "Class": "SinglelinksSmall", "Href": "/Files/" + subURL + getDirectoryParts[i] + "/",  "Id": "SingleFilelinks", "Parent": BreadCrumbs });
                 var content = decodeURI(getDirectoryParts[i].replace("()(","&") + " /");
                 content = content.replace(".expand","");
                 SinglelinksSmall.innerHTML = content;
             } else {
                 SinglelinksSmall = GHVHS.DOM.create({ "Type": "div", "Style": "color:grey;", "Class": "SinglelinksSmall", "Id": "SingleFilelinks", "Parent": BreadCrumbs });
                 var content = decodeURI(getDirectoryParts[i].replace("()(", "&") + " /");
                 content = content.replace(".expand", "");
                 SinglelinksSmall.innerHTML = content;
             }

         }
      }
      var filesTitle = "Files";
      var foldersTitle = "Folders";
      var websiteTitle = "Websites";
      var firstsection = "folders";
      if (pageSections) {
          for (var k = 0; k < pageSections.sections["section"].length; k++) {
              if (k == 0) {
                  firstsection = pageSections.sections["section"][k]["@id"].toLowerCase();
              }
              if (pageSections.sections["section"][k]["@id"].toLowerCase() == "folders") {
                  foldersTitle = pageSections.sections["section"][k]["@title"];
                  var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Id": "FoldersWidget", "Parent": optionElem });
                  var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader", "Content": foldersTitle, "Parent": EventWidget });
                  var FoldersBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "Folders", "Parent": EventWidget });


              } else if (pageSections.sections["section"][k]["@id"].toLowerCase() == "files") {
                  filesTitle = pageSections.sections["section"][k]["@title"];
                  var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Id": "FilesWidget", "Parent": optionElem });
                  var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader", "Content": filesTitle, "Parent": EventWidget });
                  var EventBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "FilesBody", "Parent": EventWidget });

              } else if (pageSections.sections["section"][k]["@id"].toLowerCase() == "websites") {
                  websiteTitle = pageSections.sections["section"][k]["@title"];
                  var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Id": "SitesWidget", "Parent": optionElem });
                  var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader", "Parent": EventWidget });
                  EventHeader.innerHTML = decodeURI(websiteTitle);
                  var EventBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "sitesBody", "Parent": EventWidget });
              }
          }
      }
      if (!document.getElementById("Folders")) {
          var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Id": "FoldersWidget", "Parent": optionElem });
          var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader", "Content": "Folders", "Parent": EventWidget });
          var FoldersBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "Folders", "Parent": EventWidget });
      }
      if (!document.getElementById("FilesBody")) {
          var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Id": "FilesWidget", "Parent": optionElem });
          var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader", "Content": "Files", "Parent": EventWidget });
          var EventBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "FilesBody", "Parent": EventWidget });
      }
      if (!document.getElementById("sitesBody")) {
          var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Id": "SitesWidget", "Parent": optionElem });
          var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader", "Parent": EventWidget });
          EventHeader.innerHTML = decodeURI("Websites");
          var EventBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "sitesBody", "Parent": EventWidget });
      }

      GHVHS.DOM.drawFilesAndFolders(AllFiles, optionElem, foldersTitle, filesTitle, route);
      GHVHS.DOM.drawWebsiteFolder(sites, optionElem, websiteTitle, route);
  },
  drawWebsiteFolder: function (sites, optionElem, websiteTitle) {
      FoldersBody = document.getElementById("sitesBody");
      for (var i = 0; i < sites.length; i++) {
          if (sites[i].ParentContent != null) {
              if (!document.getElementById(sites[i].ParentContent)) {
                  folderHolder = GHVHS.DOM.create({ "Type": "div", "Class": "folderHolder", "Id": sites[i].ParentContent, "Parent": FoldersBody });
                  var Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleFilelinks", "Id": i, "Parent": folderHolder });
                  Singlelinks.style.paddingLeft = "1px";
                  var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/blueFolder.png", "Style": "Height:25px", "Parent": Singlelinks });
                  var split = sites[i].ParentContent.split("/");
                  var ContentLink = split[split.length - 2].replace(".expand", "");
                  Singlelinks.innerHTML += ContentLink;
                  Singlelinks.href = "/Files" + sites[i].ParentLink;
              } else {
                  EventBody = document.getElementById(sites[i].ParentContent);
              }
          } else {
              EventBody = document.getElementById("sitesBody");
          }
          GHVHS.DOM.AllLinks.push({ "Link": sites[i].link, "Content": sites[i].Content });
          Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleFilelinks", "Href": sites[i].link, "Id": "SingleFilelinks", "Parent": EventBody });
          var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/www.png", "Style": "Height:25px", "Parent": Singlelinks });
          Singlelinks.setAttribute("Target", "_blank");
          var innnerhtml = sites[i].Content.replace(".expand", "");
          innnerhtml = innnerhtml.replace(/^\./, "");
          Singlelinks.innerHTML += innnerhtml;
          if (sites[i].Content == "Strata") {
              Singlelinks.href = "https://secure.stratanetwork.com/Stratajazz/login.aspx";
              Pin = GHVHS.DOM.create({ "Type": "div", "Class": "Pin", "Id": "Pin", "Content": "Login into Strata using PIN = 2729", "Parent": EventBody });
          }
          Singlelinks.style.fontSize = "17px";


      }
      var checkSites = document.getElementById("sitesBody").querySelector(".SingleFilelinks");
      if (document.getElementById("FilesWidget")) {
          var checkSites2 = document.getElementById("FilesWidget").querySelector(".SingleDivFilelinks");
          var checkSites3 = document.getElementById("FilesWidget").querySelector(".SingleFilelinks");
          if (!checkSites3 && !checkSites2) {
              optionElem.removeChild(document.getElementById("FilesWidget"));
          }
      }
      if (!checkSites) {
          optionElem.removeChild(document.getElementById("SitesWidget"));
      }

  },
  drawFilesAndFolders: function (AllFiles, optionElem, foldersTitle, filesTitle, route) {
      var FoldersBody = document.getElementById("Folders");
      var EventBody = document.getElementById("FilesBody");
      var filCount = 0;
      var folderCount = 0;


      for (var i = 0; i < AllFiles.length ; i++) {
          if (AllFiles[i].link.indexOf("&amp;") > 0) {
              for (var j = 0; j < AllFiles[i].link.indexOf("&amp;") ; j++) {
                  AllFiles[i].link = AllFiles[i].link.replace("&amp;", "&");
              }
          }

      }
      GHVHS.DOM.AllLinks = AllFiles;
      for (var i = 0; i < AllFiles.length ; i++) {
          var Content = AllFiles[i].Content;
          var link = AllFiles[i].link;
          var debugCount = link.indexOf("&amp;");
          link = link.replace("&amp;", "&");
          var lowerCaseLink = link.toLowerCase();
          var getFirstLetter = Content.split("");


          var debug = AllFiles[i].ParentContent;
          if (AllFiles[i].ParentContent != null) {
              if (!document.getElementById(AllFiles[i].ParentContent)) {
                  EventBody = document.getElementById("FilesBody");
                  FoldersBody = document.getElementById("Folders");
                  folderHolder = GHVHS.DOM.create({ "Type": "div", "Class": "folderHolder", "Id": AllFiles[i].ParentContent, "Parent": FoldersBody });
                  var Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleFilelinks", "Id": i, "Parent": folderHolder });
                  Singlelinks.style.paddingLeft = "1px";
                  var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/blueFolder.png", "Style": "Height:25px", "Parent": Singlelinks });
                  var split = AllFiles[i].ParentContent.split("/");
                  var ContentLink = split[split.length - 2].replace(".expand", "");
                  for (var q = 0; q < ContentLink.indexOf("%20") ; q++) {
                      ContentLink = ContentLink.replace("%20", " ");
                  }
                  folderCount++;
                  Singlelinks.innerHTML += ContentLink;
                  Singlelinks.href = "/Files" + AllFiles[i].ParentLink;
              } else {
                  EventBody = document.getElementById(AllFiles[i].ParentContent);
                  FoldersBody = document.getElementById(AllFiles[i].ParentContent);
              }
          } else {
              EventBody = document.getElementById("FilesBody");
              FoldersBody = document.getElementById("Folders");
          }
          if (lowerCaseLink.indexOf(".pdf") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDivFilelinks", "Id": i, "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";

              Singlelinks.onclick = function () {
                  var currentlink = GHVHS.DOM.AllLinks[this.id].link;
                  currentlink = currentlink.replace("&amp;", "&");
                  var linktoIframe = "http://intranet.ormc.org/BrowseFiles" + currentlink;
                  GHVHS.DOM.drawslideUpIframe(linktoIframe);
              }
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/pdf.png", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".mp4") > 0 || lowerCaseLink.indexOf(".mov") > 0 || lowerCaseLink.indexOf(".m4v") > 0 || lowerCaseLink.indexOf(".dxr") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDivFilelinks", "Id": i, "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              Singlelinks.onclick = function () {
                  var currentlink = GHVHS.DOM.AllLinks[this.id].link;
                  currentlink = currentlink.replace("&amp;", "&");
                  var linktoIframe = "http://intranet.ormc.org/BrowseFiles" + currentlink;
                  GHVHS.DOM.drawslideUpIframe(linktoIframe, "");
              }
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/mp4icon.png", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".bmp") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDivFilelinks", "Id": i, "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              Singlelinks.onclick = function () {
                  var linktoIframe = "http://intranet.ormc.org/BrowseFiles" + GHVHS.DOM.AllLinks[this.id].link;

                  GHVHS.DOM.drawslideUpIframe(linktoIframe, "Y");
              }
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/bmpIcon.png", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".jpg") > 0 || lowerCaseLink.indexOf(".jpeg") > 0 || lowerCaseLink.indexOf(".JPG") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDivFilelinks", "Id": i, "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              Singlelinks.onclick = function () {
                  var linktoIframe = "http://intranet.ormc.org/BrowseFiles" + GHVHS.DOM.AllLinks[this.id].link;
                  GHVHS.DOM.drawslideUpIframe(linktoIframe, "Y");
              }
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/jpg.png", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".flv") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleDivFilelinks", "Href": "http://intranet.ormc.org/BrowseFiles" + link, "Id": i, "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";

              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/flash.png", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".mp3") > 0 || lowerCaseLink.indexOf(".wav") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDivFilelinks", "Id": i, "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              Singlelinks.onclick = function () {
                  var linktoIframe = "http://intranet.ormc.org/BrowseFiles" + GHVHS.DOM.AllLinks[this.id].link;
                  GHVHS.DOM.drawslideUpIframe(linktoIframe, "audio");
              }
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/mp4icon.png", "Style": "Height:20px", "Parent": Singlelinks });
              if (lowerCaseLink.indexOf(".wav") >= 0) {
                  lodingImg.src = "/img/waz.png";
              } else if (lowerCaseLink.indexOf(".mp3") >= 0) {
                  lodingImg.src = "/img/mp3.png";
              }
          } else if (lowerCaseLink.indexOf(".png") > 0 || lowerCaseLink.indexOf(".PNG") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDivFilelinks", "Id": i, "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              Singlelinks.onclick = function () {
                  var linktoIframe = "http://intranet.ormc.org/BrowseFiles" + GHVHS.DOM.AllLinks[this.id].link;
                  GHVHS.DOM.drawslideUpIframe(linktoIframe, "Y");
              }
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/png.png", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".docx") > 0 || lowerCaseLink.indexOf(".doc") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleFilelinks", "Href": "http://intranet.ormc.org/BrowseFiles" + link, "Id": "SingleFilelinks", "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/fileIcon.jpeg", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".txt") > 0 || lowerCaseLink.indexOf(".TXT") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleFilelinks", "Href": "http://intranet.ormc.org/BrowseFiles" + link, "Id": "SingleFilelinks", "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/docPNP.png", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".xlsx") > 0 || lowerCaseLink.indexOf(".xls") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleFilelinks", "Href": "http://intranet.ormc.org/BrowseFiles" + link, "Id": "SingleFilelinks", "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/excell.jpeg", "Style": "Height:20px", "Parent": Singlelinks });
          } else if (lowerCaseLink.indexOf(".pptx") > 0 || lowerCaseLink.indexOf(".ppt") > 0) {
              filCount += 1;
              Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleFilelinks", "Href": "http://intranet.ormc.org/BrowseFiles" + link, "Id": "SingleFilelinks", "Parent": EventBody });
              Singlelinks.style.fontSize = "17px";
              var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/pptx.png", "Style": "Height:20px", "Parent": Singlelinks });
          } else {
              if (Content != "[To Parent Directory]" && Content != ".archive" && Content.indexOf("Shortcut.lnk") <= 0 && Content != "") {
                  if (getFirstLetter[0] != ".") {
                      folderCount++;
                      var replaceLink = link.replace("&amp;", "()(");
                      var replaceLink = replaceLink.replace("&", "()(");
                      var Singlelinks = GHVHS.DOM.create({ "Type": "a", "Class": "SingleFilelinks", "Href": "/Files" + replaceLink, "Id": "SingleFilelinks", "Style": "padding-top:.1%; padding-bottom:.8%;", "Parent": FoldersBody });
                      var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "lodingImg", "Src": "/img/blueFolder.png", "Style": "Height:25px", "Parent": Singlelinks });

                  }


              } else {
                  if (window.location.href.indexOf("?Clear") < 0) {
                      if (link.length > route.length && link.indexOf(route) < 0) {
                          var d = new Date();
                          var n = d.getTime();
                          window.location.href = window.location.href + "?Clear=" + n;
                      }
                  }
              }
          }


          if (Content != "[To Parent Directory]" && Content != ".archive" && Content.indexOf("Shortcut.lnk") <= 0 && Content != "") {
              if (getFirstLetter[0] != ".") {
                  var innnerhtml = Content.replace(".expand", "");
                  Singlelinks.innerHTML += innnerhtml;
              }
          }


      }
      if (filCount == 0) {
          document.getElementById("FilesWidget").className = "hide";
      }
      if (folderCount == 0) {
          document.getElementById("FoldersWidget").className = "hide";
      }
  },
  AllLinks: [],
  DisplayLinks: function () {
      console.log(JSON.stringify(GHVHS.DOM.AllLinks));
  },

   monthsYears: [
         {"Month":'January',"Days":31},
         {"Month":'February',"Days":29},
         {"Month":'March',"Days":31},
         {"Month":'April',"Days":30},
         {"Month":'May',"Days":31},
         {"Month":'June',"Days":30},
         {"Month":'July',"Days":31},
         {"Month":'August',"Days":31},
         {"Month":'September',"Days":30},
         {"Month":'October',"Days":31},
         {"Month":'November',"Days":30},
         {"Month":'December',"Days":31},
  ],
   drawCalander: function (data,year,ElemToUse, isInput){
    if (data == "") {
        var d = new Date();
        var n = d.getMonth();
        data = GHVHS.DOM.monthsYears[n];
        currentMonth = n;

    }

    var month = data.Month;
    var amountOfFays = data.Days;
    if (!year) {
        var d = new Date();
        var n = d.getFullYear();
        year = n;
    }
    var StrYear = year+"";
    var c = document.getElementById("canvas");
    c.style.overflowY = "hidden";
    main = GHVHS.DOM.create({ "Type": "div", "Class": "main", "Id": "main",  "Parent": c });
    var X = GHVHS.DOM.create({ "Type": "img", "Class": "whiteX", "Id": "", "Src": "/img/xWhite.png", "Parent": main });
    X.onclick = function () {
        main.click();
    }
    main.onclick = function(e){
        if (e.target.id == "main") {
            main.parentElement.removeChild(main);
            c.style.overflowY = "auto";
            if (ElemToUse.id == "SelectedCal") {
                ElemToUse.id = "NotSelectedCal";
            }
        }
    };
    p = {
        "month":month,
        "amountOfFays":amountOfFays,
        "StrYear":StrYear,
        "elem":main,
        "transition":"top"
    };
    GHVHS.DOM.drawCal(p, ElemToUse, isInput);

},
   drawCal: function (p, ElemToUse, isInput) {
    cal = GHVHS.DOM.create({ "Type": "div", "Class": "cal", "Id": "cal", "Parent": p.elem });
    if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
        cal.style.height = "550px";
        cal.style.marginTop="10%";
    }
    if (screen.width > 1000) {
        cal.style.gridRowStart = "2";
        main.style.gridTemplateColumns = "25% 50% 25%";
    }else {

        cal.style.gridRowEnd = "4";
    }
    cal.style.position = "absolute";
    if (p.transition == "top") {
        cal.style.top = 1000+"px";
        cal.style.transition = "top 0.4s ease";


    }else if (p.transition == "left") {
        cal.style.left = 1000+"px";
        cal.style.transition = "left 0.4s ease";
    }else {
        cal.style.right = 1000+"px";
        cal.style.transition = "right 0.4s ease";
    }
    var t = p.transition;
    var height = setTimeout(function() {
        if (t == "top") {
            cal.style.top = "0px";

        }else if (t == "left") {
            cal.style.left = "0px";
        }else {
            cal.style.right = "0px";

        }
        var changeBC = setTimeout(function(){
            main.style.background= "rgb(0,0,0,0.9)";
        },200);
    },20);
    if (currentMonth > 0) {
        ArrowLeft = GHVHS.DOM.create({ "Type": "img", "Class": "ArrowLeft", "Id": "ArrowLeft", "Src": "/img/downwhite.png", "Parent": cal.parentElement });
        ArrowLeft.onclick = function(){
            if (currentMonth > 0) {
                currentMonth -= 1;
                var tempObj = GHVHS.DOM.monthsYears[currentMonth];
                p = {
                    "month":tempObj.Month,
                    "amountOfFays":tempObj.Days,
                    "StrYear":document.getElementById("Year").value,
                    "elem":document.getElementById('main'),
                    "transition":"right"
                };
                GHVHS.DOM.fromRight(p);
            }
        }
    }
    checkMonth = GHVHS.DOM.create({ "Type": "div", "Class": "Month", "Id": "Month", "Content": p.month, "Parent": cal });
    checkMonth.onclick = function MonthClick(){

        if (document.getElementById('thedrop2')) {
            checkMonth.style.border="none";
            document.getElementById('thedrop2').parentElement.removeChild(document.getElementById('thedrop2'));
        }else {
            this.style.border="none";
            var thedrop = GHVHS.DOM.create({ "Type": "div", "Class": "thedrop", "Id": "thedrop2", "Parent": cal });
            thedrop.style.zIndex = "200000000";
            thedrop.style.position = "absolute";
            thedrop.style.left = checkMonth.offsetLeft+"px";
            thedrop.style.top = checkMonth.offsetTop + checkMonth.offsetHeight + "px";
            thedrop.style.width = checkMonth.offsetWidth + "px";
            thedrop.style.height = "1px";
            thedrop.style.transition = "height 0.3s ease ";
            var changeh = setTimeout(function(){
                thedrop.style.height = "300px";
            }, 20);
            thedrop.style.background = "white";
            thedrop.style.boxShadow = "2px 2px 3px grey";
            thedrop.style.borderRadius = "8px";
            thedrop.style.border="1px solid";
            thedrop.style.overflowY="auto";
            thedrop.style.overflowX="hidden";
            var Num = Year.innerHTML;
            for (var i = 0; i < GHVHS.DOM.monthsYears.length; i++) {
                singleDrop = GHVHS.DOM.create({ "Type": "div", "Class": "singleDrop", "Id": "singleDrop", "Content": GHVHS.DOM.monthsYears[i].Month + "", "Parent": thedrop });

                singleDrop.onclick = function(){
                    var theYear = document.getElementById("Month");
                    for (var i = 0; i < GHVHS.DOM.monthsYears.length; i++) {
                        if (GHVHS.DOM.monthsYears[i].Month == this.innerHTML) {
                            currentMonth = i;
                            var dataCurrent = GHVHS.DOM.monthsYears[i];
                            document.getElementById("Month").innerHTML = this.innerHTML;
                            document.getElementById('Month').click();
                            var theTimeOut = setTimeout(function(){
                                var main = document.getElementById('main');
                                var dheYear = document.getElementById("Year").value;

                                main.click();

                                GHVHS.DOM.drawCalander(dataCurrent, dheYear, ElemToUse);
                            },20);
                        }
                    }

                }
            }
        }
    }

    if (currentMonth < 11) {
        ArrowRight = GHVHS.DOM.create({ "Type": "img", "Class": "ArrowRight", "Id": "ArrowRight", "Src": "/img/downwhite.png", "Parent": cal.parentElement });
        ArrowRight.onclick = function(){
            if (currentMonth < 11) {
                currentMonth += 1;
                var tempObj = GHVHS.DOM.monthsYears[currentMonth];
                p = {
                    "month":tempObj.Month,
                    "amountOfFays":tempObj.Days,
                    "StrYear":document.getElementById("Year").value,
                    "elem":document.getElementById('main'),
                    "transition":"left"
                };
                GHVHS.DOM.fromLeft(p);
            }
        }
    }
    Year = GHVHS.DOM.create({ "Type": "input", "Class": "Year", "Id": "Year", "Style": "border:none;", "Parent": cal });
    var d = new Date();
    var n = d.getFullYear();
    if (!p.StrYear) {
        Year.value = n+"";
    }else  if (p.StrYear == "") {
        Year.value = n+"";
    }else {
        Year.value = p.StrYear;
    }
    Year.onkeyup =function(){
        var checkValue = Year.value.split("");
        if (checkValue.length > 4) {
            Year.value = "";
            Year.setAttribute("placeHolder","Please Enter A Year");
        }else if (checkValue.length == 4) {
            var temNum = Number(Year.value);
            if (temNum < 1919 || temNum > (n+1)  ) {
                Year.value = "";
                Year.setAttribute("placeHolder","Please Enter A Year");
            }else {
                document.getElementById('thedrop').parentElement.removeChild(document.getElementById('thedrop'));
            }
        }else {
            for (var i = 0; i < checkValue.length; i++) {
                if (isNaN(checkValue[i])==true) {
                    Year.value = "";
                    Year.setAttribute("placeHolder","Please Enter A Year");
                }
            }
            if (!document.getElementById('thedrop')) {
                this.click();
            }
            var getdrop = document.getElementById('thedrop');
            var x = getdrop.querySelectorAll(".singleDrop");
            for (var i = 0; i < x.length; i++) {
                if (x[i].innerHTML.includes(this.value)== false) {
                    x[i].style.display = "none";
                }else {
                    x[i].style.display = "block";
                }
            }

        }
    }
    Year.onclick = function(){

        if (document.getElementById('thedrop')) {
            Year.style.border="none";
            document.getElementById('thedrop').parentElement.removeChild(document.getElementById('thedrop'));
        }else {
            this.style.border="none";
            var thedrop = GHVHS.DOM.create({ "Type": "div", "Class": "thedrop", "Id": "thedrop", "Parent": cal });

            thedrop.style.position = "absolute";
            thedrop.style.left = Year.offsetLeft+"px";
            thedrop.style.top = Year.offsetTop + Year.offsetHeight + "px";
            thedrop.style.borderRadius = "8px";
            thedrop.style.width = Year.offsetWidth + "px";
            thedrop.style.height = "1px";
            thedrop.style.transition = "height 0.3s ease ";
            var changeh = setTimeout(function(){
                thedrop.style.height = "200px";
            }, 20);
            thedrop.style.background = "white";
            thedrop.style.boxShadow = "2px 2px 3px grey";
            thedrop.style.border="1px solid";
            thedrop.style.overflowY="auto";
            thedrop.style.overflowX="hidden";
            var Num = Year.innerHTML;
            var d = new Date();
            var n = d.getFullYear();
            for (var i = 1980; i < (n+1); i++) {
                singleDrop = GHVHS.DOM.create({ "Type": "div", "Class": "singleDrop", "Id": "singleDrop", "Content": i + "", "Parent": thedrop });
                singleDrop.onclick = function(){
                    var theYear = document.getElementById("Year");
                    theYear.value = this.innerHTML
                    document.getElementById('Year').click();
                }
            }
        }
    }
    var checkElemFromParam = isInput;
    daysContainer = GHVHS.DOM.create({ "Type": "div", "Class": "daysContainer", "Id": "daysContainer", "Parent": cal });
    for (var i = 1; i < p.amountOfFays+1; i++) {
        SingleDay = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDay", "Id": "SingleDay", "Content": i + "", "Parent": daysContainer });
        SingleDay.onclick = function(){
            var value = document.getElementById('SelectedCal');
            if (!value) {
                var value = document.getElementById('OnCallCal');
            }
            var theYear = document.getElementById('Year');
            var getMain = document.getElementById('main');
            var touse = 0;
            if (currentMonth == 0) {
                touse = "01";
            }else if (currentMonth <= 9) {
                touse = "0"+(Number(currentMonth)+1);
            }else {
                touse = (currentMonth+1)+"";
            }
            var getData = this.innerHTML;
            var tempNum = Number(getData);
            if (isNaN(tempNum)==false) {
                if (tempNum < 10) {
                    getData = "0"+getData;
                }
            }
            var theYear = theYear.value;
            if (theYear == "") {
                theYear = "2019";
            }
            if (value.id == "OnCallCal") {
                var Val = touse + "/" + getData + "/" + theYear;
                getMain.click();
                if (window.location.href.indexOf("?date") >= 0) {
                    var urlParts = window.location.href.split("?date");
                    window.location.href = urlParts[0] + "?date=" + Val;
                } else if (window.location.href.indexOf("&date") >= 0) {
                    var urlParts = window.location.href.split("&");
                    window.location.href = urlParts[0] + "&date=" + Val;
                } else {
                    window.location.href = window.location.href + "?date=" + Val;
                }
            } else {
                if (value.className == "Filter ap") {
                    value.value = touse + "/" + getData + "/" + theYear;
                } else {
                    if (!checkElemFromParam) {
                        value.innerHTML = touse + "/" + getData + "/" + theYear;
                        value.style.border = "1px solid silver";
                        value.style.color = "grey"
                    } else {
                        if (touse == "010"){
                            touse = "10";
                        }
                        value.value = touse + "/" + getData + "/" + theYear;
                        value.style.border = "1px solid silver";
                    }
                }
               ;
                value.id = "NotSelectedCal";
                getMain.click();
            }

        };
    }
},
 fromLeft: function(p) {
    var getCal = document.getElementById('cal');
    getCal.style.transition = "left 0.3s ease ";
    var height = setTimeout(function () {
        if (screen.width > 1000) {
            getCal.style.left = "-3000px";
        }else {
            getCal.style.left = "-1000px";
        }

        var getCal2 = getCal;
        var changeBC = setTimeout(function(){
            getCal2.parentElement.removeChild(getCal2);
            GHVHS.DOM.drawCal(p);
        },280);
    },20);
},
 fromRight: function(p) {
    var getCal = document.getElementById('cal');
    getCal.style.transition = "right 0.3s ease ";
    var height = setTimeout(function () {
        if (screen.width > 1000) {
            getCal.style.right = "-3000px";
        }else {
            getCal.style.right = "-1000px";
        }
        var getCal2 = getCal;
        var changeBC = setTimeout(function(){
            getCal2.parentElement.removeChild(getCal2);
            GHVHS.DOM.drawCal(p);
        },280);
    },20);
 },
 DrawSmallLoader2: function (elem) {
     if (!elem) {
         elem = document.getElementById('canvas');
     }
     if (!document.getElementById("FaxTableLoader")) {
         FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": "Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);z-index: 90000000000;", "Parent": elem });
         FaxTableLoader.style.left = elem.offsetLeft + "px";
         FaxTableLoader.style.top = elem.offsetTop + "px";
         FaxTableLoader.style.width = elem.offsetWidth + "px";
         FaxTableLoader.style.height = (elem.offsetHeight) + "px";
         if (elem.id == "canvas") {
             FaxTableLoader.style.height = (elem.offsetHeight + document.getElementById("MainContent").offsetHeight) + "px";
         }
         var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
         SearchLoader.style.marginLeft = "45%"
     }
 },
 RemoveSmallLoader2: function (elem) {
     if (!elem) {
         elem = document.getElementById('canvas');
     }
     elem.removeChild(document.getElementById("FaxTableLoader"));
 },
 DrawMyApps: function (json) {
     //window.location.href = "http://ghinfo/secure2/UserID/myapplications.aspx";
     var masterElem = document.getElementById("MainContent");
     masterElem.style.height = "auto";
     var masterElem = document.getElementById("MainContent");
     masterElem.style.height = "auto";
     var newSiteInfo = GHVHS.DOM.create({ "Type": "div", "Class": "newSiteInfo", "Id": "newSiteInfo", "Style": "font-size: 105%;transition: height 0.3s ease;overflow: hidden;height: 50px;margin-bottom: 0%;margin-top: -1.2%;", "Parent": masterElem });
     var MessageElem = GHVHS.DOM.create({ "Type": "div", "Class": "MessageElem", "Id": "MessageElem", "Parent": newSiteInfo });
     MessageElem.innerHTML = "Welcome to the new <span style='color:#5c0a3a;font-weight:bold;'>My Applications</span> page.<br>If you don't see your applications please see the old My Applications page  <a href='http://ghinfo/secure2/UserID/myapplications.aspx' style='text-decoration:underline'>here</a>"
     var littleX = GHVHS.DOM.create({ "Type": "img", "Src": "/img/x.png", "Class": "littleX", "Id": "littleX", "Parent": newSiteInfo });
     littleX.onclick = function () {
         var getMsgContainer = document.getElementById("newSiteInfo");
         getMsgContainer.style.height = "1px";
         setTimeout(function () {
             getMsgContainer.style.display = "none";
             document.getElementById("AppDrawHeader").style.marginTop = "-1.2%";
         },300)
     }
     AppDrawHeader = GHVHS.DOM.create({ "Type": "div", "Class": "AppDrawHeader", "Id": "AppDrawHeader", "Parent": masterElem });
     FaxNewHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxNewHeader", "Id": "FaxNewHeader", "Style": "    padding-bottom: 0.1%;Font-Size: 25px;font-weight: bold;color: #ffe3c4;    ", "Content": "My Applications", "Parent": AppDrawHeader });
     search = GHVHS.DOM.create({ "Type": "input", "Class": "SearchFilterMyApps", "Id": "search", "Parent": AppDrawHeader });
     search.setAttribute("placeholder", "Search Your Apps...");
     search.setAttribute("autocomplete", "off");
     search.onkeyup = function () {
         var apps = document.getElementById("AppDraw").querySelectorAll(".titleApp");
         var value = this.value.toLowerCase();
         for (var i = 0; i < apps.length; i++) {
             var appValue = apps[i].innerHTML.toLowerCase();
             if (value == "" || value == " " || value == null) {
                 apps[i].parentElement.className = "SingleApp";
             }if (appValue.indexOf(value) >= 0) {
                 apps[i].parentElement.className = "SingleApp";

             } else {
                 apps[i].parentElement.className = "hide";
             }
         }

     }
     AppDraw = GHVHS.DOM.create({ "Type": "div", "Class": "AppDraw", "Id": "AppDraw", "Parent": masterElem });
     for (var i = 0; i < json.length; i++) {
         SingleApp = GHVHS.DOM.create({ "Type": "a", "Class": "SingleApp", "Href": json[i]["Fields"]["URL"], "Id": "SingleApp", "Parent": AppDraw });

         SingleApp.setAttribute("target", "_blank");

             SingleAppImgHolder = GHVHS.DOM.create({ "Type": "div", "Class": "SingleAppImgHolder", "Id": "SingleAppImgHolder", "Parent": SingleApp });
             titleImage = GHVHS.DOM.create({ "Type": "img", "Class": "titleImage", "Id": "titleImage", "Parent": SingleAppImgHolder });
             if (json[i]["Fields"]["Name"].indexOf("Fax") >= 0) {
                 titleImage.src = "/img/Fax.png";
             } else if (json[i]["Fields"]["Name"].indexOf("Msg") >= 0) {
                 titleImage.src = "/img/Texting.png";
             } else if (json[i]["Fields"]["Name"].indexOf("budget") >= 0 || json[i]["Fields"]["Name"].indexOf("Budget") >= 0 || json[i]["Fields"]["Name"] == "Budget") {
                 titleImage.src = "/img/budget.png";
             } else if (json[i]["Fields"]["Name"].indexOf("Phone") >= 0) {
                 titleImage.src = "/img/OnCall.png";
             } else if (json[i]["Fields"]["Name"].indexOf("Reports") >= 0 || json[i]["Fields"]["Name"].indexOf("Report") >= 0) {
                 titleImage.src = "/img/News.png";
             } else if (json[i]["Fields"]["Name"].indexOf("On-Call") >= 0) {
                 titleImage.src = "/img/OnCallPhone.png";
             } else if (json[i]["Fields"]["Name"].indexOf("Image") >= 0) {
                 titleImage.src = "/img/png.png";
             } else {
                 titleImage.src = "/img/webApp.png";

             }
             titleApp = GHVHS.DOM.create({ "Type": "div", "Class": "titleApp", "Id": "titleApp", "Content": json[i]["Fields"]["Name"], "Parent": SingleApp });

     }
 },
 getBrowserType: function () {
     var isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0;
     var isFirefox = typeof InstallTrigger !== 'undefined';
     var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification));
     var isIE = /*@cc_on!@*/false || !!document.documentMode;
     var isEdge = !isIE && !!window.StyleMedia;
     var isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime);
     var isEdgeChromium = isChrome && (navigator.userAgent.indexOf("Edg") != -1);
     var isBlink = (isChrome || isOpera) && !!window.CSS;
     var output = "";
     if (isOpera) {
         output = "Opera";
     } else if (isFirefox) {
         output = "Firefox";
     } else if (isSafari) {
         output = "Safari";
     } else if (isIE) {
         output = "IE";
     } else if (isEdge) {
         output = "Edge";
     } else if (isChrome) {
         output = "Chrome";
     } else if (isEdgeChromium) {
         output = "EdgeChromium";
     } else if (isBlink) {
         output = "Blink";
     } else {
         output = "Unknown";
     }
     return output;
 },
 covidInfo: function (masterElem) {
     //var newSiteInfo = GHVHS.DOM.create({ "Type": "div", "Class": "newSiteInfo", "Id": "newSiteInfo", "Parent": masterElem });
     //newSiteInfo.innerHTML = "Welcome to the new <span style='color:rgb(64, 0, 23);font-weight:bold;'>Garnet Health</span> intranet site!<br>If you need assistance with the site please contact us at <a href='mailto:businessintelligence@garnethealth.org' style='text-decoration:underline'>businessintelligence@garnethealth.org</a>"

     var banner = GHVHS.DOM.create({ "Type": "a", "Href": "https://www.ormc.org/safety", "Class": "banner", "Id": "banner", "Parent": masterElem });


      var overlay = GHVHS.DOM.create({ "Type": "div", "Class": "overlay", "Id": "overlay", "Parent": masterElem });

     overlay.style.height = banner.offsetHeight + "px";
     overlay.style.left = banner.offsetleft + "px";
     overlay.style.top = (banner.offsetTop + document.getElementById("header").offsetHeight + 5) + "px";
     overlay.style.width = banner.offsetWidth + "px";
    // var overlay1 = GHVHS.DOM.create({ "Type": "img", "Style": "width:100%;height:60%;float:left;", "Id": "overlay", "Src": "https://www.garnethealth.org//patterns/dist/assets/images/basic-hero@2x.png?9a4e689317aac1af2219f7685672ba42", "Parent": overlay });

     var GHIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/logo.png", "Style": "max-width:100%; max-height:20%;margin-top: 4.95%;border-radius:10px;", "Class": "GHIcon", "Parent": overlay });
     //var Welcome = GHVHS.DOM.create({ "Type": "div", "Class": "OpenText", "Style": "text-align:left;margin-left:45%;padding-top:5%;font-size:50px;", "Id": "OpenText", "Parent": overlay });
     // Welcome.innerHTML = "Where <br>Expectional <br>Lives <img src='/img/logo.png' style='height:27px;'/>";

     //var GHIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/thanksgivingtext.png", "Style": "margin-top: -7.5%;", "Class": "GHIcon", "Parent": overlay });

     var Intratnet = GHVHS.DOM.create({ "Type": "div", "Class": "intranetText", "Style": "font-size:15px;padding-top:1%;padding-bottom:1%;", "Id": "Intranet", "Content": "INTRANET", "Parent": overlay });
     if (masterElem.offsetWidth < 1300) {
         Intratnet.style.marginTop = "-3.5%";
     }
     setTimeout(function () {
         Intratnet.style.width = GHIcon.offsetWidth + "px";
     }, 200);

     var theElem = GHVHS.DOM.create({ "Type": "div", "Class": "theElem", "Id": "theElem", "Parent": masterElem });
     setTimeout(function () {
         theElem.onmouseover = function () {
             var WeatherContainer = document.getElementById("WeatherContainer");
             if (WeatherContainer) {
                 WeatherContainer.style.height = "65%";

                 document.getElementById("BottomContainer").style.marginTop = "-15%";
                 WeatherContainer.style.boxShadow = "2px 2px 8px Silver";
                 if (document.getElementById("CalanderButton")) {
                     document.getElementById("CalanderButton").style.display = "block";
                 }
                 WeatherContainer.scrollHeight = 0;
                 var getOption = document.getElementById('WeatherContainerSearchBox');
                 getOption.style.display = "none";
                 document.getElementById('WeatherContainerHeaderLable').style.fontSize = "18px";
                 document.getElementById('WeatherContainerHeaderLable').style.paddingTop = "1%";
                 var getAllTable = document.getElementById('canvas').querySelectorAll(".SingleWeatherSmall");
                 for (var i = 0; i < getAllTable.length; i++) {
                     getAllTable[i].className = "SingleWeatherSmall";
                 }
                 document.getElementById('TableWeather').className = "TableWeather";
                 var setTime = setTimeout(function () {
                     if (document.getElementById('WeatherContainer').style.height == "18%") {
                         document.getElementById('WeatherContainerBody').scrollHeight = "0";
                         document.getElementById('WeatherContainerBody').style.overflow = "hidden";
                     }
                 }, 80);
                 var getAllViews = document.getElementById('canvas').querySelectorAll(".SingleWeather");
                 for (var j = 0; j < getAllViews.length; j++) {
                     getAllViews[j].className = "SingleWeather hide";
                 }
                 var getAllViews2 = document.getElementById('canvas').querySelectorAll(".SingleWeatherHourly");
                 for (var j = 0; j < getAllViews2.length; j++) {
                     getAllViews2[j].className = "SingleWeatherHourly hide";
                 }
             }
         }
     }, 200);

     //var cardTitle = GHVHS.DOM.create({ "Type": "div", "Class": "covidTitle", "Id": "cardTitle", "Content": "COVID-19 Information", "Parent": theElem });
     var element = GHVHS.DOM.create({ "Type": "div", "Class": "Covid", "Id": "temp", "Parent": theElem });
     var imgHolderAnti = GHVHS.DOM.create({ "Type": "div", "Class": "imgHolderAnti", "Id": "imgHolderAnti", "Parent": element });
     var CovidAntiBod = GHVHS.DOM.create({ "Type": "img", "Src": "/img/tbintranet.png", "Class": "CovidAntiBod", "Id": "CovidAntiBod", "Parent": imgHolderAnti });
     CovidAntiBod.onclick = function () {
         window.location.href = "/Files/SchwartzCenterRounds/";
     }

     var SingleCard1 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleCovidCard", "Id": "SingleCard", "Style": "margin-left:-1%;margin-top:-0.5%;", "Parent": element });
     var cardTitle = GHVHS.DOM.create({ "Type": "div", "Class": "cardTitle", "Id": "cardTitle", "Style": "text-shadow:unset;color:#ffe3c4;padding-top:5.5%;font-size:200%;text-decoration:none;", "Content": "Additional Links", "Parent": SingleCard });

     var CardLink = GHVHS.DOM.create({ "Type": "div", "Class": "CardLink", "Id": "CardLink", "Style": "margin-top:2%;", "Parent": SingleCard1 });
     var covidLinks = [{ "link": "/Files/SchwartzCenterRounds/", "Content": "More  information about Schwartz Center Rounds" },
         { "link": "/Files/Covid19Documents/", "Content": "Covid - 19 Information" }];
     for (var i = 0; i < covidLinks.length; i++) {
         
         var CLink = GHVHS.DOM.create({ "Type": "a", "Href": covidLinks[i]["link"], "Class": "CLink", "Id": covidLinks[i]["link"], "Parent": CardLink });
             
             CLink.style.fontSize = "160%";
             if (masterElem.offsetWidth < 1400) {
                 CLink.style.fontSize = "100%";
             }
             CLink.style.fontWeight = "bold";
             CLink.style.color = "white";
             CLink.style.textShadow = "unset";
             CLink.style.marginTop = "8%";
             CLink.style.marginLeft = "5%";
             CLink.style.cursor = "pointer";
             CLink.innerHTML = covidLinks[i]["Content"];
             CArrow = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "", "Src": "http://intranet/images/right_arrow.png", "Style": "height:15px;", "Parent": CLink });
             CArrow.style.marginLeft = "2px";
             CLink.setAttribute("target", "_blank");
             if (i == 0) {
                 CLink.style.marginTop = "3%";
             }
     }
     /* var SingleCard = GHVHS.DOM.create({ "Type": "div", "Class": "SingleCard", "Id": "SingleCard", "Style": "Cursor:pointer;", "Parent": element });
     if (CovidAntiBod.offsetHeight != 0) {
         SingleCard.style.height = CovidAntiBod.offsetHeight + "px";
     }
     SingleCard.style.marginTop = "1%";
     SingleCard.style.width = "23%";
     SingleCard.style.borderRadius = "10px";
     var CardImage = GHVHS.DOM.create({ "Type": "div", "Class": "CardImage", "Id": "CardImage", "Style":"max-height:85%;","Parent": SingleCard });
     var CImage = GHVHS.DOM.create({ "Type": "img", "Class": "CImage", "Id": "CImage","Style":"max-width:70%;max-height:70%;margin-top:0%;", "Src": "/img/c19.png", "Parent": CardImage });
     var CardLink = GHVHS.DOM.create({ "Type": "div", "Class": "CardLink", "Id": "CardLink", "Style": "margin-top:0%;", "Parent": SingleCard });
     var CLink = GHVHS.DOM.create({ "Type": "div", "Class": "CLink", "Href": "/Files/Covid19Documents/", "Content": "Covid-19 Links", "Parent": CardLink });
     CArrow = GHVHS.DOM.create({ "Type": "img", "Class": "CArrow", "Id": "", "Src": "http://intranet/images/right_arrow.png", "Style": "height:10px;", "Parent": CLink });
     CArrow.style.marginLeft = "2px";
     SingleCard.onclick = function () {
         window.open("/Files/Covid19Documents/", '_blank');
     }
     
     var Community = GHVHS.DOM.create({ "Type": "div", "Class": "Community", "Id": "Community", "Parent": element });
     var CommunityTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CommunityTitle", "Id": "CommunityTitle", "Content": "HELP PROTECT OUR COMMUNITY", "Parent": Community });
     var CommunityBody = GHVHS.DOM.create({ "Type": "div", "Class": "CommunityBody", "Id": "CommunityBody", "Content": "Our staff are at the front-lines fighting the COVID-19 pandemic in our community. You can join the fight against the virus by making a gift to our Emergency Coronavirus Fund which will be used for the specialized equipment we need to keep fighting this dreadful disease. Keeping our staff safe, so they can continue to care for your neighbors and loved ones. Make a gift today to help protect your community. Gifts large and small make a difference.", "Parent": Community });
     var CommunityFooter = GHVHS.DOM.create({ "Type": "div", "Class": "CommunityFooter", "Id": "CommunityFooter", "Parent": Community });
     var ORMCButton = GHVHS.DOM.create({ "Type": "a", "Class": "ORMCButton", "Id": "ORMCButton", "Href": "/home/Donation", "Content": "Donate to Garnet Health Medical Center", "Parent": CommunityFooter });

     var CRMCButton = GHVHS.DOM.create({ "Type": "a", "Class": "CRMCButton", "Id": "CRMCButton", "Href": "https://www.crmcny.org/emergency-fund", "Content": "Donate to Garnet Health Medical Center - Catskills", "Parent": CommunityFooter });
     //imgHolderAnti.style.height = Community.offsetHeight + "px";
     if (masterElem.offsetWidth < 1400) {
         ORMCButton.style.fontSize = "85%";
         CRMCButton.style.fontSize = "85%";
         CommunityBody.style.fontSize = "95%";
     }*/
 },
 vitalIssues: function (masterElem) {
     var element = GHVHS.DOM.create({ "Type": "div", "Class": "TempEmergency", "Id": "temp", "Parent": masterElem });
     emheader = GHVHS.DOM.create({ "Type": "div", "Class": "emheader", "Id": "emheader", "Content": "Coronavirus(COVID-19) Update", "Parent": element });
     var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "ViewImg", "Src": "/img/blackDrop.png", "Style": "Height:30px;transition:transform 0.5s ease;cursor:pointer;", "Parent": emheader });
     emBody = GHVHS.DOM.create({ "Type": "div", "Class": "emBody", "Id": "emBody", "Style": "transition:height 0.5s ease;", "Parent": element });
     emergency = GHVHS.DOM.create({ "Type": "iframe", "Src": "https://coronavirus.jhu.edu/map.html", "Class": "emergency", "Style": "Overflow:hidden;", "Id": "Framed", "Parent": emBody });
     lodingImg.onclick = function () {
         if (lodingImg.style.transform == "rotate(180deg)") {
             lodingImg.style.transform = "rotate(0deg)";
             emBody.style.height = "92%";
             emheader.style.height = "8%";
             element.style.height = "800px";
         } else {
             lodingImg.style.transform = "rotate(180deg)";
             emBody.style.height = "1px";
             emheader.style.height = "64px";
             element.style.height = "64px";
         }

     }

 },
 handleScrollMain: function () {
     var canvas = document.getElementById("canvas");
     var header = document.getElementById("headerPartOneTwo");
     var MainContent = document.getElementById("MainContent");
     if (MainContent) {
         header.style.transition = "height .15s ease";
         MainContent.style.transition = "margin-top .05s ease";
         var mT = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "marginTopMainContent", "Parent": MainContent });
         mT.innerHTML = MainContent.style.marginTop;
         if (document.getElementById("overlay")) {
             var mT2 = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "marginTopOverlay", "Parent": MainContent });
             mT2.innerHTML = document.getElementById("overlay").style.top;
         }
         canvas.onscroll = function () {

             var headerElement = document.getElementById("headerPartOneTwo");
             var MainContent2 = document.getElementById("MainContent");
             var headerMain = document.getElementById("header");
             var scroll = this.scrollTop;
             var headerPartOne = document.getElementById("headerPartOne");
             if (scroll > 20) {
                 if (headerElement.style.display != "none") {
                     if (!document.getElementById("headerimage")) {
                         var headerimage = GHVHS.DOM.create({ "Type": "img", "Class": "headerImg1", "Id": "headerimage", "Style": "top:-20px;position:fixed;", "Src": "/img/FavIcon.png", "Parent": MainContent2 });
                         headerimage.onclick = function () {
                             window.location.href = "/";
                         }
                         headerimage.style.zIndex = "900000000000000000000000000000000000000000000000000000";
                         headerimage.style.transition = "top .45s ease";
                         headerimage.style.height = (headerPartOne * 0.80) + "px";
                         var headerImg = document.getElementById("headerImg1");
                         headerimage.style.position = "fixed";
                         if (document.getElementById("overlay")) {
                             document.getElementById("overlay").style.top = (document.getElementById("banner").offsetTop - 15) + "px";
                         }
                         MainContent2.style.marginTop = (MainContent2.style.offsetTop - headerPartOne.offsetHeight) + "px";
                         headerPartOne.style.boxShadow = "1px 1px 10px black";
                         headerMain.style.height = headerPartOne.offsetHeight + "px";
                         setTimeout(function () {
                             headerimage.style.top = (headerImg.offsetTop + 1) + "px";
                         }, 10);
                         headerimage.style.left = (headerImg.offsetLeft + 10) + "px";
                         headerImg.style.display = "none";
                     }
                     headerElement.style.height = "1px";
                     setTimeout(function () {
                         headerElement.style.display = "none";
                     }, 200);
                 }
             } else {
                 if (headerElement.style.display == "none") {
                     headerPartOne.style.boxShadow = "1px 1px 10px grey";
                     MainContent2.style.marginTop = document.getElementById("marginTopMainContent").innerHTML;
                     headerElement.style.display = "block";
                     setTimeout(function () {
                         setTimeout(function () {
                             var headerImg = document.getElementById("headerImg1");
                             var headerImg2 = document.getElementById("headerimage");
                             if (headerImg2) {
                                 headerImg2.parentElement.removeChild(headerImg2);
                             }
                             headerImg.style.display = "block";
                             if (document.getElementById("overlay")) {
                                 document.getElementById("overlay").style.top = ( document.getElementById("banner").offsetTop-15) + "px";
                             }

                         }, 200);
                         headerElement.style.display = "block";
                         headerElement.style.height = "60%";
                         headerMain.style.height = "12%";
                         headerPartOne.style.height = "auto";

                         var headerImgTemp = document.getElementById("headerimage");
                         if (headerImgTemp) {
                             headerImgTemp.style.top = "-20px";
                         }

                     }, 10);
                 }
             }

         }
     }
 }


};
