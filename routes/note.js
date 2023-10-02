const express = require('express');
const connectDB = require('../dbConfig/mongoose');
const router = express.Router()
const Note = require("../models/Note");
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/getAllNotes', async function (req, res) {
    try {
        const notes = await Note.find({});
        res.status(201).json( notes );
    } catch (error) {
        console.log(`Note :: GetAllNotes Error: ${error}`)
        res.status(500).json({
            error: `Internal Server Error: ${error}`,
        })
    }
})


router.post('/getNotesUser', async (req, res) => {
    try {
        const userId = req.cookies.token.id;

        const notes = await Note.find({ user: userId})
        res.status(201).json(notes)
    } catch (error) {
        res.status(400).json({
            error: `Internal Server Error: ${error}`
        })
        console.log(`Note :: GetNoteUser Error: ${error}`)
    }
})


router.post('/addNote', async function (req, res){
    try {
        const {title, description, tag} = req.body;
        const userLogeddinId = req.cookies.token.id || '';
        const newNote = new Note({
            user: userLogeddinId,
            title,
            description,
            tag
        });

        const savedNote = await newNote.save();
        res.status(201).json({
            message: "Note saved successfully",
            savedNote
        })
        
    } catch (error) {
        res.status(400).json({
            error: `Internal Server Error: ${error}`
        })
        console.log(`Note :: AddNote Error: ${error}`)
    }
})


router.put('/updateNote', async function (req, res) {
    try {
        const {noteId, title, description, tag} = req.body;


        const note = await Note.findById(noteId);

        if (!note) {
            res.status(405).json({ error: "Note not found"})
        }

        const updatedNote = await Note.findByIdAndUpdate(noteId, {title, description, tag})
        res.status(201).json({
            message: `Note updated successfully`,
            updatedNote
        })


    } catch (error) {
        res.status(400).json({
            error: `Internal Server Error: ${error}`
        })
        console.log(`Note :: UpdateNote Error: ${error}`)
    }
})

router.delete('/deletenote', async function (req, res) {
    try {
        const {noteId} = req.body;
        const deletedNote = await Note.findByIdAndDelete(noteId);
        res.status(201).json({
            message: `Note deleted successfully`,
            deletedNote
        })
    } catch (error) {
        res.status(400).json({
            error: `Internal Server Error: ${error}`
        })
        console.log(`Note :: DeleteNote Error: ${error}`)
    }
})

module.exports = router;