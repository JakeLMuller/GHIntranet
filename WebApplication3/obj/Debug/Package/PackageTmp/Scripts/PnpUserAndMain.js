var Pnp = {
    Departments: [],
    Locations: [],
    Categories: [],
    Navigation: [],
    // loads MetaData in document and seperates into objects from cache on server
    SeperateMetaData: function (Meta) {
        if (Meta == null) {
            window.location.href = window.location.href;
        }
        for (var i = 0; i < Meta.length; i++) {
            if (Meta[i].Name == "Category") {
                Pnp.Categories = Meta[i].SingleMetaDataList; 
            } else if (Meta[i].Name == "Departments") {
                Pnp.Departments = Meta[i].SingleMetaDataList;
            } else if (Meta[i].Name == "Location") {
                Pnp.Locations = Meta[i].SingleMetaDataList;
            }
        }
        // calls ajaxs call getAllUsers() to load users in document from cache on server
        Pnp.getAllUsers();
    },
    AllUsers: [],
    setAllUsers:function(json){
        for (var i = 0; i < json["Items"].length; i++){
            Pnp.AllUsers["Items"].push(json["Items"][i]);
        }
    },
    getAllUsers2: function (json) {
        Pnp.AllUsers = json;
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getUsers?Half=2", "Callback": Pnp.setAllUsers, "CallbackParams": [] });
    },
    getAllUsers:function(){
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getUsers?Half=1", "Callback": Pnp.getAllUsers2, "CallbackParams": [] });
    },
    // Single policy function to draw UI 
    ViewItem: function (id, Username, FullName, ViewOnly) {
        // Set View, username mode to Global Variable
        Pnp.GlobalViewOnly = ViewOnly;
        // if no user departments set to View mode
        if (!Pnp.UserDepartment) {
            Pnp.GlobalViewOnly = "Y";
        }
        Pnp.UserName = Username;
        // create master parent element for single policy
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu("", Elem, Pnp.GlobalViewOnly);
        Pnp.FullName = FullName;
        var NotEditMode = "";
        if (Pnp.GlobalViewOnly == "Y") {
            NotEditMode = "View";
        }
        // draws grey top bar on page
        Pnp.DrawTopBar(Username, Elem, "", NotEditMode);
       
        // below this function is a ajax call to get single policy data
        function DrawSingleItem(json, p) {
            var isPRD = p[1];
            var Elem = document.getElementById("Elem");
            var data = json["Items"][0]["Fields"];
            // check for edit access 
            // Pnp.UserDepartment is the users department ids they have access to
            if (Pnp.UserDepartment) {
                if (Pnp.UserDepartment.indexOf(data["Department"]) < 0) {
                    if (!Pnp.Verified) {
                        Pnp.GlobalViewOnly = "Y";
                    }
                }
                if (Pnp.UserName == data["Author"]) {
                    Pnp.GlobalViewOnly = "";
                }
            }
            // check the img from the mime type of the file and add to title Element of page
            var getTitle = document.getElementById("TitlePnp");
            var Type = data["FileName"];
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
            // OptionBar is the image contianer that holds edit icons
            var OptionBar = GHVHS.DOM.create({ "Type": "div", "Class": "OptionBar", "Id": "OptionBar", "Parent": Elem });
            if (document.getElementById("canvas").offsetWidth < 1500) {
                OptionBar.style.marginLeft = "35%";
                OptionBar.style.width = "30%";
                OptionBar.style.height = "8%";
            }
            // this is the "Click Here To Upload a New Policy" button, used to launch edit form 
            var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "FilesHeader", "Parent": Elem });
            Pnp.drawAddButtonAndLabel(EventHeader);
            // draws the icons to OptionBar and there functionality ( if not edit access this just Draw View Only in Text )
            if (!Pnp.GlobalViewOnly) {
            var barTopImg = GHVHS.DOM.create({ "Type": "div", "Class": "barTopImg", "Id": "barTopImg", "Parent": OptionBar });
            var imgs = ["/img/checkout.png", "/img/edit.png","/img/fileHistory.png", "/img/RedX.png"];
            if (data["PolicyFolder"] == "PolicyRelatedDocuments") {
                var imgs = ["", "/img/RedX.png", ""];
            }
                for (var i = 0; i < imgs.length; i++) {
                    var singLabel = GHVHS.DOM.create({ "Type": "div", "Class": "singLabel", "Id": "singLabel", "Parent": barTopImg });
                    if (document.getElementById("canvas").offsetWidth < 1500) {
                        singLabel.style.fontSize = "80%";
                    }
                    var singleImgC = GHVHS.DOM.create({ "Type": "div", "Class": "singleImgC", "Id": "singleImgC", "Parent": OptionBar });
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "theSingleImg", "Id": "ViewImg" + i, "Src": imgs[i], "Style": "cursor:pointer;height:100%;margin-left:auto;margin-right:auto;display:block;margin-top:11%;", "Parent": singleImgC });


                    if (imgs[i] == imgs[0]) {
                        if (imgs[i] != "") {
                            singLabel.innerHTML = "Check Out/In";
                            lodingImg.id = data["SharepointId"];
                            var TheId = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "theID", "Content": data["SharepointId"], "Parent": lodingImg });
                            lodingImg.onclick = function () {
                                var getcheckoutId = document.getElementById("CheckOutID");
                                var getcheckoutImg = document.getElementById("CheckOutImg");
                                var getTitle = document.getElementById("TitlePnp").innerText;
                                if (document.getElementById("ViewFile")) {
                                    document.getElementById("ViewFile").style.display = "none";
                                }
                                Pnp.checkOutDoc(this, getcheckoutImg, getcheckoutId, getTitle, "Y");
                            }
                        }
                    } else if (imgs[i] == imgs[2]) {
                        singLabel.innerHTML = "File History";
                        lodingImg.id = data["SharepointId"];
                        Pnp.TempData = data;
                        lodingImg.onclick = function () {
                            Pnp.GetFileHistory(this.id, Pnp.TempData);
                        }
                        

                    } else if (imgs[i] == imgs[3]) {
                        singLabel.innerHTML = "Archive";
                        lodingImg.id = data["SharepointId"] + "||" + data["FileName"] + "|" + data["PolicyFolder"];
                        if (!data["CheckedOut"] || data["CheckedOut"] == Pnp.UserName) {
                            lodingImg.onclick = function () {
                                var parent = this;
                                var id = this.id;
                                var datas = id.split("||");
                                var list = datas[1].split("|");
                                Pnp.DrawConfirmButton(parent, datas[0], list[0], list[1], "Y");
                            }
                        } else {
                            lodingImg.onclick = function () {
                                var theSplit = this.id.split("||");
                                Pnp.drawNoAccessToButton("Sorry, " + theSplit[1] + " is checked out and can't be Archived while checked out.");
                            }
                        }
                       
                    } else if (imgs[i] == imgs[1]) {
                        if (!data["CheckedOut"] || data["CheckedOut"] == Pnp.UserName) {
                            if (imgs[i] != "/img/RedX.png") {
                                singLabel.innerHTML = "Edit";
                                lodingImg.id = data["SharepointId"] + "||" + data["FileName"] + "|" + data["PolicyFolder"] + "[]!%" + data["FileRef"];
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
                            } else {
                                singLabel.innerHTML = "Delete";
                                lodingImg.id = data["SharepointId"] + "||" + data["FileName"] + "|" + data["PolicyFolder"];
                                lodingImg.onclick = function () {
                                    var parent = this;
                                    var id = this.id;
                                    var datas = id.split("||");
                                    var list = datas[1].split("|");
                                    Pnp.DrawConfirmButton(parent, datas[0], list[0], list[1], "Y", data["PolicyFolder"]);
                                }
                            }
                        } else {
                            if (imgs[i] != "/img/RedX.png") {
                                singLabel.innerHTML = "Edit";
                            } else {
                                singLabel.innerHTML = "Delete";
                            }
                            lodingImg.id = "temp||" + data["FileName"];
                            lodingImg.onclick = function () {
                                var theSplit = this.id.split("||");
                                Pnp.drawNoAccessToButton("Sorry, " + theSplit[1] + " is checked out and can't be edited while checked out.");
                            }
                        }
                    }
                }
            } else {
                
                LabelView = GHVHS.DOM.create({ "Type": "div", "Class": "LabelView", "Id": "LabelView","Content":"View Policy", "Parent": OptionBar });
            }
            // draws the document information and Related Douments tabs, info and links
            ColumnsData = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsData", "Id": "ColumnsData", "Parent": Elem });
            ColumnsDataTab = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsDataTab", "Id": data["PDFFilePath"], "Content": "Document Information", "Parent": ColumnsData });
            //isPRD is checked to see if is policy or a related doc (different columns for document information and draws no related doc tabs)
            if (!isPRD) {
                ColumnsDataTab.onclick = function () {
                    var allRelated = this.parentElement.querySelectorAll(".hide");
                    document.getElementById("ViewFile").src = this.id;
                    var allinputs = this.parentElement.querySelectorAll(".ViewRelated");
                    for (var q = 0; q < allinputs.length; q++) {
                        allinputs[q].className = "hide";
                    }
                    var checkForSelected = this.parentElement.querySelector(".ViewRelatedSlected");
                    if (checkForSelected) {
                        checkForSelected.className = "hide";
                    }
                    if (document.getElementById("ViewRelatedMessage")) {
                        document.getElementById("ViewRelatedMessage").className = "hide";
                    }
                    for (var q = 0; q < allRelated.length; q++) {
                        allRelated[q].className = "NameAndInput";
                    }
                    this.className = "ColumnsDataTab";
                    ColumnsDataTab2.className = "ColumnsDataTabNotSelected";
                }
                ColumnsDataTab2 = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsDataTabNotSelected", "Id": "ColumnsDataTab2", "Content": "Related Documents", "Parent": ColumnsData });
                ColumnsDataTab2.onclick = function () {
                    var allRelated = this.parentElement.querySelectorAll(".hide");

                    var allinputs = this.parentElement.querySelectorAll(".NameAndInput");
                    for (var q = 0; q < allinputs.length; q++) {
                        allinputs[q].className = "hide";
                    }

                    for (var q = 0; q < allRelated.length; q++) {
                        allRelated[q].className = "ViewRelated";
                    }
                    if (document.getElementById("ViewRelatedMessage")) {
                        document.getElementById("ViewRelatedMessage").className = "ViewRelatedMessage";
                     }
                    this.className = "ColumnsDataTab";
                    ColumnsDataTab.className = "ColumnsDataTabNotSelected";
                }
                ColumnsDataBody = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsDataBody", "Id": "ColumnsDataBody", "Parent": ColumnsData });
                function drawRelatedDocSingleView(datas, p) {
                    ViewRelatedMessage = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "ViewRelatedMessage", "Parent": p });
                    ViewRelatedMessage.innerHTML = " Click on any related document below to view it on the right."
                    for (var q = 0; q < datas["Items"].length; q++) {
                        var tempPath = datas["Items"][q]["Fields"]["FilePath"];
                        var temp = tempPath.split(".").pop();
                        var Name = tempPath.replace(temp, "pdf");
                        ViewRelated = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": Name, "Parent": p });
                        var ViewRelatedIcon = GHVHS.DOM.create({ "Type": "img", "Class": "ViewRelatedIcon", "Id": "ViewImg", "Src": "", "Parent": ViewRelated });
                        var Type = datas["Items"][q]["Fields"]["FileName"];
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
                        ViewRelatedIcon.src = url;
                        ViewRelatedIcon.style.maxHeight = "35px";
                        ViewRelatedIcon.style.marginTop = "5px";
                        ViewRelatedLabel = GHVHS.DOM.create({ "Type": "div", "Class": "ViewRelatedLabel", "Id": "ViewRelatedLabel", "Content": Type, "Parent": ViewRelated });
                        ViewRelated.onclick = function () {
                            document.getElementById("ViewFile").src = this.id;
                            var allRelated = this.parentElement.querySelectorAll("div");
                            for (var j = 0; j < allRelated.length; j++) {
                                if (allRelated[j].className == "ViewRelatedSlected") {
                                    allRelated[j].className = "ViewRelated";
                                }
                            }
                            this.className = "ViewRelatedSlected";
                        }
                    }

                }
                // ajax call to get related docs for policies 
                if (data["RelatedDocs"]) {
                    GHVHS.DOM.send({ "URL": "/Pnp/getRelatedDocuments?Id=" + data["RelatedDocs"], "CallbackParams": ColumnsDataBody, "Callback": drawRelatedDocSingleView });
                }
            } else {
                // if fails IsPDR check then just draws 
                ColumnsDataBody = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsDataBody", "Id": "ColumnsDataBody", "Parent": ColumnsData });
            }
            var AllColumns = {
                "Approved": ["Title", "PolicyFolder","PolicyNumber", "Author", "LastModified", "Editor", "Category", "Department", "Location", "Checked Out By", "Is Checked Out"],
                "Draft": ["Title", "PolicyFolder", "PolicyNumber", "Author", "LastModified", "Editor", "Category", "Department", "Location", "Concurrers", "Approver", "Checked Out By", "Is Checked Out"],
                "Archive": ["Title", "PolicyFolder", "PolicyNumber", "Author", "LastModified", "Editor", "Category", "Department", "Location", "Checked Out By", "Is Checked Out"],
                "PolicyRelatedDocuments": ["Title", "PolicyNumber", "FileName", "Author", "LastModified", "Checked Out By", "Is Checked Out"]
            };
            list = data["PolicyFolder"] ;
            var columns = AllColumns[list];
            for (var i = 0; i < columns.length; i++) {
                // element for data and label to be displayed in UI
                NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:0%;height:auto;color:black;text-shadow:0.1px 0.1px 1px #a8b2bb;", "Id": "NameAndInput", "Parent": ColumnsDataBody });
                InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:5%;color:white;text-shadow:0.1px 0.1px 1.5px black;font-size:120%;", "Parent": NameAndInput });
                InputLabel.innerHTML = columns[i];
                if (document.getElementById("canvas").offsetWidth < 1500){
                    InputLabel.style.fontSize = "75%";
                    InputLabel.style.paddingTop = "2.5%";
                }
                if (columns[i] == "Department") {
                    Filter = GHVHS.DOM.create({ "Type": "div", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/view.png); text-align:center; border-radius: 0px; padding-top:0.5%;background-color:white;background-size: 25px; width: 55%; height: 100%;margin-bottom:0.3%;", "Parent": NameAndInput });
                    Filter.innerHTML = data[columns[i]];
                    Filter.style.height = "auto";
                    var departmentValue = data["Department"];
                    // do look up with from department cache in doc to find name
                    for (var f = 0; f < Pnp.Departments.length; f++) {
                        if (Pnp.Departments[f].Id == departmentValue) {
                            departmentValue = Pnp.Departments[f].Name;
                        }
                    }
                    Filter.innerHTML = departmentValue;
                }else if (columns[i] == "Checked Out By") {
                    Filter = GHVHS.DOM.create({ "Type": "div", "Class": "Filter", "Id": "CheckOutID", "Style": "background-image: url(/img/view.png); text-align:center; border-radius: 0px; padding-top:0.5%;background-color:white;background-size: 25px; width: 55%; height: 100%;margin-bottom:0.3%;", "Parent": NameAndInput });
                    Filter.innerHTML = data["CheckedOut"];
                } else if (columns[i] == "Is Checked Out") {

                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "CheckOutImg", "Style": "border:1px solid grey; height:40px;min-width:40px; background-color:white;margin-left:2.5%;margin-top:2%;", "Parent": NameAndInput });
                    if (data["CheckedOut"]){
                        lodingImg.src = "/img/greenCheck.png";
                    }
                } else if (columns[i] == "Concurrers" || columns[i] == "Approver") {
                    var column = data[columns[i]];
                    var getusername = column.split(";");
                   
                    Filter = GHVHS.DOM.create({ "Type": "div", "Class": "Filter", "Id": columns[i], "Style": "background-image: url(/img/view.png); text-align:center; border-radius: 0px; padding-top:0.5%;background-color:white;background-size: 25px; width: 55%; height: 100%;margin-bottom:0.3%;", "Parent": NameAndInput });
                   
                    for (var j = 0; j < getusername.length; j++) {
                        if (getusername != "") {
                            var FullName = "";
                            var username = getusername[j];

                            function getUsername(json, p) {
                                if (json["Items"]) {
                                    for (var q = 0; q < json["Items"].length; q++) {
                                        if (json["Items"][q]["Fields"].UserName == p[1]) {
                                            var FullName = json["Items"][q]["Fields"].FirstName + " " + json["Items"][q]["Fields"].LastName

                                            Pnp.drawSelectedUser(p[0], p[0], FullName, p[1], "Y");
                                        }

                                    }
                                }
                            }
                            var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getUsers?UserName=" + username, "Callback": getUsername, "CallbackParams": [Filter, username] });
                        }
                    }
                  
                } else if (data[columns[i]]) {
                    Filter = GHVHS.DOM.create({ "Type": "div", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/view.png); text-align:center; border-radius: 0px; padding-top:0.5%;background-color:white;background-size: 25px; width: 55%; height: 100%;margin-bottom:0.3%;", "Parent": NameAndInput });
                    Filter.innerHTML = data[columns[i]];
                    Filter.style.height = "auto";
                } else {
                    Filter = GHVHS.DOM.create({ "Type": "div", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/view.png); text-align:center; border-radius: 0px; padding-top:0.5%;background-color:white;background-size: 25px; width: 55%; height: 100%;margin-bottom:0.3%;", "Parent": NameAndInput });

                }
                Filter.style.border = "2px solid grey";
                Filter.style.minHeight = "20px";
            }
            if (data["PolicyFolder"] == "PolicyRelatedDocuments") {
                var File = data["FilePath"];
                File = File.replace(".docx", ".pdf");
                File = File.replace(".doc", ".pdf");
                var extension = File.split(".").pop();
                File = File.replace("."+extension, ".pdf");
            } else {
                var File = data["PDFFilePath"];
                var extension = File.split(".").pop();
                File = File.replace("." + extension, ".pdf");
            }
            var n = new Date();
            var space = n.getMinutes() + ":" + n.getSeconds();
            ColumnsView = GHVHS.DOM.create({ "Type": "div", "Class": "ColumnsView", "Id": "ColumnsView", "Parent": Elem });
            Copylinkbutton = GHVHS.DOM.create({ "Type": "div", "Class": "Copylinkbutton", "Id": "Copylinkbutton", "Parent": ColumnsView });
            Copylinkbutton.onclick =  function copyTextToClipboard(text) {
                if (!navigator.clipboard) {
                    fallbackCopyTextToClipboard("http://garnetinfo"+File + "?Dummy=" + space);
                    return;
                }
                navigator.clipboard.writeText("http://garnetinfo" + File + "?Dummy=" + space).then(function () {
                    alert('Async: Copying to clipboard was successful!');
                }, function (err) {
                        alert('Async: Could not copy text: ', err);
                });
                
            }
            Copylinkbutton2 = GHVHS.DOM.create({ "Type": "div", "Class": "Copylinkbutton2", "Id": "Copylinkbutton2", "Parent": ColumnsView });
            Copylinkbutton2.onclick = function () {
                var s = "http://garnetinfo" + File + "?Dummy=" + space;
                window.open(s, "_blank");
            }

            function fallbackCopyTextToClipboard(text) {
                var textArea = document.createElement("textarea");
                textArea.value = text;

                // Avoid scrolling to bottom
                textArea.style.top = "0";
                textArea.style.left = "0";
                textArea.style.position = "fixed";

                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();

                try {
                    var successful = document.execCommand('copy');
                    var msg = successful ? 'successful' : 'unsuccessful';
                    console.log('Fallback: Copying text command was ' + msg);
                } catch (err) {
                    console.error('Fallback: Oops, unable to copy', err);
                }

                document.body.removeChild(textArea);
            }
            ViewFile = GHVHS.DOM.create({ "Type": "iframe", "Class": "ViewFile", "Src": File + "?Dummy=" + space, "Id": "ViewFile", "Parent": ColumnsView });
          
           
        }
        var d = new Date();
        var n = d.getTime();
        if (id.indexOf("PRD") >= 0) {
            id = id.replace("PRD", "");
            // call to get single PDR if in URl
            GHVHS.DOM.send({ "URL": "/Pnp/getRelatedDocuments?Id=" + id + "&Dummy=" + n, "CallbackParams": [ViewOnly, "Y"], "Callback": DrawSingleItem });
        } else {
            // call to get single policiy data
            GHVHS.DOM.send({ "URL": "/Pnp/getPolicies?Id=" + id + "&Dummy=" + n, "CallbackParams": [ViewOnly,""], "Callback": DrawSingleItem });
        }
    },
    GlobalViewOnly: "",
    // draws slide menu
    drawSideMenu: function (Selected, Elem,  ViewOnly) {
        // backg is the black background when slide menu is slided out on screen
        var backg = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "sidebackground", "Style": "z-index:7000000000000000000000000009;display:none", "Parent": document.getElementById("canvas") });
        SideMenu = GHVHS.DOM.create({ "Type": "div", "Class": "SideMenu", "Id": "SideMenu", "Parent": document.getElementById("canvas") });
        
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
        if (Pnp.GlobalViewOnly) {
            if (Pnp.GlobalViewOnly == "Y") {
                ViewOnly = "View";
            }
        }
        // this if check is for if the user isn't logged in it will redirect to get to caCHE AND COOKIE UPDATED ON SERVER
        if (Pnp.Navigation == null) {
            window.location.href = window.location.href;
        }
        //loop nav data to know what links are avaiable to user and draw to side menu in UI
        Pnp.Navigation.push({ "Link": "/Pnp/Help", "Name": "Help" });
        for (var i = 0; i < Pnp.Navigation.length; i++) {
           
            SideLinks = GHVHS.DOM.create({ "Type": "a", "Class": "SideLinks", "Id": "SideLinks", "Parent": SideMenu });
            SideLinks.href = Pnp.Navigation[i]["Link"];
            SideLinks.innerHTML = Pnp.Navigation[i]["Name"];
            
        }
        // buttons on side menu to exapnd or close
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
            document.getElementById("filetree").style.height = "32%";
        }
        // if view only side menu is drawn with a bigger file tree 
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
        Pnp.DrawFileTree( ViewOnly);
       

    },
    AllFiles: [],
    GlobalPRD: [],
    GlobalArc:[],
    GlobalAP: [],
    // recursive loop to draw links in file free
    DrawFileTree: function (ViewOnly) {
        filetree = document.getElementById("filetree");
        policyfiles = GHVHS.DOM.create({ "Type": "div", "Class": "policyfiles",  "Id": "policyfiles", "Parent": filetree });
        var policies = ["ArchivePolicies", "DraftPolicies", "ApprovedPolicies"];
        if (ViewOnly) {
            policies = ["ApprovedPolicies"];
        }
        var columns = ["Category", "Department", "Location"];
        var labels = {
            "Category":Pnp.Categories,
            "Department":Pnp.Departments,
            "Location": Pnp.Locations
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
                    var singleFoldersD = GHVHS.DOM.create({ "Type": "a", "Class": "singleFolders","Content":data[k].Name, "Id": "","Href":"/PnP/" + policies[i] + "?" + columns[j] + "=" + data[k].Name, "Style": "margin-left:8%;",  "Parent": policyfilestempL });
                    singleFoldersD.id = policies[i] + "||" + columns[j] + "||" + data[k].Name;
                    if (columns[j] == "Department") {
                        singleFoldersD.href = "/PnP/" + policies[i] + "?" + columns[j] + "=" + data[k].Id;
                    } 

                    
                }
            }
        }
    },
    // draws the top bar on any PNP page in the application Elem is the parent to append to
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
                        /*var logOut = GHVHS.DOM.create({ "Type": "div", "Class": "logOut", "Content": "Log Out", "Id": "logOut", "Parent": TitlePnp });
                       
                        logOut.onclick = function () {
                            function reloadPage() {
                                window.location.href = window.location.href;
                            }
                            var d = new Date();
                            var n = d.getTime();
                            var temp = GHVHS.DOM.send({ "URL": "/PnP/logOut" + "?Dummy=" + n, "Callback": reloadPage, "CallbackParams": [] });
                        }*/
                        MasterRefesh.onclick = function () {
                            var d = new Date();
                            var n = d.getTime();
                            GHVHS.DOM.DrawSmallLoader2();
                            function reloadPage() {
                                window.location.href = window.location.href;
                            }
                            var temp = GHVHS.DOM.send({ "URL": "/PnP/MasterRefresh" + "?Dummy=" + n, "Callback": reloadPage, "CallbackParams": [] });
                           
                        }
                        var ReleaseNotes = GHVHS.DOM.create({ "Type": "a", "Href": "", "Style": "color:black;text-decoration:none;", "Class": "logOut", "Content": "Help", "Id": "", "Parent": TitlePnp });
                        ReleaseNotes.onclick = function () {
                            GHVHS.DOM.drawslideUpIframe("http://garnetinfo/Files/PolicyAndProcedures/Application%20Help/");
                        }
                        var ReleaseNotes = GHVHS.DOM.create({ "Type": "a", "Href": "/img/POLICY TEMPLATE FINAL 5.21.2020.DOCX", "Style": "color:black;text-decoration:none;", "Class": "logOut", "Content": "Policy Template", "Id": "", "Parent": TitlePnp });
                    } else {

                        arrow.style.transform = "rotate(180deg)";
                        theDrop.parentElement.removeChild(theDrop);
                    }
                }
            
        } else {
            TitlePnp.style.width = "90%";
        }
    },
    // draws home page to screen and takes params from url (SearchByList, SearchValue, ViewOnly)
    Home: function (Username, AllFiles, SearchByList, SearchValue, ViewOnly) {
        if (SearchByList.indexOf("/")>=0) {
            var splited = SearchByList.split("/");
            SearchByList = splited[0];
            if (splited[1]) {
                if (splited[1] == "View") {
                    ViewOnly = "View";
                }
            }
        }
        var HomeCategory = "";
        var HomeDepo = "";
        var Homelocation = "";
        if (SearchByList.indexOf("?") >= 0) {
            var splited = SearchByList.split("?");
            SearchByList = splited[0];
            getOlderValues = splited[1].toLowerCase();
            if (getOlderValues.indexOf("category") >= 0){
                var getSplit = splited[1].split("=");
                HomeCategory = getSplit[1];
            }else if (getOlderValues.indexOf("department") >= 0){
                var getSplit = splited[1].split("=");
                HomeDepo = getSplit[1];
            } else if (getOlderValues.indexOf("location") >= 0) {
                var getSplit = splited[1].split("=");
                Homelocation = getSplit[1];
            }
        }
        // again master element to append child elements to in UI
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Style": "padding-bottom:2%;", "Parent": document.getElementById("MainContent") });
        // draw the side menu
        Pnp.drawSideMenu("Home", Elem,  ViewOnly);
        if (!SearchByList) {
            Pnp.DrawTopBar(Username, Elem, "Home", ViewOnly);
        } else {
            // Home page is used as a global search on any page like draftpolicies it will add the name to the title and only search by that list 
            var value  = SearchByList +" Search"; 
            Pnp.DrawTopBar(Username, Elem, value, "Y", ViewOnly);
            setTimeout(function () {
                document.getElementById("barTop").style.marginTop = "0.0%";
                document.getElementById("menu").style.display = "none";
            }, 15);
            
        }
        // three columns are draws all elements on this page in the content element are in Column 2 
        DrawColumns1 = GHVHS.DOM.create({ "Type": "div", "Class": "DrawColumns1", "Id": "DrawColumns1", "Parent": Elem });

        DrawColumns2 = GHVHS.DOM.create({ "Type": "div", "Class": "DrawColumns2", "Id": "DrawColumns2", "Parent": Elem });
        LandingImage = GHVHS.DOM.create({ "Type": "img", "Src": "/img/PnP.jpg", "Style": "width:70%;margin-left:15%;", "Class": "LandingImage", "Id": "LandingImage", "Parent": DrawColumns2 });

        var FilterContainer = GHVHS.DOM.create({ "Type": "div", "Class": "FilterContainer", "Id": "FilterContainer", "Parent": DrawColumns2 });
        var FilterLabel = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedLabel","Style": "width:70%;margin-left:15%;", "Content": "Search", "Id": "SelectedLabel", "Parent": FilterContainer });
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "SearchFilter", "Id": "Filter", "Parent": FilterContainer });
        Filter.setAttribute("autocomplete", "Off");
        
        var SelectedContainer = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedContainer", "Style": "margin-left:15%;", "Id": "SelectedContainer", "Parent": DrawColumns2 });
        var SelectedLabel = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedLabel", "Content": "Departments", "Id": "SelectedLabel", "Parent": SelectedContainer });
        var DepartmentsSelected = GHVHS.DOM.create({ "Type": "select", "Class": "DepartmentsSelected", "Id": "DepartmentsSelected", "Parent": SelectedContainer });
        var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Content": " - ", "Parent": DepartmentsSelected });
        var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Content": " My Departments ", "Parent": DepartmentsSelected });
        var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Content": " All ", "Parent": DepartmentsSelected });
        for (var i = 0; i < Pnp.Departments.length; i++){
            var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Parent": DepartmentsSelected });
            options.innerHTML = Pnp.Departments[i].Name;

        }
        if (!SearchByList) {
            DepartmentsSelected.value = "My Departments";
            SearchByList = "Approved";
        }
        

        var SelectedContainer = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedContainer", "Id": "SelectedContainer", "Parent": DrawColumns2 });
        var SelectedLabel = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedLabel", "Content": "Categories", "Id": "SelectedLabel", "Parent": SelectedContainer });
        var CategoriesSelected = GHVHS.DOM.create({ "Type": "select", "Class": "DepartmentsSelected", "Id": "CategoriesSelected", "Parent": SelectedContainer });
        var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Content": " - ", "Parent": CategoriesSelected });
        var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Content": " All ", "Parent": CategoriesSelected });
        for (var i = 0; i < Pnp.Categories.length; i++) {
            var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Parent": CategoriesSelected });
            options.innerHTML = Pnp.Categories[i].Name;
        }

        var SelectedContainer = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedContainer", "Id": "SelectedContainer", "Parent": DrawColumns2 });
        var SelectedLabel = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedLabel", "Content": "Location", "Id": "SelectedLabel", "Parent": SelectedContainer });
        var locationsSelected = GHVHS.DOM.create({ "Type": "select", "Class": "DepartmentsSelected", "Id": "locationsSelected", "Parent": SelectedContainer });
        var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "","Content":" - ", "Parent": locationsSelected });
        var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Content": " All ", "Parent": locationsSelected });
        for (var i = 0; i < Pnp.Locations.length; i++) {
            var options = GHVHS.DOM.create({ "Type": "option", "Class": "optionsDrop", "Id": "", "Parent": locationsSelected });
            options.innerHTML = Pnp.Locations[i].Name;
        }
       
        if (Homelocation != ""){
            locationsSelected.value = Homelocation;
        }
        if (HomeDepo != "") {
            DepartmentsSelected.value = HomeDepo;
        }
        if (HomeCategory != "") {
            CategoriesSelected.value = HomeCategory;
        }
        SearchBox = GHVHS.DOM.create({ "Type": "div", "Class": "PnpSearchButton", "Id": "SearchButton","Style":"margin-left:15%;",  "Content": "Search", "Parent": DrawColumns2 });
        SearchBoxClear = GHVHS.DOM.create({ "Type": "div", "Class": "PnpSearchButton", "Id": "SearchBoxClear", "Content": "Clear Search", "Parent": DrawColumns2 });
        // if search value passed in put in search box on url and click the button to simulate a search
        if (SearchValue) {
            Filter.value = SearchValue;
            setTimeout(function () { SearchBox.click(); }, 100);
            
        }
        // logic for search on the page
        SearchBox.onclick = function () {


            var departments = document.getElementById("DepartmentsSelected");
            var depoValue = departments.value;
            var Categories = document.getElementById("CategoriesSelected");
            var catValue = Categories.value;
            var Locations = document.getElementById("locationsSelected");
            var locoValue = Locations.value;
            var filter = document.getElementById("Filter");
            var filterValue = filter.value;
            var passed = "N";

            if (depoValue != "-" || catValue != "-" || locoValue != "-" || filterValue != "") {
                passed = "Y";
            }


            // animate picture to slide up and shrink in height
            var landingImg = document.getElementById("LandingImage");
            if (landingImg.style.display != "none" && passed == "Y") {
                landingImg.style.height = "1px";
                setTimeout(function () {
                    landingImg.style.display = "none";
                   
                }, 400);
                // draws Results container and labels 
                var SearchInfo = GHVHS.DOM.create({ "Type": "div", "Class": "SearchInfo", "Id": "SearchInfo", "Parent": DrawColumns2 });
                var SearchResults = GHVHS.DOM.create({ "Type": "div", "Class": "SearchResults", "Id": "SearchResults", "Parent": DrawColumns2 });
                SearchResults.style.top = "35%";
                SearchResults.style.height = "80%";
                if (document.getElementById("Footer")) {
                    document.getElementById("Footer").style.marginTop = "18%";
                }
                // loading gif icon 
                FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": " transition: height 1s ease-in-out;Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);z-index: 90000000000;", "Parent": SearchResults });

                FaxTableLoader.style.width = SearchResults.offsetWidth + "px";
                FaxTableLoader.style.height = "75%";
                // set time out for animate to take effect 
                setTimeout(function () {

                    var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
                    SearchLoader.style.marginLeft = "45%";
                    // functions draw and calls ajax call to excute search
                    Pnp.SearchAll(SearchResults, filter, filterValue, SearchInfo, SearchByList, ViewOnly, depoValue, catValue, locoValue);
                    if (SearchValue) {
                        document.getElementById("SearchResults").style.height = "80%";
                    }
                }, 400);
                
            } else if (passed == "Y")  {
                // draws Results container and labels 
                var SearchInfo = document.getElementById("SearchInfo");
                var SearchResults = document.getElementById("SearchResults");
                FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": " transition: height 1s ease-in-out;Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);z-index: 90000000000;", "Parent": SearchResults });
                if (document.getElementById("Footer")) {
                    document.getElementById("Footer").style.marginTop = "18%";
                }
                FaxTableLoader.style.width = SearchResults.offsetWidth + "px";
                FaxTableLoader.style.height = "75%";
                var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
                SearchLoader.style.marginLeft = "45%";
                Pnp.SearchAll(SearchResults, filter, filterValue, SearchInfo, SearchByList, ViewOnly, depoValue, catValue, locoValue);
               
            }
        }
        // sets UI back to Ogrinal UI on page load
        SearchBoxClear.onclick = function () {
            var landingImg = document.getElementById("LandingImage");
            landingImg.style.display = "";
            setTimeout(function () {
                landingImg.style.height = "51%";
            }, 10);
            
            var filter = document.getElementById("Filter");
            filter.value = "";
            var departments = document.getElementById("DepartmentsSelected");
            if (departments.value != "My Departments") {
                departments.value = "-";
            }
            var Categories = document.getElementById("CategoriesSelected").value = "-";
            var Locations = document.getElementById("locationsSelected").value = "-";
            var filter = document.getElementById("Filter");
            var filterValue = filter.value;
            if (document.getElementById("Footer")) {
                document.getElementById("Footer").style.marginTop = "1.5%";
            }
            var SearchResults = document.getElementById("SearchResults");
            var SearchInfo = document.getElementById("SearchInfo");
            SearchResults.parentElement.removeChild(SearchResults);
            SearchInfo.parentElement.removeChild(SearchInfo);
        }
        DrawColumns1 = GHVHS.DOM.create({ "Type": "div", "Class": "DrawColumns1", "Id": "DrawColumns1", "Parent": Elem });
    },
    // SearchByList would be policy Folder in sql table ex) Draft,  SearchResults is element to append child to, filterValue is the actual search value
    SearchAll: function (SearchResults, filter, filterValue, SearchInfo, SearchByList, ViewOnly, department, category, location) {
        var searchLoader = document.getElementById("SearchLoader");
        if (!searchLoader) {
            FaxTableLoader = GHVHS.DOM.create({ "Type": "div", "Class": "FaxTableLoader", "Id": "FaxTableLoader", "Style": " transition: height 1s ease-in-out;Position: absolute;Background-Color:rgba(0, 0, 0, 0.8);z-index: 90000000000;", "Parent": SearchResults });

            FaxTableLoader.style.width = SearchResults.offsetWidth + "px";
            FaxTableLoader.style.height = "75%";
            var SearchLoader = GHVHS.DOM.create({ "Type": "img", "Class": "SearchLoader", "Id": "SearchLoader", "Src": "/img/searchLoader.gif", "Parent": FaxTableLoader });
            SearchLoader.style.marginLeft = "45%";
        }
        // ajax calls at bottom of this function. this function is a call back from said ajax call
        function drawSearchResults(json, p) {
            var searchResulElem = p[0];
            var searchValue = p[1];
            var searchInfo = p[2];
            while (searchResulElem.firstChild) {
                searchResulElem.removeChild(searchResulElem.firstChild);
            }
            var count = 0;
            // loops through json data from search ajax call and draws element to searchResulElem
            for (var i = 0; i < json["Items"].length; i++) {
                var checkCount = 0;   
                count++;
                SingleResult = GHVHS.DOM.create({ "Type": "div", "Class": "SingleResult", "Id": "SingleResult", "Parent": searchResulElem });
                if (document.getElementById("canvas").offsetWidth < 1500){
                    SingleResult.style.height = "35%";
                }
                var id = json["Items"][i]["Fields"]["SharepointId"];
                SingleResultHeader = GHVHS.DOM.create({ "Type": "a", "Class": "SingleResultHeader", "Href": "/PnP/Policy/" + id, "Id": "SingleResultHeader", "Parent": SingleResult });
                if (ViewOnly) {
                    SingleResultHeader.href = "/PnP/Policy/" + json["Items"][i]["Fields"]["SharepointId"];
                }
                var name = json["Items"][i]["Fields"]["FileName"]
                var headeValue = name;
                if (headeValue.indexOf(searchValue) >= 0) {
                    var temp1 = headeValue;
                    temp1 = temp1.replace(searchValue, "<span style='background-color:yellow'>" + searchValue + "</span>");
                    SingleResultHeader.innerHTML = temp1;
                } else {
                    SingleResultHeader.innerHTML = headeValue + " ";
                }
                var checkLength = headeValue.split();
                if (checkLength > 70) {
                    reduceFontSize = "Y";
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
                    
                var columns = ["DocumentContents", "LastModified", "Modified By", "Author", "Category", "PolicyNumber", "Department", "Location", "Title", "Id", "Concurrer"];

                            
                // loops through columns to check for search match if so highlight text in yellow <span>            
                for (var j = 0; j < columns.length; j++) {
                    if (columns[j] == "DocumentContents") {
                        var temp = json["Items"][i]["Fields"][columns[j]];
                        if (json["Items"][i]["Fields"][columns[j]]) {
                            txtBody.innerHTML += temp + "<br>";
                            if (temp.length < 120) {
                                txtBody.style.height = "auto";
                                txtBody.style.minHeight = "0%";
                                SingleResultHeader.style.height = "auto";
                                SingleResultBody.style.height = "auto";
                                SingleResult.style.height = "auto";
                            }
                            if (json["Items"][i]["Fields"][columns[j]].indexOf(searchValue) >= 0) {
                                Pnp.highlight(searchValue, txtBody);
                            }
                        } else {
                            SingleResultHeader.style.height = "auto";
                            txtBody.style.height = "auto";
                            txtBody.style.minHeight = "0%";
                            SingleResultBody.style.height = "auto";
                            SingleResult.style.height = "auto";
                        }
                    
                    }else if (json["Items"][i]["Fields"][columns[j]]) {
                        SingleTextElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTextElem", "Id": "SingleTextElem", "Parent": SingleResultBody });

                        if (json["Items"][i]["Fields"][columns[j]].indexOf(searchValue) >= 0) {
                            var temp = json["Items"][i]["Fields"][columns[j]];
                            temp = temp.replace(searchValue, "<span style='background-color:yellow'>" + searchValue + "</span>");
                            SingleTextElem.innerHTML = temp;
                        } else {
                            if (columns[j] == "Department") {
                                var departmentName = "";
                                for (var q = 0; q < Pnp.Departments.length; q++) {
                                    if (Pnp.Departments[q].Id == json["Items"][i]["Fields"][columns[j]]) {
                                        departmentName = Pnp.Departments[q].Name;
                                    }
                                }
                                SingleTextElem.innerHTML = departmentName + " ";
                            } else {
                                SingleTextElem.innerHTML = json["Items"][i]["Fields"][columns[j]] + " ";
                            }
                        }
                    }
                }
            BodyFooter = GHVHS.DOM.create({ "Type": "div", "Class": "BodyFooter", "Id": "BodyFooter", "Parent": SingleResultBody });
            var footerValue = json["Items"][i]["Fields"]["LastModified"] + " - " + "http://garnetinfo/Pnp/Policy/" + json["Items"][i]["Fields"]["SharepointId"];
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
        // check if route is Concurrences and change to search all docs
        if (SearchByList == "Concurrences") {
            SearchByList = "";
        }
        //get All Params ready for ajax call
        if (department == "-") {
            department = "";
        } else if (department == "My Departments") {
            department = department;
        } else if (department != "") {
            var departmentId = "";
            for (var i = 0; i < Pnp.Departments.length; i++) {
                if (Pnp.Departments[i].Name.indexOf(department) >=0) {
                    departmentId = Pnp.Departments[i].Id;
                }
            }
            department = departmentId;
        }
        if (category == "-") {
            category = "";
        }else if (category == "All"){
            category = "";
        }   
        if (location == "-") {
            location = "";
        } else if (location == "All") {
            location = "";
        }

        // if no SearchByList then search all policies
        if (SearchByList) {
            SearchByList = SearchByList.replace("Policies", "");
            // format policy folder and see if search should be done for PDR or not
            if (SearchByList.toLowerCase() == "relateddocuments") {
                GHVHS.DOM.send({ "URL": "/Pnp/getRelatedDocuments?Search=" + filterValue + "&list=" + SearchByList + "&Dummy=" + n, "Callback": drawSearchResults, "CallbackParams": [SearchResults, filterValue, SearchInfo] });
            } else {
                GHVHS.DOM.send({ "URL": "/Pnp/getPolicies?Search=" + filterValue + "&list=" + SearchByList + "&Department=" + department + "&Category=" + category + "&Location=" + location + "&Dummy=" + n, "Callback": drawSearchResults, "CallbackParams": [SearchResults, filterValue, SearchInfo] });
            }
        } else {
            
                GHVHS.DOM.send({ "URL": "/Pnp/getPolicies?Search=" + filterValue +"&list=Approved&Department=" + department + "&Category=" + category + "&Location=" + location + "&Dummy=" + n, "Callback": drawSearchResults, "CallbackParams": [SearchResults, filterValue, SearchInfo] });
        }
        
    },
    // highlight function to check search match if so highlight text in yellow <span>
    highlight: function (text, element) {
        var innerHTML = element.innerHTML;
        var index = innerHTML.indexOf(text);
            if (index >= 0) { 
                innerHTML = innerHTML.substring(0, index) + "<span style='background-color:yellow'>" + innerHTML.substring(index, index + text.length) + "</span>" + innerHTML.substring(index + text.length);
                element.innerHTML = innerHTML;
            }
    },
    // not used in application any more but was used when Pnp relied on sharepoint 
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
    // all on these functions are called from Razor Views on server to draw the according page 
    ApprovedPolicies: function (Username, FullName, ViewOnly, Department, Category, Location) {
        var Columns = ["img", "Title", "PolicyNumber", "FileName", "LastModified", "Editor", "Category", "Department", "Location"];
        var Title = "Approved Policies";
        var route = "ApprovedPolicies";
        Pnp.Documents(Username, FullName, Title, route, Columns, ViewOnly, Department, Category, Location);
    },
    DraftPolicies: function (Username, FullName, Department, Category, Location) {
        var Columns = ["img", "Title", "PolicyNumber",  "Author", "LastModified", "Editor", "Category", "Department", "Location","Approvers", "Concurrers"];
        var Title = "Draft Policies";
        var route = "DraftPolicies";
        Pnp.Documents(Username, FullName, Title, route, Columns,"", Department, Category, Location);
    },
    ArchivePolicies: function (Username, FullName, Department, Category, Location) {
        var Columns = ["img", "Title", "FileName", "LastModified", "Editor", "Category", "Department", "Location"];
        var Title = "Archive Policies";
        var route = "ArchivePolicies";
        Pnp.Documents(Username, FullName, Title, route, Columns,"", Department, Category, Location);
    },
    PoliciesRelateddocuments: function (Username, FullName,  ViewOnly) {
        var Columns = ["img", "Title", "FileName", "LastModified", "Editor" ];
        var Title = "Policies Related documents";
        var route = "PoliciesRelateddocuments";
        Pnp.Documents(Username, FullName, Title, route, Columns,  ViewOnly);
    },
    // page has three sub views
    Concurences: function (Username, FullName, Approved) {
        if (window.location.href.toLowerCase().indexOf("sqldev") >= 0) {
            window.location.href = "http://garnetinfo/Pnp/Concurrences";
        }
        var Columns = ["Title", "Status", "PercentComplete", "Assigned To", "Author", "CreatedOn", "StartDate", "DueDate", "View Discussion", "View Policy", "AllConcurrers", "Approve", "Reject"];
        var Title = "My Concurences";
        var route = "Concurences";
        if (Approved) {

            if (Approved == "Approval"){
                var Columns = ["Title", "Status", "PercentComplete", "Assigned To", "View Approval Status", "View Discussion", "View Policy", "Final Approve", "Rejection"];
                var Title = "My Approvals";
                var route = "Concurences";
            }else{
                var Columns = ["Title", "Status", "PercentComplete", "Assigned To", "Author", "CreatedOn", "StartDate", "DueDate", "View Discussion", "View Policy", "AllConcurrers"];
                var Title = "My Completed Concurences";
                var route = "Concurences";
            }
        }
        Concurence.DrawConcurs(Username, FullName, Title, route, Columns,  "", Approved);
    },
    // draws the the search buttons on each page when a user types in search bar
    searchPage: function (list, search, ViewOnly) {
        var searchButton = document.getElementById("searchButtonMain");
        var searchButtonC = document.getElementById("searchButtonClear");
        if (!searchButton ) {
            if (search.value != "") {
                // draw search and clear search buttons 
                searchButtonMain = GHVHS.DOM.create({ "Type": "div", "Class": "searchButtonMain", "Id": "searchButtonMain", "Content": "Search", "Parent": document.getElementById("MainContent") });
                searchButtonClear = GHVHS.DOM.create({ "Type": "div", "Class": "searchButtonMain", "Id": "searchButtonClear", "Content": "Clear Search", "Parent": document.getElementById("MainContent") });
                searchButtonMain.style.top = (search.offsetTop + search.offsetHeight + 5) + "px";
                searchButtonMain.style.height = (search.offsetHeight - 19) + "px";
                searchButtonMain.style.left = (search.offsetLeft + (search.offsetWidth * 0.08)) + "px";
                searchButtonClear.style.top = (search.offsetTop + search.offsetHeight + 5) + "px";
                searchButtonClear.style.height = (search.offsetHeight - 19) + "px";
                searchButtonClear.style.width = search.offsetWidth - (search.offsetWidth * 0.6) + "px"
                document.getElementById("FilesWidget").style.marginTop = (search.offsetHeight -20) + "px";
                document.getElementById("pageingContainer").style.marginTop = (search.offsetHeight + 30) + "px";
                searchButtonMain.style.width = search.offsetWidth - (search.offsetWidth * 0.6) + "px"
                searchButtonClear.style.left = (search.offsetLeft + (search.offsetWidth * 0.12) + searchButtonMain.offsetWidth) + "px";
                searchButtonMain.style.borderRadius = "10px";
                searchButtonClear.style.borderRadius = "10px";
                searchButtonMain.onclick = function () {
                    var url = window.location.href.toLowerCase().split("pnp/");
                    var list = url[1];
                    if (list.indexOf("?") >= 0){
                        var tempSplit = list.split("?");
                        list = tempSplit[0];
                        if (list.indexOf("policies") >= 0) {
                            list = list.replace("policies", "");
                        }
                    } else {
                        if (list.indexOf("policies") >= 0) {
                            list = list.replace("policies", "");
                        }
                    }
                    var linktoIframe = "/PnP/Home?List=" + list + "&SearchValue=" + search.value;
                    if (ViewOnly) {
                        linktoIframe = "/PnP/Home/View?List=" + list + "&SearchValue=" + search.value;
                    }
                    GHVHS.DOM.GlobalNumberFax = this.id;
                    // slides up the Iframe slide up to page and pass it url which is the /Pnp/Home......some Policy folder 
                    GHVHS.DOM.drawslideUpIframe(linktoIframe, "", "");
                }
                searchButtonClear.onclick = function () {
                    search.value = "";
                    search.click();
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
                document.getElementById("pageingContainer").style.marginTop = "0.3%";
                
                // removes the buttons if no value from UI 
                setTimeout(function () {
                    searchButton.parentElement.removeChild(searchButton);
                    searchButtonC.parentElement.removeChild(searchButtonC);
                }, 350);
            }
        }
    },
    // not used anymore but kept in for in case needed
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
    Verified: "",

    GobalUsers: [],
    // generic function to draw document table view across all policy folders. 
    Documents: function (Username, FullName, Title, Route, Columns, ViewOnly, Department, Category, Location) {
        var searchFilter = ""
        // check for Department, Category, Location from url to page, if present adds to ajax call below 
        if (Department) {
            searchFilter = "&SearchBy=DepartmentID&Search=" + Department;
            var departmentName = "";
           
            for (var f = 0; f < Pnp.Departments.length; f++) {
                if (Pnp.Departments[f].Id == Department) {
                    departmentName = Pnp.Departments[f].Name;
                }
            }
            // checks if the department in the url is the user's department if not user doesn't get access to edit buttons 
            if (Pnp.UserDepartment) {
                var departmentNameTemp = "";
                    for (var f = 0; f < Pnp.Departments.length; f++) {
                        if (Pnp.Departments[f].Id == Pnp.UserDepartment) {
                            departmentNameTemp = Pnp.Departments[f].Name;
                        }
                    }
                    if (departmentNameTemp != departmentName) {
                        
                     }
            } else {
                ViewOnly = "View";
                Pnp.GlobalViewOnly = "View";
            }
            Title = departmentName + " " + Title;
        } else if (Category) {
            searchFilter = "&SearchBy=Category&Search=" + Category;
            Title = Category + " " + Title;
        } else if (Location) {
            searchFilter = "&SearchBy=Location&Search=" + Location;
            Title = Location + " " + Title;
        } else {
            // if no url params then filter ajax call by uers's departments 
            if (Pnp.UserDepartment) {
                if (Pnp.UserDepartment.indexOf("|") >= 0) {
                    var departments = Pnp.UserDepartment.split("|");
                    
                    for (var v = 0; v < departments.length; v++) {
                        if (searchFilter != ""){
                            searchFilter += "," + departments[v];
                        }else{
                            searchFilter +=  departments[v];
                        }
                    }
                    searchFilter = "&SearchBy=DepartmentID&Search="+searchFilter;
                } else {
                    
                    searchFilter = "&SearchBy=DepartmentID&Search=" + Pnp.UserDepartment;
                }
                searchFilter += "&Author=" + Username;
            }
        }
        if (!Pnp.UserDepartment) {
            ViewOnly = "View";
            Pnp.GlobalViewOnly = "View";
        }
        // add to remove edit icons to page's columns 
        if (!ViewOnly) {
            if (Route != "PoliciesRelateddocuments" && Route != "ArchivePolicies") {
                Columns.push("Checked Out By", "Is Checked Out", "View", "Check Out", "Edit", "Archive");
            } else {
                if (Route == "ArchivePolicies") {

                    Columns.push( "Add To Draft", "View", "Delete");
                } else {
                    Columns.push("Checked Out By", "Is Checked Out", "View", "Delete");
                }
            }
        } else {
            Columns.push("Checked Out By", "Is Checked Out", "View");
        }
        // set up of generic functions to draw side menu, grey top bar, search input field...etc
        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu(Title, Elem, ViewOnly);
        Pnp.FullName = FullName;
        Pnp.GobalColumns = Columns;
        Pnp.DrawTopBar(Username, Elem, Title, ViewOnly);
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "transition: margin-left .25s,height .25s;text-align:center;margin-left:26%;height:5%;Width:45%;margin-bottom:0px;margin-top:1%;", "Parent": Elem });
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
        var pageingContainer = GHVHS.DOM.create({ "Type": "div", "Id": "pageingContainer", "Class": "pageingContainer", "Content": "", "Parent": Elem });
        var PaginationArrow1 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackDrop.png", "Class": "PaginationArrow11", "Id": "PaginationArrow1", "Parent": pageingContainer });
        PaginationArrow1.onclick = function () {
            if (document.getElementById("p" + (Number(Pnp.CurrentPageNumber) - 1)).click());
        }
        if (!Pnp.CurrentPageNumber) {
            Pnp.CurrentPageNumber = 1;
        }
        for (var i = 1; i < 16; i++) {
            var SinglePageNumber = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePageNumber1", "Id": "SinglePageNumber", "Parent": pageingContainer });
            SinglePageNumber.innerHTML = i + "";
            if (Pnp.CurrentPageNumber == i) {
                SinglePageNumber.style.color = "blue";
                SinglePageNumber.style.backgroundColor = "grey";
                SinglePageNumber.style.borderRadius = "30%";
            }
            SinglePageNumber.id = "p" + i;
            SinglePageNumber.onclick = function () {
                var url = window.location.href.toLowerCase();
                if (url.indexOf("page=") >=0) {
                   url = url.replace("page=" + Pnp.CurrentPageNumber, "page=" + this.innerHTML)
                } else {
                    if (url.indexOf("?") >= 0) {
                        url += "&page=" + this.innerHTML;
                    } else {
                        url += "?page=" + this.innerHTML;
                    }
                }
                window.location.href = url;
            }
        }
        var PaginationArrow2 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackDrop.png", "Class": "PaginationArrow21", "Id": "PaginationArrow2", "Parent": pageingContainer });
        PaginationArrow2.onclick = function () {
            document.getElementById("p" + (Number(Pnp.CurrentPageNumber) + 1)).click();
        }





        // EventWidget is table div for UI master elem for all policies 
        var EventWidget = GHVHS.DOM.create({ "Type": "div", "Class": "FilesWidget", "Style": "margin-left:1%;Width:98%;transition: margin-top .25s;box-shadow:2px 2px 4px grey; height:80%;", "Id": "FilesWidget", "Parent": Elem });
        
        var EventHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FilesHeader", "Id": "FilesHeader", "Style": "height:auto;", "Parent": EventWidget });
        var EventLable1 = GHVHS.DOM.create({ "Type": "div", "Id": "EventLable", "Class": "EventLable", "Content": "All Documents : Page " + Pnp.CurrentPageNumber, "Parent": EventHeader });
        
       
        // to add the upload button -  label "Click Here To Upload A New Policy" to UI 
        if (Route == "DraftPolicies") {
            Pnp.drawAddButtonAndLabel(EventHeader);
        } else {
            Pnp.drawAddButtonAndLabel(EventHeader);
            document.getElementById("AddNewContainer").style.display = "none";
        }
        // elems for field labels and for policies
        var EventBody = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "FilesBody", "Style": "height:auto;overflow:auto;", "Parent": EventWidget });
        var EventBody2 = GHVHS.DOM.create({ "Type": "div", "Class": "FilesBody", "Id": "FilesBody2", "Style": "overflow:auto;", "Parent": EventWidget });
        if (ViewOnly) {
            document.getElementById("AddNewContainer").className = "hide";
        }
        // SingleTableElem  name for ssingle row in EventWidget element in UI 
        SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleDocRow", "Style": "padding-top:0px; padding-bottom:0px", "Id": "PolicyHeader", "Parent": EventBody });
        // loop cloumn names and add to SingleTableElem
        for (var i = 0; i < Columns.length; i++) {
            if (Columns[i] == "img") {
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "imged", "Style": "height:5%;width:5%;border:none;", "Parent": SingleTableElem });
                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "ViewImg", "Src": "/img/docPNP.png", "Style": "Height:30px;margin-top:3%;", "Parent": DocStat });
                DocStat.style.paddingTop ="15px";
                DocStat.style.paddingBottom = "15px";
            }else {
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Id": "status", "Style": "height:6%;border:none;", "Parent": SingleTableElem });
                // resize logic for single fields appened to SingleTableElem element depending on Page
                if (Columns[i] == "View" || Columns[i] == "Check Out" || Columns[i] == "Is Checked Out" || Columns[i] == "Edit" || Columns[i] == "Archive"|| Columns[i] == "Delete" ) {
                    if (ViewOnly) {
                        DocStat.style.width = "6.5%";
                    } else {
                        if (Route == "PoliciesRelateddocuments") {
                            DocStat.style.width = "5.4%";
                        } else if (Route == "ApprovedPolicies") {
                            DocStat.style.width = "4%";
                        } else{
                            DocStat.style.width = "4.5%";
                        }
                    }
                } else {
                    if (!ViewOnly) {
                        if (Route == "PoliciesRelateddocuments") {
                            DocStat.style.width = (108 / (Columns.length - 2)) + "%";
                            DocStat.style.minWidth = (108 / (Columns.length - 2)) + "%";
                           
                        }else if ( Route == "ArchivePolicies"){
                            DocStat.style.width = (95/ (Columns.length - 2)) + "%";
                            DocStat.style.minWidth = (95 / (Columns.length - 2)) + "%";
                        }else {
                            DocStat.style.width = (79 / (Columns.length - 5)) + "%";
                            DocStat.style.minWidth = (70 / (Columns.length - 5)) + "%";
                        }
                    } else {
                        DocStat.style.width = (82 / (Columns.length - 3)) + "%";
                    }
                    
                }
                DocStat.parentElement.parentElement.parentElement.onmouseout = function (e) {
                    if (e.target.className != "status" && e.target.className != "DropNav" && e.target.className != "DropDown") {
                        var drops = this.querySelectorAll(".DropDown");
                        for (var i = 0; i < drops.length; i++) {
                            drops[i].parentElement.removeChild(drops[i]);
                        }
                    }
                    if (e.target.className != "hoverOver" && e.target.className != "SingleDataField ActionText" && e.target.className != "status") {
                        var drops = this.querySelectorAll(".hoverOver");
                        for (var i = 0; i < drops.length; i++) {
                            drops[i].parentElement.removeChild(drops[i]);
                        }
                    }

                }
                DocStat.innerHTML = Columns[i];
                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "Rotateblack", "Src": "/img/blackDrop.png", "Style": "Height:0px;transition:transform 0.2s ease;transform:rotate(180deg);", "Parent": DocStat });
                if (Pnp.GlobalOrder.indexOf(Columns[i]) >= 0){
                    DocStat.style.backgroundColor = "#5DADE2";
                    var getLowered = Pnp.GlobalOrder.toLowerCase();
                    if (getLowered.indexOf("asc") >= 0) {
                        lodingImg.style.height = "10px";
                    } else {
                        lodingImg.style.height = "10px";
                        lodingImg.style.transform = "rotate(0deg)";
                    }
                }
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
                DocStat.onmouseover = function () {

                    this.style.backgroundColor = "#5DADE2";

                }
                DocStat.onmouseout = function () {
                    this.style.backgroundColor = "";

                }
                if (Columns[i] == "View" || Columns[i] == "Check Out" || Columns[i] == "Is Checked Out" || Columns[i] == "Edit" || Columns[i] == "Archive" || Columns[i] == "Delete") {

                } else {
                    DocStat.onclick = function () {
                        this.style.backgroundColor = "#5DADE2";
                        var drops = this.parentElement.querySelectorAll(".DropDown");
                        for (var i = 0; i < drops.length; i++) {
                            drops[i].parentElement.removeChild(drops[i]);
                        }
                        var url = window.location.href.toLowerCase();
                        if (url.indexOf("?") >= 0) {
                            var splitTemp = url.split("?");
                            url = splitTemp[0];
                        }
                        url += "?Page=" + Pnp.CurrentPageNumber;
                        var OrderType = "Asc";
                        var Order = this.innerText;
                        this.id = Order;
                        var getArrow = this.querySelector(".CArrowEdit");
                        if (getArrow) {
                            if (getArrow.style.transform == "rotate(180deg)") {
                                getArrow.style.transform = "rotate(0deg)";
                            } else {
                                getArrow.style.transform = "rotate(180deg)";
                            }
                        }
                        var DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown", "Id": this.id + "Drop", "Parent": this.parentElement });
                        DropDown.style.width = (this.offsetWidth - 2) + "px";
                        DropDown.style.zIndex = "2000000";
                        DropDown.style.position = "absolute";
                        DropDown.style.left = this.offsetLeft + "px";
                        DropDown.style.backgroundColor = "white";
                        DropDown.style.boxShadow = "0.5px 0.5px 3px grey";
                        DropDown.style.borderRadius = "5px";
                        var options = [{ "Name": "Ascending", "Link": url + "&order=" + Order + " " + OrderType }, { "Name": "Descending", "Link": url + "&order=" + Order + " " + "Desc" }]
                        for (var i = 0; i < options.length; i++) {
                            var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "DropNav", "Id": options[i]["Name"], "Style": "margin-left:0px; text-align:center; color:black;", "Href": options[i]["Link"], "Parent": DropDown });
                            SingleOption.innerHTML = options[i]["Name"];
                            SingleOption.onmouseover = function () {
                                this.style.backgroundColor = "#5DADE2";

                            }
                            SingleOption.onmouseout = function () {
                                this.style.backgroundColor = "";

                            }

                        }
                        DropDown.style.height = (SingleOption.offsetHeight * 3) + "px";
                        DropDown.style.width = (SingleOption.offsetWidth) + "px";

                        //GHVHS.DOM.CreateDropDown({ "Element": this.id, "Options":options})

                        // window.location.href = url;
                    }
                }
            }
           
            
        }
        var d = new Date();
        var n = d.getTime();
            // draw loader to screen and call ajax call 
            GHVHS.DOM.DrawSmallLoader2();
            var getList = "";
            if (Route == "ApprovedPolicies") {
                
                getList = "Approved";
            } else if (Route == "DraftPolicies") {
                getList = "Draft";
            } else if (Route == "PoliciesRelateddocuments") {
                
            } else if (Route == "ArchivePolicies") {
                getList = "Archive";
            }
            if (Pnp.CurrentPageNumber) {
                n += "&Page=" + Pnp.CurrentPageNumber;
            } else {
                n += "&Page=1";
            }
            if (Pnp.GlobalOrder) {
                n += "&order=" + Pnp.GlobalOrder;
            }
            // ajax call to get data
            if (Route != "PoliciesRelateddocuments") {
               
                var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getPolicies?list=" + getList + searchFilter + "&Dummy=" + n, "Callback": Pnp.DrawDocuments, "CallbackParams": [EventBody2, Columns, Route, ViewOnly] });
            } else {
                var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getRelatedDocuments?Dummy=" + n, "Callback": Pnp.DrawDocuments, "CallbackParams": [EventBody2, Columns, Route, ViewOnly] });
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
    GlobalOrder:"",
    GlobalTempObject: [],
    GlobalDocuments: [],
    NoAcessToDoc:"",
    GlobalDraftPolicies: [],
    // draw all policies to page 
    DrawDocuments: function (json, p) {
        broswer = GHVHS.DOM.getBrowserType();
        // remove loader from screen 
        var loader = document.getElementById("FaxTableLoader");
        if (loader) {
            loader.parentElement.removeChild(loader);
        }
        var Columns = p[1];
        var route = p[2];
        var ViewOnly = p[3];
        console.log(json);
        if (json["Items"].length < 7) {
            var getEvent = document.getElementById("FilesWidget").style.height = "auto";
            var getcolumns = document.getElementById("FilesBody");
            var getFilterHolder = document.getElementById("FilesBody2").style.height = "auto";
        }
        if (json["Items"].length > 0) {
            Pnp.GlobalDocuments = json["Items"];
            for (var i = 0; i < json["Items"].length; i++) {
                if (json["Items"][i]["Fields"]){
                    var data = json["Items"][i]["Fields"];
                    Pnp.NoAcessToDoc = "";
                    if (!Pnp.Verified) {
                        var getDapartmentID = "";
                        for (var q = 0; q < Pnp.Departments.length; q++) {
                            if (data["Department"] == Pnp.Departments[q].Name) {
                                getDapartmentID = Pnp.Departments[q].Id;
                            }
                        }
                        if (Pnp.UserDepartment.indexOf(getDapartmentID) < 0) {
                            Pnp.NoAcessToDoc = "Y";
                        }
                        if (Pnp.UserName == data["Author"]) {
                            Pnp.NoAcessToDoc = "";
                        }

                   }
                SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Style": "animation:0.4s slide-Down;padding-top:0px;padding-bottom:0px;", "Id": data["SharepointId"] + "", "Parent": p[0] });
                if (i % 2 == 0){
                    SingleTableElem.className += " OffsetRow";
                }
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Id": "ID", "Content": data["Id"], "Parent": SingleTableElem });
                var DocStat = GHVHS.DOM.create({ "Type": "div", "Class": "hide2","Style":"display:none;", "Id": "AllApprovers", "Content": data["EditorId"], "Parent": SingleTableElem });
                SingleTableElem.style.height = "auto";
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
                                var linktoIframe = "/PnP/Policy/" + thisId;
                                if (route == "PoliciesRelateddocuments") {
                                    var linktoIframe = "/PnP/Policy/PRD"+ thisId;
                                }
                                if (ViewOnly) {
                                    var linktoIframe = "/PnP/Policy/" + thisId;
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
                        var Type = data["FileName"];
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
                        if (Columns[j] == "Modified By") {
                            var dataSingle = data["ModifiedBy"];
                            var splited = dataSingle.split("\\");
                            DocStat.innerHTML += splited[1];
                        } else if (Columns[j] == "Due Time") {
                            var dataSingle = data["DueTime"];

                            DocStat.innerHTML += dataSingle;
                        } else if (Columns[j] == "Concurrer") {
                            var dataSingle = data["Concurrers"];
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
                            if (!Pnp.NoAcessToDoc) {
                                DocStat.id = data["Checked Out"];
                                var checkout = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "checkout", "Src": "/img/checkout.png", "Style": "Height:30px;", "Parent": DocStat });
                                checkout.onclick = function (e) {
                                    var parent = this.parentElement.parentElement;
                                    Pnp.checkOutDoc(parent);
                                }
                            } else {
                                DocStat.innerHTML = "No Access";
                            }
                        } else if (Columns[j] == "View") {
                            DocStat.id = Columns[j];
                            DocStat.id = "View";
                            var ViewImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "http://sharepoint" + data["FileRef"], "Src": "/img/View.png", "Style": "Height:30px;", "Parent": DocStat });
                            ViewImg.onclick = function () {
                                this.parentElement.click();
                            }
                        } else if (Columns[j] == "Concurrers") { 
                            DocStat.id = Columns[j];
                            DocStat.className = "SingleDataField ActionText"
                            var dataSingle = data["Concurrers"];
                            if (dataSingle.indexOf(";") >= 0) {
                                for (var q = 0; q < dataSingle.indexOf(";") ; q++) {
                                    dataSingle = dataSingle.replace(";", "<br>");
                                }
                                DocStat.innerHTML = dataSingle;
                            } else {
                                DocStat.innerHTML = dataSingle;
                            }
                            DocStat.id = data["FileName"] + "||"+data["SharepointId"];
                                DocStat.onclick = function (e) {
                                    var dataToUse = this.id.split("||");
                                    var parent = this.parentElement.parentElement;
                                    Pnp.SlideUpConcurrerenceStatus(parent, dataToUse[0], dataToUse[1]);
                                }
                                DocStat.onmouseover = function () {
                                    var that = this.parentElement.querySelector(".hide");
                                    var hoverObj = document.getElementById("hoverOver" + that.innerText);
                                    if (!hoverObj) {
                                       var allhoverObjs =  document.getElementById("Elem").querySelectorAll(".hoverOver");
                                       for (var q = 0; q < allhoverObjs.length; q++) {
                                           allhoverObjs[q].parentElement.removeChild(allhoverObjs[q]);
                                       }
                                        var hoverOver = GHVHS.DOM.create({ "Type": "div", "Class": "hoverOver", "Id": "hoverOver" + that.innerText, "Parent": this });
                                        hoverOver.style.height = this.parentElement.offsetHeight + "px";
                                        hoverOver.style.width = this.offsetWidth + "px";
                                        hoverOver.style.top = (this.parentElement.offsetTop - this.parentElement.parentElement.scrollTop) + "px";
                                        hoverOver.style.left = this.offsetLeft + "px";
                                        var textElement = GHVHS.DOM.create({ "Type": "div", "Class": "textElement", "Id": "textElement", "Content": "Click to View Status", "Parent": hoverOver });

                                    }
                                }
                                SingleTableElem.onmouseover = function (e) {
                                    var that = this.querySelector(".hide");
                                    var hoverObj = document.getElementById("hoverOver" + that.innerText);
                                    if (hoverObj) {
                                        if (e.target.id != "hoverOver" + that.innerText && e.target.id != hoverObj.parentElement.id && e.target.id != "textElement") {
                                            hoverObj.style.height = "1px";
                                            hoverObj.parentElement.removeChild(hoverObj);
                                        }
                                    }
                                    var hoverObj = document.getElementById("hoverOver2" + that.innerText);
                                    if (hoverObj) {
                                        if (e.target.id != "hoverOver2" + that.innerText && e.target.id != hoverObj.parentElement.id && e.target.id != "textElement") {
                                            hoverObj.style.height = "1px";
                                            hoverObj.parentElement.removeChild(hoverObj);
                                        }
                                    }
                                
                                }
                        } else if (Columns[j] == "Approvers") {
                            DocStat.id = Columns[j];
                            DocStat.className = "SingleDataField ActionText"
                            var dataSingle = data["Approver"];
                            if (dataSingle.indexOf(";") >= 0) {
                                for (var q = 0; q < dataSingle.indexOf(";") ; q++) {
                                    dataSingle = dataSingle.replace(";", "<br>");
                                }
                                
                                DocStat.innerHTML = dataSingle;
                            } else {
                                
                                DocStat.innerHTML = dataSingle;
                            }
                            DocStat.id = data["FileName"] + "||" + data["SharepointId"];
                            DocStat.onclick = function (e) {
                                var dataToUse = this.id.split("||");
                                var parent = this.parentElement.parentElement;
                                Pnp.drawSlideUpApprovals(parent, dataToUse[0], dataToUse[1]);
                            }
                            DocStat.onmouseover = function () {
                                var that = this.parentElement.querySelector(".hide");
                                var hoverObj = document.getElementById("hoverOver2" + that.innerText);
                                if (!hoverObj) {
                                    var allhoverObjs = document.getElementById("Elem").querySelectorAll(".hoverOver");
                                    for (var q = 0; q < allhoverObjs.length; q++) {
                                        allhoverObjs[q].parentElement.removeChild(allhoverObjs[q]);
                                    }
                                    var hoverOver = GHVHS.DOM.create({ "Type": "div", "Class": "hoverOver", "Id": "hoverOver2" + that.innerText, "Parent": this });
                                    hoverOver.style.height = this.parentElement.offsetHeight + "px";
                                    hoverOver.style.width = this.offsetWidth + "px";
                                    hoverOver.style.top = (this.parentElement.offsetTop - this.parentElement.parentElement.scrollTop) + "px";
                                    hoverOver.style.left = this.offsetLeft + "px";
                                    var textElement = GHVHS.DOM.create({ "Type": "div", "Class": "textElement", "Id": "textElement", "Content": "Click to View Status", "Parent": hoverOver });

                                }
                            }
                            SingleTableElem.onmouseover = function (e) {
                                var that = this.querySelector(".hide");
                                var hoverObj = document.getElementById("hoverOver2" + that.innerText);
                                if (hoverObj) {
                                    if (e.target.id != "hoverOver2" + that.innerText && e.target.id != hoverObj.parentElement.id && e.target.id != "textElement") {
                                        hoverObj.style.height = "1px";
                                        hoverObj.parentElement.removeChild(hoverObj);
                                    }
                                }

                            }
                        } else if (Columns[j] == "Add To Draft") {
                            if (!Pnp.NoAcessToDoc) {
                                var backToDraft = GHVHS.DOM.create({ "Type": "div", "Class": "buttonCon", "Id": "ApproveBut", "Style": "background-color:#00B200; border:2px solid #026440;", "Content": "Unarchive", "Parent": DocStat });
                                backToDraft.id = data["Id"];
                                backToDraft.onclick = function () {

                                    function refreshPage() {
                                        window.location.href = window.location.href;
                                    }

                                    GHVHS.DOM.DrawSmallLoader2();
                                    GHVHS.DOM.send({ "URL": "/Pnp/UnArchive?id=" + this.id, "Callback": refreshPage, "CallbackParams": [] });
                                    

                                }


                            } else {
                                DocStat.innerHTML = "No Access";
                            }
                        
                        }else if (Columns[j] == "Archive" || Columns[j] == "Delete") {
                            if (!Pnp.NoAcessToDoc) {
                                DocStat.id = Columns[j];
                                var Delete = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": data["SharepointId"] + "||" + data["FileName"] + "||" + data["PolicyFolder"], "Src": "/img/RedX.png", "Style": "Height:30px;", "Parent": DocStat });
                                if (!data["CheckedOut"] || data["CheckedOut"] == Pnp.UserName) {
                                    Delete.onclick = function (e) {
                                        var parent = this.parentElement.parentElement;
                                        var id = this.id;
                                        var datas = id.split("||");
                                        Pnp.DrawConfirmButton(parent, datas[0], datas[1], datas[2]);
                                    }
                                } else {
                                    Delete.onclick = function () {
                                        var theSplit = this.id.split("||");
                                        Pnp.drawNoAccessToButton("Sorry, " + theSplit[1] + " is checked out and can't be Archived while checked out.");
                                    }
                                }
                            } else {
                                DocStat.innerHTML = "No Access";
                            }
                        } else if (Columns[j] == "Edit") {
                            if (!Pnp.NoAcessToDoc) {
                                DocStat.id = Columns[j];
                                var EditImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": data["SharepointId"] + "||" + data["FileName"], "Src": "/img/edit.png", "Style": "Height:30px;", "Parent": DocStat });
                                if (!data["CheckedOut"] || data["CheckedOut"] == Pnp.UserName) {
                                    EditImg.onclick = function () {
                                        var id = this.id;
                                        var datas = id.split("||");
                                        var fileURl = this.parentElement.parentElement.id;
                                        var getList = window.location.href.split("PnP/");
                                        Pnp.getSingleDocMeta(getList[1], datas[0], fileURl, datas[1]);
                                    }
                                } else {
                                    EditImg.onclick = function () {
                                        var theSplit = this.id.split("||");
                                        Pnp.drawNoAccessToButton("Sorry, " + theSplit[1] + " is checked out and can't be edited while checked out .");
                                    }

                                }
                            } else {
                                DocStat.innerHTML = "No Access";
                            }
                        } else if (Columns[j] == "Is Checked Out") {
                            DocStat.id = "IsCheckedOut";
                            if (data["CheckedOut"]){
                                var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "CheckedOutImg", "Src": "/img/greenCheck.png", "Style": "Height:30px;", "Parent": DocStat });
                                var allCloumsNames = document.getElementById("PolicyHeader").querySelectorAll(".status");
                                for (var q = 0; q < allCloumsNames.length; q++){
                                    if (allCloumsNames[q].innerText == "Check Out") {
                                        allCloumsNames[q].innerHTML = "Check In/Out";
                                    }
                                }
                            } else {
                                DocStat.innerHTML += " ";
                            }   
                        } else if (Columns[j] == "Department") {
                            var departmentValue = data["Department"];
                            for (var f = 0; f < Pnp.Departments.length; f++) {
                                if (Pnp.Departments[f].Id == departmentValue) {
                                    departmentValue = Pnp.Departments[f].Name;
                                }
                            }
                            DocStat.innerHTML += departmentValue;
                        } else if (Columns[j] == "Checked Out By") {
                            DocStat.id = "Checked Out By";
                            if (data["CheckedOut"]) {
                               
                                DocStat.innerHTML += data["CheckedOut"];
                            } else {
                                DocStat.innerHTML += " ";
                            }

                        }  else {
                            if (data[Columns[j]]) {
                                if (data[Columns[j]] != null) {
                                    DocStat.innerHTML += data[Columns[j]];
                                    if (Columns[j].toLowerCase().indexOf("date") >= 0 && Columns[j].toLowerCase().indexOf("Modified") >= 0) {
                                        var value = GHVHS.DOM.formateSQLDate(data[Columns[j]]);
                                        var time = value.split(" ");
                                        DocStat.innerHTML = time[0];
                                    }
                                    DocStat.id = Columns[j];
                                }   
                            }
                        }
                        if (Columns[j] == "View" || Columns[j] == "Check Out" || Columns[j] == "Edit" || Columns[j] == "Is Checked Out" || Columns[j] == "Archive" || Columns[j] == "Delete") {
                            if (ViewOnly) {
                                DocStat.style.width = "6.5%";
                                DocStat.style.minWidth = "6.5%";
                            } else {
                                if (route == "PoliciesRelateddocuments") {
                                    DocStat.style.width = "5.4%";
                                    DocStat.style.minWidth = "5.4%";
                                } else if (route == "ApprovedPolicies") {
                                    DocStat.style.width = "4%";
                                    DocStat.style.minWidth = "4%";
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
                                if (route == "PoliciesRelateddocuments") {
                                    DocStat.style.width = (108 / (Columns.length - 2)) + "%";
                                    DocStat.style.minWidth = (108 / (Columns.length - 2)) + "%"; 
                                } else if (route == "ArchivePolicies") {
                                    DocStat.style.width = (95 / (Columns.length - 2)) + "%";
                                    DocStat.style.minWidth = (95 / (Columns.length - 2)) + "%";
                                }else {
                                    DocStat.style.width = (79 / (Columns.length - 5)) + "%";
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
                        if (height < 0 ) {
                            height = 30;
                        }
                        if (DocStat.offsetHeight < height) {
                            var getHeight = (height - DocStat.offsetHeight) / 2;
                            if (getHeight < 0) {
                                getHeight = Math.abs(getHeight);
                            }

                            DocStat.style.paddingTop = getHeight + "px";
                            DocStat.style.paddingBottom = getHeight + "px";
                        } else {
                            DocStat.style.paddingTop ="4px";
                            DocStat.style.paddingBottom = "4px";
                        }
                        DocStat.style.color = "rgb(63, 80, 104)";
                        DocStat.style.wordBreak= "break-word";
                        DocStat.style.textOverflow = "ellipsis";
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
    drawSlideUpApprovals: function (parent, Title, id) {
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        Title = Title.replace("Please Approve", "");
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": Title + "'s Approval Status", "Parent": FrameHeader });
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            XCancel.parentElement.parentElement.parentElement.parentElement.removeChild(XCancel.parentElement.parentElement.parentElement);
        }

        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        GHVHS.DOM.DrawSmallLoader2(FrameBody);
        function drawApproverStatus(json, p) {
            GHVHS.DOM.RemoveSmallLoader2(p);
            var StatusApprovedTable = GHVHS.DOM.create({ "Type": "div", "Class": "StatusApprovedTable", "Style": "Width:90%;margin-left:5%;", "Id": "StatusApprovedTable", "Parent": p });
            var data = json["Items"];
            colums = ["Username", "PercentComplete", "Status"]
            SingleTableElem1 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Style": "height:4.5%;", "Id": "Cloumns", "Parent": StatusApprovedTable });
            for (var k = 0; k < colums.length; k++) {
                Status = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Style": "width:20%;", "Content": colums[k], "Parent": SingleTableElem1 });
                if (colums[k] == "PercentComplete") {
                    Status.style.width = "38%";
                } else if (colums[k] == "Status") {
                    Status.style.width = "40%";
                }
            }
            for (var k = 0; k < data.length; k++) {
                SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": data[k]["Data"]["Id"] + "", "Parent": StatusApprovedTable });
                SingleTableElem.style.height = "25%";
                ApName = GHVHS.DOM.create({ "Type": "div", "Class": "ApName", "Style": "width:20%;margin-right:0%;", "Content": data[k]["Data"]["UserName"], "Parent": SingleTableElem });
                 for (var j = 0; j < Pnp.AllUsers["Items"].length; j++){
                    var username = data[k]["Data"]["username"].toLowerCase().trim();
                    var currentUsername = Pnp.AllUsers["Items"][j]["Fields"].UserName.toLowerCase().trim();
                    if (username == currentUsername) {
                        ApName.innerHTML = Pnp.AllUsers["Items"][j]["Fields"].DisplayName;
                    }
                }
                Comments = GHVHS.DOM.create({ "Type": "div", "Class": "ApName", "Style": "width:39%;margin-right:0%;font-size:100%;", "Parent": SingleTableElem });

                Comments.innerHTML = data[k]["Data"]["PercentComplete"];

                Status = GHVHS.DOM.create({ "Type": "div", "Class": "NotStartedStatus", "Style": "width:40%;", "Content": data[k]["Data"]["Status"], "Parent": SingleTableElem });
                if (data[k]["Data"]["Status"] == "Not Started") {
                    Status.className = "NotStartedStatus";
                } else if (data[k]["Data"]["Status"] == "Complete") {
                    Status.className = "CompletedStatus";
                } else if (data[k]["Data"]["Status"] == "Rejected") {
                    Status.className = "CompletedStatus";
                    Status.style.backgroundColor = "#B20000";
                }

            }
        }
        var d = new Date();
        var n = d.getTime();
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getApprover?DocId=" + id + "&Dummy=" + n, "Callback": drawApproverStatus, "CallbackParams": FrameBody });
    },
    SlideUpConcurrerenceStatus: function (parent, Title, id) {
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": Title + "'s Concurrerence Status", "Parent": FrameHeader });
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            XCancel.parentElement.parentElement.parentElement.parentElement.removeChild(XCancel.parentElement.parentElement.parentElement);
        }

        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
        GHVHS.DOM.DrawSmallLoader2(FrameBody);
        function drawApproverStatus(json, p) {
            GHVHS.DOM.RemoveSmallLoader2(p);
            var StatusApprovedTable = GHVHS.DOM.create({ "Type": "div", "Class": "StatusApprovedTable", "Style": "Width:90%;margin-left:5%;", "Id": "StatusApprovedTable", "Parent": p });
            var data = json["Items"];
            colums = ["Username", "Comments", "Status"]
            SingleTableElem1 = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Style": "height:4.5%;", "Id": "Cloumns", "Parent": StatusApprovedTable });
            for (var k = 0; k < colums.length; k++) {
                Status = GHVHS.DOM.create({ "Type": "div", "Class": "status", "Style": "width:20%;", "Content": colums[k], "Parent": SingleTableElem1 });
                if (colums[k] == "Comments") {
                    Status.style.width = "38%";
                } else if (colums[k] == "Status") {
                    Status.style.width = "40%";
                }
               
            }
            for (var k = 0; k < data.length; k++) {
                SingleTableElem = GHVHS.DOM.create({ "Type": "div", "Class": "SingleTableElem", "Id": data[k]["Data"]["Id"] + "", "Parent": StatusApprovedTable });
                SingleTableElem.style.height = "25%";
                ApName = GHVHS.DOM.create({ "Type": "div", "Class": "ApName", "Style": "width:20%;margin-right:0%;", "Content": data[k]["Data"]["username"], "Parent": SingleTableElem });
                for (var j = 0; j < Pnp.AllUsers["Items"].length; j++){
                    var username = data[k]["Data"]["username"].toLowerCase().trim();
                    var currentUsername = Pnp.AllUsers["Items"][j]["Fields"].UserName.toLowerCase().trim();
                    if (username == currentUsername) {
                        ApName.innerHTML = Pnp.AllUsers["Items"][j]["Fields"].DisplayName;
                    }
                }
                Comments = GHVHS.DOM.create({ "Type": "div", "Class": "ApName", "Style": "width:39%;margin-right:0%;font-size:100%;", "Parent": SingleTableElem });
                if (data[k]["Data"]["ApproveComments"]) {
                    Comments.innerHTML = data[k]["Data"]["ApproveComments"];
                }
                else if (data[k]["Data"]["RejectionReason"]) {
                    Comments.innerHTML = data[k]["Data"]["RejectionReason"];
                }
                Status = GHVHS.DOM.create({ "Type": "div", "Class": "NotStartedStatus", "Style": "width:40%;", "Content": data[k]["Data"]["Status"], "Parent": SingleTableElem });
                if (data[k]["Data"]["Status"] == "Not Started") {
                    Status.className = "NotStartedStatus";
                } else if (data[k]["Data"]["Status"] == "Completed") {
                    Status.className = "CompletedStatus";
                } else if (data[k]["Data"]["Status"] == "Rejected") {
                    Status.className = "CompletedStatus";
                    Status.style.backgroundColor = "#B20000";
                }

            }
        }
        var d = new Date();
        var n = d.getTime();
        var temp1 = GHVHS.DOM.send({ "URL": "/PnP/getConcurences?DocId=" + id + "&Dummy=" + n, "Callback": drawApproverStatus, "CallbackParams": FrameBody });
        //var temp = GHVHS.DOM.send({ "URL": "/PnP/ConcurenceLookUp?list=Workflow%20Tasks&filter=" + FilterData, "Callback": drawApproverStatus, "CallbackParams": FrameBody });
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
    DrawConfirmButton: function (Elem, ID, Name, list ,IsImg, Folder) {
        canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Style": "position:absolute;", "Parent": document.getElementById("canvas") });
        var broswer = GHVHS.DOM.getBrowserType();
        if (broswer == "IE") {
            if (document.getElementById("ViewFile")) {
                if (document.getElementById("ViewFile").style.display != "none") {
                    document.getElementById("ViewFile").style.display = "none";
                }
            }
        }
        if (!IsImg) {
            Elem.className = "darkBlueST";
            canvas2.onclick = function (e) {
                if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
                    Elem.className = "SingleTableElem";
                    document.getElementById('canvas').removeChild(this);
                    var broswer = GHVHS.DOM.getBrowserType();
                    if (broswer == "IE") {
                        if (document.getElementById("ViewFile")) {
                            if (document.getElementById("ViewFile").style.display == "none") {
                                document.getElementById("ViewFile").style.display = "block";
                            }
                        }
                    }
                }

            }
        } else {
            canvas2.onclick = function (e) {
                if (e.target.id != "loader" && e.target.id != "RemoveButton" && e.target.id != "Confirm") {
                    document.getElementById('canvas').removeChild(this);
                    var broswer = GHVHS.DOM.getBrowserType();
                    if (broswer == "IE") {
                        if (document.getElementById("ViewFile")) {
                            if (document.getElementById("ViewFile").style.display == "none") {
                                document.getElementById("ViewFile").style.display = "block";
                            }
                        }
                    }
                }

            }
        }
        
        loader = GHVHS.DOM.create({ "Type": "div", "Class": "loader", "Id": "loader", "Parent": canvas2 });
        ConfirmRemoveContainer = GHVHS.DOM.create({ "Type": "div", "Parent": loader, "Class": "ConfirmRemoveContainer" });
        ConfirmRemoveContainer.style.width = (canvas.offsetWidth * 0.3) - 20 + "px";
        ConfirmRemoveContainer.style.left = "34%";
        ConfirmRemove = GHVHS.DOM.create({ "Type": "div", "Parent": ConfirmRemoveContainer, "Content": "Are you sure you want to archive " + Name +" from " +list +"?", "Class": "ConfirmRemove" });
        ConfirmRemove.style.lineHeight = "2em";
        if (list == "PolicyRelatedDocuments"){
            ConfirmRemove.innerHTML = "Are you sure you want to delete " + Name + " from " + list + "?";
        }
        Confirm = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Id": "Confirm", "Parent": ConfirmRemove, "Content": "Confirm" });
        if (list == "Archive") {
            Confirm.onclick = function () {
                GHVHS.DOM.DrawSmallLoader2();
                function redrawPage() {
                    if (window.location.href.indexOf("/Policy") >= 0) {
                        window.location.href = "/Pnp/ArchivePolicies";
                    } else {
                        window.location.href = window.location.href;
                    }
                }
                GHVHS.DOM.send({ "URL": "/Pnp/DeletePolicy?Id=" + ID, "Callback": redrawPage, "CallbackParams": [] });
            }
            
            
        }else if (list != "PolicyRelatedDocuments") {
            Confirm.onclick = function () {
                GHVHS.DOM.DrawSmallLoader2();
                function redrawPage() {
                    if (window.location.href.indexOf("/Policy") >= 0) {
                        list = list + "Policies";
                        window.location.href = "/Pnp/" + list;
                    } else {
                        window.location.href = window.location.href;
                    }
                }
                GHVHS.DOM.send({ "URL": "/Pnp/Archive?id=" + ID, "Callback": redrawPage, "CallbackParams": [] });
            }
        } else {
            Confirm.onclick = function () {
                GHVHS.DOM.DrawSmallLoader2();
                function redrawPage() {
                    if (window.location.href.indexOf("/Policy") >= 0) {
                        window.location.href = "/Pnp/PoliciesRelateddocuments";
                    }else{
                        window.location.href = window.location.href;
                    }
                }
                GHVHS.DOM.send({ "URL": "/Pnp/DeletetRelatedDocument?Id=" + ID, "Callback": redrawPage, "CallbackParams": [] });
            }
        }

        Cancel = GHVHS.DOM.create({ "Type": "div", "Class": "RemoveButton", "Parent": ConfirmRemove, "Content": "Cancel" });
        Cancel.style.marginTop = "5px";
    },
    GlobalFormData: [],
    globalContinue:"",
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
                  }else if (DocStats[i].id == "FileName") {
                      docName = DocStats[i].innerText;
                  }
              }
        }
      
        if (checkOutby.innerText != "") {
            if (checkOutby.innerText == Pnp.UserName) {
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
                CheckInComments = GHVHS.DOM.create({ "Type": "div","Style":"height:75%;", "Class": "CheckInComments", "Id": "CheckInComments", "Parent": FrameBody });
                rightSide = GHVHS.DOM.create({ "Type": "div", "Class": "rightSide", "Id": "rightSide", "Parent": CheckInComments });
                rightTitle = GHVHS.DOM.create({ "Type": "div", "Class": "rightTitle", "Id": "rightTitle", "Content": "Reupload File", "Parent": rightSide });
                RightMsg = GHVHS.DOM.create({ "Type": "div", "Class": "RightMsg", "Id": "RightMsg", "Parent": rightSide });
                RightMsg.innerHTML = "<Span style='font-size:100%;Font-weight:bold;'>(<Span style='color:black;'>Optional</span>)</span> Please reupload or upload the document you wish to check back in. If there are changes or updates you will need to upload the document for the changes to take affect. If so click on the upload box on the right to select your document. Otherwise just click the ok button.";
                LeftSide = GHVHS.DOM.create({ "Type": "div", "Class": "LeftSide", "Id": "LeftSide", "Parent": CheckInComments });
                leftTitle = GHVHS.DOM.create({ "Type": "div", "Class": "rightTitle","Style":"padding-top:0%;", "Id": "rightTitle", "Content": "Upload File:", "Parent": LeftSide });
                var fileContaner = GHVHS.DOM.create({ "Type": "div", "Class": "fileContaner", "Id": "fileContaner", "Parent": LeftSide });
                var FileStuff = [];
                fileContaner.style.marginLeft = "10%";
                fileContaner.style.width = "70%";
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
                    name = name.replace("DOCX", "docx");
                    var format = /[!@#$%^&*+\-=\[\]{};':"\\|,<>\/?]+/;
                    if (format.test(name)) {
                        Pnp.globalContinue = "N";
                        var getFrame = document.getElementById("IFrame");
                        var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Parent": getFrame });
                        Error.innerHTML = "One of the following characters in '" + name + "' is not allowed in file name ";
                        Error.style.top = 50 + "px";
                        Error.style.width = "300px"
                        Error.style.left = (((getFrame.offsetWidth / 2) - 200)) + "px";
                        var ErrorOff = setTimeout(function () {
                            document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
                        }, 7000);
                        this.value = '';
                    } else {
                        if (name.indexOf(".docx") >= 0) {
                            url = "/img/fileIcon.jpeg";
                            continueUp = "Y";
                        } else if (name.indexOf(".doc") >= 0) {
                            url = "/img/fileIcon.jpeg";
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

                        if (continueUp == "Y") {
                            imgHolder.src = url;
                            var formData = new FormData();
                            formData.append('file', file);
                            Pnp.GlobalFormData = formData;
                            Pnp.GlobalFileName = name;
                            Label.innerHTML = name;
                            Pnp.globalContinue = "Y";
                        } else {
                            Pnp.globalContinue = "N";
                            var getFrame = document.getElementById("IFrame")
                            var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Content": "Sorry, That File Type is Not Supported.", "Parent": getFrame });
                            Error.style.top = 50 + "px";
                            Error.style.left = (((getFrame.offsetWidth / 2) - 100)) + "px";
                            var ErrorOff = setTimeout(function () {
                                document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
                            }, 3000);
                        }
                    }


                }
                fileContaner.onclick = function () {
                    getFile.click();

                }

                var fileImg = GHVHS.DOM.create({ "Type": "img", "Class": "fileImg",  "Id": "fileImg", "Parent": fileContaner });
               
                var hoverObj = GHVHS.DOM.create({ "Type": "div", "Class": "hoverObj", "Id": "hoverObj", "Content": "Click Here to Add/Change File","Style":"font-size:60%;", "Parent": fileContaner });
                    
                
                var frameFooter = GHVHS.DOM.create({ "Type": "div", "Class": "frameFooter", "Id": "frameFooter", "Parent": framed });
                SearchButtonSmall = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "margin-left:30%;", "Content": "OK", "Parent": frameFooter });
                SearchButtonSmall.onclick = function () {
                    GHVHS.DOM.DrawSmallLoader2();
                    function Checkedin(json, p) {
                        if (json["data"] != "False") {
                           window.location.href = window.location.href;
                        } else {
                            var loader = document.getElementById("FaxTableLoader");
                            loader.parentElement.removeChild(loader);
                            Pnp.drawErrorMsg("Something went wrong. Please try again later.");
                        }
                    }
                    var callbackParam = [];
                    if (Pnp.GlobalFileName != "") {
                       
                            GHVHS.DOM.send({ "URL": "/PnP/CheckInPost?id=" + ID[0].innerHTML + "&FileName=" + Pnp.GlobalFileName, "PostData": Pnp.GlobalFormData, "CallbackParams": [], "Callback": Checkedin, "Method": "POST" });
                        
                    } else {
                        GHVHS.DOM.send({ "URL": "/PnP/CheckIn?id=" + ID[0].innerHTML, "CallbackParams": [], "Callback": Checkedin });
                    }
                   
                }
                SearchButtonSmallCancel = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "", "Content": "Cancel", "Parent": frameFooter });
                SearchButtonSmallCancel.onclick = function () {
                    XCancel.click();
                }
            } else {
                var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
                var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
                var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
                var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Already Checked Out", "Parent": FrameHeader });
                var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
                XCancel.onclick = function () {
                    canvas2.parentElement.removeChild(canvas2);
                    if (document.getElementById("ViewFile")) {
                        document.getElementById("ViewFile").style.display = "block";
                    }
                }
                var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Style": "padding-top:5%;", "Content": "Sorry, " + docName + " is already checked out by " + checkOutby.innerText, "Parent": framed });
                FrameBody.style.fontSize = "150%";
            }
        } else {
            GHVHS.DOM.DrawSmallLoader2();
            function CheckedOut(json,p) {
                if (json["data"] != "False"){
                    var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "CheckedOutImg", "Src": "/img/greenCheck.png", "Style": "Height:30px;", "Parent": checkOutImg });
                    checkOutby.innerHTML = Pnp.UserName;
                    var Broswer = GHVHS.DOM.getBrowserType();
                    if (Broswer != "IE") {
                        var link = GHVHS.DOM.create({ "Type": "a", "Class": "hide", "Id": "hid", "Href": json["data"], "Parent": checkOutImg });
                        link.setAttribute("download", "");
                        link.click();
                        checkOutImg.removeChild(link);
                        var broswer = GHVHS.DOM.getBrowserType();
                        if (broswer == "IE") {
                            if (document.getElementById("ViewFile").style.display == "none") {
                                document.getElementById("ViewFile").style.display = "block";
                            }
                        }
                    } else {
                        const frame = document.createElement("iframe");
                        document.body.appendChild(frame);
                        if (json["data"].indexOf(".docx") >= 0) {
                            frame.contentWindow.document.open("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "replace");
                        } else if (json["data"].indexOf(".doc") >= 0) {
                            frame.contentWindow.document.open("application/msword", "replace");
                        } else if (json["data"].indexOf(".pdf") >= 0) {
                            frame.contentWindow.document.open("application/pdf", "replace");
                        }
                        frame.contentWindow.document.write(json["data"]);
                        frame.contentWindow.document.close();

                        frame.contentWindow.focus();
                        frame.contentWindow.document.execCommand("SaveAs", true, json["data"]);
                        document.body.removeChild(frame);
                        
                    }
                    var loader = document.getElementById("FaxTableLoader");
                    loader.parentElement.removeChild(loader);
                } else {
                    var loader = document.getElementById("FaxTableLoader");
                    loader.parentElement.removeChild(loader);
                }
                
            }
            var d = new Date();
            var n = d.getTime();
            theID = ID[0].innerText;
            GHVHS.DOM.send({ "URL": "/PnP/CheckOut?Id=" + theID+"&Dummy="+n, "Callback": CheckedOut, "CallbackParams": "http://sharepoint/" + url });
        }
        
    },
    drawNoAccessToButton: function (message, user) {
        if (document.getElementById("ViewFile")) {
            document.getElementById("ViewFile").style.display = "none";
        }
        var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas2", "Parent": document.getElementById('canvas') });
        var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
        var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
        var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Already Checked Out", "Parent": FrameHeader });
        var XCancel = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
        XCancel.onclick = function () {
            canvas2.parentElement.removeChild(canvas2);
            if (document.getElementById("ViewFile")) {
                document.getElementById("ViewFile").style.display = "block";
            }
        }
        var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Style": "padding-top:5%;", "Content": "Sorry, this document is checked out by " + user, "Parent": framed });
        if (message) {
            FrameBody.innerHTML = message;
        }
        FrameBody.style.fontSize = "150%";
    },
    FormDatas : [],
    concurrerGlobal: "",
    // Draws plus button to draft policies for users to upload new policies
    drawAddButtonAndLabel: function (EventHeader) {
        var FileStuff =[];
        Pnp.globalContinue = "N";
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
                 
                 var imgHolder = document.getElementById('fileImg');
                 var Label = document.getElementById("hoverObj");
                 var file = this.files[0];
                 var Type = file.type;
                 var name = file.name;

                 function Continue(json, p) {
                     var imgHolder = p[0];
                     var Label = p[1];
                     var file = p[2];
                     var Type = p[3];
                     var name = p[4];
                     var start = "N";
                     if (json.data == true) {
                         var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2", "Id": "canvas3", "Style": "background-color:rgba(0, 0, 0, 0.99);", "Parent": document.getElementById('canvas2') });
                         var framed = GHVHS.DOM.create({ "Type": "div", "Style": "background-color:white;height:50%;transition: height 0.8s ease;transition: top 0.3s ease;", "Class": "IFrame", "Id": "IFrame", "Parent": canvas2 });
                         var FrameHeader = GHVHS.DOM.create({ "Type": "div", "Class": "FrameHeader", "Id": "FrameHeader", "Parent": framed });
                         var EventLable = GHVHS.DOM.create({ "Type": "div", "Class": "EventLable", "Style": "Text-align:left;padding-left:5%;padding-top: 1%;padding-right:10%;Font-size:150%;", "Id": "EventLable", "Content": "Duplicate Name", "Parent": FrameHeader });
                         var XCancel2 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "XCancel", "Id": "XCancel", "Parent": FrameHeader });
                         XCancel2.onclick = function () {

                             var Element = document.getElementById("canvas3");
                             Element.parentElement.removeChild(Element);
                             if (document.getElementById("ViewFile")) {
                                 document.getElementById("ViewFile").style.display = "block";
                             }
                         }
                         var FrameBody = GHVHS.DOM.create({ "Type": "div", "Class": "FrameBody", "Id": "FrameBody", "Parent": framed });
                         FrameBody.innerHTML = "A policy already exists with the same name as the policy your trying to import. Are you sure you want to continue?";
                         var frameFooter = GHVHS.DOM.create({ "Type": "div", "Class": "frameFooter", "Id": "frameFooter", "Parent": framed });
                         SearchButtonSmall2 = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmallCancel", "Style": "", "Content": "Continue", "Parent": frameFooter });
                         SearchButtonSmall2.onclick = function () {
                             var Element = document.getElementById("canvas3");
                             GHVHS.DOM.DrawSmallLoader2(Element);
                             setTimeout(function () {


                                 XCancel2.click();
                                 finsh(imgHolder, Label, file, Type, name);
                             }, 200);
                         }
                         SearchButtonSmallCancel = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmallCancel", "Style": "", "Content": "Cancel", "Parent": frameFooter });
                         SearchButtonSmallCancel.onclick = function () {
                             XCancel2.click();
                         }
                        


                     } else {
                         finsh(imgHolder, Label, file, Type, name);
                     }
                 }
                 function finsh(imgHolder, Label, file, Type, name) {


                     FileStuff = [{ "Name": name, "Type": Type }];
                     imgHolder.style.opacity = "1";
                     var url = URL.createObjectURL(file);
                     var continueUp = "N";
                     var tempName = name.toLowerCase();
                     if (tempName.indexOf(".docx") >= 0) {
                         url = "/img/fileIcon.jpeg";
                         continueUp = "Y";
                     } else if (tempName.indexOf(".doc") >= 0) {
                         url = "/img/fileIcon.jpeg";
                         continueUp = "Y";
                     } else if (tempName.indexOf(".pdf") >= 0) {
                         url = "/img/pdf.png";
                         continueUp = "Y";
                     } else if (tempName.indexOf(".xlsx") >= 0 || tempName.indexOf(".xls") >= 0) {
                         url = "/img/excell.jpeg";
                         continueUp = "Y";
                     } else if (tempName.indexOf(".pptx") >= 0 || tempName.indexOf(".ppt") >= 0) {
                         url = "/img/pptx.png";
                         continueUp = "Y";
                     } else {
                         continueUp = "N";
                     }
                     var getList = window.location.href.split("PnP/");
                     var list = getList[1];
                     var MessageFromUpload = "";

                     if (continueUp == "Y") {
                         imgHolder.src = url;
                         var formData = new FormData();
                         formData.append('file', file);
                         Pnp.FormDatas = formData;
                         Label.innerHTML = name;
                         Pnp.globalContinue = "Y";
                     } else {
                         Pnp.globalContinue = "N";
                         var getFrame = document.getElementById("IFrame");
                         var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Content": "Sorry, That File Type is Not Supported.", "Parent": getFrame });
                         Error.style.top = 50 + "px";
                         Error.style.left = (((getFrame.offsetWidth / 2) - 100)) + "px";
                         var ErrorOff = setTimeout(function () {
                             document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
                         }, 3000);
                     }
                 }
                 var format = /[!@#$%^&*+\-=\[\]{};':"\\|,<>\/?]+/;
                 if (format.test(name)) {
                     Pnp.globalContinue = "N";
                     var getFrame = document.getElementById("IFrame");
                     var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error",  "Parent": getFrame });
                     Error.innerHTML = "One of the following characters in '" + name + "' is not allowed in file name ";
                     Error.style.top = 50 + "px";
                     Error.style.width = "300px"
                     Error.style.left = (((getFrame.offsetWidth / 2) - 200)) + "px";
                     var ErrorOff = setTimeout(function () {
                         document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
                     }, 7000);
                     this.value = ''
                 } else {
                     GHVHS.DOM.send({ "URL": "/Pnp/VerifiyName?id=" + name, "CallbackParams": [imgHolder, Label, file, Type, name], "Callback": Continue, });
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
                                } else if (x[i].id == "Approver") {

                                    var getValues = document.getElementById("SelectedHolder2").querySelectorAll(".SelectedUser");
                                    var Approvers = "";
                                    if (getValues) {
                                        for (var j = 0; j < getValues.length; j++) {
                                            if (getValues[j].id != "") {
                                                if (Approvers == "") {
                                                    Approvers = getValues[j].id
                                                } else {
                                                    Approvers += ";" + getValues[j].id
                                                }
                                            }
                                        }
                                        singleParam += "=" + Approvers;
                                    }else{
                                        singleParam += "=Null";
                                    }
                                    if (Approvers == "") {
                                        singleParam += "Null";
                                    }

                                } else if (x[i].id == "Department") {
                                    if (filter[0].value != "") {
                                        var valueD = filter[0].value.toLowerCase().trim();
                                        var ValueForURL = "";
                                        for (var k = 0; k < Pnp.Departments.length; k++){
                                            var dName = Pnp.Departments[k]["Name"].toLowerCase().trim();
                                            if (valueD == dName) {
                                                ValueForURL = Pnp.Departments[k]["Id"];
                                            }
                                        }
                                        singleParam += "=" + ValueForURL;
                                    }
                                    
                                
                                
                                }else if (x[i].id == "Concurrers") {
                                    var getValues = document.getElementById("SelectedHolder").querySelectorAll(".SelectedUser");
                                    var AllConcurrers = "";
                                    if (getValues) {
                                        for (var j = 0; j < getValues.length; j++){
                                            if (getValues[j].id != "") {
                                                if (AllConcurrers == "") {
                                                    AllConcurrers = getValues[j].id
                                                } else {
                                                    AllConcurrers += ";"+getValues[j].id
                                                }
                                            }
                                        }
                                    }

                                    if (Pnp.DefaultConcurrers == AllConcurrers) {
                                        singleParam += "=" + "";
                                    } else {
                                        if (AllConcurrers == "") {
                                            singleParam += "=Null";
                                        } else if (!AllConcurrers) {
                                            singleParam += "=Null";
                                        }else {
                                            singleParam += "=" + AllConcurrers;
                                        }
                                        
                                    }
                                } else if (x[i].id == "Location") {
                                    var valueForParam = "";
                                    if (filter[0].value != "") {
                                        for (var g = 0; g < Pnp.Locations.length; g++) {
                                            if (Pnp.Locations[g].Name == filter[0].value) {
                                                valueForParam = Pnp.Locations[g].Id;
                                            }
                                        }
                                        singleParam += "=" + valueForParam;
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
                            var CheckForPDR = document.getElementById("SelectedArea").querySelectorAll(".SingleRealatedDoc");
                            if (CheckForPDR.length) {
                                var parms = "&RelatedDocs=";
                                for (var j = 0; j < CheckForPDR.length; j++) {
                                    if (j != CheckForPDR.length) {
                                        parms += CheckForPDR[j].id + "|";
                                    } else {
                                        parms += CheckForPDR[j].id;
                                    }
                                }
                                params += parms;
                            } else {
                                params += "&RelatedDocs=Null";
                            }
                            var list;
                            var split = window.location.href.toLowerCase().split("pnp/");
                            list = split[1];
                            if (list.indexOf("policy") >= 0) {
                                var temp = list.split("?");
                                list = temp[0].replace("policy/", "");
                            }
                            if (document.getElementById("hoverObj").innerText != "Click Here to Add/Change File") {
                                fileName = document.getElementById("hoverObj").innerText;
                            }
                            function IsCreated(json) {
                                if (json["data"][0] != "false") {
                                    window.location.href = window.location.href;
                                } else {
                                    var loader = document.getElementById("FaxTableLoader");
                                    loader.parentElement.removeChild(loader);
                                    Pnp.drawErrorMsg("Something went wrong!");
                                }
                            }
                            var IsID = document.getElementById("theID").innerText;
                            GHVHS.DOM.send({ "URL": "/Pnp/CreateItem?FileName=" + fileName + "&" + params + "&itemId=" + IsID , "CallbackParams": [], "Callback": IsCreated, });
                        } else {
                            
                            var loader = document.getElementById("FaxTableLoader");
                            loader.parentElement.removeChild(loader);
                            Pnp.drawErrorMsg("Please Enter a correct value");
                        }
                    }else {
                        if (Pnp.FormDatas && Pnp.globalContinue == "Y") {
                            
                           
                            function IsCreated(json, p) {
                                var loader = document.getElementById("FaxTableLoader");
                                loader.parentElement.removeChild(loader);
                                if (json["data"] == "File Already Exists") {
                                    Pnp.drawErrorMsg("File Already Exists");
                                } else if (json["data"].indexOf("Error") >= 0) {
                                    Pnp.drawErrorMsg("An Error occured with your word document, Please update your doc and try again later.");
                                } else if (json["data"][0].indexOf("Error") >= 0) {
                                    Pnp.drawErrorMsg("An Error occured with your word document, Please update your doc and try again later.");
                                }else {
                                    var getFrame = document.getElementById("IFrame");
                                    GHVHS.DOM.create({ "Type": "div", "Class": "hide", "Content":json["data"][0], "Id": "theID", "Parent": fileContaner });
                                    Pnp.ResizeAndGetMetaData(getFrame, p[0], p[1], p[2]);
                                }
                            
                            }
                        
                            var list,fileName;
                            var list,fileName;
                            var url = window.location.href.toLowerCase();
                            if (url.indexOf("draft") >= 0) {
                                list = "Draft";
                            }else if (url.indexOf("approved") >= 0){
                                list = "Approved";
                            } else if (url.indexOf("archive") >= 0) {
                                list = "Archive";
                            }
                            fileName = document.getElementById("hoverObj").innerText;
                            fileName = fileName.replace("&", " ");
                            GHVHS.DOM.send({ "URL": "/Pnp/UploadFile?list=" + list + "&FileName=" + fileName, "PostData": Pnp.FormDatas, "CallbackParams": [Pnp.FormDatas, fileContaner, FileStuff], "Callback": IsCreated, "Method": "POST" });
                            
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
        var d = new Date();
        var n = d.getTime();
        GHVHS.DOM.send({ "URL": "/Pnp/getPolicies?Id=" + id+"&Dummy="+n, "CallbackParams": [], "Callback": EditForm });
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
                if (Filters[i].id == "Department") {
                    for (var w = 0; w < getSubElements.length; w++) {
                        if (Pnp.GlobalFilterDepoNames) {
                            if (Pnp.GlobalFilterDepoNames.indexOf(getSubElements[w].innerHTML.toLowerCase().trim()) >= 0) {
                                getSubElements[w].className = "DropOption";
                            }
                        } else {
                            if (getSubElements[w].className == "hide") {
                                getSubElements[w].className = "DropOption";
                            }
                        }
                    }
                } else {
                    for (var w = 0; w < getSubElements.length; w++) {
                        if (getSubElements[w].className == "hide") {
                            getSubElements[w].className = "DropOption";
                        }
                    }
                }
                
            }
        }
        if (getOkayButton) {
            if (flag == "") {
                getOkayButton.style.backgroundColor = "rgba(64, 0, 23,0.8)";
                getOkayButton.id = "SearchButtonSmall";
            } else {
                getOkayButton.style.backgroundColor = "grey";
                getOkayButton.id = "No";
            }
        } else {
            if (document.getElementById("ArrowContainer1")) {
                if (flag == "") {
                    document.getElementById("ArrowContainer1").className = "ArrowContainerSmall";
                } else {
                    document.getElementById("ArrowContainer1").className = "ArrowContainerSmallWrong";

                }
            }
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
                if (Filter.id == "Department"){
                    if (Pnp.GlobalFilterDepoNames) {
                        if (check1.indexOf(check2) >= 0 && Pnp.GlobalFilterDepoNames.indexOf(check1.trim()) >= 0) {
                            getOptions[i].className = "DropOption";
                            if (check1 == check2) {
                                if (x != 8) {
                                    getOptions[i].click();
                                }
                            }
                        } else {
                            getOptions[i].className = "hide";
                        }
                    } else {
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

               }else{
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
        var fields = [{ "Label": "FileName", "DefaultValue": fileStuff[0]["Name"], "backgroundImage": "/img/ViewOnly.png", "placeHolder": "", "FilterType":"N" },
                { "Label": "Title", "DefaultValue": "", "backgroundImage": "/img/edit.png", "placeHolder": "Enter A Title", "FilterType": "N" },
                { "Label": "Category", "DefaultValue": "", "DropDown": Pnp.Categories, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
                { "Label": "Department", "DefaultValue": "", "DropDown": Pnp.Departments, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
                { "Label": "Location", "DefaultValue": "", "DropDown": Pnp.Locations, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
                { "Label": "Concurrers", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Type to Search For Concurrers...", "FilterType": "M" },
                { "Label": "Approver", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Type to Search For Approvers...", "FilterType": "Y" },
                { "Label": "Add Related Documents", "DefaultValue": "", "backgroundImage": "/img/fileIcon.jpeg", "placeHolder": "Type to Search For Documents...", "FilterType": "PRD" },
                { "Label": "Selected Related Documents", "DefaultValue": "" }];
        if (window.location.href.indexOf("Approved") >= 0){
            var fields = [{ "Label": "FileName", "DefaultValue": fileStuff[0]["Name"], "backgroundImage": "/img/ViewOnly.png", "placeHolder": "", "FilterType": "N" },
                { "Label": "Title", "DefaultValue": "", "backgroundImage": "/img/edit.png", "placeHolder": "Enter A Title", "FilterType": "N" },
                { "Label": "Category", "DefaultValue": "", "DropDown": Pnp.Categories, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
                { "Label": "Department", "DefaultValue": "", "DropDown": Pnp.Departments, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
                { "Label": "Location", "DefaultValue": "", "DropDown": Pnp.Locations, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
                { "Label": "Add Related Documents", "DefaultValue": "", "backgroundImage": "/img/fileIcon.jpeg", "placeHolder": "Type to Search For Documents...", "FilterType": "PRD" },
                { "Label": "Selected Related Documents", "DefaultValue": "" }];
        }
        if (!Pnp.Verified) {
            var theDepartments = [];
            var ids = Pnp.UserDepartment.split("|");
            for (var k = 0; k < ids.length; k++) {
                for (var j = 0; j < Pnp.Departments.length; j++) {
                    if (Pnp.Departments[j].Id == ids[k]) {
                        theDepartments.push({ "Name": Pnp.Departments[j].Name });
                    }
                }
            }
            fields[3].DropDown = theDepartments;
        }
        for (var i = 0; i < fields.length; i++) {
            if (fields[i]["Label"] == "Selected Related Documents") {
                SelectedRelatedDocuments = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedRelatedDocuments", "Style": "margin-top:2%;height:23%;float:left; Width:100%;overflow:", "Id": "SelectedRelatedDocuments", "Parent": fb });
                InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:8%;margin-top:0.5%;text-align: left;", "Parent": SelectedRelatedDocuments });
                InputLabel.innerHTML = fields[i]["Label"];
                SelectedArea = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedArea", "Id": "SelectedArea", "Parent": SelectedRelatedDocuments });
            } else {


                if (fields[i]["FilterType"] == "N") {
                    Pnp.DrawFilter(fb, fields[i]);
                } else if (fields[i]["FilterType"] == "Y") {
                    Pnp.drawSelectMultipleUsers(fb, fields[i], "Approver");
                } else if (fields[i]["FilterType"] == "M") {
                    Pnp.drawSelectMultipleUsers(fb, fields[i], "Concur");
                }else {
                    Pnp.darwRelatedDocsFilter(fb, fields[i]);
                }
            }
        }
        if (json) {
            var data;
            data = json["Items"][0]["Fields"];
            var getNameInputs = document.getElementById("IFrame").querySelectorAll(".NameAndInput");
            for (var i = 0; i < getNameInputs.length; i++) {
                var Name = getNameInputs[i].id;
                if (Name == "Auto Approve On Concurrence") {
                    Name = "AutoApprove"
                } else if (Name == "Add Related Documents") {
                    var prd = document.getElementById("SelectedArea");
                    if (data["RelatedDocs"]) {

                        GHVHS.DOM.DrawSmallLoader2(prd);
                        function DrawAllRelatedDocuments(jsonData) {
                            var selected = document.getElementById("SelectedArea");
                            GHVHS.DOM.RemoveSmallLoader2(selected)
                            for (var q = 0; q < jsonData["Items"].length; q++) {
                                var fileName = jsonData["Items"][q]["Fields"]["FileName"];
                                var theRelatedID = jsonData["Items"][q]["Fields"]["Id"];
                                Pnp.drawSingleRealatedDoc(fileName, theRelatedID, selected, "");
                            }
                        }

                        GHVHS.DOM.send({ "URL": "/Pnp/getRelatedDocuments?Id=" + data["RelatedDocs"], "CallbackParams": [], "Callback": DrawAllRelatedDocuments });
                    } else {
                        prd.innerHTML = "No Related Documents";
                    }
                }
                if (data[Name]) {
                    if (Name == "AutoApprove") {
                        if (data[Name] == "Y") {
                            var inputed = getNameInputs[i].querySelectorAll(".CheckBox");
                            inputed[0].click();
                        }
                    }else {
                        var inputed = getNameInputs[i].querySelectorAll(".Filter");
                        var theValue = data[Name];
                        if (data[Name] != "Null") {
                            if (Name == "Concurrers") {
                                Pnp.drawAllConcurrersInForm(theValue, document.getElementById("SelectedHolder"), inputed[0]);
                                Pnp.DefaultConcurrers = theValue;
                            } else if (Name == "Approver") {
                                Pnp.drawAllConcurrersInForm(theValue, document.getElementById("SelectedHolder2"), inputed[0]);
                            }else if (Name == "Department") {
                                var departmentValue = theValue;
                                for (var j = 0; j < Pnp.Departments.length; j++){
                                    if (Pnp.Departments[j].Id == theValue) {
                                        departmentValue = Pnp.Departments[j].Name; 
                                    }
                                }
                                inputed[0].value = departmentValue;
                            } else if (Name == "Category") {
                                if (theValue) {
                                    Pnp.GlobalFilterDepoNames = "";
                                    var getFilters = inputed[0].parentElement.parentElement.querySelectorAll(".Filter");
                                    var getDepartmentFilter;
                                    for (var j = 0; j < getFilters.length; j++) {
                                        if (getFilters[j].id == "Department") {
                                            getDepartmentFilter = getFilters[j];
                                        }
                                    }
                                    var getAllDepoOptions = getDepartmentFilter.parentElement.querySelectorAll(".DropOption");
                                    var dropDown = getDepartmentFilter.parentElement.querySelector(".DropDown");
                                    for (var j = 0; j < Pnp.Departments.length; j++) {
                                        var getCat = Pnp.Departments[j].Category.toLowerCase().trim();
                                        var checkValue = theValue.toLowerCase().trim();
                                        if (getCat == checkValue) {
                                            Pnp.GlobalFilterDepoNames += Pnp.Departments[j].Name.toLowerCase().trim() + ";";
                                        }
                                    }
                                    for (var j = 0; j < getAllDepoOptions.length; j++) {
                                        var getValue = getAllDepoOptions[j].innerHTML.toLowerCase().trim();
                                        if (Pnp.GlobalFilterDepoNames.indexOf(getValue) >= 0) {
                                            getAllDepoOptions[j].className = "DropOption";
                                        } else {
                                            getAllDepoOptions[j].className = "hide";
                                        }
                                    }
                                    inputed[0].value = theValue;
                                }
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
    drawAllConcurrersInForm:function(values, Elem, input){
        var AllConcur = values.split(";");
        for (var i = 0; i < AllConcur.length; i++) {
            var username = "";
            var FullName = "";
            if (AllConcur[i] != "") {
                for (var j = 0; j < Pnp.AllUsers["Items"].length; j++) {
                    if (AllConcur[i] == Pnp.AllUsers["Items"][j]["Fields"].UserName) {
                        username = AllConcur[i];
                        FullName = Pnp.AllUsers["Items"][j]["Fields"].DisplayName;
                    } else if (AllConcur[i] == Pnp.AllUsers["Items"][j]["Fields"].FirstName + " " + Pnp.AllUsers["Items"][j]["Fields"].LastName) {
                        username = Pnp.AllUsers["Items"][j]["Fields"].DisplayName;
                        FullName = AllConcur[i];
                    }
                }
                if (username != "" && FullName != "") {
                    Pnp.drawSelectedUser(Elem, input, FullName, username);
                }
            }
        }
    },
    DrawFilter: function (fb, fields) {
        if (document.getElementById("FrameBody")) {
            FrameBody.onscroll = function () {
                var getDropDowns = this.querySelectorAll(".DropDown");
                for (var i = 0; i < getDropDowns.length; i++) {
                    if (getDropDowns[i].style.display != "none") {
                        getDropDowns[i].style.display = "none";
                    }
                }
            }
        }
        NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:3.5%;", "Id": "NameAndInput", "Parent": fb });
        InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:8%;margin-top:0.5%;text-align: left;", "Parent": NameAndInput });
        InputLabel.innerHTML = fields["Label"];
        if (!fb.querySelector(".Filter")) {
            NameAndInput.style.marginTop = "0.5%";
        }
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/edit.png); background-size: 25px;padding-left:5px; box-shadow: 2px 2px 3px grey;width: 55%; height: 100%;", "Parent": NameAndInput });
        Filter.setAttribute("autocomplete", "Off");
        if (fields["placeHolder"]) {
         Filter.setAttribute("placeholder", fields["placeHolder"]);
        }
        Filter.style.width = "53%";
        Filter.id = fields["Label"];
        NameAndInput.id = fields["Label"];
        if (fields["Label"] != "FileName") {
            var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.3%;margin-left: -3%;position: relative;", "Parent": NameAndInput });
            var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
            addimg.alt = "Clear";
            addimg.onclick = function () {
                var filter = this.parentElement.parentElement.querySelectorAll(".Filter");
                filter[0].style.border = "1px solid silver";
                if (filter[0].id == "Concurrer") {
                    Pnp.Emails = [];
                }
               
                filter[0].value = "";
                if (filter[0].id == "Category") {
                    Pnp.GlobalFilterDepoNames = "";
                    var getDrops = filter[0].parentElement.parentElement.querySelectorAll(".DropDown");
                    var theDepoDrop;
                    for (var j = 0; j < getDrops.length; j++) {
                        if (getDrops[j].parentElement.id == "Department") {
                            theDepoDrop = getDrops[j];
                        }
                    }
                    if (theDepoDrop) {
                        var AllDropOptions = theDepoDrop.querySelectorAll("div");
                        for (var j = 0; j < AllDropOptions.length; j++) {
                            AllDropOptions[j].className = "DropOption";
                        }
                    }
                } else if (filter[0].id == "Department") {
                    var getDrops = filter[0].parentElement.parentElement.querySelectorAll(".DropDown");
                    var theDepoDrop;
                    for (var j = 0; j < getDrops.length; j++) {
                        if (getDrops[j].parentElement.id == "Department") {
                            theDepoDrop = getDrops[j];
                        }
                    }
                    if (theDepoDrop) {
                        var AllDropOptions = theDepoDrop.querySelectorAll("div");
                        for (var j = 0; j < AllDropOptions.length; j++) {
                            if (Pnp.GlobalFilterDepoNames.indexOf(AllDropOptions[j].innerHTML.toLowerCase().trim()) >= 0){
                                AllDropOptions[j].className = "DropOption";
                            }else{
                                AllDropOptions[j].className = "hide";
                            }
                        }
                    }
                }
                Pnp.CheckAllFilters(filter[0]);
            }
        } else {
            Filter.setAttribute("readonly", "true");
        }
        Filter.onkeyup = function (event) {
            var theValue = this.value;
            if (this.id != "Title") {
                if (this.id == "Concurrer") {
                    if (theValue.indexOf(";") >= 0) {
                        var splitValue = theValue.split(";");
                        theValue = splitValue[splitValue.length - 1];
                    } else {
                        theValue = this.value;
                    }
                    if (this.value != "") {
                        Pnp.FilterValue(this, theValue, event);
                    }
                } else {
                    if (this.id == "Category" && this.value == ""){
                        Pnp.GlobalFilterDepoNames = "";
                        var getDrops = this.parentElement.querySelectorAll(".DropDown");
                        var theDepoDrop;
                        for (var j = 0; j < getDrops.length; j++) {
                            if (getDrops[j].parentElement.id == "Department") {
                                theDepoDrop = getDrops[j];
                            }
                        }
                        if (theDepoDrop) {
                            var AllDropOptions = theDepoDrop.querySelectorAll("div");
                            for (var j = 0; j < AllDropOptions.length; j++) {
                                AllDropOptions[j].className = "DropOption";
                            }
                        }
                    }
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
                        theValue = splitValue[splitValue.length - 1];
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
        if (fields["DropDown"]) {
            if (fields["MultiSelected"]) {
                Pnp.drawConcurrerFilter(Filter, NameAndInput, fields["DropDown"], fields["MultiSelected"]);
            }else if ( fields["Redirect"]) {
                Pnp.drawConcurrerFilter(Filter, NameAndInput, fields["DropDown"], "", Filter.id);
            } else if (fields["Department"]) {
                Pnp.drawConcurrerFilter(Filter, NameAndInput, fields["DropDown"],  "SelectLoco");
            } else {
                Pnp.drawConcurrerFilter(Filter, NameAndInput, fields["DropDown"]);
            }
            //GHVHS.DOM.CreateDropDown({ "Element": fields[i]["Label"], "dropDownId": "", "Options": fields[i]["DropDown"], "todraw": "input", "NoClear": "Y" });
            Filter.setAttribute("placeHolder", "Select A Value");
        }
        if (fields["DefaultValue"] != "") {
            Filter.value = fields["DefaultValue"];
        }
        if (fields["backgroundImage"] != "") {
            Filter.style.backgroundImage = "url(" + fields["backgroundImage"] + ")";
            if (fields["backgroundImage"] == "/img/blackDrop.png") {
                Filter.style.backgroundSize = "15px";
            }
        }
        if (fields["ReadyOnly"]) {
            Filter.setAttribute("readonly", "true");
            Filter.style.backgroundImage = "url(/img/ViewOnly.png)";
            addDiv.style.display = "none";
        }
        
    },
    drawSelectedUser: function(parent, filter, value, username, NotEdit){
        var SelectedUser = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedUser", "Id": username, "Parent": parent });
        SelectedUserLabel = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedUserLabel", "Id": "SelectedUserLabel", "Content": value, "Parent": SelectedUser });
        xBox = GHVHS.DOM.create({ "Type": "div", "Class": "xBox", "Id": "xBox", "Parent": SelectedUser });
        if (!NotEdit) {
            xWhite = GHVHS.DOM.create({ "Type": "img", "Src": "/img/xWhite.png", "Class": "xWhite", "Id": "xWhite", "Parent": xBox });
            xWhite.onclick = function () {
                this.parentElement.parentElement.parentElement.removeChild(this.parentElement.parentElement);
            }
        }
        filter.value = "";
        filter.style.border = "none";
    },
    drawSelectMultipleUsers: function (fb, fields, Type) {
        NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:auto;", "Id": "NameAndInput", "Parent": fb });
        InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:8%;margin-top:0.5%;text-align: left;", "Parent": NameAndInput });
        InputLabel.innerHTML = fields["Label"];
        if (!fb.querySelector(".Filter")) {
            NameAndInput.style.marginTop = "0.5%";
        }
        containerForInput = GHVHS.DOM.create({ "Type": "div", "Class": "containerForInput",  "Id": "containerForInput", "Parent": NameAndInput });
        SelectedHolder = GHVHS.DOM.create({ "Type": "div", "Class": "SelectedHolder", "Style": "margin-top:0.5%;height:3.5%;", "Id": "SelectedHolder", "Parent": containerForInput });
        if (Type == "Approver") {
            SelectedHolder.id = "SelectedHolder2";
        }
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "margin-top:0px;margin-top:0.5%; margin-bottom:0px;height: 30px; border:none;padding-left:5px;margin-left:30px;background:none; ", "Parent": containerForInput });
        Filter.setAttribute("autocomplete", "Off");
        Filter.style.width = "53%";
        Filter.id = fields["Label"];
        if (fields["placeHolder"]) {
            Filter.setAttribute("placeholder", fields["placeHolder"]);
        }
        NameAndInput.id = fields["Label"];
        
        var addDiv2 = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:1%;margin-left:-10%;", "Parent": containerForInput });
        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/greenCheck.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:120%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv2 });
        addimg.alt = "Clear";
        var addDiv2 = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:1%;margin-left:-6%;", "Parent": containerForInput });
        var deleteButton = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:120%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv2 });
        addimg.alt = "Clear";
        addimg.onclick = function () {
            var getFilter = this.parentElement.parentElement.querySelector(".Filter");
            var getDropDown = this.parentElement.parentElement.parentElement.querySelector(".DropDown");
            var getSelectedHolder = this.parentElement.parentElement.querySelector(".SelectedHolder");
            if (getFilter.value == "") {
                Pnp.drawErrorMsg("Please Select a User");
            } else {
                var checkinput = getSelectedHolder.querySelectorAll(".SelectedUserLabel");
                var flag = "N";
                var checkAllUsers = "N";
                if (getFilter.value) {
                    for (var i = 0; i < Pnp.AllUsers["Items"].length; i++) {
                        var inputValue = getFilter.value;
                        var Name = Pnp.AllUsers["Items"][i]["Fields"].DisplayName;
                        Name = Name.replace(/\s/g, '');
                        inputValue = inputValue.replace(/\s/g, '');
                        if (getFilter.id == Pnp.AllUsers["Items"][i]["Fields"]["UserName"] && inputValue == Name) {
                            checkAllUsers = "Y";
                        }
                    }
                } else {
                    flag = "Y";
                }
                if (checkAllUsers == "Y") {
                    flag = "N";
                } else {
                    flag = "T";
                }
                for (var i = 0; i < checkinput.length; i++){
                    if (checkinput[i].innerHTML == getFilter.value){
                        flag = "Y";
                    }
                }
                
                if (flag == "N") {
                    Pnp.drawSelectedUser(getSelectedHolder, getFilter, getFilter.value, getFilter.id);
                } else if (flag == "T") {
                    Pnp.drawErrorMsg("Trying to add user that is not in platform");
                    if (getDropDown.style.display != "none") {
                        getFilter.click();
                    }
                }else {
                    Pnp.drawErrorMsg("that user is already selected");
                    if (getDropDown.style.display != "none") {
                        getFilter.click();
                    }
                }
            }
        }
        deleteButton.onclick = function(){
            var getFilter = this.parentElement.parentElement.querySelector(".Filter");
            getFilter.value = "";
            getFilter.style.border = "none";
        }
        Filter.onkeyup = function () {
            var theValue = this.value;
            if (theValue.length > 0) {
                var checkForDrop = this.parentElement.parentElement.querySelector(".DropDown");
                if (checkForDrop) {
                    if (checkForDrop.style.display == "none") {
                        this.click();

                    }
                }
                Pnp.getAndSearchusers(this, this.parentElement.parentElement, theValue);
            
            } else {
                this.style.border = "none";
                var checkForDrop = this.parentElement.querySelector(".DropDown");
                if (checkForDrop) {
                    if (checkForDrop.style.display != "none") {
                        this.click();

                    }
                }
            }
        }
    },
    drawUserSearchFilter: function (fb, fields) {
            NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:3.5%;", "Id": "NameAndInput", "Parent": fb });
            InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:8%;margin-top:0.5%;text-align: left;", "Parent": NameAndInput });
            InputLabel.innerHTML = fields["Label"];
            if (!fb.querySelector(".Filter")) {
                NameAndInput.style.marginTop = "0.5%";
            }
            Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/edit.png); background-size: 25px;padding-left:5px; box-shadow: 2px 2px 3px grey;width: 55%; height: 100%;", "Parent": NameAndInput });
            Filter.setAttribute("autocomplete", "Off");
            Filter.style.width = "53%";
            Filter.id = fields["Label"];
            if (fields["placeHolder"]) {
                Filter.setAttribute("placeholder", fields["placeHolder"]);
            }
            NameAndInput.id = fields["Label"];
            if (fields["Label"] != "FileName") {
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
            
            Filter.onkeyup = function (event) {
                var theValue = this.value;
                if (theValue.length > 0) {
                    var checkForDrop = this.parentElement.querySelector(".DropDown");
                    if (checkForDrop) {
                        if (checkForDrop.style.display == "none") {
                            this.click();

                        }
                    }
                    if (window.location.href.indexOf("DraftPolicies") >= 0) {
                        var getInputs = document.getElementById("FrameBody").querySelectorAll(".NameAndInput");
                        var SelectedDepartment = "";
                        for (var j = 0; j < getInputs.length; j++) {
                            if (getInputs[j].id == "Department") {
                                var getInput = getInputs[j].querySelector(".Filter");
                                SelectedDepartment = getInput.value;
                            }
                        }
                        if (SelectedDepartment) {
                            Pnp.getAndSearchusers(this, this.parentElement, theValue, SelectedDepartment);
                        } else {
                            Pnp.drawErrorMsg("Please Select A Department");
                            this.value = "";
                        }

                    } else {
                        Pnp.getAndSearchusers(this, this.parentElement, theValue);
                    }
                } else {
                    var checkForDrop = this.parentElement.querySelector(".DropDown");
                    if (checkForDrop) {
                        if (checkForDrop.style.display != "none") {
                            this.click();

                        }
                    }
                }
            }
            if (fields["DefaultValue"] != "") {
                Filter.value = fields["DefaultValue"];
            }
            if (fields["backgroundImage"] != "") {
                Filter.style.backgroundImage = "url(" + fields["backgroundImage"] + ")";
                if (fields["backgroundImage"] == "/img/blackDrop.png") {
                    Filter.style.backgroundSize = "15px";
                }
            }
           
    },
    darwRelatedDocsFilter: function (fb, fields) {
        NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:3.5%;", "Id": "NameAndInput", "Parent": fb });
        InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:8%;margin-top:0.5%;text-align: left;", "Parent": NameAndInput });
        InputLabel.innerHTML = fields["Label"];
        if (i == 0) {
            NameAndInput.style.marginTop = "0.5%";
        }
        Filter = GHVHS.DOM.create({ "Type": "input", "Class": "Filter", "Id": "Filter", "Style": "background-image: url(/img/edit.png); background-size: 25px;padding-left:5px; box-shadow: 2px 2px 3px grey;width: 55%; height: 100%;", "Parent": NameAndInput });
        Filter.setAttribute("autocomplete", "Off");
        Filter.style.width = "53%";
        Filter.id = fields["Label"];
        if (fields["placeHolder"]) {
            Filter.setAttribute("placeholder", fields["placeHolder"]);
        }
        NameAndInput.id = fields["Label"];
        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.4%;margin-left: -5.5%;position: relative;", "Parent": NameAndInput });
        var greenCheck = GHVHS.DOM.create({ "Type": "img", "Src": "/img/greenCheck.png", "Class": "hide ", "Id": "greenCheck", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
        greenCheck.onclick = function () {
            var parent = this.parentElement.parentElement;
            var dropDown = parent.querySelector(".DropDown");
            var theFilter = parent.querySelector(".Filter");
            var IdToUse = "";
            var alldropOptions = dropDown.querySelectorAll(".DropOption");
            for (var i = 0; i < alldropOptions.length; i++) {
                if (theFilter.value == alldropOptions[i].innerText) {
                    IdToUse = alldropOptions[i].id;
                }
            }
            var frame = document.getElementById("FrameBody");
            var allPRDLabels = frame.querySelectorAll(".SingleRealatedDocNameLabel");
            var okayFlag = "Y";
            for (var i = 0; i < allPRDLabels.length; i++) {
                if (theFilter.value == allPRDLabels[i].innerText) {
                    okayFlag = "N";
                }
            }
            if (okayFlag == "Y") {
                Pnp.drawSingleRealatedDoc(theFilter.value, IdToUse, document.getElementById("SelectedArea"), "");
                theFilter.value = "";
                this.className = "hide";
                Filter.style.backgroundPosition = "94% center";
            } else {
                Pnp.drawErrorMsg(theFilter.value + " is already a selected related doc. ");
            }
            
        }
        var addDiv2 = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Style": "margin-top:2.3%;margin-left: -3%;position: relative;", "Parent": NameAndInput });
        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackX.png", "Class": "addimg ", "Id": "addimg ", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv2 });
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
        Filter.style.width = "53%";
        var addDiv = GHVHS.DOM.create({ "Type": "div", "Class": "addDiv ", "Id": "addDiv ", "Parent": NameAndInput });
        var greenCheck = GHVHS.DOM.create({ "Type": "img", "Src": "/img/greenCheck.png", "Class": "hide ", "Id": "addimg ", "Style": "max-width:60%;border-radius:50%;padding:2px 2px 2px 2px;", "Parent": addDiv });
        var addimg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/Add.png", "Class": "addimg ", "Id": "addimg ", "Parent": addDiv });
        var getFile = GHVHS.DOM.create({ "Type": "input", "InputType": "File", "Class": "hide", "Id": "PDRFile", "Parent": addDiv });
        addimg.onclick = function () {
            var getFileData = document.getElementById("PDRFile");
            getFileData.click();
        }
        getFile.onchange = function () {
            var getImg = this.parentElement.querySelectorAll(".addimg");
            var getFilter = this.parentElement.parentElement.querySelectorAll(".Filter");
            var IsID = document.getElementById("theID").innerText;
            Pnp.UploadFileToPDR(this, this.parentElement, getImg[0], getFilter, IsID);
        }
        greenCheck.onclick = function () {
            var getFileData = this.parentElement.querySelectorAll(".hide");
        }
        Filter.onkeyup = function (event) {
            var theValue = this.value;
            if (theValue.length > 0) {
                var checkForDrop = this.parentElement.querySelector(".DropDown");
                if (checkForDrop) {
                    if (checkForDrop.style.display == "none") {
                        this.click();

                    }
                }
                Pnp.getAndPRD(this, this.parentElement, theValue);
            } else {
                var checkForDrop = this.parentElement.querySelector(".DropDown");
                if (checkForDrop) {
                    if (checkForDrop.style.display != "none") {
                        this.click();

                    }
                }
            }
        }
        if (fields["backgroundImage"] != "") {
            Filter.style.backgroundImage = "url(" + fields["backgroundImage"] + ")";
            if (fields["backgroundImage"] == "/img/blackDrop.png") {
                Filter.style.backgroundSize = "15px";
            }
        }
    },
    getAndPRD: function (filter, parent, value) {
        var DropDown = parent.querySelector(".DropDown");
        if (DropDown) {
            while (DropDown.firstChild) {
                DropDown.removeChild(DropDown.firstChild);
            }
            DropDown.style.top = (filter.offsetTop + filter.offsetHeight) + "px";
            DropDown.style.left = filter.offsetLeft + "px";
        } else {
            DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": parent });
            DropDown.style.height = "1px";
            DropDown.style.display = "none";
            DropDown.style.transition = "height 0.4s ease";
            DropDown.style.top = (filter.offsetTop + filter.offsetHeight) + "px";
            DropDown.style.overflow = "auto";
            DropDown.style.backgroundColor = "white";
            Pnp.pastZIndex -= 1;
            DropDown.style.zIndex = Pnp.pastZIndex + "";
            DropDown.style.left = filter.offsetLeft + "px";
            DropDown.style.boxShadow = "2px 2px 6px grey";
            DropDown.style.width = filter.offsetWidth + "px";
            DropDown.style.position = "absolute";
            filter.onclick = function () {
                if (DropDown.style.height == "1px") {
                    DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                    DropDown.style.left = filter.offsetLeft + "px";
                    DropDown.style.display = "block";
                    setTimeout(function () {
                        DropDown.style.height = "130px";
                    }, 10);
                } else {
                    DropDown.style.height = "1px";
                    DropDown.style.top = (filter.offsetTop + filter.offsetHeight) + "px";
                    DropDown.style.left = filter.offsetLeft + "px";
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
        }
        function displayUsers(json, p) {
            for (var i = 0; i < json["Items"].length; i++) {
                var data = json["Items"][i]["Fields"];
                var filter = p[1];
                var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Id": data.Id, "Parent": p[0] });
                SingleOption.innerHTML = data.FileName ;
                SingleOption.onclick = function () {
                    filter.value = this.innerText;
                    filter.style.backgroundPosition = "89% center";
                    document.getElementById("greenCheck").className = "addimg";
                    filter.style.border = "1px solid silver";
                    Pnp.CheckAllFilters(filter);
                    DropDown.style.height = "1px";
                    setTimeout(function () {
                        DropDown.style.display = "none";
                    }, 500);
                }
            }
        }
        GHVHS.DOM.send({ "URL": "/Pnp/getRelatedDocuments?Search=" + value, "CallbackParams": [DropDown, filter], "Callback": displayUsers });

    },
    drawSingleRealatedDoc: function (Name, id, parent, url) {
        if (parent.innerText == "No Related Documents") {
            parent.innerHTML = "";
        }
        var tempNAme = Name.toLowerCase();
        if (tempNAme.indexOf(".docx") > 0) {
            url = "/img/fileIcon.png";
        } else if (tempNAme.indexOf(".doc") > 0) {
            url = "/img/fileIcon.png";
            continueUp = "Y";
        } else if (tempNAme.indexOf(".xlsx") > 0 || tempNAme.indexOf(".xls") > 0) {
            url = "/img/excell.jpeg";
        } else if (tempNAme.indexOf(".pptx") > 0 || tempNAme.indexOf(".ppt") > 0) {
            url = "/img/pptx.png";
        } else if (tempNAme.indexOf(".pdf") > 0 || tempNAme.indexOf(".PDF") > 0) {
            url = "/img/pdf.png";
        }
        SingleRealatedDoc = GHVHS.DOM.create({ "Type": "div", "Class": "SingleRealatedDoc ", "Id": id, "Parent": parent });
        SingleRealatedDoc.style.backgroundImage = "url(" + url + ")";
        SingleRealatedDocNameLabel = GHVHS.DOM.create({ "Type": "div", "Class": "SingleRealatedDocNameLabel ", "Content": Name, "Id": "SingleRealatedDocNameLabel", "Parent": SingleRealatedDoc });
        removLabel = GHVHS.DOM.create({ "Type": "div", "Class": "removLabel", "Parent": SingleRealatedDoc });
        removLabel.style.height = SingleRealatedDoc.offsetHeight + "px";
        RemoveImg = GHVHS.DOM.create({ "Type": "img", "Src": "/img/xWhite.png", "Class": "RemoveImg", "Parent": removLabel });
        RemoveImg.onclick = function () {
            parent.removeChild(this.parentElement.parentElement);
        }
    },
    Emails: [],
    pastZIndex: 900000,
    GlobalFilterDepoNames:"",
    getAndSearchusers: function (filter,parent,value, PDR) {
        var DropDown = parent.querySelector(".DropDown");
        if (DropDown) {
            while (DropDown.firstChild) {
                DropDown.removeChild(DropDown.firstChild);
            }
            if (document.getElementById("FrameBody")) {
                DropDown.style.top = ((filter.offsetTop + filter.offsetHeight) - document.getElementById("FrameBody").scrollTop) + "px";
            } else {
                DropDown.style.top = (filter.offsetTop + filter.offsetHeight) + "px";
            }
            DropDown.style.left = filter.offsetLeft + "px";
        } else {
            DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": parent });
            DropDown.style.height = "1px";
            DropDown.style.display = "none";
            DropDown.style.transition = "height 0.4s ease";
            if (document.getElementById("FrameBody")) {
                DropDown.style.top = ((filter.offsetTop + filter.offsetHeight) - document.getElementById("FrameBody").scrollTop) + "px";

            } else {

                DropDown.style.top = (filter.offsetTop + filter.offsetHeight)+"px";
            }
            DropDown.style.overflow = "auto";
            DropDown.style.backgroundColor = "white";
            Pnp.pastZIndex -= 1;
            DropDown.style.zIndex = Pnp.pastZIndex + "";
            DropDown.style.left = filter.offsetLeft + "px";
            DropDown.style.boxShadow = "2px 2px 6px grey";
            DropDown.style.width = filter.offsetWidth + "px";
            DropDown.style.position = "absolute";
            filter.onclick = function () {
                if (DropDown.style.height == "1px") {
                    if (document.getElementById("FrameBody")) {
                        DropDown.style.top = ((this.offsetTop + this.offsetHeight) - document.getElementById("FrameBody").scrollTop) + "px";
                    } else {
                        DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                    }
                    DropDown.style.left = filter.offsetLeft + "px";
                    DropDown.style.display = "block";
                    setTimeout(function () {
                        DropDown.style.height = "130px";
                    }, 10);
                } else {
                    DropDown.style.height = "1px";
                    if (document.getElementById("FrameBody")) {
                        DropDown.style.top = ((this.offsetTop + this.offsetHeight) - document.getElementById("FrameBody").scrollTop) + "px";
                    } else {
                        DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                    }
                    DropDown.style.left = filter.offsetLeft + "px";
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
        }
            function displayUsers (json, p){
                for (var i = 0; i < json["Items"].length; i++) {
                    var data = json["Items"][i]["Fields"];
                    var filter = p[1];
                    var nameCheck = p[2];
                    var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Parent": p[0] });
                    if (!nameCheck) {
                        SingleOption.innerHTML = data.DisplayName;
                        SingleOption.id = data.UserName
                    } else {
                        SingleOption.innerHTML = data.UserNameDisplay;
                    }
                    SingleOption.onclick = function () {
                        if (filter.id == "Concurrer") {
                            var checkValue = filter.value + "";
                            if (checkValue.indexOf(";") >= 0) {
                                filter.value = Pnp.checkAndFormatConurrers(this.innerText, filter.value);
                            } else {
                                filter.value = this.innerText +";";
                            }
                        } else {
                            filter.value = this.innerText;
                            filter.id = this.id;
                        }
                        filter.style.border = "1px solid silver";
                        Pnp.CheckAllFilters(filter);
                        DropDown.style.height = "1px";
                        setTimeout(function () {
                            DropDown.style.display = "none";
                        }, 500);

                    }
                    JsonValue = data.DisplayName;
                    tempValue = filter.value;
                    var splitCheck = [];
                    if (tempValue.indexOf(";") >= 0) {
                        splitCheck = tempValue.split(";");
                        var checkValue = splitCheck[splitCheck.length-1];
                    } else {
                        var checkValue = tempValue;
                    }
                    var check = checkValue.toLowerCase();
                    var check2 = JsonValue.toLowerCase(); 
                    if (check == check2) {
                        SingleOption.click();
                    }
                    
                }
            }
            var splitCheck = [];
            if (value.indexOf(";") >= 0) {
                splitCheck = value.split(";");
                var checkValue = splitCheck[splitCheck.length-1];
            } else {
                var checkValue = value;
            }
           
            if (PDR) {
                var newValue = "";

                for (var i = 0; i < Pnp.Departments.length; i++) {
                    if (Pnp.Departments[i].Name == PDR) {
                        newValue = Pnp.Departments[i].Id;
                    }
                }
                if (filter.id == "Concurrers") {
                    GHVHS.DOM.send({ "URL": "/Pnp/GetUserInRoles?UserNameDisplay=" + checkValue + "&Role=Concurrer,Admin,DeptAdmin", "CallbackParams": [DropDown, filter, PDR], "Callback": displayUsers });
                } else if (filter.id == "Approver") {
                    GHVHS.DOM.send({ "URL": "/Pnp/GetUserInRoles?UserNameDisplay=" + checkValue + "&Role=Approver,Admin,DeptAdmin", "CallbackParams": [DropDown, filter, PDR], "Callback": displayUsers });
                }
            } else {
                var value2 = checkValue;
                if (checkValue.indexOf(" ") >= 0) {
                    var splitCheck = checkValue.split(" ");
                    checkValue = splitCheck[0];
                    value2 = splitCheck[1];
                }
                GHVHS.DOM.send({ "URL": "/Pnp/getUsers?FirstName=" + checkValue + "&LastName=" + value2, "CallbackParams": [DropDown, filter], "Callback": displayUsers });
            }
       
    },
    checkAndFormatConurrers: function (newAdd, value) {
        var returnValue = "";
        var getOptions = Pnp.AllUsers;
        if (value != "") {
                var flag = "";
                var valueToAdd = "";
                var splitCheck = [];
                var NewValueToAdd = newAdd;
                if (value.indexOf(";") >= 0) {
                    splitCheck = value.split(";");
                } else {
                    splitCheck.push(value);
                }
                for (var k = 0; k < splitCheck.length; k++) {
                    for (var j = 0; j < getOptions["Items"].length; j++) {
                        var data = getOptions["Items"][j]["Fields"];
                        var name = data.FirstName + " " + data.LastName;
                        var checkValue = name.toLowerCase();
                        var SplitValue = splitCheck[k].toLowerCase();
                        if (SplitValue == checkValue) {
                            valueToAdd += name + ";";
                        }
                    }
                }
                for (var j = 0; j < getOptions["Items"].length; j++) {
                    if (getOptions["Items"][j]["Fields"]) {
                        var data = getOptions["Items"][j]["Fields"];
                        var name = data.FirstName + " " + data.LastName;
                        var checkValue = name.toLowerCase();
                        var FilterValue = NewValueToAdd.toLowerCase();
                        if (FilterValue == checkValue) {
                            flag = "Y";
                            NewValueToAdd = name;
                        }
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
                } 
                returnValue = valueToAdd;
            } else {
                returnValue = value + ";";
            }
        return returnValue;
    },
    drawConcurrerFilter: function (filter, parent, list, Multi, ParamRedirect) {
       
        var DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": parent });
        DropDown.style.height = "1px";
        DropDown.style.display = "none";
        DropDown.style.transition = "height 0.4s ease";
        if (document.getElementById("FrameBody")) {
            DropDown.style.top = ((this.offsetTop + this.offsetHeight) - document.getElementById("FrameBody").scrollTop) + "px";
        } else {
            DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
        }
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
                if (document.getElementById("FrameBody")) {
                    DropDown.style.top = ((this.offsetTop + this.offsetHeight) - document.getElementById("FrameBody").scrollTop)+ "px";
                }else{
                    DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                }
                DropDown.style.display = "block";
                setTimeout(function () {
                    DropDown.style.height = "130px";
                }, 10);
            } else {
                DropDown.style.height = "1px";
                if (document.getElementById("FrameBody")) {
                    DropDown.style.top = ((this.offsetTop + this.offsetHeight) - document.getElementById("FrameBody").scrollTop) + "px";
                } else {
                    DropDown.style.top = (this.offsetTop + this.offsetHeight) + "px";
                }
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
        var checkMulti = Multi;
        var checkRedirect = ParamRedirect;
        for (var i = 0; i < list.length; i++) {
            var SingleOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Parent": DropDown });
            if (checkMulti == "SelectLoco") {
                SingleOption.innerHTML = list[i].Description;
            } else {
                SingleOption.innerHTML = list[i].Name;
            }
            
            SingleOption.onclick = function () {
                    
                filter.value = this.innerText;
               
                filter.style.border = "1px solid silver";
                
                if (filter.id == "Category") {
                     Pnp.GlobalFilterDepoNames = "";
                    var getFilters = filter.parentElement.parentElement.querySelectorAll(".Filter");
                    var getDepartmentFilter;
                    for (var i = 0; i < getFilters.length; i++){
                        if (getFilters[i].id == "Department"){
                            getDepartmentFilter = getFilters[i];
                        }
                    }
                    var getAllDepoOptions = getDepartmentFilter.parentElement.querySelectorAll(".DropOption");
                    var dropDown  = getDepartmentFilter.parentElement.querySelector(".DropDown");
                    for (var i = 0; i < Pnp.Departments.length; i++) {
                        var getCat = Pnp.Departments[i].Category.toLowerCase().trim();
                        var checkValue = this.innerText.toLowerCase().trim();
                        if (getCat == checkValue) {
                            Pnp.GlobalFilterDepoNames += Pnp.Departments[i].Name.toLowerCase().trim() + ";";
                        }
                    }
                    for (var i = 0; i < getAllDepoOptions.length; i++) {
                        var getValue = getAllDepoOptions[i].innerHTML.toLowerCase().trim();
                        if (Pnp.GlobalFilterDepoNames.indexOf(getValue) >= 0) {
                            getAllDepoOptions[i].className = "DropOption";
                        } else {
                            getAllDepoOptions[i].className = "hide";
                        }
                    }
                }
                Pnp.CheckAllFilters(filter);
                DropDown.style.height = "1px";
                setTimeout(function () {
                    DropDown.style.display = "none";
                }, 400);
                if (checkMulti) {
                    if (checkMulti == "UserInRoles") {
                        Admin.SelectedMulit(this.innerText, "UserInRoles");
                    
                    }else if (checkMulti == "SelectLoco"){
                        Pnp.SelectedLocation(this.innerText);
                    }else {
                        Admin.SelectedMulit(this.innerText);
                    }
                } else if (checkRedirect) {
                    var id = "";
                    if (Admin.DepoDrop.length > 0) {
                        for (var z = 0; z < Admin.DepoDrop.length; z++) {
                            if (Admin.DepoDrop[z].Name == this.innerText) {
                                id = Admin.DepoDrop[z].Id;
                            }
                        }
                    } else {
                        for (var z = 0; z < Pnp.Departments.length; z++) {
                            if (Pnp.Departments[z].Name == this.innerText) {
                                id = Pnp.Departments[z].Id;
                            }
                        }
                    }
                    if (window.location.href.indexOf("?" + checkRedirect) >= 0) {
                        var getBase = window.location.href.split("?");
                        window.location.href = getBase[0] + "?" + checkRedirect + "=" + id;
                    } else {
                        window.location.href = window.location.href + "?" + checkRedirect + "=" + id;
                    }
                }
            }
        }
        
    },
    SelectedLocation: function (Value) {
        var getLocationName = "";
        for (var i = 0; i < Pnp.Departments.length; i++){
            if (Pnp.Departments[i].Name == Value) {
                getLocationName = Pnp.Departments[i].LocationName;
            }
        }
        var getInputs = document.getElementById("FrameBody").querySelectorAll(".NameAndInput");
        for (var j = 0; j < getInputs.length; j++) {
            if (getInputs[j].id == "Location") {
                var getInput = getInputs[j].querySelector(".Filter");
                getInput.value = getLocationName;
            }
        }
    },
    UploadFileToPDR:function(file, parentElem, img, filter, id){
        var ogImg = img.src;
        img.src = "/img/loadingDoc.gif";
        var fileStuff = file.files[0];
        var Type = fileStuff.name;
        var Lowered = Type.toLowerCase();
        Lowered = Lowered.replace("&", " ");
        var url = "Blank";
        var formData = new FormData();
        formData.append('file', fileStuff);
        var Extension = "." + Lowered.split('.').pop();

        if (Extension.indexOf(".docx") >= 0) {
            url = "/img/fileIcon.jpeg";
        } else if (Extension.indexOf(".doc") >= 0) {
            url = "/img/fileIcon.jpeg";
            continueUp = "Y";
        } else if (Extension.indexOf(".xlsx") >= 0 || Extension.indexOf(".xls") >= 0) {
            url = "/img/excell.jpeg";
        } else if (Extension.indexOf(".pptx") >= 0 || Extension.indexOf(".ppt") >= 0) {
            url = "/img/pptx.png";
        } else if (Extension.indexOf(".pdf") >= 0 || Extension.indexOf(".PDF") >= 0) {
            url = "/img/pdf.png";
        }
        function createdFile(json, p) {
            if (json["data"].indexOf("Error") >= 0) {

                Pnp.drawErrorMsg("An Error Occurred. Please Try Again Later, If the Issue continues please contact your administator.");
                var ogimg = p[3];
                var theImg = p[2];
                theImg.src = ogimg;

            }else{
                var theImgUrl = p[1];
                var theImg = p[2];
                var filter = p[0];
                var ogimg = p[3];
                var name = p[4];
                theImg.src = ogimg;
                var parent = document.getElementById("SelectedArea");
                Pnp.drawSingleRealatedDoc(name, json["data"][0], parent, url);
            } 
        }
        var format = /[!@#$%^&*+\-=\[\]{};':"\\|,<>\/?]+/;
        if (format.test(Lowered)) {
            Pnp.globalContinue = "N";
            var getFrame = document.getElementById("IFrame");
            var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Parent": getFrame });
            Error.innerHTML = "One of the following characters in '" + Lowered + "' is not allowed in file name ";
            Error.style.top = 50 + "px";
            Error.style.width = "300px"
            Error.style.left = (((getFrame.offsetWidth / 2) - 200)) + "px";
            var ErrorOff = setTimeout(function () {
                document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
            }, 7000);
            file.value = ''
            img.src = ogImg;
        } else {
            if (url != "Blank") {
                GHVHS.DOM.send({ "URL": "/Pnp/UploadFilePDR?list=PoliciesRelatedDocuments&FileName=" + Lowered + "&itemId=" + id, "PostData": formData, "CallbackParams": [filter, url, img, ogImg, Lowered], "Callback": createdFile, "Method": "POST" });
            } else {
                Pnp.drawErrorMsg("Sorry, " + Extension + " is not currently support for Related Documents.");
            }
        }

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
    },
    TempData:[],
    GetFileHistory: function (id, data) {
        GHVHS.DOM.send({ "URL": "/Pnp/GetPolicyFileHistory?PolicyId=" + id, "Callback": Pnp.DrawPolicyFileHistory, "CallbackParams": data });
    },
    DrawPolicyFileHistory: function (json, p) {
        var app = document.getElementById("canvas");
        var canvas2 = GHVHS.DOM.create({ "Type": "div", "Class": "canvas2 ", "Id": "canvas2 ", "Parent": app });
        var whiteX = GHVHS.DOM.create({ "Type": "img", "Src": "/img/xWhite.png", "Class": "whiteX", "Id": "whiteX ", "Parent": canvas2 });
        whiteX.onclick = function () {
            app.removeChild(canvas2);
            var broswer = GHVHS.DOM.getBrowserType();
            if (broswer == "IE") {
                if (document.getElementById("ViewFile").style.display == "none") {
                    document.getElementById("ViewFile").style.display = "block";
                }
            }
        }
        var broswer = GHVHS.DOM.getBrowserType();
        if (broswer == "IE") {
            if (document.getElementById("ViewFile").style.display != "none") {
                document.getElementById("ViewFile").style.display = "none";
            }
        }
        var Body = GHVHS.DOM.create({ "Type": "div", "Class": "IFrame ", "Id": "IFrame ", "Parent": canvas2 });
        
        var fileHistoryHeader = GHVHS.DOM.create({ "Type": "div", "Class": "fileHistoryHeader", "Id": "fileHistoryHeader", "Parent": Body });

        var TitleName = GHVHS.DOM.create({ "Type": "div", "Class": "TitleName", "Id": "TitleName","Content":"File History", "Parent": fileHistoryHeader });
        var TitleName2 = GHVHS.DOM.create({ "Type": "div", "Class": "TitleName", "Id": "TitleName", "Content": p["FileName"], "Parent": fileHistoryHeader });
        var FileHistoryBoday = GHVHS.DOM.create({ "Type": "div", "Class": "FileHistoryBoday", "Id": "FileHistoryBoday ", "Parent": Body });
        if (canvas2.offsetWidth < 1200) {
            Body.style.width = "95%";
            Body.style.right = "2.5%";
            Body.style.left = "2.5%";
            fileHistoryHeader.style.height = "15%";
            FileHistoryBoday.style.height = "85%";
        }
        for (var i = 0; i < json["FileHistory"].length; i++){
            var FileHistoryContainer = GHVHS.DOM.create({ "Type": "div", "Class": "FileHistoryContainer", "Id": "FileHistoryContainer", "Parent": FileHistoryBoday });
            var Name = json["FileHistory"][i]["Fields"]["FileName"];
            var tempNAme = Name.toLowerCase();
            var url = "";
            if (tempNAme.indexOf(".docx") > 0) {
                url = "/img/fileIcon.png";
            } else if (tempNAme.indexOf(".doc") > 0) {
                url = "/img/fileIcon.png";
                continueUp = "Y";
            } else if (tempNAme.indexOf(".xlsx") > 0 || tempNAme.indexOf(".xls") > 0) {
                url = "/img/excell.jpeg";
            } else if (tempNAme.indexOf(".pptx") > 0 || tempNAme.indexOf(".ppt") > 0) {
                url = "/img/pptx.png";
            }
            var FileIcon = GHVHS.DOM.create({ "Type": "img", "Src": url, "Class": "FileIcon", "Id": "FileIcon", "Parent": FileHistoryContainer });
            var FileNameHistory = GHVHS.DOM.create({ "Type": "div", "Class": "FileNameHistory", "Id": "FileNameHistory", "Parent": FileHistoryContainer });
            var SingleFileNameHistory = GHVHS.DOM.create({ "Type": "div", "Class": "SingleFileNameHistory", "Id": "SingleFileNameHistory", "Content": Name, "Parent": FileNameHistory });
            var Date = GHVHS.DOM.create({ "Type": "div", "Class": "SingleFileNameHistory", "Id": "SingleFileNameHistory", "Content": json["FileHistory"][i]["Fields"]["Date"], "Parent": FileNameHistory });
            var theSingleImg1 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/View.png", "Class": "actionImg", "Id": "NotView", "Parent": FileHistoryContainer });
            theSingleImg1.onclick = function () {
                if (this.id == "NotView") {
                    var tempdrawArrow = this.parentElement.querySelector(".drawArrow");
                    tempdrawArrow.style.transform = "rotate(0deg)";
                    var tempiframeFileHistory = this.parentElement.querySelector(".iframeFileHistory");
                    tempiframeFileHistory.style.display = "block";
                    setTimeout(function () {
                        tempiframeFileHistory.style.height = "400px";
                    }, 10);
                    this.id = "Viewing";
                } else {
                    var tempdrawArrow = this.parentElement.querySelector(".drawArrow");
                    var tempiframeFileHistory = this.parentElement.querySelector(".iframeFileHistory");
                    tempdrawArrow.style.transform = "rotate(180deg)";
                    tempiframeFileHistory.style.height = "1px";
                    setTimeout(function () {
                        tempiframeFileHistory.style.display = "none";
                       
                    }, 300);
                    this.id = "NotView";
                }

            }
            var theSingleImg2 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/DownloadLink.png", "Class": "actionImg", "Id": json["FileHistory"][i]["Fields"]["FilePath"], "Parent": FileHistoryContainer });
            theSingleImg2.onclick = function () {
                Pnp.Download(this.id);
            }
            var drawArrow = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackDrop.png", "Class": "drawArrow", "Id": "drawArrow", "Parent": FileHistoryContainer });
            drawArrow.onclick = function () {
                var tempdrawArrow = this.parentElement.querySelectorAll(".theSingleImg1");
                var toClick; 
                for (var j = 0; j < tempdrawArrow.length; j++ ){
                    if (tempdrawArrow[j].id == "NotView" && tempdrawArrow[j].id == "Viewing") {
                        toClick = tempdrawArrow[j];
                    }
                }
                toClick.click();
            }
            var iframeFileHistory = GHVHS.DOM.create({ "Type": "iframe", "Class": "iframeFileHistory", "Id": "iframeFileHistory", "Src": json["FileHistory"][i]["Fields"]["PDFPath"], "Parent": FileHistoryContainer });
           
        }

    },
    Download: function (path) {
        var TopElement = document.getElementById("canvas");
        var Broswer = GHVHS.DOM.getBrowserType();
        if (Broswer != "IE") {
            var link = GHVHS.DOM.create({ "Type": "a", "Class": "hide", "Id": "hid", "Href": path, "Parent": TopElement });
            link.setAttribute("download", "");
            link.click();
            TopElement.removeChild(link);
        } else {
            const frame = document.createElement("iframe");
            document.body.appendChild(frame);
            if (json["data"].indexOf(".docx") >= 0) {
                frame.contentWindow.document.open("application/vnd.openxmlformats-officedocument.wordprocessingml.document", "replace");
            } else if (json["data"].indexOf(".doc") >= 0) {
                frame.contentWindow.document.open("application/msword", "replace");
            } else if (json["data"].indexOf(".pdf") >= 0) {
                frame.contentWindow.document.open("application/pdf", "replace");
            }
            frame.contentWindow.document.write(path);
            frame.contentWindow.document.close();

            frame.contentWindow.focus();
            frame.contentWindow.document.execCommand("SaveAs", true, path);
            document.body.removeChild(frame);

        }
    },
    drawMantainenceForPnp: function (Elem, Message) {
        document.getElementById("header").style.display = "none";
        document.getElementById("canvas").style.overflowY = "hidden";
        Elem.style.height = "110%";
        var Constructon = GHVHS.DOM.create({ "Type": "div", "Class": "Constructon", "Id": "Constructon", "Parent": Elem });
        var ConstructonOverlay = GHVHS.DOM.create({ "Type": "div", "Class": "ConstructonOverlay", "Id": "ConstructonOverlay", "Parent": Constructon });
        var href = GHVHS.DOM.create({ "Type": "a", "Href": "/", "Id": "TitleMantainence", "Parent": ConstructonOverlay });
        var logoMaint = GHVHS.DOM.create({ "Type": "img", "Src": "https://garnethealth.org/wp-content/uploads/2020/05/Garnet-Health-logo.png", "Class": "logoMaint", "Id": "logoMaint ", "Parent": href });
       
        var TitleMantainence = GHVHS.DOM.create({ "Type": "div", "Class": "TitleMantainence", "Id": "TitleMantainence", "Parent": ConstructonOverlay });
       
        var messageMain = GHVHS.DOM.create({ "Type": "div", "Class": "messageMain", "Id": "messageMain", "Parent": ConstructonOverlay });
        var bannerMaintanence = GHVHS.DOM.create({ "Type": "img", "Src": "/img/PnP.jpg", "Class": "bannerMaintanence", "Id": "bannerMaintanence ", "Parent": ConstructonOverlay });
        for (var i = 0; i < 3; i++){
            Message = Message.replace("%", "<br>");
        }
        messageMain.innerHTML = Message;
       
        EmailButton = GHVHS.DOM.create({ "Type": "a", "Class": "EmailButton","Href":"mailto:jmuller3@garnethealth.org", "Id": "EmailButton","Content":"Contact Us", "Parent": ConstructonOverlay });
    }
    
}; 