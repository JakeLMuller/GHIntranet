using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Xml;

namespace WebApplication3.SharePointApi
{
    public class DeleteItem
    {
        public static string Remove(string userName, string password, string List, string itemID)
        {
            password = "Sp@Adm1n";


            userName = "SharePointAdmin";
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");
            NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + "_api/web/lists/GetByTitle('" + List + "')/Items(" + itemID + ")");
            listRequest.Method = "POST";
            listRequest.Accept = "application/atom+xml";
            listRequest.Credentials = cred;
            listRequest.ContentLength = 0;
            string formDigest = CheckInAndOut.GetFormDigestValue(sharepointUrl.ToString(), cred);
            listRequest.Headers.Add("X-RequestDigest", formDigest);
            listRequest.Headers.Add("IF-MATCH", "*");
            listRequest.Headers.Add("X-HTTP-Method", "DELETE");
            try
            {
                HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
                List<string> values2 = new List<string>();
                List<string> values = SQL.Pnp.storeDraftPolcies(itemID, "", "", "", "", "", "", "","", "", "", "", "");
                if (values.Count > 0)
                {
                     values2  = SQL.Pnp.storeDraftPolcies(itemID, "", "", "", "", "", "Delete", "","", "", "", "", "");
                }
                
                values = new List<string>();
                return "true";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }

        }
    }
}