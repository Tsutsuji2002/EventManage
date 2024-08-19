function Login() {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const accountName = e.target.elements.accountName.value;
        const password = e.target.elements.password.value;

        console.log(JSON.stringify(accountName));

        try {
            const response = await fetch('/Account/Login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ accountName, password }),
            });

            const result = await response.json();

            if (result.success) {
                window.location.href = '/Home/Index';
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error('Error!', error);
        }
    };

    return (
        <div className='login-container'>
            <div className='login-form'>
                <div className='login-inner-form'>
                    <b><span className='login-text'>Đăng nhập</span></b>
                    <form onSubmit={handleSubmit}>
                        <div className='input-wapper'>
                            <p>Tên đăng nhập :</p>
                            <input name="accountName" className='login-input' type="text" placeholder="Nhập tài khoản của bạn" required />
                        </div>
                        <div className='input-wapper'>
                            <p>Mật khẩu :</p>
                            <input name="password" className='login-input' type="password" placeholder="Nhập mật khẩu của bạn" required />
                        </div>
                        <button type='submit' className='btn-login'>Đăng nhập</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

/*ReactDOM.render(<Login />, document.getElementById("login"));*/
document.addEventListener('DOMContentLoaded', function () {
    const login = document.getElementById('login');
    if (login) {
        ReactDOM.render(<Login />, login);
    }
});