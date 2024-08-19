const UserIcon = '../../../Resources/images/nav-icon.png';
const ImageUserEdit = '../../../Resources/images/PlayHolder.png'
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
function UserColection() {
    const [UserHint, setUserHint] = React.useState(false);
    const [events, setEvents] = React.useState([]);
    const [eventTypes, setEventTypes] = React.useState([]);
    const [selectedType, setSelectedType] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    React.useEffect(() => {
        fetchEvents();
        fetchEventTypes();
    }, []);

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

    const fetchEvents = async () => {
        try {
            const response = await fetch('/User/GetEvents');
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                console.error('Không thể lấy sự kiện');
            }
        } catch (error) {
            console.error('Lỗi khi tải sự kiện:', error);
        }
    };

    const fetchEventTypes = async () => {
        try {
            const response = await fetch('/User/GetEventTypes');
            if (response.ok) {
                const data = await response.json();
                setEventTypes(data);
            } else {
                console.error('Không thể lấy được loại sự kiện');
            }
        } catch (error) {
            console.error('Lỗi khi tìm loại sự kiện:', error);
        }
    };

    const handleDeleteEvent = async (eventId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
            try {
                const response = await fetch('/User/CancelRegistration', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ id: eventId })
                });
                if (response.ok) {
                    const result = await response.json();
                    if (result.success) {
                        fetchEvents(); // Refresh the list
                    } else {
                        alert(result.message);
                    }
                } else {
                    console.error('Không thể hủy đăng ký');
                }
            } catch (error) {
                console.error('Không thể hủy đăng ký:', error);
            }
        }
    };

    const handleSearch = async () => {
        try {
            const response = await fetch(`/User/SearchEvents?term=${searchTerm}`);
            if (response.ok) {
                const data = await response.json();
                setEvents(data);
            } else {
                console.error('Không tìm kiếm được sự kiện');
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm sự kiện:', error);
        }
    };

    const handleTypeChange = (e) => {
        const typeId = e.target.value;
        setSelectedType(typeId);
        setCurrentPage(1);
        fetchEvents(typeId === '' ? null : typeId);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = events.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='main-user-container'>
            <div className='Editor-aside' style={{ display: UserHint ? 'none' : 'block' }}>
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
                    </div>
                    <div className='Collect-User-container'>
                        <div className='Collect-container'>
                            <div className='Collect-block-container'>
                                <select
                                    value={selectedType}
                                    onChange={handleTypeChange}
                                >
                                    <option value="">All Types</option>
                                    {eventTypes.map(type => (
                                        <option key={type.EventTypeID} value={type.EventTypeID}>
                                            {type.EventTypeName}
                                        </option>
                                    ))}
                                </select>
                                <div>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search events..."
                                    />
                                    <button onClick={handleSearch}>Search</button>
                                </div>
                            </div>
                            <table >
                                <thead>
                                    <tr>
                                        <th>Thông tin</th>
                                        <th>Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentItems.map(event => (
                                        <tr key={event.EventID}>
                                            <td>
                                                <div className='Collect-Edit-item'>
                                                    <img src={event.EventImage || ImageUserEdit} alt='Hình' className='Collect-image' />
                                                    <div className='Collect-info-container'>
                                                        <div className='info-title-Collect'>
                                                            <span className='Collect-title'>{event.EventName}</span>
                                                        </div>
                                                        <div className='info-Collect'>
                                                            <span>Người đăng: {event.EventCreator}</span>
                                                            <span>Ngày Đăng: {formatDate(event.CreatedDate)}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className='Collect-button'>
                                                    <i
                                                        className="fas fa-times-circle delete-icon"
                                                        style={{ fontSize: '30px', cursor: 'pointer' }}
                                                        onClick={() => handleDeleteEvent(event.EventID)}
                                                    ></i>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {events.length > itemsPerPage && (
                                <div className='pagination'>
                                    <button
                                        onClick={() => paginate(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        Previous
                                    </button>
                                    {[...Array(Math.ceil(events.length / itemsPerPage))].map((_, i) => (
                                        <button key={i} onClick={() => paginate(i + 1)}>
                                            {i + 1}
                                        </button>
                                    ))}
                                    <button
                                        onClick={() => paginate(currentPage + 1)}
                                        disabled={currentPage === Math.ceil(events.length / itemsPerPage)}
                                    >
                                        Next
                                    </button>
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
        ReactDOM.render(<UserColection />, userElement);
    }
});