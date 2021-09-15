var Pnp = {
    ViewItem: function (id, list, Username, FullName, AllFiles, ViewOnly) {
        
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu("", Elem, AllFiles, ViewOnly);
        Pnp.FullName = FullName;
        var NotEditMode = "";
        if (ViewOnly == "Y") {
            NotEditMode = "View";
        }
        Pnp.DrawTopBar(Username, Elem, "", NotEditMode);
        if (list == "Approved%20Policies") {
            list = "ApprovedPolicies"
        }else if (list  == "Policies Related  documents"){
            list = "PoliciesRelateddocuments";
        }

        function DrawSingleItem(json, ViewOnly) {
            var getTitle = document.getElementById("TitlePnp");
            var Elem = document.getElementById("Elem");
            var data = json["Items"][0]["Fields"][0];
            var Type = data["Name"];
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "ViewImg", "Src": "", "Style": "Height:30px;", "Parent": getTitle });
            if (Type.indexOf(".docx") >= 0 || Type.indexOf(".doc") >= 0) {
                url = "/img/fileIcon.png";
            } else if (Type.indexOf(".xlsx") > 0 || Type.indexOf(".xls") > 0) {
                url = "/img/excell.jpeg";
            } else if (Type.indexOf(".pptx") > 0 || Type.indexOf(".ppt") > 0) {
                url = "/img/pptx.png";
            } else if (Type.indexOf(".pdf") > 0) {
                url = "/img/pdf.png";
            } else if (Type.indexOf(".txt") > 0) {
                url = "/img/docPNP.png";
            }
            lodingImg.src = url;
            getTitle.innerHTML += Type;
            var OptionBar = GHVHS.DOM.create({ "Type": "div", "Class": "OptionBar", "Id": "OptionBar", "Parent": Elem });
            if (document.getElementById("canvas").offsetWidth < 1500) {
                OptionBar.style.marginLeft = "35%";
                OptionBar.style.width = "30%";
                OptionBar.style.height = "8%";
            }
            var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "FilesHeader", "Parent": Elem });
            Pnp.drawAddButtonAndLabel(EventHeader);
            if (!ViewOnly) {
            var barTopImg = GHVHS.DOM.create({ "Type": "div", "Class": "barTopImg", "Id": "barTopImg", "Parent": OptionBar });
            var imgs = ["/img/checkout.png", "/img/edit.png", "/img/RedX.png"];
            if (list == "PoliciesRelateddocuments") {
                var imgs = ["/img/checkout.png", "", "/img/RedX.png"];
            }
                for (var i = 0; i < imgs.length; i++) {
                    var singLabel = GHVHS.DOM.create({ "Type": "div", "Class": "singLabel", "Id": "singLabel", "Parent": barTopImg });
                    if (document.getElementById("canvas").offsetWidth < 1500) {
                        singLabel.style.fontSize = "80%";
                    }
                    var singleImgC = GHVHS.DOM.create({ "Type": "div", "Class": "singleImgC", "Id": "singleImgC", "Parent": OptionBar });
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "ViewImg" + i, "Src": imgs[i], "Style": "cursor:pointer;height:100%;margin-left:auto;margin-right:auto;display:block;margin-top:11%;", "Parent": singleImgC });


                    if (imgs[i] == imgs[0]) {
                        singLabel.innerHTML = "Check Out/In";
                        lodingImg.id = data["FileRef"];
                        lodingImg.onclick = function () {
                            var getcheckoutId = document.getElementById("CheckOutID");
                            var getcheckoutImg = document.getElementById("CheckOutImg");
                            var getTitle = document.getElementById("TitlePnp").innerText;
                            if (document.getElementById("ViewFile")) {
                                document.getElementById("ViewFile").style.display = "none";
                            }
                            Pnp.checkOutDoc(this, getcheckoutImg, getcheckoutId, getTitle, "Y");
                        }
                    } else if (imgs[i] == imgs[2]) {
                        singLabel.innerHTML = "Delete";
                        lodingImg.id = data["ID"] + "||" + data["Name"] + "|" + list;
                        lodingImg.onclick = function () {
                            var parent = this;
                            var id = this.id;
                            var datas = id.split("||");
                            var list = datas[1].split("|");
                            Pnp.DrawConfirmButton(parent, datas[0], list[0], list[1], "Y");
                        }
                    } else if (imgs[i] == imgs[1]) {
                        if (imgs[i] != "") {
                            singLabel.innerHTML = "Edit";
                            lodingImg.id = data["ID"] + "||" + data["Name"] + "|" + list + "[]!%" + data["FileRef"];
                            lodingImg.onclick = function () {
                                var parent = this;
                                var id = this.id;
                                var datas = id.split("||");
                                var list = datas[1].split("|");
                                var getfileList = list[1].split("[]!%");
                                if (document.getElementById("ViewFile")) {
                                    document.getElementById("ViewFile").style.display = "none";
                                }
                                Pnp.getSingleDocMeta(getfileList[0], datas[0], getfileList[1], list[0]);
                            }
                        }
                    }
                }
            } else {
                
                LabelView = GHVHS.DOM.create({ "Type": "div", "Class": "LabelView", "Id": "LabelView","Content":"View Policy", "Parent": OptionBar });
            }
            ColumnsData = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsData", "Id": "ColumnsData", "Parent": Elem });
            ColumnsDataTitle = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsDataTitle", "Id": "ColumnsDataTitle", "Content": "Document Meta Data", "Parent": ColumnsData });
            var AllColumns = {
                "Approved%20Policies": ["Name", "Modified", "Modified By", "Due Time", "GHVHSCategory", "GHVHSDepartment", "GHVHSLocation", "PolicyRelatedDoc1", "PolicyRelatedDoc2", "PolicyRelatedDoc3", "PolicyRelatedDoc4", "PolicyRelatedDoc5", "Checked Out By", "Is Checked Out"],
                "DraftPolicies": ["Name", "Modified", "Modified By", "Due Time", "GHVHSCategory", "GHVHSDepartment", "GHVHSLocation", "Conncurance work flow", "Title", "Approver Comments", "ID", "Concurrer", "Checked Out By", "Is Checked Out"],
                "ArchivePolicies": ["Name", "Modified", "Modified By", "GHVHSCategory", "GHVHSLocation", "GHVHSDepartment", "Checked Out By", "Is Checked Out"],
                "PoliciesRelateddocuments": ["Name", "Modified", "Editor", "Author", "Checked Out By", "Is Checked Out"]
            };
            var columns = AllColumns[list];
            for (var i = 0; i < columns.length; i++){
                NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:3.5%;", "Id": "NameAndInput", "Parent": ColumnsData });
                InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:5%;color:grey;", "Parent": NameAndInput });
                InputLabel.innerHTML = columns[i];
                if (document.getElementById("canvas").offsetWidth < 1500){
                    InputLabel.style.fontSize = "75%";
                    InputLabel.style.paddingTop = "2.5%";
                }
                if (data[columns[i]]) {
                    Filter = GHVHS.DOM.create({ "Type": "div", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/view.png); text-align:center; border-radius: 0px; padding-top:0.5%;background-color:white;background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                    Filter.innerHTML = data[columns[i]];
                    Filter.style.overflowX="auto";
                } else if (columns[i] == "Checked Out By") {
                    Filter = GHVHS.DOM.create({ "Type": "div", "Class": "Filter", "Id": "CheckOutID", "Style": "background-image: url(/img/view.png); text-align:center; border-radius: 0px; padding-top:0.5%;background-color:white;background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });
                    Filter.innerHTML = data["CheckedOut"];
                } else if (columns[i] == "Is Checked Out") {

                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "CheckOutImg", "Style": "border:1px solid grey; height:40px;min-width:40px; background-color:white;margin-left:2.5%;margin-top:2%;", "Parent": NameAndInput });
                    if (data["CheckedOut"]){
                        lodingImg.src = "/img/greenCheck.png";
                    }
                } else {
                    Filter = GHVHS.DOM.create({ "Type": "div", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/view.png); text-align:center; border-radius: 0px; padding-top:0.5%;background-color:white;background-size: 25px; width: 55%; height: 100%;", "Parent": NameAndInput });

                }
                

            }

            ColumnsView = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsView", "Id": "ColumnsView", "Parent": Elem });
            ViewFile = GHVHS.DOM.create({ "Type": "iframe", "Class": "ViewFile", "Id": "ViewFile", "Parent": ColumnsView });
            var File = data["FileRef"];
            function displayFile(json, p) {
                if (json["data"].indexOf(".doc") >= 0) {
                    p.src = "/Api/createpdf?path=" + json["data"];
                } else {
                    var img = json["data"].split("\\img\\");
                    p.src = "/img/" + img[1];
                }

            }
               
            var temp =  GHVHS.DOM.send({ "URL": "/PnP/SaveFile?url=http://sharepoint" + File, "Callback": displayFile, "CallbackParams": ViewFile });
                
               
        }
        var d = new Date();
        var n = d.getTime();
        var getItem = [];
        if (list == "ApprovedPolicies") {
            list = "Approved%20Policies"
            getItem = Pnp.GlobalAP;
        } else if (list == "DraftPolicies") {
            getItem = Pnp.GlobalDraftPolicies;
        } else if (list == "PoliciesRelateddocuments") {
            getItem = Pnp.GlobalPRD;
        } else if (list == "ArchivePolicies") {
            getItem = Pnp.GlobalArc;
        }
        var getSingleItem = Pnp.returnItemFromList(getItem, id, "ID");
        var jsonForFunction = { "Items": [{ "Fields": [getSingleItem] }]};
        DrawSingleItem(jsonForFunction, ViewOnly);
        //GHVHS.DOM.send({ "URL": "/Pnp/get" + list + "?Id=" + id+"&Dummy="+n, "CallbackParams": [], "Callback": DrawSingleItem });
    },
    drawSideMenu: function (Selected, Elem, AllFiles, ViewOnly) {
        var backg = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "sidebackground", "Style": "z-index:7000000000000000000000000009;display:none", "Parent": document.getElementById("canvas") });
        SideMenu = GHVHS.DOM.create({ "Type": "div", "Class": "SideMenu", "Id": "SideMenu", "Parent": document.getElementById("canvas") });
        var options = [{ "Label": "Home", "Link": "/PnP/Home" }, { "Label": "Policies Related Documents", "Link": "/PnP/PoliciesRelateddocuments" },
            { "Label": "Archive Policies", "Link": "/PnP/ArchivePolicies" }, { "Label": "Draft Policies ", "Link": "/PnP/DraftPolicies " }, { "Label": "Approved Policies", "Link": "/PnP/ApprovedPolicies" },
            { "Label": "Polices Discussion", "Link": "/PnP/PolicesDiscussion" }, { "Label": "Policies Related Documents", "Link": "/PnP/PoliciesRelateddocuments" }, { "Label": "My Concurrences", "Link": "/PnP/Concurrences" }];
        if (ViewOnly) {
            options = [{ "Label": "Home", "Link": "/PnP/Home/View" }, { "Label": "Policies Related Documents", "Link": "/PnP/PoliciesRelateddocuments/View" }, { "Label": "Approved Policies", "Link": "/PnP/ApprovedPolicies/View" }];
        }
        var menu = GHVHS.DOM.create({ "Type": "img", "Src": "/img/menu.png","Style":"margin-right:1%;height:5%;width:10%;margin-left:75%;", "Class": "menu", "Id": "menu", "Parent": SideMenu });
        menu.onclick = function () {
            var getMenu = document.getElementById("SideMenu");
            getMenu.style.left = "-1000px";
            if (document.getElementById("sidebackground").style.display == "block") {
                setTimeout(function () {
                    document.getElementById("sidebackground").style.display = "none";
                }, 10);
            }
        }
        
        for (var i = 0; i < options.length; i++) {
           
            SideLinks = GHVHS.DOM.create({ "Type": "a", "Class": "SideLinks", "Id": "SideLinks", "Parent": SideMenu });
            SideLinks.href = options[i]["Link"];
            SideLinks.innerHTML = options[i]["Label"];
            
        }
        
        expand = GHVHS.DOM.create({ "Type": "div", "Class": "expand", "Id": "expand", "Content": "Expand All", "Parent": SideMenu });
        expand.onclick = function () {
            var getFileHolders = document.getElementById("filetree").querySelectorAll(".policyfileshide");
            var imgs = document.getElementById("filetree").querySelectorAll(".CArrowEdit");
            var getFileHolderslen = getFileHolders.length;
            for (var i = 0; i < getFileHolders.length; i++){
                getFileHolders[i].className = "policyfiles";
                
            }
            for (var i = 0; i < imgs.length; i++) {
                imgs[i].style.transform = "rotate(0deg)";
            }
            var getSideLinks = document.getElementById("SideMenu").querySelectorAll(".SideLinks");
            for (var i = 0; i < getSideLinks.length; i++) {
                getSideLinks[i].style.display = "none";
            }
            document.getElementById("filetree").style.height = "85%";
        }
        expandClose = GHVHS.DOM.create({ "Type": "div", "Class": "expand", "Id": "expandClose", "Content": "Collapse All", "Parent": SideMenu });
        expandClose.onclick = function () {
            var getFileHolders = document.getElementById("SideMenu").querySelectorAll(".policyfiles");
            var imgs = document.getElementById("filetree").querySelectorAll(".CArrowEdit");
            for (var i = 0; i < getFileHolders.length; i++) {
                getFileHolders[i].className = "policyfileshide";
            }
            for (var i = 0; i < imgs.length; i++) {
                imgs[i].style.transform = "rotate(180deg)";
            }
            var getSideLinks = document.getElementById("SideMenu").querySelectorAll(".SideLinks");
            for (var i = 0; i < getSideLinks.length; i++) {
                getSideLinks[i].style.display = "block";
            }
            var policies = ["Archive Policies", "Draft Policies", "Approved Policies", "Policies Related Documents"];
            document.getElementById("policyfiles").className = "policyfiles";
            document.getElementById("filetree").style.height = "40%";
        }
        if (ViewOnly) {
            setTimeout(function () {
                expand.click();
                var getSideLinks = document.getElementById("SideMenu").querySelectorAll(".SideLinks");
                for (var i = 0; i < getSideLinks.length; i++) {
                    getSideLinks[i].style.display = "block";
                }
                document.getElementById("filetree").style.height = "70%";
                expand.className = "hide";
                expandClose.className = "hide";
            }, 200);
        }
        filetree = GHVHS.DOM.create({ "Type": "div", "Class": "filetree", "Style": "height:40%;", "Id": "filetree", "Parent": SideMenu });
        var d = new Date();
        var n = d.getTime();
        Pnp.DrawFileTree(AllFiles, ViewOnly);
       

    },
    AllFiles: [],
    GlobalPRD: [],
    GlobalArc:[],
    GlobalAP: [],
    DrawFileTree: function (json,ViewOnly) {
        Pnp.AllFiles = json;
        filetree = document.getElementById("filetree");
        policyfiles = GHVHS.DOM.create({ "Type": "div", "Class": "policyfiles",  "Id": "policyfiles", "Parent": filetree });
        var policies = ["ArchivePolicies", "DraftPolicies", "ApprovedPolicies"];
        if (ViewOnly) {
            policies = ["ApprovedPolicies"];
        }
        var columns = ["GHVHSCategory", "GHVHSDepartment", "GHVHSLocation"];
        var labels = {
            "GHVHSCategory": ["Administration", "Behavioral Health", "Biomedical Engineering", "Blood Bank", "Bone and Joint Center",
            "Breast Center", "Cardiac Services", "Centralized Scheduling", "Clinical Services", "Diabetes Center", "Dietary Services", "Emergency Services", "Employee Health",
            "Environmental Services", "Foundation", "ICU", "Infection Control", "Interventional Radiology", "Laboratory Services", "Medical Groups", "Medical Imaging", "Medical Record",
            "Medical School Education", "Medical/Surgical", "Mother Baby Services", "Nuclear Medicine", "Nursery", "Oncology", "OP Observation", "Outpatient Services", "Pediatrics",
            "Pharmacy", "Physical Environment", "Skilled Nursing", "Staffing Management", "Step Down", "Support Services", "Surgical Services", "Telemetry", "Wound Care"],
            "GHVHSDepartment": ["CSK AMB INFECT DISEASE", "CSK AMB MEDICAL GROUP", "CSK HARRIS FAMILY HLTH", "CSK PT FIN SVC", "CSK WATER DEPARTMENT", "ORMC AMB MEDICAL GROUP", "ORMC ED", "ORMC MEDICAL EDUCATION", "ORMC PT FIN SVCS", "ORMC SDS PHASE II", ],
            "GHVHSLocation": ["Callicoon", "CRMC", "GHVHS", "Medical Group", "ORMC", "Urgent Care"]
        };
        for (var i = 0; i < policies.length; i++){
            singleFoldersP = GHVHS.DOM.create({ "Type": "div", "Class": "singleFolders","Style": "font-size:120%;", "Id": policies[i], "Content": policies[i], "Parent": policyfiles });
            singleFoldersP.onclick = function () {
                var ele = this.id;
                var getpfiles = document.getElementById(ele + "||" + "columns");
                var img = this.querySelector("img");
                if (getpfiles.className == "policyfileshide") {
                    getpfiles.className = "policyfiles";
                    img.style.transform = "rotate(0deg)";
                } else if (getpfiles.className == "policyfiles") {
                    getpfiles.className = "policyfileshide";
                    img.style.transform = "rotate(180deg)";
                }
            }
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "Rotate", "Src": "/img/blackDrop.png", "Style": "Height:10px;transition:transform 0.2s ease;transform:rotate(180deg);", "Parent": singleFoldersP });
            var policyfilestemp = GHVHS.DOM.create({ "Type": "div", "Class": "policyfileshide", "Id": policies[i] + "||" + "columns", "Parent": policyfiles });
            for (var j = 0; j < columns.length; j++) {
                singleFoldersC = GHVHS.DOM.create({ "Type": "div", "Class": "singleFolders", "Id": policies[i] + "||" + columns[j], "Style": "margin-left:4%;font-size:110%;", "Content": columns[j], "Parent": policyfilestemp });
                singleFoldersC.onclick = function () {
                    var ele = this.id;
                    var getpfiles = document.getElementById(ele + "||" + "labels");
                    var img = this.querySelector("img");
                    if (getpfiles.className == "policyfileshide") {
                        getpfiles.className = "policyfiles";
                        img.style.transform = "rotate(0deg)";
                    } else if (getpfiles.className == "policyfiles") {
                        getpfiles.className = "policyfileshide";
                        img.style.transform = "rotate(180deg)";
                    }
                }
               
                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "Rotate", "Src": "/img/blackDrop.png", "Style": "Height:10px;transition:transform 0.2s ease;transform:rotate(180deg);", "Parent": singleFoldersC });
                var data = labels[columns[j]];
                var policyfilestempL = GHVHS.DOM.create({ "Type": "div", "Class": "policyfileshide", "Id": policies[i] + "||" + columns[j] + "||" + "labels", "Parent": policyfilestemp });
                for (var k = 0; k < data.length; k++) {
                    singleFoldersD = GHVHS.DOM.create({ "Type": "div", "Class": "singleFolders", "Id": policies[i] + "||" + columns[j] + "||" + data[k], "Style": "margin-left:8%;", "Content": data[k], "Parent": policyfilestempL });
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "Rotate", "Src": "/img/blackDrop.png", "Style": "Height:10px;transition:transform 0.2s ease;transform:rotate(180deg);", "Parent": singleFoldersD });
                    var policyfilestempLink = GHVHS.DOM.create({ "Type": "div", "Class": "policyfileshide", "Id": policies[i] + "||" + columns[j] + "||" +data[k] + "||" + "Links", "Parent": policyfilestempL });
                    singleFoldersD.onclick = function () {
                        var ele = this.id;
                        var getpfiles = document.getElementById(ele + "||" + "Links");
                        var img = this.querySelector("img");
                        if (getpfiles.className == "policyfileshide") {
                            getpfiles.className = "policyfiles";
                            img.style.transform = "rotate(0deg)";
                        } else if (getpfiles.className == "policyfiles") {
                            getpfiles.className = "policyfileshide";
                            img.style.transform = "rotate(180deg)";
                        }
                    }
                    var getlist = policies[i]; 
                    for (var l=0; i < getlist.indexOf(" "); l++ ){
                        getlist = getlist.replace(" ", "");
                    }
                    if (getlist == "PoliciesRelatedDocuments") {
                        getlist = "PoliciesRelateddocuments";
                    }
                    if (getlist == "PoliciesRelateddocuments") {
                        getlist = "Policies%20%20Related%20%20documents";
                    }
                    var theJson;
                    if (getlist == "ApprovedPolicies") {
                        getlist = "Approved%20Policies";
                    }
                    for (var h = 0; h < json.length; h++){
                        if (json[h]["Id"] == getlist) {
                            theJson = json[h]["SingleItem"];
                            if (getlist == "DraftPolicies"){
                                Pnp.GlobalDraftPolicies = json[h]["SingleItem"];
                            } else if (getlist == "Approved%20Policies") {
                                Pnp.GlobalAP =  json[h]["SingleItem"];
                            } else if (getlist == "ArchivePolicies") {
                                Pnp.GlobalArc = json[h]["SingleItem"];
                            } else if (getlist == "Policies%20%20Related%20%20documents") {
                                Pnp.GlobalPRD = json[h]["SingleItem"];
                            }
                        } else if (json[h]["Id"] == "Policies%20%20Related%20%20documents") {
                            Pnp.GlobalPRD = json[h]["SingleItem"];
                        }
                    }
                    for (var l = 0; l < theJson.length; l++) {
                        if (theJson[l]["Fields"]) {
                            var tempData = theJson[l]["Fields"][0];
                            var tempSingleData = "";
                            if (tempData[columns[j]]) {
                                tempSingleData = tempData[columns[j]].toLowerCase();
                            }
                            var tempSingle = data[k].toLowerCase();
                            if (tempSingle == tempSingleData) {
                                singleFoldersC = GHVHS.DOM.create({ "Type": "a", "Class": "singleFolders", "Id": columns[j] + "||" + data[k], "Style": "margin-left:12%;", "Parent": policyfilestempLink });
                                var tempList = "";
                                if (getlist == "Approved%20Policies") {
                                    tempList = "ApprovedPolicies";
                                } else {
                                    tempList = getlist;
                                }
                                if (ViewOnly) {
                                    singleFoldersC.href = "/Pnp/ViewItem/" + tempList + "?ItemId=" + tempData["ID"] + "&ViewOnly=Y";
                                } else {
                                    singleFoldersC.href = "/Pnp/ViewItem/" + tempList + "?ItemId=" + tempData["ID"];
                                }
                                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit temp", "Id": "Rotate", "Src": "/img/blackDrop.png", "Style": "Height:13px;transition:transform 0.2s ease;", "Parent": singleFoldersC });
                                var Type = tempData["Name"];
                                var url = "";
                                if (Type.indexOf(".docx") >= 0 || Type.indexOf(".doc") >= 0) {
                                    url = "/img/fileIcon.png";
                                } else if (Type.indexOf(".xlsx") > 0 || Type.indexOf(".xls") > 0) {
                                    url = "/img/excell.jpeg";
                                } else if (Type.indexOf(".pptx") > 0 || Type.indexOf(".ppt") > 0) {
                                    url = "/img/pptx.png";
                                } else if (Type.indexOf(".pdf") > 0) {
                                    url = "/img/pdf.png";
                                } else if (Type.indexOf(".txt") > 0) {
                                    url = "/img/docPNP.png";
                                }
                                lodingImg.src = url;
                                singleFoldersC.innerHTML += tempData["Name"];
                            }
                        }
                    }
                }
            }
        }
    },
    DrawTopBar: function (Username, Elem, T, NoMenu, ViewOnly) {
        if (NoMenu == "View") {
            ViewOnly = "View";
            NoMenu = "";
        }
        var barTop = GHVHS.DOM.create({ "Type": "div", "Class": "barTop", "Id": "barTop", "Parent": Elem });
        if (!NoMenu ) {
            var menu = GHVHS.DOM.create({ "Type": "img", "Src": "/img/whiteMenu.png", "Class": "menu2", "Id": "menu", "Parent": barTop });
            menu.onclick = function () {
                var getMenu = document.getElementById("SideMenu");
                getMenu.style.left = "0px";
                
                if (document.getElementById("sidebackground").style.display == "none") {
                    setTimeout(function () {
                        document.getElementById("sidebackground").style.display = "block";
                    }, 10);
                }
            }
        }
        var TitlePnp = GHVHS.DOM.create({ "Type": "div", "Class": "TitlePnp", "Id": "TitlePnp", "Content": "Policies And Procedures", "Parent": barTop });
        TitlePnp.innerHTML = T;
        if (!NoMenu) {
            var user = GHVHS.DOM.create({ "Type": "div", "Class": "user", "Id": "user", "Parent": barTop });
            user.innerHTML = "Welcome: " + Username;
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "Rotateblack", "Src": "/img/blackDrop.png", "Style": "Height:10px;transition:transform 0.2s ease;transform:rotate(180deg);", "Parent": user });
            if (!ViewOnly) {
                user.onclick = function () {
                    var theDrop = document.getElementById("userDrop");
                    var arrow = document.getElementById("Rotateblack");
                    if (!theDrop) {

                        arrow.style.transform = "rotate(0deg)";
                        var TitlePnp = GHVHS.DOM.create({ "Type": "div", "Class": "userDrop", "Id": "userDrop", "Parent": barTop });
                        TitlePnp.style.left = this.offsetLeft + "px";
                        TitlePnp.style.top = (this.parentElement.offsetHeight + this.parentElement.offsetTop) + "px";
                        TitlePnp.style.width = this.offsetWidth + "px";
                        var MasterRefesh = GHVHS.DOM.create({ "Type": "div", "Class": "logOut", "Content": "Master Refresh", "Id": "", "Parent": TitlePnp });
                        var logOut = GHVHS.DOM.create({ "Type": "div", "Class": "logOut", "Content": "Log Out", "Id": "logOut", "Parent": TitlePnp });
                       
                        logOut.onclick = function () {
                            function reloadPage() {
                                window.location.href = window.location.href;
                            }
                            var d = new Date();
                            var n = d.getTime();
                            var temp = GHVHS.DOM.send({ "URL": "/PnP/logOut" + "?Dummy=" + n, "Callback": reloadPage, "CallbackParams": [] });
                        }
                        MasterRefesh.onclick = function () {
                            var ifram = GHVHS.DOM.create({ "Type": "iframe", "Class": "hide", "Src": "/Pnp/ClearLists", "Id": "", "Parent": TitlePnp });
                            GHVHS.DOM.DrawSmallLoader2();
                            ifram.onload = function () {
                                window.location.href = window.location.href;
                            }
                        }
                    } else {

                        arrow.style.transform = "rotate(180deg)";
                        theDrop.parentElement.removeChild(theDrop);
                    }
                }
            }
        } else {
            TitlePnp.style.width = "90%";
        }
    },
    Home: function (Username, AllFiles, SearchByList, SearchValue, ViewOnly) {
        if (SearchByList.indexOf("/")>=0) {
            var splited = SearchByList.split("/");
            SearchByList = splited[0];
        }
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu("Home", Elem, AllFiles, ViewOnly);
        if (!SearchByList) {
            Pnp.DrawTopBar(Username, Elem, "Home", ViewOnly);
        }else{
            var value  = SearchByList +" Search"; 
            Pnp.DrawTopBar(Username, Elem, value, "Y", ViewOnly);
            setTimeout(function () {
                document.getElementById("barTop").style.marginTop = "0.0%";
                document.getElementById("menu").style.display = "none";
            }, 15);
            
        }
        DrawColumns1 = GHVHS.DOM.create({ "Type": "div", "Class": "DrawColumns1", "Id": "DrawColumns1", "Parent": Elem });
        DrawColumns2 = GHVHS.DOM.create({ "Type": "div", "Class": "DrawColumns2", "Id": "DrawColumns2", "Parent": Elem });
        LandingImage = GHVHS.DOM.create({ "Type": "img", "Src": "/img/PnP.jpg", "Class": "LandingImage", "Id": "LandingImage", "Parent": DrawColumns2 });
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "height:5%;text-align:center; padding-left:0px;", "Parent": DrawColumns2 });
        Filter.setAttribute("placeholder", "Search For Documents....");
        Filter.setAttribute("autocomplete", "Off");
        SearchBox = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButton", "Id": "SearchButton", "Style": "transition:all 0.25s ease;width: 30%;margin-left:12%;height: 2%;background-color:#a8b2bb;", "Content": "Search", "Parent": DrawColumns2 });
        SearchBoxClear = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButton", "Id": "SearchBoxClear", "Style": "transition:all 0.25s ease;width: 30%;margin-left:10%;height: 2%;background-color:#a8b2bb;", "Content": "Clear Search", "Parent": DrawColumns2 });
        if (SearchValue) {
            Filter.value = SearchValue;
            setTimeout(function () { SearchBox.click(); }, 100);
            
        }
        SearchBox.onclick = function () {
            var landingImg = document.getElementById("LandingImage");
            var filter = document.getElementById("Filter");
            var filterValue = filter.value;
            if (landingImg.style.display != "none" && filterValue != "") {
                landingImg.style.height = "1px";
                setTimeout(function () {
                    landingImg.style.display = "none";
                   
                }, 400);
                var SearchInfo = GHVHS.DOM.create({ "Type": "div", "Class": "SearchInfo", "Id": "SearchInfo", "Parent": DrawColumns2 });
                var SearchResults = GHVHS.DOM.create({ "Type": "div", "Class": "SearchResults", "Id": "SearchResults", "Parent": DrawColumns2 });
                SearchResults.style.top = "35%";
                SearchResults.style.height = "70%";
                FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": " transition: height 1s ease-in-out;Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);z-index: 90000000000;", "Parent": SearchResults });

                FaxTableLoader.style.width = SearchResults.offsetWidth + "px";
                FaxTableLoader.style.height = "75%";
                setTimeout(function () {

                    var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
                    SearchLoader.style.marginLeft = "45%";
                    Pnp.SearchAll(SearchResults, filter, filterValue, SearchInfo, SearchByList,  ViewOnly);
                    if (SearchValue) {
                        document.getElementById("SearchResults").style.height = "80%";
                    }
                }, 400);
                
            } else if (filterValue != "") {
                var SearchInfo = document.getElementById("SearchInfo");
                var SearchResults = document.getElementById("SearchResults");
                FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": " transition: height 1s ease-in-out;Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);z-index: 90000000000;", "Parent": SearchResults });

                FaxTableLoader.style.width = SearchResults.offsetWidth + "px";
                FaxTableLoader.style.height = "75%";
                var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
                SearchLoader.style.marginLeft = "45%";
                Pnp.SearchAll(SearchResults, filter, filterValue, SearchInfo, SearchByList,  ViewOnly);
               
            }
        }
        SearchBoxClear.onclick = function () {
            var landingImg = document.getElementById("LandingImage");
            landingImg.style.display = "";
            setTimeout(function () {
                landingImg.style.height = "51%";
            }, 10);
            
            var filter = document.getElementById("Filter");
            filter.value = "";
            var SearchResults = document.getElementById("SearchResults");
            var SearchInfo = document.getElementById("SearchInfo");
            SearchResults.parentElement.removeChild(SearchResults);
            SearchInfo.parentElement.removeChild(SearchInfo);
        }
        DrawColumns1 = GHVHS.DOM.create({ "Type": "div", "Class": "DrawColumns1", "Id": "DrawColumns1", "Parent": Elem });
    },
    SearchAll: function (SearchResults, filter, filterValue, SearchInfo, SearchByList, ViewOnly) {
        var searchLoader = document.getElementById("SearchLoader");
        if (!searchLoader) {
            FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": " transition: height 1s ease-in-out;Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);z-index: 90000000000;", "Parent": SearchResults });

            FaxTableLoader.style.width = SearchResults.offsetWidth + "px";
            FaxTableLoader.style.height = "75%";
            var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
            SearchLoader.style.marginLeft = "45%";
        }
        function drawSearchResults(json, p, ViewOnly) {
            var searchResulElem = p[0];
            var searchValue = p[1];
            var searchInfo = p[2];
            while (searchResulElem.firstChild) {
                searchResulElem.removeChild(searchResulElem.firstChild);
            }
            var count = 0;
            for (var i = 0; i < json.length; i++) {
                
                console.log(json[i]["FileRef"]);
                var getListSplit = json[i]["FileRef"].split("/Policies/");
                        var splitURlSub = getListSplit[1].split("/");
                        var name = splitURlSub[1];
                        var list = splitURlSub[0];
                        list = list.replace("%20", "");
                        list = list.replace(" ", "");
                        var getItem;
                        if (list == "ApprovedPolicies") {
                            getItem = Pnp.GlobalAP;
                        } else if (list == "DraftPolicies") {
                            getItem = Pnp.GlobalDraftPolicies;
                        } else if (list == "Policies Related  documents") {
                            getItem = Pnp.GlobalPRD;
                        } else if (list == "ArchivePolicies") {
                            getItem = Pnp.GlobalArc;
                        }
                        
                            count++;
                            SingleResult = GHVHS.DOM.create({ "Type": "div", "Class": "SingleResult", "Id": "SingleResult", "Parent": searchResulElem });
                            var id = json[i]["ID"];
                            SingleResultHeader = GHVHS.DOM.create({ "Type": "a", "Class": "SingleResultHeader", "Href": "/PnP/ViewItem/" + list + "?itemId=" + json[i]["ID"], "Id": "SingleResultHeader", "Parent": SingleResult });
                            if (ViewOnly) {
                                SingleResultHeader.href =  "/PnP/ViewItem/" + list + "?itemId=" + json[i]["ID"] + "&ViewOnly=Y";
                            }
                            var headeValue = name;
                            if (headeValue.indexOf(searchValue) >= 0) {
                                var temp1 = headeValue;
                                temp1 = temp1.replace(searchValue, "<span style='background-color:yellow'>" + searchValue + "</span>");
                                SingleResultHeader.innerHTML = temp1;
                            } else {
                                SingleResultHeader.innerHTML = headeValue + " ";
                            }

                            SingleResultBody = GHVHS.DOM.create({ "Type": "div", "Class": "SingleResultBody", "Id": "SingleResultBody", "Parent": SingleResult });
                            FileImg = GHVHS.DOM.create({ "Type": "img", "Class": "FileImg", "Id": "FileImg", "Parent": SingleResultBody });
                            var Type = name;
                            var url = "";
                            if (Type.indexOf(".docx") >= 0 || Type.indexOf(".doc") >= 0) {
                                url = "/img/fileIcon.png";
                            } else if (Type.indexOf(".xlsx") > 0 || Type.indexOf(".xls") > 0) {
                                url = "/img/excell.jpeg";
                            } else if (Type.indexOf(".pptx") > 0 || Type.indexOf(".ppt") > 0) {
                                url = "/img/pptx.png";
                            } else if (Type.indexOf(".pdf") > 0) {
                                url = "/img/pdf.png";
                            } else if (Type.indexOf(".txt") > 0) {
                                url = "/img/docPNP.png";
                            }
                            FileImg.src = url;
                            txtBody = GHVHS.DOM.create({ "Type": "div", "Class": "txtBody", "Id": "txtBody", "Parent": SingleResultBody });
                    
                            var columns = ["DocumentContents", "Name", "Modified", "Modified By", "GHVHS Category", "GHVHS Department", "GHVHSLocation", "Policy Related Doc1", "Policy Related Doc2", "Policy Related Doc3", "Policy Related Doc4", "Policy Related Doc5", "Title", "ID", "Concurrer"];

                            
                            
                            for (var j = 0; j < columns.length; j++) {
                                if (columns[j] == "DocumentContents") {
                                    var temp = json[i][columns[j]];
                                    if (json[i][columns[j]]) {
                                        txtBody.innerHTML += temp + "<br>";
                                        if (temp.length < 120) {
                                            txtBody.style.height = "auto";
                                            txtBody.style.minHeight = "0%";
                                            SingleResultHeader.style.height = "auto";
                                            SingleResultBody.style.height = "auto";
                                            SingleResult.style.height = "auto";
                                        }
                                        if (json[i][columns[j]].indexOf(searchValue) >= 0) {
                                            Pnp.highlight(searchValue, txtBody);
                                        }
                                    } else {
                                        SingleResultHeader.style.height = "auto";
                                        txtBody.style.height = "auto";
                                        txtBody.style.minHeight = "0%";
                                        SingleResultBody.style.height = "auto";
                                        SingleResult.style.height = "auto";
                                    }
                                } else if (json[i][columns[j]]) {
                                    SingleTextElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTextElem", "Id": "SingleTextElem", "Parent": SingleResultBody });

                                    if (json[i][columns[j]].indexOf(searchValue) >= 0) {
                                        var temp = json[i][columns[j]];
                                        temp = temp.replace(searchValue, "<span style='background-color:yellow'>" + searchValue + "</span>");
                                        SingleTextElem.innerHTML = temp;
                                    } else {
                                        SingleTextElem.innerHTML = json[i][columns[j]] + " ";
                                    }
                                }
                            }
                        BodyFooter = GHVHS.DOM.create({ "Type": "div", "Class": "BodyFooter", "Id": "BodyFooter", "Parent": SingleResultBody });
                        var footerValue = json[i]["LastModified"] + " - " + "http://sharepoint/"+json[i]["FileRef"];
                        if (footerValue.indexOf(searchValue) >= 0) {
                            var temp3 = footerValue;
                            temp3 = temp3.replace(searchValue, "<span style='background-color:yellow'>" + searchValue + "</span>");
                            BodyFooter.innerHTML = temp3;
                        } else {
                            BodyFooter.innerHTML = footerValue + " ";
                        }

                    
            }
            searchInfo.innerHTML = "Search results for: " + searchValue + "<br><span style='font-size:90%'>" + count + " results found </span>";
        }
        var d = new Date();
        var n = d.getTime();
        var SearchResultItems = Pnp.SearchCacheItems(filterValue, SearchByList, ViewOnly);
        drawSearchResults(SearchResultItems, [SearchResults, filterValue, SearchInfo], ViewOnly);
        //GHVHS.DOM.send({ "URL": "/Pnp/APISearch?Search=" + filterValue, "Callback": drawSearchResults, "CallbackParams": [SearchResults, filterValue, SearchInfo] });
        //GHVHS.DOM.send({ "URL": "/PnP/SearchAll?search=" + filterValue + "&Dummy=" + n, "Callback": drawSearchResults, "CallbackParams": [SearchResults, filterValue, SearchInfo] });
    },
    highlight: function (text, element) {
        var innerHTML = element.innerHTML;
        var index = innerHTML.indexOf(text);
            if (index >= 0) { 
                innerHTML = innerHTML.substring(0, index) + "<span style='background-color:yellow'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
                element.innerHTML = innerHTML;
            }
        },
    SearchCacheItems: function (searchValue, SearchByList, ViewOnly) {
        var array = [Pnp.GlobalDraftPolicies, Pnp.GlobalAP, Pnp.GlobalPRD];
        if (ViewOnly) {
            array = [ Pnp.GlobalAP, Pnp.GlobalPRD];
        }
        if (SearchByList){
            if (SearchByList == "ApprovedPolicies") {
                array = [Pnp.GlobalAP];
            } else if (SearchByList == "DraftPolicies") {
                array = [Pnp.GlobalDraftPolicies];
            } else if (SearchByList == "Policies Related  documents") {
                array = [Pnp.GlobalPRD];
            } else if (SearchByList == "ArchivePolicies") {
                array = [Pnp.GlobalArc];
            }
        }
        var columns = ["DocumentContents", "Name", "Modified", "Modified By", "GHVHS Category", "GHVHS Department", "GHVHSLocation", "Policy Related Doc1", "Policy Related Doc2", "Policy Related Doc3", "Policy Related Doc4", "Policy Related Doc5", "Title", "ID", "Concurrer"];
        var outputResults = [];
        var valueLowered = searchValue.toLowerCase();
        for (var i = 0; i < array.length; i++){
            for (var j = 0; j < array[i].length; j++){
                var inRsults = "";
                for (var k = 0; k < columns.length; k++) {
                    if (inRsults != "Y") {
                        if (array[i][j]["Fields"][0][columns[k]]) {
                            var valueToCheck = array[i][j]["Fields"][0][columns[k]].toLowerCase();
                            if (valueToCheck.indexOf(valueLowered) >= 0) {
                                inRsults = "Y";
                            }
                        }
                    }

                }
                if (inRsults == "Y") {
                    outputResults.push(array[i][j]["Fields"][0]);
                }
            }
        }
        return outputResults;
    },
    ApprovedPolicies: function (Username, FullName, AllFiles, ViewOnly) {
        var Columns = ["img", "Name", "Modified", "Modified By", "GHVHS Category", "GHVHS Department", "GHVHSLocation", "Policy Related Doc1", "Policy Related Doc2", "Policy Related Doc3", "Policy Related Doc4"];
        var Title = "Approved Policies";
        var route = "ApprovedPolicies";
        Pnp.Documents(Username, FullName, Title, route, Columns, AllFiles, ViewOnly);
    },
    DraftPolicies: function (Username, FullName, AllFiles) {
        var Columns = ["img", "Name", "Modified", "Modified By", "GHVHS Category", "GHVHS Department", "GHVHSLocation", "Title",   "Concurrer" ];
        var Title = "Draft Policies";
        var route = "DraftPolicies";
        Pnp.Documents(Username, FullName, Title, route, Columns, AllFiles);
    },
    ArchivePolicies: function (Username, FullName, AllFiles) {
        var Columns = ["img", "Name", "Modified", "Modified By", "GHVHS Category", "GHVHS Department", "GHVHSLocation"];
        var Title = "Archive Policies";
        var route = "ArchivePolicies";
        Pnp.Documents(Username, FullName, Title, route, Columns, AllFiles);
    },
    PoliciesRelateddocuments: function (Username, FullName, AllFiles, ViewOnly) {
        var Columns = ["img", "Name", "Modified", "Modified By"];
        var Title = "Policies Related documents";
        var route = "PoliciesRelateddocuments";
        Pnp.Documents(Username, FullName, Title, route, Columns, AllFiles, ViewOnly);
    },
    Concurences: function (Username, FullName, AllFiles, Approved) {
        var Columns = ["Title", "Status", "PercentComplete", "Assigned To", "Author", "CreatedOn", "StartDate", "DueDate", "AllConcurrers", "Approve", "Reject"];
        var Title = "My Concurences";
        var route = "Concurences";
        if (Approved) {
            var Columns = ["Title", "Status", "PercentComplete", "Assigned To", "Author", "CreatedOn", "StartDate", "DueDate", "AllConcurrers"];
            var Title = "My Approved Concurences";
            var route = "Concurences";
        }
        Concurence.DrawConcurs(Username, FullName, Title, route, Columns, AllFiles, "", Approved);
    },
    searchPage: function (list, search, ViewOnly) {
        var searchButton = document.getElementById("searchButtonMain");
        var searchButtonC = document.getElementById("searchButtonClear");
        if (!searchButton ) {
            if (search.value != "") {
                searchButtonMain = GHVHS.DOM.create({ "Type": "div", "Class": "searchButtonMain", "Id": "searchButtonMain", "Content": "Search", "Parent": document.getElementById("MainContent") });
                searchButtonClear = GHVHS.DOM.create({ "Type": "div", "Class": "searchButtonMain", "Id": "searchButtonClear", "Content": "Clear Search", "Parent": document.getElementById("MainContent") });
                searchButtonMain.style.top = (search.offsetTop + search.offsetHeight + 5) + "px";
                searchButtonMain.style.height = (search.offsetHeight - 19) + "px";
                searchButtonMain.style.left = (search.offsetLeft + (search.offsetWidth * 0.08)) + "px";
                searchButtonClear.style.top = (search.offsetTop + search.offsetHeight + 5) + "px";
                searchButtonClear.style.height = (search.offsetHeight - 19) + "px";
                searchButtonClear.style.width = search.offsetWidth - (search.offsetWidth * 0.6) + "px"
                document.getElementById("FilesWidget").style.marginTop = (search.offsetHeight + 10) + "px";
                searchButtonMain.style.width = search.offsetWidth - (search.offsetWidth * 0.6) + "px"
                searchButtonClear.style.left = (search.offsetLeft + (search.offsetWidth * 0.12) + searchButtonMain.offsetWidth) + "px";
                searchButtonMain.style.borderRadius = "10px";
                searchButtonClear.style.borderRadius = "10px";
                searchButtonMain.onclick = function () {
                    var url = window.location.href.split("PnP/");
                    var linktoIframe = "/PnP/Home?List=" + url[1] + "&SearchValue=" + search.value;
                    if (ViewOnly) {
                        linktoIframe = "/PnP/Home/View?List=" + url[1] + "&SearchValue=" + search.value;
                    }
                    GHVHS.DOM.GlobalNumberFax = this.id;

                    GHVHS.DOM.drawslideUpIframe(linktoIframe, "", "");
                    /*GHVHS.DOM.DrawSmallLoader2();
                    var filter = "?$filter=substringof(%27" + search.value + "%27,TaxCatchAll/Term)%20or%20substringof(%27" + search.value + "%27,Title)";
                    var FileWidget = document.getElementById("FilesBody2");
                    var singles = FileWidget.querySelectorAll(".SingleTableElem");
                    for (var i = 0; i < singles.length; i++) {
                        FileWidget.removeChild(singles[i]);
                    }
                    var d = new Date();
                    var n = d.getTime();
                    if (list == "Concurrences") {
                        list = "Concurences";
                    }
                    if (list == "Concurrences" || list == "Concurences") {
                        var filter = "?$filter=substringof(%27" + search.value + "%27,Title)";
                    }
                    var temp =  GHVHS.DOM.send({ "URL": "/PnP/get" + list + "?Dummy=" + n + "&filter=" + filter, "Callback": Pnp.DrawDocuments, "CallbackParams": [FileWidget, Pnp.GobalColumns, list] });*/
                }
                searchButtonClear.onclick = function () {
                    GHVHS.DOM.DrawSmallLoader2();
                    search.value = "";
                    search.click();
                    var FileWidget = document.getElementById("FilesBody2");
                    var singles = FileWidget.querySelectorAll(".SingleTableElem");
                    for (var i = 0; i < singles.length; i++) {
                        FileWidget.removeChild(singles[i]);
                    }
                    var d = new Date();
                    var n = d.getTime();
                    if (list == "Concurrences") {
                        list = "Concurences";
                    }
                    var temp =  GHVHS.DOM.send({ "URL": "/PnP/get" + list + "?Dummy=" + n , "Callback": Pnp.DrawDocuments, "CallbackParams": [FileWidget, Pnp.GobalColumns,list] });
                }
            }
        } else {
            if (search.value == "" ) {
                var searchButton = document.getElementById("searchButtonMain");
                var searchButtonC = document.getElementById("searchButtonClear");
                if (searchButton){
                }
                searchButtonMain.style.paddingTop = "0px";
                searchButtonMain.style.paddingBottom = "0px";
                searchButtonMain.style.height = "0px";
                searchButtonC.style.paddingTop = "0px";
                searchButtonC.style.paddingBottom = "0px";
                searchButtonC.style.height = "0px";
                search.style.marginLeft = "26%";
                search.style.width = "45%";
                document.getElementById("FilesWidget").style.marginTop = "0.5%";
                setTimeout(function () {
                    searchButton.parentElement.removeChild(searchButton);
                    searchButtonC.parentElement.removeChild(searchButtonC);
                }, 350);
            }
        }
    },
    ReturnUser: function (FullName, UserName) {
        var result = "";
        for (var i = 0; i < Pnp.GobalUsers["Items"].length; i++) {
            if (Pnp.GobalUsers["Items"][i]["Fields"][0]["Name"].indexOf(UserName) >= 0){
                result =  Pnp.GobalUsers["Items"][i]["Fields"][0]["Title"];
            } else {
                if (result == "") {
                    result = FullName;
                }
                
            }
        }
        return result;
    }, 
    FullName: "",
    UserName:"",
    GobalColumns: [],
    GobalUsers: [],
    Documents: function (Username, FullName, Title, Route, Columns, AllFiles, ViewOnly, Approved) {
        
        if (!ViewOnly) {
            if (Route != "PoliciesRelateddocuments" || Route != "ArchivePolicies") {
                Columns.push("Checked Out By", "Is Checked Out", "View", "Check Out", "Edit", "Delete");
            } else {
                Columns.push("Checked Out By", "Is Checked Out", "View", "Check Out", "Delete");
            }
        } else {
            Columns.push("Checked Out By", "Is Checked Out", "View");
        }
        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu(Title, Elem, AllFiles,ViewOnly);
        Pnp.FullName = FullName;
        Pnp.GobalColumns = Columns;
        Pnp.DrawTopBar(Username, Elem, Title, ViewOnly);
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "transition: margin-left .25s,height .25s;text-align:center;margin-left:26%;height:5%;Width:45%;margin-bottom:0px;", "Parent": Elem });
        Filter.setAttribute("placeholder", "Search For Documents....");
        Filter.setAttribute("autocomplete", "Off");
        Filter.onkeyup = function () {
            var list = window.location.href.split("PnP/");
            Pnp.searchPage(list[1], this, ViewOnly);
        }
        Filter.onclick = function () {
            var list = window.location.href.split("PnP/");
            Pnp.searchPage(list[1], this, ViewOnly);
        }
        
        var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Style": "margin-left:1%;Width:98%;transition: margin-top .25s;box-shadow:2px 2px 4px grey; height:80%;", "Id": "FilesWidget", "Parent": Elem });
        
        var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader","Style":"height:auto;", "Parent": EventWidget });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Id": "EventLable", "Class": "EventLable", "Content": "All Documents", "Parent": EventHeader });
        Pnp.drawAddButtonAndLabel(EventHeader);
        var EventBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "FilesBody", "Style": "height:auto;overflow:auto;", "Parent": EventWidget });
        var EventBody2 = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "FilesBody2", "Style": "overflow:auto;", "Parent": EventWidget });
        if (ViewOnly) {
            document.getElementById("AddNewContainer").className = "hide";
        }
        SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDocRow", "Style": "padding-top:0px; padding-bottom:0px", "Id": i + "", "Parent": EventBody });
        for (var i = 0; i < Columns.length; i++) {
            if (Columns[i] == "img") {
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "imged", "Style": "height:5%;width:5%;border:none;", "Parent": SingleTableElem });
                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "ViewImg", "Src": "/img/docPNP.png", "Style": "Height:30px;margin-top:3%;", "Parent": DocStat });
                DocStat.style.paddingTop ="15px";
                DocStat.style.paddingBottom = "15px";
            }else {
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Style": "height:6%;border:none;", "Parent": SingleTableElem });
                
                if (Columns[i] == "View" || Columns[i] == "Check Out" || Columns[i] == "Is Checked Out" || Columns[i] == "Edit" || Columns[i] == "Delete") {
                    if (ViewOnly) {
                        DocStat.style.width = "6.5%";
                    } else {
                        if (Route == "PoliciesRelateddocuments") {
                            DocStat.style.width = "6%";
                        } else if (Route == "ApprovedPolicies") {
                            DocStat.style.width = "4%";
                        } else if (Route == "ArchivePolicies") {
                            DocStat.style.width = "5%";
                        } else {
                            DocStat.style.width = "4.5%";
                        }
                    }
                } else {
                    if (!ViewOnly) {
                        if (Route == "PoliciesRelateddocuments") {
                            DocStat.style.width = (70 / (Columns.length - 5)) + "%";
                            DocStat.style.minWidth = (70 / (Columns.length - 5)) + "%";
                           
                        } if (Route == "ArchivePolicies") {
                            DocStat.style.width = (79 / (Columns.length - 5)) + "%";
                            DocStat.style.minWidth = (70 / (Columns.length - 5)) + "%";
                        } else {
                            DocStat.style.width = (80 / (Columns.length - 5)) + "%";
                            DocStat.style.minWidth = (70 / (Columns.length - 5)) + "%";
                        }
                    } else {
                        DocStat.style.width = (82 / (Columns.length - 3)) + "%";
                    }
                    
                }
                
                DocStat.innerHTML = Columns[i];
                DocStat.style.color = "rgb(63, 80, 104)";
                DocStat.style.fontSize = "12px";
                DocStat.style.fontWeight = "bold";
                if (document.getElementById("canvas").offsetWidth > 1500) {
                    DocStat.style.fontSize = "14px";
                } else if (document.getElementById("canvas").offsetWidth < 1100) {
                    DocStat.style.fontSize = "10px";
                }
                var height = document.getElementById("imged").offsetHeight;
                var getHeight = (height - DocStat.offsetHeight) / 2;
                DocStat.style.paddingTop = getHeight + "px";
                DocStat.style.paddingBottom = getHeight + "px";
                
            }
           
            
        }
        var d = new Date();
        var n = d.getTime();
         
            GHVHS.DOM.DrawSmallLoader2();
            var getItem = [];
            if (Route == "ApprovedPolicies") {
                
                getItem = Pnp.GlobalAP;
            } else if (Route == "DraftPolicies") {
                getItem = Pnp.GlobalDraftPolicies;
            } else if (Route == "PoliciesRelateddocuments") {
                getItem = Pnp.GlobalPRD;
            } else if (Route == "ArchivePolicies") {
                getItem = Pnp.GlobalArc;
            }
            var jsonData = {"Items":getItem};
            if (jsonData["Items"].length) {
                Pnp.DrawDocuments(jsonData, [EventBody2, Columns, Route,ViewOnly]);
            } else {
                var temp1 = GHVHS.DOM.send({ "URL": "/PnP/get" + Route + "?Dummy=" + n, "Callback": Pnp.DrawDocuments, "CallbackParams": [EventBody2, Columns, Route, ViewOnly] });
            }            
        
        
    },
    animation:function(Obj,styleAtt,value){
        setTimeout(function () {
            if (styleAtt == "marginTop") {
                document.getElementById(Obj).style.marginTop = value;
                document.getElementById(Obj).style.marginLeft = value;
            }
        }, 50);
    },
    GlobalTempObject: [],
    GlobalDocuments: [],
    GlobalDraftPolicies:[],
    DrawDocuments: function (json, p) {
        broswer = GHVHS.DOM.getBrowserType();
        var loader = document.getElementById("FaxTableLoader");
        if (loader) {
            loader.parentElement.removeChild(loader);
        }
        var Columns = p[1];
        var route = p[2];
        var ViewOnly = p[3];
        
        if (json["Items"].length < 7) {
            var getEvent = document.getElementById("FilesWidget").style.height = "auto";
            var getcolumns = document.getElementById("FilesBody");
            var getFilterHolder = document.getElementById("FilesBody2").style.height = "auto";
        }
        if (json["Items"].length > 0) {
            Pnp.GlobalDocuments = json["Items"];
            for (var i = 0; i < json["Items"].length; i++) {
                if (json["Items"][i]["Fields"]){
                var data = json["Items"][i]["Fields"][0];
                SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Style": "animation:0.4s slide-Down;padding-top:0px;padding-bottom:0px;", "Id": data["ID"] + "", "Parent": p[0] });
                if (i % 2 == 0){
                    SingleTableElem.className += " OffsetRow";
                }
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "ID", "Content": data["ID"], "Parent": SingleTableElem });
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "hide2","Style":"display:none;", "Id": "AllApprovers", "Content": data["EditorId"], "Parent": SingleTableElem });
                SingleTableElem.style.height = "13%";
                SingleTableElem.id = data["FileRef"];
                //Pnp.animation(SingleTableElem.id, "marginTop", "0%");
                    SingleTableElem.onclick = function (e) {
                        var that = this;
                        if (e.target.className == "status") {
                            var check = e.target.querySelector("img");
                            if (!check || e.target.id == "View" || e.target.parentElement.id == "View") {
                                var url = window.location.href.split("PnP/");
                                var getElements = this.querySelectorAll(".hide");
                                var thisId;
                                if (getElements.length > 1) {
                                    for (var q = 0; q < getElements.length; q++) {
                                        if (getElements[q].id == "ID") {
                                            thisId = getElements[q].innerText;
                                        }
                                    }
                                } else {
                                    thisId = getElements[0].innerText;
                                }
                                var url = window.location.href.split("PnP/");
                                var linktoIframe = "/PnP/ViewItem/" + url[1] + "?itemId=" + thisId;
                                if (ViewOnly) {
                                    var url2 = url[1].split("/");
                                    var linktoIframe = "/PnP/ViewItem/" + url2[0] + "?itemId=" + thisId;
                                    linktoIframe += "&ViewOnly=Y";
                                }
                                GHVHS.DOM.GlobalNumberFax = this.id;

                                GHVHS.DOM.drawslideUpIframe(linktoIframe, "", "");
                            } 

                        }

                    
                }
                for (var j = 0; j < Columns.length; j++) {
                        
                    if (Columns[j] == "img") {
                        var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "img", "Style": "height:5%;width:5%;border:none;", "Parent": SingleTableElem });
                        DocStat.style.paddingTop = "15px";
                        DocStat.style.paddingBottom = "15px";
                        var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "ViewImg", "Src": "", "Style": "Height:30px;", "Parent": DocStat });
                        var Type = data["Name"];
                        var url = "";
                        if (Type.indexOf(".docx") >= 0 || Type.indexOf(".doc") >= 0) {
                            url = "/img/fileIcon.png";
                        } else if (Type.indexOf(".xlsx") > 0 || Type.indexOf(".xls") > 0) {
                            url = "/img/excell.jpeg";
                        } else if (Type.indexOf(".pptx") > 0 || Type.indexOf(".ppt") > 0) {
                            url = "/img/pptx.png";
                        } else if (Type.indexOf(".pdf") > 0) {
                            url = "/img/pdf.png";
                        } else if (Type.indexOf(".txt") > 0) {
                            url = "/img/docPNP.png";
                        }
                        lodingImg.src = url;
                        lodingImg.style.marginTop = "-3px";
                    } else {
                        var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Style": "border:none;", "Parent": SingleTableElem });
                        if (route == "ArchivePolicies"){
                            DocStat.style.height = "3%";
                        }
                        if (Columns[j].indexOf("GHVHS") >= 0) {
                            var column = Columns[j].replace(" ", "");
                            DocStat.innerHTML += data[column];
                        } else if (Columns[j] == "Modified By") {
                            var dataSingle = data["ModifiedBy"];
                            var splited = dataSingle.split("\\");
                            DocStat.innerHTML += splited[1];
                        } else if (Columns[j] == "Due Time") {
                            var dataSingle = data["DueTime"];

                            DocStat.innerHTML += dataSingle;
                        } else if (Columns[j] == "Concurrer") {
                            var dataSingle = data["Concurrer"];
                            if (dataSingle.indexOf(";") >= 0) {
                                for (var q = 0; q < dataSingle.indexOf(";") ; q++){
                                    dataSingle = dataSingle.replace(";","<br>");
                                }
                            }
                            DocStat.id = Columns[j];
                            DocStat.innerHTML = dataSingle; 
                        }  else if (Columns[j] == "Assigned To") {
                            DocStat.id = "AssignTo";
                            DocStat.innerHTML = Pnp.FullName;
                        } else if (Columns[j] == "Check Out") {
                            DocStat.id = Columns[j];
                            var checkout = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "checkout", "Src": "/img/checkout.png", "Style": "Height:30px;", "Parent": DocStat });
                            checkout.onclick = function (e) {
                                var parent = this.parentElement.parentElement;
                                Pnp.checkOutDoc(parent);
                            }
                        } else if (Columns[j] == "View") {
                            DocStat.id = Columns[j];
                            DocStat.id = "View";
                            var ViewImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "http://sharepoint" + data["FileRef"], "Src": "/img/View.png", "Style": "Height:30px;", "Parent": DocStat });
                            ViewImg.onclick = function () {
                                this.parentElement.click();
                            }
                        } else if (Columns[j].indexOf("Policy Related") >= 0) {
                            var getPol = Columns[j].split("Doc");
                            var realCol = "PolicyRelatedDoc" + getPol[1];
                            DocStat.id = Columns[j];
                            if (data[realCol] && data[realCol] != "Null") {
                                var theIDToUse = "";
                                for (var q = 0; q < Pnp.GlobalPRD.length; q++) {
                                    if (Pnp.GlobalPRD[q]["Fields"][0]["Name"] == data[realCol]) {
                                        theIDToUse = Pnp.GlobalPRD[q]["Fields"][0]["ID"];
                                    }
                                }
                                var ViewImg = GHVHS.DOM.create({ "Type": "a", "Href": "/PnP/ViewItem/PoliciesRelateddocuments?itemId=" + theIDToUse, "Id": realCol, "Content": data[realCol], "Parent": DocStat });
                                if (ViewOnly){
                                    ViewImg.href = "/PnP/ViewItem/PoliciesRelateddocuments?itemId=" + theIDToUse + "&ViewOnly=Y";
                                }
                            }
                        } else if (Columns[j] == "Delete") {
                            DocStat.id = Columns[j];
                            var Delete = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": data["ID"] + "||" + data["Name"], "Src": "/img/RedX.png", "Style": "Height:30px;", "Parent": DocStat });
                            Delete.onclick = function (e) {
                                var parent = this.parentElement.parentElement;
                                var id = this.id;
                                var datas = id.split("||");
                                var list = window.location.href.split("PnP/");
                                Pnp.DrawConfirmButton(parent, datas[0], datas[1], list[1]);
                            }
                        } else if (Columns[j] == "Edit") {
                            DocStat.id = Columns[j];
                            var EditImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": data["ID"] + "||" + data["Name"], "Src": "/img/edit.png", "Style": "Height:30px;", "Parent": DocStat });
                            EditImg.onclick = function () {
                                var id = this.id;
                                var datas = id.split("||");
                                var fileURl = this.parentElement.parentElement.id;
                                var getList = window.location.href.split("PnP/");
                                Pnp.getSingleDocMeta(getList[1], datas[0], fileURl, datas[1]);
                            }
                        } else if (Columns[j] == "Is Checked Out") {
                            DocStat.id = "IsCheckedOut";
                            if (data["CheckedOut"]){
                                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "CheckedOutImg", "Src": "/img/greenCheck.png", "Style": "Height:30px;", "Parent": DocStat });
                            } else {
                                DocStat.innerHTML += " ";
                            }   
                        } else if (Columns[j] == "Checked Out By") {
                            DocStat.id = "Checked Out By";
                            if (data["CheckedOut"]) {
                               
                                DocStat.innerHTML += data["CheckedOut"];
                            } else {
                                DocStat.innerHTML += " ";
                            }

                        } else if (Columns[j] == "Assigned To") {
                            var getId = data["EditorId"];
                                
                            DocStat.innerHTML = data["EditorId"];
                          
                        } else {
                            if (data[Columns[j]]) {
                                if (data[Columns[j]] != null) {
                                    DocStat.innerHTML += data[Columns[j]];
                                    if (data[Columns[j]].indexOf("20") >= 0 && data[Columns[j]].indexOf("-") >= 0) {
                                        var value = GHVHS.DOM.formateSQLDate(data[Columns[j]]);
                                        var time = value.split(" ");
                                        DocStat.innerHTML = time[0];
                                    }
                                    DocStat.id = Columns[j];
                                }   
                            }
                        }
                        if (Columns[j] == "View" || Columns[j] == "Check Out" || Columns[j] == "Edit" || Columns[j] == "Is Checked Out" || Columns[j] == "Delete") {
                            if (ViewOnly) {
                                DocStat.style.width = "6.5%";
                                DocStat.style.minWidth = "6.5%";
                            } else {
                                if (route == "PoliciesRelateddocuments") {
                                    DocStat.style.width = "6%";
                                    DocStat.style.minWidth = "6%";
                                } else if (route == "ApprovedPolicies") {
                                    DocStat.style.width = "4%";
                                    DocStat.style.minWidth = "4%";
                                } else if (route == "ArchivePolicies") {
                                    DocStat.style.width = "5%";
                                    DocStat.style.minWidth = "5%";
                                } else {
                                    DocStat.style.width = "4.5%";
                                    DocStat.style.minWidth = "4.5%";
                                }
                            }
                        } else if (DocStat.id == "img") {
                            DocStat.style.width = "5%";
                            DocStat.style.minWidth = "5%";
                        }else {
                            if (DocStat.innerHTML == "" || DocStat.innerHTML == " ") {
                                DocStat.innerHTML += " ";
                                DocStat.style.height = (SingleTableElem.offsetHeight * .4) + "px";
                            }
                            if (!ViewOnly) {
                                if (route != "PoliciesRelateddocuments") {

                                    DocStat.style.width = (80 / (Columns.length - 5)) + "%";
                                    DocStat.style.minWidth = (70 / (Columns.length - 5)) + "%";
                                } else {
                                    DocStat.style.width = (80 / (Columns.length - 5)) + "%";
                                    DocStat.style.minWidth = (70 / (Columns.length - 5)) + "%";

                                }
                            } else {
                                DocStat.style.width = (82 / (Columns.length - 3)) + "%";
                            }
                        }
                        DocStat.style.fontSize = "11px";
                        if (document.getElementById("canvas").offsetWidth > 1500) {
                            DocStat.style.fontSize = "14px";
                        }
                        var height = document.getElementById("img").offsetHeight;
                        var getHeight = (height - DocStat.offsetHeight)/2;
                        DocStat.style.paddingTop = getHeight + "px";
                        DocStat.style.paddingBottom = getHeight + "px";
                        DocStat.style.color = "rgb(63, 80, 104)";
                       

                    }
                }
                
                }
                
                
            }
        } else {
            message = GHVHS.DOM.create({ "Type": "div", "Class": "message", "Id": "message", "Parent": p[0] });
            message.innerHTML = "0 results found. <br> Click refresh icon to refresh page."
            refesh = GHVHS.DOM.create({ "Type": "img", "Class": "refreshIcon", "Id": "refreshIcon", "Src": "/img/refresh.png", "Parent": p[0] });
            refesh.onclick = function () {
                function ReDrawPage(){
                    window.location.href = window.location.href;
                }
                if (route == "Concurrences" || route == "Concurences" ){
                   
                    var iFrame = GHVHS.DOM.create({ "Type": "iframe", "Class": "hide", "Src": " /PnP/ClearConcurrence", "Parent": document.getElementById("canvas") });
                    iFrame.onload = function () {
                        ReDrawPage();
                    }
                } else {
                    if (route == "ApprovedPolicies") {
                        route = "Approved%20Policies";
                    } else if (route == "PoliciesRelateddocuments") {
                        route = "Policies%20%20Related%20%20documents";
                    }
                    
                    var iFrame = GHVHS.DOM.create({ "Type": "iframe", "Class": "hide", "Src": "/PnP/ClearLists?list=" + route, "Parent": document.getElementById("canvas") });
                    iFrame.onload = function () {
                        ReDrawPage();
                    }
                }
            }
        }
    },
   
    returnItemFromList:function(data, value, FieldToCheck, startOnItems){
        if (startOnItems == "Y"){
            data = data["Items"];
        } 
        var result = [];
        for (var i =0; i < data.length; i++){
            var singleData = data[i]["Fields"][0];
            
            if (singleData[FieldToCheck] == value){
                result = singleData;
            }
        }
        return result;
    },
    DrawConfirmButton: function (Elem, ID, Name, list ,IsImg) {
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        if (!IsImg) {
            Elem.className = "darkBlueST";
            canvas2.onclick = function (e) {
                if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
                    Elem.className = "SingleTableElem";
                    document.getElementById('canvas').removeChild(this);
                }

            }
        } else {
            canvas2.onclick = function (e) {
                if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
                    document.getElementById('canvas').removeChild(this);
                }

            }
        }
        
        loader = GHVHS.DOM.create({ "Type": "div", "Class": "loader", "Id": "loader", "Parent": canvas2 });
        ConfirmRemoveContainer = GHVHS.DOM.create({ "Type": "div", "Parent": loader, "Class": "ConfirmRemoveContainer" });
        ConfirmRemoveContainer.style.width = (canvas.offsetWidth * 0.3) - 20 + "px";
        ConfirmRemoveContainer.style.left = "34%";
        ConfirmRemove = GHVHS.DOM.create({ "Type": "div", "Parent": ConfirmRemoveContainer, "Content": "Are you sure you want to remove " + Name +" from " +list +"?", "Class": "ConfirmRemove" });
        ConfirmRemove.style.lineHeight = "2em";
        Confirm = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Id": "Confirm", "Parent": ConfirmRemove, "Content": "Confirm" });
        
        Confirm.onclick = function () {
            GHVHS.DOM.DrawSmallLoader2();
            function redrawPage() {
                window.location.href = window.location.href;
            }
            GHVHS.DOM.send({ "URL": "/Pnp/Delete?list=" + list + "&itemID=" + ID, "Callback": redrawPage, "CallbackParams": [] });
        }

        Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Parent": ConfirmRemove, "Content": "Cancel" });
        Cancel.style.marginTop = "5px";
    },
    GlobalFormData: [],
    GlobalFileName:"",
    checkOutDoc: function (parent, checkOutImg, checkOutby, docName, useParams) {
        var url = parent.id;
        var DocStats = parent.querySelectorAll(".status");
        var ID = parent.querySelectorAll(".hide");
        var username = document.getElementById("user").innerText;
        if (!useParams) {
              for (var i = 0; i < DocStats.length; i++) {
                  if (DocStats[i].id == "Checked Out By") {
                      checkOutby = DocStats[i];
                  } else if (DocStats[i].id == "IsCheckedOut") {
                      checkOutImg = DocStats[i];
                  }else if (DocStats[i].id == "Name") {
                      docName = DocStats[i].innerText;
                  }
              }
        }
      
        if (checkOutby.innerText != "") {
            if (checkOutby.innerText == Pnp.FullName) {
                var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
                var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
                var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
                var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Check In", "Parent": FrameHeader });
                var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
                XCancel.onclick = function () {
                    if (document.getElementById("ViewFile")) {
                        document.getElementById("ViewFile").style.display = "block";
                    }
                    canvas2.parentElement.removeChild(canvas2);
                    
                }
                var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody",   "Parent": framed });
                FrameBody.style.fontSize = "150%";
                CheckInComments = GHVHS.DOM.create({ "Type": "div", "Class": "CheckInComments", "Id": "CheckInComments", "Parent": FrameBody });
                rightSide = GHVHS.DOM.create({ "Type": "div", "Class": "rightSide", "Id": "rightSide", "Parent": CheckInComments });
                rightTitle = GHVHS.DOM.create({ "Type": "div", "Class": "rightTitle", "Id": "rightTitle","Content":"Comments", "Parent": rightSide });
                RightMsg = GHVHS.DOM.create({ "Type": "div", "Class": "RightMsg", "Id": "RightMsg", "Content": "Type comments describing what has changed in this version.", "Parent": rightSide });
                LeftSide = GHVHS.DOM.create({ "Type": "div", "Class": "LeftSide", "Id": "LeftSide", "Parent": CheckInComments });
                leftTitle = GHVHS.DOM.create({ "Type": "div", "Class": "rightTitle", "Id": "rightTitle", "Content": "Comments:", "Parent": LeftSide });
                leftTextArea = GHVHS.DOM.create({ "Type": "textarea", "Class": "leftTextArea", "Id": "leftTextArea", "Parent": LeftSide });
                broswer = GHVHS.DOM.getBrowserType();
                console.log(broswer);
                if (broswer != "IE" && broswer != "Edge") {
                    CheckInComments = GHVHS.DOM.create({ "Type": "div", "Class": "CheckInComments", "Id": "CheckInComments", "Parent": FrameBody });
                    rightSide = GHVHS.DOM.create({ "Type": "div", "Class": "rightSide", "Id": "rightSide", "Parent": CheckInComments });
                    rightTitle = GHVHS.DOM.create({ "Type": "div", "Class": "rightTitle", "Id": "rightTitle", "Content": "Reupload File", "Parent": rightSide });
                    RightMsg = GHVHS.DOM.create({ "Type": "div", "Class": "RightMsg", "Id": "RightMsg", "Content": "Due to sharepoint issues, if you wish to update your file being checked back in on Chrome or FireFox you must manually reupload it.", "Parent": rightSide });
                    LeftSide = GHVHS.DOM.create({ "Type": "div", "Class": "LeftSide", "Id": "LeftSide", "Parent": CheckInComments });
                    leftTitle = GHVHS.DOM.create({ "Type": "div", "Class": "rightTitle", "Id": "rightTitle", "Content": "Upload File:", "Parent": LeftSide });
                    var fileContaner = GHVHS.DOM.create({ "Type": "div", "Class": "fileContaner", "Id": "fileContaner", "Parent": LeftSide });
                    var FileStuff = [];
                    fileContaner.style.marginLeft = "30%";
                    fileContaner.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
                    fileContaner.onmouseover = function (e) {
                        var fileImg = document.getElementById("fileImg");
                        if (fileImg.src == "" || fileImg.src == window.location.href) {
                            fileImg.src = "/img/add.png";
                        }
                    }
                    fileContaner.onmouseout = function (e) {
                        var fileImg = document.getElementById("fileImg");
                        if (fileImg.src.indexOf("/img/add.png") >= 0) {
                            fileImg.src = "";
                        }

                    }
                    var getFile = GHVHS.DOM.create({ "Type": "input", "InputType": "File", "Class": "getFile", "Id": "getFile", "Parent": fileContaner });
                    getFile.onchange = function () {
                        var imgHolder = document.getElementById('fileImg');
                        var Label = document.getElementById("hoverObj");
                        var file = this.files[0];
                        var Type = file.type;
                        var name = file.name
                        FileStuff.push({ "Name": name, "Type": Type })
                        imgHolder.style.opacity = "1";
                        var url = URL.createObjectURL(file);
                        var continueUp = "N";
                        if (Type.indexOf(".docx") >= 0 || Type.indexOf(".doc") >= 0) {
                            url = "/img/fileIcon.jpeg";
                            continueUp = "Y";
                        } else if (Type.indexOf(".xlsx") >= 0 || Type.indexOf(".xls") >= 0) {
                            url = "/img/excell.jpeg";
                            continueUp = "Y";
                        } else if (Type.indexOf(".pptx") >= 0 || Type.indexOf(".ppt") >= 0) {
                            url = "/img/pptx.png";
                            continueUp = "Y";
                        } else {
                            continueUp = "N";
                        }
                        if (continueUp == "Y") {
                            imgHolder.src = url;
                            var formData = new FormData();
                            formData.append('file', file);
                            Pnp.GlobalFormData = formData;
                            Pnp.GlobalFileName = name;
                            Label.innerHTML = name;
                            globalContinue = "Y";
                        } else {
                            globalContinue = "N";
                            var getFrame = document.getElementById("IFrame")
                            var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Content": "Sorry, That File Type is Not Supported.", "Parent": getFrame });
                            Error.style.top = 50 + "px";
                            Error.style.left = (((getFrame.offsetWidth / 2) - 100)) + "px";
                            var ErrorOff = setTimeout(function () {
                                document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
                            }, 3000);
                        }


                    }
                    fileContaner.onclick = function () {
                        getFile.click();

                    }

                    var fileImg = GHVHS.DOM.create({ "Type": "img", "Class": "fileImg",  "Id": "fileImg", "Parent": fileContaner });
               
                    var hoverObj = GHVHS.DOM.create({ "Type": "div", "Class": "hoverObj", "Id": "hoverObj", "Content": "Click Here to Add/Change File","Style":"font-size:60%;", "Parent": fileContaner });
                    
                }
                var frameFooter = GHVHS.DOM.create({ "Type": "div", "Class": "frameFooter", "Id": "frameFooter", "Parent": framed });
                SearchButtonSmall = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "margin-left:30%;", "Content": "OK", "Parent": frameFooter });
                SearchButtonSmall.onclick = function () {
                    var getComments = document.getElementById("leftTextArea").value;
                    GHVHS.DOM.DrawSmallLoader2();
                    function Checkedin(json, p) {
                        if (json["data"] != "False") {
                            if (p.length > 0) {
                                var getLink = window.location.href.split("PnP/");
                                var list = getLink[1];
                                if (list == "ApprovedPolicies") {
                                    list = "Approved%20Policies";
                                } else if (list == "PoliciesRelateddocuments") {
                                    list = "Policies%20%20Related%20%20documents";
                                }
                                function refreshPage(dataJ) {
                                    window.location.href = window.location.href;
                                }
                                GHVHS.DOM.send({ "URL": "/Pnp/UploadFile?list=" + list + "&FileName=" + p[0] + "&itemId=" + p[2][0].innerHTML + "&AddToItem=Y", "PostData": p[1], "CallbackParams": [], "Callback": refreshPage, "Method": "POST" });

                            } else {
                                window.location.href = window.location.href;
                            }
                        } else {
                            var loader = document.getElementById("FaxTableLoader");
                            loader.parentElement.removeChild(loader);
                            Pnp.drawErrorMsg("Something went wrong. Please try again later.");
                        }
                    }
                    var callbackParam = [];
                    if (Pnp.GlobalFileName != "") {
                        callbackParam = [docName,Pnp.GlobalFormData,ID];
                    }
                    GHVHS.DOM.send({ "URL": "/PnP/CheckOut?url=" + url + "&checkType=Y&Comments=" + getComments, "Callback": Checkedin, "CallbackParams": callbackParam });
                }
                SearchButtonSmallCancel = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "", "Content": "Cancel", "Parent": frameFooter });
                SearchButtonSmallCancel.onclick = function () {
                    XCancel.click();
                }
            }else {
                var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
                var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
                var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
                var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Already Checked Out", "Parent": FrameHeader });
                var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
                XCancel.onclick = function () {
                    canvas2.parentElement.removeChild(canvas2);
                }
                var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Style": "padding-top:5%;", "Content": "Sorry, " + docName + " is already checked out by " + checkOutby.innerText, "Parent": framed });
                FrameBody.style.fontSize = "150%";
               
            }
        } else {
            GHVHS.DOM.DrawSmallLoader2();
            function CheckedOut(json,p) {
                if (json["data"] != "False"){
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "CheckedOutImg", "Src": "/img/greenCheck.png", "Style": "Height:30px;", "Parent": checkOutImg });
                    checkOutby.innerHTML = Pnp.FullName;
                    var link = GHVHS.DOM.create({ "Type": "a", "Class": "hide", "Id": "hid", "Href": p, "Parent": checkOutImg });
                    link.setAttribute("download", "");
                    link.click();
                    checkOutImg.removeChild(link);
                    var loader = document.getElementById("FaxTableLoader");
                    loader.parentElement.removeChild(loader);
                } else {
                    var loader = document.getElementById("FaxTableLoader");
                    loader.parentElement.removeChild(loader);
                }
            }
            GHVHS.DOM.send({ "URL": "/PnP/CheckOut?url="+url , "Callback": CheckedOut, "CallbackParams":"http://sharepoint/"+url });
        }
        
    },
    concurrerGlobal:"",
    drawAddButtonAndLabel: function (EventHeader) {
        var FormDatas;
        var FileStuff =[];
        var globalContinue = "N";
        var AddNewContainer = GHVHS.DOM.create({ "Type": "div", "Id": "AddNewContainer", "Class": "AddNewContainer", "Parent": EventHeader });
        var AddButton = GHVHS.DOM.create({ "Type": "img", "Src": "/img/Add.png", "Id": "AddButton", "Class": "AddButton", "Parent": AddNewContainer });
        var AddLabel = GHVHS.DOM.create({ "Type": "div", "Id": "AddLabel", "Class": "AddLabel", "Content": "Click Here To Upload A New Policy", "Parent": AddNewContainer });
        if (document.getElementById("canvas").offsetWidth < 1800){
            AddNewContainer.style.width = "30%";
        } else {
            AddNewContainer.style.marginLeft = "15%";
        }
        AddNewContainer.onclick = function () {
            var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
            var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
            var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
            var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable","Style":"Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;",  "Id": "EventLable", "Content":"Add Document", "Parent": FrameHeader });
            var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
            var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
             var DocLabel = GHVHS.DOM.create({ "Type": "div", "Class": "DocLabel", "Id": "DocLabel", "Content":"Choose A File","Parent": FrameBody });
             var fileContaner = GHVHS.DOM.create({ "Type": "div", "Class": "fileContaner", "Id": "fileContaner", "Parent": FrameBody });
             fileContaner.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
             fileContaner.onmouseover = function (e) {
                 var fileImg = document.getElementById("fileImg");
                 if (fileImg.src == "" || fileImg.src == window.location.href) {
                     fileImg.src = "/img/add.png";
                 }
             }
             fileContaner.onmouseout = function (e) {
                 var fileImg = document.getElementById("fileImg");
                 if (fileImg.src.indexOf( "/img/add.png") >= 0) {
                     fileImg.src = "";
                 }   
             }
             var getFile = GHVHS.DOM.create({ "Type": "input", "InputType": "File", "Class": "getFile", "Id": "getFile", "Parent": fileContaner });
             getFile.onchange = function () {
                 FormDatas = [];
                 var imgHolder = document.getElementById('fileImg');
                 var Label = document.getElementById("hoverObj");
                 var file = this.files[0];
                 var Type = file.type;
                 var name = file.name;
                 FileStuff = [{ "Name": name, "Type": Type }];
                 imgHolder.style.opacity = "1";
                 var url = URL.createObjectURL(file);
                 var continueUp = "N";
                 if (name.indexOf(".docx") >= 0) {
                     url = "/img/fileIcon.jpeg";
                     continueUp = "Y";
                 } else if (name.indexOf(".doc") >= 0) {
                     url = "/img/fileIcon.jpeg";
                     continueUp = "Y";
                 } else if (name.indexOf(".pdf") >= 0) {
                     url = "/img/pdf.png";
                     continueUp = "Y";
                 } else if (name.indexOf(".xlsx") >= 0 || name.indexOf(".xls") >= 0) {
                     url = "/img/excell.jpeg";
                     continueUp = "Y";
                 } else if (name.indexOf(".pptx") >= 0 || name.indexOf(".ppt") >= 0) {
                     url = "/img/pptx.png";
                     continueUp = "Y";
                 } else {
                     continueUp = "N";
                 }
                 var getList = window.location.href.split("PnP/");
                 var list = getList[1];
                 var getItem = [];
                 if (list == "ApprovedPolicies") {
                     list = "Approved%20Policies"
                     getItem = Pnp.GlobalAP;
                 } else if (list == "DraftPolicies") {
                     getItem = Pnp.GlobalDraftPolicies;
                 } else if (list == "PoliciesRelateddocuments") {
                     getItem = Pnp.GlobalPRD;
                 } else if (list == "ArchivePolicies") {
                     getItem = Pnp.GlobalArc;
                 }
                 var MessageFromUpload = "";
                 var checkApprovedName = "";
                 if (name.indexOf(".docx") >= 0 || name.indexOf(".doc") >= 0) {
                     var splitName = name.split(".");
                     checkApprovedName = splitName[0] + ".pdf";
                 }
                 var getSingleItem1 = Pnp.returnItemFromList(Pnp.GlobalAP, checkApprovedName, "Name");
                 var getSingleItem2 = Pnp.returnItemFromList(Pnp.GlobalDraftPolicies, name, "Name");
                 var getSingleItem3 = Pnp.returnItemFromList(getItem, name, "Name");
                 if (getSingleItem1["Name"]) {
                     MessageFromUpload = "ApprovedPolicies";
                     name = checkApprovedName;
                 } else if (getSingleItem2["Name"]) {
                     MessageFromUpload = "DraftPolicies";
                 } else if (getSingleItem3["Name"]) {
                     MessageFromUpload = list;
                 }
                 if (MessageFromUpload != "") {
                     globalContinue = "N";
                     var getFrame = document.getElementById("IFrame");
                     var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Content": "Sorry, " + name + " already exists in " + MessageFromUpload + ". Please use a different name", "Parent": getFrame });
                     Error.style.height = "auto";
                     Error.style.width = "300px";
                     Error.style.top = 50 + "px";
                     Error.style.left = (((getFrame.offsetWidth / 2) - 150)) + "px";
                     var ErrorOff = setTimeout(function () {
                         document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
                     }, 5000);
                 }else if (continueUp == "Y") {
                     imgHolder.src = url;
                     var formData = new FormData();
                     formData.append('file', file);
                     FormDatas = formData;
                     Label.innerHTML = name;
                     globalContinue = "Y";
                 } else {
                     globalContinue = "N";
                     var getFrame = document.getElementById("IFrame");
                     var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Content": "Sorry, That File Type is Not Supported.", "Parent": getFrame });
                     Error.style.top = 50 + "px";
                     Error.style.left = ( ((getFrame.offsetWidth / 2) - 100)) + "px";
                     var ErrorOff = setTimeout(function () {
                         document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
                     }, 3000); 
                 }
                 

             }
             fileContaner.onclick = function () {
                 if (!document.getElementById("theID")) {
                     getFile.click();
                 }
             }
                var fileImg = GHVHS.DOM.create({ "Type": "img", "Class": "fileImg","Src":"", "Id": "fileImg", "Parent": fileContaner });
                var FileLabel = GHVHS.DOM.create({ "Type": "div", "Class": "FileLabel", "Id": "FileLabel", "Parent": fileContaner });
                
                var hoverObj = GHVHS.DOM.create({ "Type": "div", "Class": "hoverObj", "Id": "hoverObj", "Content": "Click Here to Add/Change File", "Parent": fileContaner });
                var frameFooter = GHVHS.DOM.create({ "Type": "div", "Class": "frameFooter", "Id": "frameFooter", "Parent": framed });
                SearchButtonSmall = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "margin-left:30%;", "Content": "OK", "Parent": frameFooter });
                SearchButtonSmall.onclick = function () {
                 
                    GHVHS.DOM.DrawSmallLoader2();
                    var fileName;
                    var getFrame = document.getElementById("IFrame");
                    var x = getFrame.querySelectorAll(".NameAndInput");
                    if (x.length > 0) {
                        var getFilter = x[2].querySelectorAll(".Filter");
                        Pnp.CheckAllFilters(getFilter[0]);
                        if (this.id == "SearchButtonSmall") {
                            var params = "";
                            var autoApprove = "";
                            for (var i = 0; i < x.length; i++) {
                                var singleParam = "";
                                if (i >= 1) {
                                    singleParam += "&";
                                }
                                singleParam += x[i].id;
                                var filter = x[i].querySelectorAll(".Filter");
                                if (x[i].id == "Name") {
                                    fileName = filter[0].value;
                                }else if (x[i].id == "Concurrer") {
                                    if (Pnp.DefaultConcurrers == filter[0].value) {
                                        singleParam += "=" + "";
                                    }else{
                                        singleParam += "=" + filter[0].value;
                                    }
                                }else if (x[i].id == "Auto Approve On Concurrence") {
                                    var checkBox = x[i].querySelectorAll(".CheckBox");
                                    if (checkBox[0]) {
                                        if (checkBox[0].id == "Y") {
                                            singleParam = "&AutoApprove=Y";
                                        } else {
                                            singleParam = "";
                                        }
                                    }
                                } else {

                                    singleParam += "=" + filter[0].value;
                                }

                                params += singleParam;
                            }
                            params += autoApprove;
                            var list;
                            var split = window.location.href.split("PnP/");
                            list = split[1];
                            if (list.indexOf("ViewItem") >= 0) {
                                var temp = list.split("?");
                                list = temp[0].replace("ViewItem/", "");
                            }
                            if (document.getElementById("hoverObj").innerText != "Click Here to Add/Change File") {
                                fileName = document.getElementById("hoverObj").innerText;
                            }
                            function IsCreated(json) {
                                if (json["data"] == "") {
                                    window.location.href = window.location.href;
                                } else {
                                    var loader = document.getElementById("FaxTableLoader");
                                    loader.parentElement.removeChild(loader);
                                    Pnp.drawErrorMsg("Something went wrong!");
                                }
                            }
                            var IsID = document.getElementById("theID").innerText;
                            GHVHS.DOM.send({ "URL": "/Pnp/CreateItem?list=" + list + "&FileName=" + fileName + "&" + params + "&itemId=" + IsID + "&ConcurrerName=" + Pnp.Emails + "&UpdateOrCreate=Update&ConcurrerName=" + Pnp.concurrerGlobal, "CallbackParams": [], "Callback": IsCreated, });
                        } else {
                            
                            var loader = document.getElementById("FaxTableLoader");
                            loader.parentElement.removeChild(loader);
                            Pnp.drawErrorMsg("Please Enter a correct value");
                        }
                    }else {
                        if (FormDatas && globalContinue == "Y") {
                            
                           
                            function IsCreated(json, p) {
                                var loader = document.getElementById("FaxTableLoader");
                                loader.parentElement.removeChild(loader);
                                if (json["data"].indexOf("Missing") >= 0 && json["data"].indexOf("Unsupported") >= 0) {
                                    Pnp.drawErrorMsg(json["data"]);
                                }else {
                                    var getFrame = document.getElementById("IFrame");
                                    GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Content":json["data"], "Id": "theID", "Parent": fileContaner });
                                    Pnp.ResizeAndGetMetaData(getFrame, p[0], p[1], p[2]);
                                }
                            
                            }
                        
                            var list,fileName;
                            var split = window.location.href.split("PnP/");
                            list = split[1];
                            fileName = document.getElementById("hoverObj").innerText;
                            GHVHS.DOM.send({ "URL": "/Pnp/UploadFile?list=" + list + "&FileName=" + fileName, "PostData": FormDatas, "CallbackParams": [FormDatas, fileContaner, FileStuff], "Callback": IsCreated, "Method": "POST" });
                            
                        } else {
                        
                            Pnp.drawErrorMsg("Please Selected a File.")
                        }
                    }
                }
                SearchButtonSmallCancel = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmallCancel",  "Style":"","Content": "Cancel", "Parent": frameFooter });
                SearchButtonSmallCancel.onclick = function () {
                    XCancel.click();
                }


              
                XCancel.onclick = function () {

                    var Element = document.getElementById("canvas2");
                    Element.parentElement.removeChild(Element);
                    if (document.getElementById("ViewFile")) {
                        document.getElementById("ViewFile").style.display = "block";
                    }
            }
            
        }
    },
    getFormDataFromURL:function(fileUrl){
        var formData = new FormData();
        URL = "http://Sharepoint/"+fileUrl;
        var x;

        var request = new XMLHttpRequest();
        request.responseType = "blob";
        request.onload = function () {
            formData.append("imageFile", request.response);
            formData.append("author", "user");
            formData.append("description", "image");
            return formData;
        }
        request.open("GET", URL);
        request.send();
    },
    getSingleDocMeta: function (list, id, file, name) {
        function EditForm(json) {
            var formData = new FormData();
            document.getElementById("AddNewContainer").click();

            var getFrame = document.getElementById("IFrame");
            var fileContaner = document.getElementById("fileContaner");
            var getImg = document.getElementById("fileImg"); 
            var namelable = document.getElementById("hoverObj");
            namelable.innerHTML = name;
            if (name.indexOf(".docx") >= 0 || name.indexOf(".doc") >= 0) {
                url = "/img/fileIcon.png";
            } else if (name.indexOf(".xlsx") > 0 || name.indexOf(".xls") > 0) {
                url = "/img/excell.jpeg";
            } else if (name.indexOf(".pptx") > 0 || name.indexOf(".ppt") > 0) {
                url = "/img/pptx.png";
            } else if (name.indexOf(".pdf") > 0) {
                url = "/img/pdf.png";
            } else if (name.indexOf(".txt") > 0) {
                url = "/img/docPNP.png";
            }
            getImg.src = url;
            GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Content": id, "Id": "theID", "Parent": fileContaner });
            var fileStuff = [{ "Name": "" }];
            Pnp.ResizeAndGetMetaData(getFrame, formData, fileContaner, fileStuff, json);
        }
        var getItem = [];
        if (list == "ApprovedPolicies") {
            list = "Approved%20Policies"
            getItem = Pnp.GlobalAP;
        } else if (list == "DraftPolicies") {
            getItem = Pnp.GlobalDraftPolicies;
        } else if (list == "PoliciesRelatedDocuments") {
            getItem = Pnp.GlobalPRD;
        } else if (list == "ArchivePolicies") {
            getItem = Pnp.GlobalArc;
        } else if (list == "Approved%20Policies") {
            getItem = Pnp.GlobalAP;
        }
        var getSingleItem = Pnp.returnItemFromList(getItem, id, "ID");
        var jsonForFunction = { "Items": [{ "Fields": [getSingleItem] }] };
        EditForm(jsonForFunction);
        //GHVHS.DOM.send({ "URL": "/Pnp/get"+list+"?Id="+id, "CallbackParams": [], "Callback": EditForm  });
    },
    GobalUser: [],
    CheckAllFilters: function (Filter) {
        var Filters = Filter.parentElement.parentElement.querySelectorAll(".Filter");
        var flag = "";
        var getOkayButton = document.getElementById("SearchButtonSmall");
        if (!getOkayButton) {
            var getOkayButton = document.getElementById("No");
        }
        for (var i = 0; i < Filters.length; i++) {
            if (Filters[i].style.border == "1px solid red") {
                flag = "Y";
            } else {
                var getSubElements = Filters[i].parentElement.querySelectorAll("div");
                    for (var w = 0; w < getSubElements.length; w++) {
                        if (getSubElements[w].className == "hide") {
                            getSubElements[w].className = "DropOption";
                        }
                    }
                
            }
        }
        if (flag == "") {
            getOkayButton.style.backgroundColor = "rgba(64, 0, 23,0.8)";
            getOkayButton.id = "SearchButtonSmall";
        } else {
            getOkayButton.style.backgroundColor = "grey";
            getOkayButton.id = "No";
        }
    },
    HandleFilterBlur: function (Filter, value) {
        var getDrop = Filter.parentElement.querySelectorAll(".DropDown");
        if (getDrop[0]) {
            getDrop[0].style.height = "1px";
            setTimeout(function () {
                getDrop[0].style.display = "none";
            }, 500);
            if (value != ""){
                    var getOptions = getDrop[0].querySelectorAll("div");
                    var matched = "";
                    for (var i = 0; i < getOptions.length; i++) {
                        var check1 = getOptions[i].innerText.toLowerCase();
                        var check2 = value.toLowerCase();
                        if (check1.indexOf(check2) >= 0) {
                            if (check1 == check2) {
                                Filter.style.border = "1px solid silver";
                                Pnp.CheckAllFilters(Filter);
                                matched = "Y";
                            } else {
                                if (matched != "Y") {
                                    Filter.style.border = "1px solid red";
                                    Pnp.CheckAllFilters(Filter);
                                }
                            }
                       
                        } else {
                            if (matched != "Y") {
                                Filter.style.border = "1px solid red";
                                Pnp.CheckAllFilters(Filter);
                            }
                        }
                        getOptions[i].className = "DropOption";
                    }
            } else {
                Filter.style.border = "1px solid silver";
                Pnp.CheckAllFilters(Filter);
            }
        } else {
            Filter.style.border = "1px solid silver";
            Pnp.CheckAllFilters(Filter);
        }
    },
    FilterValue: function (Filter, value, event) {
        var x = event.keyCode;
        var getDrop = Filter.parentElement.querySelectorAll(".DropDown");
        if (getDrop[0].style.display == "none") {
            getDrop[0].style.display = "block";
            setTimeout(function () {
                getDrop[0].style.height = "150px";
            }, 10);
        }
        if (getDrop[0]) {
            var getOptions = getDrop[0].querySelectorAll("div");
            for (var i = 0; i < getOptions.length; i++) {
                var check1 = getOptions[i].innerText.toLowerCase();
                var check2 = value;
                if (value != "") {
                    var check2 = value.toLowerCase();
                }
                if (check1.indexOf(check2) >= 0) {
                    getOptions[i].className = "DropOption";
                    if (check1 == check2) {
                        if (x != 8) {
                            getOptions[i].click();
                        }
                    }
                } else {
                    getOptions[i].className = "hide";
                }
            }
        }
    },
    DefaultConcurrers:[],
    IsDropOption:"",
    ResizeAndGetMetaData: function (getFrame, FormDatas, fileContaner, fileStuff, json) {
        getFrame.style.height = "98%";
        var fb = document.getElementById("FrameBody");
        var fF = document.getElementById("frameFooter");
        var dcLabel = document.getElementById("DocLabel");
        var hoverObjed = document.getElementById("hoverObj");
        dcLabel.innerHTML = "Uploaded Document";
        fF.style.height = "5%";
        fb.style.height = "85%";
        fb.style.marginTop = "-1%";
        fb.style.overflowY = "auto";
        getFrame.style.top ="1%"
        fileContaner.style.height = "18%";
        fileContaner.style.width = "17%";
        hoverObjed.style.fontSize = "100%";
        fileContaner.style.marginLeft = "10%";
        fileContaner.style.overflow = "auto";
        var fields = [{ "Label": "Name", "DefaultValue": fileStuff[0]["Name"], "backgroundImage": "/img/ViewOnly.png" }, { "Label": "Title", "DefaultValue": "" , "backgroundImage": "/img/edit.png"},
         {"Label": "GHVHSCategory", "DefaultValue": "",
          "DropDown": ["Administration", "Behavioral Health", "Biomedical Engineering", "Blood Bank", "Bone and Joint Center", "Breast Center", "Cardiac Services",
                        "Centralized Scheduling", "Clinical Services", "Diabetes Center", "Dietary Services", "Emergency Services", "Employee Health", "Environmental Services",
                        "Foundation", "ICU", "Infection Control", "Interventional Radiology", "Laboratory Services", "Medical Groups", "Medical Imaging", "Medical Record",
                        "Medical School Education", "Medical/Surgical", "Mother Baby Services", "Nuclear Medicine", "Nursery", "Oncology", "OP Observation",
                        "Outpatient Services", "Pediatrics", "Pharmacy", "Physical Environment", "Skilled Nursing", "Staffing Management", "Step Down", "Support Services",
                        "Surgical Services", "Telemetry", "Wound Care"],
          "backgroundImage": "/img/blackDrop.png"},
        { "Label": "GHVHSDepartment", "DefaultValue": "", "DropDown": ["CSK AMB INFECT DISEASE", "CSK AMB MEDICAL GROUP", "CSK HARRIS FAMILY HLTH", "CSK PT FIN SVC", "CSK WATER DEPARTMENT", "ORMC AMB MEDICAL GROUP", "ORMC ED", "ORMC MEDICAL EDUCATION", "ORMC PT FIN SVCS", "ORMC SDS PHASE II" ], "backgroundImage": "/img/blackDrop.png" },
        { "Label": "GHVHSLocation", "DefaultValue": "", "DropDown": ["Callicoon", "CRMC", "GHVHS", "Medical Group", "ORMC", "Urgent Care"], "backgroundImage": "/img/blackDrop.png" }, { "Label": "Concurrer", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png" },
         { "Label": "Auto Approve On Concurrence", "DefaultValue": "", "backgroundImage": "/img/fileIcon.jpeg" },
         { "Label": "PolicyRelatedDoc1", "DefaultValue": "", "backgroundImage": "/img/fileIcon.jpeg" }, { "Label": "PolicyRelatedDoc2", "DefaultValue": "", "backgroundImage": "/img/fileIcon.jpeg" },
        { "Label": "PolicyRelatedDoc3", "DefaultValue": "", "backgroundImage": "/img/fileIcon.jpeg" }, { "Label": "PolicyRelatedDoc4", "DefaultValue": "", "backgroundImage": "/img/fileIcon.jpeg" }];

        for (var i = 0; i < fields.length; i++) {
            if (fields[i]["Label"] == "Auto Approve On Concurrence") {
                
                if (window.location.href.indexOf("DraftPolicies") >= 0) {
                    NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:3.5%;", "Id": "NameAndInput", "Parent": fb });
                    InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:8%;text-align: left;", "Parent": NameAndInput });
                    InputLabel.innerHTML = fields[i]["Label"];
                    if (i == 0) {
                        NameAndInput.style.marginTop = "0.5%";
                    }
                    NameAndInput.style.marginBottom = "1%";
                    NameAndInput.id = fields[i]["Label"];
                    SingleCheck = GHVHS.DOM.create({ "Type": "div", "Class": "SingleCheck", "Style": "padding-top: 2%;", "Id": "SingleCheck", "Parent": NameAndInput });
                    AACmessage = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "AACmessage", "Content": "* By selecting this, your policy will be approved and added to ApprovedPolicies once the last concurrer approves their concurrence task. Uncheck to to be the last concuerr once the all concurrers task's are complete.", "Parent": NameAndInput });
                    var CheckBox = GHVHS.DOM.create({ "Type": "div", "Class": "CheckBox", "Style": "height: 25px;width: 25px;margin-left: 17%;cursor:pointer;", "Id": "CheckBox", "Parent": SingleCheck });
                    CheckBox.onclick = function () {
                        if (this.style.backgroundImage.indexOf("/img/checkmark.png") < 0) {
                            AACmessage.className = "AACmessage";
                            this.id = "Y";
                            this.parentElement.parentElement.style.marginBottom = (AACmessage.offsetHeight + 6) + "px";
                            this.style.backgroundImage = "url(/img/checkmark.png)";
                            this.style.backgroundRepeat = "no-repeat";
                            this.style.backgroundSize = "cover";
                            this.style.transform = "scale(1.1)";
                            var that = this;
                            var reset = setTimeout(function () {
                                that.style.transform = "scale(1.0)";
                            }, 50);
                        } else {
                            this.parentElement.parentElement.style.marginBottom = "1%";
                            this.id = "N";
                            AACmessage.className = "hide";
                            this.style.backgroundImage = null;
                            this.style.backgroundRepeat = "no-repeat";
                            this.style.backgroundSize = "cover";
                            this.style.transform = "scale(1.1)";
                            var that = this;
                            var reset = setTimeout(function () {
                                that.style.transform = "scale(1.0)";
                            }, 50);
                        }
                    }
                } 
            } else {
                NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:3.5%;", "Id": "NameAndInput", "Parent": fb });
                InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:8%;text-align: left;", "Parent": NameAndInput });
                InputLabel.innerHTML = fields[i]["Label"];
                if (i == 0) {
                    NameAndInput.style.marginTop = "0.5%";
                }
                    Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/edit.png); background-size: 25px;padding-left:5px; box-shadow: 2px 2px 3px grey;width: 55%; height: 100%;", "Parent": NameAndInput });
                    Filter.onkeyup = function (event) {
                        var theValue = this.value;
                        if (this.id != "Title") {
                            if (this.id == "Concurrer") {
                                if (theValue.indexOf(";") >= 0) {
                                    var splitValue = theValue.split(";");
                                    theValue = splitValue[splitValue.length-1];
                                } else {
                                    theValue = this.value;
                                }
                                if (this.value != "") {
                                    Pnp.FilterValue(this, theValue, event);
                                }
                            } else {
                                Pnp.FilterValue(this, theValue, event);
                            }
                    
                        }
                    }
                    Filter.onblur = function (e) {
                        if (Pnp.IsDropOption != "Y") {
                            var theValue = this.value;
                            if (this.id == "Concurrer") {
                                if (theValue.indexOf(";") >= 0) {
                                    var splitValue = theValue.split(";");
                                    theValue = splitValue[splitValue.length-1];
                                } else {
                                    theValue = this.value;
                                }
                                if (this.value != "") {
                                    Pnp.HandleFilterBlur(this, theValue);
                                }
                            } else {
                                Pnp.HandleFilterBlur(this, theValue);
                            }
                    
                        }
                    }
                    Filter.setAttribute("autocomplete", "Off");
                    Filter.style.width = "53%";
                    if (fields[i]["Label"] != "Name"){
                        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.3%;margin-left: -3%;position: relative;", "Parent": NameAndInput });
                        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
                        addimg.alt = "Clear";
                        addimg.onclick = function () {
                            var filter = this.parentElement.parentElement.querySelectorAll(".Filter");
                            filter[0].style.border = "1px solid silver";
                            if (filter[0].id == "Concurrer") {
                                Pnp.Emails = [];
                            }
                            Pnp.CheckAllFilters(filter[0]);
                            filter[0].value = "";
                        }
                    } else {
                        Filter.setAttribute("readonly", "true");
                    }
                    if (fields[i]["Label"] == "Title") {
                        Filter.setAttribute("placeHolder", "Enter A Title");
                    }
                    if ( fields[i]["DefaultValue"] != ""){
                        Filter.value = fields[i]["DefaultValue"];
                    }
                    if (fields[i]["backgroundImage"] != "") {
                        Filter.style.backgroundImage = "url(" + fields[i]["backgroundImage"] + ")";
                        if (fields[i]["backgroundImage"] == "/img/blackDrop.png") {
                            Filter.style.backgroundSize = "15px";
                        }
                    }
                    Filter.id = fields[i]["Label"];
                    var urlPart;
                    if (fields[i]["Label"] == "Concurrer") {
                        if (window.location.href.indexOf("ApprovedPolicies") < 0){
                            Pnp.drawConcurrerFilter(Filter, NameAndInput);
                            Filter.setAttribute("placeHolder", "Select A Value");
                        } else {
                            Filter.className = "hide";
                            NameAndInput.className = "hide";
                        }
                    }
                    if (fields[i]["Label"].indexOf("PolicyRelatedDoc") >= 0) {
                        Filter.style.width = "53%";
                        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Parent": NameAndInput });
                        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/Add.png", "Class": "addimg ", "Id": "addimg ", "Parent": addDiv });
                        var getFile = GHVHS.DOM.create({ "Type": "input", "InputType": "File", "Class": "hide", "Id": "PDRFile", "Parent": addDiv });
                        addimg.onclick = function () {
                            var getFileData = this.parentElement.querySelectorAll(".hide");
                            getFileData[0].click();
                        }
                        getFile.onchange = function () {
                            var getImg = this.parentElement.querySelectorAll(".addimg");
                            var getFilter = this.parentElement.parentElement.querySelectorAll(".Filter");
                            Pnp.UploadFileToPDR(this, this.parentElement, getImg[0],getFilter);
                        }
                        var theData = Pnp.GlobalPRD;
                        var options = [];
                        for (var q = 0; q < theData.length; q++) {
                            var data = theData[q]["Fields"][0];
                   
                            options.push(data["Name"]);

                        }
                        Pnp.drawConcurrerFilter(Filter, NameAndInput, options);
                        Filter.setAttribute("placeHolder", "Click To Select A Value");
                    }
                    if (fields[i]["DropDown"]) {
                        Pnp.drawConcurrerFilter(Filter, NameAndInput, fields[i]["DropDown"]);
                        //GHVHS.DOM.CreateDropDown({ "Element": fields[i]["Label"], "dropDownId": "", "Options": fields[i]["DropDown"], "todraw": "input", "NoClear": "Y" });
                        Filter.setAttribute("placeHolder", "Select A Value");
                    }
           
                    NameAndInput.id = fields[i]["Label"];
           
                }
            }
        if (json) {
            var data;
           
            for (var i = 0; i < json["Items"].length; i++) {
                data = json["Items"][i]["Fields"][0];

            }
            var getNameInputs = document.getElementById("IFrame").querySelectorAll(".NameAndInput");
            for (var i = 0; i < getNameInputs.length; i++) {
                var Name = getNameInputs[i].id;
                if (Name == "Auto Approve On Concurrence") {
                    Name = "AutoApprove"
                }
                if (data[Name]) {
                    if (Name == "AutoApprove") {
                        if (data[Name] == "Y") {
                            var inputed = getNameInputs[i].querySelectorAll(".CheckBox");
                            inputed[0].click();
                        }
                    } else {
                        var inputed = getNameInputs[i].querySelectorAll(".Filter");
                        var theValue = data[Name];
                        if (data[Name] != "Null") {
                            if (Name == "Concurrer") {
                                if (theValue.substr(-1) == ";") {
                                    inputed[0].value = theValue;
                                } else {
                                    inputed[0].value = theValue + ";";
                                }
                                Pnp.DefaultConcurrers = theValue;
                            } else {
                                inputed[0].value = theValue;
                            }

                        }
                    }
                }
            }
            var get = document.getElementById("IFrame").querySelectorAll(".EventLable");
            for (var i = 0; i < get.length; i++) {
                get[i].innerText = "Edit Document Metadata";
            }
            
        }
    },
    Emails: [],
    pastZIndex:900000,
    drawConcurrerFilter: function (filter, parent, list) {
       
        var DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": parent });
        DropDown.style.height = "1px";
        DropDown.style.display = "none";
        DropDown.style.transition = "height 0.4s ease";
        DropDown.style.top = (filter.offsetTop + filter.offsetHeight) + "px";
        DropDown.style.overflow = "auto";
        DropDown.style.backgroundColor = "white";
        Pnp.pastZIndex -= 1;
        DropDown.style.zIndex = Pnp.pastZIndex+"";
        DropDown.style.left = filter.offsetLeft + "px";
        DropDown.style.boxShadow = "2px 2px 6px grey";
        DropDown.style.width = filter.offsetWidth + "px";
        DropDown.style.position = "absolute";
        filter.onclick = function () {
            if (DropDown.style.height == "1px") {
                DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                DropDown.style.display = "block";
                setTimeout(function () {
                    DropDown.style.height = "130px";
                }, 10);
            } else {
                DropDown.style.height = "1px";
                setTimeout(function () {
                    DropDown.style.display = "none";
                }, 500);
            }
        }
        DropDown.onmouseover = function () {
            Pnp.IsDropOption = "Y";
        }
        DropDown.onmouseout = function () {
            Pnp.IsDropOption = "";
        }
        if (filter.id == "Concurrer") {
           
            function getU(json, p) {
                Pnp.GobalUser = json["Items"];
                for (var i = 0; i < json["Items"].length; i++) {
                    var  data = json["Items"][i]["Fields"][0];
                    var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Parent": p[0] });
                    SingleOption.id = data["EMail"];
                    SingleOption.innerHTML = data["Title"];
                    SingleOption.onclick = function () {
                        var getFilter = this.parentElement.parentElement.querySelectorAll(".Filter");
                        var getOptions = this.parentElement.querySelectorAll("div");
                        if (getFilter[0].value != "") {
                            var flag = "";
                            var valueToAdd = "";
                            var splitCheck = [];
                            var NewValueToAdd = this.innerText;
                            if (getFilter[0].value.indexOf(";") >= 0) {
                                splitCheck = getFilter[0].value.split(";");
                            } else {
                                splitCheck.push(getFilter[0].value);
                            }
                            for (var k = 0; k < splitCheck.length; k++) {
                                for (var j = 0; j < getOptions.length; j++) {
                                    var checkValue = getOptions[j].innerText.toLowerCase();
                                    var SplitValue = splitCheck[k].toLowerCase();
                                    if (SplitValue == checkValue) {
                                        valueToAdd += getOptions[j].innerText + ";";
                                    }
                                }
                            }
                            for (var j = 0; j < getOptions.length; j++) {
                                var checkValue = getOptions[j].innerText.toLowerCase();
                                var FilterValue = NewValueToAdd.toLowerCase();
                                if (FilterValue == checkValue) {
                                    flag = "Y";
                                    NewValueToAdd = getOptions[j].innerText;
                                }
                            }
                            if (flag == "Y") {
                                for (var j = 0; j < splitCheck.length; j++) {
                                    var checkValue = splitCheck[j].toLowerCase();
                                    var FilterValue = NewValueToAdd.toLowerCase();
                                    if (FilterValue == checkValue) {
                                        flag = "N";
                                    }
                                }
                            }
                            if (flag == "Y") {
                                valueToAdd += NewValueToAdd + ";";
                                Pnp.Emails += this.id +";";
                            } else {
                                setTimeout(function () {
                                    for (var w = 0; w < getOptions.length; w++) {
                                        getOptions[w].className = "DropOption";
                                    }
                                }, 100);
                                
                            }
                            getFilter[0].value = valueToAdd;
                        } else {
                            getFilter[0].value = this.innerText+";";
                            Pnp.Emails += this.id + ";";
                        }
                        getFilter[0].style.border = "1px solid silver";
                        p[0].style.height = "1px";
                        Pnp.CheckAllFilters(getFilter[0]);
                        setTimeout(function () {
                            p[0].style.display = "none";
                        }, 500);
                    }
                }
            }
            GHVHS.DOM.send({ "URL": "/Pnp/getUsers", "CallbackParams": [DropDown, filter], "Callback": getU });
        } else {
            for (var i = 0; i < list.length; i++) {
                var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Parent": DropDown });
                SingleOption.innerHTML = list[i];
                SingleOption.onclick = function () {
                    
                    filter.value = this.innerText;
                    filter.style.border = "1px solid silver";
                    Pnp.CheckAllFilters(filter);
                    DropDown.style.height = "1px";
                    setTimeout(function () {
                        DropDown.style.display = "none";
                    }, 500);
                }
            }
        }
    },
    UploadFileToPDR:function(file, parentElem, img, filter){
        var ogImg = img.src;
        img.src = "/img/loadingDoc.gif";
        var fileStuff = file.files[0];
        var Type = fileStuff.name;
        var url;
        var formData = new FormData();
        formData.append('file', fileStuff);
        if (Type.indexOf(".docx") > 0 ){
            url = "/img/fileIcon.jpeg";
        }else if ( Type.indexOf(".doc") > 0) {
            url = "/img/fileIcon.jpeg";
            continueUp = "Y";
        } else if (Type.indexOf(".xlsx") > 0 || Type.indexOf(".xls") > 0) {
            url = "/img/excell.jpeg";
        } else if (Type.indexOf(".pptx") > 0 || Type.indexOf(".ppt") > 0) {
            url = "/img/pptx.png";
        }
        function createdFile(json,p) {
            var theImgUrl = p[1];
            var theImg = p[2];
            var filter = p[0];
            var ogimg = p[3];
            var name = p[4];
            theImg.src = ogimg;
            filter[0].style.backgroundImage = "url(" + theImgUrl + ")";
            filter[0].value = name;
        }
        GHVHS.DOM.send({ "URL": "/Pnp/UploadFile?list=Policies%20%20Related%20%20documents&FileName=" + Type, "PostData": formData, "CallbackParams": [filter, url, img, ogImg, Type], "Callback": createdFile, "Method": "POST" });

    },
    drawErrorMsg:function(msg){
        var getFrame = document.getElementById("IFrame")
        var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Content": msg, "Parent": getFrame });
        Error.style.top = 50 + "px";
        Error.style.left = ( ((getFrame.offsetWidth / 2) - 100)) + "px";
        var ErrorOff = setTimeout(function () {
            document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
        }, 3000); 
    },
    logInUser: function (redirect) {
        Form = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2","Style":"background:rgba(0, 0, 0, 0.9) none repeat scroll 0% 0%;", "Parent": document.getElementById("MainContent") });
        IFrame = GHVHS.DOM.create({ "Type": "div", "Class": "IFrame", "Id": "IFrame","Style": "background-color:white;", "Parent": Form });
        IFrame = GHVHS.DOM.create({ "Type": "div", "Class": "FaxNewHeader", "Id": "FaxNewHeader", "Content": "", "Style": " height: 4%;", "Parent": IFrame });
        framedBody = GHVHS.DOM.create({ "Type": "div", "Class": "framedBody", "Id": "framedBody",  "Parent": IFrame });
        LandingImage = GHVHS.DOM.create({ "Type": "img", "Src": "/img/PnP.jpg", "Class": "LandingImage", "Style": "margin-left:15%;margin-bottom:0px;height:auto; max-height:none;width:70%;", "Id": "LandingImage", "Parent": framedBody });
        var fields = ["username", "password"];

        for (var i = 0; i < fields.length; i++){
            NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput","Style":"margin-top:0px;", "Id": "NameAndInput", "Parent": framedBody });
            InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Parent": framedBody });
            
            if (fields[i] == "username") {
                var Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/edit.png); background-size: 25px; width: 55%; height: 200%;", "Parent": framedBody });
                Filter.id = fields[0];
                Filter.setAttribute("autocomplete", "Off");
                Filter.setAttribute("placeholder", "Username");
                Filter.onkeyup = function () {
                    if (this.style.color == "red") {
                        this.value = "";
                        this.style.color = "black";
                    }

                }
          }else {
                Filter = GHVHS.DOM.create({ "Type": "input", "InputType":"Password","Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/edit.png); background-size: 25px; width: 55%; height: 200%;", "Parent": framedBody });
                Filter.id = fields[i];
                Filter.setAttribute("autocomplete", "Off");
                Filter.setAttribute("placeholder", "Password");
                Filter.onkeyup = function () {
                    if (this.style.color == "red") {
                        this.value = "";
                        this.style.color = "black";
                    }
                    
                }
            }
        }
        SearchButtonSmall = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style":"width: 40%;margin-left:30%;padding-bottom:2%;", "Content": "Log In", "Parent": framedBody });

        SearchButtonSmall.onclick = function () {
            GHVHS.DOM.DrawSmallLoader2();
            var fields = ["username", "password"];
            var parms = "";
            var reutrnString = "N";
            var special = "N";
            for (var i = 0; i < fields.length; i++) {
                var elem =  document.getElementById(fields[i]);
                    if (elem.value) {
                        if (elem.value != "Please Enter a value!") {
                            parms += "&" + fields[i] + "=" + elem.value;
                            if (elem.value == "jmuller3") {
                                special = "Y";
                            }
                        } else {
                            elem.value = "Please Enter a value!";
                            elem.style.color = "red";
                            reutrnString = "Y";
                        }
                            
                    }else {
                        elem.value = "Please Enter a value!";
                        elem.style.color = "red";
                        reutrnString = "Y";
                    }
            }
            if (document.getElementById("special")) {
                parms += "&special=" + document.getElementById("special").value;
                if (document.getElementById("special").value == "") {
                    special = "cancel";
                }
            }
        if (reutrnString != "Y") {
            function checkToRedirect(json, p) {
                var loader = document.getElementById("FaxTableLoader");
                loader.parentElement.removeChild(loader);
                if (json["Success"] == true){
                    window.location.href = p;
                } else {
                    Pnp.drawErrorMsg("Username and/or Password is incorrect.");
                }
            }
            var d = new Date();
            var n = d.getTime();
            if (special == "Y") {
                var getSepicalInput = (document.getElementById("special"));
                if (getSepicalInput) {
                    

                    GHVHS.DOM.send({ "URL": "/PnP/isJake?check=Y" + parms + "&type=Y&Dummy=" + n, "Callback": checkToRedirect, "CallbackParams": redirect });
                }else {
                    function drawSpecial(json) {
                        var loader = document.getElementById("FaxTableLoader");
                        loader.parentElement.removeChild(loader);
                        if (json["Success"] == "true"){
                            var getfBody = document.getElementById("framedBody");
                            Filter = GHVHS.DOM.create({ "Type": "input","Class": "Filter", "Id": "special", "Style": "background-image: url(/img/edit.png); background-size: 25px; width: 55%; height: 200%;", "Parent": getfBody });
                            Filter.setAttribute("placeholder", "Enter username to login as.");
                        }else {
                            special = "N";
                            Pnp.drawErrorMsg("Username and/or Password is incorrect.");
                        }
                    }
                    GHVHS.DOM.send({ "URL": "/PnP/isJake?check=Y" + parms + "&Dummy=" + n, "Callback": drawSpecial, "CallbackParams": redirect });
                }
                
            }else if (special == "cancel"){
                GHVHS.DOM.send({ "URL": "/PnP/isJake?check=Y&type=cancel&Dummy=" + n, "Callback": checkToRedirect, "CallbackParams": redirect });
            }else {
                GHVHS.DOM.send({ "URL": "/PnP/checkLog?check=Y" + parms + "&Dummy=" + n, "Callback": checkToRedirect, "CallbackParams": redirect });
            }
           
            
        } else {
            var loader = document.getElementById("FaxTableLoader");
            loader.parentElement.removeChild(loader);
            Pnp.drawErrorMsg("Please enter a valid Username and Password.");
        }
        }
    },
    getSearchResults: function (json, search) {
        if (json) {
            var temp = json["d"]["query"]["PrimaryQueryResult"]["RelevantResults"]["Table"]["Rows"];
            console.log(temp);
        } else {
            GHVHS.DOM.send({ "URL": "/Pnp/APISearch?Search=" + search, "Callback": Pnp.getSearchResults, "CallbackParams": [] });
        }
    }
    
}; 