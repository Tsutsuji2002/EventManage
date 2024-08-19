using EventManage.Data;
using EventManagement.Data;
using EventManagement.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EventManagement.Areas.Admin.Controllers
{
    public class ADEventController : Controller
    {
        DALEvents dalEvent = new DALEvents();
        DALLocations dalLocations = new DALLocations();
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());
        // GET: Admin/ADEvent
        public ActionResult Index()
        {
            return View();
        }
        public ActionResult EventEditor()
        {
            return View();
        }
        [HttpPost]
        [ValidateInput(false)]
        public JsonResult AddEvent()
        {
            try
            {
                int userID = 6;

                var newEvent = new EventInformation
                {
                    EventName = Request.Form["EventName"],
                    EventCode = Request.Form["EventCode"],
                    EventType = int.Parse(Request.Form["EventType"]),
                    EventDate = Request.Form["EventDate"],
                    EventRule = "Default Rule",
                    EventParticipants = int.Parse(Request.Form["EventParticipants"]),
                    EventDescription = Server.HtmlDecode(Request.Form["EventDescription"]),
                    EventCreator = userID,
                    LocationID = int.Parse(Request.Form["LocationID"]),
                    CreatedDate = DateTime.Now
                };

                // Handle EventImage
                var eventImage = Request.Files["EventImage"];
                if (eventImage != null && eventImage.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(eventImage.FileName);
                    var newFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
                    var path = Path.Combine(Server.MapPath("~/Resources/event_images"), newFileName);
                    eventImage.SaveAs(path);
                    newEvent.EventImage = $"/Resources/event_images/{newFileName}";
                }

                int eventId = dalEvent.AddEvent(newEvent);

                // Handle SpeakerIDs
                var speakerIdsJson = Request.Form["SpeakerIDs"];
                if (!string.IsNullOrEmpty(speakerIdsJson))
                {
                    var speakerIds = JsonConvert.DeserializeObject<List<int>>(speakerIdsJson);
                    foreach (var speakerId in speakerIds)
                    {
                        var speakerAssign = new SpeakersAssign
                        {
                            EventID = eventId,
                            SpeakerID = speakerId
                        };
                        dalEvent.AddSpeakerAssign(speakerAssign);
                    }
                }

                // Handle other files
                for (int i = 0; i < Request.Files.Count; i++)
                {
                    var file = Request.Files[i];
                    if (file != null && file.ContentLength > 0 && file.FileName != "EventImage")
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var newFileName = $"{Guid.NewGuid()}{Path.GetExtension(fileName)}";
                        var path = Path.Combine(Server.MapPath("~/Resources/event_documents"), newFileName);
                        file.SaveAs(path);
                        var document = new EventDocument
                        {
                            DocumentEvent = eventId,
                            DocumentFilePath = $"/Resources/event_documents/{newFileName}",
                            DocumentTitle = fileName,
                            DocumentDate = DateTime.Now,
                        };
                        dalEvent.AddDocument(document);
                    }
                }

                return Json(new { success = true, message = "Thêm sự kiện thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message, stackTrace = ex.StackTrace });
            }
        }
        [HttpGet]
        public ActionResult GetSpeakers()
        {
            try
            {
                var speakers = dalEvent.GetAllSpeakers();
                return Json(speakers, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult EventList()
        {
            return View();
        }
        [HttpGet]
        public ActionResult GetEvents()
        {
            var events = dalEvent.GetAllEvents();
            return Json(events, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public ActionResult GetEventTypes()
        {
            var eventTypes = dalEvent.GetAllEventTypes();
            return Json(eventTypes, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult GetEventByType(int id)
        {
            try
            {
                DALEvents dal = new DALEvents();
                var eventbytype = dal.GetEventsByType(id);
                return Json(eventbytype, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult GetLocations()
        {
            try
            {
                var locations = dalEvent.GetAllLocations();
                return Json(locations, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        // POST: Location/Add
        [HttpPost]
        public ActionResult AddLocation(Location newLocation)
        {
            try
            {
                dalLocations.AddLocation(newLocation);
                return Json(new { success = true, message = "Location added successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        // POST: Location/Update
        [HttpPost]
        public ActionResult UpdateLocation(Location updatedLocation)
        {
            try
            {
                dalLocations.UpdateLocation(updatedLocation);
                return Json(new { success = true, message = "Location updated successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }

        [HttpPost]
        public ActionResult RemoveLocation(int locationId)
        {
            try
            {
                dalLocations.RemoveLocation(locationId);
                return Json(new { success = true, message = "Location removed successfully" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, error = ex.Message });
            }
        }
        [HttpPost]
        public JsonResult DeleteEvent(int id)
        {
            try
            {
                dalEvent.DeleteEvent(id);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public ActionResult SearchEvents(string term)
        {
            var events = dalEvent.GetAllEvents().Where(e =>
                e.EventName.Contains(term) ||
                e.EventDescription.Contains(term)
            ).ToList();
            return Json(events, JsonRequestBehavior.AllowGet);
        }
        public ActionResult GetRegistrations(int eventID)
        {
            var registrations = dalEvent.GetRegistrationListByEventID(eventID);
            return Json(registrations, JsonRequestBehavior.AllowGet);
        }
    }
}