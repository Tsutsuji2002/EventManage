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
}
function UserUpdateEditor({ eventId }) {
    const [UserHint, setUserHint] = React.useState(false);
    const [FileHint, setFileHint] = React.useState(false);
    const [files, setFiles] = React.useState([]);
    const [error, setError] = React.useState('');
    const [selectedImage, setSelectedImage] = React.useState(null);
    const fileInputRef = React.useRef(null);
    const [eventName, setEventName] = React.useState('');
    const [eventDescription, setEventDescription] = React.useState('');
    const [eventCode, setEventCode] = React.useState('');
    const [eventDate, setEventDate] = React.useState('');
    const [eventParticipants, setEventParticipants] = React.useState('');
    const [eventTypes, setEventTypes] = React.useState([]);
    const [eventType, setEventType] = React.useState('');
    const [selectedSpeakers, setSelectedSpeakers] = React.useState([]);
    const [speakers, setSpeakers] = React.useState([]);
    const [location, setLocation] = React.useState('');
    const [locations, setLocations] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const [eventId, setEventId] = React.useState(null);
    const editorRef = React.useRef(null);

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

    React.useEffect(() => {
        const id = window.newsId;
        setEventId(id);

        fetchSpeakers();
        fetchLocations();
        fetchEventTypes();
        fetchEventDetails(eventId);
    }, []);

    const clearEditorContent = () => {
        if (editorRef.current) {
            const editorInstance = FroalaEditor.get(editorRef.current);
            if (editorInstance) {
                editorInstance.html.set('');
            }
        }
    };

    const fetchSpeakers = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/User/GetSpeakers');
            if (!response.ok) {
                throw new Error('Lỗi tải danh sách diễn giả');
            }
            const data = await response.json();
            setSpeakers(data.map(speaker => ({
                id: speaker.SpeakerID,
                name: speaker.SpeakerName
            })));
        } catch (error) {
            console.error('Có lỗi khi tải danh sách diễn giả:', error);
            setError('Có lỗi khi tải danh sách diễn giả:');
        } finally {
            setIsLoading(false);
        }
    };

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

    const fetchEventDetails = async (eventId) => {
        try {
            const response = await fetch(`/Event/EventDetailsData/${eventId}`);
            if (!response.ok) throw new Error('Failed to fetch event details');
            const event = await response.json();
            setEventName(event.EventName);
            setEventCode(event.EventCode);
            setEventDescription(event.EventDescription);
            setEventDate(event.EventDate);
            setEventParticipants(event.EventParticipants);
            setEventType(event.EventType);
            setLocation(event.LocationID);
            setSelectedSpeakers(event.SpeakerIDs);
            setSelectedImage(event.EventImage);
            setFiles(event.Files || []);
        } catch (error) {
            console.error('Error fetching event details:', error);
            setError('Failed to load event details');
        }
    };

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
    };

    const toggleSpeaker = (speakerId) => {
        setSelectedSpeakers(prevSelected =>
            prevSelected.includes(speakerId)
                ? prevSelected.filter(id => id !== speakerId)
                : [...prevSelected, speakerId]
        );
    };

    const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleFileChange = (event) => {
        const selectedFiles = Array.from(event.target.files);
        const allowedExtensions = ['doc', 'docx', 'pdf'];

        const validFiles = selectedFiles.filter(file => {
            const fileExtension = file.name.split('.').pop().toLowerCase();
            return allowedExtensions.includes(fileExtension);
        });

        if (validFiles.length < selectedFiles.length) {
            setError('Một số file không hợp lệ. Chỉ chấp nhận các định dạng phổ biến.');
        } else {
            setError('');
        }

        setFiles(prevFiles => [...prevFiles, ...validFiles]);
    };

    const getFileIcon = (fileName) => {
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

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleSubmit = async () => {
        if (!eventName || !eventCode || !eventParticipants || !eventType || !location) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        const formData = new FormData();
        
        formData.append('EventName', eventName);
        formData.append('EventType', eventType);
        formData.append('EventDate', eventDate);
        formData.append('EventDescription', eventDescription);
        formData.append('EventCode', eventCode);
        formData.append('EventParticipants', eventParticipants);
        formData.append('LocationID', location);

        formData.append('SpeakerIDs', JSON.stringify(selectedSpeakers));

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

        files.forEach((file, index) => {
            formData.append(`Files[${index}]`, file);
        });

        try {
            const response = await fetch(`/User/EventUpdate/${eventId}`, {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('Server Error:', errorText);
                alert('Cập nhật sự kiện thất bại. Xem console để biết chi tiết.');
                return;
            }

            const result = await response.json();
            if (result.success) {
                alert('Cập nhật sự kiện thành công');
                // Reset form fields
                setEventName('');
                setEventCode('');
                setEventDescription('');
                setEventParticipants('');
                setEventDate('');
                setLocation('');
                setEventType('');
                setFiles([]);
                setSelectedImage(null);
                setSelectedSpeakers([]);
                clearEditorContent();
            } else {
                alert(result.message || 'Cập nhật sự kiện thất bại');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi cập nhật sự kiện: ' + error.message);
        }
    };
    return (
            <div className='main-UpEdit-container'>
                <div className='UpEdit-aside' style={{ display: UserHint ? 'none' : 'block' }}>
                    <UserAside />
                </div>
                <div className='UpEdit-container'>
                    <div className='UpEdit-create-blog'>
                        <div className='UpEdit-shower-container'>
                            <img
                                className="UpEdit-picHint"
                                src={IconHint}
                                alt="my hint picture"
                                onClick={() => setUserHint(!UserHint)}
                            />
                            <div>
                                <span onClick={() => setFileHint(!FileHint)} >Tệp tài liệu  </span>

                            </div>
                        </div>
                        <div>
                            <div className='UpEdit-Image-Container'>
                                <img src={selectedImage || PlaceImage} alt="Selected" style={{ width: '200px', height: '200px' }} />
                                <button onClick={handleImageClick}>Chọn ảnh</button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    style={{ display: 'none' }}
                                />
                            </div>
                        </div>
                        <div className='UpEdit-EvenName'>
                            <div className='UpEdit-Event-Name'>
                                <p>Tên sự kiện:</p>
                                <input
                                    type='text'
                                    className='User-input-layout'
                                    placeholder='Nhập tên sự kiện'
                                    required
                                    value={eventName}
                                    onChange={(e) => setEventName(e.target.value)}
                                />
                            </div>
                            <div className='UpEdit-ID'>
                                <p>Mã sự kiện:</p>
                                <input
                                    type='text'
                                    className='User-input-layout'
                                    placeholder='Mã sự kiện'
                                    required
                                    value={eventCode}
                                    onChange={(e) => setEventCode(e.target.value)}
                                />
                            </div>
                            <div className='UpEdit-ID'>
                                <p>Số người:</p>
                                <input
                                    type='number'
                                    className='User-input-layout'
                                    placeholder='Số người'
                                    value={eventParticipants}
                                    onChange={(e) => setEventParticipants(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className='Speaker-selection'>
                            <p>Diễn giả</p>
                            <div className='custom-dropdown'>
                                <div className='dropdown-header' onClick={toggleDropdown}>
                                    {selectedSpeakers.length > 0
                                        ? `${selectedSpeakers.length} diễn giả đã chọn`
                                        : 'Chọn diễn giả'}
                                    <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'}`}></i>
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
                        <div>
                            <p>Địa điểm:</p>
                            <select
                                className='UpEdit-select'
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
                        <div className='UpEdit-radio-container'>
                            <p>Thể loại :</p>
                            <div className='UpEdit-radio-div'>
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
                        <div className='UpEdit-editor'>
                            <p>Nội dung:</p>
                            <div className="froala-editor-container" ref={editorRef}></div>
                        </div>
                        <div className='UpEdit-btn-post'>
                            <button
                                onClick={handleSubmit}
                                disabled={!files.length}
                                style={{
                                    backgroundColor: files.length > 0 ? '#4CAF50' : '#ddd',
                                    color: files.length > 0 ? 'white' : '#666',
                                    cursor: files.length > 0 ? 'pointer' : 'not-allowed'
                                }}>
                                Cập nhật sự kiện
                            </button>
                        </div>
                    </div>
                <div className='file-select' style={{ display: FileHint ? 'block' : 'none' }}>
                    <input
                        type="file"
                        onChange={handleFileChange}
                        accept=".doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif"
                        style={{ display: 'none' }}
                        id="custom-file-input"
                        multiple
                    />
                    <label htmlFor="custom-file-input" className='file-selector'>
                        Chọn file
                    </label>
                    {files.length > 0 && (
                        <div style={{ marginTop: '20px' }}>
                            {files.map((file, index) => (
                                <div key={index} className='file-item'>
                                    <span dangerouslySetInnerHTML={{ __html: getFileIcon(file.name) }}></span>
                                    <span className='file-Name'>{file.name}</span>
                                    <i
                                        className="fas fa-times-circle delete-icon"
                                        onClick={() => removeFile(index)}
                                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
                                    ></i>
                                </div>
                            ))}
                        </div>
                    )}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                </div>
                </div>
            </div>
    );
}
export default UserUpdateEditor;