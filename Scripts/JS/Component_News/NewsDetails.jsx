const Pic = '../../Resources/images/PlayHolder.png';

const formatDate = (dateString) => {
    if (!dateString) return '';
    const timestamp = parseInt(dateString.replace(/\/Date\((\d+)\)\//, '$1'));
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
};

function fetchUserData() {
    return fetch('/User/UserData', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include'
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.redirectToUrl) {
                window.location.href = data.redirectToUrl;
                return null;
            }
            return data.user;
        })
        .catch(error => {
            console.error('Error fetching user data:', error);
            return null;
        });
}

function structureComments(comments) {
    const commentMap = {};
    const rootComments = [];

    comments.forEach(comment => {
        commentMap[comment.CommentID] = { ...comment, Replies: [] };
    });

    comments.forEach(comment => {
        if (comment.ParentsCommentID) {
            const parentComment = commentMap[comment.ParentsCommentID];
            if (parentComment) {
                parentComment.Replies.push(commentMap[comment.CommentID]);
            } else {
                rootComments.push(commentMap[comment.CommentID]);
            }
        } else {
            rootComments.push(commentMap[comment.CommentID]);
        }
    });

    return rootComments;
}

function Comments({ newsId }) {
    const [comments, setComments] = React.useState([]);
    const [newComment, setNewComment] = React.useState('');
    const [currentUser, setCurrentUser] = React.useState(null);

    const fetchComments = React.useCallback(() => {
        fetch(`/Comment/GetComments?newsId=${newsId}`)
            .then(response => response.json())
            .then(data => setComments(structureComments(data)))
            .catch(error => console.error('Error fetching comments:', error));
    }, [newsId]);

    React.useEffect(() => {
        fetchComments();
        fetchUserData().then(userData => {
            if (userData) {
                setCurrentUser(userData);
            }
        });
    }, [newsId, fetchComments]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newComment.trim() !== '' && currentUser) {
            const newCommentObj = {
                NewsID: newsId,
                Content: newComment,
                UserID: currentUser.userID,
                UserName: currentUser.userName, // Include UserName
                ParentsCommentID: null,
                CommentLikes: 0,
                CreateDate: new Date(),
                IsDeleted: false
            };

            fetch('/Comment/AddComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newCommentObj),
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        fetchComments(); // Fetch all comments again to ensure consistency
                        setNewComment('');
                    } else {
                        console.error('Error adding comment:', data.errors);
                    }
                })
                .catch(error => console.error('Error adding comment:', error));
        }
    };

    const handleReply = (commentId, replyText, repliedUserId) => {
        fetch('/Comment/ReplyToComment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                NewsID: newsId,
                Content: replyText,
                UserID: currentUser.userID,
                UserName: currentUser.userName,
                ParentsCommentID: commentId,
                RepliedToUserID: repliedUserId,
                CommentLikes: 0,
                CreateDate: new Date().toISOString(),
                IsDeleted: false
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    fetchComments();
                } else {
                    console.error('Error adding reply:', data.errors);
                }
            })
            .catch(error => console.error('Error adding reply:', error));
    };

    const handleLike = (commentId) => {
        fetch('/Comment/ToggleLike', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ commentId: commentId }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setComments(prevComments => {
                        const updateLikes = (comments) => {
                            return comments.map(c => {
                                if (c.CommentID === commentId) {
                                    return { ...c, CommentLikes: data.likes, IsLikedByCurrentUser: data.isLiked };
                                }
                                if (c.Replies) {
                                    return { ...c, Replies: updateLikes(c.Replies) };
                                }
                                return c;
                            });
                        };
                        return updateLikes(prevComments);
                    });
                } else {
                    console.error('Error toggling like:', data.message);
                }
            })
            .catch(error => console.error('Error toggling like:', error));
    };

    return (
        <div className="comments-section">
            <h3>Bình luận</h3>
            {currentUser ? (
                <form onSubmit={handleSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Viết bình luận của bạn..."
                        className='Comment-area'
                    />
                    <button type="submit">Gửi</button>
                </form>
            ) : (
                <p>Vui lòng đăng nhập để bình luận.</p>
            )}
            <div className="comments-list">
                {comments.map((comment) => (
                    <Comment
                        key={comment.CommentID}
                        comment={comment}
                        onReply={handleReply}
                        onLike={handleLike}
                        currentUser={currentUser}
                        level={0}
                    />
                ))}
            </div>
        </div>
    );
}

function Comment({ comment, onReply, onLike, currentUser, level }) {
    const [replyText, setReplyText] = React.useState('');
    const [showReplyForm, setShowReplyForm] = React.useState(false);
    const [showReplies, setShowReplies] = React.useState(false);

    const handleReplySubmit = (e) => {
        e.preventDefault();
        if (replyText.trim() !== '') {
            onReply(comment.CommentID, replyText, comment.UserID);
            setReplyText('');
            setShowReplyForm(false);
        }
    };

    return (
        <div className={`comment level-${level}`}>
            <div className='Card-comment'>
                <div className="comment-header">
                    <div>
                        <img src={comment.UserAvatar || Pic} alt={comment.UserName} className="avatar" />
                        <span className="author">{comment.UserName}</span>
                    </div>
                    <span className="date">Bình luận lúc {formatDate(comment.CreateDate)}</span>
                </div>
                <p>{comment.Content}</p>
                <div className="comment-actions">
                    <span onClick={() => onLike(comment.CommentID)} className={`like-action ${comment.IsLikedByCurrentUser ? 'liked' : ''}`}>
                        <i className={`fas fa-thumbs-up ${comment.IsLikedByCurrentUser ? 'liked' : ''}`}></i> {comment.CommentLikes}
                    </span>
                    {currentUser && (
                        <span onClick={() => setShowReplyForm(!showReplyForm)} className="reply-action">
                            Trả lời
                        </span>
                    )}
                    {comment.Replies && comment.Replies.length > 0 && (
                        <span onClick={() => setShowReplies(!showReplies)} className="show-replies-action">
                            {showReplies ? 'Ẩn trả lời' : 'Hiện trả lời'}
                        </span>
                    )}
                </div>
            </div>
            {showReplyForm && (
                <form onSubmit={handleReplySubmit}>
                    <textarea
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Viết trả lời của bạn..."
                        className='Comment-area'
                    />
                    <button type="submit">Gửi trả lời</button>
                </form>
            )}
            {showReplies && comment.Replies && comment.Replies.length > 0 && (
                <div className="replies">
                    {comment.Replies.map((reply) => (
                        <Comment
                            key={reply.CommentID}
                            comment={reply}
                            onReply={onReply}
                            onLike={onLike}
                            currentUser={currentUser}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function NewsDetail() {
    const [news, setNews] = React.useState(null);
    const newsId = document.getElementById('content').getAttribute('data-news-id');

    React.useEffect(() => {
        fetch(`/News/NewsDetailsData/${newsId}`)
            .then(response => response.json())
            .then(data => setNews(data.news))
            .catch(error => console.error('Error fetching news:', error));
    }, [newsId]);

    const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    if (!news) return <div>Đang tải...</div>;

    return (
        <div className="content">
            <div className='content-right'>
                <p>{formatDate(news.NewsDate)}</p>
            </div>
            <div className='content-left'>
                <p>{news.NewsType}</p>
            </div>
            <div className='content-title'>
                <p className='NewsDetails_Text'>{news.NewsTitle}</p>
            </div>
            <div className='content-detail'>
                <img className='Pic_item' src={news.NewsImage ? news.NewsImage : Pic} alt="News Image" />
                <p className='NewsDetails_Text' dangerouslySetInnerHTML={{ __html: decodeHtml(news.NewsContent) }}></p>
            </div>
            {newsId && <Comments newsId={newsId} />}
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const detailsElement = document.getElementById('content');
    if (detailsElement) {
        ReactDOM.render(<NewsDetail />, detailsElement);
    }
});