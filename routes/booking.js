const express = require('express');
const router = express.Router();
const Booking = require('../models/booking');
const nodemailer = require('nodemailer');

// Setup nodemailer transporter (already working)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 🚀 POST route with conflict checking
router.post('/', async (req, res) => {
  try {
    // ✅ Check if the time slot is already booked
    const existingBooking = await Booking.findOne({
      date: req.body.date,
      time: req.body.time
    });

    if (existingBooking) {
      // ❌ If booking already exists, return error
      return res.status(400).json({ message: '❌ This time slot is already booked. Please choose another time.' });
    }

    // ✅ If no conflict, create and save the booking
    const newBooking = new Booking(req.body);
    await newBooking.save();

    // ✅ Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: req.body.email,
      subject: 'Your Luxe Glow Spa Appointment is Confirmed!',
      text: `Thank you, ${req.body.name}! Your booking for ${req.body.date} at ${req.body.time} has been confirmed. We look forward to seeing you! ✨`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Error sending email:', error);
      } else {
        console.log('✅ Confirmation email sent:', info.response);
      }
    });

    res.status(201).json({ message: '✅ Booking saved successfully and email sent!' });

  } catch (err) {
    console.error('Error saving booking:', err);
    res.status(500).json({ error: 'Server error saving booking' });
  }
});

module.exports = router;
