




















const iconSinopsis = document.getElementById('iconSinopsis');
const labelSinopsis = document.getElementById('label');
const sinopsisErrorMessage = document.getElementById('sinopsisErrorMessage');
const sinopsisInput = document.getElementById('sinopsisInput');

sinopsisInput.addEventListener('blur', () => {
    if (sinopsisInput.value.trim() === "") {
        sinopsisErrorMessage.textContent = "La sinopsis no puede estar vacía.";
        sinopsisErrorMessage.classList.add("incorrecto");
        labelSinopsis.classList.add("incorrecto");
        iconSinopsis.classList.add("cross");
    } else {
        sinopsisErrorMessage.textContent = "";
        labelSinopsis.classList.remove("incorrecto");
        iconSinopsis.classList.remove("cross");
        iconSinopsis.classList.add("check");
        labelSinopsis.classList.add("label-arriba");
    }
    
});
