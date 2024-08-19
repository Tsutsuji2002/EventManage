using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventManagement.Data
{
    public class AccountWithRolesDto
    {
        public int AccountID { get; set; }
        public string AccountName { get; set; }
        public string Password { get; set; }
        public List<string> Roles { get; set; }
        public int UserID { get; set; }
    }

    public class DALAccounts
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        public void CreateAccount(Account newAccount)
        {
            // Thêm tài khoản mới
            data.Accounts.InsertOnSubmit(newAccount);
            data.SubmitChanges();
        }

        public void UpdateAccount(Account updatedAccount)
        {
            // Cập nhật thông tin tài khoản
            Account existingAccount = data.Accounts.Single(a => a.AccountID == updatedAccount.AccountID);
            existingAccount.AccountName = updatedAccount.AccountName;
            existingAccount.Password = updatedAccount.Password;
            data.SubmitChanges();
        }

        public void DeleteAccount(int accountID)
        {
            // Xóa tài khoản và các người dùng tương ứng
            var accountToDelete = data.Accounts.SingleOrDefault(a => a.AccountID == accountID);
            if (accountToDelete != null)
            {
                // Xóa người dùng liên quan
                var usersToDelete = data.Users.Where(u => u.AccountID == accountID);
                data.Users.DeleteAllOnSubmit(usersToDelete);

                // Xóa tài khoản
                data.Accounts.DeleteOnSubmit(accountToDelete);

                // Lưu các thay đổi vào database
                data.SubmitChanges();
            }
        }


        public void UpdateUser(User updatedUser)
        {
            // Tìm và cập nhật thông tin người dùng
            User existingUser = data.Users.Single(u => u.UserID == updatedUser.UserID);

            if (existingUser != null)
            {
                existingUser.UserName = updatedUser.UserName;
                existingUser.UserEmail = updatedUser.UserEmail;
                existingUser.UserAvatar = updatedUser.UserAvatar;
                existingUser.UserAddress = updatedUser.UserAddress;

                // Lưu các thay đổi vào database
                data.SubmitChanges();
            }
        }

        public List<AccountWithRolesDto> GetAccountList()
        {
            try
            {
                var accountsWithRoles = (from a in data.Accounts
                                         join u in data.Users on a.AccountID equals u.AccountID
                                         select new AccountWithRolesDto
                                         {
                                             AccountID = a.AccountID,
                                             AccountName = a.AccountName,
                                             Password = a.Password,
                                             UserID = u.UserID,
                                             Roles = (from ur in data.UserRoles
                                                      join r in data.Roles on ur.RoleID equals r.RoleID
                                                      where ur.UserID == u.UserID
                                                      select r.RoleName).ToList()
                                         })
                                    .Take(10)
                                    .ToList();

                System.Diagnostics.Debug.WriteLine($"Accounts found: {accountsWithRoles.Count}");
                foreach (var account in accountsWithRoles)
                {
                    System.Diagnostics.Debug.WriteLine($"Account {account.AccountName} has {account.Roles.Count} roles");
                }

                return accountsWithRoles;
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Exception in GetAccountList: {ex}");
                throw new Exception("Đã xảy ra lỗi khi truy xuất danh sách tài khoản", ex);
            }
        }

        public Account GetAccountById(int accountId)
        {
        
            return data.Accounts.SingleOrDefault(a => a.AccountID == accountId);
        }

        public User GetUserByAccountId(int accountId)
        {
            var user = data.Users.FirstOrDefault(u => u.AccountID == accountId);
            return user;
        }
    }
}
