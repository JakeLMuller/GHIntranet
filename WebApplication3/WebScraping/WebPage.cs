using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Net;
using System.IO;
using System.Web;
using WebApplication3.ActiveDirectory;

namespace WebApplication3.WebScraping
{
    public class WebPage
    {

        public static HttpContext Page
        {
            get
            {
                return HttpContext.Current;
            }

        }

        public static string GetURLText(string url)
        {
            return GetURLText(url, ActiveDirectory.Impersonate.DefaultLogin, ActiveDirectory.Impersonate.DefaultPassword, ActiveDirectory.Impersonate.DefaultDomain);
        }

        private static string GetURLText(string url, string user, string pwd, string domain)
        {
            string txt = "";

            try
            {
                Uri uri = new Uri(url);


                using (new Impersonate())
                {

                    if (uri.IsLoopback)
                    {
                        string localPath = Page.Server.MapPath(uri.AbsolutePath).Replace("%20", " ");
                        if (File.Exists(localPath))
                        {
                            txt = File.ReadAllText(localPath);
                        }
                    }
                    else
                    {
                        var request = (HttpWebRequest)WebRequest.Create(url);

                        user += "";
                        domain += "";

                        if (user.Length > 0 && domain.Length > 0)
                        {
                            request.Credentials = CredentialCache.DefaultCredentials;
                            request.Credentials = new NetworkCredential(user, pwd, domain);
                        }

                        using (var response = request.GetResponse())
                        using (var content = response.GetResponseStream())
                        using (var reader = new StreamReader(content))
                        {
                            txt = reader.ReadToEnd();
                        }
                    }

                }
            }
            catch
            {

            }

            return txt;
        }
    }
}