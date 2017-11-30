var fs = require('fs');

function writeScreenShot(data, filename) {
        var stream = fs.createWriteStream(filename);
        stream.write(new Buffer(data, 'base64'));
        stream.end();
}

describe('Data is loaded',function  (){
   it('Should show a list of more than one researchers', function (){
       
       /* Accedemos al recurso donde se encuentran todos los investigadores */
       browser.get("http://localhost:8080/#!/researchers");
       
       /* Obtenemos todos los investigadores dado el bucle researcher in researchers */
       var researchers = element.all(by.repeater('researcher in researchers'));
       
       /* Esperamos el tiempo de respuesta de la página */
       browser.driver.sleep(2000);
       
       /* Capturamos la información resultante y la almacenamos como una imagen de tipo PNG */
       browser.takeScreenshot().then(function (png) {
    			writeScreenShot(png, 'ng-test.png');
    	});
    	
       /* Resultados esperados */	
       expect(researchers.count()).toBeGreaterThan(1);
   });
});