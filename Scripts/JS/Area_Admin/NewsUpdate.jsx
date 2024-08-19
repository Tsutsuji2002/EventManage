const NewsHidden = '../../Resources/images/nav-icon.png';
const NewsImage = '../../Resources/images/PlayHolder.png';

function UpdateNews() {
    const [EditorHint, setEditorHint] = React.useState(false);
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
        }

        axios.post('/Admin/ADNews/UpdateNews', formData, {
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
        <div className="Up-main-panel">
            <div className='Up-body-nav-container'>
                <div>
                    <img
                        className="Up-picHidden"
                        src={NewsHidden}
                        alt="my pic"
                        onClick={() => setEditorHint(!EditorHint)}
                    />
                </div>
            </div>
            <div className="Up-container-admin-table">
                <div className="Up-page-inner">
                    <div className='Up-create-blog'>
                        <div className='Up-NewsImage'>
                            <div>
                                <img id="preview-image" src={selectedImage || NewsImage} alt="Selected" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                        </div>
                        <div className='Up-NewsName'>
                            <p>Tên tin tức:</p>
                            <input
                                type='text'
                                placeholder='Tên tin tức'
                                value={newsTitle || ''}
                                onChange={(e) => setNewsTitle(e.target.value)}
                            />
                        </div>
                        <div className='Up-NewsName'>
                            <div className='Up-catalog'>
                                <p>Danh mục</p>
                            </div>
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
                        <div className='Up-editor'>
                            <p>Nội dung:</p>
                            <div className="froala-editor-container" ref={editorRef}></div>
                        </div>
                        <div className='Up-btn-post'>
                            <button onClick={handleSubmit}>Cập nhật</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('main-panel');
    if (contentElement) {
        ReactDOM.render(<UpdateNews />, contentElement);
    }
});