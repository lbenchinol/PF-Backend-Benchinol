(function () {
    const socket = io();

    const productsList = document.getElementById('products-list');

    const updateProducts = (products) => {
        productsList.innerText = '';

        products.forEach((p) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p._id}</td>
            <td>${p.title}</td>
            <td>${p.description}</td>
            <td>${p.price}</td>
            <td>${p.thumbnail}</td>
            <td>${p.code}</td>
            <td>${p.stock}</td>
            <td>${p.status}</td>`;

            productsList.appendChild(tr);
        });
    }

    socket.on('products-list-updated', ({ products }) => {
        updateProducts(products);
    });

})();