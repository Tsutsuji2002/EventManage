const IconEvent = '../../../Resources/images/nav-icon.png';
const EventImage = '../../../Resources/images/PlayHolder.png';
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
function RegistrationModal({ show, onClose, registrations }) {
    if (!show) return null;

    return (
        <div className="registration-modal-overlay">
            <div className="registration-modal">
                <div className="registration-modal-header">
                    <h2>Danh sách đăng ký</h2>
                    <button className="close-button" onClick={onClose}>&times;</button>
                </div>
                <div className="registration-modal-body">
                    {registrations && registrations.length > 0 ? (
                        <table className="registration-table">
                            <thead>
                                <tr>
                                    <th className="stt-column">STT</th>
                                    <th>Tên</th>
                                    <th className="regisDay-column">Ngày đăng ký</th>
                                </tr>
                            </thead>
                            <tbody>
                                {registrations.map((reg, index) => (
                                    <tr key={reg.RegistrationID}>
                                        <td className="stt-column">{index + 1}</td>
                                        <td>{reg.UserName}</td>
                                        <td className="regisDay-column">{new Date(reg.RegistratedDate).toLocaleDateString('vi-VN')}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <p className="no-registrations-message">Chưa có thành viên đăng ký</p>
                    )}
                </div>
            </div>
        </div>
    );
}

function LocationModal({ show, onClose, locations = [], onAdd, onEdit, onDelete }) {
    const [newLocation, setNewLocation] = React.useState({ LocationName: '', LocationAddress: '', LocationCapacity: '' });
    const [editingLocation, setEditingLocation] = React.useState(null);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredLocations, setFilteredLocations] = React.useState([]);
    const [showConfirmModal, setShowConfirmModal] = React.useState(false);
    const [locationToDelete, setLocationToDelete] = React.useState(null);

    React.useEffect(() => {
        const filtered = locations.filter(location =>
            location.LocationName.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredLocations(filtered);
    }, [locations, searchTerm]);

    if (!show) return null;

    const handleSubmit = () => {
        if (editingLocation) {
            onEdit({ ...editingLocation, ...newLocation });
        } else {
            onAdd(newLocation);
        }
        setNewLocation({ LocationName: '', LocationAddress: '', LocationCapacity: '' });
        setEditingLocation(null);
    };

    const startEditing = (location) => {
        setEditingLocation(location);
        setNewLocation({
            LocationName: location.LocationName,
            LocationAddress: location.LocationAddress,
            LocationCapacity: location.LocationCapacity
        });
    };

    const confirmDelete = (location) => {
        setLocationToDelete(location);
        setShowConfirmModal(true);
    };

    const handleConfirmDelete = () => {
        onDelete(locationToDelete.LocationID);
        setShowConfirmModal(false);
    };

    return (
        <div className="model-location">
            <div className="model-location-content">
                <h2>Quản lý Địa điểm</h2>
                <div className="location-input">
                    <input
                        type="text"
                        value={newLocation.LocationName}
                        onChange={(e) => setNewLocation({ ...newLocation, LocationName: e.target.value })}
                        placeholder="Tên địa điểm"
                    />
                    <input
                        type="text"
                        value={newLocation.LocationAddress}
                        onChange={(e) => setNewLocation({ ...newLocation, LocationAddress: e.target.value })}
                        placeholder="Địa chỉ"
                    />
                    <input
                        type="number"
                        value={newLocation.LocationCapacity}
                        onChange={(e) => setNewLocation({ ...newLocation, LocationCapacity: e.target.value })}
                        placeholder="Sức chứa"
                    />
                    <button onClick={handleSubmit} className='model-location-add'>
                        {editingLocation ? 'Cập nhật' : 'Thêm'}
                    </button>
                </div>
                <div className="search-input">
                    <span>Tìm kiếm </span>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Tìm kiếm địa điểm"
                    />
                </div>
                <ul className="location-list">
                    {filteredLocations.map(location => (
                        <li key={location.LocationID}>
                            {location.LocationName} - {location.LocationAddress} (Sức chứa: {location.LocationCapacity})
                            <div>
                                <button onClick={() => startEditing(location)} className='model-location-fix'>
                                    Sửa
                                </button>
                                <button onClick={() => confirmDelete(location)} className='model-location-delete'>
                                    Xóa
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <button className="close-button" onClick={onClose}>Đóng</button>
            </div>
            <ConfirmModel
                show={showConfirmModal}
                message="Bạn có chắc chắn muốn xóa địa điểm này?"
                onConfirm={handleConfirmDelete}
                onCancel={() => setShowConfirmModal(false)}
            />
        </div>
    );
}
function EventList() {
    const [selectedList, setSelectedList] = React.useState('');
    const [showLocationModal, setShowLocationModal] = React.useState(false);
    const [locations, setLocations] = React.useState([]);

    const [showRegistrationModal, setShowRegistrationModal] = React.useState(false);
    const [registrations, setRegistrations] = React.useState([]);
    
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    const [editorHint, setEditorHint] = React.useState(false);
    const [eventList, setEventList] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [eventTypes, setEventTypes] = React.useState([]);
    const [selectedType, setSelectedType] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    React.useEffect(() => {
        fetchEvents();
        fetchEventTypes();
        fetchLocations();
    }, []);

    const fetchEvents = async (typeId = null) => {
        try {
            let url = '/Admin/ADEvent/GetEvents';
            if (typeId) {
                url = `/Admin/ADEvent/GetEventByType?id=${typeId}`;
            }
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setEventList(data);
            } else {
                console.error('Không thể lấy sự kiện');
            }
        } catch (error) {
            console.error('Lỗi khi tải sự kiện:', error);
        }
    };

    const fetchRegistrations = async (eventID) => {
        setLoading(true);
        try {
            const response = await fetch(`/Admin/ADEvent/GetRegistrations?eventID=${eventID}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setRegistrations(data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching registrations: ' + error.message);
            setLoading(false);
        }
    };
    const fetchEventTypes = async () => {
        try {
            const response = await fetch('/Admin/ADEvent/GetEventTypes');
            if (response.ok) {
                const data = await response.json();
                setEventTypes(data);
            } else {
                console.error('Không thể lấy được loại sự kiện');
            }
        } catch (error) {
            console.error('Không thể lấy được loại sự kiện:', error);
        }
    };
    const fetchLocations = async () => {
        try {
            const response = await fetch('/Admin/ADEvent/GetLocations');
            if (response.ok) {
                const data = await response.json();
                setLocations(data);
            } else {
                console.error('Không thể lấy được loại locations');
            }
        } catch (error) {
            console.error('Không thể lấy được loại locations:', error);
        }
    };

    const handleAddLocation = async (newLocation) => {
        try {
            const response = await fetch('/Admin/ADEvent/AddLocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newLocation)
            });
            if (response.ok) {
                fetchLocations();
            } else {
                console.error('Lỗi khi thêm địa điểm');
            }
        } catch (error) {
            console.error('Lỗi khi thêm địa điểm:', error);
        }
    };

    const handleEditLocation = async (updatedLocation) => {
        try {
            const response = await fetch('/Admin/ADEvent/UpdateLocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedLocation)
            });
            const data = await response.json();
            if (data.success) {
                console.log(data.message);
                fetchLocations();
            } else {
                console.error('Lỗi khi cập nhật địa điểm:', data.error);
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật địa điểm:', error);
        }
    };

    const handleDeleteLocation = async (locationId) => {
        try {
            const response = await fetch('/Admin/ADEvent/RemoveLocation', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ locationId: locationId })
            });
            const data = await response.json();
            if (data.success) {
                console.log(data.message);
                fetchLocations();
            } else {
                console.error('Lỗi khi xóa địa điểm:', data.error);
            }
        } catch (error) {
            console.error('Lỗi khi xóa địa điểm:', error);
        }
    };

    const handleAddEvent = () => {
        // Redirect to event editor page
        window.location.href = '/Admin/ADEvent/EventEditor';
    };

    const handleDeleteEvent = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
            fetch('/Admin/ADEvent/DeleteEvent', {
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
                        fetchEvents();
                    } else {
                        alert(data.message);
                    }
                })
                .catch(error => console.error('Error deleting news:', error));
        }
    };

    const handleEditEvent = (eventId) => {
        // Redirect to event editor page with event ID
        window.location.href = `/Admin/ADEvent/EventEditor/${eventId}`;
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`/Admin/ADEvent/SearchEvents?term=${searchTerm}`);
            if (response.ok) {
                const data = await response.json();
                setEventList(data);
            } else {
                console.error('Không tìm kiếm được sự kiện');
            }
        } catch (error) {
            console.error('Không tìm kiếm được sự kiện:', error);
        }
    };
    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        setSelectedType(typeId);
        setCurrentPage(1);
        fetchEvents(typeId === '' ? null : typeId);
    };
    const handleOpenRegistrationModal = (eventId) => {
        console.log(eventId);
        fetchRegistrations(eventId);
        setShowRegistrationModal(true);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = eventList.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="Event-main-panel">
            <div className='Event-body-nav-container'>
                <div>
                    <img
                        className="Event-picHidden"
                        src={IconEvent}
                        alt="my pic"
                        onClick={() => setEditorHint(!editorHint)}
                    />
                </div>
                <div className='Event-container-admin-form'>
                    <div className='Event-form'>
                        <input
                            type='text'
                            placeholder='Tìm kiếm .....'
                            className='Event-input'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <button className='Event-admin-submit' onClick={handleSearch}>Tìm kiếm</button>
                    </div>
                </div>
            </div>
            <div className="Event-container-admin-table">
                <div className="Admin-Event-inner">

                    <div className="Event-Header">
                        <select
                            className='Event-input-layout'
                            value={selectedType}
                            onChange={handleTypeChange}
                            required
                        >
                            <option value="">Tất cả</option>
                            {eventTypes.map((eventType) => (
                                <option key={eventType.EventTypeId} value={eventType.EventTypeId}>
                                    {eventType.EventTypeName}
                                </option>
                            ))}
                        </select>
                    
                    <div>
                        <button className='Event-AddNews' onClick={handleAddEvent}>Thêm</button>
                        <button className='Event-AddLocation' onClick={() => setShowLocationModal(true)}>Địa điểm</button>
                    </div>
                    </div>
                   
                    <table className='Event-table'>
                        <thead>
                            <tr>
                                <th>Thông tin</th>
                                <th>Thao tác</th>
                                <th>Mới nhất</th>
                                <th>Nổi bật</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((event) => (
                                <tr key={event.EventId}>
                                    <td>
                                        <div className='Event-items'>
                                            <img
                                                src={event.EventImage ? `../../../Resources/news_images/${event.EventImage}` : EventImage}
                                                alt='Hình'
                                                className='Event-image'
                                                onError={(e) => {
                                                    e.target.onerror = null;
                                                    e.target.src = EventImage;
                                                }}
                                            />
                                            <div className='Event-info-container'>
                                                <div className='info-title-Event'>
                                                    <span className='Event-title'>{event.EventName}</span>
                                                </div>
                                                <div className='Event-Description'>
                                                    <span>{event.EventDescription}</span>
                                                </div>
                                                <div className='info-Event'>
                                                    <span>Người đăng: {event.EventCreator}</span>
                                                    <span>Ngày Đăng: {new Date(event.CreatedDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            style={{ backgroundColor: "darkseagreen", color: "white", cursor: 'pointer', width: "120px" }}
                                            onClick={() => {
                                                handleOpenRegistrationModal(event.EventId);
                                            }}
                                        >
                                            Danh sách đăng kí
                                        </button>
                                        <div className='Event-button'>
                                            <span
                                                style={{ backgroundColor: "red", color: "white", cursor: "pointer" }}
                                                onClick={() => handleDeleteEvent(event.EventId)}
                                            >
                                                Xóa
                                            </span>
                                            <span
                                                style={{ backgroundColor: "green", color: "white", cursor: "pointer" }}
                                                onClick={() => handleEditEvent(event.EventId)}
                                            >
                                                Sửa
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <input type='checkbox' checked={event.IsNewest} />
                                    </td>
                                    <td>
                                        <input type='checkbox' checked={event.IsFeatured} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {eventList.length > itemsPerPage && (
                        <div className='pagination'>
                            <button
                                className='PagesButton'
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Pre
                            </button>
                            <div className='pagesNum'>
                                {[...Array(Math.ceil(eventList.length / itemsPerPage))].map((_, i) => (
                                    <a key={i} onClick={() => paginate(i + 1)} style={{ cursor: 'pointer' }}>
                                        {i + 1}
                                    </a>
                                ))}
                            </div>
                            <button
                                className='PagesButton'
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(eventList.length / itemsPerPage)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </div>
                <LocationModal
                    show={showLocationModal}
                    onClose={() => {
                        setShowLocationModal(false);
                    }}
                    locations={locations}
                    onAdd={handleAddLocation}
                    onEdit={handleEditLocation}
                    onDelete={handleDeleteLocation}
                />
                <RegistrationModal
                    show={showRegistrationModal}
                    onClose={() => setShowRegistrationModal(false)}
                    registrations={registrations}
                />
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('main-panel');
    if (contentElement) {
        ReactDOM.render(<EventList />, contentElement);
    }
});