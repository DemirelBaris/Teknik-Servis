const express = require('express');
const router = express.Router();
const Product = require('../models/Product'); // Ürün modelini içe aktarın

// Ürün ekleme rotası
router.post('/add', async (req, res) => {
  const { productName, brand, stock, category, department, status } = req.body;

  try {
    const newProduct = new Product({
      productName,
      brand,
      stock,
      category,
      department,
      status,
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

// Tüm ürünleri listeleme rotası
router.get('/', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Sunucu hatası');
    }
  });

  // Ürün silme rotası
  router.delete('/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ msg: 'Ürün bulunamadı' });
      }
      res.json({ msg: 'Ürün başarıyla silindi' });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Sunucu hatası');
    }
  });

  // Ürün güncelleme (Arızalı olarak işaretleme)
  router.put('/:id', async (req, res) => {
    try {
      const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!updatedProduct) {
        return res.status(404).send('Ürün bulunamadı');
      }
      res.json(updatedProduct);
    } catch (err) {
      console.error('Ürün güncellenirken bir hata oluştu:', err);
      res.status(500).send('Sunucu hatası');
    }
  });

  // Sadece arızalı ürünleri getirme
router.get('/faulty', async (req, res) => {
    try {
      const faultyProducts = await Product.find({ status: 'Arızalı' });
      res.json(faultyProducts);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Sunucu hatası');
    }
  });

  // Ürün istatistiklerini getirme rotası
router.get('/statistics', async (req, res) => {
    try {
      const products = await Product.find();
  
      const statusCount = products.reduce((acc, product) => {
        acc[product.status] = (acc[product.status] || 0) + 1;
        return acc;
      }, {});
  
      const stockData = products.map(product => ({
        name: product.productName,
        stock: product.stock,
      }));
  
      res.json({
        statusCount,
        stockData,
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Sunucu hatası');
    }
  });

module.exports = router;
