using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Cache;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;
using System.Xml;
using System.Xml.Linq;

namespace WebApplication3.SharePointApi
{
    public class ConcurenceLookUp
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
                urlPart += "?$filter=Id%20eq%20" + Id;
            }
            if (String.IsNullOrEmpty(searchBy) == true)
            {
                searchBy = "FileLeafRef";

            }

            if (String.IsNullOrEmpty(search) == false)
            {
                if (searchBy == "EditorId")
                {
                    urlPart += "?$filter=" + searchBy + " eq " + search;
                }
                else if (String.IsNullOrEmpty(Id) == false)
                {
                    urlPart += "and substringof(%27" + search + "%27," + searchBy + ")";
                }
                else
                {
                    urlPart += "?$filter=substringof(%27" + search + "%27," + searchBy + ")";
                }
            }
            if (String.IsNullOrEmpty(orderBy) == false)
            {
                if (String.IsNullOrEmpty(Id) == false || String.IsNullOrEmpty(search) == false)
                {
                    urlPart += "&$orderby=" + orderBy;
                }
                else
                {
                    urlPart += "?$orderby=" + orderBy;
                }
            }
            if (String.IsNullOrEmpty(Guid) == false)
            {
                urlPart = "/_api/Web/Lists(guid'" + Guid + "')/items?$orderby= Title asc";
                if (String.IsNullOrEmpty(Id) == false)
                {
                    urlPart += "?$filter=substringof(%27" + Id + "%27,Title)&$orderby= Title asc";
                }

            }
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + urlPart);
            listRequest.Method = "GET";
            listRequest.Accept = "application/atom+xml";
            listRequest.ContentType = "application/atom+xml;type=entry";
            listRequest.Credentials = cred;
            HttpRequestCachePolicy noCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            listRequest.CachePolicy = noCachePolicy;
            try
            {
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
                        newEntry.Fields = GetFieldsAsText(TempId, "Y");
                    }
                    else
                    {
                        newEntry.Fields = GetFieldsAsText(TempId, "N");
                    }


                }
                var temp = new List<Entry>();
                temp = Entry.entries;
                Entry.entries = new List<Entry>();
                return temp;
            }
            catch (Exception ex)
            {
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
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + URI);
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
                    Title = (string)y.Descendants().Where(z => z.Name.LocalName == "Title").FirstOrDefault(),
                    ID = (string)y.Descendants().Where(z => z.Name.LocalName == "ID").FirstOrDefault(),

                }).FirstOrDefault()).ToList();
                var temp = Item.entries[0].Fields;
                Item.entries = new List<Item>();
                return temp;
            }
            else
            {
                String TempId = (string)feed.Element(ns + "id");
                string[] getID = TempId.Split('(');
                TempId = "(" + getID[1] + "(" + getID[2] + "/FieldValuesAsText";
                string auth = GetTaxonomyFields.GetFieldValue("SharePointAdmin", "Sp@Adm1n", TempId, "AssignedTo", "");
                newEntry.Values = feed.Elements(ns + "content").Select(x => x.Descendants().Where(y => y.Name.LocalName == "properties").Select(y => new Fields()
                {


                    Title = (string)y.Descendants().Where(z => z.Name.LocalName == "Title").FirstOrDefault(),
                    Priority = (string)y.Descendants().Where(z => z.Name.LocalName == "Priority").FirstOrDefault(),
                    Status = (string)y.Descendants().Where(z => z.Name.LocalName == "Status").FirstOrDefault(),
                    PercentComplete = (string)y.Descendants().Where(z => z.Name.LocalName == "PercentComplete").FirstOrDefault(),
                    ID = (string)y.Descendants().Where(z => z.Name.LocalName == "ID").FirstOrDefault(),
                    StartDate = (string)y.Descendants().Where(z => z.Name.LocalName == "StartDate").FirstOrDefault(),
                    DueDate = (string)y.Descendants().Where(z => z.Name.LocalName == "DueDate").FirstOrDefault(),
                    RelatedItems = (string)y.Descendants().Where(z => z.Name.LocalName == "RelatedItems").FirstOrDefault(),
                    TaskOutcome = (string)y.Descendants().Where(z => z.Name.LocalName == "TaskOutcome").FirstOrDefault(),
                    DeadLine = (string)y.Descendants().Where(z => z.Name.LocalName == "DeadLine").FirstOrDefault(),
                    RejecttionReason = (string)y.Descendants().Where(z => z.Name.LocalName == "Reject_x005f_x0020_x005f_Reason").FirstOrDefault(),
                    Modified = (string)y.Descendants().Where(z => z.Name.LocalName == "Modified").FirstOrDefault(),
                    Created = (string)y.Descendants().Where(z => z.Name.LocalName == "Created").FirstOrDefault(),
                    GUID = (string)y.Descendants().Where(z => z.Name.LocalName == "GUID").FirstOrDefault(),
                    Author = (string)y.Descendants().Where(z => z.Name.LocalName == "Author").FirstOrDefault(),
                    EditorId = auth,
                    Body = (string)y.Descendants().Where(z => z.Name.LocalName == "Body").FirstOrDefault(),

                }).FirstOrDefault()).ToList();
                
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
            public string Name { get; set; }
            public string Priority { get; set; }
            public string AssignedTo { get; set; }
            public string Status { get; set; }
            public string PercentComplete { get; set; }
            public string ID { get; set; }
            public string DueDate { get; set; }
            public string StartDate { get; set; }
            public string RelatedItems { get; set; }
            public string TaskOutcome { get; set; }
            public string RejecttionReason { get; set; }
            public string DeadLine { get; set; }
            public string Body { get; set; }
            public string EditorId { get; set; }
            public string Author { get; set; }
            public string GUID { get; set; }
            public string Created { get; set; }
            public string Title { get; set; }
            public string Modified { get; set; }
        }
    }
}