using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventManagement.Data
{
    public class DataConnection
    {
        public string Con { get; } = "Data Source=LAPTOP-43O2RGQJ\\TRUNGTRUNG;Initial Catalog=EventManagement;Integrated Security=True";
        
        public string GetConnectionString()
        {
            return Con;
        }
    }
}