using HtmlAgilityPack;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Xml;
using WebApplication3.Models;

namespace WebApplication3.CustomApps.Files
{
    public class FileInfo
    {
        public static FileModel2 GetFileInfo(string route, string path)
        {
            FileModel2 Results = new FileModel2();
            Results.route = route;
            Results.path = path;
            var URLToUse = "http://intranet.ormc.org/BrowseFiles/" + route + "/" + path;
            List<SubFile> AllFiles = new List<SubFile>();
            List<SubFile> sites = new List<SubFile>();
            String Content = WebScraping.WebPage.GetURLText(URLToUse);

            String source = Content;
            if (Content == null)
            {
                Results.Html = "Error";
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
                        if (encoded.IndexOf(".link") > 0)
                        {
                            String NewHtml = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles" + encoded);
                            var linked = NewHtml.ToString();

                            //this.websiteLinks += linked.ToString() + "||";
                            //var NewContent = node.InnerText.ToString().Replace(".link", "");
                            //this.websiteContent += NewContent + "||";
                            SubFile filed = new SubFile();
                            filed.link = linked.ToString();
                            var NewContent = node.InnerText.ToString().Replace(".link", "");
                            filed.Content = NewContent;
                            sites.Add(filed);


                        }
                        else if (encoded.IndexOf(".html") > 0)
                        {
                            String NewHtml3 = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles" + encoded);
                            Results.SubHeader += NewHtml3.ToString() + "||";
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
                                    SubFile filed = new SubFile();
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
                                    SubFile filed = new SubFile();
                                    filed.link = newURL2.ToString();
                                    filed.Content = node2.InnerText.ToString();
                                    filed.ParentLink = encoded;
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
                                    SubFile filed = new SubFile();
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
                                    SubFile filed = new SubFile();
                                    filed.link = newURL2.ToString();
                                    filed.Content = node2.InnerText.ToString();
                                    filed.ParentLink = encoded;
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
                            SubFile filed = new SubFile();
                            filed.link = newURL.ToString();
                            filed.Content = node.InnerText.ToString();
                            AllFiles.Add(filed);
                            //this.links += newURL.ToString() + "||";
                            //this.Content += node.InnerText.ToString() + "||";
                        }




                    }


                }

            }

            String NewHtml2 = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/BrowseFiles/" + route + "/.page_content/");
            HtmlDocument doc2 = new HtmlDocument();
            doc2.LoadHtml(NewHtml2);
            foreach (HtmlNode node2 in doc2.DocumentNode.Descendants("a"))
            {
                if (node2.InnerText.IndexOf("jpg") > 0)
                {
                    Results.Images += "http://intranet.ormc.org/" + node2.Attributes["href"].Value + "||";

                }
                else if (node2.InnerText.IndexOf("png") > 0)
                {
                    Results.Images += "http://intranet.ormc.org/" + node2.Attributes["href"].Value + "||";
                }
                else if (node2.InnerText.IndexOf("title.txt") >= 0)
                {
                    Results.Title = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/" + node2.Attributes["href"].Value).ToString();
                }
                else if (node2.InnerText.IndexOf("page_sections") >= 0)
                {
                    string xml = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/" + node2.Attributes["href"].Value).ToString();
                    XmlDocument xmlDoc = new XmlDocument();
                    xmlDoc.LoadXml(xml);
                    string pageSections = JsonConvert.SerializeXmlNode(xmlDoc);
                    Results.pageSections = "";
                    Results.pageSections = pageSections;
                }
                else if (node2.InnerText.IndexOf("contacts.xml") >= 0)
                {

                    string xml = WebScraping.WebPage.GetURLText("http://intranet.ormc.org/" + node2.Attributes["href"].Value).ToString();
                    XmlDocument xmlDoc = new XmlDocument();
                    xmlDoc.LoadXml(xml);
                    string conttacts = JsonConvert.SerializeXmlNode(xmlDoc);
                    Results.Contacts = "";
                    Results.Contacts = conttacts;

                }
            }


            Results.files = "";
            Results.websites = "";
            Results.files = JsonConvert.SerializeObject(AllFiles);
            Results.websites = JsonConvert.SerializeObject(sites);
            FileModel2.AllFiles = AllFiles;
            FileModel2.sites = sites;


            return Results;
        }
    
    }
}