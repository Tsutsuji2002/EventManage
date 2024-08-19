function SeminarLeft() {

    return (
        <div className='semi-Column_Container'>
            <div className='semi-search_container'>
                <div className='semi-Search_form'>
                    <form action="/search">
                        <input className='semi-input_text' type="search" name="query" placeholder="Nhập từ khóa...." />
                        <div className='semi-btn_container'>
                            <button className='semi-btn_search' type="submit">Tìm kiếm</button>
                        </div>
                    </form>
                </div>
            </div>
            <div className='semi-Type_Text'>
                <b><span className='semi-Type'>Hội Thảo</span></b>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const leftElement = document.getElementById('left');
    if (leftElement) {
        ReactDOM.render(<SeminarLeft />, leftElement);
    }
});