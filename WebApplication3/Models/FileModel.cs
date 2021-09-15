using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using HtmlAgilityPack;
using System.Net;
using System.Web;
using System.Text.RegularExpressions;
using System.Globalization;
using System.Xml;
using System.Xml.Xsl;
using System.IO;
using Newtonsoft.Json;

namespace WebApplication3.Models
{
    public class FileModel
    {
        public FileModel(string route, string path)
        {
            this.route = route;
            this.path = path;
            var URLToUse = "http://intranet.ormc.org/BrowseFiles/" + route + "/" + this.path;
            AllFiles = new List<FileLink>();
            sites = new List<FileLink>();
            String Content = WebScraping.WebPage.GetURLText(URLToUse);

            String source = Content;
            if (Content == null)
            {
                this.Html = "Error";
            }
            else
            {
                HtmlDocument doc = new HtmlDocument();
                doc.LoadHtml(source);
                foreach (HtmlNode node in doc.DocumentNode.Descendants("a"))
                {


                    if (node.Attributes["href"] != null)
                    {
                        var href = node.Attributes["href"].Value;
                        var newURL = href.Replace("/BrowseFiles", "");
                        String encoded = newURL.Replace(" ", "%20");
                        String CheckBad = StringInfo.GetNextTextElement(encoded, 0);
                        if (encoded.IndexOf("link") > 0)
                        {
                            String NewHtml = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles" + encoded);
                            var linked = NewHtml.ToString();

                            //this.websiteLinks += linked.ToString() + "||";
                            //var NewContent = node.InnerText.ToString().Replace(".link", "");
                            //this.websiteContent += NewContent + "||";
                            FileLink filed = new FileLink();
                            filed.link = linked.ToString();
                            var NewContent = node.InnerText.ToString().Replace(".link", "");
                            filed.Content = NewContent;
                            sites.Add(filed);


                        }
                        else if (encoded.IndexOf(".html") > 0)
                        {
                            String NewHtml3 = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles" + encoded);
                            SubHeader += NewHtml3.ToString() + "||";
                        }
                        
                        else if (encoded.IndexOf(".expand") >= 0 && String.IsNullOrEmpty(path) == true)
                        {
                            String NewHtml3 = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles" + encoded);
                            HtmlDocument doc3 = new HtmlDocument();
                            doc3.LoadHtml(NewHtml3);
                            foreach (HtmlNode node2 in doc3.DocumentNode.Descendants("a"))
                            {
                                var href2 = node2.Attributes["href"].Value;
                                var newURL2 = href2.Replace("/BrowseFiles", "");
                                String encoded2 = newURL2.Replace(" ", "%20");
                                if (encoded2.IndexOf("link") > 0)
                                {
                                    String NewHtml4 = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles" + encoded2);
                                    var linked = NewHtml4.ToString();
                                    FileLink filed = new FileLink();
                                    filed.link = linked.ToString();
                                    var NewContent = node2.InnerText.ToString().Replace(".link", "");
                                    filed.Content = NewContent;
                                    filed.ParentLink = encoded;
                                    filed.ParentContent = newURL;
                                    sites.Add(filed);
                                    //this.websiteLinks += linked.ToString() + "||";
                                  
                                    //this.websiteContent += NewContent + "||";



                                }
                                else
                                {
                                    FileLink filed = new FileLink();
                                    filed.link = newURL2.ToString();
                                    filed.Content = node2.InnerText.ToString();
                                    filed.ParentLink =  encoded;
                                    filed.ParentContent = newURL;
                                    AllFiles.Add(filed);
                                    //this.links += newURL2.ToString() + "||";
                                    //this.Content += node2.InnerText.ToString() + "||";
                                }
                            }

                        }
                        else if (encoded.IndexOf(".expand") >= 0 && path.IndexOf(".expand") < 0)
                        {
                            String NewHtml3 = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles" + encoded);
                            HtmlDocument doc3 = new HtmlDocument();
                            doc3.LoadHtml(NewHtml3);
                            foreach (HtmlNode node2 in doc3.DocumentNode.Descendants("a"))
                            {
                                var href2 = node2.Attributes["href"].Value;
                                var newURL2 = href2.Replace("/BrowseFiles", "");
                                String encoded2 = newURL2.Replace(" ", "%20");
                                if (encoded2.IndexOf("link") > 0)
                                {
                                    String NewHtml4 = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles" + encoded2);
                                    var linked = NewHtml4.ToString();
                                    FileLink filed = new FileLink();
                                    filed.link = linked.ToString();
                                    var NewContent = node2.InnerText.ToString().Replace(".link", "");
                                    filed.Content = NewContent;
                                    filed.ParentLink = encoded;
                                    filed.ParentContent = newURL;
                                    sites.Add(filed);
                                    //this.websiteLinks += linked.ToString() + "||";
                                    //var NewContent = node.InnerText.ToString().Replace(".link", "");
                                    //this.websiteContent += NewContent + "||";



                                }
                                else
                                {
                                    FileLink filed = new FileLink();
                                    filed.link = newURL2.ToString();
                                    filed.Content = node2.InnerText.ToString();
                                    filed.ParentLink =  encoded;
                                    filed.ParentContent = newURL;
                                    AllFiles.Add(filed);
                                    //this.links += newURL2.ToString() + "||";
                                    //this.Content += node2.InnerText.ToString() + "||";
                                }
                            }

                        }
                        else if (CheckBad == ".")
                        {

                        }
                        else
                        {
                            FileLink filed = new FileLink();
                            filed.link = newURL.ToString();
                            filed.Content = node.InnerText.ToString();
                            AllFiles.Add(filed);
                            //this.links += newURL.ToString() + "||";
                            //this.Content += node.InnerText.ToString() + "||";
                        }




                    }


                }

            }
            
                String NewHtml2 = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles/" + route + "/.page_content/" );
                HtmlDocument doc2 = new HtmlDocument();
                doc2.LoadHtml(NewHtml2);
                foreach (HtmlNode node2 in doc2.DocumentNode.Descendants("a"))
                {
                    if (node2.InnerText.IndexOf("jpg") > 0)
                    {
                        this.Images += "http://intranet.ormc.org/" + node2.Attributes["href"].Value + "||";

                    }
                    else if (node2.InnerText.IndexOf("png") > 0)
                    {
                        this.Images += "http://intranet.ormc.org/" + node2.Attributes["href"].Value + "||";
                    }
                    else if (node2.InnerText.IndexOf("title.txt") >= 0)
                    {
                        this.Title = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/" + node2.Attributes["href"].Value).ToString();
                    }
                    else if (node2.InnerText.IndexOf("page_sections") >= 0)
                    {
                        string xml = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/" + node2.Attributes["href"].Value).ToString();
                        XmlDocument xmlDoc = new XmlDocument();
                        xmlDoc.LoadXml(xml);
                        string pageSections = JsonConvert.SerializeXmlNode(xmlDoc);
                        this.pageSections = "";
                        this.pageSections = pageSections;
                    }
                    else if (node2.InnerText.IndexOf("contacts.xml") >= 0)
                    {

                        string xml = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/" + node2.Attributes["href"].Value).ToString();
                        XmlDocument xmlDoc = new XmlDocument();
                        xmlDoc.LoadXml(xml);
                        string conttacts = JsonConvert.SerializeXmlNode(xmlDoc);
                        this.Contacts = "";
                        this.Contacts = conttacts;

                    }
                }

            
            files = "";
            websites = "";
            files = JsonConvert.SerializeObject(AllFiles);
            websites = JsonConvert.SerializeObject(sites);
        }
        public async void Parsing(String website)
        {
            try
            {
                HttpClient http = new HttpClient();
                var response = await http.GetByteArrayAsync(website);
                String source = Encoding.GetEncoding("utf-8").GetString(response, 0, response.Length - 1);
                source = WebUtility.HtmlDecode(source);
                HtmlDocument resultat = new HtmlDocument();
                resultat.LoadHtml(source);
                List<HtmlNode> toftitle = resultat.DocumentNode.Descendants().Where
                 (x => (x.Name == "Body")).ToList();
                var li = toftitle[0].Descendants("pre").ToList();
                foreach (var item in li)
                {
                    var link = item.Descendants("a").ToList()[0].GetAttributeValue("href", null);
                    var title = item.Descendants("a").ToList()[0].InnerText;
                    //this.links = link;
                    //this.Content = title;
                }
            }
            catch (Exception)
            {
                this.Html = "Error";
            }
        }
        
        public string route { get; set; }
        public string path { get; set; }

        public String Html { get; set; }

        public static List<FileLink> AllFiles = new List<FileLink>();
        public static List<FileLink> sites = new List<FileLink>();
        public string files { get; set; }
        //public String links { get; set; }
        //public String Content { get; set; }
        public string pageSections { get; set; }
        public string websites { get; set; }
       // public String websiteLinks { get; set; }
        //public String websiteContent { get; set; }
        public String Images { get; set; }
        public String Title { get; set; }
        public String DisplayOrNot { get; set; }
        public String Contacts { get; set; }
        public String SubHeader { get; set; }
    }
    public class FileLink
    {
        public string link { get; set; }
        public string Content { get; set; }

        public string ParentLink { get; set; }
        public string ParentContent { get; set; }
    }
    
}