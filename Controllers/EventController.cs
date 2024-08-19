
using EventManage.Data;
using EventManagement.Data;
using EventManagement.Models;
using System;
using System.Activities;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace EventManagement.Controllers
{
    public class EventController : Controller
    {
        private readonly DALEvents dalEvents = new DALEvents();
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());
        // GET: Event

        public ActionResult EventDetails(int id)
        {
            var news = dalEvents.GetEventById(id);
            ViewBag.ID = id;

            if (news == null)
            {
                return HttpNotFound();
            }
            return View(news);
        }
        [HttpGet]
        public JsonResult EventDetailsData(int id)
        {
            try
            {
                var events = dalEvents.GetEventById(id);
                if (events == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.NotFound;
                    return Json(new { error = "Không tìm thấy tin tức" }, JsonRequestBehavior.AllowGet);
                }
                return Json(new
                {
                    events = new EventDetailsInfo
                    {
                        EventId = events.EventId,
                        EventName = events.EventName,
                        EventCode = events.EventCode,
                        EventType = events.EventType,
                        EventDate = events.EventDate,
                        EventRule = events.EventRule,
                        EventDescription = events.EventDescription,
                        EventCreator = events.EventType,
                        EventParticipants = events.EventParticipants,
                        EventLocation = events.EventLocation,
                        CreatedDate = events.CreatedDate
                    }
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult EventDocumentsData(int id)
        {
            try
            {
                var documents = dalEvents.GetEventDocuments(id);
                var documentList = documents.Select(s => new
                {
                    DocumentTitle = s.DocumentTitle,
                    DocumentFilePath = s.DocumentFilePath,
                    DocumentDate = s.DocumentDate
                }).ToList();
                return Json(documentList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult EventSpeakersData(int id)
        {
            try
            {
                var eventSpeakers = dalEvents.GetSpeakersByEventId(id);
                var speakerList = eventSpeakers.Select(s => new
                {
                    name = s.SpeakerName
                }).ToList();

                return Json(speakerList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult Seminar()
        {
            return View();
        }
        [HttpGet]
        public ActionResult GetSeminarList()
        {
            try
            {
                DALEvents dal = new DALEvents();
                var seminar = dal.GetEventsByType(1);//1 = Seminar 
                return Json(seminar, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetLatestAndFeaturedSeminars()
        {
            try
            {
                var latestSeminars = dalEvents.GetLatestSeminar(3);
                var featuredSeminars = dalEvents.GetFeaturedSeminar(3);

                var latestSeminarsFormatted = latestSeminars.Select(c => new
                {
                    EventID = c.EventID,
                    EventName = c.EventName,
                    EventImage = c.EventImage,
                    EventCreator = c.EventCreator,
                    CreatedDate = c.CreatedDate
                }).ToList();

                var featuredSeminarsFormatted = featuredSeminars.Select(c => new
                {
                    EventID = c.EventID,
                    EventName = c.EventName,
                    EventImage = c.EventImage,
                    EventCreator = c.EventCreator,
                    CreatedDate = c.CreatedDate
                }).ToList();

                return Json(new
                {
                    latestSeminars = latestSeminarsFormatted,
                    featuredSeminars = featuredSeminarsFormatted
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult SemiLeftPartial()
        {
            return PartialView();
        }
        public ActionResult SemiRightPartial()
        {
            return PartialView();
        }

        public ActionResult Conference()
        {
            DALEvents dal = new DALEvents();
            var evt = dal.GetEventsByType(2);//2 = Conference
            return View();
        }

        [HttpGet]
        public ActionResult GetConferenceList()
        {
            try
            {
                DALEvents dal = new DALEvents();
                var conference = dal.GetEventsByType(2); // 2 = Conference
                return Json(conference, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpGet]
        public JsonResult GetLatestAndFeaturedConferences()
        {
            try
            {
                var latestConferences = dalEvents.GetLatestConference(3);
                var featuredConferences = dalEvents.GetFeaturedConference(3);

                var latestConferencesFormatted = latestConferences.Select(c => new
                {
                    EventID = c.EventID,
                    EventName = c.EventName,
                    EventImage = c.EventImage,
                    EventCreator = c.EventCreator,
                    CreatedDate = c.CreatedDate
                }).ToList();

                var featuredConferencesFormatted = featuredConferences.Select(c => new
                {
                    EventID = c.EventID,
                    EventName = c.EventName,
                    EventImage = c.EventImage,
                    EventCreator = c.EventCreator,
                    CreatedDate = c.CreatedDate
                }).ToList();

                return Json(new
                {
                    latestConferences = latestConferencesFormatted,
                    featuredConferences = featuredConferencesFormatted
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult ConferLeftPartial()
        {
            return PartialView();
        }
        public ActionResult ConferRightPartial()
        {
            return PartialView();
        }

        public ActionResult Competition()
        {
            DALEvents dal = new DALEvents();
            var evt = dal.GetEventsByType(3);//3 = Competition 
            return View();
        }

        [HttpGet]
        public ActionResult GetCompetitionList()
        {
            try
            {
                DALEvents dal = new DALEvents();
                var conference = dal.GetEventsByType(3); // 2 = Competition
                return Json(conference, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
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
        [HttpGet]
        public JsonResult GetLatestAndFeaturedCompetitions()
        {
            try
            {
                var latestCompetitions = dalEvents.GetLatestCompetitions(3);
                var featuredCompetitions = dalEvents.GetFeaturedCompetitions(3);

                var latestCompetitionsFormatted = latestCompetitions.Select(c => new
                {
                    EventID = c.EventID,
                    EventName = c.EventName,
                    EventImage = c.EventImage,
                    EventCreator = c.EventCreator,
                    CreatedDate = c.CreatedDate
                }).ToList();

                var featuredCompetitionsFormatted = featuredCompetitions.Select(c => new
                {
                    EventID = c.EventID,
                    EventName = c.EventName,
                    EventImage = c.EventImage,
                    EventCreator = c.EventCreator,
                    CreatedDate = c.CreatedDate
                }).ToList();

                return Json(new
                {
                    latestCompetitions = latestCompetitionsFormatted,
                    featuredCompetitions = featuredCompetitionsFormatted
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult CompeLeftPartial()
        {
            return PartialView();
        }
        public ActionResult CompeRightPartial()
        {
            return PartialView();
        }
    }
}