var Admin = {
    AdminDepartment:"", 
    drawDeparmentAdminPage: function (depos, roles, Username, Title, depo) {
        if (roles == null){
            window.location.href = window.location.href;
        }
        Admin.AdminDepartment = depo;
        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu("Department Administration", Elem, "");
        Pnp.DrawTopBar(Username, Elem, Title, "");
        Admin.drawTitleDropDown();
        var ContentCloumn1 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn1", "Id": "ContentCloumn1", "Parent": Elem });
        Admin.drawColumn1(ContentCloumn1, depos, roles, depo);
        var ArrowContainer = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainer", "Id": "ArrowContainer", "Parent": Elem });
        Admin.DrawArrows(ArrowContainer);
        var ContentCloumn2 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn2", "Id": "ContentCloumn2", "Parent": Elem });
        Admin.drawColumn2(ContentCloumn2, depo);
    },
    drawColumn1: function (ContentCloumn1, depos, roles, depo) {
        var CloumnTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CloumnTitle", "Id": "CloumnTitle","Style":"padding-bottom:5%;", "Content":"Select Department and User","Parent": ContentCloumn1 });
        var inputs = [{ "Label": "Department", "DefaultValue": "", "DropDown": depos, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
               { "Label": "User", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Type to Search For Users...", "FilterType": "Y" },
       { "Label": "Roles", "DefaultValue": "", "DropDown": roles, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" }, ];
        if (depo) {
            var DepoDrop = [];
            var temp = depo.split("|");
            for (var j = 0; j < temp.length; j++) {
                if (temp[j] != "") {
                    var depoName = "";
                    for (var i = 0; i <  depos.length; i++){
                        if (depos[i].Id == temp[j]) {
                            depoName = depos[i].Name;
                        }
                    }
                    DepoDrop.push({ "Name": depoName });
                }
            }
            var inputs = [{ "Label": "Department", "DefaultValue": DepoDrop[0].Name, "DropDown": DepoDrop, "backgroundImage": "/img/blackDrop.png", "FilterType": "N", },
              { "Label": "User", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Type to Search For Users...", "FilterType": "Y" },
              { "Label": "Roles", "DefaultValue": "", "DropDown": roles, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" }, ];
        }
        Pnp.DrawFilter(ContentCloumn1, inputs[0]);
        Pnp.drawUserSearchFilter(ContentCloumn1, inputs[1]);
        Pnp.DrawFilter(ContentCloumn1, inputs[2]);

        var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
        var getAllInputLabel = ContentCloumn1.querySelectorAll(".InputLabel ");
        for (var i = 0; i < getAllNameAndinputs.length; i++){
            getAllNameAndinputs[i].style.marginBottom = "6%";
            getAllNameAndinputs[i].style.height = "6%";
            
        }
        for (var i = 0; i < getAllInputLabel.length; i++) {
            getAllInputLabel[i].style.color = "white";
            getAllInputLabel[i].style.textShadow = "0.1px 0.1px 2px black";
            getAllInputLabel[i].style.fontSize = "20px";
        }
    },
    drawColumn2: function (ContentCloumn2, depo, search, page) {
        var d = new Date();
        var n = d.getTime();
        if (search){
            n += "&UserNameDisplay=" + search;
        }
        if (!search) {
            if (page){
                n += "&Offest=" + page ;
            } else {
                n += "&Offest=1";
            }
        }
        setTimeout(function () {
            GHVHS.DOM.DrawSmallLoader2(ContentCloumn2);
        }, 50);
       
        if (Admin.AdminDepartment) {
            GHVHS.DOM.send({ "URL": "/Pnp/GetUserInRoles?DepartmentName=" + Admin.AdminDepartment + "&Dummy=" + n, "Callback": Admin.drawAllUsersInRoles, "CallbackParams": ContentCloumn2 });
        } else {
            GHVHS.DOM.send({ "URL": "/Pnp/GetUserInRoles?Dummy=" + n, "Callback": Admin.drawAllUsersInRoles, "CallbackParams": ContentCloumn2 });
        }
    },
    DrawArrows:function(parent){
        var ArrowContainer1 = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainerSmall","Style":"margin-top:60%;",  "Id": "ArrowContainer1", "Parent": parent });
        var Arrows1 = GHVHS.DOM.create({ "Type": "img","Src":"/img/whiteDoubleArrows.png", "Class": "Arrows", "Id": "Arrows1", "Parent": ArrowContainer1 });
        ArrowContainer1.onclick = function () {
            if (this.className == "ArrowContainerSmall") {
                Admin.CheckAndCreateNewEntry();
            } else {
                Admin.drawErrorMsg("Please Enter a correct value");
            }
        }

        var ArrowContainer2 = GHVHS.DOM.create({ "Type": "div", "Class": "ArrowContainerSmall", "Id": "ArrowContainer2", "Parent": parent });
        var Arrows2 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/whiteDoubleArrows.png", "Class": "Arrows rotate", "Id": "Arrows2", "Parent": ArrowContainer2 });
        Arrows2.onclick = function () {
            Admin.CheckAndDelete();
        }
    },
    CheckAndDelete:function(){
        var checkForSelected = document.getElementById("ContentCloumn2").querySelector(".SingleUserInRoleSelected");
        if (checkForSelected) {
            var allFields = checkForSelected.querySelectorAll(".SingleFields");
            var department = "";
            var UserName = "";
            var Role = "";
            var subUserName = "";
            for (var i = 0; i < allFields.length; i++) {
                if (allFields[i].id == "DepartmentName") {
                    department = allFields[i].innerHTML; 
                } else if (allFields[i].id == "UserNameDisplay") {
                    UserName = allFields[i].innerHTML;
                } else if (allFields[i].id == "Role") {
                    Role = allFields[i].innerHTML;
                } else if (allFields[i].id == "UserName") {
                    subUserName = allFields[i].innerHTML;
                   
                }
            }

            var inputFields = document.getElementById("ContentCloumn1").querySelectorAll(".Filter");
            if (inputFields) {
                for (var i = 0; i < inputFields.length; i++) {
                    if (inputFields[i].id == "Department") {
                        inputFields[i].value = department; 
                    } else if (inputFields[i].parentElement.id == "Roles") {
                    
                        inputFields[i].value = Role;
                    }else if (inputFields[i].id == "User") {
                        inputFields[i].value = UserName;
                        var getID = "";
                        for (var j = 0; j < Pnp.AllUsers["Items"].length; j++) {
                            var name = Pnp.AllUsers["Items"][j]["Fields"]["FirstName"] + " " + Pnp.AllUsers["Items"][j]["Fields"]["LastName"];
                            name = name.trim().toLowerCase();
                            if (UserName.trim().toLowerCase() == name) {
                                getID = Pnp.AllUsers["Items"][j]["Fields"]["UserName"];
                            }
                        }
                        if (getID == "") {
                            Admin.drawErrorMsg("Please select an assignment. ")
                        } else {
                            inputFields[i].id = getID;
                        }
                    } else if (inputFields[i].parentElement.id == "User") {
                        inputFields[i].value = UserName;
                    } else if (inputFields[i].id == "Roles") {
                        inputFields[i].value = Role;
                    }
                }
            }
            var GetDepoId = Admin.AllUsersinRoles[Number(checkForSelected.id)]["Fields"]["DepartmentID"];
            GHVHS.DOM.send({ "URL": "/Pnp/DeleteUserInRole?id=" + subUserName + "&Department=" + GetDepoId, "Callback": Admin.ErrorOrRedrawPage, "CallbackParams": "Y" });
        } else {
            Admin.drawErrorMsg("Please select an assignment. ")
        }
    },
    drawTitleDropDown: function () {
        setTimeout(function () {
            var getTitleElement = document.getElementById("TitlePnp");
            getTitleElement.style.cursor = "pointer";
            var lodingImg = GHVHS.DOM.create({ "Type": "img", "Class": "CArrowEdit", "Id": "titleArrow", "Src": "/img/blackDrop.png", "Style": "Height:15px;transition: transform 0.2s ease 0s; transform: rotate(180deg);", "Parent": getTitleElement });
            var list = [
            { "link": "/Pnp/Administration/Department", "Content": "Department Administration" },
            { "link": "/Pnp/Administration/Role", "Content": "Role Administration" },
            { "link": "/Pnp/Administration/User", "Content": "User Administration" },
            { "link": "/Pnp/Administration/Transfer", "Content": "Transfer User" }];
            var top = (getTitleElement.parentElement.offsetHeight + getTitleElement.parentElement.offsetTop) + "px";
            var left = ((getTitleElement.parentElement.offsetWidth - 400) / 2) + "px";
            Admin.drawDrop(getTitleElement, getTitleElement, list, "200", "400px", top, left);
        }, 20);
    },
    AllUsersinRoles: [],
    SelectedPage: 1,
    GlobalSearchValue:"",
    drawAllUsersInRoles: function (json, p) {
        var masterElem = p;
        masterElem.removeChild(document.getElementById("FaxTableLoader"));
        if (!document.getElementById("SearchBarAssignments")) {
            var CloumnTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CloumnTitle", "Id": "CloumnTitle", "Content": "Assignments", "Parent": masterElem });
            var SearchBarAssignments = GHVHS.DOM.create({ "Type": "input", "Class": "SearchBarAssignments", "Id": "SearchBarAssignments", "Parent": masterElem });
            SearchBarAssignments.setAttribute("placeholder", "Search For Users...");
            if (Admin.GlobalSearchValue) {
                SearchBarAssignments.value = Admin.GlobalSearchValue;
                Admin.GlobalSearchValue = "";
            }
            SearchBarAssignments.onkeyup = function () {
                var value = this.value;
                if (value) {
                    if (value.length > 1) {
                        this.parentElement.removeChild(document.getElementById("UsersinRoles"));
                        document.getElementById("ContentCloumn2").removeChild(document.getElementById("PaginationContainer"));
                        Admin.drawColumn2(this.parentElement, "", value);
                    } else {
                        this.parentElement.removeChild(document.getElementById("UsersinRoles"));
                        document.getElementById("ContentCloumn2").removeChild(document.getElementById("PaginationContainer"));
                        Admin.drawColumn2(this.parentElement, "", "");
                    }
                } else {
                    this.parentElement.removeChild(document.getElementById("UsersinRoles"));
                    document.getElementById("ContentCloumn2").removeChild(document.getElementById("PaginationContainer"));
                    Admin.drawColumn2(this.parentElement, "", "");
                }
            }
        }
        Admin.DrawPagination(json["Count"], masterElem);
        var UsersinRoles = GHVHS.DOM.create({ "Type": "div", "Class": "UsersinRoles", "Id": "UsersinRoles", "Parent": masterElem });
        var columns = ["Department", "User", "UserName", "Role"];
        var dataColumns = ["DepartmentName", "UserNameDisplay", "UserName", "Role"];
        var SingleUserInRoleHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUserInRoleHeader", "Id": "SingleUserInRoleHeader", "Parent": UsersinRoles });
        for (var i = 0; i < columns.length; i++) {
              var SingleFieldsHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SingleFieldsHeader", "Id": "SingleFieldsHeader", "Content": columns[i], "Parent": SingleUserInRoleHeader });
            
        }
        Admin.AllUsersinRoles = json["Items"];
        for (var i = 0; i < json["Items"].length; i++) {
            if (json["Items"][i]["Fields"]["Role"]) {
                var SingleUserInRole = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUserInRole", "Id": "SingleUserInRole", "Parent": UsersinRoles });
                SingleUserInRole.onclick = function () {
                    var getAll = this.parentElement.querySelectorAll(".SingleUserInRoleSelected");
                    for (var j = 0; j < getAll.length; j++) {
                        getAll[j].className = "SingleUserInRole";
                    }
                    this.className = "SingleUserInRoleSelected";
                }
                SingleUserInRole.id = i + "";
                for (var j = 0; j < dataColumns.length; j++) {
                    var SingleFields = GHVHS.DOM.create({ "Type": "div", "Class": "SingleFields", "Id": "SingleFields", "Parent": SingleUserInRole });
                    SingleFields.innerHTML = json["Items"][i]["Fields"][dataColumns[j]];
                    SingleFields.id = dataColumns[j];
                }
            }
        }
    },
    DrawPagination: function (count, masterElem) {
        var PaginationContainer = GHVHS.DOM.create({ "Type": "div", "Class": "PaginationContainer", "Id": "PaginationContainer", "Parent": masterElem });
        var PaginationArrow1 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackDrop.png", "Class": "PaginationArrow1", "Id": "PaginationArrow1", "Parent": PaginationContainer });
        PaginationArrow1.onclick = function () {
            if (Admin.SelectedPage > 1) {
                Admin.SelectedPage = Admin.SelectedPage-1;
            }
            document.getElementById("ContentCloumn2").removeChild(document.getElementById("PaginationContainer"));
            document.getElementById("ContentCloumn2").removeChild(document.getElementById("UsersinRoles"));
            Admin.drawColumn2(document.getElementById("ContentCloumn2"), "", "", Admin.SelectedPage);
        }
        var NumberContainer = GHVHS.DOM.create({ "Type": "div", "Class": "NumberContainer", "Id": "NumberContainer", "Parent": PaginationContainer });
        var NumberOfPages = Math.abs(count / 50);
        var startNumber = Admin.SelectedPage;
        if (startNumber >= 15) {
            startNumber = startNumber - 10;
        } else {
            startNumber = 1;
        }
        
        for (var i = startNumber; i < NumberOfPages; i++) {
            var SinglePageNumber = GHVHS.DOM.create({ "Type": "div", "Class": "SinglePageNumber", "Id": "SinglePageNumber", "Parent": NumberContainer });
            SinglePageNumber.innerHTML = i + "";
            if (Admin.SelectedPage == i) {
                SinglePageNumber.style.color = "blue";
            }
            SinglePageNumber.onclick = function () {
                var value = this.innerHTML;
                Admin.SelectedPage = value;
                document.getElementById("ContentCloumn2").removeChild(document.getElementById("PaginationContainer"));
                document.getElementById("ContentCloumn2").removeChild(document.getElementById("UsersinRoles"));
                Admin.drawColumn2(document.getElementById("ContentCloumn2"), "", "", value);
            }
        }
        var PaginationArrow2 = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blackDrop.png", "Class": "PaginationArrow2", "Id": "PaginationArrow2", "Parent": PaginationContainer });
        PaginationArrow2.onclick = function () {
            Admin.SelectedPage = Number(Admin.SelectedPage) + 1;
            document.getElementById("ContentCloumn2").removeChild(document.getElementById("PaginationContainer"));
            document.getElementById("ContentCloumn2").removeChild(document.getElementById("UsersinRoles"));
            Admin.drawColumn2(document.getElementById("ContentCloumn2"), "", "", Admin.SelectedPage);
        }
    },
    CheckAndCreateNewEntry:function(){
        var ContentCloumn1 = document.getElementById("ContentCloumn1");
        var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
        var params = "";
        var errorCheck = "";
        var allFilters = [];
        for (var i = 0; i < getAllNameAndinputs.length; i++){
            var getFilter = getAllNameAndinputs[i].querySelector(".Filter");
            if (getFilter.value != ""){
                if (params=="") {
                    params += "?";
                } else {
                    params += "&"
                }
                if (getFilter.id == "Department") {
                    var newValue = "";
                    for (var j = 0; j < Pnp.Departments.length; j++) {
                        var departmentName = Pnp.Departments[j].Name.trim().toLowerCase();
                        var FilterValue = getFilter.value.trim().toLowerCase();
                        if (departmentName == FilterValue) {
                            newValue = Pnp.Departments[j].Id;
                        }
                    }
                    if (newValue != "") {
                        params += getFilter.id + "=" + newValue;
                    } else {
                        errorCheck = "Y";
                    }
                } else if (getFilter.parentElement.id == "Roles") {
                    params += getFilter.id + "=" + getFilter.value;
                    getFilter.id = "Roles";
                
                }else if (getFilter.parentElement.id == "User") {
                    
                    var pass = "N";
                    for (var j = 0; j < Pnp.AllUsers["Items"].length; j++) {
                        if (getFilter.value == Pnp.AllUsers["Items"][j]["Fields"].FirstName + " " + Pnp.AllUsers["Items"][j]["Fields"].LastName && getFilter.id == Pnp.AllUsers["Items"][j]["Fields"].UserName) {
                            pass = "Y"
                            Admin.GlobalSearchValue = getFilter.value;
                        } else if (getFilter.value == Pnp.AllUsers["Items"][j]["Fields"].DisplayName && getFilter.id == Pnp.AllUsers["Items"][j]["Fields"].UserName) {
                            pass = "Y"
                            Admin.GlobalSearchValue = getFilter.value;
                        }
                    }
                    if (pass == "Y") {
                        params += "User=" + getFilter.id;
                        getFilter.id = "User";
                    } else {
                        Admin.drawErrorMsg("Please Enter a valid User!");
                    }

                }
            } else {
                errorCheck = "Y";
                Admin.drawErrorMsg("Please Enter a correct value for "+ getFilter.id );
            }
            allFilters.push(getFilter);
        }
        if (errorCheck != "Y") {
            for (var i = 0; i < allFilters.length; i++) {
                allFilters[i].value = "";
            }
            GHVHS.DOM.send({ "URL": "/Pnp/AddUserInRoles" + params, "Callback": Admin.ErrorOrRedrawPage, "CallbackParams": "NewAdd" });
        } else {
            Admin.drawErrorMsg("Please Eneter a valid value" + getFilter.id);
        }
    },
    ErrorOrRedrawPage:function(json, p){
        if (json["Items"] == "Error User doesn't exist") {
            Admin.drawErrorMsg("Error User doesn't exist");
        } else {
            if (p) {
                if (p == "NewAdd") {
                    Admin.drawErrorMsg("Succussfully Added User!", "Y");
                } else if (p == "Y") {
                    Admin.drawErrorMsg("User Successfully Removed", "Y");
                }
            }
            var getSearchBar = document.getElementById("SearchBarAssignments");
            var searchValue = "";
            if (getSearchBar.value) {
                searchValue = getSearchBar.value;
                Admin.GlobalSearchValue = searchValue;
            } else if (Admin.GlobalSearchValue) {
                searchValue = Admin.GlobalSearchValue;
                for (var q = 0 ; q < Pnp.AllUsers["Items"].length; q++){
                    if (searchValue.toLowerCase().trim() == Pnp.AllUsers["Items"][q]["Fields"].DisplayName.toLowerCase().trim()) {
                        searchValue = Pnp.AllUsers["Items"][q]["Fields"].FirstName + " " + Pnp.AllUsers["Items"][q]["Fields"].LastName;
                    }
                }
            }
            var cc2 = document.getElementById("ContentCloumn2");
            while (cc2.firstChild) {
                cc2.removeChild(cc2.firstChild);
            }
           
            Admin.drawColumn2(cc2, "", searchValue);
        }
    },
    drawErrorMsg: function (msg, Green) {
        var getFrame = document.getElementById("Elem")
        var Error = GHVHS.DOM.create({ "Type": "div", "Class": "Error", "Id": "Error", "Content": msg, "Parent": getFrame });
        if (Green) {
            Error.style.color = "#026440";
        }
        Error.style.textAlign = "center";
        Error.style.height = "80px";
        Error.style.top = 120 + "px";
        Error.style.left = (((getFrame.offsetWidth / 2) - 100)) + "px";
        var ErrorOff = setTimeout(function () {
            document.getElementById("Error").parentElement.removeChild(document.getElementById("Error"));
        }, 3000);
    },
    drawDrop: function (filter, parent, list, height, width, top , left) {
        if (!height) {
            height = "70px";
        }
        var DropDown = GHVHS.DOM.create({ "Type": "div", "Class": "DropDown ", "Id": "DropDown ", "Parent": parent });
        var heighEle = GHVHS.DOM.create({ "Type": "div", "Class": "hide ", "Id": "heighEle", "Content": height, "Parent": DropDown });
        var topEle = GHVHS.DOM.create({ "Type": "div", "Class": "hide ", "Id": "topEle", "Content": top, "Parent": DropDown });
        DropDown.style.height = "1px";
        DropDown.style.display = "none";
        DropDown.style.transition = "height 0.4s ease";
        DropDown.style.top = (filter.offsetTop + filter.offsetHeight + 40) + "px";
        if (top) {
            DropDown.style.top = top;
        }
        DropDown.style.overflow = "auto";
        DropDown.style.backgroundColor = "white";
        DropDown.style.left = (filter.offsetLeft - 25) + "px";
        if (left) {
            DropDown.style.left = left;
        }
        DropDown.style.boxShadow = "2px 2px 5px grey";
        DropDown.style.width = (filter.offsetWidth ) + "px";
        if (width) {
            DropDown.style.width = width;
        }

        DropDown.style.position = "absolute";
        filter.onclick = function () {
            var DropDown = this.parentElement.parentElement.querySelectorAll(".DropDown");
            var carrot = document.getElementById("titleArrow");
            var heightElem = DropDown[0].querySelectorAll(".hide");
            if (DropDown[0].offsetHeight < 10) {
                DropDown[0].style.display = "block";
                setTimeout(function () {
                    DropDown[0].style.height = "200px";
                }, 10);
                if (carrot) {
                    carrot.style.transform = "rotate(0deg)";
                }
            } else {
                DropDown[0].style.height = "1px";
                setTimeout(function () {
                    DropDown[0].style.display = "none";
                }, 500);
                if (carrot) {
                    carrot.style.transform = "rotate(180deg)";
                }
            }
        }
        for (var i = 0; i < list.length; i++){
            var SingleOption = GHVHS.DOM.create({ "Type": "a", "Class": "DropOption","Style":"width:90%;float:left;height:30%;font-size:80%;", "Parent": DropDown });
            SingleOption.href = list[i].link;
            SingleOption.innerHTML = list[i].Content;
        }
    },
    drawTransferAdminPage: function (depos, roles, Username, Title, depo) {
        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu("Transfer User", Elem, "");
        Pnp.DrawTopBar(Username, Elem, Title, "");
        Admin.drawTitleDropDown();
        var ContentCloumn1 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn1", "Style": "transition:all .4s ease; width:60%;margin-left:15%;border:none;", "Id": "ContentCloumn1", "Parent": Elem });
        Admin.drawColumnTransfer(ContentCloumn1, depos, roles, depo);
       
        var ContentCloumn2 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn2", "Style":"transition:all .4s ease; width:0px;border:none;", "Id": "ContentCloumn2", "Parent": Elem });
        //Admin.drawColumn2Transfer(ContentCloumn2, depo);
    },
    drawColumnTransfer: function (ContentCloumn1, depos, roles, depo) {
        var CloumnTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CloumnTitle", "Id": "CloumnTitle", "Style": "padding-bottom:5%;", "Content": "Select Department and User To Tranfer", "Parent": ContentCloumn1 });
        var policyFolders = [{ "Name": "Approved" }, { "Name": "Archive" }, { "Name": "Draft" }, { "Name": "All" }]
        var inputs = [{ "Label": "Department", "DefaultValue": "", "DropDown": depos, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
               { "Label": "From User", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Type to Search For Users...", "FilterType": "Y" },
                { "Label": "Where User is ", "DefaultValue": "", "DropDown": roles, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
        { "Label": "On Policies", "DefaultValue": "", "DropDown": policyFolders, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" },
        { "Label": "To User", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Type to Search For Users...", "FilterType": "Y" }];
        
        Pnp.DrawFilter(ContentCloumn1, inputs[0]);
        Pnp.drawUserSearchFilter(ContentCloumn1, inputs[1]);
        Pnp.DrawFilter(ContentCloumn1, inputs[2]);
        Pnp.DrawFilter(ContentCloumn1, inputs[3]);
        Pnp.drawUserSearchFilter(ContentCloumn1, inputs[4]);

        var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
        var getAllInputLabel = ContentCloumn1.querySelectorAll(".InputLabel ");
        for (var i = 0; i < getAllNameAndinputs.length; i++) {
            getAllNameAndinputs[i].style.marginBottom = "1%";
            getAllNameAndinputs[i].style.height = "5%";

        }
        for (var i = 0; i < getAllInputLabel.length; i++) {
            getAllInputLabel[i].style.color = "white";
            getAllInputLabel[i].style.textShadow = "0.1px 0.1px 2px black";
            getAllInputLabel[i].style.fontSize = "20px";
        }

        var PreviewButton = GHVHS.DOM.create({ "Type": "div", "Class": "PreviewButton", "Id": "PreviewButton", "Content": "Preview", "Parent": ContentCloumn1 });
        PreviewButton.onclick = function () {
            var getColumnOne = document.getElementById("ContentCloumn1");
            var getColumnTwo = document.getElementById("ContentCloumn2");
            var getAllDropDowns = getColumnOne.querySelectorAll(".DropDown");
            for (var i = 0; i < getAllDropDowns.length; i++) {

            }
            setTimeout(function () {
                for (var i = 0; i < getAllDropDowns.length; i++) {
                    var getInputForHeight = getAllDropDowns[i].parentElement.querySelector(".Filter");
                    if (getInputForHeight) {
                        getAllDropDowns[i].style.top = (getInputForHeight.offsetHeight + getInputForHeight.offsetTop) + "px";
                        getAllDropDowns[i].style.left = getInputForHeight.offsetLeft + "px";
                    }
                }
            }, 250);
            if (getColumnOne.style.width != "46%") {
               
                this.innerHTML = "Close Preview";
                getColumnOne.style.marginLeft = "2.3%";
                getColumnOne.style.width = "46%";
                getColumnTwo.style.marginLeft = "5%";
                getColumnTwo.style.width = "44%";
                Admin.PreviewTransferPolicies();
            } else {
                this.innerHTML = "Preview";
                getColumnOne.style.marginLeft = "15%";
                getColumnOne.style.width = "60%";
                getColumnTwo.style.marginLeft = "0%";
                getColumnTwo.style.width = "0%";
                Admin.RemoveTransferPreview();
               
            }
        }
        var ApplyButton = GHVHS.DOM.create({ "Type": "div", "Class": "PreviewButton", "Id": "ApplyButton", "Style": "margin-top:3%;", "Content": "Apply", "Parent": ContentCloumn1 });

        ApplyButton.onclick = function () {
            var getColumnOne = document.getElementById("ContentCloumn1");
            var getAllNameAnddInputs = getColumnOne.querySelectorAll(".NameAndInput");
            var params = ""; 
            var startParam = "";
            var filterErrors = [];
            for (var i = 0; i < getAllNameAnddInputs.length; i++){
                var getInput = getAllNameAnddInputs[i].querySelector(".Filter");
                getInput.style.border = "1px solid silver";
                if (getAllNameAnddInputs[i].id == "Department") {
                    if (getInput.value) {
                        var newValue = "";
                        for (var j = 0; j < Pnp.Departments.length; j++) {
                            var departmentName = Pnp.Departments[j].Name.trim().toLowerCase();
                            var FilterValue = getInput.value.trim().toLowerCase();
                            if (departmentName == FilterValue) {
                                newValue = Pnp.Departments[j].Id;
                            }
                        }
                        if (newValue) {
                            startParam = "?department=" + newValue;
                        } else {
                            filterErrors.push(getInput);
                        }
                    } else {
                        filterErrors.push(getInput);
                    }
                } else if (getAllNameAnddInputs[i].id == "From User") {
                    if (getInput.id != "From User") {
                        var FilterValue = getInput.id.trim().toLowerCase();
                        params += "&oldUser=" + FilterValue;
                    } else {
                        filterErrors.push(getInput);
                    }
                } else if (getAllNameAnddInputs[i].id == "Where User is ") {
                    if (getInput.value) {
                        var FilterValue = getInput.value.trim().toLowerCase();
                        params += "&Role=" + FilterValue;
                    } else {
                        filterErrors.push(getInput);
                    }
                } else if (getAllNameAnddInputs[i].id == "On Policies") {
                    if (getInput.value) {
                        var FilterValue = getInput.value.trim().toLowerCase();
                        params += "&PolicyFolder=" + FilterValue;
                    } else {
                        filterErrors.push(getInput);
                    }
                } else if (getAllNameAnddInputs[i].id == "To User") {
                    if (getInput.id != "To User") {
                        var FilterValue = getInput.id.trim().toLowerCase();
                        params += "&newUser=" + FilterValue;
                    } else {
                        filterErrors.push(getInput);
                    }
                }

                if (filterErrors.length) {
                    for (var i = 0; i < filterErrors.length; i++) {
                        filterErrors[i].style.border = "2px solid red";
                    }
                    Admin.drawErrorMsg("Please enter a valid value");
                    GHVHS.DOM.RemoveSmallLoader2();

                } else {
                    function redrawCurrentPage(json) {
                        GHVHS.DOM.RemoveSmallLoader2();
                        if (json["Items"][0] == "true"){
                            Admin.drawErrorMsg("Successfully transfered!", "Y");
                            setTimeout(function () {
                                window.location.href = window.location.href;
                            }, 600);
                        } else {
                            Admin.drawErrorMsg(json["Items"][0]);
                        }
                    }
                }
            }
            var url = "/Pnp/TransferUsers" + startParam + params;
            GHVHS.DOM.DrawSmallLoader2();
            GHVHS.DOM.send({ "URL": url, "Callback": redrawCurrentPage, "CallbackParams": [] });
        }
    },
    RemoveTransferPreview:function(){
        var getCloumnTwo = document.getElementById("ContentCloumn2");

        while(getCloumnTwo.firstChild){
            getCloumnTwo.removeChild(getCloumnTwo.firstChild);
        }

    },
    PreviewTransferPolicies:function(){
        var getColumnOne = document.getElementById("ContentCloumn1");
        var ContentCloumn2 = document.getElementById("ContentCloumn2");
        GHVHS.DOM.DrawSmallLoader2(ContentCloumn2);
        var getAllNameAnddInputs = getColumnOne.querySelectorAll(".NameAndInput");
        var params = "";
        var startParam = "";
        var filterErrors = [];
        var oldUser, newUser, depo, policyFolder, role;
        for (var i = 0; i < getAllNameAnddInputs.length; i++) {
            var getInput = getAllNameAnddInputs[i].querySelector(".Filter");
            getInput.style.border = "1px solid silver";
            if (getAllNameAnddInputs[i].id == "Department") {
                if (getInput.value) {
                    var newValue = "";
                    for (var j = 0; j < Pnp.Departments.length; j++) {
                        var departmentName = Pnp.Departments[j].Name.trim().toLowerCase();
                        var FilterValue = getInput.value.trim().toLowerCase();
                        if (departmentName == FilterValue) {
                            newValue = Pnp.Departments[j].Id;
                        }
                    }
                    if (newValue) {
                        startParam = "?department=" + newValue;
                        depo = newValue;
                    } else {
                        filterErrors.push(getInput);
                    }
                } else {
                    filterErrors.push(getInput);
                }
            } else if (getAllNameAnddInputs[i].id == "From User") {
                if (getInput.id != "From User") {
                    var FilterValue = getInput.id.trim().toLowerCase();
                    params += "&oldUser=" + FilterValue;
                    oldUser = FilterValue;
                } else {
                    filterErrors.push(getInput);
                }
            } else if (getAllNameAnddInputs[i].id == "Where User is ") {
                if (getInput.value) {
                    var FilterValue = getInput.value.trim().toLowerCase();
                    params += "&Role=" + FilterValue;
                    role = FilterValue;
                } else {
                    filterErrors.push(getInput);
                }
            } else if (getAllNameAnddInputs[i].id == "On Policies") {
                if (getInput.value) {
                    var FilterValue = getInput.value.trim().toLowerCase();
                    params += "&PolicyFolder=" + FilterValue;
                    policyFolder = FilterValue;
                } else {
                    filterErrors.push(getInput);
                }
            } else if (getAllNameAnddInputs[i].id == "To User") {
                if (getInput.id != "To User") {
                    var FilterValue = getInput.id.trim().toLowerCase();
                    params += "&newUser=" + FilterValue;
                    newUser = FilterValue;
                } else {
                    filterErrors.push(getInput);
                }
            }
        }
            if (filterErrors.length) {
                for (var i = 0; i < filterErrors.length; i++) {
                    filterErrors[i].style.border = "2px solid red";
                }
                Admin.drawErrorMsg("Please enter a valid value");

            } else {

                var url = "/Pnp/PreviewTransferPolicies" + startParam + params;
                GHVHS.DOM.send({ "URL": url, "Callback": Admin.DrawTransferPreview, "CallbackParams": [oldUser, newUser, depo, policyFolder, role] });
            }
        
    },
    DrawTransferPreview: function (json, p) {
        Admin.RemoveTransferPreview();
        var CloumnTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CloumnTitle", "Id": "CloumnTitle", "Style": "padding-bottom:5%;", "Content": "Highlighted Value with be replaced with " + p[1] + " when Apply button is clicked", "Parent": document.getElementById("ContentCloumn2") });
        var UsersinRoles = GHVHS.DOM.create({ "Type": "div", "Class": "UsersinRoles", "Id": "TransferPreview", "Parent": document.getElementById("ContentCloumn2") });
        var columns = ["Title", "PolicyNumber", "Author", "Concurrers"];
        var dataColumns = ["Title", "PolicyNumber", "Author", "Concurrers"];
        var SingleUserInRoleHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUserInRoleHeader", "Id": "SingleUserInRoleHeader", "Parent": UsersinRoles });
        for (var i = 0; i < columns.length; i++) {
            var SingleFieldsHeader = GHVHS.DOM.create({ "Type": "div", "Class": "SingleFieldsHeader", "Id": "SingleFieldsHeader", "Content": columns[i], "Parent": SingleUserInRoleHeader });

        }
        if (json["Items"].length) {
            for (var i = 0; i < json["Items"].length; i++) {
                var SingleUserInRole = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUserInRole", "Id": "SingleUserInRole", "Parent": UsersinRoles });
                SingleUserInRole.id = json["Items"][i]["Fields"]["Id"];
                SingleUserInRole.onclick = function () {
                    Admin.openInNewTab("/Pnp/Policy/" + this.id);
                }
                for (var j = 0; j < dataColumns.length; j++) {
                    var SingleFields = GHVHS.DOM.create({ "Type": "div", "Class": "SingleFields", "Id": "SingleFields", "Parent": SingleUserInRole });
                    SingleFields.innerHTML = json["Items"][i]["Fields"][dataColumns[j]];
                    SingleFields.id = dataColumns[j];
                    if (dataColumns[j] == "Concurrers") {
                        if (json["Items"][i]["Fields"][dataColumns[j]].indexOf(p[0]) >= 0) {
                            var temp1 = SingleFields.innerHTML;
                            temp1 = temp1.replace(p[0], "<span style='background-color:yellow'>" + p[0] + "</span>");
                            SingleFields.innerHTML = temp1;
                        }
                    }
                }

            }
        } else {
            var SingleUserInRole = GHVHS.DOM.create({ "Type": "div", "Class": "SingleUserInRole", "Style":"text-align:center;", "Id": "SingleUserInRole", "Parent": UsersinRoles });
            SingleUserInRole.innerHTML = "No Results Where found ";
        }
    },
     openInNewTab:function(url) {
        window.open(url, '_blank').focus();
    },
    drawUserAdminPage: function (depos, roles, Username, Title, depo) {
        Admin.AdminDepartment = depo;
        if (roles == null) {
            //window.location.href = window.location.href;
        }

        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu("Department Administration", Elem, "");
        Pnp.DrawTopBar(Username, Elem, Title, "");
        Admin.drawTitleDropDown();
        var ContentCloumn1 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn1", "Id": "ContentCloumn1", "Style": "width:65%; margin-left:17.5%;", "Parent": Elem });
        Admin.drawAdminUserInputFields(depos, roles);
       
    },
    drawRoleAdminPage: function (depos, roles, Username, Title, depo) {
        Admin.AdminDepartment = depo;
        if (roles == null) {
            //window.location.href = window.location.href;
        }

        Pnp.UserName = Username;
        Elem = GHVHS.DOM.create({ "Type": "div", "Class": "Elem", "Id": "Elem", "Parent": document.getElementById("MainContent") });
        Pnp.drawSideMenu("Department Administration", Elem, "");
        Pnp.DrawTopBar(Username, Elem, Title, "");
        Admin.drawTitleDropDown();
        var ContentCloumn1 = GHVHS.DOM.create({ "Type": "div", "Class": "ContentCloumn1", "Id": "ContentCloumn1", "Style": "width:65%; margin-left:17.5%;", "Parent": Elem });
        Admin.drawRoleInputFields(depos, roles);

    },
    UrlDepartment: "",
    DepoDrop:[],
    drawRoleInputFields: function (depos, roles) {
        if (Admin.AdminDepartment) {
            var CloumnTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CloumnTitle", "Id": "CloumnTitle", "Style": "padding-bottom:5%;", "Content": "Select roles to add/change user access", "Parent": ContentCloumn1 });
            urlId = "";
            DefaultName = ""
            var temp = Admin.AdminDepartment.split("|");
            for (var j = 0; j < temp.length; j++) {
                if (temp[j] != "") {
                    var depoName = "";
                    for (var i = 0; i < depos.length; i++) {
                        if (depos[i].Id == temp[j]) {
                            depoName = depos[i].Name;
                        }
                        if (Admin.UrlDepartment) {
                            if (Admin.UrlDepartment == depos[i].Id) {
                                DefaultName = depos[i].Name;
                            }
                        }
                    }
                    Admin.DepoDrop.push({ "Name": depoName, "Id": temp[j] });
                }
            }
            if (Admin.UrlDepartment){
                urlId = Admin.UrlDepartment;
            } else {
                urlId = Admin.DepoDrop[0].Id;
                DefaultName = Admin.DepoDrop[0].Name;
            }
            if (DefaultName) {
                setTimeout(function () {
                    var getDepoInput = document.getElementById("Department");
                    var getParentElement = getDepoInput.parentElement;
                    var allDropOption  = getParentElement.querySelectorAll(".DropOption");
                    for (var i = 0; i < allDropOption.length; i++){
                        if (allDropOption[i].innerHTML == DefaultName) {
                            if (window.location.href.toLowerCase().indexOf("department=") < 0) {
                                allDropOption[i].click();
                            }
                        }
                    }
                },100)
            }
            var inputs = [{ "Label": "Department", "DefaultValue": DefaultName, "backgroundImage": "", "DropDown": Admin.DepoDrop, "FilterType": "N", "Redirect": "Y", },
                      { "Label": "Role", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "DropDown": roles, "placeHolder": "Click to Select a Role", "FilterType": "Y", "MultiSelected": "UserInRoles" },
              { "Label": "Users", "DefaultValue": "", "DropDown": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" }, ];
            Pnp.DrawFilter(ContentCloumn1, inputs[0]);
            ContentCloumn1.style.height = "80%";
            function drawOtherInputs(json, p) {
                Admin.DepartmentUsers = json;
                var elem = p[0];
                var input = p[1];
                var newDrop = [];
                var users = [];
                for (var i = 0; i < json["Items"].length; i++) {
                    users.push({ "Name": json["Items"][i]["Fields"]["UserNameDisplay"] });
                }

                input[2].DropDown = users;
                Pnp.DrawFilter(ContentCloumn1, input[1]);
                Admin.drawMultSelectField(ContentCloumn1, input[2])
                var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
                var getAllInputLabel = ContentCloumn1.querySelectorAll(".InputLabel ");
                for (var i = 0; i < getAllNameAndinputs.length; i++) {
                    getAllNameAndinputs[i].style.marginBottom = "5%";
                    getAllNameAndinputs[i].style.height = "6%";
                }
                for (var i = 0; i < getAllInputLabel.length; i++) {
                    getAllInputLabel[i].style.color = "white";
                    getAllInputLabel[i].style.textShadow = "0.1px 0.1px 2px black";
                    getAllInputLabel[i].style.fontSize = "20px";
                }
                SearchButtonSmall = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "margin-left:37.5%;height:40px;Width:25%;margin-top:150px;", "Content": "Save", "Parent": ContentCloumn1 });
                SearchButtonSmall.onclick = function () {
                    Admin.ValidateUsersForRoles();
                }
            }
            GHVHS.DOM.send({ "URL": "/Pnp/GetUserInRoles?DepartmentName=" + urlId, "Callback": drawOtherInputs, "CallbackParams": [ContentCloumn1, inputs] });
        } else {
            var depoName = Admin.UrlDepartment;
            for (var i = 0; i < depos.length; i++) {
                if (depos[i].Id == Admin.UrlDepartment) {
                    depoName = depos[i].Name;
                }
            }
            var CloumnTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CloumnTitle", "Id": "CloumnTitle", "Style": "padding-bottom:5%;", "Content": "Select roles to add/change user access", "Parent": ContentCloumn1 });
            var inputs = [{ "Label": "Department", "DefaultValue": depoName, "DropDown": depos, "backgroundImage": "", "FilterType": "N", "Redirect": "Y", "Redirect": "Department" },
                      { "Label": "Role", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "DropDown": roles, "placeHolder": "Click to Select a Role", "FilterType": "Y", "MultiSelected": "UserInRoles" },
              { "Label": "Users", "DefaultValue": "", "DropDown": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" }, ];
            Pnp.DrawFilter(ContentCloumn1, inputs[0]);
            ContentCloumn1.style.height = "80%";
            function drawOtherInputs(json, p) {
                Admin.DepartmentUsers = json;
                var elem = p[0];
                var input = p[1];
                var newDrop = [];
                var users = [];
                for (var i = 0; i < json["Items"].length; i++) {
                    users.push({ "Name": json["Items"][i]["Fields"]["UserNameDisplay"] });
                }

                input[2].DropDown = users;
                Pnp.DrawFilter(ContentCloumn1, input[1]);
                Admin.drawMultSelectField(ContentCloumn1, input[2])
                var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
                var getAllInputLabel = ContentCloumn1.querySelectorAll(".InputLabel ");
                for (var i = 0; i < getAllNameAndinputs.length; i++) {
                    getAllNameAndinputs[i].style.marginBottom = "5%";
                    getAllNameAndinputs[i].style.height = "6%";
                }
                for (var i = 0; i < getAllInputLabel.length; i++) {
                    getAllInputLabel[i].style.color = "white";
                    getAllInputLabel[i].style.textShadow = "0.1px 0.1px 2px black";
                    getAllInputLabel[i].style.fontSize = "20px";
                }
                SearchButtonSmall = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "margin-left:37.5%;height:40px;Width:25%;margin-top:150px;", "Content": "Save", "Parent": ContentCloumn1 });
                SearchButtonSmall.onclick = function () {
                    Admin.ValidateUsersForRoles();
                }
            }
            if (Admin.UrlDepartment) {

                GHVHS.DOM.send({ "URL": "/Pnp/GetUserInRoles?DepartmentName=" + Admin.UrlDepartment, "Callback": drawOtherInputs, "CallbackParams": [ContentCloumn1, inputs] });
            } else {
                var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
                var getAllInputLabel = ContentCloumn1.querySelectorAll(".InputLabel ");
                for (var i = 0; i < getAllNameAndinputs.length; i++) {
                    getAllNameAndinputs[i].style.marginBottom = "5%";
                    getAllNameAndinputs[i].style.height = "6%";
                }
                for (var i = 0; i < getAllInputLabel.length; i++) {
                    getAllInputLabel[i].style.color = "white";
                    getAllInputLabel[i].style.textShadow = "0.1px 0.1px 2px black";
                    getAllInputLabel[i].style.fontSize = "20px";
                }
            }
        }
    },
    drawAdminUserInputFields: function (depos, roles) {
        
        var CloumnTitle = GHVHS.DOM.create({ "Type": "div", "Class": "CloumnTitle", "Id": "CloumnTitle", "Style": "padding-bottom:5%;", "Content": "Select User to add/change roles", "Parent": ContentCloumn1 });
        if (!Admin.AdminDepartment) {

            var depoName = Admin.UrlDepartment;
            for (var i = 0; i < depos.length; i++) {
                if (depos[i].Id == Admin.UrlDepartment) {
                    depoName = depos[i].Name;
                }
            }
            var inputs = [{ "Label": "Department", "DefaultValue": depoName, "DropDown": depos, "backgroundImage": "", "FilterType": "N", "Redirect": "Department" },
                   { "Label": "User", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Click To Select a User", "FilterType": "Y", "MultiSelected": "Y" },
           { "Label": "Roles", "DefaultValue": "", "DropDown": roles, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" }, ];

            Pnp.DrawFilter(ContentCloumn1, inputs[0]);
            ContentCloumn1.style.height = "80%";
            function drawOtherInputs(json, p) {
                Admin.DepartmentUsers = json;
                var elem = p[0];
                var input = p[1];
                var newDrop = [];
                for (var i = 0; i < json["Items"].length; i++) {
                    newDrop.push({ "Name": json["Items"][i]["Fields"]["UserNameDisplay"] });
                }
                input[1].DropDown = newDrop;
                Pnp.DrawFilter(ContentCloumn1, input[1]);
                Admin.drawMultSelectField(ContentCloumn1, input[2])
                var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
                var getAllInputLabel = ContentCloumn1.querySelectorAll(".InputLabel ");
                for (var i = 0; i < getAllNameAndinputs.length; i++) {
                    getAllNameAndinputs[i].style.marginBottom = "5%";
                    getAllNameAndinputs[i].style.height = "6%";
                }
                for (var i = 0; i < getAllInputLabel.length; i++) {
                    getAllInputLabel[i].style.color = "white";
                    getAllInputLabel[i].style.textShadow = "0.1px 0.1px 2px black";
                    getAllInputLabel[i].style.fontSize = "20px";
                }
                SearchButtonSmall = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "margin-left:37.5%;height:40px;Width:25%;margin-top:150px;", "Content": "Save", "Parent": ContentCloumn1 });
                SearchButtonSmall.onclick = function () {
                    Admin.ValidateAndUpdateUser();
                }
            }
            if (Admin.UrlDepartment) {

                GHVHS.DOM.send({ "URL": "/Pnp/GetUserInRoles?DepartmentName=" + Admin.UrlDepartment, "Callback": drawOtherInputs, "CallbackParams": [ContentCloumn1, inputs] });
            } else {
                var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
                var getAllInputLabel = ContentCloumn1.querySelectorAll(".InputLabel ");
                for (var i = 0; i < getAllNameAndinputs.length; i++) {
                    getAllNameAndinputs[i].style.marginBottom = "5%";
                    getAllNameAndinputs[i].style.height = "6%";
                }
                for (var i = 0; i < getAllInputLabel.length; i++) {
                    getAllInputLabel[i].style.color = "white";
                    getAllInputLabel[i].style.textShadow = "0.1px 0.1px 2px black";
                    getAllInputLabel[i].style.fontSize = "20px";
                }
            }
           
        } else {
            var urlId = "";
            var DefaultName = "";
            var temp = Admin.AdminDepartment.split("|");
            for (var j = 0; j < temp.length; j++) {
                if (temp[j] != "") {
                    var depoName = "";
                    for (var i = 0; i < depos.length; i++) {
                        if (depos[i].Id == temp[j]) {
                            depoName = depos[i].Name;
                        }
                        if (Admin.UrlDepartment) {
                            if (Admin.UrlDepartment == depos[i].Id) {
                                DefaultName = depos[i].Name;
                            }
                        }
                    }
                    Admin.DepoDrop.push({ "Name": depoName, "Id": temp[j] });
                }
            }
            if (Admin.UrlDepartment) {
                urlId = Admin.UrlDepartment;
            } else {
                urlId = Admin.DepoDrop[0].Id;
                DefaultName = Admin.DepoDrop[0].Name;
            }
            var inputs = [{ "Label": "Department", "DefaultValue": DefaultName, "backgroundImage": "/img/blackDrop.png", "FilterType": "N", "FilterType": "N", "Redirect": "Department" },
                  { "Label": "User", "DefaultValue": "", "backgroundImage": "/img/blackDrop.png", "placeHolder": "Click To Select a User", "FilterType": "Y", "MultiSelected":"Y" },
          { "Label": "Roles", "DefaultValue": "", "DropDown": roles, "backgroundImage": "/img/blackDrop.png", "placeHolder": "Select A Value", "FilterType": "N" }, ];
            
                inputs[0].DropDown = Admin.DepoDrop;
                Pnp.DrawFilter(ContentCloumn1, inputs[0]);
                ContentCloumn1.style.height = "80%";
                function drawOtherInputs(json, p) {
                    Admin.DepartmentUsers = json;
                    var elem = p[0];
                    var input = p[1];
                    var newDrop = [];
                    for (var i = 0; i < json["Items"].length; i++) {
                        newDrop.push({ "Name": json["Items"][i]["Fields"]["UserNameDisplay"] });
                    }
                    input[1].DropDown = newDrop;
                    Pnp.DrawFilter(ContentCloumn1, input[1]);
                    Admin.drawMultSelectField(ContentCloumn1, input[2])
                    var getAllNameAndinputs = ContentCloumn1.querySelectorAll(".NameAndInput");
                    var getAllInputLabel = ContentCloumn1.querySelectorAll(".InputLabel ");
                    for (var i = 0; i < getAllNameAndinputs.length; i++) {
                        getAllNameAndinputs[i].style.marginBottom = "5%";
                        getAllNameAndinputs[i].style.height = "6%";
                    }
                    for (var i = 0; i < getAllInputLabel.length; i++) {
                        getAllInputLabel[i].style.color = "white";
                        getAllInputLabel[i].style.textShadow = "0.1px 0.1px 2px black";
                        getAllInputLabel[i].style.fontSize = "20px";
                    }
                    SearchButtonSmall = GHVHS.DOM.create({ "Type": "div", "Class": "SearchButtonSmall", "Id": "SearchButtonSmall", "Style": "margin-left:37.5%;height:40px;Width:25%;margin-top:150px;", "Content": "Save", "Parent": ContentCloumn1 });
                    SearchButtonSmall.onclick = function () {
                        Admin.ValidateAndUpdateUser();
                    }
                }

                GHVHS.DOM.send({ "URL": "/Pnp/GetUserInRoles?DepartmentName=" + urlId, "Callback": drawOtherInputs, "CallbackParams": [ContentCloumn1, inputs] });
            

          
        }
       

        
    },

    ValidateAndUpdateUser:function(){
        var getCloumConatiner = document.getElementById("ContentCloumn1");
        var getallInputFields = getCloumConatiner.querySelectorAll(".NameAndInput");
        var parms = "";
        var error = "";
        for (var i = 0; i < getallInputFields.length; i++) {
            if (parms == "") {
                parms += "?";
            } else {
                parms += "&";
            }
            if (getallInputFields[i].id == "Roles"){
                parms += "Roles=";
                var allSelected = getallInputFields[i].querySelectorAll(".SelectedOption");
                if (allSelected) {
                    var value  = "";
                    for (var j = 0; j < allSelected.length; j++) {
                        if (value == "") {
                            value += allSelected[j].innerText;
                        } else {
                            value += "," + allSelected[j].innerText;
                        }
                      
                    }
                    parms += value;
                } else {
                    error = "Roles";
                }
            } else {
                parms += getallInputFields[i].id;
                var getFilter = getallInputFields[i].querySelector("input");
                if (getFilter.value) {
                    parms += "=" + getFilter.value;
                } else {
                    error = getallInputFields[i].id;
                }
            }
        }
        if (error){
            Admin.drawErrorMsg("Please Select a value for "+ error);
        } else {
            GHVHS.DOM.send({ "URL": "/Pnp/UpdateRoleForUser" + parms, "Callback": Admin.redrawPage, "CallbackParams": [] });
        }
    },
    redrawPage:function(){
        window.location.href = window.location.href;
    },
    DepartmentUsers:[],
    drawMultSelectField: function (parent, fields) {
        NameAndInput = GHVHS.DOM.create({ "Type": "div", "Class": "NameAndInput", "Style": "margin-top:2%;height:3.5%;", "Id": "NameAndInput", "Parent": parent });
        InputLabel = GHVHS.DOM.create({ "Type": "div", "Class": "InputLabel ", "Id": "InputLabel ", "Style": "margin-left:8%;margin-top:0.5%;text-align: left;", "Parent": NameAndInput });
        InputLabel.innerHTML = fields["Label"];
        NameAndInput.id = fields["Label"];
        var selectorbox = GHVHS.DOM.create({ "Type": "div", "Class": "selectorbox", "Id": "selectorbox", "Parent": NameAndInput });
        for (var i = 0; i < fields.DropDown.length; i++) {
            var DropOption = GHVHS.DOM.create({ "Type": "div", "Class": "DropOption", "Style": "width:95%;float:left;height:20%;padding-top:1.5%;font-size:120%;", "Parent": selectorbox });
            DropOption.innerHTML = fields.DropDown[i].Name;
            DropOption.onclick = function () {
                if (this.className == "DropOption") {
                    this.className = "SelectedOption";
                } else {
                    this.className = "DropOption";
                }
            }
        }
    },
    SelectedMulit: function (DataToCheck, CheckByUser) {
        var selected = document.getElementById("selectorbox");
        var allChoices = selected.querySelectorAll("div");
        var roles = "";
        if (!CheckByUser) {
            for (var i = 0; i < Admin.DepartmentUsers["Items"].length; i++) {
                if (Admin.DepartmentUsers["Items"][i]["Fields"]["UserNameDisplay"] == DataToCheck) {
                    roles = Admin.DepartmentUsers["Items"][i]["Fields"]["Role"];
                }
            }
        } else {
            for (var i = 0; i < Admin.DepartmentUsers["Items"].length; i++) {
                if (Admin.DepartmentUsers["Items"][i]["Fields"]["Role"] == DataToCheck) {
                    roles += Admin.DepartmentUsers["Items"][i]["Fields"]["UserNameDisplay"] + ",";
                }
            }
        }
        var allRolers = [];
        if (roles.indexOf(",") >= 0) {
            allRolers = roles.split(",");
        } else {
            allRolers.push(roles);
        }
        for (var j = 0; j < allChoices.length; j++) {
            allChoices[j].className = "DropOption";
        }
        for (var i = 0; i < allRolers.length; i++) {
            if (allRolers != "") {
                for (var j = 0; j < allChoices.length; j++) {
                    if (allRolers[i] == allChoices[j].innerText) {
                        allChoices[j].className = "SelectedOption";
                    } 
                }
            }
        }
    },
    ValidateUsersForRoles: function () {
        var getSelectorBox = document.getElementById("selectorbox");
        var getColumn = document.getElementById("ContentCloumn1");
        var getAllInputFields = getColumn.querySelectorAll(".NameAndInput");
        var RoleFilter = "";
        for (var j=0; j<getAllInputFields.length; j++){
            var checkFilter = getAllInputFields[j].querySelector(".Filter");
            if (checkFilter){
                if (checkFilter.id  == "Role"){
                    RoleFilter = checkFilter.value; 
                }
            }
        }
        if (RoleFilter != ""){

        
            var ValuesSelector = getSelectorBox.querySelectorAll(".SelectedOption");
            var params = "";
            for (var j = 0; j < ValuesSelector.length; j++){
                var TempName = ValuesSelector[j].innerText;
                for (var i = 0; i < Admin.DepartmentUsers["Items"].length; i++) {
                    if (Admin.DepartmentUsers["Items"][i]["Fields"]["UserNameDisplay"] == TempName) {
                        if (Admin.DepartmentUsers["Items"][i]["Fields"]["Role"].indexOf(RoleFilter) < 0) {
                            params += Admin.DepartmentUsers["Items"][i]["Fields"]["UserName"] + "|";
                            params += Admin.DepartmentUsers["Items"][i]["Fields"]["UserNameDisplay"] + "|";
                            params += Admin.DepartmentUsers["Items"][i]["Fields"]["DepartmentID"] + "|";
                            params += Admin.DepartmentUsers["Items"][i]["Fields"]["DepartmentName"] + "|";
                            params += Admin.DepartmentUsers["Items"][i]["Fields"]["Role"] +","+RoleFilter+";";
                        }
                    }

                }
            }
            if (params != "") {
                GHVHS.DOM.send({ "URL": "/Pnp/UpdateUsersRoles?data=" + params, "Callback": Admin.redrawPage, "CallbackParams": [] });
            } else {
                window.location.href = window.location.href;
            }
        }else {
            Admin.drawErrorMsg("Please Select a Role");
        }
    }
}; 