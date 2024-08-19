using EventManage.Data;
using EventManagement.Models;
using Microsoft.ClearScript;
using System;
using System.Activities.Statements;
using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using System.Web;

namespace EventManagement.Data
{
    public class DALEvents
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        public void CreateEvent(EventInfo newEvent)
        {
            data.EventInfos.InsertOnSubmit(newEvent);
            data.SubmitChanges();
        }

        // Phương thức cập nhật Event
        public void UpdateEvent(EventInfo updatedEvent)
        {
            EventInfo existingEvent = data.EventInfos.Where(e => e.IsDeleted == false).Single(e => e.EventID == updatedEvent.EventID);

            if (existingEvent != null)
            {
                existingEvent.EventName = updatedEvent.EventName;
                existingEvent.EventCode = updatedEvent.EventCode;
                existingEvent.EventType = updatedEvent.EventType;
                existingEvent.EventDate = updatedEvent.EventDate;
                existingEvent.EventRule = updatedEvent.EventRule;
                existingEvent.EventParticipants = updatedEvent.EventParticipants;
                existingEvent.EventDescription = updatedEvent.EventDescription;
                existingEvent.EventImage = updatedEvent.EventImage;
                existingEvent.LocationID = updatedEvent.LocationID;
                existingEvent.CreatedDate = updatedEvent.CreatedDate;

                data.SubmitChanges();
            }
        }

        // Phương thức xóa Event
        public void DeleteEvent(int eventID)
        {
            try
            {
                var registrationsToDelete = data.Registrations.Where(r => r.EventID == eventID);
                data.Registrations.DeleteAllOnSubmit(registrationsToDelete);

                var speakerAssignsToDelete = data.SpeakersAssigns.Where(sa => sa.EventID == eventID);
                data.SpeakersAssigns.DeleteAllOnSubmit(speakerAssignsToDelete);

                var DocToDelete = data.EventDocuments.Where(dc => dc.DocumentEvent == eventID);
                data.EventDocuments.DeleteAllOnSubmit(DocToDelete);

                var compeToDelete = data.CompetitionFeatures.Where(sa => sa.CompetitionID == eventID);
                data.CompetitionFeatures.DeleteAllOnSubmit(compeToDelete);
                var compeToDeletex = data.CompetitionNewests.Where(sa => sa.CompetitionID == eventID);
                data.CompetitionNewests.DeleteAllOnSubmit(compeToDeletex);
                var comfeToDelete = data.ConferenceFeatures.Where(sa => sa.ConferenceID == eventID);
                data.ConferenceFeatures.DeleteAllOnSubmit(comfeToDelete);
                var comfeToDeletex = data.ConferenceNewests.Where(sa => sa.ConferenceID == eventID);
                data.ConferenceNewests.DeleteAllOnSubmit(comfeToDeletex);
                var semiToDelete = data.SeminarFeatures.Where(sa => sa.SeminarID == eventID);
                data.SeminarFeatures.DeleteAllOnSubmit(semiToDelete);
                var semiToDeletex = data.SeminarNewests.Where(sa => sa.SeminarID == eventID);
                data.SeminarNewests.DeleteAllOnSubmit(semiToDeletex);

                EventInfo eventToDelete = data.EventInfos.SingleOrDefault(e => e.EventID == eventID);
                if (eventToDelete != null)
                {
                    eventToDelete.IsDeleted = true;
                }

                data.SubmitChanges(ConflictMode.ContinueOnConflict);

            }
            catch (Exception)
            {
                throw;
            }
        }

        // Phương thức lấy tất cả Event
        public List<EventDetailsInfo> GetAllEvents()
        {
            var query = from eventInfo in data.EventInfos
                        join eventType in data.EventTypes on eventInfo.EventType equals eventType.EventTypeID
                        join user in data.Users on eventInfo.EventCreator equals user.UserID
                        join location in data.Locations on eventInfo.LocationID equals location.LocationID
                        where eventInfo.IsDeleted == false
                        select new EventDetailsInfo
                        {
                            EventId = eventInfo.EventID,
                            EventName = eventInfo.EventName,
                            EventCode = eventInfo.EventCode,
                            EventType = eventType.EventTypeName,
                            EventDate = eventInfo.EventDate,
                            EventDescription = eventInfo.EventDescription,
                            EventImage = eventInfo.EventImage,
                            EventCreator = user.UserName,
                            EventParticipants = eventInfo.EventParticipants,
                            EventLocation = location.LocationName,
                            CreatedDate = (DateTime)eventInfo.CreatedDate
                        };

            return query.ToList();
        }

        // Phương thức tạo mới EventType
        public void CreateEventType(EventType newEventType)
        {
            data.EventTypes.InsertOnSubmit(newEventType);
            data.SubmitChanges();
        }
        
        // Phương thức cập nhật EventType
        public void UpdateEventType(EventType updatedEventType)
        {
            EventType existingEventType = data.EventTypes.Where(e => e.IsDeleted == false).Single(et => et.EventTypeID == updatedEventType.EventTypeID);

            if (existingEventType != null)
            {
                existingEventType.EventTypeName = updatedEventType.EventTypeName;
                data.SubmitChanges();
            }
        }

        // Phương thức xóa EventType
        public void DeleteEventType(int eventTypeID)
        {
            EventType eventTypeToDelete = data.EventTypes.Where(e => e.IsDeleted == false).SingleOrDefault(et => et.EventTypeID == eventTypeID);
            if (eventTypeToDelete != null)
            {
                eventTypeToDelete.IsDeleted = true;
                data.SubmitChanges();
            }
        }

        // Phương thức lấy tất cả EventType
        public List<EventTypeList> GetAllEventTypes()
        {
            try
            {
                var eventtypes = data.EventTypes
                    .Where(e => e.IsDeleted == false)
                    .Select(s => new EventTypeList
                    {
                        EventTypeID = s.EventTypeID,
                        EventTypeName = s.EventTypeName
                    })
                .ToList();
                return eventtypes;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra khi tải danh sách diên giả", ex);
            }
        }

        // Phương thức lấy Event theo EventTypeID
        public List<EventDetailsInfo> GetEventsByType(int eventTypeID)
        {
            var query = from eventInfo in data.EventInfos
                        join eventType in data.EventTypes on eventInfo.EventType equals eventType.EventTypeID
                        join user in data.Users on eventInfo.EventCreator equals user.UserID
                        join location in data.Locations on eventInfo.LocationID equals location.LocationID
                        where eventInfo.EventType == eventTypeID && !eventInfo.IsDeleted
                        select new EventDetailsInfo
                        {
                            EventId = eventInfo.EventID,
                            EventName = eventInfo.EventName,
                            EventCode = eventInfo.EventCode,
                            EventType = eventType.EventTypeName,
                            EventDate = eventInfo.EventDate,
                            EventDescription = eventInfo.EventDescription,
                            EventImage = eventInfo.EventImage,
                            EventCreator = user.UserName,
                            EventParticipants = eventInfo.EventParticipants,
                            EventLocation = location.LocationName,
                            CreatedDate = (DateTime)eventInfo.CreatedDate,
                            //DocumentID = (int)eventInfo.DocumentID
                        };
                        
            return query.ToList();
        }
        public List<EventDetailsInfo> GetUserEventsByType(int eventTypeID, int userID)
        {
            var query = from eventInfo in data.EventInfos
                        join eventType in data.EventTypes on eventInfo.EventType equals eventType.EventTypeID
                        join user in data.Users on eventInfo.EventCreator equals user.UserID
                        join location in data.Locations on eventInfo.LocationID equals location.LocationID
                        where eventInfo.EventType == eventTypeID && user.UserID == userID && !eventInfo.IsDeleted
                        select new EventDetailsInfo
                        {
                            EventId = eventInfo.EventID,
                            EventName = eventInfo.EventName,
                            EventCode = eventInfo.EventCode,
                            EventType = eventType.EventTypeName,
                            EventDate = eventInfo.EventDate,
                            EventDescription = eventInfo.EventDescription,
                            EventImage = eventInfo.EventImage,
                            EventCreator = user.UserName,
                            EventParticipants = eventInfo.EventParticipants,
                            EventLocation = location.LocationName,
                            CreatedDate = (DateTime)eventInfo.CreatedDate
                        };

            return query.ToList();
        }
        public List<EventDetailsInfo> GetUserEvents(int userID)
        {
            var query = from eventInfo in data.EventInfos
                        join eventType in data.EventTypes on eventInfo.EventType equals eventType.EventTypeID
                        join user in data.Users on eventInfo.EventCreator equals user.UserID
                        join location in data.Locations on eventInfo.LocationID equals location.LocationID
                        where user.UserID == userID && !eventInfo.IsDeleted
                        select new EventDetailsInfo
                        {
                            EventId = eventInfo.EventID,
                            EventName = eventInfo.EventName,
                            EventCode = eventInfo.EventCode,
                            EventType = eventType.EventTypeName,
                            EventDate = eventInfo.EventDate,
                            EventDescription = eventInfo.EventDescription,
                            EventImage = eventInfo.EventImage,
                            EventCreator = user.UserName,
                            EventParticipants = eventInfo.EventParticipants,
                            EventLocation = location.LocationName,
                            CreatedDate = (DateTime)eventInfo.CreatedDate
                        };

            return query.ToList();
        }
        // Phương thức lấy event theo ID
        public EventDetailsInfo GetEventById(int id)
        {
            try
            {
                var eventList = data.EventInfos
                    .Where(n => n.EventID == id && !n.IsDeleted)
                    .Join(data.Users,
                        events => events.EventCreator,
                        user => user.UserID,
                        (events, user) => new { events, user })
                    .Join(data.EventTypes,
                        combined => combined.events.EventType,
                        eventType => eventType.EventTypeID,
                        (combined, eventType) => new { combined.events, combined.user, eventType })
                    .Join(data.Locations,
                        combined => combined.events.LocationID,
                        location => location.LocationID,
                        (combined, location) => new EventDetailsInfo
                        {
                            EventId = combined.events.EventID,
                            EventName = combined.events.EventName,
                            EventCode = combined.events.EventCode,
                            EventType = combined.eventType.EventTypeName,
                            EventDate = combined.events.EventDate,
                            EventRule = combined.events.EventRule,
                            EventDescription = combined.events.EventDescription,
                            EventCreator = combined.user.UserName,
                            EventParticipants = combined.events.EventParticipants,
                            EventLocation = location.LocationName,
                            CreatedDate = combined.events.CreatedDate,
                        })
                    .FirstOrDefault();
                return eventList;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi khi lấy thông tin bài viết", ex);
            }
        }
        public List<SpeakerEvent> GetSpeakersByEventId(int eventId)
        {
            try
            {
                return data.SpeakersAssigns
                    .Where(sa => sa.EventID == eventId)
                    .Join(data.Speakers
                    .Where(s => s.IsDeleted == false),
                        sa => sa.SpeakerID,
                        s => s.SpeakerID,
                        (sa, s) => new SpeakerEvent
                        {
                            SpeakerID = s.SpeakerID,
                            SpeakerName = s.SpeakerName
                        })
                    .ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Đã xảy ra lỗi khi tải danh sách diễn giả!", ex);
            }
        }
        public List<EventDocument> GetEventDocuments(int eventId)
        {
            return data.EventDocuments
                .Where(doc => doc.DocumentEvent == eventId && !doc.IsDeleted)
                .ToList();
        }
        public int AddEvent(EventInformation eventInformation)
        {
            try
            {
                var eventInfo = new EventInfo
                {
                    EventName = eventInformation.EventName,
                    EventCode = eventInformation.EventCode,
                    EventType = eventInformation.EventType,
                    EventDate = eventInformation.EventDate,
                    EventRule = eventInformation.EventRule ?? "Default Rule",
                    EventParticipants = eventInformation.EventParticipants,
                    EventDescription = eventInformation.EventDescription ?? string.Empty,
                    EventCreator = eventInformation.EventCreator,
                    EventImage = eventInformation.EventImage ?? string.Empty,
                    LocationID = eventInformation.LocationID,
                    CreatedDate = DateTime.Now //
                };

                // Kiểm tra các trường bắt buộc
                if (string.IsNullOrEmpty(eventInfo.EventName) || string.IsNullOrEmpty(eventInfo.EventCode))
                {
                    throw new ArgumentException("EventName và EventCode không được để trống.");
                }

                // Kiểm tra độ dài của EventCode
                if (eventInfo.EventCode.Length > 10)
                {
                    throw new ArgumentException("EventCode không được vượt quá 10 ký tự.");
                }

                data.EventInfos.InsertOnSubmit(eventInfo);
                data.SubmitChanges();
                return eventInfo.EventID;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra khi thêm sự kiện", ex);
            }
        }
        public void AddSpeakerAssign(SpeakersAssign speakerAssign)
        {
            data.SpeakersAssigns.InsertOnSubmit(speakerAssign);
            data.SubmitChanges();
        }
        public void AddDocument(EventDocument document)
        {
            try
            {
                data.EventDocuments.InsertOnSubmit(document);
                data.SubmitChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra khi thêm tài liệu", ex);
            }
        }

        public void AddEventWithDocuments(EventInfo eventInfo, List<EventDocument> documents)
        {
            try
            {
                data.EventInfos.InsertOnSubmit(eventInfo);
                data.SubmitChanges();

                foreach (var document in documents)
                {
                    document.DocumentEvent = eventInfo.EventID; 
                }
                data.EventDocuments.InsertAllOnSubmit(documents);
                data.SubmitChanges();

            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra khi thêm các dữ liệu", ex);
            }
        }
        public void UpdateEventImage(int eventId, string imagePath)
        {
            try
            {
                var eventToUpdate = data.EventInfos.FirstOrDefault(e => e.EventID == eventId && !e.IsDeleted);
                if (eventToUpdate != null)
                {
                    eventToUpdate.EventImage = imagePath;
                    data.SubmitChanges();
                }
                else
                {
                    throw new Exception($"Event with ID {eventId} not found.");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error updating event image: {ex.Message}");
                throw; // Re-throw the exception to be handled by the calling method
            }
        }
        public List<SpeakerEvent> GetAllSpeakers()
        {
            try
            {
                var speakers = data.Speakers.Where(s => s.IsDeleted == false)
                .Select(s => new SpeakerEvent
                {
                    SpeakerID = s.SpeakerID,
                    SpeakerName = s.SpeakerName,
                })
                .ToList(); 
                return speakers;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra khi tải danh sách diên giả", ex);
            }
        }
        public List<LocationEvent> GetAllLocations()
        {
            try
            {
                var locations = data.Locations
                    .Where(l => l.IsDeleted == false)
                    .Select(s => new LocationEvent
                    {
                        LocationID = s.LocationID,
                        LocationName = s.LocationName,
                        LocationAddress = s.LocationAddress,
                        LocationCapacity = s.LocationCapacity
                    })
                .ToList();
                return locations;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra khi tải danh sách diên giả", ex);
            }
        }
        public List<EventInfo> GetLatestCompetitions(int count)
        {
            return data.CompetitionNewests.OrderBy(cn => cn.Order).Take(count)
                    .Join(data.EventInfos, cn => cn.CompetitionID, c => c.EventID, (cn, c) => c)
                    .ToList();
        }

        public List<EventInfo> GetFeaturedCompetitions(int count)
        {
            return data.CompetitionFeatures.OrderBy(cf => cf.Order).Take(count)
                    .Join(data.EventInfos, cf => cf.CompetitionID, c => c.EventID, (cf, c) => c)
                    .ToList();
        }
        public List<EventInfo> GetLatestConference(int count)
        {
            return data.ConferenceNewests.OrderBy(cn => cn.Order).Take(count)
                    .Join(data.EventInfos, cn => cn.ConferenceID, c => c.EventID, (cn, c) => c)
                    .ToList();
        }

        public List<EventInfo> GetFeaturedConference(int count)
        {
            return data.ConferenceFeatures.OrderBy(cf => cf.Order).Take(count)
                    .Join(data.EventInfos, cf => cf.ConferenceID, c => c.EventID, (cf, c) => c)
                    .ToList();
        }
        public List<EventInfo> GetLatestSeminar(int count)
        {
            return data.SeminarNewests.OrderBy(cn => cn.Order).Take(count)
                    .Join(data.EventInfos, cn => cn.SeminarID, c => c.EventID, (cn, c) => c)
                    .ToList();
        }

        public List<EventInfo> GetFeaturedSeminar(int count)
        {
            return data.SeminarFeatures.OrderBy(cf => cf.Order).Take(count)
                    .Join(data.EventInfos, cf => cf.SeminarID, c => c.EventID, (cf, c) => c)
                    .ToList();
        }
        public List<RegistrationList> GetRegistrationListByEventID(int eventID)
        {
            return data.Registrations
            .Where(r => r.EventID == eventID)
            .Select(r => new RegistrationList
            {
                RegistrationID = r.RegistrationID,
                UserName = r.User.UserName,
                RegistrationDate = r.RegistratedDate
            })
            .ToList();
        }
        // Phương thức lấy event theo ID
        public List<RegisteredEventDetailsInfo> GetRegisteredEventsByUserId(int userId)
        {
            try
            {
                var eventList = data.Registrations
                    .Where(r => r.UserID == userId)
                    .Join(data.EventInfos
                    .Where(e => e.IsDeleted == false),
                        reg => reg.EventID,
                        events => events.EventID,
                        (reg, events) => events)
                    .Join(data.Users
                    .Where(u => u.IsDeleted == false),
                        events => events.EventCreator,
                        user => user.UserID,
                        (events, user) => new { events, user })
                    .Join(data.EventTypes
                    .Where(t => t.IsDeleted == false),
                        combined => combined.events.EventType,
                        eventType => eventType.EventTypeID,
                        (combined, eventType) => new { combined.events, combined.user, eventType })
                    .Join(data.Locations
                    .Where(l => l.IsDeleted == false),
                        combined => combined.events.LocationID,
                        location => location.LocationID,
                        (combined, location) => new RegisteredEventDetailsInfo
                        {
                            EventId = combined.events.EventID,
                            EventName = combined.events.EventName,
                            EventCode = combined.events.EventCode,
                            EventType = combined.eventType.EventTypeName,
                            EventDate = combined.events.EventDate,
                            EventRule = combined.events.EventRule,
                            EventDescription = combined.events.EventDescription,
                            EventCreator = combined.user.UserName,
                            EventParticipants = combined.events.EventParticipants,
                            EventLocation = location.LocationName,
                            CreatedDate = combined.events.CreatedDate,
                            RegisteredDate = data.Registrations
                                .Where(r => r.UserID == userId && r.EventID == combined.events.EventID)
                                .Select(r => r.RegistratedDate)
                                .FirstOrDefault()
                        })
                    .ToList();
                return eventList;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi khi lấy thông tin sự kiện đã đăng ký", ex);
            }
        }

        public void Dispose()
        {
            data.Dispose();
        }
    }
}