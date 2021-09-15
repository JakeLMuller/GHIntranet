using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Cache;
using System.Web;
using System.Xml;
using System.Xml.Linq;
using WebApplication3.SQL;

namespace WebApplication3.SharePointApi
{
    public class GetAllFiles
    {
        private static object CreateByTypeName(string typeName)
        {
            // scan for the class type
            var type = (from assembly in AppDomain.CurrentDomain.GetAssemblies()
                        from t in assembly.GetTypes()
                        where t.Name == typeName  // you could use the t.FullName aswel
                        select t).FirstOrDefault();

            if (type == null)
                throw new InvalidOperationException("Type not found");

            return Activator.CreateInstance(type);
        }
        
        public static List<Collection> AggregateListItems(string Usename, string password, string[] lists, string Fields, string className, string search, string searchBy, string OrderBy, string FilesFolder )
        {
            if (String.IsNullOrEmpty(password) == true)
            {
                password = "Sp@Adm1n";
            }

            if (String.IsNullOrEmpty(Usename) == true)
            {
                Usename = "SharePointAdmin";
            }
            XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");

            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            NetworkCredential cred = new System.Net.NetworkCredential(Usename, password, "GHVHS");
           
            try
            {

                if (lists.Length > 0) {
                    for (var i = 0; i < lists.Length; i++) {
                        string urlPart = "_api/Web/lists/getByTitle('" + lists[i] + "')/items";
                        HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + urlPart);
                        listRequest.Method = "GET";
                        listRequest.Accept = "application/atom+xml";
                        listRequest.ContentType = "application/atom+xml;type=entry";
                        listRequest.Credentials = cred;
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
                        Collection SinglePolicy = new Collection();
                        SinglePolicy.Id = lists[i];
                        Collection.Policies.Add(SinglePolicy);
                        foreach (XElement entry in feed.Elements(ns + "entry"))
                        {

                            SingleItem Items = new SingleItem();
                            String TempId = (string)entry.Element(ns + "id");
                            Items.Fields = GetFieldsAsText(TempId, "N", FilesFolder);
                            SinglePolicy.SingleItem.Add(Items);
                           

                        }
                        
                        listRequest.Abort();
                        listResponse.Close();// !! Yes, abort the request
                        
                    }

                    var temp = Collection.Policies;
                    Collection.Policies = new List<Collection>();
                    return temp;
                }
                else
                {
                    Collection SinglePolicy = new Collection();
                    Collection.Policies.Add(SinglePolicy);
                    SinglePolicy.Id = "No List";
                    var temp = Collection.Policies;
                    Collection.Policies = new List<Collection>(); 
                    return temp;
                }

                }catch (Exception ex)
                {
                    Collection SinglePolicy = new Collection();
                    Collection.Policies.Add(SinglePolicy);
                    SinglePolicy.Id = ex.ToString();
                    var temp = Collection.Policies;
                    Collection.Policies = new List<Collection>();
                    return temp;
            }
            

        }
        public static List<Fields> GetFieldsAsText(string URI, string Guid, string FilesFolder)

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
            SingleItem newEntry = new SingleItem();
            SingleItem.Items.Add(newEntry);
           
                 newEntry.Fields = feed.Elements(ns + "content").Select(x => x.Descendants().Where(y => y.Name.LocalName == "properties").Select(y => new Fields()
                {
                    

                    Name = (string)y.Descendants().Where(z => z.Name.LocalName == "FileLeafRef").FirstOrDefault(),
                    Category = (string)y.Descendants().Where(z => z.Name.LocalName == "GHVHSCategory").FirstOrDefault(),
                    Department = (string)y.Descendants().Where(z => z.Name.LocalName == "GHVHSDepartment").FirstOrDefault(),
                    Location = (string)y.Descendants().Where(z => z.Name.LocalName == "GHVHSLocation").FirstOrDefault(),
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
                 List<string> values = Pnp.storeDraftPolcies(SingleItem.Items[0].Fields[0].ID, "", "", "", "", "", "","","", "", "", "", "");
                if (values.Count > 0)
                {
                    SingleItem.Items[0].Fields[0].PolicyRelatedDoc1 = values[0];
                    SingleItem.Items[0].Fields[0].PolicyRelatedDoc2 = values[1];
                    SingleItem.Items[0].Fields[0].PolicyRelatedDoc3 = values[2];
                    SingleItem.Items[0].Fields[0].PolicyRelatedDoc4 = values[3];
                    SingleItem.Items[0].Fields[0].Concurrer = values[4];
                    SingleItem.Items[0].Fields[0].AutoApprove = values[6];
                    SingleItem.Items[0].Fields[0].Category = values[7];
                    SingleItem.Items[0].Fields[0].Location = values[8];
                    SingleItem.Items[0].Fields[0].Department = values[9];
                    SingleItem.Items[0].Fields[0].CreatedBy = values[10];

                string tempName = SingleItem.Items[0].Fields[0].Name;
                    string textContent = "";
                    if (String.IsNullOrEmpty(values[5]) == true) {
                        if (File.Exists(FilesFolder + tempName))
                        {
                            string FilesPath = FilesFolder + tempName;
                            if (FilesPath.IndexOf(".pdf") >= 0 || FilesPath.IndexOf(".PDF") >= 0)
                            {
                                textContent = Library.getPDFContent(FilesPath);
                            }
                            else if (FilesPath.IndexOf(".doc") >= 0 || FilesPath.IndexOf(".DOC") >= 0)
                            {
                                textContent = Library.getDocumentContent(FilesPath);
                            }
                            else if (FilesPath.IndexOf(".txt") >= 0 || FilesPath.IndexOf(".txt") >= 0)
                            {
                                 textContent = Library.getTextContents(FilesPath);
                            }
                    }
                    else {
                        string path = Library.saveFile("http://sharepoint" + SingleItem.Items[0].Fields[0].FileRef, FilesFolder);
                        if (path.IndexOf(".pdf") >= 0 || path.IndexOf(".PDF") >= 0)
                        {
                            textContent = Library.getPDFContent(path);
                        }
                        else if (path.IndexOf(".doc") >= 0 || path.IndexOf(".DOC") >= 0)
                        {
                            textContent = Library.getDocumentContent(path);
                        }
                        else if (path.IndexOf(".txt") >= 0 || path.IndexOf(".txt") >= 0)
                        {
                            textContent = Library.getTextContents(path);
                        }

                    }
                    if (String.IsNullOrEmpty(textContent) == false)
                    {
                        List<string> valued = Pnp.storeDraftPolcies(SingleItem.Items[0].Fields[0].ID, "", "", "", "", "", "Update", textContent,"", "", "", "", "");
                        SingleItem.Items[0].Fields[0].DocumentContents = textContent;
                    }else
                    {
                        SingleItem.Items[0].Fields[0].DocumentContents = " ";
                    }
                }
                else
                    {
                        SingleItem.Items[0].Fields[0].DocumentContents = values[5];
                    }
            }else
            {
                string tempName = SingleItem.Items[0].Fields[0].Name;
                string path = "";
                string textContent = "";
                if (File.Exists(FilesFolder + tempName))
                {
                    path = FilesFolder + tempName;
                }else
                {
                    path = Library.saveFile("http://sharepoint" + SingleItem.Items[0].Fields[0].FileRef, FilesFolder);
                }
                    
                if (path.IndexOf(".pdf") >= 0 || path.IndexOf(".PDF") >= 0)
                {
                    textContent = Library.getPDFContent(path);
                }
                else if (path.IndexOf(".doc") >= 0 || path.IndexOf(".DOC") >= 0)
                {
                    textContent = Library.getDocumentContent(path);
                }
                else if (path.IndexOf(".txt") >= 0 || path.IndexOf(".txt") >= 0)
                {
                    textContent = Library.getTextContents(path);
                }
                if (String.IsNullOrEmpty(textContent) == false)
                {
                    Pnp.storeDraftPolcies(SingleItem.Items[0].Fields[0].ID, "", "", "", "", "", "Create", textContent,"", "", "", "", "");
                    SingleItem.Items[0].Fields[0].DocumentContents = textContent;
                }
                else
                {
                    SingleItem.Items[0].Fields[0].DocumentContents = " ";
                }
            }
                listRequest.Abort();
                listResponse.Close();// !! Yes, abort the request
                var temp = SingleItem.Items[0].Fields;
                SingleItem.Items = new List<SingleItem>();
                return temp;
            }



        
        public class Collection
        {
            public static List<Collection> Policies = new List<Collection>();

            public List<SingleItem> SingleItem = new List<SingleItem>();
            public  string Id { get; set; }


        }
        public class SingleItem
        {
            public static List<SingleItem> Items = new List<SingleItem>();
            public List<Fields> Fields { get; set; }
           


        }
        public class Fields
        {
            public string DocumentContents { get; set; }
            public string JobTitle { get; set; }
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
            public string Location { get; set; }
            public string FileDirRef { get; set; }
            public string ID { get; set; }
            public string Author { get; set; }
            public string Name { get; set; }
            public string Category { get; set; }
            public string Department { get; set; }
            public string Modified { get; set; }
            public string FileRef { get; set; }

            public string AutoApprove { get; set; }
        }
    }
}
