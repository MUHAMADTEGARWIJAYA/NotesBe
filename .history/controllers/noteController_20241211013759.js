import db from '../config/Database.js';
import { body, validationResult } from 'express-validator';

// Create a new note
export const createNote = async (req, res) => {
    try {
        const { title, datetime, note } = req.body;
        if (!title || !datetime || !note) {
            return res.status(400).json({ message: 'Title, datetime, and note are required' });
        }

        const [result] = await db.query(
            'INSERT INTO notes (title, datetime, note) VALUES (?, ?, ?)',
            [title, datetime, note]
        );

        res.status(201).json({ id: result.insertId, title, datetime, note });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all notes
export const getNotes = async (req, res) => {
    try {
        const [notes] = await db.query('SELECT * FROM notes');
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single note by ID
export const getNoteById = async (req, res) => {
    try {
        const [notes] = await db.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);

        if (notes.length === 0) return res.status(404).json({ message: "Note not found" });
        res.json(notes[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update note
export const updateNote = [
    body('title').notEmpty().withMessage('Title is required'),
    body('datetime').isISO8601().withMessage('Valid datetime is required'),
    body('note').notEmpty().withMessage('Note is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, datetime, note } = req.body;

        try {
            const [existingNote] = await db.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);

            if (existingNote.length === 0) return res.status(404).json({ message: "Note not found" });

            await db.query(
                'UPDATE notes SET title = ?, datetime = ?, note = ? WHERE id = ?',
                [title, datetime, note, req.params.id]
            );

            res.json({ message: "Note updated successfully" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: error.message });
        }
    }
];

// Delete note by ID
export const deleteNote = async (req, res) => {
    try {
        const [existingNote] = await db.query('SELECT * FROM notes WHERE id = ?', [req.params.id]);

        if (existingNote.length === 0) return res.status(404).json({ message: "Note not found" });

        await db.query('DELETE FROM notes WHERE id = ?', [req.params.id]);

        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
