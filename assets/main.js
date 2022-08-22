let api_url
let myChart
async function getApi(tipoMoneda = null) {
    if(tipoMoneda){
        api_url = "https://mindicador.cl/api/"+tipoMoneda;
    }else{
        api_url = "https://mindicador.cl/api/";
    }
    var response,data
    try {  
        response = await fetch(api_url)
        data = await response.json()
    } catch(e) {
        document.getElementById('error').innerHTML =`Error en API remota, se ocupará la api local`
        response = await fetch("mindicador.json")
        data = await response.json()
    }
    return data
}
  
function show() {
    getApi().then(function(data){
        let select = document.getElementById('selectMonedas');
        let i = 0
        for(x=3;x < 15;x++){
            const keys = Object.keys(data)[x]
            var opt = document.createElement('option');
            opt.value = Object.keys(data)[x];
            opt.innerHTML = Object.keys(data)[x];
            select.appendChild(opt);
            i++
        }
    })
    
}
async function enviaMoneda(data){
    let total           = 0
    let tipoMoneda      = document.getElementById('selectMonedas').value
    let cantidadMoneda  = document.getElementById('cantidad').value
    let monedas         = await getApi(tipoMoneda);
    let serie           = monedas.serie
    if(cantidadMoneda === '' || cantidadMoneda <= 0){
        alert('Cantidad de monedas debe ser mayor a cero')
        return
    }
    if(tipoMoneda === ''){
        alert('Debe seleccionar tipo moneda')
        return
    }
    total = Math.round(cantidadMoneda*serie[0].valor)
    document.getElementById('resultado').innerHTML =`Resultado: ${total.toFixed()}`
    graficoShow(monedas)
        
}
async function graficoShow(monedas) {
    const   tipoDeGrafica   = "line";
    const   titulo          = monedas.nombre;
    const   colorDeLinea    = "red";
    const   arrSeries       = monedas.serie.slice(0,9)
    let     textoValue      = Array()
    let     textoNombre     = Array()
    arrSeries.map((item)=>{
            textoValue.push(item.valor)
            textoNombre.push(item.fecha.toString().substring(0, 10))
    })
    const config = {
        type: tipoDeGrafica,
        borderWidth: 1,// Ancho del borde
        data: {
            labels:textoNombre,
            datasets: [
                    {
                    label: titulo,
                    backgroundColor: colorDeLinea,
                    data: textoValue
                    }
                ]}
            }
    const chartDOM = document.getElementById("result")
    // soluciona problema de grafico al enviar más de una vez
    if(myChart){
        myChart.destroy()
    }
    myChart = new Chart(chartDOM, config)
}

show()