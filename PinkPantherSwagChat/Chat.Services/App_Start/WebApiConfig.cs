using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace Chat.Services
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            config.Routes.MapHttpRoute(
                   name: "UserApi",
                   routeTemplate: "api/users/{action}/",
                   defaults: new { controller = "users" }
               );

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
