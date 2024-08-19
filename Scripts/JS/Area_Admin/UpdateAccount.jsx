function EditAccount({ accountId }) {
    const [username, setUsername] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [confirmPassword, setConfirmPassword] = React.useState('');

    React.useEffect(() => {
        if (accountId) {
            fetch(`/ADAccount/GetAccountDetails?id=${accountId}`)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        setUsername(data.account.username);
                    } else {
                        alert(data.message);
                    }
                });
        }
    }, [accountId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Mật khẩu không khớp");
            return;
        }
        try {
            const response = await fetch('/ADAccount/UpdateAccountData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: accountId,
                    username: username,
                    password: password
                })
            });
            const data = await response.json();
            if (data.success) {
                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            alert('Không thể cập nhật tài khoản');
        }
    };

    return (
        <div className="main-panel">
            <div className="Account-container">
                <h1>Thay đổi thông tin tài khoản</h1>
                <form className='div-form' id="registration-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập:</label>
                        <input
                            className='Account-input'
                            type="text"
                            id="username"
                            name="username"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            readOnly
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu mới:</label>
                        <input
                            className='Account-input'
                            type="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Nhập lại mật khẩu mới:</label>
                        <input
                            className='Account-input'
                            type="password"
                            name="confirm-password"
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <button className='btn-submit' type="submit">Thay đổi</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('main-panel');
    if (contentElement) {
        ReactDOM.render(<EditAccount />, contentElement);
    }
});