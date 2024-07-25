const notes = require('express').Router();
const fs = require('fs');
const util = require('util');

const readFromFile = util.promisify(fs.readFile);

const writeToFile = (destination, content) => {
    fs.writeFile(destination, JSON.stringify(content, null, 4), (err) => err ? console.error(err) : console.info(`\nData written to ${destination}`));
};

const readAndAppend = (content, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(content);
            writeToFile(file, parsedData);
        }
    });
}

const readAndDelete = (id, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
        if (err) {
            console.log(err);
        } else {
            const parsedData = JSON.parse(data);
            const newData = parsedData.filter(note => note.id !== id);
            console.log(newData);
            writeToFile(file, newData);
        };
    });
};

notes.get('/', (req, res) => {
    console.log(`${req.method} /notes`);
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.post('/', (req, res) => {
    console.log(`${req.method} /notes`);
    const { title, text } = req.body;
    if (req.body) {
        const newNote = {
            title,
            text,
            id: Date.now().toString(),
        };
        readAndAppend(newNote, './db/db.json');
    }
    res.json('Error in posting note');
});

notes.delete('/:id', (req, res) => {
    // console.log(req.params);
    const id = req.params.id;
    console.log(id);
    if (req.params.id) {
        readAndDelete(id, './db/db.json');
    };
    res.json('Error in deleting note');
});

module.exports = notes;