using EventManagement.Areas.Admin.Attributes;
using EventManagement.Data;
using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;

namespace EventManagement.Areas.Admin.Controllers
{
    [AdminAuthorize]
    public class ADLoginController : Controller
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        // GET: Admin/ADLogin
        [AllowAnonymous]
        public ActionResult LoginAdmin()
        {
            return View();
        }

        [HttpPost]
        [AllowAnonymous]
        public ActionResult LoginAdmin(ADMIN admin)
        {
            if (string.IsNullOrEmpty(admin.AdminName))
            {
                return Json(new { success = false, message = "Bạn chưa nhập tên đăng nhập" });
            }
            else if (string.IsNullOrEmpty(admin.AdminPassword))
            {
                return Json(new { success = false, message = "Phải nhập mật khẩu" });
            }
            else
            {
                var adminUser = data.ADMINs
                        .Where(a => a.AdminName == admin.AdminName && a.AdminPassword == admin.AdminPassword && !admin.IsDeleted)
                        .SingleOrDefault();
                if (adminUser != null)
                {
                    FormsAuthentication.SetAuthCookie(admin.AdminName, false);
                    Session["Admin"] = adminUser;
                    Session["AdminID"] = adminUser.AdminID;

                    return Json(new { success = true, message = "Đăng nhập thành công", redirectUrl = Url.Action("AccountManage", "ADAccount", new { area = "Admin" }) });
                }
                else
                {
                    return Json(new { success = false, message = "Tên đăng nhập hoặc mật khẩu không đúng" });
                }
            }
        }
    }
}