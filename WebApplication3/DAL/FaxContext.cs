using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using System.Web.Mvc;
using Newtonsoft.Json;

namespace WebApplication3.DAL
{
    class FaxContext
    {

        static class SqlHelper
        {
            // Set the connection, command, and then execute the command with non query.  
            public static Int32 ExecuteNonQuery(String connectionString, String commandText,
                CommandType commandType, params SqlParameter[] parameters)
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(commandText, conn))
                    {
                        // There're three command types: StoredProcedure, Text, TableDirect. The TableDirect   
                        // type is only for OLE DB.    
                        cmd.CommandType = commandType;
                        cmd.Parameters.AddRange(parameters);

                        conn.Open();
                        return cmd.ExecuteNonQuery();
                    }
                }
            }

            // Set the connection, command, and then execute the command and only return one value.  
            public static Object ExecuteScalar(String connectionString, String commandText,
                CommandType commandType, params SqlParameter[] parameters)
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    using (SqlCommand cmd = new SqlCommand(commandText, conn))
                    {
                        cmd.CommandType = commandType;
                        cmd.Parameters.AddRange(parameters);

                        conn.Open();
                        return cmd.ExecuteScalar();
                    }
                }
            }

            // Set the connection, command, and then execute the command with query and return the reader.  
            public static SqlDataReader ExecuteReader(String connectionString, String commandText,
                CommandType commandType, params SqlParameter[] parameters)
            {
                SqlConnection conn = new SqlConnection(connectionString);

                using (SqlCommand cmd = new SqlCommand(commandText, conn))
                {
                    cmd.CommandType = commandType;
                    cmd.Parameters.AddRange(parameters);

                    conn.Open();
                    // When using CommandBehavior.CloseConnection, the connection will be closed when the   
                    // IDataReader is closed.  
                    SqlDataReader reader = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                    return reader;
                }
            }
        }




        // Display the Departments that start from the specified year.  
        public static String GetInfusionFaxes(String TableToUseMain, String TableToUseSub)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_Fax;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "dbo.tblInfusionFaxReceivedFaxes";

            if (TableToUseSub == "ReceivedFaxes")
            {
                DB = "dbo.tblInfusionFaxReceivedFaxes";
            }
            else if (TableToUseSub == "FaxNotes")
            {
                DB = "dbo.tblInfusionFaxNotes";
            }
            else if (TableToUseSub == "ServiceTypes")
            {
                DB = "dbo.tblInfusionFaxServiceTypes";
            }
            else if (TableToUseSub == "ServiceToDocument")
            {
                DB = "dbo.tblInfusionFaxServiceToDocument";
            }
            else if (TableToUseSub == "StandardNoteList")
            {
                DB = "dbo.tblInfusionFaxServiceTypes";
            }
            else if (TableToUseSub == "FaxStatus")
            {
                DB = "dbo.tblInfusionFaxStatus";
            }
            else if (TableToUseSub == "StandardNoteList")
            {
                DB = "dbo.tblInfusionFaxStandardNoteList";
            }
            else if (TableToUseSub == "PtDetail")
            {
                DB = "dbo.tblInfusionFaxStandardNoteList";
            }



            String commandText = "SELECT * FROM " + DB;

            // Specify the year of StartDate  
            //SqlParameter parameterYear = new SqlParameter("@Year", SqlDbType.Int);
            //parameterYear.Value = year;

            // When the direction of parameter is set as Output, you can get the value after   
            // executing the command.  
            //SqlParameter parameterBudget = new SqlParameter("@BudgetSum", SqlDbType.Money);
            //parameterBudget.Direction = ParameterDirection.Output;


            using (SqlDataReader reader = SqlHelper.ExecuteReader(connectionString, commandText,
                CommandType.Text))
            {
                var dataTable = new DataTable();
                dataTable.Load(reader);
                string JSONString = string.Empty;
                JSONString = JsonConvert.SerializeObject(dataTable);
                return JSONString;
            }

        }

    }



    // If credits of course is lower than the certain value, the method will add the credits.  
    /*static void AddCredits(String connectionString, Int32 creditsLow)
    {
        String commandText = "Update [MySchool].[dbo].[Course] Set Credits=Credits+1 Where Credits<@Credits";

        SqlParameter parameterCredits = new SqlParameter("@Credits", creditsLow);

        Int32 rows = SqlHelper.ExecuteNonQuery(connectionString, commandText, CommandType.Text, parameterCredits);

        Console.WriteLine("{0} row{1} {2} updated.", rows, rows > 1 ? "s" : null, rows > 1 ? "are" : "is");
    }*/
}