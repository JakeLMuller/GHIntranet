using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace WebApplication3.Url
{
    public class Url
    {

        public static string Combine(params string[] urls)
        {

            //string retVal = String.Join("", urls);

            Uri uri;
            string retVal = string.Empty;
            string newUrl = string.Empty;

            foreach (string url in urls)
            {
                if ((url + "") != "")
                {
                    if (url.StartsWith("http:") || url.StartsWith("https:"))
                    {
                        retVal = url;
                    }
                    else
                    {

                        if (retVal != string.Empty && Uri.TryCreate(url, UriKind.Absolute, out uri))
                        {
                            newUrl = uri.PathAndQuery;
                        }
                        else
                        {
                            newUrl = url;
                        }

                        if (newUrl.Substring(0, 1) == "/" && retVal != string.Empty)
                            newUrl = newUrl.Substring(1);

                        if (
                                retVal != string.Empty &&
                                !newUrl.Contains("?") &&
                                !newUrl.Contains("//") &&
                                newUrl.Substring(0, 1) != "/" &&
                                retVal.Substring(retVal.Length - 1, 1) != "/")
                        {
                            retVal += "/";
                        }
                    }

                    retVal += newUrl;
                }
            }

            return retVal;

        }

    }
}