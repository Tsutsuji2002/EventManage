using EventManagement.Attributtes;
using EventManagement.Data;
using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.Mvc;

namespace EventManagement.Controllers
{
    public class NewsController : Controller
    {
        private readonly DALNews dalNews = new DALNews();
        private readonly DALAccounts dalAccounts = new DALAccounts();
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        // GET: News
        public ActionResult Index()
        {
            var allNews = dalNews.GetAllNews();
            return View(allNews);
        }

        public ActionResult NewsDetails(int id)
        {

            var news = dalNews.GetNewsById(id);
            ViewBag.ID = id;

            if (news == null)
            {
                return HttpNotFound();
            }
            return View(news);
        }
        [HttpGet]
        public JsonResult NewsDetailsData(int id)
        {
            try
            {
                var news = dalNews.GetNewsById(id);
                if (news == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.NotFound;
                    return Json(new { error = "News not found" }, JsonRequestBehavior.AllowGet);
                }
                return Json(new
                {
                    news = new
                    {
                        NewsID = news.NewsID,
                        NewsTitle = news.NewsTitle,
                        NewsContent = news.NewsContent,
                        NewsAuthor = news.NewsAuthor,
                        NewsDate = news.NewsDate,
                        NewsImage = news.NewsImage,
                        NewsLink = news.NewsLink
                    }
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SearchNewsResult(string query)
        {
            ViewBag.SearchQuery = query;
            return View();
        }
        [HttpPost]
        [UserRolesAuthorizeAttribute("AddNews")]
        [ValidateInput(false)]
        public ActionResult AddNews()
        {
            if (ModelState.IsValid)
            {
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "Bạn cần đăng nhập để thêm tin tức." });
                }

                int userID = Convert.ToInt32(Session["UserID"]);

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
        [HttpPost]
        [ValidateInput(false)]
        [UserRolesAuthorizeAttribute("UpdateNews")]
        public ActionResult UpdateNews()
        {
            if (ModelState.IsValid)
            {
                if (Session["UserID"] == null)
                {
                    return Json(new { success = false, message = "Bạn cần đăng nhập để cập nhật tin tức." });
                }

                int userID = Convert.ToInt32(Session["UserID"]);

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
                else
                {
                    newsModel.NewsImage = Request.Form["NewsImage"];
                }

                DALNews dalNews = new DALNews();
                dalNews.UpdateNews(newsModel);
                return Json(new { success = true, message = "Cập nhật tin tức thành công" });
            }

            return Json(new { success = false, message = "Có lỗi xảy ra khi cập nhật tin tức.", errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
        }

        [HttpGet]
        public JsonResult SearchNews(string query)
        {
            try
            {
                var allNews = dalNews.GetAllNews();
                var searchResults = allNews.Where(n =>
                    n.NewsTitle.IndexOf(query, StringComparison.OrdinalIgnoreCase) >= 0 ||
                    n.NewsContent.IndexOf(query, StringComparison.OrdinalIgnoreCase) >= 0
                ).ToList();

                var formattedResults = searchResults.Select(n => new
                {
                    NewsID = n.NewsID,
                    NewsTitle = n.NewsTitle,
                    NewsContent = n.NewsContent,
                    NewsAuthor = n.NewsAuthor,
                    NewsDate = n.NewsDate,
                    NewsImage = n.NewsImage,
                    NewsLink = n.NewsLink
                }).ToList();

                return Json(new { news = formattedResults }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        public ActionResult SearchByType(int id)
        {
            var newsByType = data.NewsTypes.Where(n => n.NewsTypeID == id && !n.IsDeleted).FirstOrDefault();
            ViewBag.TypeId = id;
            ViewBag.NewsType = newsByType.NewsTypeName;
            return View();
        }
        [HttpGet]
        public JsonResult GetNewsByType(int id)
        {
            try
            {
                if (id == 1)
                {
                    var newsByType = dalNews.GetAllNews();
                    return Json(new { news = newsByType }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    var newsByType = dalNews.GetNewsByType(id);

                    var formattedResults = newsByType.Select(n => new
                    {
                        NewsID = n.NewsID,
                        NewsTitle = n.NewsTitle,
                        NewsContent = n.NewsContent,
                        NewsAuthor = n.NewsAuthor,
                        NewsDate = n.NewsDate,
                        NewsImage = n.NewsImage,
                        NewsLink = n.NewsLink
                    }).ToList();

                    return Json(new { news = formattedResults }, JsonRequestBehavior.AllowGet);
                }
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }

        [HttpGet]
        public JsonResult GetLatestAndFeaturedNews()
        {
            try
            {
                var latestNews = dalNews.GetLatestNews(3);
                var featuredNews = dalNews.GetFeaturedNews(3);

                var latestNewsFormatted = latestNews.Select(n => new
                {
                    NewsID = n.NewsID,
                    NewsTitle = n.NewsTitle,
                    NewsImage = n.NewsImage,
                }).ToList();

                var featuredNewsFormatted = featuredNews.Select(n => new
                {
                    NewsID = n.NewsID,
                    NewsTitle = n.NewsTitle,
                    NewsImage = n.NewsImage,
                }).ToList();

                return Json(new
                {
                    latestNews = latestNewsFormatted,
                    featuredNews = featuredNewsFormatted
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(new { error = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult DeleteNewsType(int id)
        {
            try
            {
                var newsType = data.NewsTypes.SingleOrDefault(nt => nt.NewsTypeID == id && !nt.IsDeleted);
                if (newsType == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.NotFound;
                    return Json("NewsType not found");
                }

                newsType.IsDeleted = true;
                data.SubmitChanges();

                return Json("Xóa thể loại thành công", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(ex.Message);
            }
        }
        public JsonResult UpdateNewsType(int id, string name)
        {
            try
            {
                var newsType = (from nt in data.NewsTypes
                                where nt.NewsTypeID == id && nt.IsDeleted == false
                                select nt).FirstOrDefault();

                if (newsType == null)
                {
                    Response.StatusCode = (int)HttpStatusCode.NotFound;
                    return Json("Không tìm thấy thể loại");
                }

                newsType.NewsTypeName = name;
                data.SubmitChanges();

                return Json("Cập nhật thể loại thành công", JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(ex.Message);
            }
        }
        [HttpPost]
        public JsonResult AddNewsType(string NewsTypeName)
        {
            try
            {
                if (string.IsNullOrEmpty(NewsTypeName))
                {
                    Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    return Json("Tên thể loại không được để trống");
                }

                var newNewsType = new NewsType
                {
                    NewsTypeName = NewsTypeName
                };

                data.NewsTypes.InsertOnSubmit(newNewsType);
                data.SubmitChanges();

                return Json(new { newNewsType.NewsTypeID, newNewsType.NewsTypeName }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.BadRequest;
                return Json(ex.Message);
            }
        }

        // GET: News/Create
        public ActionResult Create()
        {
            return View();
        }

        // GET: News/Latest
        public ActionResult Latest()
        {
            var latestNews = dalNews.GetNewestNews();
            return View(latestNews);
        }
    }
}