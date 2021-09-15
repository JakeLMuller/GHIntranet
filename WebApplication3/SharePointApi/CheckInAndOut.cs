using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Xml;

namespace WebApplication3.SharePointApi
{
    public class CheckInAndOut
    {

        public static String checkOut(string url, string password, string userName, string checkType, string Comments, string checkintype)
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
            if (checkType == "Y")
            {
                CheckOutOrIn = "CheckIn(";
                if (String.IsNullOrEmpty(Comments) == false)
                {
                    CheckOutOrIn += "comment='"+ Comments + "',";
                }else
                {
                    CheckOutOrIn += "comment='',";
                }
                if (String.IsNullOrEmpty(checkintype) == false)
                {
                    CheckOutOrIn += "checkintype="+ checkintype;
                }else
                {
                    CheckOutOrIn += "checkintype=0";
                }
                CheckOutOrIn += ")";
            }
            else
            {
                CheckOutOrIn = "CheckOut()";
            }
            try { 
                Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies");
                string urlEncoded = System.Web.HttpUtility.UrlPathEncode(url);
                string request = sharepointUrl.ToString() + "/_api/web/GetFileByServerRelativeUrl('" + urlEncoded + "')/" + CheckOutOrIn;
                NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
                HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(request);
                listRequest.Method = "POST";
                string formDigest = GetFormDigestValue(sharepointUrl.ToString(), cred);
                listRequest.Headers.Add("X-RequestDigest", formDigest);
                listRequest.Credentials = cred;
                listRequest.ContentLength = 0;
                listRequest.AllowWriteStreamBuffering = false; 
                HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
                string result = listReader.ReadToEnd();
                return result;
            }
            catch (Exception ex) {
                return "False";

            }
        }
        public static string GetFormDigestValue(string siteurl, NetworkCredential credentials)
        {
            string newFormDigest = "";
            HttpWebRequest endpointRequest = (HttpWebRequest)HttpWebRequest.Create(siteurl + "/_api/contextinfo");
            endpointRequest.Method = "POST";
            endpointRequest.ContentLength = 0;
            endpointRequest.Credentials = credentials;
            endpointRequest.Accept = "application/json;odata=verbose";
            try
            {
                HttpWebResponse endpointResponse = (HttpWebResponse)endpointRequest.GetResponse();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            try
            {
                WebResponse webResp = endpointRequest.GetResponse();
                Stream webStream = webResp.GetResponseStream();
                StreamReader responseReader = new StreamReader(webStream);
                string response = responseReader.ReadToEnd();
                var j = JObject.Parse(response);
                var jObj = (JObject)JsonConvert.DeserializeObject(response);
                foreach (var item in jObj["d"].Children())
                {
                    newFormDigest = item.First()["FormDigestValue"].ToString();
                }
                responseReader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            return newFormDigest;
        }
    }
}