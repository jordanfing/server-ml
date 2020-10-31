



module.exports = {

    /**
     * recibe un array de filtros de categorías y devuelve una estructura simplificada
     * @param {Array} categories 
     */
    GetCategories: function(obj_categories){

        var categories=[];
               for (var i = 0; i < obj_categories.length; i++){
                 var category_name = obj_categories[i].name;
                 categories.push(category_name);  
               }

        return categories;
    },

    /**
     * Recibe un array de items y devuelve una estructura simplificada
     * @param {Array} obj_items 
     */
    GetItems: function(obj_items){

        //lista de productos simplificados
        var items=[];

        //por cada item
        obj_items.forEach(obj_item=>{
            var amount = Math.floor(obj_item.price) //número entero
            var decimals = ((obj_item.price*100)%100) //decimales

            var item = {
                id: obj_item.id,
                title: obj_item.title,
                price:{
                    currency:obj_item.currency_id,
                    amount:amount,
                    decimals: decimals
                },
                picture:obj_item.thumbnail,
                condition:obj_item.condition,
                free_shipping:obj_item.shipping.free_shipping

            }
            items.push(item);
        })

        return items;
    },

/**
     * Recibe un objeto item y devuelve una estructura simplificada
     * @param {Object} obj_item 
     */
    GetItem: function(obj_item){

        //lista de productos simplificados
        var item={};
        var amount = Math.floor(obj_item.price) //número entero
        var decimals = ((obj_item.price*100)%100) //decimales

        item = {
            id: obj_item.id,
            title: obj_item.title,
            price:{
                currency:obj_item.currency_id,
                amount:amount,
                decimals: decimals
            }
        }
   

        return item;
    },

    GetAuthor: function(){

        var author={
            name:'Jordan',
            lastname:'Fingerhut',
          }
          return author;
    }

}