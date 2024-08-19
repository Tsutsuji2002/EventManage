using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EventManagement.Areas.Admin.Attributes
{
    public class AdminAuthorizeAttribute : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            return httpContext.Session["Admin"] != null;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            if (!AuthorizeCore(filterContext.HttpContext))
            {
                filterContext.Result = new HttpStatusCodeResult(System.Net.HttpStatusCode.Forbidden);
            }
        }
    }
}