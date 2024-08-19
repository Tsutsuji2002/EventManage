using EventManagement.Data;
using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Security.Principal;
using EventManagement.Attributtes;

namespace EventManagement.Controllers
{
    public class AccountController : Controller
    {
        // GET: Account
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());
        // GET: Account
        public ActionResult AccessDenied()
        {
            return View();
        }
        public ActionResult Login()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(Account account)
        {
            Session["Account"] = null;
            if (string.IsNullOrEmpty(account.AccountName))
            {
                return Json("Bạn chưa nhập tên đăng nhập");
            }
            else if (string.IsNullOrEmpty(account.Password))
            {
                return Json("Phải nhập mật khẩu");
            }
            else
            {
                var acc = (from a in data.Accounts
                           join u in data.Users on a.AccountID equals u.AccountID
                           where a.AccountName == account.AccountName && a.Password == account.Password && !a.IsDeleted
                           select new { a, u.UserID }).SingleOrDefault();

                if (acc != null)
                {
                    var roles = GetUserRoles(acc.UserID);
                    var rolesString = string.Join(",", roles);

                    System.Diagnostics.Debug.WriteLine($"Login: User roles: {rolesString}");

                    // Set session
                    Session["Account"] = acc;
                    Session["UserID"] = acc.UserID;
                    Session["UserRoles"] = roles;

                    // Create authentication ticket
                    var userData = $"{acc.UserID}|{rolesString}";
                    var ticket = new FormsAuthenticationTicket(
                        1,
                        account.AccountName,
                        DateTime.Now,
                        DateTime.Now.AddMinutes(30),
                        false,
                        userData,
                        FormsAuthentication.FormsCookiePath);

                    var encryptedTicket = FormsAuthentication.Encrypt(ticket);
                    var authCookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket);
                    Response.Cookies.Add(authCookie);

                    FormsAuthentication.SetAuthCookie(account.AccountName, false);

                    System.Diagnostics.Debug.WriteLine("Login: Authentication completed successfully");

                    return Json(new { success = true, message = "Chúc mừng đăng nhập thành công" });
                }
                else
                {
                    return Json(new { success = false, message = "Tên đăng nhập hoặc mật khẩu không đúng" });
                }
            }
        }

        private List<string> GetUserRoles(int userId)
        {
            var roles = data.UserRoles
                .Where(ur => ur.UserID == userId)
                .Join(data.Roles, ur => ur.RoleID, r => r.RoleID, (ur, r) => r.RoleName)
                .ToList();

            System.Diagnostics.Debug.WriteLine($"GetUserRoles: Fetched roles for user {userId}: {string.Join(", ", roles)}");
            return roles;
        }

        [HttpPost]
        public ActionResult SignOut()
        {
            try
            {
                FormsAuthentication.SignOut();

                Session.Clear();
                Session.Abandon();

                if (Request.Cookies["accountName"] != null)
                {
                    Response.Cookies["accountName"].Expires = DateTime.Now.AddDays(-1);
                }
                if (Request.Cookies["password"] != null)
                {
                    Response.Cookies["password"].Expires = DateTime.Now.AddDays(-1);
                }

                if (Request.Cookies["ASP.NET_SessionId"] != null)
                {
                    Response.Cookies["ASP.NET_SessionId"].Expires = DateTime.Now.AddDays(-1);
                }

                return Json(new { success = true, message = "Đăng xuất thành công" });
            }
            catch (Exception ex)
            {
                //Logger.LogError(ex, "Error during sign out");

                return Json(new { success = false, message = "Đã xảy ra lỗi khi đăng xuất: " + ex.Message });
            }
        }
        [HttpGet]
        public ActionResult IsLoggedIn()
        {
            bool isAuthenticated = User.Identity.IsAuthenticated;
            bool hasSession = Session["Account"] != null && Session["UserID"] != null;
            bool hasCookie = Request.Cookies[FormsAuthentication.FormsCookieName] != null;

            return Json(new
            {
                isLoggedIn = isAuthenticated && hasSession && hasCookie,
                isAuthenticated = isAuthenticated,
                hasSession = hasSession,
                hasCookie = hasCookie
            }, JsonRequestBehavior.AllowGet);
        }
    }
}