using EventManagement.Data;
using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;

namespace EventManagement.Attributtes
{
    public class UserRolesAuthorizeAttribute : AuthorizeAttribute
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());
        private readonly string[] allowedRoles;

        public UserRolesAuthorizeAttribute(params string[] roles)
        {
            this.allowedRoles = roles;
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            System.Diagnostics.Debug.WriteLine("CustomAuthorizeAttribute: Starting authorization check");

            var user = httpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                System.Diagnostics.Debug.WriteLine("CustomAuthorizeAttribute: User is not authenticated");
                return false;
            }

            System.Diagnostics.Debug.WriteLine($"CustomAuthorizeAttribute: User is authenticated as {user.Identity.Name}");

            if (allowedRoles.Length == 0)
            {
                System.Diagnostics.Debug.WriteLine("CustomAuthorizeAttribute: No roles specified, allowing access");
                return true;
            }

            var userRoles = GetUserRoles(httpContext);
            System.Diagnostics.Debug.WriteLine($"CustomAuthorizeAttribute: User roles: {string.Join(", ", userRoles)}");
            System.Diagnostics.Debug.WriteLine($"CustomAuthorizeAttribute: Allowed roles: {string.Join(", ", allowedRoles)}");

            var hasAccess = allowedRoles.Any(role => userRoles.Contains(role));
            System.Diagnostics.Debug.WriteLine($"CustomAuthorizeAttribute: Access granted: {hasAccess}");

            return hasAccess;
        }

        private IEnumerable<string> GetUserRoles(HttpContextBase httpContext)
        {
            var userRoles = httpContext.Session["UserRoles"] as List<string>;
            if (userRoles != null && userRoles.Any())
            {
                System.Diagnostics.Debug.WriteLine("CustomAuthorizeAttribute: Roles found in session");
                return userRoles;
            }

            System.Diagnostics.Debug.WriteLine("CustomAuthorizeAttribute: Roles not found in session, checking cookie");

            var authCookie = httpContext.Request.Cookies[FormsAuthentication.FormsCookieName];
            if (authCookie != null)
            {
                var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                if (ticket != null && !string.IsNullOrEmpty(ticket.UserData))
                {
                    var parts = ticket.UserData.Split('|');
                    if (parts.Length > 1)
                    {
                        System.Diagnostics.Debug.WriteLine("CustomAuthorizeAttribute: Roles found in authentication ticket");
                        return parts[1].Split(',');
                    }
                }
            }

            System.Diagnostics.Debug.WriteLine("CustomAuthorizeAttribute: No roles found");
            return Enumerable.Empty<string>();
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            System.Diagnostics.Debug.WriteLine("CustomAuthorizeAttribute: Handling unauthorized request");
            filterContext.Result = new RedirectToRouteResult(
                new RouteValueDictionary
                {
                { "controller", "Account" },
                { "action", "AccessDenied" }
                });
        }
    }
}