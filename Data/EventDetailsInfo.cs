using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EventManage.Data
{
    public class RegistrationList
    {
        public int RegistrationID { get; set; }
        public string UserName { get; set; }
        public DateTime RegistrationDate { get; set; }
    }
    public class EventDataViewModel
    {
        public EventInformation eventInformation { get; set; }
        public List<int> SpeakerIDs { get; set; }
        public FileViewModel EventImage { get; set; }
        public List<FileViewModel> Files { get; set; }
    }

    public class FileViewModel
    {
        public string FileName { get; set; }
        public string ContentType { get; set; }
        public string Base64Content { get; set; }
    }
    public class SpeakerEvent
    {
        public int SpeakerID { get; set; }
        public string SpeakerName { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class LocationEvent
    {
        public int LocationID { get; set; }
        public string LocationName { get; set; }
        public string LocationAddress { get; set; }
        public int LocationCapacity { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class EventTypeList
    {
        public int EventTypeID { get; set; }
        public string EventTypeName { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class EventInformation
    {
        public int EventID { get; set; }
        public string EventName { get; set; }
        public string EventCode { get; set; }
        public int EventType { get; set; }
        public string EventDate { get; set; }
        public string EventRule { get; set; }
        public int EventParticipants { get; set; }
        [AllowHtml]
        public string EventDescription { get; set; }
        public int EventCreator { get; set; }
        public string EventImage { get; set; }
        public int LocationID { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
    public class RegisteredEventDetailsInfo
    {
        public int EventId { get; set; }
        public string EventName { get; set; }
        public string EventCode { get; set; }
        public string EventType { get; set; }
        public string EventDate { get; set; }
        public string EventRule { get; set; }
        public string EventDescription { get; set; }
        public string EventCreator { get; set; }
        public int EventParticipants { get; set; }
        public string EventLocation { get; set; }
        public DateTime? CreatedDate { get; set; }
        public DateTime? RegisteredDate { get; set; }
    }
    public class EventDetailsInfo
    {
        public int EventId { get; set; }
        public string EventName { get; set; }
        public string EventCode { get; set; }
        public string EventType { get; set; }
        public string EventDate { get; set; }
        public string EventRule { get; set; }
        public string EventDescription { get; set; }
        public string EventImage { get; set; }
        public string EventCreator { get; set; }
        public int EventParticipants { get; set; }
        public string EventLocation { get; set; }
        public DateTime? CreatedDate { get; set; }
        public bool IsDeleted { get; set; }
    }
}