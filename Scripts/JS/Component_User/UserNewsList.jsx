const UserIcon = '../../../Resources/images/nav-icon.png';
const ImageHold = '../../../Resources/images/PlayHolder.png'

function UserAside() {
    const [openDropdown, setOpenDropdown] = React.useState(null);

    const toggleDropdown = (index) => {
        if (openDropdown === index) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(index);
        }
    };

    const options = [
        {
            name: 'Thông tin',
            items: [
                { name: 'Thông tin cá nhân', href: '#' },
                { name: 'Sửa thông tin', href: '#' }
            ]
        },
        {
            name: 'Danh sách tạo',
            items: [
                { name: 'Tin Tức', href: '#' },
                { name: 'Hội nghị', href: '#' },
                { name: 'Hội thảo', href: '#' },
                { name: 'Hội thi', href: '#' }
            ]
        },
        {
            name: 'Danh sách đăng kí',
            items: [
                { name: 'Hội nghị', href: '#' },
                { name: 'Hội thảo', href: '#' },
                { name: 'Hội thi', href: '#' }
            ]
        },
    ];

    return (
        <div className="user-sidebar-content" id="userhome">
            <a href="/user-home">User Home</a>
            <div style={{ border: "1px solid", opacity: "0.5" }}></div>
            <div className='option-user'>
                {options.map((option, index) => (
                    <div key={index}>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown(index);
                        }}>
                            {option.name}
                        </a>
                        {openDropdown === index && (
                            <ul>
                                {option.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <a href={item.href}>{item.name}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
function NewsCollection() {
    const [UserHint, setUserHint] = React.useState(false);
    const [newsTypes, setNewsTypes] = React.useState([]);
    const [selectedType, setSelectedType] = React.useState('');
    const [userNews, setUserNews] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    React.useEffect(() => {
        fetchNewsTypes();
        fetchUserNews();
    }, []);

    const fetchNewsTypes = async () => {
        try {
            const response = await fetch('/Home/NewsTypeAccess');
            const data = await response.json();
            setNewsTypes(data);
        } catch (error) {
            console.error('Error fetching news types:', error);
        }
    };

    const fetchUserNews = async (typeId = null) => {
        try {
            const url = typeId ? `/User/GetUserNewsByType?id=${typeId}` : '/User/GetUserNews';
            const response = await fetch(url);
            const data = await response.json();
            if (data.success === false) {
                alert(data.message);
            } else {
                setUserNews(data);
            }
        } catch (error) {
            console.error('Error fetching user news:', error);
        }
    };

    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        setSelectedType(typeId);
        fetchUserNews(typeId === '' ? null : typeId);
        setCurrentPage(1); // Reset to the first page when type changes
    };

    const handleDeleteNews = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tin này không?')) {
            try {
                const response = await fetch('/User/DeleteNews', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id }),
                });
                const data = await response.json();
                if (data.success) {
                    alert(data.message);
                    fetchUserNews(selectedType === '' ? null : selectedType);
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Error deleting news:', error);
                alert('Có lỗi xảy ra khi xóa tin.');
            }
        }
    };

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

    const handleAddNews = () => {
        window.location.href = `/User/NewsEditor`;
    };

    const handleEditNews = (newsId) => {
        window.location.href = `/User/NewsUpdate/${newsId}`;
    };

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = userNews.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    return (
        <div className='Collect-user-container'>
            <div className='Collect-aside' style={{ display: UserHint ? 'none' : 'block' }}>
                <UserAside />
            </div>
            <div className='Collect-container'>
                <div className='Collect-create-blog'>
                    <div className='Collect-shower-container'>
                        <img
                            className="Collect-picHint"
                            src={UserIcon}
                            alt="my hint picture"
                            onClick={() => setUserHint(!UserHint)}
                        />
                        <div className="Evt">
                            <select
                                className='Collect-input-layout'
                                value={selectedType}
                                onChange={handleTypeChange}
                                required
                            >
                                <option value="">Tất cả</option>
                                {newsTypes.map((type) => (
                                    <option key={type.NewsTypeID} value={type.NewsTypeID}>
                                        {type.NewsTypeName}
                                    </option>
                                ))}
                            </select>
                            <span onClick={() => handleAddNews()}>Thêm tin</span>
                        </div>
                    </div>
                    <div className='Collect-container'>
                        <div className='Collect-contact-container'>
                            <table>
                                <thead>

                                    <tr>
                                        <th><span>Thông tin</span></th>
                                        <th><span>Thao tác</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((news) => (
                                        <tr key={news.NewsID}>
                                            <td>
                                                <div className='Collect-Edit-item'>
                                                    <img src={news.NewsImage || ImageHold} alt='Hình' className='Collect-image' />
                                                    <div className='Collect-info-container'>
                                                        <div className='Collect-title-Collect'>
                                                            <p>{news.NewsTitle}</p>
                                                        </div>
                                                        <div className='Collect-Description'>
                                                            <p dangerouslySetInnerHTML={{ __html: decodeHtml(news.NewsContent) }}></p>
                                                        </div>
                                                        <div className='info-Collect'>
                                                            <span>Người đăng: {news.NewsAuthor}</span>
                                                            <span>Ngày Đăng: {formatDate(news.NewsDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='Collect-button'>
                                                    <span style={{ backgroundColor: "red", color: "white" }} onClick={() => handleDeleteNews(news.NewsID)}>Xóa</span>
                                                    <span style={{ backgroundColor: "green", color: "white" }} onClick={() => handleEditNews(news.NewsID)}>sửa</span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {userNews.length > itemsPerPage && (
                        <div className='pagination'>
                            <div>
                                <button
                                    className='PagesButton'
                                    onClick={() => paginate(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Pre
                                </button>
                                <div className='pagesNum'>
                                    {[...Array(Math.ceil(userNews.length / itemsPerPage))].map((_, i) => (
                                        <a key={i} onClick={() => paginate(i + 1)} style={{ cursor: 'pointer' }}>
                                            {i + 1}
                                        </a>
                                    ))}
                                </div>
                                <button
                                    className='PagesButton'
                                    onClick={() => paginate(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(userNews.length / itemsPerPage)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const userElement = document.getElementById('user-content');
    if (userElement) {
        ReactDOM.render(<NewsCollection />, userElement);
    }
});