const Pic = '../../Resources/images/PlayHolder.png';

function Image_Slider() {
    var settings = {
        dots: true,
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
        pauseOnHover: true
    };
    return (
        <div className="slider-container">
            <Slider {...settings}>
                <div>
                    <img className='slide-pic' src={Pic} alt="The holder pictrue 1" />
                </div>
                <div>
                    <img className='slide-pic' src={Pic} alt="The holder pictrue 2" />
                </div>
                <div>
                    <img className='slide-pic' src={Pic} alt="The holder pictrue 3" />
                </div>
                <div>
                    <img className='slide-pic' src={Pic} alt="The holder pictrue 4" />
                </div>
                <div>
                    <img className='slide-pic' src={Pic} alt="The holder pictrue 5" />
                </div>
                <div>
                    <img className='slide-pic' src={Pic} alt="The holder pictrue 6" />
                </div>
            </Slider>
        </div>
    );
}

export default Image_Slider