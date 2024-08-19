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
function InfoUpdate() {
    const [UserHin, setUserHin] = React.useState(false);
    const [userData, setUserData] = React.useState({
        UserName: '',
        UserEmail: '',
        UserAddress: '',
        UserPhone: ''
    });

    React.useEffect(() => {
        fetch('/User/UserDataAccess')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.redirectToUrl) {
                    window.location.href = data.redirectToUrl;
                } else {
                    setUserData({
                        UserName: data.user.UserName || '',
                        UserEmail: data.user.UserEmail || '',
                        UserAddress: data.user.UserAddress || '',
                        UserPhone: data.user.UserPhone || ''
                    });
                }
            })
            .catch(error => console.error('Có lỗi khi tải dữ liệu', error));
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/User/UpdateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Unknown error occurred');
            }
            const result = await response.json();
            if (result.success) {
                setUserData(result.user);
                alert('Cập nhật hồ sơ thành công!');
            } else {
                alert(result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra trong quá trình cập nhật thông tin người dùng: ' + error.message);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    return (
        <div className="update-user-wrapper">
            <div className="update-user-sidebar">
                <UserAside />
            </div>
            <div className='update-user-outside'>
                <img src={ImgHidden} alt='hidden image' className='hiddenimg' onClick={() => setUserHin(!UserHin)} />
                <div className='update-user-aside-drop' style={{ display: UserHin ? 'block' : 'none' }}>
                    <UserAside />
                </div>
                <div className="update-user-main-panel">
                    <div className='update-user-container'>
                        <div className='update-user-image-container'>
                            <img src={userImage} alt='user holder image' className='update-user-image-holder' />
                        </div>
                        <form className='update-user-info' onSubmit={handleSubmit}>
                            <div>
                                <span>Họ và tên: </span>
                                <span>Email: </span>
                                <span>Địa chỉ: </span>
                                <span>Số điện thoại: </span>
                            </div>
                            <div className='input-container'>
                                <input type="text" name="UserName" value={userData.UserName || ''} onChange={handleInputChange} placeholder="Nhập tên của bạn" required />
                                <input type="email" name="UserEmail" value={userData.UserEmail || ''} onChange={handleInputChange} placeholder="Nhập email của bạn" required />
                                <input type="text" name="UserAddress" value={userData.UserAddress || ''} onChange={handleInputChange} placeholder="Nhập địa chỉ của bạn" required />
                                <input type="text" name="UserPhone" value={userData.UserPhone || ''} onChange={handleInputChange} placeholder="Nhập số điện thoại" required />
                            </div>
                          
                        </form>
                        <button type="submit" className='update-user-edit-button'>Xác nhận</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const userElement = document.getElementById('user-update');
    if (userElement) {
        ReactDOM.render(<InfoUpdate />, userElement);
    }
});