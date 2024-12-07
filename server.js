const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/deleteFromCloudinary', async (req, res) => {
    const { public_id } = req.body; // Use Cloudinary public_id for deletion
    const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/djfjn4ykb/resources/image/upload';
    const CLOUDINARY_API_KEY = '714873981916492';
    const CLOUDINARY_API_SECRET = '0PyMIxN5vZNXMJqKz-Ix8XpZPPg';

    try {
        const response = await axios.post(
            `${CLOUDINARY_URL}/destroy`,
            { public_id },
            {
                auth: {
                    username: CLOUDINARY_API_KEY,
                    password: CLOUDINARY_API_SECRET,
                },
            }
        );
        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
