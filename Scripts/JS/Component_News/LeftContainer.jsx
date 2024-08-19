function Left() {
    const [listNewsType, setListNewsType] = React.useState([]);
    const [searchQuery, setSearchQuery] = React.useState('');

    React.useEffect(() => {
        fetch('/Home/NewsTypeAccess')
            .then(response => response.json())
            .then(data => setListNewsType(data))
            .catch(error => console.error('Có lỗi khi tải dữ liệu', error));
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = `/News/SearchNewsResult?query=${encodeURIComponent(searchQuery)}`;
    };

    return (
        <div className='Column_Container'>
            <div className='search_container'>
                <div className='Search_form'>
                    <form onSubmit={handleSearch}>
                        <input
                            className='input_text'
                            type="search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Nhập từ khóa...."
                        />
                        <div className='btn_container'>
                            <button className='btn_search' type="submit">Tìm kiếm</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='Type_Text'>
                <b><span className='Type'>Thể loại</span></b>
            </div>
            <div className="aside-left">
                <div className='News_Select'>
                    {listNewsType.map((litem, lindex) => (
                        <b key={lindex}>
                            <a href={`/News/SearchByType?id=${litem.NewsTypeID}`} className="News_A">
                                <span className='News_Types'>{litem.NewsTypeName}</span>
                            </a>
                        </b>
                    ))}
                </div>
            </div>
        </div>
    );
}
document.addEventListener('DOMContentLoaded', function () {
    const leftElement = document.getElementById('left');
    if (leftElement) {
        ReactDOM.render(<Left />, leftElement);
    }
});