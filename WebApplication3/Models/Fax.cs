using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WebApplication3.SQL;



namespace WebApplication3.Models
{
    public class Fax
    {
        public Fax(string route, string path, string Page, string FirstDate, string secondDate, string edit,string ServiceStatus, string LN, string FN, string DOB, string ViewOnly = "N")
        {
            this.path = path;
            this.route = route;
            if (route != "All")
            {
                page = Page;
                String l = "";
                if (String.IsNullOrEmpty(ServiceStatus) == true)
                {
                    ServiceStatus = "None";
                }
                if (path == "ViewNew")
                {
                    path = "New";
                    this.ViewOnly = "Y";
                }else if (path == "ViewQueued")
                {
                    path = "Queued";
                    this.ViewOnly = "Y";
                }
                else if (path == "ViewAllFaxes")
                {
                    path = "AllFaxes";
                    this.ViewOnly = "Y";
                }
                else if (path == "ViewScheduledFaxes")
                {
                    path = "ScheduledFaxes";
                    this.ViewOnly = "Y";
                }
                else if (path == "ViewUnScheduledFaxes")
                {
                    path = "UnScheduledFaxes";
                    this.ViewOnly = "Y";
                }
                string hi = Get.GetInfusionFaxes(route, path, Page, FirstDate, secondDate, LN, FN, DOB, "None", ServiceStatus);
                Json = hi;
                Debug = route + "||" + path;
                if (route == "Infusion")
                {
                    Tabs = "Received Faxes:/Fax/Infusion/New?Page=1||Queued Faxes:/Fax/Infusion/Queued?Page=1";
                    if (path == "New")
                    {
                        HeaderTitle = "Received Faxes";

                        headerNames = "Edit||Status||CSID||Pages||Recieved Date";

                        RowNames = "edit||CurrentFaxStatus||CSID||Pages||ArchiveDate";
                    }
                    else if (path == "Queued")
                    {
                        HeaderTitle = "Queued Faxes";
                        headerNames = "Edit||Status||PTName||DOB||Service||Scheduled Date||Location||Recv Fax Date";

                        RowNames = "edit||StatusDescription||PtName||PtDOB||ServiceDescription||ScheduledDateGrid||LocationCode||ArchiveDate";
                    }
                    NewOrGet = "N";
                }
                if (route == "Concierge")
                {
                    Tabs = "Received Faxes:/Fax/Concierge/New?Page=1||Queued Faxes:/Fax/Concierge/Queued?Page=1";
                    if (path == "New")
                    {
                        HeaderTitle = "Received Faxes";

                        headerNames = "Edit||Status||CSID||Pages||Recieved Date";

                        RowNames = "edit||CurrentFaxStatus||CSID||Pages||ArchiveDate";
                    }
                    else if (path == "Queued")
                    {
                        HeaderTitle = "Queued Faxes";
                        headerNames = "Edit||Status||PTName||DOB||Service||Scheduled Date||Location||Recv Fax Date";

                        RowNames = "edit||StatusDescription||PtName||PtDOB||ServiceDescription||ScheduledDateGrid||LocationCode||ArchiveDate";
                    }
                    NewOrGet = "N";
                }
                else if (route == "OR")
                {
                    Tabs = "ReceivedFaxes:/Fax/OR/New?Page=1||AllFaxes:/Fax/OR/AllFaxes?Page=1||ScheduledFaxes:/Fax/OR/ScheduledFaxes?Page=1||UnScheduledFaxes:/Fax/OR/UnScheduledFaxes?Page=1";
                    if (path == "New")
                    {
                        HeaderTitle = "ReceivedFaxes";

                        headerNames = "Edit||Status||CSID||Pages||Recieved Date";

                        RowNames = "edit||CurrentFaxStatus||CSID||Pages||ArchiveDate";
                    }
                    else if ( path == "AllFaxes"|| path == "UnScheduledFaxes" || path == "ScheduledFaxes")
                    {
                        HeaderTitle = path;
                        headerNames = "Edit||Status||PTName||DOB||Service||Surgery Date||PST Date||Surgeon||Location||Recv Fax Date";

                        RowNames = "edit||StatusDescription||PtName||PtDOB||ServiceDescription||SurgeryDate||PSTDateGrid||Surgeon||LocationCode||ArchiveDate";
                    }
                    NewOrGet = "N";
                
                }
                else if (route == "Cardiac")
                {
                    Tabs = "ReceivedFaxes:/Fax/Cardiac/New?Page=1||QueuedFaxes:/Fax/Cardiac/Queued?Page=1";
                    if (path == "New")
                    {
                        HeaderTitle = "ReceivedFaxes";

                        headerNames = "Edit||Status||CSID||Pages||Recieved Date";

                        RowNames = "edit||CurrentFaxStatus||CSID||Pages||ArchiveDate";
                    }
                    else if (path == "Queued")
                    {
                        HeaderTitle = "QueuedFaxes";
                        headerNames = "Edit||Status||PTName||DOB||Service||Location||Recv Fax Date";

                        RowNames = "edit||StatusDescription||PtName||PtDOB||ServiceDescription||LocationCode||ArchiveDate";
                    }
                    NewOrGet = "N";  

                }
                else if (route == "Ent")
                {
                    Tabs = "ReceivedFaxes:/Fax/Ent/New?Page=1||AllFaxes:/Fax/Ent/AllFaxes?Page=1||ScheduledFaxes:/Fax/Ent/ScheduledFaxes?Page=1||UnScheduledFaxes:/Fax/Ent/UnScheduledFaxes?Page=1"; ;
                    if (path == "New")
                    {
                        HeaderTitle = "ReceivedFaxes";

                        headerNames = "Edit||Status||CSID||Pages||Recieved Date";

                        RowNames = "edit||CurrentFaxStatus||CSID||Pages||ArchiveDate";
                    }
                    else if (path == "AllFaxes" || path == "UnScheduledFaxes" || path == "ScheduledFaxes")
                    {
                        HeaderTitle = path;
                        headerNames = "Edit||Status||PTName||DOB||Service||Location||Recv Fax Date";

                        RowNames = "edit||StatusDescription||PtName||PtDOB||ServiceDescription||LocationCode||ArchiveDate";
                    }
                    NewOrGet = "N";

                }
                else if (route == "InfusionNewFax" || route == "ORNewFax" || route == "CardiacNewFax" || route == "EntNewFax" || route == "ConciergeNewFax")
                {
                    this.route = route.Replace("NewFax", "");
                    HeaderTitle = "Orange Regional Medical Center " + this.route + " Fax Management";
                    NewOrGet = "Y";
                    if (String.IsNullOrEmpty(edit) == false)
                    {
                        String TempNumber = "";
                        String Lame = "";
                        if (String.IsNullOrEmpty(page) == true)
                        {
                            TempNumber = "1";
                        }
                        else
                        {
                            TempNumber = page;
                        }
                        if (route == "InfusionNewFax")
                        {
                            this.route = "Infusion";
                            PTJson = Get.GetInfusionFaxes("Infusion", "PtDetail", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                            FaxTypes = Get.GetInfusionFaxes("Infusion", "InfusionFaxTypes", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                        }
                        else if (route == "ORNewFax")
                        {
                            this.route = "OR";
                            PTJson = Get.GetInfusionFaxes("OR", "PtDetail", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                            FaxTypes = Get.GetInfusionFaxes("OR", "ORFaxTypes", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                        }
                        else if (route == "EntNewFax")
                        {
                            this.route = "Ent";
                            PTJson = Get.GetInfusionFaxes("Ent", "PtDetail", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                            FaxTypes = Get.GetInfusionFaxes("Ent", "EntFaxTypes", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                        }
                        else if (route == "CardiacNewFax")
                        {
                            this.route = "Cardiac";
                            PTJson = Get.GetInfusionFaxes("Cardiac", "PtDetail", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                            FaxTypes = Get.GetInfusionFaxes("Cardiac", "CardiacFaxTypes", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                        }
                        else if (route == "ConciergeNewFax")
                        {
                            this.route = "Concierge";
                            PTJson = Get.GetInfusionFaxes("Concierge", "PtDetail", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                            FaxTypes = Get.GetInfusionFaxes("Concierge", "ConciergeFaxTypes", TempNumber, FirstDate, secondDate, Lame, Lame, Lame);
                        }


                    }
                }



            }else {
                HeaderTitle = "All Faxes";
                Json = "OR Fax:New Faxes:Queued Faxes:UnScheduled Faxes:Scheduled Faxes:All Faxes:/Fax/OR/New?Page=1"
                + "||Cardiac Cath Fax:New Faxes:Queued Faxes:UnScheduled Faxes:Scheduled Faxes:All Faxes:/Fax/Cardiac/New?Page=1"
                + "||Infusion:New Faxes:Queued Faxes:UnScheduled Faxes:Scheduled Faxes:All Faxes:/Fax/Infusion/New?Page=1" +
                "||Concierge Fax:New Faxes:Queued Faxes:UnScheduled Faxes:Scheduled Faxes:All Faxes:/Fax/Concierge/New?Page=1"
                + "||Ent Fax: New Faxes:Queued Faxes:UnScheduled Faxes:Scheduled Faxes:All Faxes:/Fax/Ent/New?Page=1";
            }
        }
        public string Json { get; set; }
        public string Debug { get; set; }

        public string FaxTypes { get; set; }
        public string Tabs { get; set; }
        public string HeaderTitle { get; set; }
        public string path { get; set; }
        public string route { get; set; }
        public string NewOrGet { get; set; }
        public string page { get; set; }
        public string FirstDate { get; set; }
        public string secondDate { get; set; }
        public string edit { get; set; }
        public string headerNames { get; set; }
        public string RowNames { get; set; }
        public string PTJson { get; set; }
        public string ViewOnly { get; set; }
    }
}
    
