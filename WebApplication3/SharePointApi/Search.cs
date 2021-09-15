using Newtonsoft.Json;
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
    public class Search
    {
        public static string Documents(string userName, string password, string queryText, string HitHighlightedProperties)
        {
            if (String.IsNullOrEmpty(password) == true)
            {
                password = "Sp@Adm1n";
            }

            if (String.IsNullOrEmpty(userName) == true)
            {
                userName = "SharePointAdmin";
            }
            List<string> results = new List<string>();
            XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");
            string urlPart = @"/_api/search/query";
            if (String.IsNullOrEmpty(queryText) == false)
            {
                queryText += "";
                queryText += "+AND+ListId:0d61d63f-ac08-4418-8def-456630b68613";
                    string holdThis = "+OR+querytext=" + queryText + "+AND+ListId:83be116e-bb8e-4905-90f7-4c9caef76411+OR+querytext=" + queryText + "+AND+ListId:5326cd31-4e26-4e57-b505-8080e47efca1";
                urlPart += "?querytext='" + queryText + "'";
                urlPart += "&enableorderinghithighlightedproperty=true&startrow=0&rowlimit=50000&querytemplate='{searchterms} IsDocument:true'";
            }
            else if (String.IsNullOrEmpty(HitHighlightedProperties) == false)
            {
                urlPart += "&enableorderinghithighlightedproperty=true";
            }
            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + urlPart);
            listRequest.Method = "GET";
            listRequest.Accept = "application/json; odata=verbose";
            listRequest.ContentType = "application/json;odata=verbose";
            listRequest.Credentials = cred;
            HttpRequestCachePolicy noCachePolicy = new HttpRequestCachePolicy(HttpRequestCacheLevel.NoCacheNoStore);
            listRequest.CachePolicy = noCachePolicy;
            try
            {
                string json = "";
                HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
                string result = listReader.ReadToEnd();
                
                return result;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}