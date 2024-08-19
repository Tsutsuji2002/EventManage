using EventManagement.Attributtes;
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
    public class CommentController : Controller
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        public JsonResult GetComments(int newsId)
        {
            int currentUserId = Convert.ToInt32(Session["UserID"] ?? 0);
            var comments = data.Comments
                .Where(c => c.NewsID == newsId && !c.IsDeleted)
                .OrderByDescending(c => c.CreateDate)
                .Select(c => new
                {
                    c.CommentID,
                    c.Content,
                    c.UserID,
                    UserName = c.User.UserName,
                    UserAvatar = c.User.UserAvatar,
                    c.ParentsCommentID,
                    c.CommentLikes,
                    IsLikedByCurrentUser = data.CommentLikes.Any(l => l.CommentID == c.CommentID && l.UserID == currentUserId),
                    CreateDate = c.CreateDate
                })
                .ToList();
            return Json(comments, JsonRequestBehavior.AllowGet);
        }
        // POST: /Comment/AddComment
        [HttpPost]
        [UserRolesAuthorizeAttribute("AddComment")]
        public JsonResult AddComment(Comment comment)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            comment.CreateDate = DateTime.UtcNow;
            comment.IsDeleted = false;

            data.Comments.InsertOnSubmit(comment);
            data.SubmitChanges();

            return Json(new
            {
                success = true,
                comment = new
                {
                    comment.CommentID,
                    comment.Content,
                    comment.UserID,
                    comment.ParentsCommentID,
                    comment.CommentLikes,
                    CreateDate = comment.CreateDate
                }
            });
        }

        // POST: /Comment/LikeComment
        //[HttpPost]
        //public JsonResult LikeComment(int id)
        //{
        //    var comment = data.Comments.FirstOrDefault(c => c.CommentID == id);

        //    if (comment == null || comment.IsDeleted)
        //    {
        //        return Json(new { success = false, message = "Comment not found" });
        //    }

        //    comment.CommentLikes++;
        //    data.SubmitChanges();

        //    return Json(new { success = true, likes = comment.CommentLikes });
        //}
        [HttpPost]
        public JsonResult ToggleLike(int commentId)
        {
            if (Session["UserID"] == null)
            {
                return Json(new { success = false, message = "User not authenticated" });
            }

            int userId = Convert.ToInt32(Session["UserID"]);
            var comment = data.Comments.FirstOrDefault(c => c.CommentID == commentId && !c.IsDeleted);
            if (comment == null)
            {
                return Json(new { success = false, message = "Comment not found" });
            }

            var existingLike = data.CommentLikes.FirstOrDefault(l => l.CommentID == commentId && l.UserID == userId);

            if (existingLike != null)
            {
                data.CommentLikes.DeleteOnSubmit(existingLike);
                comment.CommentLikes--;
            }
            else
            {
                var newLike = new CommentLike { CommentID = commentId, UserID = userId };
                data.CommentLikes.InsertOnSubmit(newLike);
                comment.CommentLikes++;
            }

            data.SubmitChanges();

            return Json(new { success = true, likes = comment.CommentLikes, isLiked = (existingLike == null) });
        }

        // POST: /Comment/ReplyToComment
        [HttpPost]
        [UserRolesAuthorizeAttribute("AddComment")]
        public JsonResult ReplyToComment(Comment reply)
        {
            if (!ModelState.IsValid)
            {
                return Json(new { success = false, errors = ModelState.Values.SelectMany(v => v.Errors).Select(e => e.ErrorMessage) });
            }

            if (!CommentExists(reply.ParentsCommentID.Value))
            {
                return Json(new { success = false, message = "Parent comment not found" });
            }

            reply.CreateDate = DateTime.UtcNow;
            reply.IsDeleted = false;

            data.Comments.InsertOnSubmit(reply);
            data.SubmitChanges();

            return Json(new
            {
                success = true,
                reply = new
                {
                    reply.CommentID,
                    reply.Content,
                    reply.UserID,
                    reply.ParentsCommentID,
                    reply.CommentLikes,
                    CreateDate = reply.CreateDate
                }
            });
        }

        private bool CommentExists(int id)
        {
            return data.Comments.Any(e => e.CommentID == id);
        }
    }
}