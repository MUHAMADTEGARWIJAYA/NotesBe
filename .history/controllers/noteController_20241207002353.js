import Note from "../models/noteModel.js";
import { body, validationResult } from 'express-validator';

// Create a new note
export const createNote = [
    body('title').notEmpty().withMessage('Title is required'),
    body('datetime').notEmpty().isISO8601().withMessage('Valid date is required'),
    body('note').notEmpty().withMessage('Content is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, datetime, note } = req.body;

        try {
            // Validate if the datetime format is valid
            if (!Date.parse(datetime)) {
                return res.status(400).json({ errors: [{ msg: 'Invalid date format. Please use YYYY-MM-DD.' }] });
            }

            const createdNote = await Note.create({
                title,
                datetime,
                note
            });

            res.status(201).json(createdNote);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
];

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
    body('datetime').notEmpty().isISO8601().withMessage('Valid date is required'),
    body('note').notEmpty().withMessage('Content is required'),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { title, datetime, note } = req.body;

        try {
            const noteToUpdate = await Note.findOne({
                where: { id: req.params.id },
            });

            if (!noteToUpdate) return res.status(404).json({ message: "Note not found" });

            // Validate datetime format before updating
            if (!Date.parse(datetime)) {
                return res.status(400).json({ errors: [{ msg: 'Invalid date format. Please use YYYY-MM-DD.' }] });
            }

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
