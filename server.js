const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const fs = require('fs');

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());

const upload = multer({ dest: '/tmp/' });

app.post('/api/upload-audio', upload.single('audio'), async (req, res) => {
    let filePath = '';
    try {
        if (!req.file) return res.status(400).json({ message: 'File audio tidak ditemukan!' });
        
        filePath = req.file.path;
        const { apiKey, targetId, targetType, title } = req.body;

        const configData = {
            assetType: "Audio",
            displayName: title || "Audio Track",
            description: "Uploaded via Blaze Squad Dev Tools",
            creationContext: { creator: {} }
        };

        if (targetType === "group") {
            configData.creationContext.creator.groupId = targetId;
        } else {
            configData.creationContext.creator.userId = targetId;
        }

        const form = new FormData();
        form.append('request', JSON.stringify(configData), { contentType: 'application/json' });
        form.append('fileContent', fs.createReadStream(filePath), {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const response = await axios.post('https://apis.roblox.com/assets/v1/assets', form, {
            headers: { ...form.getHeaders(), 'x-api-key': apiKey },
        });

        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.json(response.data);
    } catch (error) {
        if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
        res.status(500).json({ message: error.response ? JSON.stringify(error.response.data) : error.message });
    }
});

module.exports = app;
