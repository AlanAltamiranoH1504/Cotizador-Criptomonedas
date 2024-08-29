/**
 * VIDEO NO. 298 PRIMEROS PASOS CON EL PROYECTO
 */

//Selectores
const selectCripto = document.querySelector("#criptomonedas");
const selectMoneda = document.querySelector("#moneda");
const formulario = document.querySelector("#formulario");
const alertas = document.querySelector("#alertas");
const divResultado = document.querySelector("#resultado");

//Creamos objeto que va contener las monedas para la cotizacion 
const objBusqueda = {
    moneda: "",
    criptomoneda: ""
};

//Cargamos todo el documento html 
document.addEventListener("DOMContentLoaded", ()=>{
    //Llamamos a la funcion que consulta las cripto de la API 
    constultarCriptoMonedas();

    //Agregamos evento al formulario 
    formulario.addEventListener("submit", submitFormulario);

    //Agregamos evento selectCripto, cuando cambie llamamos a la funcion que lee el valor
    selectCripto.addEventListener("change", leerValor);
    selectMoneda.addEventListener("change", leerValor2);
});

//Funcion que consulta las criptomonedas de la API 
function constultarCriptoMonedas(){
    //Definimos url de la API, que nos da las 10 cripto mas importantes
    const URL = "https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD";

    //Disparamos la API 
    fetch(URL).then((resultado) =>{
        return resultado.json();
    }).then((datos) =>{
        //Llamamos a la funcion que maneja los datos de la API 
        selectCriptomonedas(datos.Data);
    }).catch((error) =>{
        console.log(error);
    })
}

//Funcion que llena el select de las criptomonedas con las 10 mas usadas segun la API 
function selectCriptomonedas(criptoMonedas){
    //Iteramos el arreglo 
    criptoMonedas.forEach((moneda) =>{
        //Hacemos destructuring de cada objeto moneda para obtener el fullname y name
        const { FullName, Name } = moneda.CoinInfo;
        
        //Creamos las opciones 
        const option = document.createElement("option");
        //Modificamos cada option 
        option.textContent = FullName;
        option.value = Name;

        //Agregamos el option al select de criptoMonedas
        selectCripto.appendChild(option); 
    })
}

//Funcion que realiza el submit del formulario 
function submitFormulario(e){
    e.preventDefault();
    
    //Validamos el formulario 
    const {moneda, criptomoneda } = objBusqueda;
    if(moneda === "" || moneda === null || criptomoneda === "" || criptomoneda === null){
        //Mandamos alerta 
        mostrarAlertas("Ambos campos son obligatorios", "error");
        return;
    }

    //Llamamos a la funcion que consulta la api 
    consultarAPI();
}

//Funcion que muestra distintos tipos de alertas 
function mostrarAlertas(mensaje, tipo){
    //Limpiamos el div de alertas
    alertas.innerHTML = "";

    //Creamos div de alerta 
    const divAlerta = document.createElement("div");
    divAlerta.textContent = mensaje;

    if(tipo === "error"){
        divAlerta.classList.add("error");
    }else{
        divAlerta.classList.add("success");
    }

    //Agregamos la alerta como hijo del div de alertas
    alertas.appendChild(divAlerta);
    setTimeout(() => {
        divAlerta.remove();
    }, 3000);
}

//Funcion que consulta la API para conocer la moneda y criptomoneda en conversion 
function consultarAPI(){
    //Extramos los valores de objBusqueda
    const {moneda, criptomoneda } = objBusqueda;

    mostraSpinner();
    
    //Definimos url 
    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
    //Disparamos api 
    fetch(url).then((resultado) =>{
        return resultado.json();
    }).then((datos) =>{
        //Llamamos a la funcion que procesa los datos de la API
        mostrarCotizacionHTML(datos.DISPLAY[criptomoneda][moneda]);
    }).catch((error) =>{
        console.log(error);
    })
}

//Funcion que muestra la cotizacion en el html 
function mostrarCotizacionHTML(cotizacion){
    //Limpiamos el div resultadi
    divResultado.innerHTML = "";

    //Hacemos destruturing del objeto cotizacion 
    const {PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

    //Creamos elementos
    const precio = document.createElement("p");
    precio.classList.add("precio");
    precio.innerHTML = `El precio es <span>${PRICE}</span>`;

    const preciAlto  = document.createElement("p");
    preciAlto.innerHTML = `
        <p>Precio más alto del dia: <span>${HIGHDAY}</span></p>
        <p>Precio mas bajo del dia: <span>${LOWDAY}</span></p>
        <p>Ultima actualizacion: <span>${LASTUPDATE}</span></p>    
        <p>Variacion ultimas 24 hrs: <span>${CHANGEPCT24HOUR}%</span></p>
    `;
    //Agregamos al html 
    divResultado.appendChild(precio);
    divResultado.appendChild(preciAlto);
}

//Funcion que muestra el spinner
function mostraSpinner(){
    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    spinner.innerHTML = `
        <div class="bounce1"></div>
        <div class="bounce2"></div>
        <div class="bounce3"></div>
    `;

    divResultado.appendChild(spinner);k
}
//Funcion que lee el valor de criptomoneda y lo agrega el objeto
function leerValor(e){
    objBusqueda.criptomoneda = e.target.value;
}
//Funcion que lee el valor de moneda y lo agrega el objeto
function leerValor2(e){
    objBusqueda.moneda = e.target.value;
}
