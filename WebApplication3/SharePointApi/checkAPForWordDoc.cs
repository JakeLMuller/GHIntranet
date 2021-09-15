using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Cache;
using System.Web;
using System.Xml;
using System.Xml.Linq;

namespace WebApplication3.SharePointApi
{
    public class checkAPForWordDoc
    {
        public void Validate(string userName, string password, string list)
        {
            if (String.IsNullOrEmpty(password) == true)
            {
                password = "Sp@Adm1n";
            }

            if (String.IsNullOrEmpty(userName) == true)
            {
                userName = "SharePointAdmin";
            }
            XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");

            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
            string urlPart = "_api/Web/lists/getByTitle('" + list + "')/items";
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + urlPart);
            listRequest.Method = "GET";
            listRequest.Accept = "application/atom+xml";
            listRequest.ContentType = "application/atom+xml;type=entry";
            listRequest.Credentials = cred;
            HttpRequestCachePolicy noCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            listRequest.CachePolicy = noCachePolicy;
            listRequest.BeginGetResponse(new AsyncCallback(FinishWebRequest), null);

        }
        public void FinishWebRequest(IAsyncResult result)
        {
            HttpWebResponse listResponse = (result.AsyncState as HttpWebRequest).EndGetResponse(result) as HttpWebResponse;
            StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
            XDocument doc;
            string results = listReader.ReadToEnd();
            XmlTextReader reader = new XmlTextReader(new StringReader(results));
            doc = XDocument.Load(reader);
            XElement feed = doc.Root;
            XNamespace ns = feed.GetDefaultNamespace();
                foreach (XElement entry in feed.Elements(ns + "entry"))
                {

                }
            }
    }
}