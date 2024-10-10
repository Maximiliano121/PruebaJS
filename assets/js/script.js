const inputCLP = document.getElementById("inputCLP");
const selectMoneda = document.getElementById("selectMoneda");
const btnBuscar = document.getElementById("btnBuscar");
const resultado = document.getElementById("resultado");
const ctx = document.getElementById("myChart").getContext("2d");

let myChart;

btnBuscar.addEventListener("click", () => {
  const cantidadCLP = parseFloat(inputCLP.value);
  const monedaSeleccionada = selectMoneda.value;

  if (isNaN(cantidadCLP) || cantidadCLP <= 0) {
    resultado.textContent = "Por favor, ingresa una cantidad válida en CLP.";
    return;
  }

  obtenerDatosAPI(monedaSeleccionada, cantidadCLP);

  obtenerHistorialAPI(monedaSeleccionada);
});

async function obtenerDatosAPI(moneda, cantidadCLP) {
  const url = `https://mindicador.cl/api/${moneda}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener los datos de la API.");
    }

    const data = await response.json();
    const valorMoneda = data.serie[0].valor;
    const conversion = cantidadCLP / valorMoneda;

    resultado.textContent = `La conversión de ${cantidadCLP} CLP a ${moneda.toUpperCase()} es: ${conversion.toFixed(
      2
    )} ${moneda.toUpperCase()}`;
  } catch (error) {
    resultado.textContent =
      "Hubo un error al obtener los datos. Intenta de nuevo más tarde.";
    console.error("Error al obtener los datos de la API:", error);
  }
}

async function obtenerHistorialAPI(moneda) {
  const url = `https://mindicador.cl/api/${moneda}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Error al obtener los datos de la API.");
    }

    const data = await response.json();
    const historial = data.serie.slice(0, 10).reverse();

    const fechas = historial.map((dato) =>
      new Date(dato.fecha).toLocaleDateString()
    );
    const valores = historial.map((dato) => dato.valor);

    if (myChart) {
      myChart.destroy();
    }

    myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: fechas,
        datasets: [
          {
            label: `Valor histórico de ${moneda.toUpperCase()}`,
            data: valores,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  } catch (error) {
    console.error("Error al obtener el historial de la API:", error);
  }
}
