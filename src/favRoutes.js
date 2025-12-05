import express from 'express';
import db from './db.js'; 
import { authenticateToken } from './authRoutes.js'; 

const router = express.Router();

router.use(authenticateToken); 

//get all favorites
router.get('/', (req, res) => {
    try {
        const favorites = db.getFavorites(req.user.id); 
        res.json(favorites);
    } catch (error) {
        console.error("Error fetching favorites:", error);
        res.status(500).json({ message: 'Failed to retrieve favorites.' });
    }
});

//add to favorite
router.post('/', (req, res) => {
    const { idMeal, strMeal, strMealThumb, strCategory, calories, cookingTime } = req.body;

    if (!idMeal) {
        return res.status(400).json({ message: 'Meal ID is required.' });
    }

    const mealData = { idMeal, strMeal, strMealThumb, strCategory, calories, cookingTime };

    try {
        const added = db.insertFavorite(req.user.id, mealData);
        if (added) {
            res.status(201).json({ message: 'Favorite added successfully.', added: true });
        } else {
            res.status(200).json({ message: 'Meal already in favorites.', added: false });
        }
    } catch (error) {
        console.error("Error adding favorite:", error);
        res.status(500).json({ message: 'Failed to add favorite.' });
    }
});

//remove from favorite
router.delete('/:mealId', (req, res) => {
    const { mealId } = req.params;

    try {
        const removed = db.deleteFavorite(req.user.id, mealId);
        if (removed) {
            res.json({ message: 'Favorite removed successfully.', removed: true });
        } else {
            res.status(404).json({ message: 'Favorite not found for this user.', removed: false });
        }
    } catch (error) {
        console.error("Error deleting favorite:", error);
        res.status(500).json({ message: 'Failed to remove favorite.' });
    }
});

export default router;