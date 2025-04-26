   // SLIDEBAR 
   const slider = document.getElementById("meuSlider");
   const valueDisplay = document.getElementById("sliderValue");
   
   function updateValuePosition() {
     const min = parseInt(slider.min);
     const max = parseInt(slider.max);
     const val = parseInt(slider.value);
     
     const percent = (val - min) / (max - min);
     const sliderWidth = slider.offsetWidth;
     const thumbOffset = 10; // metade da largura do thumb
     const left = percent * (sliderWidth - 20) + thumbOffset;
   
     valueDisplay.style.left = `${left}px`;
     valueDisplay.textContent = val;
   }
   
   slider.addEventListener("input", updateValuePosition);
   window.addEventListener("load", updateValuePosition); // inicializa
        // ===================================
   