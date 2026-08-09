const path = require('path');
// Load environment variables from the parent directory of src
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const connectDB = require('./config/db');
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB Database
connectDB();

// Start the HTTP Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
