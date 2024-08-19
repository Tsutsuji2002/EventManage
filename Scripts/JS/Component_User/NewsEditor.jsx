const IconHint = '../../../Resources/images/nav-icon.png';
const PlaceImage = '../../../Resources/images/PlayHolder.png';
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
};
function UserAddNews() {
    const [AddNewsHint, setAddNewsHint] = React.useState(false);
    const [catelogs, setCatelogs] = React.useState([]);
    const [selectedCatelog, setSelectedCatelog] = React.useState('');
    const [content, setContent] = React.useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [newsTitle, setNewsTitle] = React.useState('');
    const editorRef = React.useRef(null);
    const fileInputRef = React.useRef(null);
    const [editorInstance, setEditorInstance] = React.useState(null);

    React.useEffect(() => {
        if (editorRef.current) {
            const editor = new FroalaEditor(editorRef.current, {
                events: {
                    'initialized': function () {
                        setEditorInstance(this);
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
    }, []);

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

    React.useEffect(() => {
        axios.get('/Home/NewsTypeAccess')
            .then(response => {
                setCatelogs(response.data);
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

    const handleSubmit = () => {
        const formData = new FormData();
        formData.append('NewsTitle', newsTitle);
        formData.append('NewsContent', content);
        formData.append('NewsTypeID', selectedCatelog);
        if (selectedImage) {
            formData.append('NewsImage', selectedImage);
        }

        axios.post('/News/AddNews', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then(response => {
                if (response.data.success) {
                    //Refresh
                    alert('Thêm tin tức thành công!');
                    setSelectedImage(null);
                    setSelectedCatelog('');
                    setNewsTitle('');
                    if (editorInstance) {
                        editorInstance.html.set('');
                        setContent('');
                    }

                    if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                    }
                } else {
                    alert('Thêm tin tức không thành công: ' + response.data.errors.join(', '));
                }
            })
            .catch(error => {
                console.error('Error adding news:', error);
                alert('An error occurred while adding news.');
            });
    };

    return (
        <div className='main-NewsAdd-container'>
            <div className='NewsAdd-aside' style={{ display: AddNewsHint ? 'none' : 'block' }}>
                <UserAside />
            </div>
            <div className='NewsAdd-container'>
                <div className='NewsAdd-create-blog'>
                    <img
                        className="NewsAdd-picHint"
                        src={IconHint}
                        alt="my hint picture"
                        onClick={() => setAddNewsHint(!AddNewsHint)}
                    />
                    <div className='NewsAdd-NewsImage'>
                        <img id="preview-image" src={selectedImage || PlaceImage} alt="Selected" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                        <input
                            className='selectFileNews'
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                    </div>
                    <div className='NewsAdd-NewsName'>
                        <p>Tên tin tức: </p>
                        <input
                            type='text'
                            placeholder='Tên tin tức'
                            value={newsTitle}
                            onChange={(e) => setNewsTitle(e.target.value)}
                        />
                    </div>
                    <div className='NewsAdd-NewsName'>
                        <p>Danh mục: </p>
                        <select
                            className='NewsAdd-Catalog-input'
                            value={selectedCatelog}
                            onChange={(e) => setSelectedCatelog(e.target.value)}
                            required
                        >
                            <option value="">Chọn danh mục</option>
                            {catelogs.map((Catelog) => (
                                <option key={Catelog.NewsTypeID} value={Catelog.NewsTypeID}>
                                    {Catelog.NewsTypeName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className='NewsAdd-editor'>
                        <p>Nội dung:</p>
                        <div className="froala-editor-container" ref={editorRef}></div>
                    </div>
                    <div className='NewsAdd-btn-post'>
                        <button onClick={handleSubmit}>Đăng bài</button>
                    </div>
                </div>

            </div>
        </div>

    );
}
document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('user-content');
    if (contentElement) {
        ReactDOM.render(<UserAddNews />, contentElement);
    }
});