/*
Numeros Mayas JS - Agregue números mayas a su sitio web

This library adds mayan numerals to all arabic numbers found inside paragraphs <p></p>. Only deals with integers, any decimal number will be rounded.

License: GPLv3

Author: Martín Szyszlican <msz@poderlatam.org>
Code inspired by: Carlos Bustillo, Aprender numeración maya https://github.com/cabustillo13/Aprender-numeracion-maya/
Zero based on: https://es.wikipedia.org/wiki/Archivo:Mayan00.svg

Instructions: 
1. Copy this file to the javascript folder in your project
2. Include this library in the header: <script type="text/javascript" src="js/numeros-mayas.js"></script>
3. Update your site, check for errors in the console
4. If you see any error please report it https://github.com/projectpoder/numeros-mayas-js
5. Configuration: Add a script tag with the following configuration options
<script type="text/javascirpt">
const numeros_mayas_config = {
    button_code: "",
    direction: "vertical", //or horizontal
    selector: "p"
}
</script>
6. For dynamic content call `marcarNumerosArabigos({selector: "[selector]"});`
*/



marcarNumerosArabigos = function(config_local){
    //Apply defaults to config
    //Precedence: config_local > numeros_mayas_config global > internal defaults
    let config = Object.assign({},{
        button_code: '<span style="vertical-align: super; font-size: 0.7em; color: #333; background: #ec6;padding: 2px; border-radius: 3px; cursor: pointer" title="Ver este número en idioma maya">m</span>',
        direction: "vertical", 
        selector: "p",
        number_container_style: "display: none; position: absolute; padding: 5px; border-radius: 5px; background: #ec6; text-align: center;"
    }, numeros_mayas_config, config_local);

    if (config.direction == "vertical") {
        config.number_container_style+= "width: 60px";
    }

    //Ocultar números mayas al clickear el body
    document.addEventListener("click",ocultarNumerosMayas);

    // console.log("marcarNumerosArabigos",config);

    //Seleccionar todos los objetos donde buscaremos los números
    parrafos = document.querySelectorAll(config.selector);

    if (parrafos.length == 0) {
        console.error("NumerosMayasJS","Selector didn't match any objects",config.selector);
    }

    //Simplificamos el selector para usarlo de id.
    const prefix = config.selector.replace(/[^a-z]/gi, "");

    //Iteramos por todos los elementos seleccionados
    let iparrafo = 0;
    for (const parrafo of parrafos) {
        iparrafo++;
        // console.log(parrafo);
        var palabras = parrafo.innerHTML.split(' '),
            ipalabra = palabras.length,
            ignorarHTML = false;

        while(--ipalabra) {

            palabra = palabras[ipalabra];

            //Ignore HTML
            //TODO: Only parse text nodes
            if (palabra.indexOf(">") > -1) {
                ignorarHTML = true;
            }
            if (palabra.indexOf("<") > -1) {
                ignorarHTML = false;
            }
            // console.log("ignorarHTML",ignorarHTML,palabra)

            if (!ignorarHTML) {
                // console.log(palabra,Number(palabra) == NaN);
                if(!isNaN(parseInt(palabra.replace(/,/,"")))){
                    palabras[ipalabra] = '<span class="numero-toggle" style="cursor:" data-target-id="'+prefix+(ipalabra+iparrafo)+'" data-value="'+palabra+'">' + 
                                            '<span class="numero-arabigo">' + palabra + '</span>' +
                                            config.button_code+'</span>'+
                                    '<span class="numero-maya" id="numero-maya-'+prefix+(ipalabra+iparrafo)+'" style="'+config.number_container_style+'"></span>';
                }
            }
            
        }
        parrafo.innerHTML = palabras.join(' ');
    }

    toggles = document.querySelectorAll("span.numero-toggle");
    // console.log(toggles);
    for (const toggle_i of toggles.entries()) {
        // console.log(toggle_i);
        toggle = toggle_i[1];
        toggle.addEventListener("click", e => {
            // console.log(e.target);
            ocultarNumerosMayas(e);
            target_id = e.currentTarget.dataset.targetId
            // console.log(document.getElementById("numero-maya-"+target_id));
            targetNumero = document.getElementById("numero-maya-"+target_id);
            if (!targetNumero.innerHTML) {
                targetNumero.innerHTML = numerosMayas(e.currentTarget.dataset.value);
            }

            if (targetNumero.style.display == "none") {
                targetNumero.style.display = "inline-block";
            }
            else {
                targetNumero.style.display = "none";
            }
        }) 
    }

}
window.addEventListener("DOMContentLoaded",marcarNumerosArabigos);


function numerosMayas(numero) {
    // console.log("nm",numero);
    numero = parseInt(numero.replace(/,/g,"")) //Sólo enteros, sin comas
    nivel = getNiveles(numero)
    coeficientes = getCoeficientes(numero,nivel)
    imagenes = generarImagenes(coeficientes,nivel)

    html = "<span style='font-size: 0.7em; padding: 0.4em; display: inline-block; vertical-align: top'>Número maya:</span>";
    // console.log("numerosMayas imagenes",numero, imagenes);
    imagenes.reverse();
    for (nivel in imagenes) {
        realnivel = imagenes.length-nivel-1;
        html += "<span style='background: #eee; display: inline-block; padding: 5px; margin-right: 5px; border-radius: 5px' title='Numero "+imagenes[nivel].numero+" en maya, nivel "+realnivel+". Valor parcial: "+imagenes[nivel].numero+"x20^"+realnivel+" = "+(parseInt(imagenes[nivel].numero)*20**realnivel).toLocaleString()+"'>";
        for (imagen in imagenes[nivel].componentes) {
            let glifo = glifos_mayas[imagenes[nivel].componentes[imagen]];
            html+='<svg xmlns="http://www.w3.org/2000/svg" display="block" width="'+glifo.width+'px" height="'+glifo.height+'px">'+
                    glifo.svg+"</svg>"

            // html+='<img src="./img/A'++'.png" alt="Número maya '+imagenes[nivel][imagen]+'" style="width: 50px">';
        }
        html += "</span>";
    }
    return html;
}

const glifos_mayas = {
    "1": {
        width: 50,
        height: 20,
        svg: '<circle cx="25" cy="10" r="5" fill="black" />'
    },
    "2": {
        width: 50,
        height: 20,
        svg: '<circle cx="19" cy="10" r="5" fill="black" /><circle cx="31" cy="10" r="5" fill="black" />'
    },
    "3": {
        width: 50,
        height: 20,
        svg: '<circle cx="14" cy="10" r="5" fill="black" /><circle cx="25" cy="10" r="5" fill="black" /><circle cx="36" cy="10" r="5" fill="black" />'
    },
    "4": {
        width: 50,
        height: 20,
        svg: '<circle cx="8" cy="10" r="5" fill="black" /><circle cx="19" cy="10" r="5" fill="black" /><circle cx="31" cy="10" r="5" fill="black" /><circle cx="42" cy="10" r="5" fill="black" />'
    },
    "5": {
        width: 50,
        height: 12,
        svg: '<rect y="0" x="0" width="50px" height="10px" />'
    },
    "0": {
        height: 25,
        width: 50,
        svg: '<path fill="none" stroke="#000" stroke-width="2.4" d="m 24.69482,0.50000002 a 19.500042,9.6589102 0 1 0 0.609375,0 z M 6.4135309,7.1405011 q 18.2812891,10.8662729 37.1719531,0 M 17.991681,1.1036816 q -4.265634,4.8294551 0,10.8662744 M 25.304195,0.50000002 q -4.87501,6.03681948 0,12.07363798 M 32.007336,1.1036816 q -4.265634,4.8294551 0,10.8662744"/>'
    }
}

function ocultarNumerosMayas(e) {
    if (e && e.target && e.target.parentNode && e.target.parentNode.className == "numero-toggle" ) {
    }
    else {
        allNumeros = document.getElementsByClassName("numero-maya");
        for (numero of allNumeros) {
            numero.style.display = "none";
        }
    }
}


// El sistema de numeracion maya tiene cuatro niveles.
// Funcion para definir los niveles para escribir grandes cantidades.
function getNiveles(valor) {    
    if (valor == 0) { return 1 };
    exponente = parseInt(Math.log(valor) / Math.log(20))  //Base 20
    return exponente       //Porque arranca desde el nivel 0
}

//Acorde a la historia este sistema numeracion maya tiene cuatro niveles, que se utilizaban para escribir grandes cantidades.
//Esta cita de wikipedia no tiene fuente, hay otras fuentes.
//Matematicamente f(x) = x1 + 20*x2 + 400*x3 + 8000*x4
function getCoeficientes(valor,nivel) {    
    // console.log("getCoeficientes",parseInt(valor),nivel)
    coeficientes = []
    let i = nivel;
    while(i >= 0) {
        x = parseInt((valor)/(20**i))
        valor = valor - (20**i)*x
        coeficientes.push(x);
        i--;
    }
        
        // #Obtener el residuo
        // x = int((valor)/(20**(3-i)))
        // valor = valor - (20**(3-i))*x
        // coeficientes.append(x)

    //Los coeficientes se devuelven de esta forma [x4,x3,x2,x1]
    return coeficientes
}

function generarImagenes(coeficientes,nivel,valor) {
    // console.log("generarImagenes",coeficientes,nivel);
    niveles = []
    let i = 0;
    while(i <= nivel) {
        // Todo numero entero tiene al menos un nivel
        niveles.push(generarNivel(coeficientes[nivel-i]))
        i++;
    }
    
    return niveles;
}

// # Crear una imagen con su respectiva representacion maya para cada numero
// # Cada numero debe ser menor de 20, que es la representacion maxima que se puede realizar por cada nivel
function generarNivel(numero) {    
    // console.log("generarNivel",numero);
    componentes = [];
    
    // Para el cero maya 
    
    if (numero == 0) {
        componentes.push(0);
    }
    
    // Para el punto maya
    else {
        resto = numero%5;
        if (resto) {
            componentes.push(numero%5);
        }

        let x = 1;
        while (x <= numero/5) {
            componentes.push(5);
            x++;
        }
    }

    
    return {numero: numero, componentes: componentes }
}