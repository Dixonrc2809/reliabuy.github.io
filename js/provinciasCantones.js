document.addEventListener("DOMContentLoaded", () => {
    const provinciaSelect = document.getElementById("provincia");
    const cantonSelect = document.getElementById("canton");

    // URL de la API para provincias y cantones
    const apiURL = "https://ubicaciones.paginasweb.cr/provincias.json";

    // Cargar provincias al cargar la página
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            Object.entries(data).forEach(([id, nombre]) => {
                const option = document.createElement("option");
                option.value = id;  // Usamos el ID como valor
                option.textContent = nombre;  // Mostramos el nombre
                provinciaSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar provincias:", error));

    // Manejar cambios en la selección de provincia
    provinciaSelect.addEventListener("change", () => {
        const provinciaId = provinciaSelect.value;
        const provinciaNombre = provinciaSelect.options[provinciaSelect.selectedIndex].text;

        // Limpiar los cantones previos
        cantonSelect.innerHTML = '<option value="" selected disabled>Seleccione un cantón</option>';

        if (provinciaId) {
            // URL para obtener los cantones de la provincia seleccionada
            const cantonURL = `https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/cantones.json`;

            fetch(cantonURL)
                .then(response => response.json())
                .then(data => {
                    Object.entries(data).forEach(([id, nombre]) => {
                        const option = document.createElement("option");
                        option.value = id;  // Usamos el ID del cantón
                        option.textContent = nombre;  // Mostramos el nombre del cantón
                        cantonSelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Error al cargar cantones:", error));
        }

        // Guardamos la provincia seleccionada con su nombre en el localStorage
        localStorage.setItem('provincia', JSON.stringify({ id: provinciaId, nombre: provinciaNombre }));
    });

    // Manejar cambios en la selección de cantón
    cantonSelect.addEventListener("change", () => {
        const cantonId = cantonSelect.value;
        const cantonNombre = cantonSelect.options[cantonSelect.selectedIndex].text;

        // Guardamos el cantón seleccionado con su nombre en el localStorage
        localStorage.setItem('canton', JSON.stringify({ id: cantonId, nombre: cantonNombre }));
    });
});
