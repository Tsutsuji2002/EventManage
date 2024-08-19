const IconHint = '../../Resources/images/nav-icon.png';
const PlaceImage = '../../Resources/images/PlayHolder.png';
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
function UserUpdateNews() {
    const [catalogs, setCatalogs] = React.useState([]);
    const [selectedCatalog, setSelectedCatalog] = React.useState('');
    const [newsTitle, setNewsTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);
    const editorRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const [editorInstance, setEditorInstance] = React.useState(null);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [newsId, setNewsId] = React.useState(null);
    const [UpNewsHint, setUpNewsHint] = React.useState(false);

    React.useEffect(() => {
        const id = window.newsId;
        setNewsId(id);

        if (id) {
            axios.get(`/News/NewsDetailsData?id=${id}`)
                .then(response => {
                    const newsData = response.data.news;
                    setNewsTitle(newsData.NewsTitle || '');
                    setSelectedCatalog(newsData.NewsTypeID || '');
                    setContent(newsData.NewsContent || '');
                    setSelectedImage(newsData.NewsImage || null);
                })
                .catch(error => {
                    console.error('Error fetching news data:', error);
                    setNewsTitle('');
                    setSelectedCatalog('');
                    setContent('');
                    setSelectedImage(null);
                });
        }
        axios.get('/Home/NewsTypeAccess')
            .then(response => {
                setCatalogs(response.data || []);
            })
            .catch(error => console.error('Error fetching catalogs:', error));
    }, []);


    React.useEffect(() => {
        if (editorRef.current) {
            const editor = new FroalaEditor(editorRef.current, {
                events: {
                    'initialized': function () {
                        setEditorInstance(this);
                        this.html.set(content || '');
                    },
                    'contentChanged': function () {
                        setContent(this.html.get());
                    }
                }
            });

            return () => {
                if (editor) {
                    editor.destroy();
                }
            };
        }
    }, [content]);

    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = (e) => {
                document.getElementById('preview-image').src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('NewsID', newsId);
        formData.append('NewsTitle', newsTitle);
        formData.append('NewsContent', content);
        formData.append('NewsTypeID', selectedCatalog);
        if (selectedImage instanceof File) {
            formData.append('NewsImage', selectedImage);
        } else {
            formData.append('NewsImage', selectedImage);
        }

        axios.post('/News/UpdateNews', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                if (response.data.success) {
                    alert('Cập nhật tin tức thành công!');
                } else {
                    alert('Cập nhật tin tức không thành công: ' + response.data.errors.join(', '));
                }
            })
            .catch(error => {
                console.error('Error updating news:', error);
                alert('An error occurred while updating news.');
            });
    };

    return (
        <div className='main-NewsUp-container'>
            <div className='NewsUp-aside' style={{ display: UpNewsHint ? 'none' : 'block' }}>
                <UserAside />
            </div>
            <div className='NewsUp-container'>
                <div className='NewsUp-create-blog'>
                    <img
                        className="NewsUp-picHint"
                        src={IconHint}
                        alt="my hint picture"
                        onClick={() => setUpNewsHint(!UpNewsHint)}
                    />
                    <div className='NewsUp-NewsImage'>
                        <div >
                            <div>
                                <img id="preview-image" src={selectedImage || PlaceImage} alt="Selected" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                    </div>
                    <div className='NewsUp-NewsName'>
                        <p>Tên tin tức:</p>
                        <input
                            type='text'
                            placeholder='Tên tin tức'
                            value={newsTitle || ''}
                            onChange={(e) => setNewsTitle(e.target.value)}
                        />
                    </div>
                    <div className='NewsUp-NewsName'>
                        <select
                            className='Up-Catalog-input'
                            value={selectedCatalog}
                            onChange={(e) => setSelectedCatalog(e.target.value)}
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {catalogs.map((Catalog) => (
                                <option key={Catalog.NewsTypeID} value={Catalog.NewsTypeID}>
                                    {Catalog.NewsTypeName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='NewsUp-editor'>
                        <p>Nội dung:</p>
                        <div className="froala-editor-container" ref={editorRef}></div>
                    </div>
                    <div className='NewsUp-btn-post'>
                        <button onClick={handleSubmit}>Cập nhật</button>
                    </div>
                </div>
            </div>
        </div>

    );
}
document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('user-content');
    if (contentElement) {
        ReactDOM.render(<UserUpdateNews />, contentElement);
    }
});