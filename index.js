
const express = require('express');
const cors = require('cors');
const axios = require('axios');
var https = require('https');
var http = require('http');
const fs = require('fs');

const ep =require ('./js/endpoints_parser');


const {SERVER_PORT, SERVER_HOSTNAME, AMBIENTE, SERVER_PORT_HTTPS, PKDIR, CERTDIR, CADIR } = require('./config');
const app = express();
app.use(cors())

//Inicializamos servidor http
const httpServer = http.createServer(app);

httpServer.listen(SERVER_PORT,SERVER_HOSTNAME,() => {
  console.log(`Server http running at http://${SERVER_HOSTNAME}:${SERVER_PORT}/`);
  

});

//Buscamos datos para credenciales https
const pkDir=PKDIR;
const certDir=CERTDIR;
const caDir =CADIR;

//Si se encuentran los archivos de credenciales
if (fs.existsSync(pkDir) && fs.existsSync(certDir) && fs.existsSync(caDir)){
  const privateKey = fs.readFileSync(pkDir, 'utf8');
  const certificate = fs.readFileSync(certDir, 'utf8');
  const ca = fs.readFileSync(caDir, 'utf8');
  
  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca
  };
  
  //Inicializamos servidor https
  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(SERVER_PORT_HTTPS,SERVER_HOSTNAME, () => {
    console.log(`Server https running at https://${SERVER_HOSTNAME}:${SERVER_PORT_HTTPS}/`);
  });
}
else{   //faltan archivos de credenciales
  console.log("No se pudo inicializar el servidor https ya que faltan credenciales");
}

console.log("Ambiente: "+ AMBIENTE);


app.get("/welcome", (req, res) => {

    res.status(200).send("Bienvenido!");
})

/**
 * Endpoint que consulta productos a la API de items. 
 * Devuelve los datos reestructurados para que los consuma el cliente.
 */
app.get("/api/items", async (req,res)=>{

var search = {};
var limit = 50;
var offset=1;
var query = req.query;

//Si vienen parámetros, de búsqueda mejor.
if (query.limit!=undefined || query.offset!=undefined){
   offset = query.offset;
   limit = query.limit;
}

console.log("query"+JSON.stringify(query));
console.log("offset"+offset);
console.log("limit"+limit);
var q="";
console.log(query.q==null);
if (query.q!=null){
  q = query.q;
}

//console.log("query:" +JSON.stringify(query));

  //Endpoint API búsqueda de Mercado Libre
  await axios.get('https://api.mercadolibre.com/sites/MLA/search?q='+q,{
    params: {
      offset: offset,
      limit:limit
    }
  })
        .then(response=>{
            if (response.data!=null){
              var data = response.data;
              var obj_categories = [];
              
              //controla que filters y values no sean nulos.
              if (data.filters[0]!=null){
                if (data.filters[0].values!=null){
                  obj_categories = data.filters[0].values[0].path_from_root;
                }
              }
              
              var obj_items = data.results;

              //Autor
              search.author = ep.GetAuthor();
              //categorías del producto
              search.categories = ep.GetCategories(obj_categories);
              //items
              search.items = ep.GetItems(obj_items);
            }
            
        })
        .catch(error => {
            console.log(error);
            return res.status(500).json({msg:"Ocurrió un problema al consultar la API", error: error})
        });

  res.status(200).json({author:search.author, categories:search.categories, items:search.items});

})



app.get("/api/items/:id", async (req,res)=>{

  var search = {};
  var id = req.params.id;
  console.log("id:" +id);
  var APIErrors={};
  
    //Endpoint API Mercado Libre. búsqueda de item por id
     await axios.get('https://api.mercadolibre.com/items/'+id)
           .then(response=> {
               if (response.data!=null){
                 var obj_item = response.data;
  
                 search.author = ep.GetAuthor();
                 search.item = ep.GetItem(obj_item);
                 search.pictures = ep.GetPictures(obj_item.pictures);
                 search.condition = (obj_item.condition=='new'?'Nuevo':'Usado');
                 search.free_shipping = obj_item.shipping.free_shipping
                 search.sold_quantity = obj_item.sold_quantity;
                
               }
 
           })
           .catch(error => {
               console.log(error);
               APIErrors.error=error
           });
          

          if (APIErrors.error==null){
            //Endpoint API Mercado Libre. búsqueda de descripción del item
            await axios.get('https://api.mercadolibre.com/items/'+id+'/description')
            .then(response=>{
                if (response.data!=null){
                  var description = "";
                  var obj_item = response.data;
                  if (obj_item!=null){
                    description = obj_item.plain_text;
                  }
                  search.description = description; 
                }
                
            })
            .catch(error => {
               //console.log(error);
                APIErrors.error=error
            });

          }
          
    if (APIErrors.error==null){
      
      res.status(200).json({
          author:search.author,
          categories:search.categories,
          item:search.item,
          pictures: search.pictures,
          free_shipping: search.free_shipping,
          condition:search.condition,
          sold_quantity: search.sold_quantity,
          description: search.description
        });
      
      }else{
        console.log("No se encuentra el elemento " + APIErrors.error);
        
        res.status(500).send({ APIErrors });
      }

  })



app.get("/api/items/categories", async (req,res)=>{

  var search = {};
  var query = req.query;
  var q="";
  console.log(query.q==null);
  if (query.q!=null){
    q = query.q;
  }
  
  console.log("query:" +JSON.stringify(query));
  
    //Endpoint API búsqueda de Mercado Libre
    await axios.post('https://api.mercadolibre.com/sites/MLA/search?q='+q,{})
          .then(response=>{
              if (response.data!=null){
                var data = response.data;
                var obj_categories = [];
                
                //controla que filters y values no sean nulos.
                if (data.filters[0]!=null){
                  if (data.filters[0].values!=null){
                    obj_categories = data.filters[0].values[0].path_from_root;
                  }
                }
                
                search.categories = ep.GetCategories(obj_categories);
                
              }
              
          })
          .catch(error => {
              console.log(error);
              return res.status(500).json({msg:"No se ha podido realizar la conexión con la API de Mercado Libre.", error: error})
          });
  
    res.status(200).json({categories:search.categories});
  
  })



