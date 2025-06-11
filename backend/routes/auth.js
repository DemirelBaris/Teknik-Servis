const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const User = require('../models/User');

const router = express.Router();

// Giriş yapma rotası
router.post('/login', [
  check('email', 'Geçerli bir e-posta gereklidir').isEmail(),
  check('password', 'Şifre gereklidir').exists(),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // Kullanıcının var olup olmadığını kontrol et
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Geçersiz e-posta veya şifre' });
    }

    // Şifreyi karşılaştır
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Geçersiz e-posta veya şifre' });
    }

    // JWT oluşturma
    const payload = {
      user: {
        id: user.id,
        role: user.role // Kullanıcının rolü
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' }, // Token 1 saat geçerli olacak
      (err, token) => {
        if (err) throw err;
        res.json({ token, role: user.role }); // Role bilgisini de döndür
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

module.exports = router;
