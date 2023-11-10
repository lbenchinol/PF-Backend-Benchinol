import { Exception } from '../../src/utils.js';
import CartManager from '../../src/dao/cartManager.js';

//654d41e5b47f0f8cd6d26ed1

(function () {

    let cId;

    Swal.fire({
        title: 'Identificación de carrito!',
        input: 'text',
        inputLabel: 'Ingresa el ID de tu carrito',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
                return 'Por favor, ingresa el ID de tu carrito para continuar!'
            }
        }
    })
        .then((result) => {
            cId = result.value.trim();
        });

    const btnsAddToCart = document.querySelectorAll('.btnAddToCart');

    btnsAddToCart.forEach(btn => {
        btn.addEventListener('click', async event => {
            const pId = event.target.id;

            try {
                await CartManager.updateCart(cId, pId, 1);
            } catch (error) {
                throw new Exception(error.message, error.statusCode);
            }

            Toastify({
                text: "Producto agregado al carrito!",
                duration: 3000,
                gravity: "top",
                position: "right",
                close: true,
            }).showToast();

        });
    });

})();