using EventManagement.Models;
using System;
using System.Activities.Expressions;
using System.Collections.Generic;
using System.Data.Linq;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace EventManagement.Data
{
    public class DALNews
    {
        public static DataConnection con = new DataConnection();
        EventManagementDataClassesDataContext data = new EventManagementDataClassesDataContext(con.GetConnectionString());

        // Lấy 10 tin mới nhất
        public List<dynamic> GetNewestNews()
        {
            try
            {
                var newestNews = data.News
                    .Where(x => x.IsDeleted == false)
                    .Join(
                        data.Users
                        .Where(x => x.IsDeleted == false),
                        news => news.NewsAuthor,
                        user => user.UserID,
                        (news, user) => new
                        {
                            news.NewsID,
                            news.NewsTitle,
                            news.NewsContent,
                            NewsAuthor = user.UserName,
                            news.NewsDate,
                            news.NewsImage,
                            news.NewsLink
                        })
                    .OrderByDescending(n => n.NewsDate)
                    .Take(10)
                    .Select(x => (dynamic)x)
                    .ToList();

                return newestNews;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi khi hiển thị bài viết mới", ex);
            }
        }
        // Lấy theo thể loại
        public List<dynamic> GetNewsByType(int id)
        {
            try
            {
                var newsByType = data.News
                    .Where(nw => nw.NewsTypeID == id && !nw.IsDeleted)
                    .Join(
                        data.Users,
                        news => news.NewsAuthor,
                        user => user.UserID,
                        (news, user) => new
                        {
                            news.NewsID,
                            news.NewsTitle,
                            news.NewsContent,
                            NewsAuthor = user.UserName,
                            news.NewsDate,
                            news.NewsImage,
                            news.NewsLink,
                            news.NewsType
                        })
                    .OrderByDescending(n => n.NewsDate)
                    .Take(10)
                    .Select(x => (dynamic)x)
                    .ToList();

                return newsByType;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi khi hiển thị bài viết theo loại", ex);
            }
        }

        // Thêm mới tin tức
        public void AddNews(New newNews)
        {
            try
            {
                var news = new New
                {
                    NewsTitle = newNews.NewsTitle,
                    NewsContent = newNews.NewsContent,
                    NewsAuthor = newNews.NewsAuthor,
                    NewsDate = newNews.NewsDate,
                    NewsTypeID = newNews.NewsTypeID,
                    NewsImage = newNews.NewsImage,
                    NewsLink = newNews.NewsLink
                };

                data.News.InsertOnSubmit(news);
                data.SubmitChanges();
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi xảy ra khi thêm mới tin tức", ex);
            }
        }

        // Lấy tin theo id
        public dynamic GetNewsById(int id)
        {
            try
            {
                var newsWithAuthor = data.News
                    .Where(n => n.NewsID == id && !n.IsDeleted)
                    .Join(data.Users.Where(x => x.IsDeleted == false),
                        news => news.NewsAuthor,
                        user => user.UserID,
                        (news, user) => new
                        {
                            NewsID = news.NewsID,
                            NewsTitle = news.NewsTitle,
                            NewsContent = news.NewsContent,
                            NewsAuthor = user.UserName,
                            NewsDate = news.NewsDate,
                            NewsImage = news.NewsImage,
                            NewsLink = news.NewsLink
                        })
                    .FirstOrDefault();

                return newsWithAuthor;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi khi lấy thông tin bài viết", ex);
            }
        }

        //Search tin
        public List<New> SearchNews(string query)
        {
            return data.News
                .Where(n => n.NewsTitle.Contains(query) || n.NewsContent.Contains(query) && !n.IsDeleted)
                .OrderByDescending(n => n.NewsDate)
                .Take(10)
                .ToList();
        }

        // Xóa tin theo id
        public bool DeleteNews(int id)
        {
            try
            {
                var newsNewest = data.NewsNewests
                    .SingleOrDefault(nn => nn.NewsID == id);
                if (newsNewest != null)
                {
                    data.NewsNewests.DeleteOnSubmit(newsNewest);
                }

                var newsFeature = data.NewsFeatures.SingleOrDefault(nf => nf.NewsID == id);
                if (newsFeature != null)
                {
                    data.NewsFeatures.DeleteOnSubmit(newsFeature);
                }

                var newsToDelete = data.News.SingleOrDefault(n => n.NewsID == id);
                if (newsToDelete != null)
                {
                    // Set IsDeleted to true instead of deleting the record
                    newsToDelete.IsDeleted = true;
                }
                else
                {
                    return false;
                }

                data.SubmitChanges(ConflictMode.ContinueOnConflict);
                return true;
            }
            catch (Exception)
            {
                throw;
            }
        }

        // Cập nhật tin tức
        public void UpdateNews(New updatedNews)
        {
            var news = data.News.SingleOrDefault(n => n.NewsID == updatedNews.NewsID && !n.IsDeleted);
            if (news != null)
            {
                news.NewsTitle = updatedNews.NewsTitle;
                news.NewsContent = updatedNews.NewsContent;
                news.NewsImage = updatedNews.NewsImage;
                data.SubmitChanges();
            }
        }

        // Lấy toàn bộ tin tức
        public List<dynamic> GetAllNews()
        {
            try
            {
                var newestNews = data.News.Where(x => x.IsDeleted == false)
                    .Join(
                        data.Users,
                        news => news.NewsAuthor,
                        user => user.UserID,
                        (news, user) => new
                        {
                            news.NewsID,
                            news.NewsTitle,
                            news.NewsContent,
                            NewsAuthor = user.UserName,
                            news.NewsDate,
                            news.NewsImage,
                            news.NewsLink
                        })
                    .OrderByDescending(n => n.NewsDate)
                    .Select(x => (dynamic)x)
                    .ToList();

                return newestNews;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi khi hiển thị bài viết mới", ex);
            }
        }
        public List<dynamic> GetAllUserNews(int userID)
        {
            try
            {
                var newestNews = data.News.Where(x => x.IsDeleted == false)
                    .Join(
                        data.Users,
                        news => news.NewsAuthor,
                        user => user.UserID,
                        (news, user) => new
                        {
                            news.NewsID,
                            news.NewsTitle,
                            news.NewsContent,
                            NewsAuthor = user.UserName,
                            news.NewsDate,
                            news.NewsImage,
                            news.NewsLink,
                            UserID = user.UserID
                        })
                    .Where(n => n.UserID == userID)
                    .OrderByDescending(n => n.NewsDate)
                    .Select(x => (dynamic)x)
                    .ToList();
                return newestNews;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi khi hiển thị bài viết của người dùng", ex);
            }
        }
        public List<dynamic> GetUserNewsByType(int id, int userID)
        {
            try
            {
                var newsByType = data.News
                    .Where(nw => nw.NewsTypeID == id && !nw.IsDeleted)
                    .Join(
                        data.Users
                        .Where(n => n.UserID == userID),
                        news => news.NewsAuthor,
                        user => user.UserID,
                        (news, user) => new
                        {
                            news.NewsID,
                            news.NewsTitle,
                            news.NewsContent,
                            NewsAuthor = user.UserName,
                            news.NewsDate,
                            news.NewsImage,
                            news.NewsLink,
                            news.NewsType
                        })
                    .OrderByDescending(n => n.NewsDate)
                    .Take(10)
                    .Select(x => (dynamic)x)
                    .ToList();

                return newsByType;
            }
            catch (Exception ex)
            {
                throw new Exception("Có lỗi khi hiển thị bài viết theo loại", ex);
            }
        }
        public List<New> GetLatestNews(int count)
        {
            return data.NewsNewests.OrderBy(nn => nn.Order).Take(count)
                    .Join(data.News, nn => nn.NewsID, n => n.NewsID, (nn, n) => n)
                    .ToList();
        }
        public List<New> GetFeaturedNews(int count)
        {
            return data.NewsFeatures.OrderBy(nf => nf.Order).Take(count)
                    .Join(data.News, nf => nf.NewsID, n => n.NewsID, (nf, n) => n)
                    .ToList();
        }
        public void SetNewsFeature(int id, bool check)
        {
            var existingNewsFeature = data.NewsFeatures.FirstOrDefault(nf => nf.NewsID == id);
            if (check)
            {
                if (existingNewsFeature == null)
                {
                    var newNewsFeature = new NewsFeature
                    {
                        NewsID = id,
                        Order = 1
                    };
                    data.NewsFeatures.InsertOnSubmit(newNewsFeature);
                }
            }
            else
            {
                if (existingNewsFeature != null)
                {
                    data.NewsFeatures.DeleteOnSubmit(existingNewsFeature);
                }
            }
            data.SubmitChanges();
        }
        public bool IsNewsFeature(int newsId)
        {
            return data.NewsFeatures.Any(nf => nf.NewsID == newsId);
        }
        public void SetNewsNewest(int id, bool check)
        {
            var existingNewsNewest = data.NewsNewests.FirstOrDefault(nf => nf.NewsID == id);
            if (check)
            {
                if (existingNewsNewest == null)
                {
                    var newNewsNewest = new NewsNewest
                    {
                        NewsID = id,
                        Order = 1
                    };
                    data.NewsNewests.InsertOnSubmit(newNewsNewest);
                }
            }
            else
            {
                if (existingNewsNewest != null)
                {
                    data.NewsNewests.DeleteOnSubmit(existingNewsNewest);
                }
            }
            data.SubmitChanges();
        }
        public bool IsNewsNewest(int newsId)
        {
            return data.NewsNewests.Any(nf => nf.NewsID == newsId);
        }
    }
}