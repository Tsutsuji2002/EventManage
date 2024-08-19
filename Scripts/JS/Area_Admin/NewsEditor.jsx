const NewsHidden = '../../Resources/images/nav-icon.png';
const NewsImage = '../../Resources/images/PlayHolder.png';

function AdminAddNews() {
    const [EditorHint, setEditorHint] = React.useState(false);
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

        axios.post('/Admin/ADNews/AddNews', formData, {
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
        <div class="Admin-main-panel">
            <div className='Admin-body-nav-container'>
                <div>
                    <img
                        className="Admin-picHidden"
                        src={NewsHidden}
                        alt="my pic"
                        onClick={() => setEditorHint(!EditorHint)}
                    />
                </div>
            </div>
            <div class="Admin-container-admin-table">
                <div class="Admin-page-inner">
                    <div className='Admin-create-blog'>
                        <div className='Admin-NewsImage'>
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
                        <div className='Admin-NewsName'>
                            <p>Tên tin tức:</p>
                            <input
                                type='text'
                                placeholder='Tên tin tức'
                                value={newsTitle}
                                onChange={(e) => setNewsTitle(e.target.value)}
                            />
                        </div>
                        <div className='Admin-NewsName'>
                            {/*<div class="Add-catelog">*/}
                            {/*    <p>Danh mục</p>*/}
                            {/*    <i className="fas fa-plus-circle" style={{ color: 'red', fontSize: '25px' }}></i>*/}

                            {/*</div>*/}
                            <div className='Admin-NewsName'>
                                <select
                                    className='Catelog-input'
                                    value={selectedCatelog}
                                    onChange={(e) => setSelectedCatelog(e.target.value)}
                                >
                                    <option value="">Chọn danh mục</option>
                                    {catelogs.map((Catelog) => (
                                        <option key={Catelog.NewsTypeID} value={Catelog.NewsTypeID}>
                                            {Catelog.NewsTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className='Admin-editor'>
                            <p>Nội dung:</p>
                            <div className="froala-editor-container" ref={editorRef}></div>
                        </div>
                        <div className='Admin-btn-post'>
                            <button onClick={handleSubmit}>Đăng bài</button>
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
        ReactDOM.render(<AdminAddNews />, contentElement);
    }
});