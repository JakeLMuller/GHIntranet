using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Script.Serialization;
using System.Xml;
using System.Xml.Linq;

namespace WebApplication3.SharePointApi
{
    
    public class AddItem
    {
        public static string ItemToSharepoint(string userName, string password, string List,string FileName,string Title, string GHVHSCategory, string GHVHSDepartment,
            string GHVHSLocation, string Concurrer,string PolicyRelatedDoc1, string PolicyRelatedDoc2, string PolicyRelatedDoc3, string PolicyRelatedDoc4, string PolicyRelatedDoc5,
            string itemId, string UpdateOrCreate, string description, string dueDate, string startDate, string rejectReason, string approveComment, string PercentComplete, string workFlow)
        {

            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies");
            NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
            string id = getlistId(List, cred,"Id");
            string entityTypeName = getlistId(List, cred, "");
            //Execute a REST request to add an item to the list.
           
            string itemPostBody = "{'__metadata':{'type':'" + entityTypeName + "'}";

            if (String.IsNullOrEmpty(workFlow) == false)
            {
                itemPostBody += ", 'OnCreatedItem':" + workFlow;
            }
            if (String.IsNullOrEmpty(FileName) == false)
            {
                itemPostBody += ", 'FileLeafRef':'" + FileName + "'";
            }
            if (String.IsNullOrEmpty(PercentComplete) == false)
            {
                itemPostBody += ", 'PercentComplete':" + PercentComplete + "";
            }
            if (String.IsNullOrEmpty(approveComment) == false)
            {
                itemPostBody += ", 'AssignedToId':{ 'results': [" + approveComment + "]}";
            }
            if (String.IsNullOrEmpty(rejectReason) == false)
            {
                itemPostBody += ", 'Reject_x0020_Reason':'" + rejectReason + "'";
            }
            if (String.IsNullOrEmpty(description) == false)
            {
                itemPostBody += ", 'Body':'" + description + "'";
            }
            if (String.IsNullOrEmpty(dueDate) == false)
            {
                itemPostBody += ", 'DueDate':'" + dueDate + "'";
            }
            if (String.IsNullOrEmpty(startDate) == false)
            {
                itemPostBody += ", 'StartDate':'" + startDate + "'";
            }
            if (String.IsNullOrEmpty(Title) == false)
            {
                itemPostBody += ", 'Title':'" + Title + "'";
            }
            if (String.IsNullOrEmpty(Concurrer) == false)
            {
                // itemPostBody += ", 'DelegateToId':{ 'results': [" + Concurrer+ "]}";
                string ValueToUse = ", 'DelegateToId':{ 'results': [" + Concurrer + "]}";
                if (Concurrer.IndexOf(",")>=0) {
                    string [] values = Concurrer.Split(',');
                    string FormattedValue = "";
                    
                    ValueToUse = ", 'DelegateToId':{'__metadata' : { 'type': 'Collection(Edm.Int32)' },'results': ["+ Concurrer + "]}";
                }
                itemPostBody += ValueToUse;
            }
            if (String.IsNullOrEmpty(GHVHSCategory) == false)
            {
                string result = getFormattedFieldValue(userName, password, GHVHSCategory, "GHVHSCategory", List);
                itemPostBody += result;
            }
            if (String.IsNullOrEmpty(GHVHSDepartment) == false)
            {
                string result = getFormattedFieldValue(userName, password, GHVHSDepartment, "GHVHSDepartment", List);
                itemPostBody += result;
            }
            if (String.IsNullOrEmpty(GHVHSLocation) == false)
            {
                string result = getFormattedFieldValue(userName, password, GHVHSLocation, "GHVHSLocation", List);
                itemPostBody += result;
            }
            if (String.IsNullOrEmpty(PolicyRelatedDoc1) == false)
            {
                itemPostBody += ",'PolicyRelatedDoc1': '" + PolicyRelatedDoc1 + "'";
            }
            if (String.IsNullOrEmpty(PolicyRelatedDoc2) == false)
            {
                itemPostBody += ",'PolicyRelatedDoc2':'"+PolicyRelatedDoc2+"'";
            }
            if (String.IsNullOrEmpty(PolicyRelatedDoc3) == false)
            {
                itemPostBody += ",'PolicyRelatedDoc3':'" + PolicyRelatedDoc3 + "'";
            }
            if (String.IsNullOrEmpty(PolicyRelatedDoc4) == false)
            {
                itemPostBody += ",'PolicyRelatedDoc4':'" + PolicyRelatedDoc4 + "'";
            }
            if (String.IsNullOrEmpty(PolicyRelatedDoc5) == false)
            {
                itemPostBody += ",'PolicyRelatedDoc5':'" + PolicyRelatedDoc5 + "'";
            }
            itemPostBody += "}";
            
            string endPointURL = id + "/items";
            string httpMethod = "POST";
            if (String.IsNullOrEmpty(UpdateOrCreate) == false )
            {
                httpMethod = "POST";
                endPointURL = endPointURL = "http://sharepoint/sites/Policies/_api/Web/Lists/GetByTitle('" + List + "')" + "/Items("+ itemId + ")";
            }
            else
            {
                endPointURL = "http://sharepoint/sites/Policies/_api/Web/Lists/GetByTitle('"+ List + "')/items";
            }
           
            HttpWebRequest itemRequest =
                   (HttpWebRequest)HttpWebRequest.Create(endPointURL);
            itemRequest.Method = httpMethod;
            
            itemRequest.AllowWriteStreamBuffering = true;
            itemRequest.Credentials = cred;
            itemRequest.ContentLength = itemPostBody.Length;
            itemRequest.Accept = "application/json; odata=verbose";
            itemRequest.ContentType = "application/json;odata=verbose";
            string formDigest = CheckInAndOut.GetFormDigestValue(sharepointUrl.ToString(), cred);
            itemRequest.Headers.Add("X-RequestDigest", formDigest);
            if (String.IsNullOrEmpty(UpdateOrCreate) == false)
            {
                itemRequest.Headers.Add("IF-MATCH", "*");
                itemRequest.Headers.Add("X-HTTP-Method", "MERGE");
            }
            


            try
            {
                StreamWriter writer = new StreamWriter(itemRequest.GetRequestStream());
                writer.Write(itemPostBody);
                writer.Flush();
                HttpWebResponse itemResponse = (HttpWebResponse)itemRequest.GetResponse();
                StreamReader listReader = new StreamReader(itemResponse.GetResponseStream());
                   
               
                string result = listReader.ReadToEnd();
                return result;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
        public class ListClass
        {
            public string ListItemEntityTypeFullName { get; set; }
            public string id { get; set; }
        }
       
        public static string getlistId(string list, NetworkCredential cred, string resultType)
        {
            string result = "";
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + "_api/Web/lists/getByTitle('" + list + "')");
            listRequest.Method = "GET";
            listRequest.Accept = "application/atom+xml";
            listRequest.ContentType = "application/atom+xml;type=entry";
            listRequest.Credentials = cred;
            try
            {
                HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
                XDocument doc;
                string resposne = listReader.ReadToEnd();
               

                if (resultType == "Id")
                {
                    XmlTextReader reader = new XmlTextReader(new StringReader(resposne));
                    doc = XDocument.Load(reader);
                    XElement feed = doc.Root;
                    XNamespace ns = feed.GetDefaultNamespace();
                    result = (string)feed.Element(ns + "id");
                }
                else
                {
                     XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
                    xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
                    xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
                    xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");

                    var listXml = new XmlDocument();
                    listXml.LoadXml(resposne);


                    //Method 1 Seperate node list  
                    var prop = listXml.SelectNodes("//atom:entry/atom:content/m:properties", xmlnspm);
                    foreach (XmlNode ndlist in prop)
                    {
                        result = ndlist.SelectSingleNode("d:ListItemEntityTypeFullName", xmlnspm).InnerXml;
                    }
                    
                }
                return result;
            } catch (Exception ex)
            {
                
                result = "Error";
                return result;
            }
        }
        public static bool ValidateJSON(string input)
        {
            try
            {
                JToken.Parse(input);
                return true;
            }
            catch (JsonReaderException ex)
            {
                Trace.WriteLine(ex);
                return false;
            }
        }
        public static string getFormattedFieldValue(string userName, string password, string FieldValue, string FieldName,string list)
        {
            string InternalNameURL = "/GetByTitle('"+ list + "')/Fields/GetByTitle('"+ FieldName + "_0')?$select=LookupList,InternalName,TermSetId";
            string InternalName = GetTaxonomyFields.GetFieldValue(userName, password, InternalNameURL, "InternalName", "N");
            string getListGuidURL = "(guid'0d61d63f-ac08-4418-8def-456630b68613')/Fields?$filter=EntityPropertyName%20eq%20%27" + FieldName + "%27&$select=LookupList,InternalName,TermSetId";
            string listGuid = GetTaxonomyFields.GetFieldValue(userName, password, getListGuidURL, "LookupList", "N");
            string[] temp = listGuid.Split('{');
            string[] temp2 = temp[1].Split('}');
            listGuid = temp2[0];
            string getGHVHSValueURL = "(guid'" + listGuid + "')/Items?$filter=Term%20eq%20%27" + FieldValue + "%27&$select=IdForTerm,Term,Title,Id";
            string GetCategoryValue = GetTaxonomyFields.GetFieldValue(userName, password, getGHVHSValueURL, "", "Y");
            string[] temp3 = GetCategoryValue.Split('~');
            string constructValue = ",'" + InternalName + "':'" + temp3[0]+ "'";
            return constructValue;
        }
    }
}