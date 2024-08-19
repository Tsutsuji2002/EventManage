function SearchContent() {
    const [searchResults, setSearchResults] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');
    const [currentPage, setCurrentPage] = React.useState(1);
    const [noResultsFound, setNoResultsFound] = React.useState(false);
    const itemsPerPage = 10;

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const query = urlParams.get('query').toString();
        if (query) {
            setSearchQuery(query);
            fetchSearchResults(query);
        }
    }, []);

    const fetchSearchResults = (query) => {
        fetch(`/News/SearchNews?query=${encodeURIComponent(query).toString()}`)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data.news);
                setCurrentPage(1);
                setNoResultsFound(data.news.length === 0);
            })
            .catch(error => {
                console.error('Error searching news', error);
                setNoResultsFound(true);
            });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div>
            {noResultsFound ? (
                <p className="SearchType_P">Không tìm thấy kết quả nào cho "{searchQuery}"</p>
            ) : (
                <>
                    <p className='SearchType_P'>Kết quả tìm kiếm cho: {searchQuery}</p>
                    <div className="News_container">
                        {currentItems.map((item, index) => (
                            <div className="News_Item" key={index}>
                                <img className='Pic_item' src={item.NewsImage ? item.NewsImage : Pic} alt={item.NewsTitle} />
                                <div className='text_div'>
                                    <a href={`/News/NewsDetails/${item.NewsID}`} className='text_link'>
                                        <b className='text_item'>{item.NewsTitle}</b>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                    {searchResults.length > itemsPerPage && (
                        <div className='pagination'>
                            <button
                                className='PagesButton'
                                onClick={() => paginate(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Pre
                            </button>
                            <div className='pagesNum'>
                                {[...Array(Math.ceil(searchResults.length / itemsPerPage))].map((_, i) => (
                                    <a key={i} onClick={() => paginate(i + 1)} style={{ cursor: 'pointer' }}>
                                        {i + 1}
                                    </a>
                                ))}
                            </div>
                            <button
                                className='PagesButton'
                                onClick={() => paginate(currentPage + 1)}
                                disabled={currentPage === Math.ceil(searchResults.length / itemsPerPage)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('content');
    if (contentElement) {
        ReactDOM.render(<SearchContent />, contentElement);
    }
});
