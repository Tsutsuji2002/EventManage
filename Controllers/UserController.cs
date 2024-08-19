using EventManage.Data;
using EventManagement.Attributtes;
using EventManagement.Data;
using EventManagement.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
//using System.Web.Http;
using System.Web.Mvc;

namespace EventManagement.Controllers
{
    public class UserController : Controller
    {
        DALEvents dalEvent = new DALEvents();
        DALNews dalNews = new DALNews();
        EventRegistrationService eventRegistrationService = new EventRegistrationService();
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());
        // GET: User
        public ActionResult Index()
        {
            return View();
        }

        //UProfile
        public ActionResult UProfile()
        {
            return PartialView();
        }
        public ActionResult UserDataAccess()
        {
            try
            {
                if (Session["UserID"] != null)
                {
                    var userIdFromSession = Convert.ToInt32(Session["UserID"]);
                    var user = data.Users.FirstOrDefault(x => x.UserID == userIdFromSession && !x.IsDeleted);
                    return Json(new
                    {
                        user = new
                        {
                            userID = user.UserID,
                            userName = user.UserName,
                            userEmail = user.UserEmail,
                            userAvatar = user.UserAvatar,
                            userAddress = user.UserAddress,
                            userPhone = user.UserPhone
                        }
                    }, JsonRequestBehavior.AllowGet);
                }
                return Json(new { redirectToUrl = Url.Action("Unauthorized", "Error") }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult UserData()
        {
            try
            {
                if (Session["UserID"] != null)
                {
                    var userIdFromSession = Convert.ToInt32(Session["UserID"]);
                    var user = data.Users.FirstOrDefault(x => x.UserID == userIdFromSession && !x.IsDeleted);
                    return Json(new
                    {
                        user = new
                        {
                            userID = user.UserID,
                            userName = user.UserName,
                            userEmail = user.UserEmail,
                            userAvatar = user.UserAvatar,
                            userAddress = user.UserAddress,
                            userPhone = user.UserPhone
                        }
                    }, JsonRequestBehavior.AllowGet);
                }
                else return Json(null, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }
        //UProfile

        //UProfileUpdate
        public ActionResult UProfileUpdate()
        {
            return PartialView();
        }
        [HttpPost]
        public ActionResult UpdateProfile(string userName, string userEmail, string userAddress, string userPhone)
        {
            try
            {
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, error = "User not logged in" });
                }

                int userId = Convert.ToInt32(Session["UserID"]);
                var user = data.Users.FirstOrDefault(u => u.UserID == userId && !u.IsDeleted);

                if (user == null)
                {
                    return Json(new { success = false, error = "User not found" });
                }
                user.UserName = userName;
                user.UserEmail = userEmail;
                user.UserAddress = userAddress;
                user.UserPhone = userPhone;

                data.SubmitChanges();
                return Json(new
                {
                    success = true,
                    user = new
                    {
                        UserName = user.UserName,
                        UserEmail = user.UserEmail,
                        UserAddress = user.UserAddress,
                        UserPhone = user.UserPhone
                    }
                });
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { success = false, error = "Error updating user: " + ex.Message, stackTrace = ex.StackTrace });
            }
        }

        public ActionResult UpdateAvatar(int userID, string avatar)
        {
            var user = data.Users.FirstOrDefault(u => u.UserID == userID && !u.IsDeleted);
            user.UserAvatar = avatar;
            data.SubmitChanges();
            return Json(avatar);
        }
        //UProfileUpdate
        //EventEditor
        [UserRolesAuthorizeAttribute("AddEvent")]
        public ActionResult EventEditor()
        {
            return View();
        }
        [UserRolesAuthorizeAttribute("UpdateEvent")]
        public ActionResult EventUpdate(int id)
        {
            var events = dalEvent.GetEventById(id);
            ViewBag.EventID = id;

            if (events == null)
            {
                return HttpNotFound();
            }
            return View(events);
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
        [HttpGet]
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
        public ActionResult UserEventList()
        {
            return View();
        }
        [HttpGet]
        public ActionResult GetEvents()
        {
            if (Session["UserID"] == null)
            {
                return Json(new { success = false, message = "Bạn cần đăng nhập để xem sự kiện." }, JsonRequestBehavior.AllowGet);
            }

            int userID = Convert.ToInt32(Session["UserID"]);
            var events = dalEvent.GetRegisteredEventsByUserId(userID);
            return Json(events, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public ActionResult GetUserEvents()
        {
            if (Session["UserID"] == null)
            {
                return Json(new { success = false, message = "Bạn cần đăng nhập để xem sự kiện." }, JsonRequestBehavior.AllowGet);
            }

            int userID = Convert.ToInt32(Session["UserID"]);
            var events = dalEvent.GetUserEvents(userID);
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
            if (Session["UserID"] == null)
            {
                return Json(new { success = false, message = "Bạn cần đăng nhập để xem sự kiện." }, JsonRequestBehavior.AllowGet);
            }

            int userID = Convert.ToInt32(Session["UserID"]);
            try
            {
                DALEvents dal = new DALEvents();
                var eventbytype = dal.GetUserEventsByType(id ,userID);
                return Json(eventbytype, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        [UserRolesAuthorizeAttribute("DeleteEvent")]
        public ActionResult DeleteEvent(int id)
        {
            try
            {
                dalEvent.DeleteEvent(id);
                return Json(new { success = true, message = "Xoá sự kiện thành công!"});
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
        public ActionResult UserEventManage()
        {
            return View();
        }
        [HttpPost]
        [UserRolesAuthorizeAttribute("AddEvent")]
        [ValidateInput(false)]
        public JsonResult AddEvent()
        {
            try
            {
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, error = "User not logged in" });
                }

                int userID = Convert.ToInt32(Session["UserID"]);
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

                for (int i = 0; i < Request.Files.Count; i++)
                {
                    var key = Request.Files.AllKeys[i];
                    var file = Request.Files[i];

                    if (key == "EventImage") continue;

                    if (file != null && file.ContentLength > 0)
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

                return Json(new { success = true, message = "Thêm sự kiện thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message, stackTrace = ex.StackTrace });
            }
        }
        public ActionResult UserNewsList()
        {
            return View();
        }

        [HttpGet]
        public ActionResult GetUserNews()
        {
            if (Session["UserID"] == null)
            {
                return Json(new { success = false, message = "Bạn cần đăng nhập để xem sự kiện." }, JsonRequestBehavior.AllowGet);
            }

            int userID = Convert.ToInt32(Session["UserID"]);
            var events = dalNews.GetAllUserNews(userID);
            return Json(events, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        [UserRolesAuthorizeAttribute("DeleteNews")]
        public JsonResult DeleteNews(int id)
        {
            try
            {
                DALNews dalNews = new DALNews();
                dalNews.DeleteNews(id);
                return Json(new { success = true, message = "Xoá tin thành công" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = "Có lỗi xảy ra khi xóa tin: " + ex.Message });
            }
        }
        [UserRolesAuthorizeAttribute("AddNews")]
        public ActionResult NewsEditor()
        {
            return View();
        }
        [UserRolesAuthorizeAttribute("UpdateNews")]
        public ActionResult NewsUpdate(int id)
        {
            var news = dalNews.GetNewsById(id);
            ViewBag.NewsID = id;

            if (news == null)
            {
                return HttpNotFound();
            }
            return View(news);
        }
        [HttpGet]
        public ActionResult GetUserNewsByType(int id)
        {
            if (Session["UserID"] == null)
            {
                return Json(new { success = false, message = "Bạn cần đăng nhập để xem sự kiện." }, JsonRequestBehavior.AllowGet);
            }

            int userID = Convert.ToInt32(Session["UserID"]);
            var events = dalNews.GetUserNewsByType(id, userID);
            var newsDto = events.Select(n => new
            {
                NewsID = n.NewsID,
                NewsTitle = n.NewsTitle,
                NewsContent = n.NewsContent,
                NewsAuthor = n.NewsAuthor,
                NewsDate = n.NewsDate,
                NewsImage = n.NewsImage,
                NewsLink = n.NewsLink
            }).ToList();
            return Json(newsDto, JsonRequestBehavior.AllowGet);
        }
        public ActionResult UserUploadManage()
        {
            return View();
        }
        [HttpPost]
        [UserRolesAuthorizeAttribute("Registration")]
        public ActionResult RegisterForEvent(int eventId)
        {
            if (eventId == 0)
            {
                return Json(new { success = false, message = "Invalid event ID" });
            }

            if (Session["UserID"] == null)
            {
                return Json(new { success = false, error = "User not logged in" });
            }

            int userId = Convert.ToInt32(Session["UserID"]);
            if (userId == 0)
            {
                return Json(new { success = false, message = "User not logged in" });
            }

            try
            {
                var registration = new Registration
                {
                    UserID = userId,
                    EventID = eventId,
                    RegistratedDate = DateTime.Now
                };

                data.Registrations.InsertOnSubmit(registration);
                data.SubmitChanges();

                return Json(new { success = true, message = "Registration successful" });
            }
            catch (Exception)
            {
                // Log the exception
                return Json(new { success = false, message = "An error occurred during registration" });
            }
        }
        [UserRolesAuthorizeAttribute("CancelRegistration")]
        public ActionResult CancelRegistration(int eventId)
        {
            if (eventId == 0)
            {
                return Json(new { success = false, message = "Invalid event ID" });
            }

            if (Session["UserID"] == null)
            {
                return Json(new { success = false, message = "User not logged in" });
            }

            int userId = Convert.ToInt32(Session["UserID"]);
            if (userId == 0)
            {
                return Json(new { success = false, message = "User not logged in" });
            }

            try
            {
                var registration = data.Registrations.FirstOrDefault(r => r.UserID == userId && r.EventID == eventId);

                if (registration == null)
                {
                    return Json(new { success = false, message = "Registration not found" });
                }

                data.Registrations.DeleteOnSubmit(registration);
                data.SubmitChanges();

                return Json(new { success = true, message = "Registration cancelled successfully" });
            }
            catch (Exception)
            {
                // Log the exception
                return Json(new { success = false, message = "An error occurred while cancelling registration" });
            }
        }
        [HttpGet]
        public ActionResult GetUserRegistrations()
        {
            if (Session["UserID"] == null)
            {
                return Json(new { success = false, error = "User not logged in" });
            }
            int userId = Convert.ToInt32(Session["UserID"]);
            if (userId == 0)
            {
                return Json(new { success = false, message = "User not logged in" });
            }

            var registeredEventIds = data.Registrations
                .Where(r => r.UserID == userId)
                .Select(r => r.EventID)
                .ToList();

            return Json(registeredEventIds, JsonRequestBehavior.AllowGet);
        }
    }
}