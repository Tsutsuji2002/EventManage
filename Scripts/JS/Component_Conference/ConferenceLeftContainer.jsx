function ConferenceLeft() {

    return (
        <div className='confe-Column_Container'>
            <div className='confe-search_container'>
                <div className='confe-Search_form'>
                    <form action="/search">
                        <input className='confe-input_text' type="search" name="query" placeholder="Nhập từ khóa...." />
                        <div className='confe-btn_container'>
                            <button className='confe-btn_search' type="submit">Tìm kiếm</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='confe-Type_Text'>
                <b><span className='confe-Type'>Hội nghị</span></b>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const leftElement = document.getElementById('left');
    if (leftElement) {
        ReactDOM.render(<ConferenceLeft />, leftElement);
    }
});