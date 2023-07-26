require("dotenv").config();
const connectionString = process.env.MONGO_CONNECTION_STRING;
const mongoose = require("mongoose");
const User = require("./userModel.js");
const express = require("express");
const app = express();
app.set("view engine", "ejs");
const userId = '64bce68516b3fc7af935cdef';
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

// Mongoose için Promise yapısını tanımlayın
mongoose.Promise = global.Promise;

mongoose.connect(connectionString)
  .then(() => {
    console.log("Veritabanı bağlantısı başarılı.");
    return User.findById(userId).exec(); // Kullanıcıyı MongoDB'den ID'ye göre yakala ve Promise döndür
  })
  .then(user => {
    console.log("Kullanıcı verisi:", user); // Kullanıcı verilerini konsola yazdır
    app.get("/", (req, res) => {
      res.render("index", {
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        email: user.email,
        bio: user.bio,
        password: user.password
      });
    });
  })
  .catch((err) => {
    console.error("Veritabanı bağlantı hatası:", err);
  });

// Diğer route ve işlemler burada devam eder...


  function fetchDataPromise(userId) {
    return new Promise((resolve, reject) => {
      User.findById(userId, (err, user) => {
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  }
  
  app.get("/edit", (req, res) => {
    User.findById(userId) // Doğrudan User.findById kullanın
      .exec()
      .then(user => {
        var firstName = user.firstName;
        var lastName = user.lastName;
        var phoneNumber = user.phoneNumber;
        var email = user.email;
        var bio = user.bio;
        var password = user.password;
  
        console.log('Sonuçlar:', user);
  
        res.render('edit', { firstName: firstName, lastName: lastName, phoneNumber: phoneNumber, email: email, bio: bio, password: password });
        // We are passing the firstName and lastName variables while rendering the edit.ejs template.
      })
      .catch(err => {
        console.error('Error:', err);
        res.render('error'); // In case of an error, we can render the error.ejs template.
      });
  });

app.get('/update', (req, res) => {
  // You can define the response for a GET request here.
  res.render('update'); // We are rendering the update.ejs template.
});


app.post('/update', (req, res) => {
  const firstName = req.body['first-name'];
  const lastName = req.body['last-name'];
  const email = req.body.email;
  const phone = req.body.phone;
  const bio = req.body.bio;
  const password = req.body.password;

  // Assuming you have the userId available from the request, or you can fetch it from the req.body or req.params
  const userIdToUpdate = '64bce68516b3fc7af935cdef';

  // Find the user by their ID and update the properties
  User.findByIdAndUpdate(
    userIdToUpdate,
    {
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phone,
      bio: bio,
      password: password,
    },
    { new: true } // This option returns the updated user instead of the old one
  )
    .exec() // Executing the query as a Promise
    .then(updatedUser => {
      console.log("Kullanıcı başarıyla güncellendi:", updatedUser);
      
      User.findById(userId) // Yeniden güncellenen veriyi çekelim
      .exec()
      .then(user => {
        res.render('index', {
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          email: user.email,
          bio: user.bio,
          password: user.password
        });
      })
      .catch(err => {
        console.error('Error:', err);
        res.render('error');
      });
  })
  .catch(err => {
    console.error("Kullanıcı güncelleme hatası:", err);
    res.status(500).send('Kullanıcı güncelleme hatası');
  });
});
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Sunucu ${port} portunda çalışıyor.`);
});
