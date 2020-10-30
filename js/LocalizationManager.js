

//satelites
var kenobi={
    id:1,
    name:"kenobi",
    position:[4.0,4.0]
} 

var skywalker={
    id:2,
    name:"skywalker",
    position:[9.0,7.0]
} 

var sato={
    id:3,
    name:"sato",
    position:[9.0,1.0]
} 


module.exports={

    /**
     * Retorna las coordenadas x e y de la nave en auxilio.
     * @param {Array} distances 
     */
    GetLocation: function(distances){
    
        //distancias
        var d1=4;
        var d2=3;
        var d3=3.25;
        
        var x1 = kenobi.position[0];
        var y1 = kenobi.position[1];

        var x2 = skywalker.position[0];
        var y2 = skywalker.position[1];
        
        var x3 = sato.position[0];
        var y3 = sato.position[1];
        //formulas
        
        var A = (-2*x1) + (2*x2);
        var B = (-2*y1) + (2*y2);
        var C = d1-d2 - Math.pow(x1,2)+ Math.pow(x2,2) - Math.pow(y1,2) + Math.pow(y2,2);
        var D = (-2*x2) + (2*x3);
        var E = (-2*y2) + (2*y3);
        var F = d2-d3 - Math.pow(x2,2) + Math.pow(x3,2) - Math.pow(y2,2) + Math.pow(y3,2);

        var x = ((C*E) - (F*B)) / ((E*A)-(B*D));
        var y = ((C*D)-(A*F)) / ((B*D)-(A*E));

       var position={
            x:x,
            y:y
        }

        return position;

    },

    /**
     * Retorna el mensaje enviado por la nave en auxilio.
     * @param {Array} messages 
     */
    GetMessage: function(messages){

    }


}