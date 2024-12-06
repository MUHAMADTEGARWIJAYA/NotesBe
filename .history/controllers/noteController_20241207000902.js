import Note from "../models/noteModel.js";
import { validationResult } from 'express-validator';

// Create a new note
export const createNote = async (req, res) => {
    // Ambil data dari header request
    const title = req.headers['x-title'];
    const date = req.headers['x-date'];
    const content = req.headers['x-content'];

    // Validasi data
    if (!title) {
        return res.status(400).json({ errors: [{ msg: 'Title is required', path: 'title' }] });
    }
    if (!date || !Date.parse(date)) {
        return res.status(400).json({ errors: [{ msg: 'Valid date is required', path: 'date' }] });
    }
    if (!content) {
        return res.status(400).json({ errors: [{ msg: 'Content is required', path: 'content' }] });
    }

    try {
        // Buat catatan baru menggunakan data dari header
        const note = await Note.create({
            title,
            date,
            content
        });

        res.status(201).json(note);
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
export const updateNote = async (req, res) => {
    // Ambil data dari header request
    const title = req.headers['x-title'];
    const date = req.headers['x-date'];
    const content = req.headers['x-content'];

    // Validasi data
    if (!title) {
        return res.status(400).json({ errors: [{ msg: 'Title is required', path: 'title' }] });
    }
    if (!date || !Date.parse(date)) {
        return res.status(400).json({ errors: [{ msg: 'Valid date is required', path: 'date' }] });
    }
    if (!content) {
        return res.status(400).json({ errors: [{ msg: 'Content is required', path: 'content' }] });
    }

    try {
        const note = await Note.findOne({
            where: { id: req.params.id },
        });

        if (!note) return res.status(404).json({ message: "Note not found" });

        // Perbarui catatan dengan data dari header
        await Note.update({ title, date, content }, {
            where: { id: req.params.id },
        });

        res.json({ message: "Note updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: error.message });
    }
};

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
