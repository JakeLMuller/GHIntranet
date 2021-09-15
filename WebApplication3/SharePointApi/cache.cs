using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.SharePointApi
{
    public class cache
    {
        private List<GetAllFiles.Collection> _MyList = null;
        public List<GetAllFiles.Collection> MyList
        {
            get
            {
                if (_MyList == null)
                {
                    _MyList = (HttpContext.Current.Cache["MyList"] as List<GetAllFiles.Collection>);
                    if (_MyList == null)
                    {
                        string[] lists = new String[3];

                        // Initialising the array of strings 
                        lists[0] = "DraftPolicies";
                        lists[1] = "Approved%20Policies";
                        lists[2] = "ArchivePolicies";
                        _MyList = GetAllFiles.AggregateListItems("", "", lists, "", "", "", "","", "");
                        HttpContext.Current.Cache.Insert("MyList", _MyList);
                    }
                }
                return _MyList;
            }
            set
            {
                HttpContext.Current.Cache.Insert("MyList", _MyList);
            }
        }

        public void ClearList()
        {
            HttpContext.Current.Cache.Remove("MyList");
        }
    }
}