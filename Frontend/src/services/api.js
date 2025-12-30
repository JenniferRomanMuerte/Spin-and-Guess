const callToApi = () => {
  // Llamamos a la API
  return fetch("") // Url para hacer la peticion
    .then((response) => response.json())
    .then((response) => {
      // Asignamos response a la variable que queramos
      const variable = response.map((eachVariable) => {
        return {
          id: eachVariable.id,
          name: eachVariable.name,
        };
      });

      return variable;
    });
};

export default callToApi;
