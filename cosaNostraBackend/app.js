import https from 'https';
import fs from 'fs';
import express from 'express';
import path from 'path';
import cors from 'cors';
import Stripe from 'stripe';
import cookieParser from 'cookie-parser';
import { generateClientTokenHandler, processPaymentHandler } from './controllers/braintreeController.js';
import { verifyToken } from './middleware/authMiddleware.js';
import { isBarber, isClient } from './middleware/roleMiddleware.js';
import { createCheckoutSessionHandler } from './controllers/stripeController.js';
import { logoutHandler, refreshHandler, registerHandler, loginHandler, barberloginHandler, barberregisterHandler } from './controllers/authController.js';
import { getBarbersHandler, getBarberHandler, createBarberHandler, updateBarberHandler, deleteBarberHandler } from './controllers/barbersController.js';
import { getServicePriceHandler, getServicesHandler, getServiceHandler, createServiceHandler, updateServiceHandler, deleteServiceHandler } from './controllers/servicesController.js';
import { getClientsHandler, getClientHandler, createClientHandler, updateClientHandler, updateClientByUsernameHandler, deleteClientHandler } from './controllers/clientsController.js';
import { getAppointmentHandler, getAppointmentsHandler, createAppointmentHandler, updateAppointmentHandler, deleteAppointmentHandler, GetAvailableSlotsHandler, getAppointmentDetailsHandler, getAppointmentDetailsForClientHandler, deleteLastAppointmentHandler } from './controllers/appointmentsController.js';
import { getServiceAppointmentHandler, getServiceAppointmentsHandler, createServiceAppointmentsHandler, updateServiceAppointmentsHandler, deleteServiceAppointmentsHandler } from './controllers/serviceappointmentsController.js';
import { getBarberAppointmentHandler, getBarberAppointmentsHandler, createBarberAppointmentsHandler, updateBarberAppointmentsHandler, deleteBarberAppointmentsHandler } from './controllers/barberAppointmentsController.js';
import { stripeWebhookHandler } from './controllers/stripeWebhookController.js';

const app = express();
const stripe = new Stripe('sk_test_51PP98SRxP15yUwgNmYFy3NfQoDI6slODC3kWM2Z1eDtPEXro38hpPEuA59oMy4UxC2tHnCFHvnFrfNzdx1UOScFZ00CPPVJpCO');

const corsOptions = {
  origin: 'https://kosa-nostra.com',
  optionsSuccessStatus: 200,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true, // Allow cookies to be included  
};

app.use(cors(corsOptions));
app.use(cookieParser());


app.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhookHandler);
app.use(express.json()); // Parse JSON request bodies

app.post('/create-checkout-session', createCheckoutSessionHandler);
app.post('/register', registerHandler);
app.post('/login', loginHandler);
//app.post('/barberregister', barberregisterHandler);
app.post('/barberlogin', barberloginHandler);
app.post('/refresh', refreshHandler );
app.post('/logout', logoutHandler);

app.get('/barbers', verifyToken, getBarbersHandler);
app.get('/barbers/:id', verifyToken, getBarberHandler);
app.post('/barbers', verifyToken, isBarber, createBarberHandler);
app.put('/barbers/:id', verifyToken, isBarber, updateBarberHandler);
app.delete('/barbers/:id', verifyToken, isBarber, deleteBarberHandler);

app.get('/services', getServicesHandler);
app.get('/services/:id', getServiceHandler);
app.post('/services', verifyToken, isBarber, createServiceHandler);
app.put('/services/:id', verifyToken, isBarber, updateServiceHandler);
app.delete('/services/:id', verifyToken, isBarber, deleteServiceHandler);
app.get('/serviceprice/:id', verifyToken, getServicePriceHandler);

app.get('/clients', verifyToken, isBarber, getClientsHandler);
app.get('/clients/:id', verifyToken, isBarber, getClientHandler);
app.post('/clients', verifyToken, isBarber, createClientHandler);
app.put('/clients/:id', verifyToken, isBarber, updateClientHandler);
app.put('/clientsByUsername/:username', verifyToken, isBarber, updateClientByUsernameHandler);
app.delete('/clients/:id', verifyToken, isBarber, deleteClientHandler);

app.get('/appointment', verifyToken, getAppointmentsHandler);
app.get('/appointment/:id', verifyToken, getAppointmentHandler);
app.post('/appointment', verifyToken, createAppointmentHandler);
app.put('/appointment/:id', verifyToken, isBarber, updateAppointmentHandler);
app.delete('/appointment/:id', verifyToken, isBarber, deleteAppointmentHandler);
app.get('/available-slots', verifyToken, GetAvailableSlotsHandler);
app.get('/appointment-details/:id', verifyToken, isBarber, getAppointmentDetailsHandler);
app.get('/appointment-details-client/:id', verifyToken, getAppointmentDetailsForClientHandler);
app.delete('/delete-last-appointment', verifyToken, deleteLastAppointmentHandler);

app.get('/serviceappointment', verifyToken, getServiceAppointmentsHandler);
app.get('/serviceappointment/:id', verifyToken, getServiceAppointmentHandler);
app.post('/serviceappointment', verifyToken, createServiceAppointmentsHandler);
app.put('/serviceappointment/:id', verifyToken, isBarber, updateServiceAppointmentsHandler);
app.delete('/serviceappointment/:id', verifyToken, isBarber, deleteServiceAppointmentsHandler);

app.get('/barberappointment', verifyToken, getBarberAppointmentsHandler);
app.get('/barberappointment/:id', verifyToken, getBarberAppointmentHandler);
app.post('/barberappointment', verifyToken, createBarberAppointmentsHandler);
app.put('/barberappointment/:id', verifyToken, updateBarberAppointmentsHandler);
app.delete('/barberappointment/:id', verifyToken, deleteBarberAppointmentsHandler);

app.get('/braintree/client-token/:customerId?', generateClientTokenHandler);
app.post('/braintree/checkout', processPaymentHandler);  // Process payment

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});


// Catch-all handler for all non-API routes (returns index.html for React Router to handle)
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Load SSL certificate and key
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/www.api.kosa-nostra.com/privkey.pem'), // Path to your Let's Encrypt private key
  cert: fs.readFileSync('/etc/letsencrypt/live/www.api.kosa-nostra.com/fullchain.pem') // Path to your Let's Encrypt certificate
};

// Start HTTPS server
https.createServer(sslOptions, app).listen(443, () => {
  console.log('HTTPS Server running on port 443');
});

