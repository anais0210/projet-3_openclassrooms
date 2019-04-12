/* ----------------------------------------------------------------------------------------------- */
/* --                                                                                 -- */
/* ----------------------------------------------------------------------------------------------- */

const Diaporama = function() {
    this.currentSlideIndex =  0;
    this.slides =  document.getElementById('container-slides').children;
    this.sliderActiv =  true;
    this.slider = 5;

    this.init = () => {
        this.resumeSlider()
    };

    this.prevSlide = () => {
        this.slides[this.currentSlideIndex].removeAttribute('data-state');
        this.currentSlideIndex -= 1;
        if (this.currentSlideIndex < 0) {
            this. currentSlideIndex = this.slides.length - 1;
        }
        this.slides[this.currentSlideIndex].setAttribute('data-state', 'active');
    };

    this.nextSlide = () => {
        if( this.slides[this.currentSlideIndex] ) {
            this.slides[this.currentSlideIndex].removeAttribute('data-state');
            this.currentSlideIndex += 1;
            this.currentSlideIndex = this.currentSlideIndex % (this.slides.length);
            this.slides[this.currentSlideIndex].setAttribute('data-state', 'active');
        }
    };

    this.pauseSlider = () => {
        clearInterval(this.slider);
        this.sliderActiv = false;
    };

    this.resumeSlider = () => {
        this.slider = setInterval(this.nextSlide, 5000);
    };

    this.init();
};


$(function () {

    const diaporama = new Diaporama();

    let slider = document.getElementById('container-slides');
    slider.addEventListener('mouseleave',  function () {
        diaporama.resumeSlider()
    });

    slider.addEventListener('mouseenter', function () {
        diaporama.pauseSlider()
    });

    document.getElementById('left').addEventListener('click', function(){
        diaporama.prevSlide();
    });

    document.getElementById('right').addEventListener('click', function(){
        diaporama.nextSlide();
    });


    window.addEventListener("keydown", function (e) {
        if ($("input").is(":focus")) {
            // permet d'ecrire dans les inputs de la modal
            return;
        }

        if (e.key === 'ArrowRight') {
            diaporama.nextSlide();
        } else if (e.key === 'ArrowLeft') {
            diaporama.prevSlide();
        } else if (e.key === ' ') {
            if (diaporama.sliderActiv) {
                diaporama.pauseSlider();
            } else {
                diaporama.resumeSlider();
            }
        }
        e.preventDefault();
    });

});

