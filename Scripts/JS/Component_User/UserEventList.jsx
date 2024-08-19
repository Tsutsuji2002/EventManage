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
function UserEventList() {
    const [userEventHint, setUserEventHint] = React.useState(false);
    const [eventSelect, setEventSelect] = React.useState([]);
    const [eventList, setEventList] = React.useState([]);
    const [selectedItem, setSelectedItem] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    React.useEffect(() => {
        fetchEvents();
        fetchEventTypes();
    }, []);

    const fetchEventTypes = async () => {
        try {
            const response = await fetch('/User/GetEventTypes');
            if (response.ok) {
                const data = await response.json();
                setEventSelect(data);
            } else {
                console.error('Không thể lấy được loại sự kiện');
            }
        } catch (error) {
            console.error('Không thể lấy được loại sự kiện:', error);
        }
    };

    const fetchEvents = async (typeId = null) => {
        try {
            let url = '/User/GetUserEvents';
            if (typeId) {
                url = `/User/GetEventByType?id=${typeId}`;
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
    const handleDeleteEvent = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa sự kiện này?')) {
            fetch('/User/DeleteEvent', {
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
        window.location.href = `/User/EventUpdate/${eventId}`;
    };
    const handleAddEvent = () => {
        window.location.href = `/User/EventEditor`;
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
    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        setSelectedItem(typeId);
        setCurrentPage(1);
        fetchEvents(typeId === '' ? null : typeId);
    };
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = eventList.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='EvtList-user-container'>
            <div className='EvtList-aside' style={{ display: userEventHint ? 'none' : 'block' }}>
                <UserAside />
            </div>
            <div className='EvtList-container'>
                <div className='EvtList-create-blog'>
                    <div className='EvtList-shower-container'>
                        <img
                            className="EvtList-picHint"
                            src={UserIcon}
                            alt="my hint picture"
                            onClick={() => setUserEventHint(!userEventHint)}
                        />
                        <div className="Evt">
                            <div className='EvtList-header-table'>
                                <select
                                    className='EvtList-input-layout'
                                    value={selectedItem}
                                    onChange={handleTypeChange}
                                    required
                                >
                                    <option value="">Tất cả</option>
                                    {eventSelect.map((item) => (
                                        <option key={item.EventTypeID} value={item.EventTypeID}>
                                            {item.EventTypeName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <span onClick={() => handleAddEvent()} >Thêm bài viết</span>
                        </div>
                    </div>
                    <div className='EvtList-container'>
                        <div className='EvtList-contact-container'>
                            <table>
                                <thead>
                                    
                                    <tr>
                                        <th><span>Thông tin</span></th>
                                        <th><span>Thao tác</span></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map((event) => (
                                        <tr key={event.EventId}>
                                            <td>
                                                <div className='EvtList-Edit-item'>
                                                    <img src={ImageHold} alt='Hình' className='EvtList-image' />
                                                    <div className='EvtList-info-container'>
                                                        <div className='EvtList-title-EvtList'>
                                                            <p>{event.EventName}</p>
                                                        </div>
                                                        <div className='EvtList-Description'>
                                                            <p>{event.EventDescription}</p>
                                                        </div>
                                                        <div className='info-EvtList'>
                                                            <span>Người đăng: {event.EventCreator}</span>
                                                            <span>Ngày Đăng: {formatDate(event.CreatedDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='EvtList-button'>
                                                    <button style={{ backgroundColor: "red", color: "white" }} onClick={() => handleDeleteEvent(event.EventId)} >Xóa</button>
                                                    <button style={{ backgroundColor: "green", color: "white" }} onClick={() => handleEditEvent(event.EventId)}>Sửa</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {eventList.length > itemsPerPage && (
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
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const userElement = document.getElementById('user-content');
    if (userElement) {
        ReactDOM.render(<UserEventList />, userElement);
    }
});