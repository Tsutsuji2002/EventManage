const Pic = '../../Resources/images/PlayHolder.png';

function ConferenceRight() {
    const [latestConferences, setLatestConferences] = React.useState([]);
    const [featuredConferences, setFeaturedConferences] = React.useState([]);

    React.useEffect(() => {
        fetchConferenceData();
    }, []);

    const fetchConferenceData = async () => {
        try {
            const response = await fetch('/Event/GetLatestAndFeaturedConferences');
            const data = await response.json();
            setLatestConferences(data.latestConferences);
            setFeaturedConferences(data.featuredConferences);
        } catch (error) {
            console.error('Error fetching Conference data:', error);
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

    return (
        <div className='confe-Column_Container_right'>
            <div>
                <b><span className='confe-Type'>Các cuộc hội thi mới nhất</span></b>
            </div>
            <div className="confe-aside-right">
                {latestConferences.map((conference, index) => (
                    <div key={index} className='confe-aside-around'>
                        <img className='right-pic' src={conference.EventImage ? `../../Resources/images/${conference.ConferenceImage}` : Pic} alt="The holder picture" />
                        <b><a href={`/Event/EventDetails?id=${conference.EventID}`} className='confe-text_link'>
                            <p className='confe-Type'>{conference.EventName}</p>
                        </a></b>
                        <div>
                            <p className='confe-text'>Ngày đăng: {formatDate(conference.CreatedDate)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <b><span className='confe-Type'>Các cuộc hội thi nổi bật</span></b>
            </div>
            <div className="confe-aside-right">
                {featuredConferences.map((conference, index) => (
                    <div key={index} className='confe-aside-around'>
                        <img className='right-pic' src={conference.EventImage ? `../../../Resources/news_images/${conference.EventImage}` : Pic} alt="The holder picture" />
                        <b><a href={`/Event/EventDetails?id=${conference.EventID}`} className='confe-text_link'>
                            <p className='confe-Type'>{conference.EventName}</p>
                        </a></b>
                        <div>
                            <p className='confe-text'>Ngày đăng: {formatDate(conference.CreatedDate)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
document.addEventListener('DOMContentLoaded', function () {
    const rigthElement = document.getElementById('right');
    if (rigthElement) {
        ReactDOM.render(<ConferenceRight />, rigthElement);
    }
});