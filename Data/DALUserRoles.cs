using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventManagement.Data
{
    public class DALUserRoles
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        // Phương thức để thêm quyền cho user
        public void AddUserRole(UserRole newUserRole)
        {
            data.UserRoles.InsertOnSubmit(newUserRole);
            data.SubmitChanges();
        }

        // Phương thức để cập nhật quyền của user
        public void UpdateUserRole(UserRole updatedUserRole)
        {
            UserRole existingUserRole = data.UserRoles.Single(ur => ur.UserRoleID == updatedUserRole.UserRoleID);

            if (existingUserRole != null)
            {
                existingUserRole.RoleID = updatedUserRole.RoleID;
                existingUserRole.UserID = updatedUserRole.UserID;
                existingUserRole.CreatedDate = updatedUserRole.CreatedDate;

                data.SubmitChanges();
            }
        }

        // Phương thức để xóa quyền của user
        public void DeleteUserRole(int userRoleID)
        {
            UserRole userRoleToDelete = data.UserRoles.SingleOrDefault(ur => ur.UserRoleID == userRoleID);
            if (userRoleToDelete != null)
            {
                data.UserRoles.DeleteOnSubmit(userRoleToDelete);
                data.SubmitChanges();
            }
        }

        // Phương thức để lấy tất cả quyền của user
        public List<UserRole> GetAllUserRoles()
        {
            return data.UserRoles.ToList();
        }

        // Phương thức để lấy quyền của user theo UserID
        public List<UserRole> GetUserRolesByUserID(int userID)
        {
            return data.UserRoles.Where(ur => ur.UserID == userID).ToList();
        }

        // Phương thức để lấy quyền của user theo RoleID
        public List<UserRole> GetUserRolesByRoleID(int roleID)
        {
            return data.UserRoles.Where(ur => ur.RoleID == roleID).ToList();
        }
    }

}