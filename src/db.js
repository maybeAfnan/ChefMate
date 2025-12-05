import { DatabaseSync } from "node:sqlite";

const sqlite = new DatabaseSync("./chefmate.db");

sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        hashed_password TEXT NOT NULL
    )
`);

sqlite.exec(`
    CREATE TABLE IF NOT EXISTS favorites (
        meal_id TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        strMeal TEXT,
        strMealThumb TEXT,
        strCategory TEXT,
        calories INTEGER,
        cookingTime INTEGER,
        PRIMARY KEY (user_id, meal_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`);

const db = {
    insertUser(username, hashedPassword) {
        const stmt = sqlite.prepare(
            "INSERT INTO users (username, hashed_password) VALUES (?, ?)"
        );
        const result = stmt.run(username, hashedPassword);
        return result.lastInsertRowid;
    },

    findUserByUsername(username) {
        const stmt = sqlite.prepare(
            "SELECT id, username, hashed_password FROM users WHERE username = ?"
        );
        return stmt.get(username);
    },

    getFavorites(userId) {
        const stmt = sqlite.prepare(
            "SELECT meal_id, strMeal, strMealThumb, strCategory, calories, cookingTime FROM favorites WHERE user_id = ?"
        );
        return stmt.all(userId);
    },

    insertFavorite(userId, meal) {
        const stmt = sqlite.prepare(
            `INSERT OR IGNORE INTO favorites 
            (user_id, meal_id, strMeal, strMealThumb, strCategory, calories, cookingTime) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`
        );

        const result = stmt.run(
            userId,
            meal.idMeal,
            meal.strMeal,
            meal.strMealThumb,
            meal.strCategory,
            meal.calories,
            meal.cookingTime
        );

        return result.changes > 0;
    },

    deleteFavorite(userId, mealId) {
        const stmt = sqlite.prepare(
            "DELETE FROM favorites WHERE user_id = ? AND meal_id = ?"
        );
        const result = stmt.run(userId, mealId);
        return result.changes > 0;
    },
};

export default db;

