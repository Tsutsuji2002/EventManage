using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Http.Cors;
using EventManagement.Areas.Admin.Attributes;
using EventManagement.Data;
using EventManagement.Models;
using System.Configuration;
using System.IO;


namespace EventManagement.Areas.Admin.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    //[AdminAuthorize]
    public class ADNewsController : Controller
    {
        DALNews dalNews = new DALNews();
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());
        // GET: Admin/ADNews
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult NewsEditor()
        {
            return View();
        }
        public ActionResult NewsList()
        {
            return View();
        }
        [HttpGet]
        public JsonResult GetNewsList()
        {
            var newsList = dalNews.GetAllNews();
            return Json(newsList, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        [ValidateInput(false)]
        public ActionResult AddNews()
        {
            if (ModelState.IsValid)
            {
                //if (Session["UserID"] == null)
                //{
                //    return Json(new { success = false, message = "Bạn cần đăng nhập để thêm tin tức." });
                //}

                //int userID = Convert.ToInt32(Session["UserID"]);
                int userID = 6;

                var newsModel = new New
                {
                    NewsTitle = Request.Form["NewsTitle"],
                    NewsContent = Server.HtmlDecode(Request.Form["NewsContent"]),
                    NewsTypeID = int.Parse(Request.Form["NewsTypeID"]),
                    NewsAuthor = userID,
                    NewsDate = DateTime.Now
                };

                //if (Request.Files.Count > 0)
                //{
                //    var file = Request.Files[0];
                //    if (file != null && file.ContentLength > 0)
                //    {
                //        var fileName = Path.GetFileName(file.FileName);
                //        var path = Path.Combine(Server.MapPath("~/Resources/news_images"), fileName);
                //        file.SaveAs(path);
                //        newsModel.NewsImage = "/Resources/news_images/" + fileName;
                //    }
                //}

                //Lưu trên máy
                if (Request.Files.Count > 0)
                {
                    var file = Request.Files[0];
                    if (file != null && file.ContentLength > 0)
                    {
                        var fileName = Path.GetFileName(file.FileName);
                        var projectFolder = Server.MapPath("~/Resources/news_images");

                        if (!Directory.Exists(projectFolder))
                        {
                            Directory.CreateDirectory(projectFolder);
                        }

                        var filePath = Path.Combine(projectFolder, fileName);

                        int counter = 1;
                        string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                        string extension = Path.GetExtension(fileName);
                        while (System.IO.File.Exists(filePath))
                        {
                            fileName = $"{fileNameWithoutExtension}_{counter}{extension}";
                            filePath = Path.Combine(projectFolder, fileName);
                            counter++;
                        }

                        try
                        {
                            file.SaveAs(filePath);
                            newsModel.NewsImage = $"/Resources/news_images/{fileName}";
                        }
                        catch (Exception ex)
                        {
                            // Log the exception
                            System.Diagnostics.Debug.WriteLine($"Error saving file: {ex.Message}");
                            return Json(new { success = false, message = "Có lỗi xảy ra khi lưu ảnh." });
                        }
                    }
                }

                DALNews dalNews = new DALNews();
                dalNews.AddNews(newsModel);
                return Json(new { success = true, message = "Thêm tin thành công" });
            }
            return Json(new { success = false, message = "Có lỗi xảy ra khi thêm tin tức.", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
        }
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
        [HttpPost]
        [ValidateInput(false)]
        public ActionResult UpdateNews()
        {
            if (ModelState.IsValid)
            {
                //if (Session["UserID"] == null)
                //{
                //    return Json(new { success = false, message = "Bạn cần đăng nhập để cập nhật tin tức." });
                //}

                //int userID = Convert.ToInt32(Session["UserID"]);
                
                var newsModel = new New
                {
                    NewsID = int.Parse(Request.Form["NewsID"]),
                    NewsTitle = Request.Form["NewsTitle"],
                    NewsContent = Request.Form["NewsContent"],
                    NewsTypeID = int.Parse(Request.Form["NewsTypeID"]),
                    //NewsDate = DateTime.Now
                };

                if (Request.Files.Count > 0 && Request.Files[0] != null && Request.Files[0].ContentLength > 0)
                {
                    var file = Request.Files[0];
                    var fileName = Path.GetFileName(file.FileName);
                    var projectFolder = Server.MapPath("~/Resources/news_images");

                    if (!Directory.Exists(projectFolder))
                    {
                        Directory.CreateDirectory(projectFolder);
                    }

                    var filePath = Path.Combine(projectFolder, fileName);

                    int counter = 1;
                    string fileNameWithoutExtension = Path.GetFileNameWithoutExtension(fileName);
                    string extension = Path.GetExtension(fileName);
                    while (System.IO.File.Exists(filePath))
                    {
                        fileName = $"{fileNameWithoutExtension}_{counter}{extension}";
                        filePath = Path.Combine(projectFolder, fileName);
                        counter++;
                    }

                    try
                    {
                        file.SaveAs(filePath);
                        newsModel.NewsImage = $"/Resources/news_images/{fileName}";
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine($"Error saving file: {ex.Message}");
                        return Json(new { success = false, message = "Có lỗi xảy ra khi lưu ảnh." });
                    }
                }

                DALNews dalNews = new DALNews();
                dalNews.UpdateNews(newsModel);
                return Json(new { success = true, message = "Cập nhật tin tức thành công" });
            }

            return Json(new { success = false, message = "Có lỗi xảy ra khi cập nhật tin tức.", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
        }
        [HttpPost]
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
        [HttpGet]
        public JsonResult IsNewsFeature(int newsId)
        {
            try
            {
                DALNews dalNews = new DALNews();
                bool isFeatured = dalNews.IsNewsFeature(newsId);
                return Json(new { success = true, isFeatured }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        [HttpPost]
        public JsonResult SetNewsFeature(int id, bool check)
        {
            try
            {
                DALNews dalNews = new DALNews();
                dalNews.SetNewsFeature(id, check);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
        [HttpGet]
        public JsonResult IsNewsNewest(int newsId)
        {
            try
            {
                DALNews dalNews = new DALNews();
                bool isFeatured = dalNews.IsNewsNewest(newsId);
                return Json(new { success = true, isFeatured }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpPost]
        public JsonResult SetNewsNewest(int id, bool check)
        {
            try
            {
                DALNews dalNews = new DALNews();
                dalNews.SetNewsNewest(id, check);
                return Json(new { success = true });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }
    }
}