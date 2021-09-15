using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.Fax
{
    public class GetFaxes
    {
        public static string getFileName(string tableType, string id)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["FaxOld"].ConnectionString;
            string DB = "";
            string commandText = "";
            string returnValue = "";
            if (tableType == "Infusion")
            {
                DB = "Select * From [ORMCIntranet].[dbo].[tblInfusionFaxReceivedFaxes]";

            }
            else if (tableType == "OR")
            {
                DB = "Select * From [ORMCIntranet].[dbo].[tblORFaxReceivedFaxes]";
                
            }
            else if (tableType == "Cardiac")
            {
                DB = "Select * From [ORMCIntranet].[dbo].[tblCardiacCathFaxReceivedFaxes]";

            }
            else if (tableType == "Ent")
            {
                DB = "Select * From [ORMCIntranet].[dbo].[tblEntFaxReceivedFaxes]";

            }
            else if (tableType == "Concierge")
            {
                DB = "Select * From [ORMCIntranet].[dbo].[tblFaxReceivedFaxes]";

            }

            commandText = DB + " Where FaxID = "+id;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(commandText, conn);
                conn.Open();

                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {

                    int counted = dr.FieldCount;
                    while (dr.Read())
                    {

                        returnValue = dr["FileName"].ToString();

                    }
                }
                dr.Close();
                conn.Close();
            }
            return returnValue;
        }




    }
}