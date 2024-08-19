function SearchType() {
    const [searchResults, setSearchResults] = React.useState([]);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [typeId, setTypeId] = React.useState(null);
    const [typeName, setTypeName] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const itemsPerPage = 10;

    React.useEffect(() => {
        const contentDiv = document.getElementById('content');
        const typeName = contentDiv.getAttribute('data-type-name');
        setTypeName(typeName);
    }, []);

    React.useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');
        if (id) {
            setTypeId(id);
            fetchSearchResults(id);
        } else {
            setIsLoading(false);
        }
    }, []);

    const fetchSearchResults = (id) => {
        setIsLoading(true);
        fetch(`/News/GetNewsByType?id=${encodeURIComponent(id)}`)
            .then(response => response.json())
            .then(data => {
                setSearchResults(data.news || []);
                setCurrentPage(1);
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching news by type', error);
                setSearchResults([]);
                setIsLoading(false);
            });
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = searchResults.slice(indexOfFirstItem, indexOfLastItem);
    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (isLoading) {
        return <p>Đang tải...</p>;
    }

    return (
        <div>
            {searchResults.length === 0 ? (
                <p className="no-results">Không tìm thấy kết quả nào cho thể loại {typeName}</p>
            ) : (
                <>
                    <p className='SearchType_P'>Tìm kiếm theo thể loại: {typeName}</p>
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
        ReactDOM.render(<SearchType />, contentElement);
    }
});
