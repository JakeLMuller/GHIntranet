using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.SQL
{
    public class Get
    {
        
        public static string GetInfusionFaxes(String TableToUseMain, String TableToUseSub,String Page, String FirstDate, String secondDate, String LN , String FN , String DOB , string Id = "None",string ServiceStatus = "None")
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            if (TableToUseMain == "Infusion")
            {
                if (TableToUseSub == "New")
                {
                    DB = "SELECT * From( Select Row_Number() Over(Order By ArchiveDate desc) As RowNum , * From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxReceivedFaxes]) t2";
                    AddtoQuery = "WHERE CurrentFaxStatus = 'New' ";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                }
                else if (TableToUseSub == "Queued")
                {
                    DB = "Select FaxPtDetailID,FaxToServiceTypeID, AuthNeeded,FaxID, FileLocation + FileName As FileName, StatusDescription, PtName , PtDOB,ServiceDescription, LoadedBy, ArchiveDate," +
                        "isnull(Convert(varchar(20), ScheduledDateTime, 107), '&nbsp;') as ScheduledDateGrid, " +
                        "ScheduledDateTime As ScheduledDateSort,  LocationCode From(Select Row_Number() Over(Order By ArchiveDate asc) As RowNum" +
                         ", *From  vwInfusionFaxQueuedServices) t2 where (CurrentQueueStatus = 'Queued')  AND PtName <> 'Test'  AND PtName <> 'Test Test' AND PtName <> 'Test2 Test2'";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        DB += "AND FaxPTDetailID = '" + Id+"'";
                    }
                    if (String.IsNullOrEmpty(FirstDate) == false || String.IsNullOrEmpty(DOB) == false || String.IsNullOrEmpty(LN) == false || String.IsNullOrEmpty(FN) == false || ServiceStatus != "None")
                    {
                        DB += " And RowNum < 1500";
                        Page = "";
                    }
                }
                if (TableToUseSub == "InfusionFaxTypes")
                {
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxTypes]";

                    if (String.IsNullOrEmpty(Page) == false)
                    {
                        Page = "";
                    }
                }
                else if (TableToUseSub == "PtDetail")
                {

                    DB = "SELECT * From( Select Row_Number() Over(Order By LoadedDate desc) As RowNum , * From[GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxPtDetail]) t2";
                    AddtoQuery = "WHERE PtFirstName <> 'Test' ";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + FN + "', PtFirstName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(LN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + LN + "', PtLastName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(DOB) == false)
                    {
                        AddtoQuery += "AND PtDOB = '" + DOB + "' ";
                    }
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        AddtoQuery += " AND FaxPTDetailID = '" + Id + "'";
                        Page = "";
                    }
                }
            }
            else if (TableToUseMain == "LookUp")
            {
                if (TableToUseSub == "Doctor")
                {
                    DB = " SELECT * From( Select Row_Number() Over(Order By NAME_FULL_FORMATTED asc) As RowNum , *From [GHVHS_Intranet_Fax].[dbo].[tblImportDoctorsForMatch]) t2";
                    if (String.IsNullOrEmpty(FN) == false)
                    {
                        DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblImportDoctorsForMatch]";
                        AddtoQuery += "Where DrID = '" + FN + "' ";
                    }

                }
                if (TableToUseSub == "ORDoctor")
                {
                    DB = " SELECT * From( Select Row_Number() Over(Order By NAME_FULL_FORMATTED asc) As RowNum , *From [GHVHS_Intranet_Fax].[dbo].[tblImportDoctorsForMatch]) t2";
                    if (String.IsNullOrEmpty(FN) == false)
                    {
                        DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblImportDoctorsForMatch]";
                        AddtoQuery += "Where DrID = '" + FN + "' ";
                    }

                }

                else if (TableToUseSub == "InfusionPTDetail")
                {
                    DB = " SELECT * From( Select Row_Number() Over(Order By NAME_FULL_FORMATTED asc) As RowNum , *From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxPtDetail]) t2";
                    if (String.IsNullOrEmpty(FN) == false)
                    {
                        DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxPtDetail]";
                        AddtoQuery += "Where FaxID = '" + FN + "' ";
                    }
                }
                else if (TableToUseSub == "InfusionQueueBrowse")
                {
                    DB = "SELECT tblInfusionFaxServiceToDocument.FaxToServiceTypeID, tblInfusionFaxServiceToDocument.FaxID, tblInfusionFaxServiceToDocument.DocumentTypeID, tblInfusionFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20), tblInfusionFaxServiceToDocument.UpdateDate) As UpdateDate,tblInfusionFaxReceivedFaxes.ArchiveDate, tblInfusionFaxReceivedFaxes.FileLocation + tblInfusionFaxReceivedFaxes.FileName As FileName FROM tblInfusionFaxServiceToDocument INNER JOIN tblInfusionFaxReceivedFaxes ON tblInfusionFaxServiceToDocument.FaxID = tblInfusionFaxReceivedFaxes.FaxID LEFT OUTER JOIN tblInfusionFaxTypes ON tblInfusionFaxServiceToDocument.DocumentTypeID = tblInfusionFaxTypes.FaxTypeID WHERE 1 = 1 ";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND tblInfusionFaxReceivedFaxes.FaxID = " + FN + " ";
                    }
                    if (String.IsNullOrEmpty(DOB) == false)
                    {

                        AddtoQuery = "WHERE CurrentFaxStatus = 'Queued' ";

                    }
                }
                else if (TableToUseSub == "ORQueueBrowse")
                {
                    DB = "SELECT tblORFaxServiceToDocument.FaxToServiceTypeID, tblORFaxServiceToDocument.FaxID, tblORFaxServiceToDocument.DocumentTypeID, "
                        + " tblORFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20),tblORFaxServiceToDocument.UpdateDate) As UpdateDate, "
                        + " tblORFaxReceivedFaxes.ArchiveDate, tblORFaxReceivedFaxes.FileLocation + tblORFaxReceivedFaxes.FileName As FileName "
                        + " FROM tblORFaxServiceToDocument With (NoLock) INNER JOIN "
                        + " tblORFaxReceivedFaxes ON tblORFaxServiceToDocument.FaxID = tblORFaxReceivedFaxes.FaxID LEFT OUTER JOIN "
                        + " tblORFaxTypes ON tblORFaxServiceToDocument.DocumentTypeID = tblORFaxTypes.FaxTypeID "
                        + " WHERE 1 = 1 ";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND tblORFaxReceivedFaxes.FaxID = " + FN + " ";
                    }
                }
                else if (TableToUseSub == "CardiacQueueBrowse")
                {
                    DB = "SELECT tblCardiacCathFaxServiceToDocument.FaxToServiceTypeID, tblCardiacCathFaxServiceToDocument.FaxID, tblCardiacCathFaxServiceToDocument.DocumentTypeID,"
                         + " tblCardiacCathFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20), tblCardiacCathFaxServiceToDocument.UpdateDate) As UpdateDate,"
                          + " tblCardiacCathFaxReceivedFaxes.ArchiveDate, tblCardiacCathFaxReceivedFaxes.FileLocation + tblCardiacCathFaxReceivedFaxes.FileName As FileName"
                         + " FROM tblCardiacCathFaxServiceToDocument  With (NoLock) INNER JOIN"
                         + " tblCardiacCathFaxReceivedFaxes ON tblCardiacCathFaxServiceToDocument.FaxID = tblCardiacCathFaxReceivedFaxes.FaxID LEFT OUTER JOIN"
                         + " tblCardiacCathFaxTypes ON tblCardiacCathFaxServiceToDocument.DocumentTypeID = tblCardiacCathFaxTypes.FaxTypeID"
                         + " WHERE 1 = 1";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND tblCardiacCathFaxReceivedFaxes.FaxID = " + FN + " ";
                    }
                }
                else if (TableToUseSub == "EntQueueBrowse")
                {
                    DB = "SELECT tblEntFaxServiceToDocument.FaxToServiceTypeID, tblEntFaxServiceToDocument.FaxID, tblEntFaxServiceToDocument.DocumentTypeID,"
                        + " tblEntFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20), tblEntFaxServiceToDocument.UpdateDate) As UpdateDate,"
                        + " tblEntFaxReceivedFaxes.ArchiveDate, tblEntFaxReceivedFaxes.FileLocation + tblEntFaxReceivedFaxes.FileName As FileName, tblEntFaxReceivedFaxes.FileName As FileName2"
                        + " FROM tblEntFaxServiceToDocument  With (NoLock) INNER JOIN"
                        + " tblEntFaxReceivedFaxes ON tblEntFaxServiceToDocument.FaxID = tblEntFaxReceivedFaxes.FaxID LEFT OUTER JOIN"
                        + " tblEntFaxTypes ON tblEntFaxServiceToDocument.DocumentTypeID = tblEntFaxTypes.FaxTypeID"
                        + " WHERE 1 = 1";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += " AND tblEntFaxReceivedFaxes.FaxID = " + FN + " ";
                    }
                }
                else if (TableToUseSub == "ConciergeQueueBrowse")
                {
                    DB = "SELECT tblFaxServiceToDocument.FaxToServiceTypeID, tblFaxServiceToDocument.FaxID, tblFaxServiceToDocument.DocumentTypeID,"
                        + " tblFaxTypes.FaxTypeDescription,  'Received Fax: ' + Convert(varchar(20), tblFaxServiceToDocument.UpdateDate) As UpdateDate,"
                        + " tblFaxReceivedFaxes.ArchiveDate, tblFaxReceivedFaxes.FileLocation + tblFaxReceivedFaxes.FileName As FileName"
                        + " FROM tblFaxServiceToDocument  With (NoLock) INNER JOIN"
                        + " tblFaxReceivedFaxes ON tblFaxServiceToDocument.FaxID = tblFaxReceivedFaxes.FaxID LEFT OUTER JOIN"
                        + " tblFaxTypes ON tblFaxServiceToDocument.DocumentTypeID = tblFaxTypes.FaxTypeID"
                        + " WHERE 1 = 1";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += " AND tblFaxReceivedFaxes.FaxID = " + FN + " ";
                    }
                }
                else if (TableToUseSub == "InfusionToServiceType")
                {
                    DB = " SELECT * From( Select Row_Number() Over(Order By ArchiveDate asc) As RowNum , *From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxToServiceType]) t2";
                    if (String.IsNullOrEmpty(FN) == false)
                    {
                        DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxToServiceType]";
                        AddtoQuery += "Where FaxPTDetailID = '" + FN + "' ";
                    }

                }
                else if (TableToUseSub == "InfusionFaxStatus")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxStatus]";
                }
                else if (TableToUseSub == "CardiacFaxStatus")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblCardiacCathFaxStatus]";
                }
                else if (TableToUseSub == "ConciergeFaxStatus")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblFaxStatus]";
                }
                else if (TableToUseSub == "ORFaxStatus")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblORFaxStatus]";
                }
                else if (TableToUseSub == "EntFaxStatus")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblEntFaxLocations]";
                }
                else if (TableToUseSub == "InfusionFaxLocations")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxLocations]";
                }
                else if (TableToUseSub == "CardiacFaxLocations")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblCardiacCathFaxLocations]";
                }
                else if (TableToUseSub == "ConciergeFaxLocations")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblFaxLocations]";
                }
                else if (TableToUseSub == "ORFaxLocations")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblORFaxLocations]";
                }
                else if (TableToUseSub == "EntFaxLocations")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblEntFaxLocations]";
                }
                else if (TableToUseSub == "InfusionFaxTypes")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxTypes]";
                }
                else if (TableToUseSub == "CardiacFaxTypes")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblCardiacCathFaxTypes]";
                }
                else if (TableToUseSub == "ConciergeFaxTypes")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblFaxTypes]";
                }
                else if (TableToUseSub == "ORFaxTypes")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblORFaxTypes]";
                }
                else if (TableToUseSub == "EntFaxTypes")
                {
                    DB = " SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblEntFaxTypes]";
                }
            }
            else if (TableToUseMain == "InfusionNewFax")
            {
                if (TableToUseSub != "")
                {
                    String ifStringWithSingleQuotes = TableToUseSub;
                    String withDoubleQuotes = ifStringWithSingleQuotes.Replace("'", "");
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblInfusionFaxReceivedFaxes]";
                    AddtoQuery = "WHERE FaxID = '" + TableToUseSub + "' ";
                }
            }
            else if (TableToUseMain == "ORNewFax")
            {
                if (TableToUseSub != "")
                {
                    String ifStringWithSingleQuotes = TableToUseSub;
                    String withDoubleQuotes = ifStringWithSingleQuotes.Replace("'", "");
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblORFaxReceivedFaxes]";
                    AddtoQuery = "WHERE FaxID = '" + TableToUseSub + "' ";
                }
            }
            else if (TableToUseMain == "CardiacNewFax")
            {
                if (TableToUseSub != "")
                {
                    String ifStringWithSingleQuotes = TableToUseSub;
                    String withDoubleQuotes = ifStringWithSingleQuotes.Replace("'", "");
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblCardiacCathFaxReceivedFaxes]";
                    AddtoQuery = "WHERE FaxID = '" + TableToUseSub + "' ";
                }
            }
            else if (TableToUseMain == "ConciergeNewFax")
            {
                if (TableToUseSub != "")
                {
                    String ifStringWithSingleQuotes = TableToUseSub;
                    String withDoubleQuotes = ifStringWithSingleQuotes.Replace("'", "");
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblFaxReceivedFaxes]";
                    AddtoQuery = "WHERE FaxID = '" + TableToUseSub + "' ";
                }
            }
            else if (TableToUseMain == "EntNewFax")
            {
                if (TableToUseSub != "")
                {
                    String ifStringWithSingleQuotes = TableToUseSub;
                    String withDoubleQuotes = ifStringWithSingleQuotes.Replace("'", "");
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblEntFaxReceivedFaxes]";
                    AddtoQuery = "WHERE FaxID = '" + TableToUseSub + "' ";
                }
            }
            else if (TableToUseMain == "OR")
            {
                if (TableToUseSub == "UnScheduledFaxes")
                {
                    TableToUseSub = "Queued";
                    AddtoQuery = " and (StatusID In (10000,10001,10004)) ";
                }
                else if (TableToUseSub == "ScheduledFaxes")
                {
                    TableToUseSub = "Queued";
                    AddtoQuery = "and (StatusID In (10003))  ";
                }
                else if (TableToUseSub == "AllFaxes")
                {
                    TableToUseSub = "Queued";

                }

                if (TableToUseSub == "New")
                {
                    DB = "SELECT * From( Select Row_Number() Over(Order By ArchiveDate desc) As RowNum , * From [GHVHS_Intranet_Fax].[dbo].[tblORFaxReceivedFaxes]) t2";
                    AddtoQuery = "WHERE CurrentFaxStatus = 'New' ";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                }
                if (TableToUseSub == "ORFaxTypes")
                {
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblORFaxTypes]";

                    if (String.IsNullOrEmpty(Page) == false)
                    {
                        Page = "";
                    }
                }
                else if (TableToUseSub == "Queued")
                {
                    DB = "Select FaxPtDetailID, FaxToServiceTypeID, FileName, FileLocation,StatusDescription,"
                    + "isnull(Convert(varchar(20), ScheduledDateTime, 107), '&nbsp;') As ScheduledDateTime,FaxID,"
                    + "PtLastName +', ' + PtFirstName As PtName, ScheduledDateTime As ScheduledDateSort, PSTDate, isnull(Convert(varchar(20), SurgeryDate, 107), '&nbsp;') as SurgeryDate, isnull(Convert(varchar(20), PSTDate, 107), '&nbsp;') as PSTDateGrid, SurgeryDate As SurgeryDateSort, PtDOB,ServiceDescription, LoadedBy, ArchiveDate, DrID, res_name As Surgeon,"
                    + "isnull(BoneAndJoint, 'N') As BoneAndJoint, isnull(Hospitalist,'N') As Hospitalist, Page, LocationCode "
                    + "From(Select Row_Number() Over(Order By ArchiveDate desc) As RowNum, *From  vwORFaxQueuedServices) t2 where(CurrentQueueStatus = 'Queued') ";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        DB += "AND FaxPTDetailID = '" + Id + "'";
                    }
                    if (String.IsNullOrEmpty(FirstDate) == false || String.IsNullOrEmpty(DOB) == false || String.IsNullOrEmpty(LN) == false || String.IsNullOrEmpty(FN) == false || ServiceStatus != "None")
                    {
                        DB += " And RowNum < 1500";
                        Page = "";
                    }
                }

                else if (TableToUseSub == "PtDetail")
                {

                    DB = "SELECT * From( Select Row_Number() Over(Order By LoadedDate desc) As RowNum , * From[GHVHS_Intranet_Fax].[dbo].[tblORFaxPtDetail]) t2";
                    AddtoQuery = "WHERE PtFirstName <> 'Test' ";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + FN + "', PtFirstName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(LN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + LN + "', PtLastName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(DOB) == false)
                    {
                        AddtoQuery += "AND PtDOB = '" + DOB + "' ";
                    }
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        AddtoQuery += "AND FaxPTDetailID = '" + Id + "'";
                        Page = "";
                    }
                }
            }
          
            else if (TableToUseMain == "Cardiac")
            {


                if (TableToUseSub == "New")
                {
                    DB = "SELECT * From( Select Row_Number() Over(Order By ArchiveDate desc) As RowNum , * From [GHVHS_Intranet_Fax].[dbo].[tblCardiacCathFaxReceivedFaxes]) t2";
                    AddtoQuery = "WHERE CurrentFaxStatus = 'New' ";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                }
                if (TableToUseSub == "CardiacFaxTypes")
                {
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblCardiacCathFaxTypes]";

                    if (String.IsNullOrEmpty(Page) == false)
                    {
                        Page = "";
                    }
                }
                else if (TableToUseSub == "Queued")
                {
                    DB = "Select FaxPtDetailID, FaxToServiceTypeID, FileName, FileLocation,StatusDescription,"
                     + " isnull(Convert(varchar(20), ScheduledDateTime, 107), '&nbsp;') As ScheduledDateTime, FaxID,"
                    + " PtLastName +', ' + PtFirstName As PtName, ScheduledDateTime As ScheduledDateSort, PtDOB, ServiceDescription, LoadedBy, ArchiveDate, LocationCode"
                    + " From(Select Row_Number() Over(Order By ArchiveDate desc) As RowNum, *From  vwCardiacCathFaxQueuedServices) t2 where(CurrentQueueStatus = 'Queued') ";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        DB += "AND FaxPTDetailID = '" + Id + "'";
                    }
                    if (String.IsNullOrEmpty(FirstDate) == false || String.IsNullOrEmpty(DOB) == false || String.IsNullOrEmpty(LN) == false || String.IsNullOrEmpty(FN) == false || ServiceStatus != "None")
                    {
                        DB += " And RowNum < 1500";
                        Page = "";
                    }
                }

                else if (TableToUseSub == "PtDetail")
                {

                    DB = "SELECT * From( Select Row_Number() Over(Order By LoadedDate desc) As RowNum , * From[GHVHS_Intranet_Fax].[dbo].[tblCardiacCathFaxPtDetail]) t2";
                    AddtoQuery = "WHERE PtFirstName <> 'Test' ";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + FN + "', PtFirstName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(LN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + LN + "', PtLastName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(DOB) == false)
                    {
                        AddtoQuery += "AND PtDOB = '" + DOB + "' ";
                    }
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        AddtoQuery += "AND FaxPTDetailID = '" + Id + "'";
                        Page = "";
                    }
                }
            }
            else if (TableToUseMain == "Ent")
            {
                if (TableToUseSub == "UnScheduledFaxes")
                {
                    TableToUseSub = "Queued";
                    AddtoQuery = " and (StatusID In (10000,10001,10004)) ";
                }
                else if (TableToUseSub == "ScheduledFaxes")
                {
                    TableToUseSub = "Queued";
                    AddtoQuery = "and (StatusID In (10003))  ";
                }
                else if (TableToUseSub == "AllFaxes")
                {
                    TableToUseSub = "Queued";

                }

                if (TableToUseSub == "New")
                {
                    DB = "SELECT * From( Select Row_Number() Over(Order By ArchiveDate desc) As RowNum , * From [GHVHS_Intranet_Fax].[dbo].[tblEntFaxReceivedFaxes]) t2";
                    AddtoQuery = "WHERE CurrentFaxStatus = 'New' ";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                }
                if (TableToUseSub == "EntFaxTypes")
                {
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblEntFaxTypes]";

                    if (String.IsNullOrEmpty(Page) == false)
                    {
                        Page = "";
                    }
                }
                else if (TableToUseSub == "Queued")
                {
                    DB = "Select FaxPtDetailID,FaxToServiceTypeID, AuthNeeded, FileLocation + FileName As FileName,FaxID, StatusDescription, PtName , PtDOB,ServiceDescription, LoadedBy, ArchiveDate,"
                        + " isnull(Convert(varchar(20), ScheduledDateTime, 107), '&nbsp;') as ScheduledDateGrid,"
                        + " ScheduledDateTime As ScheduledDateSort, LocationCode, FileName As FileName2"
                        + " From(Select Row_Number() Over(Order By ArchiveDate desc) As RowNum, *From vwEntFaxQueuedServices) t2 where (CurrentQueueStatus = 'Queued')";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        DB += "AND FaxPTDetailID = '" + Id + "'";
                    }
                    if (String.IsNullOrEmpty(FirstDate) == false || String.IsNullOrEmpty(DOB) == false || String.IsNullOrEmpty(LN) == false || String.IsNullOrEmpty(FN) == false || ServiceStatus != "None")
                    {
                        DB += " And RowNum < 1500";
                        Page = "";
                    }
                }

                else if (TableToUseSub == "PtDetail")
                {

                    DB = "SELECT * From( Select Row_Number() Over(Order By LoadedDate desc) As RowNum , * From[GHVHS_Intranet_Fax].[dbo].[tblEntFaxPtDetail]) t2";
                    AddtoQuery = " WHERE PtFirstName <> 'Test' ";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + FN + "', PtFirstName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(LN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + LN + "', PtLastName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(DOB) == false)
                    {
                        AddtoQuery += "AND PtDOB = '" + DOB + "' ";
                    }
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        AddtoQuery += "AND FaxPTDetailID = '" + Id + "'";
                        Page = "";
                    }
                }
            }
            else if (TableToUseMain == "Concierge")
            {


                if (TableToUseSub == "New")
                {
                    DB = "SELECT * From( Select Row_Number() Over(Order By ArchiveDate desc) As RowNum , * From [GHVHS_Intranet_Fax].[dbo].[tblFaxReceivedFaxes]) t2";
                    AddtoQuery = " WHERE CurrentFaxStatus = 'New' ";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                }
                else if (TableToUseSub == "ConciergeFaxTypes")
                {
                    DB = "SELECT * From [GHVHS_Intranet_Fax].[dbo].[tblFaxTypes]";

                    if (String.IsNullOrEmpty(Page) == false)
                    {
                        Page = "";
                    }
                }
                else if (TableToUseSub == "Queued")
                {
                    DB = "Select FaxPtDetailID,FaxToServiceTypeID, AuthNeeded, FileLocation + FileName As FileName,FaxID, StatusDescription, PtName , PtDOB,ServiceDescription, LoadedBy, ArchiveDate,"
                        + " isnull(Convert(varchar(20), ScheduledDateTime, 107), '&nbsp;') as ScheduledDateGrid,"
                        + " ScheduledDateTime As ScheduledDateSort, LocationCode, FileName As FileName2"
                        + " From(Select Row_Number() Over(Order By ArchiveDate desc) As RowNum, *From vwFaxQueuedServices) t2 where (CurrentQueueStatus = 'Queued')";
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        DB += "AND FaxPTDetailID = '" + Id + "'";
                    }
                    if (String.IsNullOrEmpty(FirstDate) == false || String.IsNullOrEmpty(DOB) == false || String.IsNullOrEmpty(LN) == false || String.IsNullOrEmpty(FN) == false || ServiceStatus != "None")
                    {
                        DB += " And RowNum < 1500";
                        Page = "";
                    }
                }

                else if (TableToUseSub == "PtDetail")
                {

                    DB = "SELECT * From( Select Row_Number() Over(Order By LoadedDate desc) As RowNum , * From[GHVHS_Intranet_Fax].[dbo].[tblFaxPtDetail]) t2";
                    AddtoQuery = "WHERE PtFirstName <> 'Test' ";
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + FN + "', PtFirstName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(LN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + LN + "', PtLastName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(DOB) == false)
                    {
                        AddtoQuery += "AND PtDOB = '" + DOB + "' ";
                    }
                    if (String.IsNullOrEmpty(Page) == true)
                    {
                        Page = "1";
                    }
                    if (Id != "None")
                    {
                        AddtoQuery += "AND FaxPTDetailID = '" + Id + "'";
                        Page = "";
                    }
                }
            }
          if ( String.IsNullOrEmpty(Page) == false)
            {
                if (Page == "1")
                {
                    AddtoQuery += "AND RowNum <= 100";
                }
                else 
                {
                    int numVal = Int32.Parse(Page);
                    String TopRows = (numVal * 100).ToString() ;
                    String belowRows = ((numVal * 100) - 100).ToString();
                    AddtoQuery += "AND RowNum >  "+ belowRows + " AND RowNum < "+ TopRows;
                }
                
                
            }
           
            if (String.IsNullOrEmpty(FirstDate) == false)
            {
                AddtoQuery += " AND  (ArchiveDate >= CONVERT(DATETIME,   '"+ FirstDate + "' ))";
            }
            if (String.IsNullOrEmpty(secondDate) == false)
            {
                AddtoQuery += " AND  (ArchiveDate <= CONVERT(DATETIME,   '" + secondDate + "' ))";
            }
            if (TableToUseSub == "Queued")
            {
                if (String.IsNullOrEmpty(ServiceStatus) == false)
                {
                    if (ServiceStatus != "None")
                    {
                        AddtoQuery += "AND StatusID ='" + ServiceStatus + "'";
                    }
                    if (String.IsNullOrEmpty(FN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + FN + "', PtFirstName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(LN) == false)
                    {

                        AddtoQuery += "AND  CHARINDEX('" + LN + "', PtLastName) > 0 ";
                    }
                    if (String.IsNullOrEmpty(DOB) == false)
                    {
                        AddtoQuery += "AND PtDOB = '" + DOB + "' ";
                    }

                }
            }

            string JSONString = "I did Not get Changed";

            if (DB != "")
            {
                String commandText =  DB;
                if (AddtoQuery != "")
                {
                    commandText += " " + AddtoQuery ;
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
            // Specify the year of StartDate  
            //SqlParameter parameterYear = new SqlParameter("@Year", SqlDbType.Int);
            //parameterYear.Value = year;

            // When the direction of parameter is set as Output, you can get the value after   
            // executing the command.  
            //SqlParameter parameterBudget = new SqlParameter("@BudgetSum", SqlDbType.Money);
            //parameterBudget.Direction = ParameterDirection.Output;

           
          
            return JSONString;
        }
       
    }
}