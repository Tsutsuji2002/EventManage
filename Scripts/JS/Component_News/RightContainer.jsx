//const Pic = '../../Resources/images/PlayHolder.png';

function Right() {
    const [latestNews, setLatestNews] = React.useState([]);
    const [featuredNews, setFeaturedNews] = React.useState([]);

    React.useEffect(() => {
        fetchNewsData();
    }, []);

    const fetchNewsData = async () => {
        try {
            const response = await fetch('/News/GetLatestAndFeaturedNews');
            const data = await response.json();
            setLatestNews(data.latestNews);
            setFeaturedNews(data.featuredNews);
        } catch (error) {
            console.error('Error fetching news data:', error);
        }
    };

    return (
        <div className='Column_Container_right'>
            <div>
                <b><span className='Type'>Các tin mới nhất</span></b>
            </div>
            <div className="aside-right">
                {latestNews.map((news, index) => (
                    <div key={index} className='aside-around'>
                        <img className='right-pic' src={news.NewsImage ? news.NewsImage : Pic} alt="The holder picture" />
                        <b><a href={`/News/NewsDetails?id=${news.NewsID}`} className='text_link'>
                            <p className='Type'>{news.NewsTitle}</p>
                        </a></b>
                    </div>
                ))}
            </div>
            <div>
                <b><span className='Type'>Các tin nổi bật </span></b>
            </div>
            <div className="aside-right">
                {featuredNews.map((news, index) => (
                    <div key={index} className='aside-around'>
                        <img className='right-pic' src={news.NewsImage ? news.NewsImage : Pic} alt="The holder picture" />
                        <b><a href={`/News/NewsDetails?id=${news.NewsID}`} className='text_link'>
                            <p className='Type'>{news.NewsTitle}</p>
                        </a></b>
                    </div>
                ))}
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const rightElement = document.getElementById('right');
    if (rightElement) {
        ReactDOM.render(<Right />, rightElement);
    }
});