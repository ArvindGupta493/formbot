const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoute = require('./routes/user.route');
const folderRoutes = require('./routes/folder.route');
const authMiddleware = require('./middlewares/AuthMiddleware');

dotenv.config();

// Enable CORS
app.use(cors());

// Define the port from environment or default to 4000
const PORT = process.env.PORT || 4000;

// Middlewares & Routers
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// Route middleware for user authentication (register/login)
app.use('/api/user', userRoute);

// Route middleware for folder-related operations 
app.use('/api/folders', folderRoutes);

// Start the server and connect to MongoDB
app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => { 
            console.log("Connected to MongoDB");
        }).catch((err) => { 
            console.log(err);
        });
    console.log(`Server is running on port ${PORT}`);
});
  




app.get('/form-dashboard/:userId/:permission', (req, res) => {
    const { userId, permission } = req.params;
  
    // Validate the permission and userId
    if (!['edit', 'view'].includes(permission)) {
      return res.status(400).json({ message: 'Invalid permission' });
    }
  
    // Do something with the userId and permission
    res.json({ message: `User ID: ${userId}, Permission: ${permission}` });
  });
  