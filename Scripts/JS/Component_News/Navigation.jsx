const navIcon = '../../Resources/images/nav-icon.png';
const Avatar = '../../Resources/images/avatar-holder.jpeg';

console.log("Navigation.jsx loaded");
function confirmSignOut() {
    if (confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
        signOut();
    }
}
function handleNavLinkClick(event, navLink) {
    event.preventDefault();
    window.location.href = navLink;
}

function handleProfileClick(event) {
    event.preventDefault();
    window.location.href = '/User/UProfile';
}

function signOut() {
    fetch('/Account/SignOut', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert(data.message);
                window.location.href = '/Home/Index';
            } else {
                alert("Đăng xuất không thành công: " + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Đã xảy ra lỗi khi đăng xuất.");
        });
}
function Nav() {
    const [isDrop, setIsDrop] = React.useState(false);
    const [Drop, setDrop] = React.useState(false);
    const [navItems, setNavItems] = React.useState([]);
    const [listNewsType, setListNewsType] = React.useState([]);
    const [AvatarDrop, setAvatarDrop] = React.useState(false);
    const [userSession, setUserSession] = React.useState(null);

    console.log("Nav component rendering");

    React.useEffect(() => {
        fetch('/Home/NavDataAccess')
            .then(response => response.json())
            .then(data => {
                setNavItems(data)
            })
            .catch(error => console.error('Có lỗi khi tải dữ liệu', error));
    }, []);

    React.useEffect(() => {
        axios.get('/Home/NewsTypeAccess')
            .then(response => {
                setListNewsType(response.data);
            })
            .catch(error => {
                if (error.response) {
                    console.error('Server responded with:', error.response.status, error.response.data);
                } else if (error.request) {
                    console.error('No response received:', error.request);
                } else {
                    console.error('Error setting up request:', error.message);
                }
            });
    }, []);

    React.useEffect(() => {
        fetch('/Home/UserAvatarPartial')
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => {
                        throw new Error(text);
                    });
                }
                return response.json();
            })
            .then(data => {
                console.log("Received user data:", JSON.stringify(data));
                if (data && data.user) {
                    setUserSession(data.user);
                }
            })
            .catch(error => {
                console.error('Có lỗi khi tải dữ liệu', error);
            });
    }, []);

    return (
        <header className="App-header">
            <nav className="App-nav">
                <img src={navIcon} alt="User Icon" className="resize-button" onClick={() => setIsDrop(!isDrop)} style={{ cursor: 'pointer' }} />
                <div className='nav-div-block'>
                    {navItems.map((item, index) => (
                        <b key={index}><a className="nav-a" onClick={(e) => handleNavLinkClick(e, item.NavLink)}>{item.NavName}</a></b>
                    ))}
                </div>
                <span id="drop" onClick={() => setDrop(!Drop)}>Tin Tức</span>
                {userSession && (
                    <div className='avatar-container'>
                        <div className='avatar-inner'>
                            <img src={Avatar} alt="User holder image" onClick={() => setAvatarDrop(!AvatarDrop)} className='userHolder' />
                            <span>{userSession.UserName}</span>
                        </div>
                        <div className='avatardrop' style={{ display: AvatarDrop ? 'flex' : 'none' }}>
                            <span><a onClick={handleProfileClick}>Thông tin cá nhân</a></span>
                            <span><a onClick={(e) => handleNavLinkClick(e, '/User/EventEditor')}>Tạo bài viết</a></span>
                            <span><a onClick={(e) => handleNavLinkClick(e, '/User/NewsEditor')}>Thêm tin tức</a></span>
                            <span><a onClick={(e) => handleNavLinkClick(e, '/User/UserEventList')}>Danh sách sự kiện</a></span>
                            <span><a onClick={(e) => handleNavLinkClick(e, '/User/UserNewsList')}>Danh sách tin tức</a></span>
                            <span><a onClick={(e) => handleNavLinkClick(e, '/User/UserEventManage')}>Sự kiện đã đăng ký tham dự</a></span>
                            <span><a onClick={confirmSignOut} style={{ cursor: 'pointer' }}>Đăng xuất</a></span>
                        </div>
                    </div>
                )}
            </nav>
            <div className='dropdown-menu' style={{ display: isDrop ? 'flex' : 'none' }}>
                <div className='drop-a'>
                    <form action="/search" className='formSearch'>
                        <input className='nav_input_text' type="search" name="query" placeholder="Nhập từ khóa...." />
                        <button className='nav_btn_search' type="submit">Tìm kiếm</button>
                    </form>
                    {listNewsType.map((litem, lindex) => (
                        <b key={lindex}><a href={litem.NewsTypeLink} className="nav-a">{litem.NewsTypeName}</a></b>
                    ))}
                </div>
            </div>
            <div className='dropdown-menu' style={{ display: Drop ? 'flex' : 'none' }}>
                <div className="drop-a">
                    {navItems.map((item, index) => (
                        <b key={index}><a onClick={(e) => handleNavLinkClick(e, item.NavLink)} className="nav-a">{item.NavName}</a></b>
                    ))}
                </div>
            </div>
        </header>
    )
}

document.addEventListener('DOMContentLoaded', function () {
    const navElement = document.getElementById('nav');
    if (navElement) {
        ReactDOM.render(<Nav />, navElement);
    }
});