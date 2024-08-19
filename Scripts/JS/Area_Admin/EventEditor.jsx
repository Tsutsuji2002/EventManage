const IconHidden = '../../Resources/images/nav-icon.png';
const ImageEditor = '../../../Resources/images/PlayHolder.png'
function AdminEditor() {
    const [eventName, setEventName] = React.useState('');
    const [speaker, setSpeaker] = React.useState('');
    const [eventDescription, setEventDescription] = React.useState('');
    const [eventType, setEventType] = React.useState('');
    const [eventTypes, setEventTypes] = React.useState([]);
    const [eventCode, setEventCode] = React.useState('');
    const [eventDate, setEventDate] = React.useState('');
    const [eventParticipants, setEventParticipants] = React.useState('');
    const [locations, setLocations] = React.useState([]);
    const [location, setLocation] = React.useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [content, setContent] = React.useState('');
    const [EditorHint, setEditorHint] = React.useState(false);
    const [AdminFileHInt, setAdminFileHInt] = React.useState(false);
    const [AdminFiles, setAdminFiles] = React.useState([]);
    const [AdminError, setAdminError] = React.useState('');
    const [speakers, setSpeakers] = React.useState([]);
    const [selectedSpeakers, setSelectedSpeakers] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const editorRef = React.useRef(null);  
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        if (editorRef.current) {
            const editor = new FroalaEditor(editorRef.current, {
                events: {
                    'contentChanged': function () {
                        setEventDescription(this.html.get());
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

    const clearEditorContent = () => {
        if (editorRef.current) {
            const editorInstance = FroalaEditor.get(editorRef.current);
            if (editorInstance) {
                editorInstance.html.set('');
            }
        }
    };

    React.useEffect(() => {
        const fetchSpeakers = async () => {
            try {
                setIsLoading(true);
                const response = await fetch('/Admin/ADEvent/GetSpeakers');
                if (!response.ok) {
                    throw new Error('Lagg');
                }
                const data = await response.json();
                setSpeakers(data.map(speaker => ({
                    id: speaker.SpeakerID,
                    name: speaker.SpeakerName
                })));
            } catch (error) {
                console.error('Có lỗi khi tải danh sách diễn giả:', error);
                setAdminError('Có lỗi khi tải danh sách diễn giả:');
            } finally {
                setIsLoading(false);
            }
        };

        fetchSpeakers();
    }, []);

    React.useEffect(() => {
        const fetchEventTypes = async () => {
            try {
                const response = await fetch('/User/GetEventTypes');
                if (!response.ok) throw new Error('Failed to fetch event types');
                const data = await response.json();
                setEventTypes(data);
            } catch (error) {
                console.error('Error fetching event types:', error);
                setError('Failed to load event types');
            }
        };
        fetchEventTypes();
    }, []);
    React.useEffect(() => {
        const fetchLocations = async () => {
            try {
                const response = await fetch('/User/GetLocations');
                if (!response.ok) throw new Error('Failed to fetch locations');
                const data = await response.json();
                setLocations(data);
            } catch (error) {
                console.error('Error fetching locations:', error);
                setError('Failed to load locations');
            }
        };
        fetchLocations();
    }, []);
    const handleImageClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setSelectedImage(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }
    const toggleSpeaker = (speakerId) => {
        setSelectedSpeakers(prevSelected =>
            prevSelected.includes(speakerId)
                ? prevSelected.filter(id => id !== speakerId)
                : [...prevSelected, speakerId]
        );
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleAdminFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const allowedExtensions = ['doc', 'docx', 'pdf'];

        const validFiles = selectedFiles.filter(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            return allowedExtensions.includes(fileExtension);
        });

        if (validFiles.length < selectedFiles.length) {
            setAdminError('Một số file không hợp lệ. Chỉ chấp nhận các định dạng phổ biến.');
        } else {
            setAdminError('');
        }

        setAdminFiles(prevFiles => [...prevFiles, ...validFiles]);
    };
    // hàm lấy icon file theo đuôi file
    const getAdminFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'doc':
            case 'docx':
                return '<i class="fas fa-file-word" style="color: #2b579a; font-size: 30px;"></i>';
            case 'pdf':
                return '<i class="fas fa-file-pdf" style="color: #f40f02; font-size: 30px;"></i>';
            default:
                return '<i class="fas fa-file-alt" style="color: #8c8c8c; font-size: 30px;"></i>';
        }
    };
    //hàm xóa item file
    const AdminRemoveFile = (index) => {
        setAdminFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };
    //hàm đăng bài
    const handleAdminSubmit = async () => {
        if (!eventName || !eventCode || !eventParticipants || !eventType || !location) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const formData = new FormData();

        // Append event information
        formData.append('EventName', eventName);
        formData.append('EventType', eventType);
        formData.append('EventDate', eventDate);
        formData.append('EventDescription', eventDescription);
        formData.append('EventCode', eventCode);
        formData.append('EventParticipants', eventParticipants);
        formData.append('LocationID', location);

        // Append SpeakerIDs
        formData.append('SpeakerIDs', JSON.stringify(selectedSpeakers));

        // Append EventImage
        if (selectedImage) {
            try {
                const response = await fetch(selectedImage);
                const blob = await response.blob();
                formData.append('EventImage', blob, 'event_image.jpg');
            } catch (error) {
                console.error('Error processing image:', error);
                alert('Có lỗi xảy ra khi xử lý ảnh.');
                return;
            }
        }

        // Append other files
        AdminFiles.forEach((file, index) => {
            formData.append(`Files[${index}]`, file);
        });

        try {
            const response = await fetch('/Admin/ADEvent/AddEvent', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server Error:', errorText);
                alert('Thêm sự kiện thất bại. Xem console để biết chi tiết.');
                return;
            }

            const result = await response.json();
            if (result.success) {
                alert('Thêm sự kiện thành công');
                // Reset form fields
                setEventName('');
                setEventCode('');
                setEventDescription('');
                setEventParticipants('');
                setEventDate('');
                setLocation('');
                setEventType('');
                setAdminFiles([]);
                setSelectedImage(null);
                setSelectedSpeakers([]);
                clearEditorContent();
            } else {
                alert(result.message || 'Thêm sự kiện thất bại');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi thêm sự kiện: ' + error.message);
        }
    };

    return (
            <div class="Admin-main-panel">
                <div className='Admin-body-nav-container'>
                    <div>
                        <img
                            className="Admin-picHidden"
                            src={IconHidden}
                            alt="my pic"
                            onClick={() => setEditorHint(!EditorHint)}
                        />
                    </div> 
                </div>
                <div class="Admin-container-admin-table">
                    <div class="Admin-page-inner">
                        <div className='Admin-create-blog'>
                            <div className='Admin-shower-container'>
                                <span onClick={() => setAdminFileHInt(!AdminFileHInt)} >Tệp tài liệu  </span>
                        </div>
                        <div className='Edit-Image-Container'>
                            <img src={selectedImage || ImageEditor} alt="Selected" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                            <button onClick={handleImageClick}>Chọn ảnh</button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                accept="Resources/event_images/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                        <div className='Admin-EvenName'>
                            <div className='Event-Name'>
                                <p>Tên sự kiện:</p>
                                <input type='text' className='Admin-input-layout' placeholder='Nhập tên sự kiện' required
                                    value={eventName} onChange={(e) => setEventName(e.target.value)} />
                            </div>
                            <div className='Event-ID'>
                                <p>Mã sự kiện:</p>
                                <input
                                    type='text'
                                    className='Admin-input-layout'
                                    placeholder='Mã sự kiện'
                                    required
                                    value={eventCode}
                                    onChange={(e) => setEventCode(e.target.value)}
                                />
                            </div>
                            <div className='Event-ID'>
                                <p>Số người:</p>
                                <input
                                    type='number'
                                    className='Admin-input-layout'
                                    placeholder='Số người'
                                    value={eventParticipants}
                                    onChange={(e) => setEventParticipants(e.target.value)}
                                />
                            </div>
                           
                        </div>
                        <div className='EvenName'>
                            <div>
                                <p>Ngày bắt đầu:</p>
                                <input type='date' className='Admin-input-layout' value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
                            </div>
                            <div className='Speaker-selection'>
                                <p>Diễn giả</p>
                                <div className='custom-dropdown'>
                                    <div className='dropdown-header' onClick={toggleDropdown}>
                                        {selectedSpeakers.length > 0
                                            ? `${selectedSpeakers.length} diễn giả đã chọn`
                                            : 'Chọn diễn giả'}
                                    </div>
                                    {isDropdownOpen && (
                                        <div className='dropdown-list'>
                                            {speakers.map((item) => (
                                                <div key={item.id} className='dropdown-item'>
                                                    <input
                                                        type="checkbox"
                                                        id={`speaker-${item.id}`}
                                                        checked={selectedSpeakers.includes(item.id)}
                                                        onChange={() => toggleSpeaker(item.id)}
                                                    />
                                                    <label htmlFor={`speaker-${item.id}`}>{item.name}</label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='Even-Name'>
                            <p>Địa điểm:</p>
                            <select
                                className='user-select'
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                                required
                            >
                                <option value="">Chọn địa điểm</option>
                                {locations.map((Loca) => (
                                    <option key={Loca.LocationID} value={Loca.LocationID}>
                                        {Loca.LocationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className='Admin-radio-container'>
                            <p>Thể loại :</p>
                            <div className='Admin-radio-div'>
                                {eventTypes.map((type) => (
                                    <React.Fragment key={type.EventTypeID}>
                                        <input
                                            type="radio"
                                            id={`radio-${type.EventTypeName}`}
                                            name="eventType"
                                            value={type.EventTypeID}
                                            checked={eventType === type.EventTypeID}
                                            onChange={() => setEventType(type.EventTypeID)}
                                        />
                                        <label htmlFor={`radio-${type.EventTypeName}`}>{type.EventTypeName}</label>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                            <div className='Admin-editor'>
                                <p>Nội dung:</p>
                                <div className="froala-editor-container" ref={editorRef}></div>
                            </div>

                            </div>
                            <div className='Admin-btn-post'>
                                <button
                                    onClick={handleAdminSubmit}
                                    disabled={!AdminFiles}
                                    style={{
                                        backgroundColor: AdminFiles.length > 0 ? '#4CAF50' : '#ddd',
                                        color: AdminFiles.length > 0 ? 'white' : '#666',
                                        cursor: AdminFiles.length > 0 ? 'pointer' : 'not-allowed'
                                    }}>
                                    Đăng bài
                                </button>
                            </div>
                        </div>
                        <div className='Admin-file-select' style={{ display: AdminFileHInt ? 'block' : 'none' }}>
                            <input
                                type="file"
                                onChange={handleAdminFileChange}
                                accept=".doc,.docx,.pdf"
                                style={{ display: 'none' }}
                                id="custom-file-input"
                                multiple
                            />
                            <label htmlFor="custom-file-input" className='file-selector'>
                                Chọn file
                            </label>
                            {AdminFiles.map((file, index) => (
                                <div key={index} className='file-item'>
                                    <span dangerouslySetInnerHTML={{ __html: getAdminFileIcon(file.name) }}></span>
                                    <span className='file-Name'>{file.name}</span>
                                    <i
                                        className="fas fa-times-circle delete-icon"
                                        onClick={() => AdminRemoveFile(index)}
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    ></i>
                                </div>
                            ))}
                            {AdminError && <p style={{ color: 'red' }}>{AdminError}</p>}
                        </div>
                    </div>
                </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('main-panel');
    if (contentElement) {
        ReactDOM.render(<AdminEditor />, contentElement);
    }
});