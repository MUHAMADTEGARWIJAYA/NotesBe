import db from "../config/Database.js";

export const createNote = async (noteData) => {
    const sql = `INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)`;
    const values = [noteData.title, noteData.datetime, noteData.note];
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

export const getNotes = async () => {
    const sql = `SELECT * FROM notes`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, results) => {
            if (err) reject(err);
            resolve(results);
        });
    });
};

export const getNoteById = async (id) => {
    const sql = `SELECT * FROM notes WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) reject(err);
            resolve(result[0]);
        });
    });
};

export const deleteNote = async (id) => {
    const sql = `DELETE FROM notes WHERE id = ?`;
    return new Promise((resolve, reject) => {
        db.query(sql, [id], (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

export const updateNote = async (id, noteData) => {
    const sql = `UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?`;
    const values = [noteData.title, noteData.datetime, noteData.note, id];
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};
