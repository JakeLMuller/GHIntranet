using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.SQL
{
    public class FaxSave
    {

        public static string UpdateServices(string status, string route, string username, string id)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            string Table = ""; 

            if (String.IsNullOrEmpty(route) == false)
            {
                if (route == "Infusion")
                {
                    Table = "tblInfusionFaxServiceToDocument";
                }
                else if (route == "Ent")
                {
                    Table = "tblEntFaxServiceToDocument";
                }
                else if (route == "OR")
                {
                    Table = "tblORFaxServiceToDocument";
                }
                else if (route == "Cardiac")
                {
                    Table = "tblCardiacCathFaxServiceToDocument";
                }
                else if (route == "Concierge")
                {
                    Table = "tblFaxServiceToDocument";
                }
            }




            DB = "UPDATE [dbo].[" + Table + "] SET UpdatedBy = '" + username + "',DocumentTypeID = " + status + ", UpdatedDate = CURRENT_TIMESTAMP Where FaxToServiceTypeID =" + id;

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
        public static string DeleteDocType(string route, string id)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            string Table = "";

            if (String.IsNullOrEmpty(route) == false)
            {
                if (route == "Infusion")
                {
                    Table = "tblInfusionFaxServiceToDocument";
                }
                else if (route == "Ent")
                {
                    Table = "tblEntFaxFaxServiceToDocument";
                }
                else if (route == "OR")
                {
                    Table = "tblORFaxFaxServiceToDocument";
                }
                else if (route == "Cardiac")
                {
                    Table = "tblCardiacCathFaxServiceToDocument";
                }
                else if (route == "Concierge")
                {
                    Table = "tblFaxFaxServiceToDocument";
                }
            }




            DB = " Delete from  UPDATE[dbo].[" + Table + "] where FaxServiceToDocumentID =" + id;

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
        public static string DeleteServices(string route, string id)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            string Table = "";

            if (String.IsNullOrEmpty(route) == false)
            {
                if (route == "Infusion")
                {
                    Table = "tblInfusionFaxFaxToServiceType";
                }
                else if (route == "Ent")
                {
                    Table = "tblEntFaxFaxFaxToServiceType";
                }
                else if (route == "OR")
                {
                    Table = "tblORFaxFaxFaxToServiceType";
                }
                else if (route == "Cardiac")
                {
                    Table = "tblCardiacCathFaxFaxToServiceType";
                }
                else if (route == "Concierge")
                {
                    Table = "tblFaxFaxFaxToServiceType";
                }
            }




            DB = " Delete from  UPDATE[dbo].[" + Table + "] where FaxToServiceTypeID =" + id;

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

        public static string UpdatePtService(string Service, string route, string username, string id)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            string Table = "";

            if (String.IsNullOrEmpty(route) == false)
            {
                if (route == "Infusion")
                {
                    Table = "tblInfusionFaxPtDetail";
                }
                else if (route == "Ent")
                {
                    Table = "tblEntFaxPtDetail";
                }
                else if (route == "OR")
                {
                    Table = "tblORFaxPtDetail";
                }
                else if (route == "Cardiac")
                {
                    Table = "tblCardiacCathFaxPtDetail";
                }
                else if (route == "Concierge")
                {
                    Table = "tblFaxPtDetail";
                }
            }




            DB = " UPDATE [dbo].[" + Table + "] SET LoadedBy = '" + username + "',Services = '" + Service + "' Where FaxPTDetailID =" + id;

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
        public static string ToServiceUpdate(string Status, string route, string username, string Location, string ScheduledDateTime, string id)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            string Table = "";

            if (String.IsNullOrEmpty(route) == false)
            {
                if (route == "Infusion")
                {
                    Table = "tblInfusionFaxToServiceType";
                }
                else if (route == "Ent")
                {
                    Table = "tblEnFaxToServiceType";
                }
                else if (route == "OR")
                {
                    Table = "tblORFaxToServiceType";
                }
                else if (route == "Cardiac")
                {
                    Table = "tblCardiacCathFaxToServiceType";
                }
                else if (route == "Concierge")
                {
                    Table = "tblFaxToServiceType";
                }
            }




            DB = " UPDATE [dbo].[" + Table + "] SET UpdatedBy = '" + username + "',UpdatedDate = CURRENT_TIMESTAMP"; 
            if (String.IsNullOrEmpty(Status) == false)
            {
                DB += " ,StatusID = '"+ Status + "'";
            }
            if (String.IsNullOrEmpty(Location) == false)
            {
                DB += " ,LocationCode = '" + Location + "'";
            }
            if (String.IsNullOrEmpty(ScheduledDateTime) == false)
            {
                DB += " ,ScheduledDateTime =  'convert(varchar,"+ ScheduledDateTime + " , 1)'" ;
            }
            DB += " Where FaxToServiceTypeID = " + id;
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
        public static string UpdatePTData(string FN,string LN, string route, string Dr, string DOB,  string Id)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            string Table = "";

            if (String.IsNullOrEmpty(route) == false)
            {
                if (route == "Infusion")
                {
                    Table = "tblInfusionFaxPtDetail";
                }
                else if (route == "Ent")
                {
                    Table = "tblEnFaxPtDetail";
                }
                else if (route == "OR")
                {
                    Table = "tblORFaxPtDetail";
                }
                else if (route == "Cardiac")
                {
                    Table = "tblCardiacCathFaxPtDetail";
                }
                else if (route == "Concierge")
                {
                    Table = "tblFaxPtDetail";
                }
            }




            DB = "UPDATE [dbo].["+Table+"] Set [PtFirstName] = '"+ FN + "',[PtLastName] = '"+ LN + "',[PtDOB] = '"+ DOB + "',[DrID] = '"+Dr+ "',[LoadedDate] = CURRENT_TIMESTAMP"
                + " WHERE FaxPTDetailID="+Id;
            
    
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
       
    
