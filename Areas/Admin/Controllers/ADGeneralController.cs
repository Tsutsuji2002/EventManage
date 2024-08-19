using EventManagement.Data;
using EventManagement.Models;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EventManagement.Areas.Admin.Controllers
{
    public class ADGeneralController : Controller
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());
        // GET: Admin/ADGeneral
        public ActionResult SliderEditor()
        {
            return View();
        }

        [HttpGet]
        public JsonResult GetSliders()
        {
            var sliders = data.Sliders
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
            return Json(sliders, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public ActionResult AddSlider(HttpPostedFileBase image)
        {
            if (image == null || image.ContentLength == 0)
                return Json(new { success = false, message = "Ảnh chưa được upload." });

            try
            {
                string uniqueFileName = SaveImage(image);

                var newSlider = new Slider
                {
                    SliderName = "New Slider",
                    SliderImage = uniqueFileName,
                    SliderLink = "#",
                    Order = data.Sliders.Any() ? data.Sliders.Max(s => s.Order) + 1 : 1
                };

                data.Sliders.InsertOnSubmit(newSlider);
                data.SubmitChanges();

                return Json(new { success = true, message = "Slider thêm thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        [HttpPost]
        public ActionResult DeleteSlider(int id)
        {
            var slider = data.Sliders.FirstOrDefault(s => s.SliderID == id);
            if (slider == null)
                return Json(new { success = false, message = "Slider không tìm thấy!." });

            try
            {
                DeleteImage(slider.SliderImage);
                data.Sliders.DeleteOnSubmit(slider);
                data.SubmitChanges();

                return Json(new { success = true, message = "Slider xóa thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        [HttpPost]
        public ActionResult EditSlider(int sliderId, HttpPostedFileBase image)
        {
            var slider = data.Sliders.FirstOrDefault(s => s.SliderID == sliderId);
            if (slider == null)
                return Json(new { success = false, message = "Slider không tìm thấy!." });

            if (image != null && image.ContentLength > 0)
            {
                try
                {
                    DeleteImage(slider.SliderImage);
                    string uniqueFileName = SaveImage(image);
                    slider.SliderImage = uniqueFileName;

                    data.SubmitChanges();
                    return Json(new { success = true, message = "Slider cập nhật thành công!" });
                }
                catch (Exception ex)
                {
                    return Json(new { success = false, message = $"Error: {ex.Message}" });
                }
            }

            return Json(new { success = false, message = "Ảnh chưa được upload." });
        }

        [HttpPost]
        public ActionResult UpdateSliderOrder(int sliderId)
        {
            var slider = data.Sliders.FirstOrDefault(s => s.SliderID == sliderId);
            if (slider == null)
                return Json(new { success = false, message = "Slider không tìm thấy!." });

            try
            {
                slider.Order = 1;
                data.SubmitChanges();
                return Json(new { success = true, message = "Thứ tự slider cập nhật thành công!" });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = $"Error: {ex.Message}" });
            }
        }

        private string SaveImage(HttpPostedFileBase image)
        {
            string uniqueFileName = Guid.NewGuid().ToString() + "_" + Path.GetFileName(image.FileName);
            string uploadsFolder = Path.Combine(Server.MapPath("~/Resources/images/"), uniqueFileName);

            image.SaveAs(uploadsFolder);

            return uniqueFileName;
        }

        private void DeleteImage(string imageName)
        {
            if (!string.IsNullOrEmpty(imageName))
            {
                string filePath = Path.Combine(Server.MapPath("~/Resources/images/"), imageName);
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }
        }
    }
}