using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventManagement.Data
{
    public class DALLocations
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        // Phương thức để thêm địa điểm
        public void AddLocation(Location newLoc)
        {
            data.Locations.InsertOnSubmit(newLoc);
            data.SubmitChanges();
        }

        // Phương thức để xoá địa điểm
        public void RemoveLocation(int locationId)
        {
            Location eventToDelete = data.Locations.SingleOrDefault(e => e.LocationID == locationId);
            if (eventToDelete != null)
            {
                eventToDelete.IsDeleted = true;
                data.SubmitChanges();
            }
        }


        // Phương thức để cập nhật địa điểm
        public void UpdateLocation(Location updatedLocation)
        {
            Location existingLocation = data.Locations.Where(l => l.IsDeleted == false).SingleOrDefault(l => l.LocationID == updatedLocation.LocationID);
            if (existingLocation != null)
            {
                existingLocation.LocationName = updatedLocation.LocationName;
                existingLocation.LocationAddress = updatedLocation.LocationAddress;
                existingLocation.LocationCapacity = updatedLocation.LocationCapacity;

                data.SubmitChanges();
            }
        }

        // Phương thức để lấy tất cả địa điểm
        public List<Location> GetAllLocations()
        {
            return data.Locations.Where(l => l.IsDeleted == false).ToList();
        }
    }
}