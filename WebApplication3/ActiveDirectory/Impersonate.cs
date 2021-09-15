using System.Text;
using System.Security.Principal;
using System.Runtime.InteropServices;
using System.ComponentModel;
using System.Configuration;
using System;

namespace WebApplication3.ActiveDirectory
{
    public class Impersonate : System.IDisposable
    {

        IntPtr userHandle;

        WindowsImpersonationContext impersonationContext;

        public static string DefaultDomain
        {
            get
            {
                if (ConfigurationManager.AppSettings["impdomain"] != null)
                    return ConfigurationManager.AppSettings["impdomain"].ToString();

                return "GHVHS";
            }
        }

        public static string DefaultLogin
        {
            get
            {
                if (ConfigurationManager.AppSettings["implogin"] != null)
                    return ConfigurationManager.AppSettings["implogin"].ToString();

                return "ormcsql";
            }
        }

        public static string DefaultPassword
        {
            get
            {
                if (ConfigurationManager.AppSettings["imppassword"] != null)
                    return ConfigurationManager.AppSettings["imppassword"].ToString();

                return "$ql5ervice@ccount";
            }
        }

        public static string DefaultLoginDomainControllerServer
        {
            get
            {
                if (ConfigurationManager.AppSettings["domainserver"] != null)
                    return ConfigurationManager.AppSettings["domainserver"].ToString();

                return "ghdc01.ormc.org";
            }
        }


        public Impersonate()
        {
            //use default impersonation account

            if (DefaultDomain != null && DefaultLogin != null && DefaultPassword != null)
            {
                DoImpersonate(DefaultLogin, DefaultDomain, DefaultPassword);
            }
        }

        public Impersonate(string user, string domain, string password)
        {
            DoImpersonate(user, domain, password);
        }

        private void DoImpersonate(string user, string domain, string password)
        {

            userHandle = IntPtr.Zero;

            bool loggedOn = LogonUser(

                user,

                domain,

                password,

                LogonType.Interactive,

                LogonProvider.Default,

                out userHandle);



            if (!loggedOn)

                throw new Win32Exception(Marshal.GetLastWin32Error());



            // Begin impersonating the user

            impersonationContext = WindowsIdentity.Impersonate(userHandle);

        }



        public void Dispose()
        {

            if (userHandle != IntPtr.Zero)
            {

                CloseHandle(userHandle);

                userHandle = IntPtr.Zero;

                impersonationContext.Undo();

            }

        }



        [DllImport("advapi32.dll", SetLastError = true)]

        static extern bool LogonUser(

            string lpszUsername,

            string lpszDomain,

            string lpszPassword,

            LogonType dwLogonType,

            LogonProvider dwLogonProvider,

            out IntPtr phToken

            );



        [DllImport("kernel32.dll", SetLastError = true)]

        static extern bool CloseHandle(IntPtr hHandle);



        enum LogonType : int
        {

            Interactive = 2,

            Network = 3,

            Batch = 4,

            Service = 5,

            NetworkCleartext = 8,

            NewCredentials = 9,

        }



        enum LogonProvider : int
        {

            Default = 0,

        }

    }
}