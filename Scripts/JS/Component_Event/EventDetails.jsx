function EventDetail() {
    const [event, setEvent] = React.useState(null);
    const [speaker, setSpeaker] = React.useState([]);
    const [documents, setDocuments] = React.useState([]);
    const eventId = document.getElementById('content').getAttribute('data-event-id');
    React.useEffect(() => {
        fetch(`/Event/EventDetailsData/${eventId}`)
            .then(response => response.json())
            .then(data => setEvent(data.events))
            .catch(error => console.error('Error fetching event:', error));
    }, []);

    React.useEffect(() => {
        fetch(`/Event/EventSpeakersData/${eventId}`)
            .then(response => response.json())
            .then(data => {
                setSpeaker(data);
                console.log(JSON.stringify(data));
            })
            .catch(error => console.error('Error fetching speaker:', error));
    }, []);

    React.useEffect(() => {
        fetch(`/Event/EventDocumentsData/${eventId}`)
            .then(response => response.json())
            .then(data => {
                setDocuments(data);
                console.log("Documents:", data);
            })
            .catch(error => console.error('Error fetching documents:', error));
    }, []);

    const getFileIcon = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        switch (extension) {
            case 'doc':
            case 'docx':
                return <i className="fas fa-file-word" style={{ color: "#2b579a", fontSize: "50px" }}></i>;
            case 'pdf':
                return <i className="fas fa-file-pdf" style={{ color: "#f40f02", fontSize: "50px" }}></i>;
            default:
                return <i className="fas fa-file" style={{ fontSize: "50px" }}></i>;
        }
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

    if (!event) return <div> Đang tải...</div>;

    return (
        <div className="Event">
            <div className='Event-right'>
                <p>Ngày đăng: {formatDate(event.EventDate)}</p>
            </div>
            <div className='Event-title'>
                <p className='Event_Text'>{event.EventName}</p>
            </div>
            <div className='Speaker-name'>
                <p>Diễn Giả: </p>
                {speaker.map((item, index) => (
                    <p key={item.name}>
                        {item.name}
                        {index < speaker.length - 1 ? ', ' : ' '}
                    </p>
                ))}
            </div>
            <div className='Event-detail'>

                <p className='Event_Text'>Chiều 26-6, thông tin từ Công an tỉnh Quảng Nam cho hay lực lượng Công an xã Trà Tân, huyện Bắc Trà My vừa hỗ trợ một nam du khách người Hàn Quốc đoàn tụ cùng người thân gia đình sau thời gian bị lạc đường, lạc người thân trong lúc tham quan ở Hội An.
                    Theo đó qua công tác quản lý địa bàn, khoảng 6h30 cùng ngày,
                    lực lượng công an xã này phát hiện một người nước ngoài có các biểu hiện lạ.
                    Chiều 26-6, thông tin từ Công an tỉnh Quảng Nam cho hay lực lượng Công an xã Trà Tân, huyện Bắc Trà My vừa hỗ trợ một nam du khách người Hàn Quốc đoàn tụ cùng người thân gia đình sau thời gian bị lạc đường, lạc người thân trong lúc tham quan ở Hội An.
                    Theo đó qua công tác quản lý địa bàn, khoảng 6h30 cùng ngày,
                    lực lượng công an xã này phát hiện một người nước ngoài có các biểu hiện lạ.
                </p>
                <p className='Event_Text' dangerouslySetInnerHTML={{ __html: decodeHtml(event.EventDescription) }}></p>
            </div>
            <div>
                <div className='Event-title'>
                    <p className='Event_Text'>File tài liệu</p>
                    <div className='Event-file-container'>
                        {documents.map((doc, index) => (
                            <div key={index}>
                                <div>{getFileIcon(doc.DocumentTitle)}</div>
                                <span>{doc.DocumentTitle}</span>
                                <a href={doc.DocumentFilePath} target="_blank" rel="noopener noreferrer">Xem</a>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const detailsElement = document.getElementById('content');
    if (detailsElement) {
        ReactDOM.render(<EventDetail />, detailsElement);
    }
});