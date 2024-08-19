const userImage = '../../../Resources/images/avatar-holder.jpeg';
const ImgHidden = '../../../Resources/images/nav-icon.png';

function UserAside() {
    const [openDropdown, setOpenDropdown] = React.useState(null);

    const toggleDropdown = (index) => {
        if (openDropdown === index) {
            setOpenDropdown(null);
        } else {
            setOpenDropdown(index);
        }
    };

    const options = [
        {
            name: 'Thông tin',
            items: [
                { name: 'Thông tin cá nhân', href: '#' },
                { name: 'Sửa thông tin', href: '#' }
            ]
        },
        {
            name: 'Danh sách tạo',
            items: [
                { name: 'Tin Tức', href: '#' },
                { name: 'Hội nghị', href: '#' },
                { name: 'Hội thảo', href: '#' },
                { name: 'Hội thi', href: '#' }
            ]
        },
        {
            name: 'Danh sách đăng kí',
            items: [
                { name: 'Hội nghị', href: '#' },
                { name: 'Hội thảo', href: '#' },
                { name: 'Hội thi', href: '#' }
            ]
        },
    ];

    return (
        <div className="user-sidebar-content" id="userhome">
            <a href="/user-home">User Home</a>
            <div style={{ border: "1px solid", opacity: "0.5" }}></div>
            <div className='option-user'>
                {options.map((option, index) => (
                    <div key={index}>
                        <a href="#" onClick={(e) => {
                            e.preventDefault();
                            toggleDropdown(index);
                        }}>
                            {option.name}
                        </a>
                        {openDropdown === index && (
                            <ul>
                                {option.items.map((item, itemIndex) => (
                                    <li key={itemIndex}>
                                        <a href={item.href}>{item.name}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
function UserInfo() {
    const [UserImage, setUserImage] = React.useState(false);
    const [userData, setUserData] = React.useState();

    React.useEffect(() => {
        fetch('/User/UserDataAccess')
            .then(response => response.json())
            .then(data => {
                if (data.redirectToUrl) {
                    window.location.href = data.redirectToUrl;
                } else {
                    setUserData(data.user);
                    console.log("Received user data:", JSON.stringify(data.user));
                }
            })
            .catch(error => console.error('Có lỗi khi tải dữ liệu', error));
    }, []);

    return (
        <div className="user-wrapper">
            <div className="user-sidebar">
                <UserAside />
            </div>
            <div className='user-outside'>
                <img src={ImgHidden} alt='hidden image' className='hiddenimg' onClick={() => setUserImage(!UserImage)} />
                <div className='user-aside-drop' style={{ display: UserImage ? 'block' : 'none' }}>
                    <UserAside />
                </div>
                <div className="user-main-panel">
                    <div className='user-container'>
                        <div className='user-image-container'>
                            <img src={userImage} alt='user holder image' className='user-image-holder' />
                        </div>
                        <div className='user-info'>
                            {userData ? (
                                <>
                                    <div>
                                        <span>Họ và tên: </span>
                                        <span>Email: </span>
                                        <span>Địa chỉ: </span>
                                        <span>Số điện thoại: </span>
                                    </div>
                                    <div>
                                        <span>{userData.userName}</span>
                                        <span>{userData.userEmail}</span>
                                        <span>{userData.userAddress}</span>
                                        <span>{userData.userPhone}</span>
                                    </div>
                                </>
                            ) : (
                                <span>Đang tải dữ liệu người dùng...</span>
                            )}
                        </div>
                        <span className='user-edit-button'><a href='UProfileUpdate'>Chỉnh sửa</a></span>
                    </div>
                </div>
            </div>
        </div>
    );
}
document.addEventListener('DOMContentLoaded', function () {
    const userElement = document.getElementById('user-content');
    if (userElement) {
        ReactDOM.render(<UserInfo />, userElement);
    }
});