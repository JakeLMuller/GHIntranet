using System;
using System.Net;
using System.IO;
using System.Xml;
using System.Xml.Linq;
using System.Linq;
using System.Collections.Generic;
using System.Web.Mvc;
using System.Text;
using System.Net.Cache;

namespace WebApplication3.SharePointApi
{
    public class getItems
    {

        public static List<Entry> GetListItems(string list, string userName, string password, string Id, string Guid, string search, string searchBy, string orderBy, string addFilter)

        {
            String CheckOutOrIn = "";
            if (String.IsNullOrEmpty(password) == true)
            {
                password = "Sp@Adm1n";
            }

            if (String.IsNullOrEmpty(userName) == true)
            {
                userName = "SharePointAdmin";
            }
            List<XElement> nodes;
            XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");

            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
            string urlPart = "_api/Web/lists/getByTitle('" + list + "')/items";
            if (String.IsNullOrEmpty(addFilter) == false)
            {
                urlPart += addFilter;
            }
            if (String.IsNullOrEmpty(Id) == false)
            {
                urlPart += "?$filter=Id%20eq%20"+Id;
            }
            if (String.IsNullOrEmpty(searchBy) == true)
            {
                searchBy = "FileLeafRef";
               
            }else if (searchBy == "GHVHSCategory" || searchBy == "GHVHSLocation" || searchBy == "GHVHSDepartment")
            {
                searchBy = "TaxCatchAll/Term";
            }
            if (String.IsNullOrEmpty(search) == false)
            {
                if (String.IsNullOrEmpty(Id) == false)
                {
                    urlPart += "and substringof(%27" + search + "%27,"+searchBy+")";
                }
                else
                {
                    urlPart += "?$filter=substringof(%27" + search + "%27," + searchBy + ")";
                }
            }
            if (String.IsNullOrEmpty(orderBy) == false)
            {
                if (String.IsNullOrEmpty(Id) == false || String.IsNullOrEmpty(search) == false || String.IsNullOrEmpty(addFilter) == false)
                {
                    urlPart += "&$orderby=" + orderBy;
                }else
                {
                    urlPart += "?$orderby=" + orderBy;
                }
            }
            if (String.IsNullOrEmpty(Guid) == false)
            {
                urlPart = "";
                urlPart = "/_api/Web/Lists(guid'"+Guid+ "')/items";
                if (String.IsNullOrEmpty(addFilter) == false)
                {
                    urlPart += "?$filter="+addFilter;
                }else
                {
                    urlPart += "?$orderby= Title asc";
                }
                if (String.IsNullOrEmpty(Id) == false)
                {
                    urlPart += "?$filter=substringof(%27"+Id+ "%27,Title)&$orderby= Title asc";
                }
                if (String.IsNullOrEmpty(search) == false)
                {
                    if (String.IsNullOrEmpty(Id) == false)
                    {
                        urlPart += "and substringof(%27" + search + "%27," + searchBy + ")";
                    }
                    else
                    {
                        urlPart = "/_api/Web/Lists(guid'" + Guid + "')/items";
                        if (searchBy == "ID")
                        {
                            urlPart += "?$filter="+ searchBy + " eq "+ search;
                        }
                        else
                        {
                            urlPart += "?$filter=substringof(%27" + search + "%27," + searchBy + ")";
                        }
                       
                    }
                }
            }
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + urlPart);
            listRequest.Method = "GET";
            listRequest.Accept = "application/atom+xml";
            listRequest.ContentType = "application/atom+xml;type=entry";
            listRequest.Credentials = cred;
            HttpRequestCachePolicy noCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            listRequest.CachePolicy = noCachePolicy;
            try { 
                HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
                XDocument doc;
                string result = listReader.ReadToEnd();
                XmlTextReader reader = new XmlTextReader(new StringReader(result));
                doc = XDocument.Load(reader);
                XElement feed = doc.Root;
                XNamespace ns = feed.GetDefaultNamespace();
                foreach (XElement entry in feed.Elements(ns + "entry"))
                {
                    Entry newEntry = new Entry();
                    Entry.entries.Add(newEntry);

                    newEntry.title = (string)entry.Element(ns + "title");
                    newEntry.id = (string)entry.Element(ns + "id");
                    String TempId = (string)entry.Element(ns + "id");
                    if (String.IsNullOrEmpty(Guid) == false)
                    {
                        newEntry.Fields = GetFieldsAsText(TempId,"Y");
                    }
                    else
                    {
                        newEntry.Fields = GetFieldsAsText(TempId, "N");
                    }
                    
                    
                }
                listRequest.Abort();
                listResponse.Close();// !! Yes, abort the request
                var temp = new List<Entry>();
                temp = Entry.entries;
                Entry.entries = new List<Entry>();
                return temp;
            }
            catch (Exception ex) {
                var temp = new Entry();
                temp.id = "Not Logged In";
                Entry.entries.Add(temp);
                var Temp2 = Entry.entries;
                Entry.entries = new List<Entry>();
                return Temp2;
            }
        }

    
    public class Entry
    {
        public static List<Entry> entries = new List<Entry>();
            public string id { get; set; }
            public string title { get; set; }
        public List<Fields> Fields { get; set; }
       

        }
    public class Link
    {
        public string name { get; set; }
        public string id { get; set; }
        public string Modified { get; set; }
        public string Created { get; set; }
    }

        [OutputCache(NoStore = true, Duration = 100)]
        public static List<Fields> GetFieldsAsText(string URI, string Guid)

        {
            List<XElement> nodes;
            XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/_api/");

            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            NetworkCredential cred = new System.Net.NetworkCredential("SharePointAdmin", "Sp@Adm1n", "GHVHS");
            HttpRequestCachePolicy policy = new HttpRequestCachePolicy(HttpRequestCacheLevel.Default);
            HttpWebRequest.DefaultCachePolicy = policy;
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + URI + "/FieldValuesAsText");
            listRequest.Method = "GET";
            listRequest.Accept = "application/atom+xml";
            listRequest.ContentType = "application/atom+xml;type=entry";
            listRequest.Credentials = cred;
            
            // Define a cache policy for this request only. 
            HttpRequestCachePolicy noCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            listRequest.CachePolicy = noCachePolicy;
            HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
            StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
            XDocument doc;
            string result = listReader.ReadToEnd();
            XmlTextReader reader = new XmlTextReader(new StringReader(result));
            doc = XDocument.Load(reader);
            XElement feed = doc.Root;
            XNamespace ns = feed.GetDefaultNamespace();
            Item newEntry = new Item();
            Item.entries.Add(newEntry);
            if (Guid == "Y")
            {
                newEntry.Fields = feed.Elements(ns + "content").Select(x => x.Descendants().Where(y => y.Name.LocalName == "properties").Select(y => new Fields()
                {
                    JobTitle = (string)y.Descendants().Where(z => z.Name.LocalName == "JobTitle").FirstOrDefault(),
                    Title = (string)y.Descendants().Where(z => z.Name.LocalName == "Title").FirstOrDefault(),
                    ID = (string)y.Descendants().Where(z => z.Name.LocalName == "ID").FirstOrDefault(),
                    UserName = (string)y.Descendants().Where(z => z.Name.LocalName == "UserName").FirstOrDefault(),
                    EMail = (string)y.Descendants().Where(z => z.Name.LocalName == "EMail").FirstOrDefault(),
                    Name = (string)y.Descendants().Where(z => z.Name.LocalName == "Name").FirstOrDefault(),
                }).FirstOrDefault()).ToList();
                var temp = Item.entries[0].Fields;
                Item.entries = new List<Item>();
                return temp;
            }
            else
            {
                newEntry.Values = feed.Elements(ns + "content").Select(x => x.Descendants().Where(y => y.Name.LocalName == "properties").Select(y => new Fields()
                {


                    Name = (string)y.Descendants().Where(z => z.Name.LocalName == "FileLeafRef").FirstOrDefault(),
                    GHVHSCategory = (string)y.Descendants().Where(z => z.Name.LocalName == "GHVHSCategory").FirstOrDefault(),
                    GHVHSDepartment = (string)y.Descendants().Where(z => z.Name.LocalName == "GHVHSDepartment").FirstOrDefault(),
                    GHVHSLocation = (string)y.Descendants().Where(z => z.Name.LocalName == "GHVHSLocation").FirstOrDefault(),
                    ID = (string)y.Descendants().Where(z => z.Name.LocalName == "ID").FirstOrDefault(),
                    Author = (string)y.Descendants().Where(z => z.Name.LocalName == "Author").FirstOrDefault(),
                    Modified = (string)y.Descendants().Where(z => z.Name.LocalName == "Modified").FirstOrDefault(),
                    Editor = (string)y.Descendants().Where(z => z.Name.LocalName == "Editor").FirstOrDefault(),
                    FileRef = (string)y.Descendants().Where(z => z.Name.LocalName == "FileRef").FirstOrDefault(),
                    FileDirRef = (string)y.Descendants().Where(z => z.Name.LocalName == "FileDirRef").FirstOrDefault(),
                    ModerationStatus = (string)y.Descendants().Where(z => z.Name.LocalName == "OData__x005f_ModerationStatus").FirstOrDefault(),
                    LastModified = (string)y.Descendants().Where(z => z.Name.LocalName == "Last_x005f_x0020_x005f_Modified").FirstOrDefault(),
                    Title = (string)y.Descendants().Where(z => z.Name.LocalName == "Title").FirstOrDefault(),
                    Concurrer = (string)y.Descendants().Where(z => z.Name.LocalName == "DelegateTo").FirstOrDefault(),
                    PolicyRelatedDoc1 = (string)y.Descendants().Where(z => z.Name.LocalName == "PolicyRelatedDoc1").FirstOrDefault(),
                    PolicyRelatedDoc2 = (string)y.Descendants().Where(z => z.Name.LocalName == "PolicyRelatedDoc2").FirstOrDefault(),
                    PolicyRelatedDoc3 = (string)y.Descendants().Where(z => z.Name.LocalName == "PolicyRelatedDoc3").FirstOrDefault(),
                    PolicyRelatedDoc4 = (string)y.Descendants().Where(z => z.Name.LocalName == "PolicyRelatedDoc4").FirstOrDefault(),
                    CreatedBy = (string)y.Descendants().Where(z => z.Name.LocalName == "Created_x005f_x0020_x005f_By").FirstOrDefault(),
                    ModifiedBy = (string)y.Descendants().Where(z => z.Name.LocalName == "Modified_x005f_x0020_x005f_By").FirstOrDefault(),
                    CheckedOut = (string)y.Descendants().Where(z => z.Name.LocalName == "CheckoutUser").FirstOrDefault(),
                    DueTime = (string)y.Descendants().Where(z => z.Name.LocalName == "Due_x005f_x0020_x005f_time").FirstOrDefault(),

                }).FirstOrDefault()).ToList();
                listRequest.Abort();
                listResponse.Close();// !! Yes, abort the request
                var temp = Item.entries[0].Values;
                Item.entries = new List<Item>();
                return temp;
            }
           

            
        }
        public class Item
        {
            public static List<Item> entries = new List<Item>();
           
            public List<Fields> Values { get; set; }
            public List<Fields> Fields { get; set; }

        }
        
        public class Fields
        {
            public string UserName { get; set; }
            public string JobTitle { get; set; }
            public string EMail { get; set; }
            public string Concurrer { get; set; }
            public string DueTime { get; set; }
            public string CreatedBy { get; set; }
            public string CheckedOut { get; set; }
            public string Title { get; set; }
            public string ModifiedBy { get; set; }
            public string ModerationStatus { get; set; }
            public string LastModified { get; set; }
            public string PolicyRelatedDoc1 { get; set; }
            public string PolicyRelatedDoc2 { get; set; }
            public string PolicyRelatedDoc3 { get; set; }
            public string PolicyRelatedDoc4 { get; set; }
            public string Editor { get; set; }
            public string GHVHSLocation { get; set; }
            public string FileDirRef { get; set; }
            public string ID { get; set; }
            public string Author { get; set; }
            public string Name { get; set; }
            public string GHVHSCategory { get; set; }
            public string GHVHSDepartment { get; set; }
            public string Modified { get; set; }
            public string FileRef { get; set; }
            public List<Link> links { get; set; }

        }
    }
}