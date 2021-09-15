using System;
using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web;
using WebApplication3.SharePointApi;

namespace WebApplication3.SendEmail
{
    public class SendEmail
    {
        public static string Send(string to, string subject, string body)
        {
           

            SmtpClient client = new SmtpClient("smtpservice.ormc.org ");
            
            client.UseDefaultCredentials = true;
            
            MailMessage mailMsg = new MailMessage();
            mailMsg.To.Add(new MailAddress(to));
            MailAddress mailAddress = new MailAddress("Policy&Procedures@ghvhs.org");
            mailMsg.From = mailAddress;
            mailMsg.Subject = subject;
            mailMsg.Body = body;
            mailMsg.IsBodyHtml = true;
            try
            {
                client.Send(mailMsg);
                return "true";
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public static string NewUpload(string fileName, string link, string user)
        {
            string html = @"C:\Users\jmuller3\documents\visual studio 2015\Projects\WebApplication3\WebApplication3\EmailTemplates\NewUpload.html";
            string path = System.Web.Hosting.HostingEnvironment.MapPath(@"\EmailTemplates\NewUpload.html");
            html = path;
            string nameForEmail = "";
            string Body = System.IO.File.ReadAllText(html);
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            if (String.IsNullOrEmpty(user) == false)
            {
                uName = user;
                nameForEmail = uName;
            }
            else
            {
                nameForEmail = uName.Replace("GHVHS\\", "");
                nameForEmail = uName.Replace(@"GHVHS\", "");
            }
            UserPrincipal currentUser = UserPrincipal.FindByIdentity(ctx, uName);
            Body = Body.Replace("!USER!", nameForEmail);
            Body = Body.Replace("!FILENAME!", fileName);
            Body = Body.Replace("!LINK!", link);
            string to = currentUser.EmailAddress;
            string subject = fileName + " has now been uploaded";
            return Send(to, subject, Body);
        }
        public static string NewTasks(string fileName, string link, string user, string uploaded, string ConvoLink, string date, string email)
        {
            string html = @"C:\Users\jmuller3\documents\visual studio 2015\Projects\WebApplication3\WebApplication3\EmailTemplates\NewTasks.html";
            string path = System.Web.Hosting.HostingEnvironment.MapPath(@"\EmailTemplates\NewTasks.html");
            html = path;
            string nameForEmail = "";
            string Body = System.IO.File.ReadAllText(html);
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            if (String.IsNullOrEmpty(user) == false)
            {
                uName = user;
                nameForEmail = uName;
            }
            else
            {
                nameForEmail = uName.Replace("GHVHS\\", "");
                nameForEmail = uName.Replace(@"GHVHS\", "");
            }
            UserPrincipal currentUser = UserPrincipal.FindByIdentity(ctx, uName);
            Body = Body.Replace("!USER!", nameForEmail);
            Body = Body.Replace("!UPLOADER!", uploaded);
            Body = Body.Replace("!LINK!", link);
            Body = Body.Replace("!Title!", fileName);
            Body = Body.Replace("!CONVO!", ConvoLink);
            Body = Body.Replace("!Date!", date); 
            Body = Body.Replace("!Header!", "New Concurrence Task");
            Body = Body.Replace("!Concur!", "You have a new  concurrence task. You can review it");
            Body = Body.Replace("!DisCuss!", "A new conversation has been added to the discussion board. You can view it");
            Body = Body.Replace("!UserMsg!", uploaded + " has uploaded new  policy for your review.");
            string to = "";
            if (String.IsNullOrEmpty(email) == true) {
                to = currentUser.EmailAddress;
            }else
            {
                to = email;
            }
            string subject = "New Concurrence Task";
            return Send(to, subject, Body);
        }
        public static string NewMessage(string uploaded, string user, string message, string ConvoLink, string link, string email)
        {
            string html = @"C:\Users\jmuller3\documents\visual studio 2015\Projects\WebApplication3\WebApplication3\EmailTemplates\NewMessage.html";
            string path = System.Web.Hosting.HostingEnvironment.MapPath(@"\EmailTemplates\NewMessage.html");
            html = path;
            string nameForEmail = "";
            string Body = System.IO.File.ReadAllText(html);
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            if (String.IsNullOrEmpty(user) == false)
            {
                uName = user;
                nameForEmail = uName;
            }
            else
            {
                nameForEmail = uName.Replace("GHVHS\\", "");
                nameForEmail = uName.Replace(@"GHVHS\", "");
            }
            UserPrincipal currentUser = UserPrincipal.FindByIdentity(ctx, uName);
            Body = Body.Replace("!USER!", nameForEmail);
            Body = Body.Replace("!UPLOADER!", uploaded);
            Body = Body.Replace("!LINK!", link);
            Body = Body.Replace("!Message!", message);
            Body = Body.Replace("!CONVO!", ConvoLink);
            string to = "";
            if (currentUser != null) {
                if (String.IsNullOrEmpty(email) == true)
                {
                    to = currentUser.EmailAddress;
                }
                else
                {
                    to = email;
                }
                string subject = "New Message Posted in Discussion Board";
                return Send(to, subject, Body);
            }else
            {
                return "user not found";
            }
        }
        public static string ApprovedConcurrer(string Approver, string user, string Title, string link, string email, string FinalApproval)
        {
            string html = @"C:\Users\jmuller3\documents\visual studio 2015\Projects\WebApplication3\WebApplication3\EmailTemplates\ApprovedConcurrer.html";
            string path = System.Web.Hosting.HostingEnvironment.MapPath(@"\EmailTemplates\ApprovedConcurrer.html");
            html = path;
            string nameForEmail = "";
            string subject = "";
            string content = "";
            string Body = System.IO.File.ReadAllText(html);
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            if (String.IsNullOrEmpty(user) == false)
            {
                uName = user;
                nameForEmail = uName;
            }
            else
            {
                nameForEmail = uName.Replace("GHVHS\\", "");
                nameForEmail = uName.Replace(@"GHVHS\", "");
            }
            UserPrincipal currentUser = UserPrincipal.FindByIdentity(ctx, uName);
            Body = Body.Replace("!USER!", nameForEmail);
            Body = Body.Replace("!Approver!", Approver);
            Body = Body.Replace("!LINK!", link);
            if (FinalApproval == "N")
            {
                Title = Title.Replace("Please Concur on", "");
                subject = "Concurrer has approved their task";
                Body = Body.Replace("!Image!", @"http://sqldev:81/img/Approved.jpg");
                content = Approver+" has approved their concurrence task";
                Body = Body.Replace("!Content!", content);
                Title = Title + " Approved by " + Approver;
            }
            else if (FinalApproval == "Y")
            {
                Title = Title.Replace("Finial Approval For", "");
                content = Title + "'s Final Approval Completed and Added to Approved Policies.";
                subject = Title+"'s Final Approval Completed and Added to Approved Policies.";
                Body = Body.Replace("!Image!", @"http://sqldev:81/img/ApprovedFinal.jpg");
                Body = Body.Replace("!Content!", content);

            }
            else if (FinalApproval == "R")
            {
                Title = Title.Replace("Please Approve", "");
                subject = Approver + " has rejected " + Title + "'s Concurrence ";
                Body = Body.Replace("!Image!", @"http://sqldev:81/img/Rejected.png");
                content = subject;
                Body = Body.Replace("!Content!", content);
                Title = Approver + " has rejected " + Title + "'s Concurrence ";
            }
            Title = Title.Replace("Finial Approval For", "Final Approval For");
            Body = Body.Replace("!Title!", Title);
            string to = "";
            if (currentUser != null)
            {
                if (String.IsNullOrEmpty(email) == true)
                {
                    to = currentUser.EmailAddress;
                }
                else
                {
                    to = email;
                }
               
                return Send(to, subject, Body);
            }
            else
            {
                return "user not found";
            }
        }
        public static string NewApproverTasks(string fileName, string link, string user, string uploaded, string ConvoLink, string date, string email)
        {
            string html = @"C:\Users\jmuller3\documents\visual studio 2015\Projects\WebApplication3\WebApplication3\EmailTemplates\NewTasks.html";
            string path = System.Web.Hosting.HostingEnvironment.MapPath(@"\EmailTemplates\NewTasks.html");
            html = path;
            string nameForEmail = "";
            string Body = System.IO.File.ReadAllText(html);
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            if (String.IsNullOrEmpty(user) == false)
            {
                uName = user;
                nameForEmail = uName;
            }
            else
            {
                nameForEmail = uName.Replace("GHVHS\\", "");
                nameForEmail = uName.Replace(@"GHVHS\", "");
            }
            UserPrincipal currentUser = UserPrincipal.FindByIdentity(ctx, uName);
            Body = Body.Replace("!USER!", nameForEmail);
            Body = Body.Replace("!UPLOADER!", uploaded);
            Body = Body.Replace("!LINK!", link);
            Body = Body.Replace("!Title!", fileName);
            Body = Body.Replace("!CONVO!", ConvoLink);
            Body = Body.Replace("!Date!", date);
            Body = Body.Replace("!Header!", "New Approval Task");
            Body = Body.Replace("!DisCuss!", "View the discussion board ");
            Body = Body.Replace("!Concur!", "You have a new Approval task. You can review it");
            Body = Body.Replace("!UserMsg!", "Concurrerence has finished, you have been tasked with the finial approval");
            string to = "";
            if (String.IsNullOrEmpty(email) == true)
            {
                to = currentUser.EmailAddress;
            }
            else
            {
                to = email;
            }
            string subject = "New Approval Task";
            return Send(to, subject, Body);
        }
    }
}