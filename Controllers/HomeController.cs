using EventManagement.Data;
using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace EventManagement.Controllers
{
    public class HomeController : Controller
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        [HttpGet]
        public ActionResult GetSlides()
        {
            try
            {
                var slides = data.Sliders
                    .Where(s => s.Order > 0)
                    .OrderBy(s => s.Order)
                    .Select(s => new
                    {
                        s.SliderID,
                        s.SliderName,
                        s.SliderImage,
                        s.SliderLink,
                        s.Order
                    })
                    .ToList();

                return Json(slides, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult Index()
        {
            DALNews dalNews = new DALNews();
            var newestNews = dalNews.GetAllNews();
            return View();
        }

        [HttpGet]
        public ActionResult GetAllNews()
        {
            try
            {
                DALNews dalNews = new DALNews();
                var newestNews = dalNews.GetAllNews();

                return Json(newestNews, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }
        public ActionResult NavDataAccess()
        {
            var navList = data.Navigations.ToList();
            return Json(navList, JsonRequestBehavior.AllowGet);
        }

        public JsonResult NewsTypeAccess()
        {
            try
            {
                var newstypeList = data.NewsTypes.Where(nt => !nt.IsDeleted).Select(nt => new { nt.NewsTypeID, nt.NewsTypeName, nt.NewsTypeLink }).ToList();
                return Json(newstypeList, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(ex.Message);
            }
        }

        public ActionResult NavPartial()
        {
            var navList = data.Navigations.ToList();
            return PartialView(navList);
        }

        public ActionResult UserAvatarPartial()
        {
            try
            {
                var userId = Session["UserID"] as int?;
                if (userId.HasValue)
                {
                    var user = data.Users.Where(u => !u.IsDeleted).SingleOrDefault(u => u.UserID == userId.Value);
                    if (user != null)
                    {
                        return Json(new { user = new { UserName = user.UserName, UserID = user.UserID } }, JsonRequestBehavior.AllowGet);
                    }
                }
                return Json(new { user = (object)null }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = 500;
                return Json(new { error = ex.Message, stackTrace = ex.StackTrace }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult NewestNews()
        {
            return PartialView();
        }

        public ActionResult FooterPartial()
        {
            return PartialView();
        }
        public ActionResult LeftPartial()
        {
            return PartialView();
        }
        public ActionResult RightPartial()
        {
            return PartialView();
        }
        public ActionResult Slider()
        {
            return PartialView();
        }
        public ActionResult TestView()
        {
            return PartialView();
        }
    }
}