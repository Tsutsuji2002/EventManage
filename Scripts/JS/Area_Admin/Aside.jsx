const AsidePic = '../../Resources/images/avatar-holder.jpeg';

function Aside() {
    const [adminInfo, setAdminInfo] = React.useState({ name: '', role: '' });
    const [AdminHint, setAdminHint] = React.useState(false);

    function handleNavLinkClick(event, navLink) {
        event.preventDefault();
        window.location.href = navLink;
    }

    React.useEffect(() => {
        fetch('/Admin/ADAccount/GetAdminInfo')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    setAdminInfo({ name: data.name, role: data.role });
                }
            })
            .catch(error => console.error('Không tìm được dữ liệu admin:', error));
    }, []);

    return (
        <div className='admin-container'>
                <div class="admin-sidebar" style={{ display: AdminHint ? 'none' : 'block' }}>
                <div className='admin-aside-pic-container'>
                    <img src={AsidePic} alt='avatar-pic-aside' className='aside-avatar' />
                    <div>
                        <span id="aside-name">{adminInfo.name}</span>
                        <span id="aside-role">Quyền: {adminInfo.role}</span>
                    </div>
                </div>
                <span>Option</span>
                <div className='option-admin'>
                    <a onClick={(e) => handleNavLinkClick(e, '/Admin/ADAccount/AccountManage')}>Quản lý tài Khoản</a>
                    <a onClick={(e) => handleNavLinkClick(e, '/Admin/ADNews/NewsList')}>Quản lý tin Tức</a>
                    <a onClick={(e) => handleNavLinkClick(e, '/Admin/ADEvent/EventList')}>Quản lý sự kiện</a>
                    <a onClick={(e) => handleNavLinkClick(e, '/Admin/ADGeneral/SliderEditor')}>Slider</a>
                </div>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const aside = document.getElementById('aside');
    if (aside) {
        ReactDOM.render(<Aside />, aside);
    }
});