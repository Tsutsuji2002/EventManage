const IconHidden = '../../Resources/images/nav-icon.png';
const ImageNew = '../../Resources/images/PlayHolder.png';

function ConfirmModel({ show, message, onConfirm, onCancel }) {
    if (!show) return null;

    return (
        <div className="confirm-model">
            <div className="confirm-model-content">
                <p>{message}</p>
                <div className="confirm-model-buttons">
                    <button onClick={onConfirm} id='btn-model-confirm'>Xác nhận</button>
                    <button onClick={onCancel} id='btn-model-turnoff'>Hủy</button>
                </div>
            </div>
        </div>
    );
}

function CategoryModel({ show, onClose, categories = [], onAdd, onEdit, onDelete }) {
    const [newCategory, setNewCategory] = React.useState('');
    const [ediCateId, setEdiCateId] = React.useState(null);
    const [searchList, setSearchList] = React.useState('');
    const [filteredCategories, setFilteredCategories] = React.useState([]);
    const [showModel, setShowModel] = React.useState(false);
    const [deleteCateId, setDeleteCateId] = React.useState(null);

    React.useEffect(() => {
        const filtered = Array.isArray(categories)
            ? categories.filter(category =>
                category?.NewsTypeName?.toLowerCase().includes(searchList?.toLowerCase() ?? '')
            )
            : [];

        setFilteredCategories(filtered);
    }, [categories, searchList]);

    if (!show) return null;

    const handleSubmit = () => {
        if (newCategory.trim() !== '') {
            if (ediCateId !== null) {
                onEdit(ediCateId, newCategory);
                setEdiCateId(null);
            } else {
                onAdd(newCategory);
            }
            setNewCategory('');
        }
    };

    const startEditing = (category) => {
        setEdiCateId(category.NewsTypeID);
        setNewCategory(category.NewsTypeName);
    };

    const confirmDelete = (id) => {
        setDeleteCateId(id);
        setShowModel(true);
    };

    const handleConfirmDelete = () => {
        onDelete(deleteCateId);
        setShowModel(false);
    };

    return (
        <div className="model-category">
            <div className="model-category-content">
                <h2>Quản lý Danh mục</h2>
                <div className="category-input">
                    <input
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        placeholder={ediCateId !== null ? "Sửa danh mục" : "Nhập danh mục mới"}
                    />
                    <button onClick={handleSubmit} className='model-category-add'>
                        {ediCateId !== null ? 'Cập nhật' : 'Thêm'}
                    </button>
                </div>
                <div className="search-input">
                    <text>Tìm kiếm </text>
                    <input
                        type="text"
                        value={searchList}
                        onChange={(e) => setSearchList(e.target.value)}
                        placeholder="Tìm kiếm danh mục"
                    />
                </div>
                <ul className="category-list">
                    {filteredCategories
                        .filter(category => category.NewsTypeID !== 1)
                        .map(category => (
                            <li key={category.NewsTypeID}>
                                {category.NewsTypeName}
                                <div>
                                    <button
                                        onClick={() => startEditing(category)}
                                        className='model-category-fix'
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => confirmDelete(category.NewsTypeID)}
                                        className='model-category-delete'
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </li>
                        ))
                    }
                </ul>
                <button className="close-button" onClick={onClose}>Đóng</button>
            </div>
            <ConfirmModel
                show={showModel}
                message="Bạn có chắc chắn muốn xóa?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowModel(false)}
            />
        </div>
    );
}

function AdminNews() {
    const [EditorHint, setEditorHint] = React.useState(false);
    const [news, setNews] = React.useState([]);
    const [showCateModel, setShowCateModel] = React.useState(false);
    const [Categories, setCategories] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;
    const [TypesList, setTypesList] = React.useState([]);
    const [selectTypesList, setSelectTypesList] = React.useState('');

    // Add Category
    const handleAddCategory = (newCategory) => {
        axios.post('/News/AddNewsType', { NewsTypeName: newCategory })
            .then(response => {
                setCategories([...Categories, response.data]);
            })
            .catch(error => {
                console.error('Error adding category:', error);
            });
    };

    // Edit Category
    const handleEditCategory = (id, newName) => {
        axios.put(`/News/UpdateNewsType/${id}`, { name: newName })
            .then(response => {
                setCategories(Categories.map(category =>
                    category.NewsTypeID === id ? response.data : category
                ));
            })
            .catch(error => {
                console.error('Error editing category:', error);
            });
    };

    // Delete Category
    const handleDeleteCategory = (id) => {
        axios.delete(`/News/DeleteNewsType/${id}`)
            .then(response => {
                setCategories(Categories.filter(category => category.NewsTypeID !== id));
            })
            .catch(error => {
                console.error('Error deleting category:', error);
            });
    };

    const deleteNews = (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa tin?')) {
            fetch('/Admin/ADNews/DeleteNews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert(data.message);
                        fetchNews();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error deleting news:', error));
        }
    };


    React.useEffect(() => {
        axios.get('/Home/NewsTypeAccess')
            .then(response => {
                setCategories(response.data);
                setTypesList(response.data);
                fetchNewsByType(1);
            })
            .catch(error => {
                if (error.response) {
                    console.error('Server responded with:', error.response.status, error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up request:', error.message);
                }
            });
    }, []);

    const fetchNews = async () => {
        try {
            const response = await fetch('/Admin/ADNews/GetNewsList');
            const data = await response.json();
            const newsWithStatus = await Promise.all(data.map(async (item) => {
                const isFeatured = await checkFeatureStatus(item.NewsID);
                const isNewest = await checkNewestStatus(item.NewsID);
                return { ...item, isFeatured, isNewest };
            }));
            setNews(newsWithStatus);
        } catch (error) {
            console.error('Error fetching news:', error);
        }
    };

    const checkFeatureStatus = async (id) => {
        try {
            const response = await axios.get(`/Admin/ADNews/IsNewsFeature?newsId=${id}`);
            return response.data.isFeatured;
        } catch (error) {
            console.error('Error checking feature status:', error);
            return false;
        }
    };

    const checkNewestStatus = async (id) => {
        try {
            const response = await axios.get(`/Admin/ADNews/IsNewsNewest?newsId=${id}`);
            return response.data.isFeatured; // Note: The backend uses 'isFeatured' for both
        } catch (error) {
            console.error('Error checking newest status:', error);
            return false;
        }
    };
    const handleNewsTypeChange = (e) => {
        const selectedTypeId = parseInt(e.target.value);
        setSelectTypesList(selectedTypeId);
        fetchNewsByType(selectedTypeId);
    };
    const fetchNewsByType = async (typeId) => {
        try {
            const response = await fetch(`/News/GetNewsByType?id=${typeId}`);
            const data = await response.json();
            const newsWithStatus = await Promise.all(data.news.map(async (item) => {
                const isFeatured = await checkFeatureStatus(item.NewsID);
                const isNewest = await checkNewestStatus(item.NewsID);
                return { ...item, isFeatured, isNewest };
            }));
            setNews(newsWithStatus);
        } catch (error) {
            console.error('Error fetching news by type:', error);
        }
    };

    const handleSetFeature = async (id, isChecked) => {
        try {
            const response = await axios.post('/Admin/ADNews/SetNewsFeature', { id, check: isChecked });
            if (response.data.success) {
                await fetchNews();
            } else {
                console.error('Failed to set feature:', response.data.message);
            }
        } catch (error) {
            console.error('Error setting feature:', error);
        }
    };

    const handleSetNewest = async (id, isChecked) => {
        try {
            const response = await axios.post('/Admin/ADNews/SetNewsNewest', { id, check: isChecked });
            if (response.data.success) {
                await fetchNews();
            } else {
                console.error('Failed to set newest:', response.data.message);
            }
        } catch (error) {
            console.error('Error setting newest:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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

    if (!news) return <div>Đang tải...</div>;

    return (
        <div className="Admin-main-panel">
            <div className='Admin-body-nav-container'>
                <div className='Admin-container-admin-form'>
                    <div className='Admin-form'>
                        <input type='text' placeholder='Tìm kiếm .....' className='Admin-input' />
                        <button className='Admin-admin-submit'>Tìm kiếm</button>
                    </div>
                </div>
            </div>
            <div className="Admin-container-admin-table">
                <div className="Admin-news-inner">
                    <table>
                        <thead>
                            <tr>
                                <th colSpan='4'>
                                    <div className='News-header-table'>
                                        <div className="Event-Header">
                                            <button className='Event-AddCate' onClick={() => setShowCateModel(true)}>Danh mục</button>
                                            <button className='Event-AddNews'>Thêm tin</button>
                                        </div>
                                        <select
                                            className='News-input-layout'
                                            value={selectTypesList}
                                            onChange={handleNewsTypeChange}
                                            required
                                        >
                                            {TypesList.map((Type) => (
                                                <option key={Type.NewsTypeID} value={Type.NewsTypeID}>
                                                    {Type.NewsTypeName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </th>
                            </tr>
                            <tr>
                                <th>Thông tin</th>
                                <th>Thao tác</th>
                                <th>Mới nhất</th>
                                <th>Nổi bật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(item => (
                                <tr key={item.NewsID}>
                                    <td>
                                        <div className='Admin-news-item'>
                                            <img src={item.NewsImage ? item.NewsImage : ImageNew} alt='Hình' className='news-image' />
                                            <div className='news-info-container'>
                                                <div className='info-title-news'>
                                                    <span className='news-title'>{item.NewsTitle}</span>
                                                </div>
                                                <div className="info-description">
                                                    <p>{item.NewsContent}</p>
                                                </div>
                                                <div className='info-news'>
                                                    <span>Người đăng: {item.NewsAuthor}</span>
                                                    <span>Ngày Đăng: {formatDate(item.NewsDate)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <div className='news-button'>
                                            <span className= 'List-button-delete' onClick={() => deleteNews(item.NewsID)}>
                                                Xóa
                                            </span>
                                            <span className='List-button-fix'>Sửa</span>
                                        </div>
                                    </td>
                                    <td>
                                        <input
                                            className='newest'
                                            id={`newest-${item.NewsID}`}
                                            type='checkbox'
                                            checked={item.isNewest || false}
                                            onChange={(e) => handleSetNewest(item.NewsID, e.target.checked)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            className='features'
                                            id={`feature-${item.NewsID}`}
                                            type='checkbox'
                                            checked={item.isFeatured || false}
                                            onChange={(e) => handleSetFeature(item.NewsID, e.target.checked)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {news.length > itemsPerPage && (
                        <div className='pagination'>
                            
                            <button
                                className='PagesButton'
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Pre
                            </button>
                            <div className='pagesNum'>
                                {[...Array(Math.ceil(news.length / itemsPerPage))].map((_, i) => (
                                    <a key={i} onClick={() => paginate(i + 1)} style={{ cursor: 'pointer' }}>
                                        {i + 1}
                                    </a>
                                ))}
                            </div>
                            <button
                                className='PagesButton'
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(news.length / itemsPerPage)}
                            >
                                Next
                            </button>
                            
                        </div>
                    )}
                </div>
                <CategoryModel
                    show={showCateModel}
                    onClose={() => setShowCateModel(false)}
                    categories={Categories}
                    onAdd={handleAddCategory}
                    onEdit={handleEditCategory}
                    onDelete={handleDeleteCategory}
                />

            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('main-panel');
    if (contentElement) {
        ReactDOM.render(<AdminNews />, contentElement);
    }
});
