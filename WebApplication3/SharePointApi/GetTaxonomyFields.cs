using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Xml;

namespace WebApplication3.SharePointApi
{
    public class GetTaxonomyFields
    {
        public static string GetFieldValue(string userName, string password, string endpoint, string field, string IsTaxonomy)
        {
            string result = "";
            XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");
            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + "_api/web/lists"+ endpoint);
            listRequest.Method = "GET";
            listRequest.Accept = "application/atom+xml";
            listRequest.ContentType = "application/atom+xml;type=entry";
            listRequest.Credentials = cred;
            try
            {
                HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
                
                string resposne = listReader.ReadToEnd();
                var listXml = new XmlDocument();
                listXml.LoadXml(resposne);
                var prop = listXml.SelectNodes("//atom:entry/atom:content/m:properties", xmlnspm);
                foreach (XmlNode ndlist in prop)
                {
                    if (IsTaxonomy == "Y")
                    {
                        string Term = ndlist.SelectSingleNode("d:Term", xmlnspm).InnerXml;
                        string IdTerm = ndlist.SelectSingleNode("d:IdForTerm", xmlnspm).InnerXml;
                        string Id = ndlist.SelectSingleNode("d:Id", xmlnspm).InnerXml;
                        result =   Term + "|" + IdTerm;
                    }else
                    {
                        result = ndlist.SelectSingleNode("d:" + field, xmlnspm).InnerXml;
                    }
                    
                }
                return result;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
            
        }
        public static List<string> GetFieldValues(string userName, string password, string endpoint, string field, string IsTaxonomy)
        {
            List<string> result = new List<string>();
            XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");
            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + "_api/web/lists" + endpoint);
            listRequest.Method = "GET";
            listRequest.Accept = "application/atom+xml";
            listRequest.ContentType = "application/atom+xml;type=entry";
            listRequest.Credentials = cred;
            try
            {
                HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                StreamReader listReader = new StreamReader(listResponse.GetResponseStream());

                string resposne = listReader.ReadToEnd();
                var listXml = new XmlDocument();
                listXml.LoadXml(resposne);
                var prop = listXml.SelectNodes("//atom:entry/atom:content/m:properties", xmlnspm);
                foreach (XmlNode ndlist in prop)
                {
                    string[] FieldObj = field.Split('|');

                    foreach (string temp in FieldObj)
                    {
                        result.Add(ndlist.SelectSingleNode("d:" + temp, xmlnspm).InnerXml);
                    }

                }
                List<string> results = result;
                result = new List<string>();
                return results;
            }
            catch (Exception ex)
            {
                result.Add(ex.ToString());
                return result;
            }

        }
    }
}