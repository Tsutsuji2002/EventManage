const Pic = '../../Resources/images/PlayHolder.png';

function CompetitionRight() {
    const [latestCompetitions, setLatestCompetitions] = React.useState([]);
    const [featuredCompetitions, setFeaturedCompetitions] = React.useState([]);

    React.useEffect(() => {
        fetchCompetitionData();
    }, []);

    const fetchCompetitionData = async () => {
        try {
            const response = await fetch('/Event/GetLatestAndFeaturedCompetitions');
            const data = await response.json();
            setLatestCompetitions(data.latestCompetitions);
            setFeaturedCompetitions(data.featuredCompetitions);
        } catch (error) {
            console.error('Error fetching competition data:', error);
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
        <div className='compe-Column_Container_right'>
            <div>
                <b><span className='compe-Type'>Các cuộc hội thi mới nhất</span></b>
            </div>
            <div className="compe-aside-right">
                {latestCompetitions.map((competition, index) => (
                    <div key={index} className='compe-aside-around'>
                        <img className='right-pic' src={competition.EventImage ? `../../Resources/images/${competition.CompetitionImage}` : Pic} alt="The holder picture" />
                        <b><a href={`/Event/EventDetails?id=${competition.EventID}`} className='compe-text_link'>
                            <p className='compe-Type'>{competition.EventName}</p>
                        </a></b>
                        <div>
                            <p className='compe-text'>Ngày đăng: {formatDate(competition.CreatedDate)}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <b><span className='compe-Type'>Các cuộc hội thi nổi bật</span></b>
            </div>
            <div className="compe-aside-right">
                {featuredCompetitions.map((competition, index) => (
                    <div key={index} className='compe-aside-around'>
                        <img className='right-pic' src={competition.EventImage ? `../../../Resources/news_images/${competition.EventImage}` : Pic} alt="The holder picture" />
                        <b><a href={`/Event/EventDetails?id=${competition.EventID}`} className='compe-text_link'>
                            <p className='compe-Type'>{competition.EventName}</p>
                        </a></b>
                        <div>
                            <p className='compe-text'>Ngày đăng: {formatDate(competition.CreatedDate)}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const rightElement = document.getElementById('right');
    if (rightElement) {
        ReactDOM.render(<CompetitionRight />, rightElement);
    }
});
