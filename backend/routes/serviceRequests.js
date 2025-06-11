const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequests');

// Servis isteği oluşturma
router.post('/', async (req, res) => {
  const { userName, department, issue } = req.body;

  try {
    const newRequest = new ServiceRequest({
      userName,
      department,
      issue,
    });

    const savedRequest = await newRequest.save();
    res.json(savedRequest);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

// Kullanıcının kendi servis isteklerini alma
router.get('/user', async (req, res) => {
  const userName = req.query.userName;

  try {
    const requests = await ServiceRequest.find({ userName });
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

// Tüm servis isteklerini alma
router.get('/all', async (req, res) => {
  try {
    const requests = await ServiceRequest.find({});
    res.json(requests);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

module.exports = router;
