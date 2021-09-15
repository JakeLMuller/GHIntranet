using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.SQL
{
    public class PtFax
    {
        public static string getPtFax(String TableToUseMain, String TableToUseSub, String Id = "None")
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            if (TableToUseMain == "Infusion")
            {
                if (TableToUseSub == "FaxQueuedServices")
                {
                    DB = "SELECT tblInfusionFaxServiceToDocument.FaxToServiceTypeID, tblInfusionFaxServiceToDocument.FaxID, tblInfusionFaxServiceToDocument.DocumentTypeID, "

                        + " tblInfusionFaxServiceToDocument.FaxServiceToDocumentID, tblInfusionFaxTypes.FaxTypeID,"
                        + " tblInfusionFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20), tblInfusionFaxServiceToDocument.UpdateDate) As UpdateDate,"
                        + " tblInfusionFaxReceivedFaxes.FileLocation + tblInfusionFaxReceivedFaxes.FileName As FileName"
                        + " FROM tblInfusionFaxServiceToDocument INNER JOIN"
                        + " tblInfusionFaxReceivedFaxes ON tblInfusionFaxServiceToDocument.FaxID = tblInfusionFaxReceivedFaxes.FaxID LEFT OUTER JOIN"
                        + " tblInfusionFaxTypes ON tblInfusionFaxServiceToDocument.DocumentTypeID = tblInfusionFaxTypes.FaxTypeID"
                        + " WHERE FaxToServiceTypeID =" + Id
                        + " UNION SELECT '0' As FaxToServiceTypeID, '' As FaxID, '' As DocumentTypeID, '' As FaxServiceToDocumentID,"
                         + " '' As FaxTypeID, '' As FaxTypeDescription, '' As UpdateDate, '' As FileName"
                         +" ORDER BY FaxServiceToDocumentID";

                    
                }
                else if (TableToUseSub == "QueuedServices")
                {
                    DB = "SELECT AuthNeeded, ServiceDescription, isnull(LocationDescription,'') as LocationDescription, isnull(LocationCode,'') as LocationCode," 
                        +" isnull(UpdatedBy,'') as UpdatedBy,ServiceGroup,FaxPtDetailID,FaxToServiceTypeID,ScheduledDateTime as ScheduledDate,"
                        +" isnull(Convert(varchar(20), ScheduledDateTime, 101), getdate()) as ScheduledDate2, "
                        +" StatusDescription AS StatusDescription, StatusID AS StatusID, "
                        +" convert(varchar(2), DatePart(hh, ScheduledDateTime)) + ':' + right('0' + convert(varchar(2),"
                        +" DatePart(mi, ScheduledDateTime)), 2) as ScheduledTime FROM vwInfusionFaxQueuedServices Where ExpiredDateTime is null and FaxPtDetailID = " + Id;
                }
                else if (TableToUseSub == "FaxReceivedFaxes")
                {
                    DB = "Select FaxPtDetailID, CallerID, CSID, ID, Pages, RoutingInfo, FaxSize, TransmissionStart, TransmissionEnd, TSID, FileName, FileLocation, ArchiveDate,"
                        + " Services,PtName, ptFirstName, ptLastName, PtDOB, Services, DrID, DrName"
                        + " From vwInfusionFaxReceivedFaxesWRefPhys";
                    if (Id != "None")
                    {
                        DB += " where FaxPtDetailID = '" + Id + "'";
                    }
                }
                else if (TableToUseSub == "FaxToServiceTypeID")
                {
                    DB = "SELECT  FaxPTDetailID, FaxID, ServiceDescription, "
                           + " FileName, FileLocation, ReceivedDate, InsertedBy, InsertedDate, FaxTypeDescription"
                           + " FROM vwInfusionFaxQueuedServicesAttachments"
                           + " WHERE FaxPTDetailID = " + Id
                                + " UNION"
                           + " SELECT FaxPTDetailID, tblInfusionFaxPtDetail.FaxID,"
                           + " Upper(tblInfusionFaxPtDetail.Services) + ' :ORIGINAL'  As ServiceDescription,"
                           + " tblInfusionFaxReceivedFaxes.FileName,  tblInfusionFaxReceivedFaxes.FileLocation,"
                           + " tblInfusionFaxReceivedFaxes.TransmissionEnd As ReceivedDate,tblInfusionFaxPtDetail.LoadedBy As InsertedBy,"
                           + " IsNull(tblInfusionFaxPtDetail.LoadedDate, '') As InsertedDate, 'Infusion:Original' As FaxTypeDescription"
                           + " FROM tblInfusionFaxPtDetail INNER JOIN tblInfusionFaxReceivedFaxes ON tblInfusionFaxPtDetail.FaxID = tblInfusionFaxReceivedFaxes.FaxID"
                           + " WHERE FaxPTDetailID = " + Id;

                }
            }
            else if (TableToUseMain == "OR")
            {
                if (TableToUseSub == "QueuedServices")
                {
                    DB = "SELECT isnull(Hospitalist,'')as Hospitalist, isnull(BoneAndJoint,'') as BoneAndJoint, ServiceDescription, "
                        + " isnull(LocationDescription,'') as LocationDescription, isnull(LocationCode,'') as LocationCode, isnull(UpdatedBy,'') as UpdatedBy, "
                        + "ServiceGroup, FaxPtDetailID, FaxToServiceTypeID, '' FaxTypeDescription, StatusDescription AS StatusDescription, StatusID AS StatusID "
                        + " FROM vwORFaxQueuedServices Where ExpiredDateTime is null ";

                    if (Id != "None")
                    {
                        DB += " AND FaxPTDetailID = '" + Id + "'";
                    }
                }
                else if (TableToUseSub == "FaxReceivedFaxes")
                {
                    DB = " Select FaxPtDetailID, CallerID, CSID, ID, Pages, RoutingInfo, FaxSize, TransmissionStart, TransmissionEnd, TSID, FileName, FileLocation,"
                        +" ArchiveDate,Services ,PtName, ptFirstName, ptLastName, PtDOB, SurgeryDate, IsNull(PSTDate,'') PSTDate, Services, DrID, DrName,"
                        +" IsNull(LocationCode,'') As LocationCode, IsNull(Description,'') As Description,IsNull(BoneAndJoint,'N') As BoneAndJoint,"
                        +" IsNull(Hospitalist,'N') As Hospitalist, IsNull(Page,'') As Page, IsNull(StatusDescription,'N') As StatusDescription " 
                        +" From vwORFaxReceivedFaxesWRefPhys ";
                    if (Id != "None")
                    {
                        DB += " where FaxPtDetailID = '" + Id + "'";
                    }
                }else if (TableToUseSub == "FaxToServiceTypeID")
                {
                    DB = "SELECT  FaxPTDetailID, FaxID, ServiceDescription, "
                     +" FileName, FileLocation, ReceivedDate, InsertedBy, InsertedDate, FaxTypeDescription " 
                     +" FROM vwORFaxQueuedServicesAttachments "
                     +" WHERE FaxPTDetailID = " + Id
                     +" UNION "
                     +" SELECT FaxPTDetailID, tblORFaxPtDetail.FaxID, Upper(tblORFaxPtDetail.Services) + ' :ORIGINAL'  As ServiceDescription, tblORFaxReceivedFaxes.FileName,"
                     +" tblORFaxReceivedFaxes.FileLocation, tblORFaxReceivedFaxes.TransmissionEnd As ReceivedDate,tblORFaxPtDetail.LoadedBy As InsertedBy, IsNull(tblORFaxPtDetail.LoadedDate,'') As InsertedDate, "
                     +" 'Surgery:Original' As FaxTypeDescription FROM tblORFaxPtDetail INNER JOIN tblORFaxReceivedFaxes ON tblORFaxPtDetail.FaxID = tblORFaxReceivedFaxes.FaxID"
                     +" WHERE FaxPTDetailID = " + Id;
                }
                else if (TableToUseSub == "FaxQueuedServices")
                {
                    DB = "SELECT tblORFaxServiceToDocument.FaxToServiceTypeID, tblORFaxServiceToDocument.FaxID, tblORFaxServiceToDocument.DocumentTypeID, "
                        +" tblORFaxServiceToDocument.FaxServiceToDocumentID, tblORFaxTypes.FaxTypeID, "
                        +" tblORFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20),tblORFaxServiceToDocument.UpdateDate) As UpdateDate, "
                        +" tblORFaxReceivedFaxes.FileLocation + tblORFaxReceivedFaxes.FileName As FileName " 
                        +" FROM tblORFaxServiceToDocument INNER JOIN "
                        +" tblORFaxReceivedFaxes ON tblORFaxServiceToDocument.FaxID = tblORFaxReceivedFaxes.FaxID LEFT OUTER JOIN " 
                        +" tblORFaxTypes ON tblORFaxServiceToDocument.DocumentTypeID = tblORFaxTypes.FaxTypeID " 
                        +" WHERE FaxToServiceTypeID = " + Id
                        +" UNION SELECT '0' As FaxToServiceTypeID, '' As FaxID, '' As DocumentTypeID, '' As FaxServiceToDocumentID, " 
                        +" '' As FaxTypeID, '' As FaxTypeDescription, '' As UpdateDate, '' As FileName "
                        +" ORDER BY FaxServiceToDocumentID ";

                }
            }
            else if (TableToUseMain == "Ent")
            {
                if (TableToUseSub == "QueuedServices")
                {
                    DB = "SELECT AuthNeeded, ServiceDescription, isnull(LocationDescription,'') as LocationDescription, isnull(LocationCode,'') as LocationCode,"
                        +" isnull(UpdatedBy,'') as UpdatedBy, ServiceGroup, FaxPtDetailID,FaxToServiceTypeID,ScheduledDateTime as ScheduledDate,isnull(Convert(varchar(20),"
                        +" ScheduledDateTime,101),getdate()) as ScheduledDate2, StatusDescription AS StatusDescription, StatusID AS StatusID, "
                        +" convert(varchar(2),DatePart(hh,ScheduledDateTime)) + ':' + right('0' + convert(varchar(2),DatePart(mi,ScheduledDateTime)),2) as ScheduledTime" 
                        +" FROM vwEntFaxQueuedServices Where ExpiredDateTime is null";



                    if (Id != "None")
                    {
                        DB += " AND FaxPTDetailID = '" + Id + "'";
                    }
                }
                else if (TableToUseSub == "FaxQueuedServices")
                {
                    DB = "SELECT tblEntFaxServiceToDocument.FaxToServiceTypeID, tblEntFaxServiceToDocument.FaxID, tblEntFaxServiceToDocument.DocumentTypeID, "
                         + " tblEntFaxServiceToDocument.FaxServiceToDocumentID, tblEntFaxTypes.FaxTypeID, "
                         + " tblEntFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20),tblEntFaxServiceToDocument.UpdateDate) As UpdateDate, "
                         + " tblEntFaxReceivedFaxes.FileLocation + tblEntFaxReceivedFaxes.FileName As FileName "
                         + " FROM tblEntFaxServiceToDocument INNER JOIN "
                         + " tblEntFaxReceivedFaxes ON tblEntFaxServiceToDocument.FaxID = tblEntFaxReceivedFaxes.FaxID LEFT OUTER JOIN "
                         + " tblEntFaxTypes ON tblEntFaxServiceToDocument.DocumentTypeID = tblEntFaxTypes.FaxTypeID "
                         + " WHERE FaxToServiceTypeID = " + Id
                         + " UNION SELECT '0' As FaxToServiceTypeID, '' As FaxID, '' As DocumentTypeID, '' As FaxServiceToDocumentID, "
                         + " '' As FaxTypeID, '' As FaxTypeDescription, '' As UpdateDate, '' As FileName "
                         + " ORDER BY FaxServiceToDocumentID ";
                }
                else if (TableToUseSub == "FaxReceivedFaxes")
                {
                    DB = "Select FaxPtDetailID, CallerID, CSID, ID, Pages, RoutingInfo, FaxSize, TransmissionStart, TransmissionEnd, TSID, FileName, FileLocation,"
                        +" ArchiveDate,Services,PtName, ptFirstName, ptLastName, PtDOB, Services, DrID, DrName "
                        +" From vwEntFaxReceivedFaxesWRefPhys";
                    if (Id != "None")
                    {
                        DB += " where FaxPtDetailID = '" + Id + "'";
                    }
                }
                else if (TableToUseSub == "FaxToServiceTypeID")
                {
                    DB = "SELECT  FaxPTDetailID, FaxID, ServiceDescription, "
                    + " FileName, FileLocation, ReceivedDate, InsertedBy, InsertedDate, FaxTypeDescription "
                    + " FROM vwEntFaxQueuedServicesAttachments "
                    + " WHERE FaxPTDetailID = " + Id
                    + " UNION "
                    + " SELECT FaxPTDetailID, tblEntFaxPtDetail.FaxID, Upper(tblEntFaxPtDetail.Services) + ' :ORIGINAL'  As ServiceDescription, tblEntFaxReceivedFaxes.FileName, tblEntFaxReceivedFaxes.FileLocation,"
                    + " tblEntFaxReceivedFaxes.TransmissionEnd As ReceivedDate,tblEntFaxPtDetail.LoadedBy As InsertedBy, IsNull(tblEntFaxPtDetail.LoadedDate,'') As InsertedDate, 'Ent:Original' As FaxTypeDescription"
                    + " FROM tblEntFaxPtDetail INNER JOIN tblEntFaxReceivedFaxes ON tblEntFaxPtDetail.FaxID = tblEntFaxReceivedFaxes.FaxID"
                    + " WHERE FaxPTDetailID = " + Id;
                }
            }
            else if (TableToUseMain == "Cardiac")
            {
                if (TableToUseSub == "QueuedServices")
                {
                    DB = "SELECT AuthNeeded, ServiceDescription, isnull(LocationDescription,'') as LocationDescription, isnull(LocationCode,'') as LocationCode,"
                         + " isnull(UpdatedBy,'') as UpdatedBy, ServiceGroup, FaxPtDetailID,FaxToServiceTypeID,ScheduledDateTime as ScheduledDate,isnull(Convert(varchar(20),"
                         + " ScheduledDateTime,101),getdate()) as ScheduledDate2, StatusDescription AS StatusDescription, StatusID AS StatusID, "
                         + " convert(varchar(2),DatePart(hh,ScheduledDateTime)) + ':' + right('0' + convert(varchar(2),DatePart(mi,ScheduledDateTime)),2) as ScheduledTime "
                         + " FROM vwCardiacCathFaxQueuedServices Where ExpiredDateTime is null ";



                    if (Id != "None")
                    {
                        DB += " AND FaxPTDetailID = '" + Id + "'";
                    }
                }
                else if (TableToUseSub == "FaxQueuedServices")
                {
                    DB = "SELECT tblCardiacCathFaxServiceToDocument.FaxToServiceTypeID, tblCardiacCathFaxServiceToDocument.FaxID, tblCardiacCathFaxServiceToDocument.DocumentTypeID, "
                         + " tblCardiacCathFaxServiceToDocument.FaxServiceToDocumentID, tblCardiacCathFaxTypes.FaxTypeID, "
                         + " tblCardiacCathFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20),tblCardiacCathFaxServiceToDocument.UpdateDate) As UpdateDate, "
                         + " tblCardiacCathFaxReceivedFaxes.FileLocation + tblCardiacCathFaxReceivedFaxes.FileName As FileName "
                         + " FROM tblCardiacCathFaxServiceToDocument INNER JOIN "
                         + " tblCardiacCathFaxReceivedFaxes ON tblCardiacCathFaxServiceToDocument.FaxID = tblCardiacCathFaxReceivedFaxes.FaxID LEFT OUTER JOIN "
                         + " tblCardiacCathFaxTypes ON tblCardiacCathFaxServiceToDocument.DocumentTypeID = tblCardiacCathFaxTypes.FaxTypeID "
                         + " WHERE FaxToServiceTypeID = " + Id
                         + " UNION SELECT '0' As FaxToServiceTypeID, '' As FaxID, '' As DocumentTypeID, '' As FaxServiceToDocumentID, "
                         + " '' As FaxTypeID, '' As FaxTypeDescription, '' As UpdateDate, '' As FileName "
                         + " ORDER BY FaxServiceToDocumentID ";
                }
                else if (TableToUseSub == "FaxReceivedFaxes")
                {
                    DB = "Select FaxPtDetailID, CallerID, CSID, ID, Pages, RoutingInfo, FaxSize, TransmissionStart, TransmissionEnd, TSID, FileName, FileLocation,"
                         +" ArchiveDate,Services,PtName, ptFirstName, ptLastName, PtDOB, Services, DrID, DrName "
                         + " From vwCardiacCathFaxReceivedFaxesWRefPhys ";
                    if (Id != "None")
                    {
                        DB += " where FaxPtDetailID = '" + Id + "'";
                    }
                }
                else if (TableToUseSub == "FaxToServiceTypeID")
                {
                    DB = "SELECT  FaxPTDetailID, FaxID, ServiceDescription, "
                    + " FileName, FileLocation, ReceivedDate, InsertedBy, InsertedDate, FaxTypeDescription "
                    + " FROM vwCardiacCathFaxQueuedServicesAttachments "
                    + " WHERE FaxPTDetailID = " + Id
                    + " UNION "
                    + " SELECT FaxPTDetailID, tblCardiacCathFaxPtDetail.FaxID, Upper(tblCardiacCathFaxPtDetail.Services) + ' :ORIGINAL'  As ServiceDescription, tblCardiacCathFaxReceivedFaxes.FileName, tblCardiacCathFaxReceivedFaxes.FileLocation,"
                    + " tblCardiacCathFaxReceivedFaxes.TransmissionEnd As ReceivedDate,tblCardiacCathFaxPtDetail.LoadedBy As InsertedBy, IsNull(tblCardiacCathFaxPtDetail.LoadedDate,'') As InsertedDate, 'Ent:Original' As FaxTypeDescription"
                    + " FROM tblCardiacCathFaxPtDetail INNER JOIN tblCardiacCathFaxReceivedFaxes ON tblCardiacCathFaxPtDetail.FaxID = tblCardiacCathFaxReceivedFaxes.FaxID"
                    + " WHERE FaxPTDetailID = " + Id;
                }
            }
            else if (TableToUseMain == "Concierge")
            {
                if (TableToUseSub == "QueuedServices")
                {
                    DB = "SELECT AuthNeeded, ServiceDescription, isnull(LocationDescription,'') as LocationDescription, isnull(LocationCode,'') as LocationCode,"
                         + " isnull(UpdatedBy,'') as UpdatedBy, ServiceGroup, FaxPtDetailID,FaxToServiceTypeID,ScheduledDateTime as ScheduledDate,isnull(Convert(varchar(20),"
                         + " ScheduledDateTime,101),getdate()) as ScheduledDate2, StatusDescription AS StatusDescription, StatusID AS StatusID, "
                         + " convert(varchar(2),DatePart(hh,ScheduledDateTime)) + ':' + right('0' + convert(varchar(2),DatePart(mi,ScheduledDateTime)),2) as ScheduledTime "
                         + " FROM vwFaxQueuedServices Where ExpiredDateTime is null ";



                    if (Id != "None")
                    {
                        DB += " AND FaxPTDetailID = '" + Id + "'";
                    }
                }
                else if (TableToUseSub == "FaxQueuedServices")
                {
                    DB = "SELECT tblFaxServiceToDocument.FaxToServiceTypeID, tblFaxServiceToDocument.FaxID, tblFaxServiceToDocument.DocumentTypeID, "
                         + " tblFaxServiceToDocument.FaxServiceToDocumentID, tblFaxTypes.FaxTypeID, "
                         + " tblFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20),tblFaxServiceToDocument.UpdateDate) As UpdateDate, "
                         + " tblFaxReceivedFaxes.FileLocation + tblFaxReceivedFaxes.FileName As FileName "
                         + " FROM tblFaxServiceToDocument INNER JOIN "
                         + " tblFaxReceivedFaxes ON tblFaxServiceToDocument.FaxID = tblFaxReceivedFaxes.FaxID LEFT OUTER JOIN "
                         + " tblFaxTypes ON tblFaxServiceToDocument.DocumentTypeID = tblFaxTypes.FaxTypeID "
                         + " WHERE FaxToServiceTypeID = " + Id
                         + " UNION SELECT '0' As FaxToServiceTypeID, '' As FaxID, '' As DocumentTypeID, '' As FaxServiceToDocumentID, "
                         + " '' As FaxTypeID, '' As FaxTypeDescription, '' As UpdateDate, '' As FileName "
                         + " ORDER BY FaxServiceToDocumentID ";
                }
                else if (TableToUseSub == "FaxReceivedFaxes")
                {
                    DB = "Select FaxPtDetailID, CallerID, CSID, ID, Pages, RoutingInfo, FaxSize, TransmissionStart, TransmissionEnd, TSID, FileName, FileLocation,"
                         + " ArchiveDate,Services,PtName, ptFirstName, ptLastName, PtDOB, Services, DrID, DrName "
                         + " From vwFaxReceivedFaxesWRefPhys ";
                    if (Id != "None")
                    {
                        DB += " where FaxPtDetailID = '" + Id + "'";
                    }
                }
                else if (TableToUseSub == "FaxToServiceTypeID")
                {
                    DB = "SELECT  FaxPTDetailID, FaxID, ServiceDescription, "
                    + " FileName, FileLocation, ReceivedDate, InsertedBy, InsertedDate, FaxTypeDescription "
                    + " FROM vwFaxQueuedServicesAttachments "
                    + " WHERE FaxPTDetailID = " + Id
                    + " UNION "
                    + " SELECT FaxPTDetailID, tblFaxPtDetail.FaxID, Upper(tblFaxPtDetail.Services) + ' :ORIGINAL'  As ServiceDescription, tblFaxReceivedFaxes.FileName, tblFaxReceivedFaxes.FileLocation,"
                    + " tblFaxReceivedFaxes.TransmissionEnd As ReceivedDate,tblFaxPtDetail.LoadedBy As InsertedBy, IsNull(tblFaxPtDetail.LoadedDate,'') As InsertedDate, 'Ent:Original' As FaxTypeDescription"
                    + " FROM tblFaxPtDetail INNER JOIN tblFaxReceivedFaxes ON tblFaxPtDetail.FaxID = tblFaxReceivedFaxes.FaxID"
                    + " WHERE FaxPTDetailID = " + Id;
                }
            }

            string JSONString = "I did Not get Changed";

            if (DB != "")
            {
                String commandText = DB;
                if (AddtoQuery != "")
                {
                    commandText += " " + AddtoQuery;
                }
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand(commandText, conn);
                    conn.Open();

                    SqlDataReader dr = cmd.ExecuteReader();


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }
           



            return JSONString;
        }
    }
}