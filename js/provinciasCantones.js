document.addEventListener("DOMContentLoaded", () => {
    const provinciaSelect = document.getElementById("provincia");
    const cantonSelect = document.getElementById("canton");

    // URL de la API para provincias y cantones
    const apiURL = "https://ubicaciones.paginasweb.cr/provincias.json";

    // Cargar provincias al cargar la página
    fetch(apiURL)
        .then(response => response.json())
        .then(data => {
            Object.entries(data).forEach(([key, value]) => {
                const option = document.createElement("option");
                option.value = key;
                option.textContent = value;
                provinciaSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error al cargar provincias:", error));

    // Manejar cambios en la selección de provincia
    provinciaSelect.addEventListener("change", () => {
        const provinciaId = provinciaSelect.value;

        // Limpiar los cantones previos
        cantonSelect.innerHTML = '<option value="" selected disabled>Seleccione un cantón</option>';

        if (provinciaId) {
            // URL para obtener los cantones de la provincia seleccionada
            const cantonURL = `https://ubicaciones.paginasweb.cr/provincia/${provinciaId}/cantones.json`;

            fetch(cantonURL)
                .then(response => response.json())
                .then(data => {
                    Object.entries(data).forEach(([key, value]) => {
                        const option = document.createElement("option");
                        option.value = key;
                        option.textContent = value;
                        cantonSelect.appendChild(option);
                    });
                })
                .catch(error => console.error("Error al cargar cantones:", error));
        }
    });
});