const Pic = '../../Resources/images/PlayHolder.png';
function SeminarRight() {
    const [latestSeminars, setLatestSeminars] = React.useState([]);
    const [featuredSeminars, setFeaturedSeminars] = React.useState([]);

    React.useEffect(() => {
        fetchSeminarData();
    }, []);

    const fetchSeminarData = async () => {
        try {
            const response = await fetch('/Event/GetLatestAndFeaturedSeminars');
            const data = await response.json();
            setLatestSeminars(data.latestSeminars);
            setFeaturedSeminars(data.featuredSeminars);
        } catch (error) {
            console.error('Error fetching Seminar data:', error);
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
        <div className='semi-Column_Container_right'>
            <div>
                <b><span className='semi-Type'>Các cuộc hội thi mới nhất</span></b>
            </div>
            <div className="semi-aside-right">
                {latestSeminars.map((seminar, index) => (
                    <div key={index} className='semi-aside-around'>
                        <img className='right-pic' src={seminar.EventImage ? `../../Resources/images/${seminar.SeminarImage}` : Pic} alt="The holder picture" />
                        <b><a href={`/Event/EventDetails?id=${seminar.EventID}`} className='semi-text_link'>
                            <p className='semi-Type'>{seminar.EventName}</p>
                        </a></b>
                        <div>
                            <p className='semi-text'>Ngày đăng: {formatDate(seminar.CreatedDate)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <b><span className='semi-Type'>Các cuộc hội thi nổi bật</span></b>
            </div>
            <div className="semi-aside-right">
                {featuredSeminars.map((seminar, index) => (
                    <div key={index} className='semi-aside-around'>
                        <img className='right-pic' src={seminar.EventImage ? `../../../Resources/news_images/${seminar.EventImage}` : Pic} alt="The holder picture" />
                        <b><a href={`/Event/EventDetails?id=${seminar.EventID}`} className='semi-text_link'>
                            <p className='semi-Type'>{seminar.EventName}</p>
                        </a></b>
                        <div>
                            <p className='semi-text'>Ngày đăng: {formatDate(seminar.CreatedDate)}</p>
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
        ReactDOM.render(<SeminarRight />, rigthElement);
    }
});