import Note from "../models/noteModel.js";
import { body, validationResult } from 'express-validator';

// Create a new note using headers
export const createNote = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Get custom headers from the request
    const title = req.headers['x-title'];
    const datetime = req.headers['x-datetime']; // Updated to match column 'datetime'
    const note = req.headers['x-note']; // Updated to match column 'note'

    // Check if headers are present
    if (!title || !datetime || !note) {
        return res.status(400).json({ message: 'Title, Datetime, and Note are required' });
    }

    try {
        // Create a new note in the database using values from headers
        const newNote = await Note.create({
            title,
            datetime,
            note,
        });

        res.status(201).json(newNote);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// Get all notes
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.findAll();
        res.json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get single note by ID
export const getNoteById = async (req, res) => {
    try {
        const note = await Note.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!note) return res.status(404).json({ message: "Note not found" });
        res.json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update note
export const updateNote = [
    body('title').notEmpty().withMessage('Title is required'),
    body('datetime').isISO8601().withMessage('Valid datetime is required'), // Updated to 'datetime'
    body('note').notEmpty().withMessage('Note is required'), // Updated to 'note'
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, datetime, note } = req.body;

        try {
            const existingNote = await Note.findOne({
                where: { id: req.params.id },
            });

            if (!existingNote) return res.status(404).json({ message: "Note not found" });

            await Note.update({ title, datetime, note }, {
                where: { id: req.params.id },
            });

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
        const note = await Note.findOne({
            where: {
                id: req.params.id,
            },
        });
        if (!note) return res.status(404).json({ message: "Note not found" });

        await Note.destroy({
            where: {
                id: req.params.id,
            },
        });

        res.json({ message: "Note deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
