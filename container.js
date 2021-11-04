//---------------------------------------------------------------------- Import

const fs = require('fs');

//---------------------------------------------------------------------- Class Container

class Container {
  constructor(name) {
    this.name = name;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.name, 'utf-8');
      return JSON.parse(data);
    }
    catch (err) {
      return [];
    }
  }

  async save(object) {
    const data = await this.getAll();
    if (data.length) {
      const idPrev = parseInt(data[data.length-1].id)
      const product = await { ...object, id: idPrev+1 };
      data.push(product);
    } else {
      const product = await { ...object, id: 1 };
      data.push(product);
    }
    try {
      await fs.promises.writeFile(this.name, JSON.stringify(data));
      return data[data.length-1];
    }
    catch (err) {
      console.log('ERROR ->', err);
    }
  }

  async getById(productId) {
    try {
      const data = await this.getAll();
      const product = data.find(e => e.id == productId);
      return product;
    }
    catch (err) {
      console.log('ERROR ->', err);
    }
  }

  async updateById (productId, object) {
    try {
      const data = await this.getAll();
      const productIndex = data.findIndex(e => e.id == productId);
      if (productIndex>=0) {
        const updatedObject = await { ...object, id: productId };
        data[productIndex] = updatedObject;  
        await fs.promises.writeFile(this.name, JSON.stringify(data));
        return updatedObject;  
      } else {
        return false;
      }
    }
    catch (err) {
      console.log('ERROR ->', err);
    }
  }

  async deleteById(productId) {
    try {
      const data = await this.getAll();
      const productIndex = data.findIndex(e => e.id == productId);
      if (productIndex>=0) {
        data.splice(productIndex, 1);
        await fs.promises.writeFile(this.name, JSON.stringify(data));
        return `Se eliminó correctamente el archivo con Id ${productId}`;
      } else {
        return false;
      }
    }
    catch (err) {
      console.log('ERROR ->', err);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.name, '[]');
    }
    catch (err) {
      console.log('Error', err);
    }
  }

}

module.exports = Container;
