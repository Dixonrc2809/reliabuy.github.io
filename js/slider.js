(function () {
  'use strict';

  // Clase para crear sliders
  class Slider {
    constructor(id, mediaQueries) {
      // Obtener elementos HTML
      this.slider = document.querySelector(`#${id}`);
      this.sliderList = this.slider.querySelector('.slider-list');
      this.sliderItems = this.slider.querySelectorAll('.slider-item');
      this.sliderNext = this.slider.querySelector('.slider-arrow-next');
      this.sliderPrev = this.slider.querySelector('.slider-arrow-prev');

      // Crear lista de media queries
      this.mediaQueryList = mediaQueries.map((query, index) => ({
        mq: window.matchMedia(`screen and (min-width:${query}px)`),
        itemsToShow: index + 1,
      }));

      // Variables globales
      this.currentItemIndex = 0;
      this.numberOfVisibleItems = 1; // Por defecto mostramos 1 elemento
      this.sliderItemsLength = this.sliderItems.length;

      // Event listeners para cambios de tamaño de pantalla
      this.mediaQueryList.forEach(({ mq }) => {
        mq.addEventListener('change', () => this.run());
      });

      // Event listener para ir a la siguiente diapositiva
      this.sliderNext.addEventListener('click', () => {
        if (this.currentItemIndex < this.sliderItemsLength - this.numberOfVisibleItems) {
          this.currentItemIndex++;
          this.shiftSlides();
        }
      });

      // Event listener para ir a la diapositiva anterior
      this.sliderPrev.addEventListener('click', () => {
        if (this.currentItemIndex > 0) {
          this.currentItemIndex--;
          this.shiftSlides();
        }
      });

      // Deshabilitar el foco en los enlaces de las tarjetas
      this.sliderItems.forEach((item) => {
        const elements = item.querySelectorAll('a');
        elements.forEach((element) => {
          element.tabIndex = '-1';
        });
      });
    }

    // Inicializar el slider
    run() {
      // Establecer el número de elementos visibles en función de la media query activa
      for (let i = this.mediaQueryList.length - 1; i >= 0; i--) {
        if (this.mediaQueryList[i].mq.matches) {
          this.numberOfVisibleItems = this.mediaQueryList[i].itemsToShow;
          break;
        }
      }

      // Resetear el índice y transformar el slider al inicio
      this.currentItemIndex = 0;
      this.sliderList.style.transform = 'translateX(0%)';

      // Ajustar el ancho del contenedor del slider y las tarjetas
      this.sliderList.style.width = `calc(${(100 / this.numberOfVisibleItems) * this.sliderItemsLength}% + ${(this.sliderItemsLength / this.numberOfVisibleItems) * 16}px)`;
      this.sliderItems.forEach((item) => {
        item.style.width = `${100 / this.numberOfVisibleItems}%`;
      });
    }

    // Función para mover las diapositivas
    shiftSlides() {
      this.sliderList.style.transform = `translateX(-${(100 / this.sliderItemsLength) * this.currentItemIndex}%)`;
    }
  }

  /* 
  Creación de sliders:
  El primer parámetro es el id del contenedor HTML de cada slider.
  El segundo parámetro es un array con los puntos de ruptura donde se incrementa el número de tarjetas visibles.
  */

  // Crear sliders y ejecutarlos
  new Slider('new-products', [576, 992]).run();
  new Slider('featured-products', [576, 768, 992]).run();
})();
