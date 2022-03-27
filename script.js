var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent
var synth = window.speechSynthesis;
var productos = [ 'zapato' , 'sarten' , 'silla', 'detergente'];
//var colors = [ 'aqua' , 'azure' , 'beige', 'bisque', 'black', 'blue', 'brown', 'chocolate', 'coral', 'crimson', 'cyan', 'fuchsia', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'indigo', 'ivory', 'khaki', 'lavender', 'lime', 'linen', 'magenta', 'maroon', 'moccasin', 'navy', 'olive', 'orange', 'orchid', 'peru', 'pink', 'plum', 'purple', 'red', 'salmon', 'sienna', 'silver', 'snow', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'white', 'yellow'];
//var grammar = '#JSGF V1.0; grammar colors; public <color> = ' + colors.join(' | ') + ' ;'
var grammar = '#JSGF V1.0; grammar productos; public <producto> = ' + productos.join(' | ') + ' ;'
//var voices = [];
var recognition = new SpeechRecognition();
var speechRecognitionList = new SpeechGrammarList();
speechRecognitionList.addFromString(grammar, 1);
recognition.grammars = speechRecognitionList;
recognition.continuous = false;
recognition.lang = 'es-ES';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

var diagnostic = document.querySelector('.output');
var hints = document.querySelector('.hints');
var imagenProducto = document.querySelector('.imagenProducto');
var descripcionProducto =  document.querySelector('.descripcionProducto');

var productoHTML= '';
productos.forEach(function(v, i, a){
  console.log(v, i);
  //productoHTML += '<span style="background-color:' + v + ';"> ' + v + ' </span>';
  productoHTML += v + " | ";
  //productoHTML += '<img src="img/'+v+'.png" alt="' + v + '">';

});
hints.innerHTML = 'Da click en la pantalla y luego menciona en voz alta el producto que necesitas <br> En esta tienda tenemos actualmente:<br>' + productoHTML;

document.body.onclick = function() {
  recognition.start();
  console.log('Listo para recibir el comando de voz');
}

recognition.onresult = function(event) {
  // The SpeechRecognitionEvent results property returns a SpeechRecognitionResultList object
  // The SpeechRecognitionResultList object contains SpeechRecognitionResult objects.
  // It has a getter so it can be accessed like an array
  // The first [0] returns the SpeechRecognitionResult at the last position.
  // Each SpeechRecognitionResult object contains SpeechRecognitionAlternative objects that contain individual results.
  // These also have getters so they can be accessed like arrays.
  // The second [0] returns the SpeechRecognitionAlternative at position 0.
  // We then return the transcript property of the SpeechRecognitionAlternative object
  var producto = event.results[0][0].transcript;
  diagnostic.textContent = 'Resultado recibido: ' + producto + '.';
  imagenProducto.innerHTML = '<img src="img/'+producto+'.png" alt="' + producto + '">';
  descripcionProductoSeleccionado(producto);
  console.log('Confianza: ' + event.results[0][0].confidence);
  speak();
  descripcionProducto.blur();
}

 function descripcionProductoSeleccionado(producto){
    //aqui va a leer la descripcion del producto
    switch (producto) {
    case 'zapato':
        descripcionProducto.innerHTML = 'Zapato de color negro, tipo Boston para caballero, material plastipiel, comodos y elegantes'; 
    break;
    case 'sarten':
      descripcionProducto.innerHTML = 'Sarten antiadherente de 24 cm, mango rojo de madera'; 
    break;
    case 'sartén':
      descripcionProducto.innerHTML = 'Sarten antiadherente de 24 cm, mango rojo de madera'; 
    break;
    case 'silla':
      descripcionProducto.innerHTML = 'Silla de comedor, respaldo de madera color maple, asientos en tela de terciopelo azul o rojo'; 
    break;
    case 'detergente':
      descripcionProducto.innerHTML = 'Detergente biodegradable cubeta de 4 kilos para ropa delicada'; 
    break;
    case 'Mangos':
    case 'Papayas':
      console.log('El kilogramo de mangos y papayas cuesta $2.79.');
    break;
    default:
      console.log('Lo lamentamos, por el momento no disponemos de ' + producto + '.');
    }
}

recognition.onspeechend = function() {
  recognition.stop();
}

recognition.onnomatch = function(event) {
  diagnostic.textContent = "No reconozco ese producto";
}

recognition.onerror = function(event) {
  diagnostic.textContent = 'Ocurrio un errorurante el reconocimiento: ' + event.error;
}

function speak(){
   console.log("voy a ejecutar voz");
    if (synth.speaking) {
        console.error('speechSynthesis.speaking');
        return;
    }
    if (descripcionProducto.value !== '') {
      console.log(descripcionProducto.innerHTML);
    var utterThis = new SpeechSynthesisUtterance(descripcionProducto.innerHTML);
    utterThis.onend = function (event) {
        console.log('SpeechSynthesisUtterance.onend');
    }
    utterThis.onerror = function (event) {
        console.error('SpeechSynthesisUtterance.onerror');
    }
    /*var selectedOption = voiceSelect.selectedOptions[0].getAttribute('data-name');
    for(i = 0; i < voices.length ; i++) {
      if(voices[i].name === selectedOption) {
        utterThis.voice = voices[i];
        break;
      }
    } */
    
    //utterThis.pitch = 5;
    //utterThis.rate = 10;
    synth.speak(utterThis);
  }
}

