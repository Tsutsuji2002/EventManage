const Pic = '../../Resources/images/PlayHolder.png';
const itemPic = '../../Resources/images/PlayHolder.png';
function Slider({ slides }) {
    const [currentSlide, setCurrentSlide] = React.useState(0);

    React.useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prevSlide) =>
                prevSlide === slides.length - 1 ? 0 : prevSlide + 1
            );
        }, 3000);

        return () => clearInterval(timer);
    }, [slides]);

    const nextSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === slides.length - 1 ? 0 : prevSlide + 1
        );
    };

    const prevSlide = () => {
        setCurrentSlide((prevSlide) =>
            prevSlide === 0 ? slides.length - 1 : prevSlide - 1
        );
    };

    return (
        <div className="slider-div">
            {slides.map((slide, index) => (
                    <img
                        key={index}
                        src={slide.image || Pic}
                    alt={slide.alt}
                    className={index === currentSlide ? 'slide active' : 'slide'}
                        onClick={(e) => handleNewsbyIDLinkClick(e, slide.link)}
                    />
            ))}
            <button
                className="prev"
                onClick={prevSlide}
            >
                &#10094;
            </button>
            <button
                className="next"
                onClick={nextSlide}
            >
                &#10095;
            </button>
        </div>
    );
}



function handleNewsbyIDLinkClick(event, link) {
    event.preventDefault();
    window.location.href = link;
}

function Content(props) {
    const [news, setNews] = React.useState([]);
    const [slides, setSlides] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 10;

    React.useEffect(() => {
        fetch('/Home/GetAllNews')
            .then(response => response.json())
            .then(data => setNews(data))
            .catch(error => console.error('Error loading news data:', error));
    }, []);

    React.useEffect(() => {
        fetchSlides();
    }, []);

    const fetchSlides = async () => {
        try {
            const response = await fetch('/Home/GetSlides');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            const formattedSlides = data.map(slide => ({
                image: slide.SliderImage,
                alt: slide.SliderName,
                link: slide.SliderLink,
                order: slide.Order
            }));

            setSlides(formattedSlides);
        } catch (error) {
            console.error('Error fetching slides:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = news.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className='news-content'>
            <div className='slider-slide'>
                    <Slider slides={slides} />
            </div>
            <div className="News_container">
                {currentItems.map((item, index) => (
                    <div key={index} className="News_Item">
                        <img className='Pic_item' src={item.NewsImage ? item.NewsImage : itemPic} alt={item.NewsTitle} />
                        <div className='text_div'>
                            <a href={`/News/NewsDetails?id=${item.NewsID}`} className='text_link'>
                                <b className='text_item'>{item.NewsTitle}</b>
                            </a>
                        </div>
                    </div>
                ))}
            </div>
            {news.length > itemsPerPage && (
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
                        {[...Array(Math.ceil(news.length / itemsPerPage))].map((_, i) => (
                            <a key={i} onClick={() => paginate(i + 1)} style={{ cursor: 'pointer' }}>
                                {i + 1}
                            </a>
                        ))}
                    </div>
                    <button
                        className='PagesButton'
                        onClick={() => paginate(currentPage + 1) }
                        disabled={currentPage === Math.ceil(news.length / itemsPerPage)}
                    >
                        Next
                        </button>
                        </div>
                </div>
            )}
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('content');
    if (contentElement) {
        ReactDOM.render(<Content />, contentElement);
    }
});
