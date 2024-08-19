const LoginIconImg = '../../Resources/images/nav-icon.png';
const AvatarImg = '../../Resources/images/avatar-holder.jpeg';
function AddAccount() {
    const [LoginDrop, setLoginDrop] = React.useState(false);
    const [LoginHint, setLoginHint] = React.useState(false);
    const [formData, setFormData] = React.useState({
        username: '',
        password: '',
        rePassword: ''
    });
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.rePassword) {
            alert('Mật khẩu không khớp!');
            return;
        }
        try {
            const response = await fetch('/Admin/ADAccount/AddAccountData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });
            console.log(formData.password);
            const data = await response.json();
            if (data.success) {
                alert('Tài khoản đã được tạo thành công!');
                setFormData({ username: '', password: '', rePassword: '' });
            } else {
                alert(data.error || 'Có lỗi xảy ra khi tạo tài khoản.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi tạo tài khoản.');
        }
    };

    return (
        <div class="main-panel">
            <div className='body-nav-container'>
                <div className='admin-dropdown'>
                    <img
                        className="picHidden"
                        src={LoginIconImg}
                        alt="my pic"
                        onClick={() => setLoginHint(!LoginHint)}
                    />
                </div>
            </div>
            <div className="AddAccount-container">
                <h1>Thêm tài khoản người dùng</h1>
                <form className='div-form' id="registration-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input
                            className='Account-input'
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu:</label>
                        <input
                            className='Account-input'
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="rePassword">Nhập lại mật khẩu:</label>
                        <input
                            className='Account-input'
                            type="password"
                            name="rePassword"
                            value={formData.rePassword}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <button className='btn-submit' type="submit">Đăng ký</button>
                    </div>
                </form>
            </div>
        </div>
    )
};


document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('main-panel');
    if (contentElement) {
        ReactDOM.render(<AddAccount />, contentElement);
    }
});