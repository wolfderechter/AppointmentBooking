var express = require('express');
var router = express.Router();
const ObjectId = require('mongodb').ObjectId;

// endpoint /appointments: get request, will return the appointments or an error
router.get('/appointments', (req, res, next) => {
  req.collection.find({})
    .toArray()
    .then(results => res.json(results))
    .catch(error => res.send(error));
});

// endpoint /appointments: post request, will create a new appointment
router.post('/appointments', (req, res, next) => {
  const { appointmentDate, name, email } = req.body;
  //check if any of the fields is empty
  if (!appointmentDate || !name || !email) {
    return res.status(400).json({
      message: 'Appointment date, name and email are required',
    });
  }

  //Add the object to the DB
  const payload = { appointmentDate, name, email };
  req.collection.insertOne(payload)
    .then(result => res.json(result))
    .catch(error => res.status(400).json(
      { message: 'No appointments available on that date' }
    ));
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
