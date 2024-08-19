using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace EventManagement.Data
{
    public class EventRegistrationService
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        public bool RegisterUserForEvent(int userId, int eventId)
        {
            try
            {
                var eventInfo = data.EventInfos.FirstOrDefault(e => e.EventID == eventId && !e.IsDeleted);
                if (eventInfo == null)
                {
                    throw new ArgumentException("Event not found.");
                }

                var existingRegistration = data.Registrations
                    .FirstOrDefault(r => r.UserID == userId && r.EventID == eventId);

                if (existingRegistration != null)
                {
                    throw new InvalidOperationException("Bạn đã đăng ký sự kiện này r.");
                }

                // Create a new registration
                var registration = new Registration
                {
                    UserID = userId,
                    EventID = eventId,
                    RegistratedDate = DateTime.Now
                };

                data.Registrations.InsertOnSubmit(registration);

                //eventInfo.EventParticipants += 1;

                data.SubmitChanges();

                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error registering user for event: {ex.Message}");
                return false;
            }
        }
    }
}