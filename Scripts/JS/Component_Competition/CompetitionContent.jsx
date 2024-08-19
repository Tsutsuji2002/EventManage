const Placeholder = '../../../Resources/images/PlayHolder.png';
function formatDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
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
function Competition() {
    const [competition, setCompetition] = React.useState([]);
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
            const response = await fetch('/Account/IsLoggedIn');
            const data = await response.json();
            setIsLoggedIn(data.isLoggedIn);
        } catch (error) {
            console.error('Error checking login status:', error);
            setIsLoggedIn(false);
        }
    };

    React.useEffect(() => {
        fetchCompetitionList();
        checkLoginStatus();
        checkUserRegistrations();
    }, []);

    const fetchCompetitionList = async () => {
        try {
            const response = await fetch('/Event/GetCompetitionList');
            const data = await response.json();
            setCompetition(data);
        } catch (error) {
            console.error('Error loading Competition data:', error);
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
    const currentItems = competition.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const decodeHtml = (html) => {
        const txt = document.createElement('textarea');
        txt.innerHTML = html;
        return txt.value;
    };

    return (
        <div className="competition-content">
            {currentItems.map((item, index) => (
                <div className='competition-table' key={item.EventId}>
                    <div>
                        <img src={item.EventImage ? item.EventImage : Placeholder} className="compe-pic" />
                    </div>
                    <div className="competition-data">
                        <div className="competition-row">
                            <div className="competition-cell">
                                <a href={`EventDetails?id=${item.EventId}`}><p id="competition-title"><b>{item.EventName}</b></p></a>
                            </div>
                            <div className="competition-cell">
                                {isLoggedIn ? (
                                    userRegistrations[item.EventId] ? (
                                        <button onClick={() => handleCancelClick(item.EventId)} id="competition-regis">Hủy đăng ký</button>
                                    ) : (
                                            <button onClick={() => handleRegisterClick(item.EventId)} id="competition-regis">Đăng ký</button>
                                    )
                                ) : null}
                            </div>
                        </div>
                        <div className="competition-row">
                            <div className="competition-descrip">
                                <p id='competition-description' dangerouslySetInnerHTML={{ __html: decodeHtml(item.EventDescription) }}></p>
                            </div>
                        </div>
                        <div className="competition-row">
                            <div className="competition-cell" id="competition-upuser">
                                <p id="competition-upuser">Người đăng : {item.EventCreator}</p>
                            </div>
                            <div className="competition-cell" id="competition-update"><p>Ngày đăng : {formatDate(item.CreatedDate)}</p></div>
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
            {competition.length > itemsPerPage && (
                <div className='Compe-pagination'>
                    <button
                        className='Compe-PagesButton'
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Pre
                    </button>
                    <div className='Compe-pagesNum'>
                        {[...Array(Math.ceil(competition.length / itemsPerPage))].map((_, i) => (
                            <a key={i} onClick={() => paginate(i + 1)} style={{ cursor: 'pointer' }}>
                                {i + 1}
                            </a>
                        ))}
                    </div>
                    <button
                        className='Compe-PagesButton'
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === Math.ceil(competition.length / itemsPerPage)}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('compe-content');
    if (contentElement) {
        ReactDOM.render(<Competition />, contentElement);
    }
});