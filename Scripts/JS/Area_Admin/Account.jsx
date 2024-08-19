const IconHidden = '../../Resources/images/nav-icon.png';
const AccountAvatar = '../../Resources/images/avatar-holder.jpeg';

function ConfirmModal({ isOpen, onClose, onConfirm, message }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay" style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div className="modal-content" style={{
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '5px',
                maxWidth: '400px',
                width: '100%'
            }}>
                <p>{message}</p>
                <div className="modal-buttons" style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginTop: '20px'
                }}>
                    <button onClick={onConfirm} style={{
                        marginRight: '10px',
                        padding: '5px 10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}>Xác nhận</button>
                    <button onClick={onClose} style={{
                        padding: '5px 10px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3px',
                        cursor: 'pointer'
                    }}>Hủy</button>
                </div>
            </div>
        </div>
    );
}

function Account() {
    const [AdminHint, setAdminHint] = React.useState(false);
    const [accountDetail, setAccountDetail] = React.useState([]);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = React.useState(false);
    const [accountToDelete, setAccountToDelete] = React.useState(null);
    const [EditAccount, setEditAccount] = React.useState(false);
    const [ShowAccount, setShowAccount] = React.useState(false);
    const [AddAccount, setAddAccount] = React.useState(false);
    const [selectedAccountDetails, setSelectedAccountDetails] = React.useState(null);
    const [editingAccount, setEditingAccount] = React.useState(null);
    const [newPassword, setNewPassword] = React.useState('');
    const [activeSection, setActiveSection] = React.useState(null);
    const [confirmPassword, setConfirmPassword] = React.useState('');
    const [showPassword, setShowPassword] = React.useState(false);
    const [roleList, setRoleList] = React.useState([]);
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedRole, setSelectedRole] = React.useState('');
    const [selectedRoles, setSelectedRoles] = React.useState([]);

    const fetchUserRoles = (userId) => {
        if (!userId) {
            console.error('User ID is undefined');
            return;
        }

        fetch(`/Admin/ADAccount/GetUserRoles?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSelectedRoles(data.roles.map(role => role.RoleID));
                } else {
                    console.error('Failed to fetch user roles:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching user roles:', error);
            });
    };

    const fetchAllRoles = () => {
        fetch('/Admin/ADAccount/GetAllRoles')
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setRoleList(data.roles);
                } else {
                    console.error('Failed to fetch roles:', data.message);
                }
            })
            .catch(error => {
                console.error('Error fetching roles:', error);
            });
    };

    const toggleSection = (section) => {
        setActiveSection(activeSection === section ? null : section);
    };

    const togglePassword = (id) => {
        setShowPassword(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleRoleChange = (roleId) => {
        setSelectedRoles(prevRoles =>
            prevRoles.includes(roleId)
                ? prevRoles.filter(id => id !== roleId)
                : [...prevRoles, roleId]
        );
    };
    const updateUserRoles = async (userId, roles) => {
        try {
            const formData = new FormData();
            formData.append('userId', userId);
            roles.forEach((role, index) => {
                formData.append(`roles[${index}]`, role);
            });

            const response = await fetch('/Admin/ADAccount/UpdateUserRoles', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                console.log('User roles updated successfully');
            } else {
                console.error('Failed to update user roles:', data.message);
            }
        } catch (error) {
            console.error('Error updating user roles:', error);
        }
    };


    React.useEffect(() => {
        fetch('/Admin/ADAccount/GetAccountList')
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    console.error(data.error);
                } else {
                    setAccountDetail(data.accountList);

                    if (data.accountList.length > 0) {
                        fetchUserRoles(data.accountList[0].UserID);
                    }
                }
            })
            .catch(error => console.error('Không tìm được danh sách tài khoản:', error));

        fetchAllRoles();
    }, []);

    const handleEditAccount = (account) => {
        setEditingAccount(account);
        setNewPassword('');
        setConfirmPassword('');
        fetchUserRoles(account.UserID);
        fetchAccountWithUserDetails(account.AccountID);
        toggleSection('edit');
    };

    const handleAddAccount = async (e) => {
        window.location.href = `/Admin/ADAccount/AddAccount`;
        
    };

    const handleShowAccountDetails = (accountId) => {
        fetchAccountWithUserDetails(accountId);
        toggleSection('show');
    };

    const handleUpdateAccount = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            alert("Mật khẩu không khớp");
            return;
        }
        try {
            const response = await fetch('/Admin/ADAccount/UpdateAccountData', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    accountId: editingAccount.AccountID,
                    username: editingAccount.AccountName,
                    password: newPassword || editingAccount.Password
                })
            });
            console.log(selectedRoles);
            const data = await response.json();
            if (data.success) {
                setAccountDetail(prevAccounts => prevAccounts.map(acc =>
                    acc.AccountID === editingAccount.AccountID ? { ...acc, Password: newPassword || acc.Password } : acc
                ));
                await updateUserRoles(editingAccount.UserID, selectedRoles);

                alert(data.message);
                setEditAccount(false);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Có lỗi xảy ra khi cập nhật tài khoản.');
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const openConfirmModal = (accountID) => {
        setAccountToDelete(accountID);
        setIsConfirmModalOpen(true);
    };

    const closeConfirmModal = () => {
        setIsConfirmModalOpen(false);
        setAccountToDelete(null);
    };

    const confirmDelete = () => {
        if (accountToDelete) {
            deleteAccount(accountToDelete);
            closeConfirmModal();
        }
    };

    const deleteAccount = (accountID) => {
        fetch(`/Admin/ADAccount/DeleteAccount?accountID=${accountID}`, {
            method: 'POST',
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    setAccountDetail(prevAccounts => prevAccounts.filter(account => account.AccountID !== accountID));
                } else {
                    alert(data.error);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi xóa tài khoản. An error occurred while trying to delete the account.');
            });
    };

    const fetchAccountWithUserDetails = (accountId) => {
        fetch(`/Admin/ADAccount/GetAccountWithUserDetails?accountId=${accountId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    setSelectedAccountDetails(data);
                    console.log(data);
                    setShowAccount(!ShowAccount);
                } else {
                    alert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Có lỗi xảy ra khi lấy thông tin tài khoản và người dùng.');
            });
    };

    return (
        <div className="main-panel">
            <div className='body-nav-container'>
                <div>
                    <img
                        className="picHidden"
                        src={IconHidden}
                        alt="my pic"
                        onClick={() => setAdminHint(!AdminHint)}
                    />
                </div>
            </div>

            <div className='Account-right-container'>
                <div className="container-admin-table">
                    <div className="page-inner">
                        <div className="card">
                            <div className="card-header">
                                <button className='addbutton' onClick={() => handleAddAccount()}>Thêm tài khoản</button>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table id='Account-table'>
                                        <thead>
                                            <tr>
                                                <th className='table-id'>ID</th>
                                                <th>Tài khoản</th>
                                                <th>Mật khẩu</th>
                                                <th>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {accountDetail.map((account) => (
                                                <tr key={account.AccountID}>
                                                    <td>{account.AccountID}</td>
                                                    <td>{account.AccountName}</td>
                                                    <td>
                                                        <div className="Password-column">
                                                            <span>{showPassword[account.AccountID] ? account.Password : '••••••••'}</span>
                                                            <button className='toggle-password' onClick={() => togglePassword(account.AccountID)}>
                                                                <i className={`fa-solid ${showPassword[account.AccountID] ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                                                            </button>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <button className='btn-edit' id="btn-fix" onClick={() => handleEditAccount(account)}>Sửa</button>
                                                        <button className='btn-edit' id="btn-delete" onClick={() => openConfirmModal(account.AccountID)}>Xóa</button>
                                                        <button className='btn-edit' id="btn-info" onClick={() => handleShowAccountDetails(account.AccountID)}>Thông tin</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='container-account-block'>
                    <div className="Account-Edit-container" style={{ display: activeSection === 'edit' ? 'block' : 'none' }}>
                        {editingAccount && (
                            <form onSubmit={handleUpdateAccount}>
                                <div>
                                    <label htmlFor="username">Tên đăng nhập:</label>
                                    <input
                                        className='Account-input'
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={editingAccount.AccountName}
                                        readOnly
                                    />
                                </div>
                                <div>
                                    <label htmlFor="currentPassword">Mật khẩu hiện tại:</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            className='Account-input'
                                            type={showPassword ? "text" : "password"}
                                            id="currentPassword"
                                            name="currentPassword"
                                            value={editingAccount.Password}
                                            readOnly
                                        />
                                        <button
                                            type="button"
                                            onClick={togglePasswordVisibility}
                                            style={{ position: 'absolute', right: '5px', top: '50%', transform: 'translateY(-50%)' }}
                                        >
                                            {showPassword ? 'Ẩn' : 'Hiện'}
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="newPassword">Mật khẩu mới:</label>
                                    <input
                                        className='Account-input'
                                        type="password"
                                        id="newPassword"
                                        name="newPassword"
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor="confirmPassword">Nhập lại mật khẩu mới:</label>
                                    <input
                                        className='Account-input'
                                        type="password"
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                    />
                                </div>
                                <div className="multi-select-dropdown">
                                    <label>Quyền hạn:</label>
                                    <div className="dropdown-header" onClick={toggleDropdown}>
                                        {selectedRoles.length > 0
                                            ? `${selectedRoles.length} đã chọn`
                                            : 'Chọn quyền hạn'}
                                    </div>
                                    {isOpen && (
                                        <div className="dropdown-list">
                                            {roleList.map((role) => (
                                                <div key={role.RoleID} className="dropdown-item">
                                                    <input
                                                        type="checkbox"
                                                        id={`role-${role.RoleID}`}
                                                        checked={selectedRoles.includes(role.RoleID)}
                                                        onChange={() => handleRoleChange(role.RoleID)}
                                                    />
                                                    <label htmlFor={`role-${role.RoleID}`}>{role.RoleName}</label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <button className='Edit-submit' type="submit">Thay đổi</button>
                                </div>
                            </form>
                        )}
                    </div>

                    <div style={{ display: activeSection === 'show' ? 'flex' : 'none' }}>
                        {selectedAccountDetails && (
                            <form className='Account-user-info'>
                                <div>
                                    <img
                                        src={`../../Resources/images/${selectedAccountDetails.user.userAvatar || 'avatar-holder.jpeg'}`}
                                        alt='Account-UserImage'
                                    />
                                </div>
                                <div>
                                    <span>Họ và tên: {selectedAccountDetails.user.userName}</span>
                                </div>
                                <div>
                                    <span>Email: {selectedAccountDetails.user.userEmail}</span>
                                </div>
                                <div>
                                    <span>Địa chỉ: {selectedAccountDetails.user.userAddress}</span>
                                </div>
                                <div>
                                    <span>Số điện thoại: {selectedAccountDetails.user.userPhone}</span>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            </div>
            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onClose={closeConfirmModal}
                onConfirm={confirmDelete}
                message="Bạn có chắc chắn muốn xóa tài khoản này không?"
            />
        </div>
    );
}
document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('main-panel');
    if (contentElement) {
        ReactDOM.render(<Account />, contentElement);
    }
});