const Placeholder = '../../../Resources/images/PlayHolder.png';

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
function Seminar() {
    const [seminar, setSeminar] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const [confirmAction, setConfirmAction] = React.useState(null);
    const [confirmEventId, setConfirmEventId] = React.useState(null);
    const [registrationStatus, setRegistrationStatus] = React.useState({});
    const [userRegistrations, setUserRegistrations] = React.useState({});
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const itemsPerPage = 10;

    const checkLoginStatus = async () => {
        try {
            const response = await fetch('/Account/IsLoggedIn', {
                method: 'GET',
                credentials: 'include'
            });
            const data = await response.json();
            console.log('Login status:', data);
            setIsLoggedIn(data.isLoggedIn);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    React.useEffect(() => {
        fetchSeminarList();
        checkLoginStatus();
        checkUserRegistrations();
    }, []);

    const fetchSeminarList = async () => {
        try {
            const response = await fetch('/Event/GetSeminarList');
            const data = await response.json();
            setSeminar(data);
        } catch (error) {
            console.error('Error loading seminar data:', error);
        }
    };

    const checkUserRegistrations = async () => {
        try {
            const response = await fetch('/User/GetUserRegistrations');
            const data = await response.json();
            const registrationMap = {};
            data.forEach(eventId => {
                registrationMap[eventId] = true;
            });
            setUserRegistrations(registrationMap);
        } catch (error) {
            console.error('Error checking user registrations:', error);
        }
    };

    const registerForEvent = async (eventId) => {
        setShowConfirm(false);
        try {
            const formData = new FormData();
            formData.append('eventId', eventId);

            const response = await fetch('/User/RegisterForEvent', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setRegistrationStatus(prevStatus => ({
                    ...prevStatus,
                    [eventId]: { status: 'success', message: data.message }
                }));
                setUserRegistrations(prevRegistrations => ({
                    ...prevRegistrations,
                    [eventId]: true
                }));
            } else {
                setRegistrationStatus(prevStatus => ({
                    ...prevStatus,
                    [eventId]: { status: 'error', message: data.message }
                }));
            }
        } catch (error) {
            setRegistrationStatus(prevStatus => ({
                ...prevStatus,
                [eventId]: { status: 'error', message: 'An error occurred during registration.' }
            }));
        }
    };

    const cancelRegistration = async (eventId) => {
        setShowConfirm(false);
        try {
            const response = await fetch(`/User/CancelRegistration?eventId=${eventId}`, {
                method: 'POST',
                credentials: 'include'
            });
            const data = await response.json();

            if (data.success) {
                setRegistrationStatus(prevStatus => ({
                    ...prevStatus,
                    [eventId]: { status: 'success', message: data.message }
                }));
                setUserRegistrations(prevRegistrations => ({
                    ...prevRegistrations,
                    [eventId]: false
                }));
            } else {
                setRegistrationStatus(prevStatus => ({
                    ...prevStatus,
                    [eventId]: { status: 'error', message: data.message }
                }));
            }
        } catch (error) {
            setRegistrationStatus(prevStatus => ({
                ...prevStatus,
                [eventId]: { status: 'error', message: 'An error occurred while cancelling registration.' }
            }));
        }
    };

    const handleRegisterClick = (eventId) => {
        setShowConfirm(true);
        setConfirmAction('register');
        setConfirmEventId(eventId);
    };

    const handleCancelClick = (eventId) => {
        setShowConfirm(true);
        setConfirmAction('cancel');
        setConfirmEventId(eventId);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = seminar.slice(indexOfFirstItem, indexOfLastItem);

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
    const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    return (
        <div className="semi-content">
            {currentItems.map((item) => (
                <div className='semi-table' key={item.EventId}>
                    <div className="semi-row">
                        <div>
                            <img src={item.EventImage ? item.EventImage : Placeholder} className="semi-img" alt={item.EventName} />
                        </div>
                    </div>
                    <div className="semi-data">
                        <div className="semi-headerow">
                            <div className="semi-cell">
                                <div className="semi-row">
                                    <a href={`EventDetails?id=${item.EventId}`}><p id="semi-title"><b>{item.EventName}</b></p></a>
                                    {isLoggedIn ? (
                                        userRegistrations[item.EventId] ? (
                                            <button id="semi-regis"  onClick={() => handleCancelClick(item.EventId)}>Hủy đăng ký</button>
                                        ) : (
                                            <button id="semi-regis" onClick={() => handleRegisterClick(item.EventId)}>Đăng ký</button>
                                        )
                                    ) : null}
                                </div>
                               
                                <div className="semi-descrip">
                                    <p id='semi-description' dangerouslySetInnerHTML={{ __html: decodeHtml(item.EventDescription) }}></p>
                                </div>
                                <div className="semi-row">
                                    <div className="semi-cell" id="semi-upuser">
                                        <p id="semi-upuser">Người đăng : {item.EventCreator}</p>
                                    </div>
                                    <div className="semi-cell" id="semi-update"><p>Ngày đăng : {formatDate(item.CreatedDate)}</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            <ConfirmModel
                show={showConfirm}
                message={confirmAction === 'register' ? 'Bạn có chắc chắn muốn đăng ký sự kiện này?' : 'Bạn có chắc chắn muốn hủy đăng ký sự kiện này?'}
                onConfirm={() => confirmAction === 'register' ? registerForEvent(confirmEventId) : cancelRegistration(confirmEventId)}
                onCancel={() => setShowConfirm(false)}
            />
            {seminar.length > itemsPerPage && (
                <div className='semi-pagination'>
                    <button
                        className='semi-PagesButton'
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Pre
                    </button>
                    <div className='semi-pagesNum'>
                        {[...Array(Math.ceil(seminar.length / itemsPerPage))].map((_, i) => (
                            <a key={i} onClick={() => paginate(i + 1)} style={{ cursor: 'pointer' }}>
                                {i + 1}
                            </a>
                        ))}
                    </div>
                    <button
                        className='semi-PagesButton'
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(seminar.length / itemsPerPage)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>

    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('semi-content');
    if (contentElement) {
        ReactDOM.render(<Seminar />, contentElement);
    }
});