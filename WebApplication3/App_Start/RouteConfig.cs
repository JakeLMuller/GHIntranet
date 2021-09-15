using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace WebApplication3
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

           

          routes.MapRoute(
              name: "Files",
              url: "Files/{route}/{*path}",
              defaults: new
              {
                  controller = "Files",
                  action = "Files",
                  path = UrlParameter.Optional
              }
          );
            
            routes.MapRoute(
              name: "Fax",
              url: "Fax/{route}/{*path}",
              defaults: new
              {
                  controller = "Fax",
                  action = "Fax",
                  path = UrlParameter.Optional
              }
          );
            routes.MapRoute(
               name: "PTFax",
               url: "PTFax/{route}/{*path}",
               defaults: new
               {
                   controller = "PTFax",
                   action = "PTFax",
                   path = UrlParameter.Optional
               }
           );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}
