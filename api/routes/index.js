var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;
const nodemailer = require("nodemailer");
const config = require('./../config');

// endpoint /appointments: get request, will return the appointments or an error
router.get('/appointments', (req, res, next) => {
  req.collection.find({})
    .toArray()
    .then(results => res.json(results))
    .catch(error => res.send(error));
});

// endpoint /appointments: post request, will send a confirmation email and add to the database
router.post('/appointments', (req, res, next) => {
  const { appointmentDate, name, email } = req.body;
  //check if any of the fields is empty
  if (!appointmentDate || !name || !email) {
    return res.status(400).json({
      message: 'Appointment date, name and email are required',
    });
  }

  //Add the object to the DB
  const appointment = { appointmentDate, name, email };
  req.collection.insertOne(appointment)
    .then(result => res.json(result))
    .catch(error => {
      res.status(400).json({ message: 'No appointments available on that date' });
      return;
    });

  //Send Confirmation email
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'email@gmail.com',
      pass: 'passcode'
    }
  });

  var mailOptions = {
    from: 'email@gmail.com',
    to: email,
    subject: 'Appointment Confirmed',
    html: `<h3>Hey ${name}, Your appointment for ${new Date(appointmentDate).toDateString()} is confirmed!</h3>`
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
});



// endpoint /appointments/:id: delete request, will delete the appointment with the given id
router.delete('/appointments/:id', (req, res, next) => {
  const { id } = req.params;
  const _id = ObjectId(id);

  req.collection.deleteOne({ _id })
    .then(result => res.json(result))
    .catch(error => res.send(error));
})

module.exports = router;
