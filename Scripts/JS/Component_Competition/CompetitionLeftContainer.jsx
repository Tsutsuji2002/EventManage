function CompetitionLeft() {

    return (
        <div className='compe-Column_Container'>
            <div className='compe-search_container'>
                <div className='compe-Search_form'>
                    <form action="/search">
                        <input className='compe-input_text' type="search" name="query" placeholder="Nhập từ khóa...." />
                        <div className='compe-btn_container'>
                            <button className='compe-btn_search' type="submit">Tìm kiếm</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='compe-Type_Text'>
                <b><span className='compe-Type'>Hội thi</span></b>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const leftElement = document.getElementById('left');
    if (leftElement) {
        ReactDOM.render(<CompetitionLeft />, leftElement);
    }
});