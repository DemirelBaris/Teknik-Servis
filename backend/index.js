const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB bağlantısı
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB bağlantısı başarılı'))
  .catch((err) => console.error('MongoDB bağlantısı başarısız:', err));

// Routes
const authRouter = require('./routes/auth'); // auth.js dosyasını içe aktarıyor
const serviceRequestsRouter = require('./routes/serviceRequests'); // serviceRequests.js dosyasını içe aktarıyor
const productRouter = require('./routes/product'); // Product router'ı ekleyin
app.use('/api/products', productRouter); // Ürün işlemleri için '/api/products' yolunu kullanın


app.use('/api/auth', authRouter); // authRouter'ı '/api/auth' yolunda kullanıyor
app.use('/api/service-requests', serviceRequestsRouter); // serviceRequestsRouter'ı '/api/service-requests' yolunda kullanıyor

app.listen(port, () => {
  console.log(`Server ${port} portunda çalışıyor`);
});


