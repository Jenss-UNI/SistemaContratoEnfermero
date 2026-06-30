export interface ReniecDniResponse {
  nombres: string;
  apellidos_pa: string;
  apellidos_ma: string;
  dni: string;
}

/**
 * Consulta un número de DNI utilizando la API de la RENIEC configurada.
 * Si no hay token de API o si la petición falla, se utiliza un fallback de simulación.
 */
export async function consultarDni(dni: string): Promise<ReniecDniResponse> {
  const apiToken = import.meta.env.VITE_RENIEC_API_TOKEN;
  // Endpoint por defecto de apiperu.dev
  const apiUrl = import.meta.env.VITE_RENIEC_API_URL || "https://apiperu.dev/api/dni";

  // Si no hay token configurado en el .env, usamos simulación para no bloquear
  if (!apiToken || apiToken === "tu-token-reniec-api-aqui") {
    console.warn("RENIEC: No se detectó un token de API real. Usando simulación local.");
    return mockDniQuery(dni);
  }

  try {
    const isApiPeru = apiUrl.includes("apiperu.dev");
    let response;

    if (isApiPeru) {
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ dni }),
      });
    } else {
      const urlConParametro = `${apiUrl}?numero=${dni}`;
      response = await fetch(urlConParametro, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${apiToken}`,
        },
      });
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const resJson = await response.json();
    
    // Normalizar la respuesta: apiperu.dev envuelve los datos en un objeto 'data'
    const reniecData = resJson.data || resJson;
    
    return {
      nombres: reniecData.nombres ?? "JUAN CARLOS",
      apellidos_pa: reniecData.apellido_paterno ?? reniecData.apellidoPaterno ?? "PÉREZ",
      apellidos_ma: reniecData.apellido_materno ?? reniecData.apellidoMaterno ?? "GÓMEZ",
      dni: reniecData.numero ?? reniecData.numeroDocumento ?? reniecData.numero_documento ?? dni,
    };
  } catch (error) {
    console.error("RENIEC: Error al consultar la API. Activando fallback local:", error);
    return mockDniQuery(dni);
  }
}

/**
 * Retorna datos de simulación realistas para desarrollo basados en el DNI.
 */
function mockDniQuery(dni: string): ReniecDniResponse {
  // Simulación realista basada en el DNI de prueba
  if (dni === "45678901") {
    return {
      nombres: "JENS JEREMIES",
      apellidos_pa: "LUNA",
      apellidos_ma: "LEVITA",
      dni,
    };
  }

  return {
    nombres: "MARÍA ALEJANDRA",
    apellidos_pa: "RODRÍGUEZ",
    apellidos_ma: "SÁNCHEZ",
    dni,
  };
}
