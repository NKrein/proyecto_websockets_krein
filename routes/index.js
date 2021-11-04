const { Router } = require('express');
const Container = require('../container')
const router = Router();

const db = new Container('./db.txt');
const errObj = { error: 'Producto no encontrado' };

function serverRoutes(app) {
  app.use('/productos', router);

  // Devuelve todos los productos
  router.get('/', (req, res) => {
    const allProducts = db.getAll();
    allProducts.then(response => {
      res.render('index', { products: response });
    }).catch(err => console.log('Error ->', err));
  })

  // Devuelve un producto segun id
  router.get('/:id', (req, res) => {
    const { id } = req.params;
    const object = db.getById(id);
    object.then(response => {
      if (response) {
        res.render('index', { products: [response] });
      } else {
        res.json(errObj);
      }
    }).catch(err => console.log('Error ->', err));
  })

  // Recibe y agrega nuevo producto, lo devuelve con el id
  router.post('/', (req, res) => {
    const obj = req.body;
    const savedObj = db.save(obj);
    savedObj.then(res.redirect('/')).catch(err => console.log('Error ->', err));
  })

  //   // Recibe y actualiza un producto segun id
  //   router.put('/:id', (req, res) => {
  //     const { id } = req.params;
  //     const obj = req.body;
  //     const updatedObj = db.updateById(id, obj);
  //     updatedObj.then( response => {
  //       if (response) {
  //         res.json(response);
  //       } else {
  //         res.json(errObj);
  //       }
  //     }).catch(err => console.log('Error ->', err));
  //   })

  //   // Elimina producto segun id
  //   router.delete('/:id', (req, res) => {
  //     const { id } = req.params;
  //     const savedObj = db.deleteById(id);
  //     savedObj.then( response => {
  //       if (response) {
  //         res.json(response);
  //       } else {
  //         res.json(errObj);
  //       }
  //     }).catch(err => console.log('Error ->', err));
  //   })

}

module.exports = serverRoutes;