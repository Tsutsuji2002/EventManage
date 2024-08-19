using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace EventManagement.Attributtes
{
    public class UserAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext.Request.IsAuthenticated)
            {
                var authCookie = httpContext.Request.Cookies[FormsAuthentication.FormsCookieName];
                if (authCookie != null)
                {
                    var ticket = FormsAuthentication.Decrypt(authCookie.Value);
                    if (ticket != null && !ticket.Expired)
                    {
                        httpContext.User = new GenericPrincipal(new GenericIdentity(ticket.Name, "Forms"), new string[0]);
                        return true;
                    }
                }
            }
            return false;
        }
    }
}