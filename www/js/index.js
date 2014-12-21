var app = {
    nombreApp:'ITMaster',
    ultimaUbicacion:{},
    initialize: function() {
        this.bindEvents();
    },
    bindEvents: function() {
        document.addEventListener('deviceready', app.onDeviceReady, false);
    },
    onDeviceReady: function() {
        app.mostrarAlerta("DEVICE READY EJECUTADO",":)");
        console.log(device);
        document.addEventListener('backbutton',app.atras,false);
        document.addEventListener('offline',app.desconectado,false);
        document.addEventListener('online',app.conectado,false)
        window.addEventListener('batterystatus',app.bateria,false);
        window.addEventListener('batterylow',app.bateriaBaja,false);
        window.addEventListener('batterycritical',app.bateriaCritica,false);
    },
    mostrarAlerta: function(mensaje,txtBoton){
        if(!txtBoton){
            txtBoton = "OKEI";
        }
        navigator.notification.alert(mensaje,function(){
            return false;
        },app.nombreApp,txtBoton);
    },
    desconectado:function(){
        app.mostrarAlerta('No hay conexion, por favor conectese a internet');
    },
    conectado:function(){
        app.mostrarAlerta('God Bless Connection');
    },
    atras: function(){
        app.mostrarAlerta("APRETASTE ATRAS");
    },
    bateria:function(info){
        app.mostrarAlerta("Cambio en el estado de bateria, porcentaje de carga "+info.level+", Esta cargando?"+info.isPlugged);
    },
    bateriaBaja:function(info){
        app.mostrarAlerta("BATERIA BAJA");
        console.log(info);
    },
    bateriaCritica:function(info){
        app.mostrarAlerta("BATERIA CRITICA");
        console.log(info);
    },
    sonar: function(){
                navigator.notification.confirm("Como desea que lo notifiquemos?",app.respuestaSonar,app.nombreApp,["SONAR","VIBRAR"]);
    },
    respuestaSonar:function(btn){
        switch(btn){
            case 1:
                navigator.notification.beep(4);
            break;
            case 2:
                navigator.notification.vibrate(20000);
            break;
            default:
                return false;
            break;
        }
    },
    ubicarme:function(){
        document.querySelector('#status').innerHTML = 'Buscando....';
       var opciones = {
        enableHighAccuracy:true
       }
        if(navigator.geolocation){
        app.watcher = navigator.geolocation.getCurrentPosition(app.encontrado,app.noEncontrado);
        }
    },
    encontrado:function(position){
        document.querySelector('#status').innerHTML = 'Encontrado....<p>Latitud:'+position.coords.latitude+'<p>Longitud:'+position.coords.longitude;
        app.ultimaUbicacion.latitude = position.coords.latitude;
        app.ultimaUbicacion.longitude = position.coords.longitude;
        if(window.sessionStorage.getItem('traeClima')){
             app.pedidoGet('http://api.openweathermap.org/data/2.5/weather?lat='+app.ultimaUbicacion.latitude+'&lon='+app.ultimaUbicacion.longitude+'&units=metric');
        }
    },
    noEncontrado:function(error){
        app.mostrarAlerta(error);
        //Mostrar un select con lugares
    },
    sacarFoto: function(){
        if(navigator.camera){
            navigator.camera.getPicture(app.okPhoto,app.errorPhoto,{
                quality:50,
                sourceType:Camera.PictureSourceType.CAMERA,
                destinationType:Camera.DestinationType.FILE_URI,
                cameraDirection:Camera.Direction.FRONT,
                targetWidth:200
            });
        }
    },
    okPhoto:function(datosFoto){
        document.querySelector('#miFoto').innerHTML = '<img src="'+datosFoto+'">';
    },
    errorPhoto:function(error){
        app.mostrarAlerta(error);
    },
    escanearQr:function(){
         cordova.plugins.barcodeScanner.scan(
      function (result) {
          app.mostrarAlerta("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
      }, 
      function (error) {
          alert("Scanning failed: " + error);
      }
   );
    },
    pedidoGet:function(url,lat,long){
        request = new XMLHttpRequest();
        request.open('GET', url, true);

        request.onload = function() {
              if (request.status >= 200 && request.status < 400){
                // Success!
                var datosClima = JSON.parse(request.responseText);
                document.querySelector('#resultadoClima').innerHTML = '<h1>Usted esta en '+datosClima.name+'</h1><h2>'+datosClima.main.temp+'</h2><span class="maxima">'+datosClima.main.temp_max+'</span>/<span class="minima">'+datosClima.main.temp_min+'</span>';
              } else {
                // We reached our target server, but it returned an error

              }
            };

            request.onerror = function() {
                  // There was a connection error of some sort
                };

            request.send();
    },
    traerClima:function(){
        app.ubicarme();
        window.sessionStorage.setItem('traeClima',1);
    }



};
