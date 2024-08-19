function LoginAdmin() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const adminName = e.target.elements.adminName.value;
        const adminPassword = e.target.elements.adminPassword.value;
        try {
            const response = await fetch('/Admin/ADLogin/LoginAdmin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ AdminName: adminName, AdminPassword: adminPassword }),
            });
            const result = await response.json();
            if (result.success) {
                window.location.href = result.redirectUrl;
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error!', error);
        }
    };

    return (
        <div className='Admin-login-container'>
            <div className='Admin-login-form'>
                <form onSubmit={handleSubmit} className='Admin-login-inner-form'>
                    <b><span className='Admin-login-text'>Đăng nhập Admin</span></b>
                    <div className='Admin-input-wapper'>
                        <p>Tên đăng nhập :</p>
                        <input
                            className='Admin-login-input'
                            type="text"
                            name="adminName"
                            placeholder="Nhập tài khoản admin của bạn"
                            required
                        />
                    </div>
                    <div className='Admin-input-wapper'>
                        <p>Mật khẩu :</p>
                        <input
                            className='Admin-login-input'
                            type="password"
                            name="adminPassword"
                            placeholder="Nhập mật khẩu của bạn"
                            required
                        />
                    </div>
                    <button type='submit' className='Admin-btn-login'>Đăng nhập</button>
                </form>
            </div>
        </div>
    );
}
document.addEventListener('DOMContentLoaded', function () {
    const loginElement = document.getElementById('login-admin');
    if (loginElement) {
        ReactDOM.render(<LoginAdmin />, loginElement);
    }
});
