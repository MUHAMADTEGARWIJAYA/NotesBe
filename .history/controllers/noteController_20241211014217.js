import db from '../config/Database.js';
import { body, validationResult } from 'express-validator';

// Create a new note
export const createNote = (req, res) => {
    const { title, datetime, note } = req.body;
    if (!title || !datetime || !note) {
        return res.status(400).json({ message: 'Title, datetime, and note are required' });
    }

    db.query(
        'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)',
        [title, datetime, note],
        (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: 'Internal server error' });
            }

            res.status(201).json({ id: result.insertId, title, datetime, note });
        }
    );
};

// Get all notes
export const getNotes = (req, res) => {
    db.query('SELECT * FROM notes', (error, notes) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }

        res.json(notes);
    });
};

// Get single note by ID
export const getNoteById = (req, res) => {
    db.query('SELECT * FROM notes WHERE id = ?', [req.params.id], (error, notes) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }

        if (notes.length === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        res.json(notes[0]);
    });
};

// Update note
export const updateNote = [
    body('title').notEmpty().withMessage('Title is required'),
    body('datetime').isISO8601().withMessage('Valid datetime is required'),
    body('note').notEmpty().withMessage('Note is required'),
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, datetime, note } = req.body;

        db.query('SELECT * FROM notes WHERE id = ?', [req.params.id], (error, existingNote) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: error.message });
            }

            if (existingNote.length === 0) {
                return res.status(404).json({ message: "Note not found" });
            }

            db.query(
                'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?',
                [title, datetime, note, req.params.id],
                (error, result) => {
                    if (error) {
                        console.error(error);
                        return res.status(500).json({ message: error.message });
                    }

                    res.json({ message: "Note updated successfully" });
                }
            );
        });
    }
];

// Delete note by ID
export const deleteNote = (req, res) => {
    db.query('SELECT * FROM notes WHERE id = ?', [req.params.id], (error, existingNote) => {
        if (error) {
            console.error(error);
            return res.status(500).json({ message: error.message });
        }

        if (existingNote.length === 0) {
            return res.status(404).json({ message: "Note not found" });
        }

        db.query('DELETE FROM notes WHERE id = ?', [req.params.id], (error, result) => {
            if (error) {
                console.error(error);
                return res.status(500).json({ message: error.message });
            }

            res.json({ message: "Note deleted successfully" });
        });
    });
};
