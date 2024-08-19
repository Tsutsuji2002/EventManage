using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventManagement.Data
{
    public class UserInfo
    {
        public int UserID { get; set; }
        public int AccountID { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string UserAvatar { get; set; }
        public string UserPhone { get; set; } = string.Empty;
        public string UserAddress { get; set; } = string.Empty;
    }
    public class AccountUser
    {
        public int AccountID { get; set; }
        public string AccountName { get; set; }
        public string Password { get; set; }
    }
}