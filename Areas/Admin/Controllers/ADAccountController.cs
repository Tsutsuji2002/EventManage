using EventManagement.Data;
using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Helpers;
using System.Web.Mvc;
using EventManagement.Areas.Admin.Attributes;
using System.Activities.Statements;


namespace EventManagement.Areas.Admin.Controllers
{
    [AdminAuthorize]
    public class ADAccountController : Controller
    {
        DALAccounts dal = new DALAccounts();
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());
        // GET: Admin/Account
        public ActionResult AccountManage()
        {
            var admin = Session["Admin"] as ADMIN;
            if (admin == null)
            {
                return RedirectToAction("LoginAdmin", "ADLogin");
            }

            return View();
        }

        public JsonResult GetAdminInfo()
        {
            var admin = Session["Admin"] as ADMIN;
            if (admin != null)
            {
                return Json(new
                {
                    name = admin.AdminName,
                    role = "Admin"
                }, JsonRequestBehavior.AllowGet);
            }
            return Json(new { error = "Không tìm được dữ liệu admin" }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetAccountList()
        {
            var admin = Session["Admin"] as ADMIN;
            if (admin == null)
            {
                return Json(new { error = "Không tìm được dữ liệu admin" }, JsonRequestBehavior.AllowGet);
            }

            var accountList = dal.GetAccountList();
            return Json(new { accountList = accountList }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult AsidePartial()
        {
            return PartialView();
        }
        public ActionResult AddAccount()
        {
            return View();
        }
        public ActionResult UpdateAccount(int accountId = 2)
        {
            var account = dal.GetAccountById(accountId);
            if (account == null)
            {
                return HttpNotFound();
            }
            return View(account);
        }

        [HttpGet]
        public ActionResult GetAccountDetails(int id)
        {
            try
            {
                var account = dal.GetAccountById(id);
                if (account == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy tài khoản" }, JsonRequestBehavior.AllowGet);
                }

                return Json(new
                {
                    success = true,
                    account = new { username = account.AccountName, password = account.Password }
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, message = "Có lỗi xảy ra khi lấy thông tin tài khoản" }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public ActionResult UpdateAccountData(int accountId, string username, string password)
        {
            try
            {
                var account = dal.GetAccountById(accountId);
                if (account == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy tài khoản" });
                }

                account.AccountName = username;
                if (!string.IsNullOrEmpty(password))
                {
                    account.Password = password;
                }

                dal.UpdateAccount(account);
                return Json(new { success = true, message = "Cập nhật tài khoản thành công" });
            }
            catch
            {
                return Json(new { success = false, message = "Có lỗi xảy ra khi cập nhật tài khoản" });
            }
        }

        [HttpPost]
        public JsonResult AddAccountData(string username, string password)
        {
            if (string.IsNullOrEmpty(username) || string.IsNullOrEmpty(password))
            {
                return Json(new { success = false, error = "Tên đăng nhập và mật khẩu không được để trống." });
            }
            try
            {
                if (data.Accounts.Any(a => a.AccountName == username && !a.IsDeleted))
                {
                    return Json(new { success = false, error = "Tên đăng nhập đã tồn tại." });
                }

                var newAccount = new Account    
                {
                    AccountName = username,
                    //Password = HashPassword(password),
                    Password = password,
                };

                dal.CreateAccount(newAccount);

                return Json(new { success = true, message = "Tài khoản và người dùng đã được tạo thành công." });
            }
            catch
            {
                return Json(new { success = false, error = "Có lỗi xảy ra khi tạo tài khoản và người dùng." });
            }
        }

        private string HashPassword(string password)
        {
            return BCrypt.Net.BCrypt.HashPassword(password);
        }

        public JsonResult DeleteAccount(int accountID)
        {
            try
            {
                var accountToDelete = data.Accounts.SingleOrDefault(a => a.AccountID == accountID);
                if (accountToDelete != null)
                {
                    dal.DeleteAccount(accountID);

                    return Json(new { success = true, message = "Tài khoản đã được xóa thành công." });
                }
                else
                {
                    return Json(new { success = false, error = "Không tìm thấy tài khoản cần xóa." });
                }
            }
            catch
            {
                return Json(new { success = false, error = "Có lỗi xảy ra khi xóa tài khoản." });
            }
        }
        [HttpGet]
        public ActionResult GetAccountWithUserDetails(int accountId)
        {
            try
            {
                var account = dal.GetAccountById(accountId);
                if (account == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy tài khoản" }, JsonRequestBehavior.AllowGet);
                }

                var user = dal.GetUserByAccountId(accountId);
                if (user == null)
                {
                    return Json(new { success = false, message = "Không tìm thấy thông tin người dùng" }, JsonRequestBehavior.AllowGet);
                }

                return Json(new
                {
                    success = true,
                    account = new
                    {
                        accountId = account.AccountID,
                        username = account.AccountName,
                        password = account.Password
                    },
                    user = new
                    {
                        userId = user.UserID,
                        userName = user.UserName,
                        userEmail = user.UserEmail,
                        userAvatar = user.UserAvatar,
                        userAddress = user.UserAddress,
                        userPhone = user.UserPhone
                    }
                }, JsonRequestBehavior.AllowGet);
            }
            catch
            {
                return Json(new { success = false, message = "Có lỗi xảy ra khi lấy thông tin tài khoản và người dùng" }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetAllRoles()
        {
            try
            {
                var roles = data.Roles
                    .Where(r => !r.IsDeleted)
                    .Select(r => new {
                        RoleID = r.RoleID,
                        RoleName = r.RoleName,
                        RoleDescription = r.RoleDescription
                    })
                    .ToList();

                return Json(new { success = true, roles = roles }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetUserRoles(int? userId)
        {
            try
            {
                var userRoles = data.UserRoles
                    .Where(ur => ur.UserID == (
                        data.Users.Where(u => u.UserID == userId && !u.IsDeleted).Select(u => u.UserID).FirstOrDefault()
                    ))
                    .Join(data.Roles,
                        ur => ur.RoleID,
                        r => r.RoleID,
                        (ur, r) => new {
                            RoleID = r.RoleID,
                            RoleName = r.RoleName,
                            RoleDescription = r.RoleDescription
                        })
                    .ToList();

                return Json(new { success = true, roles = userRoles }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult UpdateUserRoles(int userId)
        {
            try
            {
                var roles = new List<int>();
                foreach (string key in Request.Form.Keys)
                {
                    if (key.StartsWith("roles["))
                    {
                        if (int.TryParse(Request.Form[key], out int roleId))
                        {
                            roles.Add(roleId);
                        }
                    }
                }

                if (roles == null)
                {
                    throw new ArgumentNullException(nameof(roles), "Roles cannot be null");
                }

                Console.WriteLine("Received userId: " + userId);
                Console.WriteLine("Received roles: " + string.Join(", ", roles));

                var userRoles = data.UserRoles.Where(ur => ur.UserID == userId).ToList();
                data.UserRoles.DeleteAllOnSubmit(userRoles);
                data.SubmitChanges();

                foreach (var roleId in roles)
                {
                    data.UserRoles.InsertOnSubmit(new UserRole
                    {
                        UserID = userId,
                        RoleID = roleId
                    });
                }

                data.SubmitChanges();

                return Json(new { success = true, message = "Roles updated successfully." });
            }
            catch (ArgumentNullException ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "An error occurred while updating roles: " + ex.Message });
            }
        }
    }
}