import express from 'express'
import path, {dirname} from 'path'
import { fileURLToPath } from 'url'
import cookieParser from 'cookie-parser'; 
import dbMethods from './db.js'; 
import authRoutes, { authenticateToken } from './authRoutes.js'; 
import favRoutes from './favRoutes.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)

const __dirname = dirname(__filename)

app.use(express.json())
app.use(cookieParser());

app.use(express.static(path.join(__dirname, '../public')))

app.use('/api', authRoutes); 
app.use('/api/favorites', favRoutes);


app.get('/', (req, res) => {
    const token = req.cookies.auth_token;
   
    if (token) { 
        res.sendFile(path.join(__dirname, '../public', 'index.html'));
    } else {
        res.sendFile(path.join(__dirname, '../public', 'login.html'));
    }
})

app.get('/favorites.html', (req, res, next) => {
    authenticateToken(req, res, () => {
        res.sendFile(path.join(__dirname, '../public', 'favorites.html'));
    });
});

app.use((req, res) => {
    res.status(404).send('404: File Not Found');
});

app.listen(PORT, ()=> {
    console.log(`Server has started on port: ${PORT}`);
    if(dbMethods) console.log('Database initialized and ready.');
})