var GHSocial = {
    CurrentUser:"",
    HomePage: function () {
        var parent = document.getElementById("Sky");
        GHSocial.DrawTopBar(parent);
    },
    DrawTopBar:function(Parent){
        TopBar = GHVHS.DOM.create({ "Type": "div", "Class": "TopBar", "Id": "TopBar", "Parent": Parent });
        homeIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/FavIcon.png", "Class": "HomeLogo", "Id": "HomeLogo", "Parent": TopBar });
        SearchIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/blueSearch.png", "Class": "SubIcons","Style":"margin-left:85%;", "Id": "SearchIcon", "Parent": TopBar });
        FilterIcon = GHVHS.DOM.create({ "Type": "img", "Src": "/img/dots.png", "Class": "SubIcons", "Id": "FilterIcon", "Parent": TopBar });
    }




};