import Note from "../models/noteModel.js";
import { validationResult } from 'express-validator';

// Create a new note
export const createNote = async (req, res) => {
    // Ambil data dari body request
    const { title, datetime, content } = req.body;

    // Validasi data
    if (!title) {
        return res.status(400).json({ errors: [{ msg: 'Title is required', path: 'title' }] });
    }
    if (!datetime || !Date.parse(datetime)) {
        return res.status(400).json({ errors: [{ msg: 'Valid date is required', path: 'datetime' }] });
    }
    if (!content) {
        return res.status(400).json({ errors: [{ msg: 'Content is required', path: 'content' }] });
    }

    try {
        // Buat catatan baru dengan data yang sudah divalidasi
        const newNote = await Note.create({
            title,
            datetime,  // Kolom datetime
            content    // Kolom content
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
export const updateNote = async (req, res) => {
    const { title, datetime, content } = req.body;

    // Validasi data
    if (!title) {
        return res.status(400).json({ errors: [{ msg: 'Title is required', path: 'title' }] });
    }
    if (!datetime || !Date.parse(datetime)) {
        return res.status(400).json({ errors: [{ msg: 'Valid date is required', path: 'datetime' }] });
    }
    if (!content) {
        return res.status(400).json({ errors: [{ msg: 'Content is required', path: 'content' }] });
    }

    try {
        const note = await Note.findOne({
            where: { id: req.params.id },
        });

        if (!note) return res.status(404).json({ message: "Note not found" });

        await Note.update({ title, datetime, content }, {
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
