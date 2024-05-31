/*
Este script carga un catálogo de productos obtenidos de la API JSONPlaceholder.
Cada producto incluirá información como el título, descripción y autor.
Se utilizan funciones async/await para manejar la asincronía de las solicitudes a la API.

Requisitos del trabajo:
- El catálogo debe mostrar las publicaciones de cada autor, su email y una breve descripción.
- Se deben emplear funciones async/await para manejar la asincronía de las solicitudes.
*/

// PEDIR DATOS DE LOS PRODUCTOS A LA API
document.addEventListener("DOMContentLoaded", async function() { // Esperar a que todo el HTML se haya cargado antes de ejecutar el código de la función
    try {
        // Hacer una solicitud a la API JSONPlaceholder para obtener las publicaciones
        const response = await fetch('https://jsonplaceholder.typicode.com/posts'); // Se solicitan las publicaciones 
        const products = await response.json(); // Cuando la solicitud está completa, se crea "products"
        
        // Procesar y mostrar las publicaciones en el catálogo
        displayProducts(products);
        
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
});


// PEDIR DATOS DE LOS AUTORES A LA API
async function getAuthorInfo(userId) {
    // Hacer una solicitud a la API JSONPlaceholder para obtener la información del autor
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${userId}`); // Se solicita la información
    const authorInfo = await response.json(); // Cuando la solicitud está completa, se crea "authorInfo"
    return authorInfo; // Devuelve la información de los autores 
}


// FUNCIÓN PARA MOSTRAR PRODUCTOS
function displayProducts(products) { // Recibe "products", que son los datos obtenidos de las publicaciones 
    const catalogContainer = document.getElementById('catalog-container'); // Se selecciona el contenedor en el DOM; referencia al elemento HTML donde mostraremos las publicaciones

    // Limpiar cualquier contenido existente en el contenedor
    catalogContainer.innerHTML = '';

    // Recorrer las publicaciones y crear elementos HTML para cada una (gracias al .forEach)
    products.forEach(product => {
        const productElement = document.createElement('div'); // Se crea un nuevo div para representar la publicación en el catálogo
        productElement.classList.add('product'); // Añadimos una clase css (product) al elemento

        // Agregar información de la publicación al elemento div creado anteriormente, en un h2 y en un parrafo
        productElement.innerHTML = `
            <h2>${product.title}</h2> 
            <p>${product.body}</p>
        `;

        // Obtener información del autor de la publicación
        getAuthorInfo(product.userId) // Recibe como argumento el id del autor de la publicación actual, para el proceso de obtención de información
            .then(authorInfo => { // Una vez que sea exitosa 
                const authorElement = document.createElement('div'); // Creamos un nuevo div
                // Establecemos el nuevo contenido: creamos varios párrafos
                authorElement.innerHTML = `
                    <p><strong>Autor:</strong> ${authorInfo.name}</p>
                    <p><strong>Email:</strong> ${authorInfo.email}</p>
                    <p><strong>Descripción:</strong> ${authorInfo.company.catchPhrase}</p>
                `;
                productElement.appendChild(authorElement); // Creamos un elemento hijo para la información del autor al producto
            });

        // Agregar el elemento de la publicación al contenedor del catálogo
        catalogContainer.appendChild(productElement);
    });
}


document.addEventListener("DOMContentLoaded", async function() {
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts');
        const products = await response.json();

        // Obtener y mostrar la lista de autores en el select
        const authors = new Set(products.map(product => product.userId));
        const authorSelect = document.getElementById('author-select');
        authors.forEach(async userId => {
            const authorInfo = await getAuthorInfo(userId);
            const option = document.createElement('option');
            option.value = userId;
            option.textContent = authorInfo.name;
            authorSelect.appendChild(option);
        });

        // Mostrar todos los productos al principio
        displayProducts(products);

        // Agregar evento de cambio al select para filtrar las publicaciones
        authorSelect.addEventListener('change', async function() {
            const selectedUserId = parseInt(this.value); // Obtener el id del autor seleccionado
            const filteredProducts = products.filter(product => product.userId === selectedUserId);
            displayProducts(filteredProducts);
        });
        
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
});