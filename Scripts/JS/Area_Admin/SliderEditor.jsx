const IconSlider = '../../Resources/images/nav-icon.png';
const SliderImage = '../../Resources/images/PlayHolder.png';

function EditModal({ image, onSave, onClose }) {
    const [editedImage, setEditedImage] = React.useState(image);
    const fileInputRef = React.useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditedImage({ ...editedImage, [name]: value });
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setEditedImage({ ...editedImage, src: e.target.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <img src={editedImage.src} alt="Preview" style={{ Width: '100%' }} />
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                />
                <button onClick={() => fileInputRef.current.click()} className='modal-button'>Chọn ảnh mới</button>
                <text>Tên ảnh:</text>
                <input
                    type="text"
                    name="name"
                    value={editedImage.name}
                    onChange={handleChange}
                    placeholder="Tên ảnh"
                    className='modal-input'
                />
                <text>Đường dẫn:</text>
                <input
                    type="text"
                    name="link"
                    value={editedImage.link}
                    onChange={handleChange}
                    placeholder="Đường dẫn"
                    className='modal-input'
                />
                <button onClick={() => onSave(editedImage)} className='modal-save'>Lưu</button>
                <button onClick={onClose} className='modal-out'>Hủy</button>
            </div>
        </div>
    );
}
function SliderEdit() {
    const [EditorHint, setEditorHint] = React.useState(false);
    const [sliders, setSliders] = React.useState([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingImage, setEditingImage] = React.useState(null);
    const fileInputRef = React.useRef(null);

    React.useEffect(() => {
        fetchSliders();
    }, []);

    const fetchSliders = async () => {
        try {
            const response = await fetch('/Admin/ADGeneral/GetSliders');
            if (response.ok) {
                const data = await response.json();
                setSliders(data);
            } else {
                console.error('Failed to fetch sliders');
            }
        } catch (error) {
            console.error('Error fetching sliders:', error);
        }
    };

    const handleAddSlider = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            try {
                const response = await fetch('/Admin/ADGeneral/AddSlider', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    fetchSliders();
                } else {
                    console.error('Failed to add slider');
                }
            } catch (error) {
                console.error('Error adding slider:', error);
            }
        }
    };

    const handleDeleteSlider = async (sliderId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa slider này không?')) {
            try {
                const response = await fetch(`/Admin/ADGeneral/DeleteSlider/${sliderId}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    fetchSliders();
                } else {
                    console.error('Failed to delete slider');
                }
            } catch (error) {
                console.error('Error deleting slider:', error);
            }
        }
    };

    const handleEditSlider = async (sliderId, event) => {
        const file = event.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('sliderId', sliderId);
            try {
                const response = await fetch('/Admin/ADGeneral/EditSlider', {
                    method: 'POST',
                    body: formData
                });
                if (response.ok) {
                    fetchSliders();
                } else {
                    console.error('Failed to edit slider');
                }
            } catch (error) {
                console.error('Error editing slider:', error);
            }
        }
    };

    const handleOrderChange = async (sliderId) => {
        try {
            const response = await fetch(`/Admin/ADGeneral/UpdateSliderOrder/${sliderId}`, {
                method: 'POST'
            });
            if (response.ok) {
                fetchSliders();
            } else {
                console.error('Failed to update slider order');
            }
        } catch (error) {
            console.error('Error updating slider order:', error);
        }
    };

    const handleSaveEdit = (editedImage) => {
        const newImages = [...images];
        newImages[editedImage.index] = {
            src: editedImage.src,
            name: editedImage.name,
            link: editedImage.link
        };
        setImages(newImages);
        setIsModalOpen(false);
        setEditingImage(null);
    };
    return (
        <div className="Admin-main-panel">
            <div className='Admin-body-nav-container'>
                <div>
                    <img
                        className="Admin-picHidden"
                        src={IconSlider}
                        alt="my pic"
                        onClick={() => setEditorHint(!EditorHint)}
                    />
                </div>
            </div>
            <div className="Admin-container-admin-table">
                <div className="Admin-news-inner">
                    <div>
                        <table id='table-slider'>
                            <thead>
                                <tr>
                                    <th colSpan="5">
                                        <div className='add-pic-slider'>
                                            <input
                                                type="file"
                                                id="imageInput"
                                                accept="image/*"
                                                style={{ display: 'none' }}
                                                onChange={handleAddSlider}
                                            />
                                            <span>Bảng hình silder</span>
                                            <button
                                                style={{ backgroundColor: "blue", color: "white" }}
                                                onClick={() => document.getElementById('imageInput').click()}
                                            >
                                                Thêm ảnh
                                            </button>
                                        </div>
                                    </th>

                                </tr>
                                <tr>
                                    <th>Ảnh</th>
                                    <th>Tên</th>
                                    <th>Đường dẫn</th>
                                    <th>Thao tác</th>
                                    <th>Chấp nhận</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sliders.map((image, index) => (
                                    <tr key={index}>
                                        <td>
                                            <img src={image.SliderImage} alt='Hình' className='slider-images' />
                                        </td>
                                        <td>
                                            <div className='Limit-container'>
                                                <span className='slider-Name'>{image.SliderName}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='Limit-container'>
                                                <a href={image.SliderLink} className='Silder-link'>{image.SliderLink}</a>
                                            </div>
                                        </td>
                                        <td>
                                            <div className='slider-button'>
                                                <span
                                                    style={{ backgroundColor: "red", color: "white", cursor: "pointer" }}
                                                    onClick={() => handleDeleteSlider(index)}
                                                >
                                                    Xóa
                                                </span>

                                                <span
                                                    style={{ backgroundColor: "green", color: "white", cursor: "pointer" }}
                                                    onClick={() => handleEditSlider(index)}
                                                >
                                                    Sửa
                                                </span>

                                            </div>
                                        </td>
                                        <td>
                                            <input type='checkbox' />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <input
                            type="file"
                            ref={fileInputRef}
                            style={{ display: 'none' }}
                            accept="image/*"
                        />
                    </div>
                </div>
            </div>
        {isModalOpen && (
            <EditModal
                image={editingImage}
                onSave={handleSaveEdit}
                onClose={() => setIsModalOpen(false)}
            />
        )}
        </div>
    );
}

document.addEventListener('DOMContentLoaded', function () {
    const contentElement = document.getElementById('main-panel');
    if (contentElement) {
        ReactDOM.render(<SliderEdit />, contentElement);
    }
});