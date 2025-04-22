/* 
 * Larissa
 */
const sqlite3 = require('sqlite3');
const dbpath = './database/mycv.db';
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
// Aktivera CORS middleware för alla rutter
app.use(cors());
const port = 3000;

// För visning öppnas databasen i read only-läget;
app.get('/api', (req, res) =>
{
    let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READONLY, (err) => {
        db.serialize(function () {
            db.all("SELECT * FROM myjobs", function (err, myjobs) {
                if (err)
                    res.json(err.message);
                else
                {
                    res.json(myjobs);
                }
            });
        });
        db.close();
    });
});

// Lägger i databasen
app.post('/api', (req, res) =>
{
    let company = req.body.company;
    let title = req.body.title;
    let location = req.body.location;
    let description = req.body.description;
    let start = req.body.start;
    let end = req.body.end;

    let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            res.status(404).json(err.message);
        } else {
            if (!company || !title || !location || !description || !start || !end)
            {
                res.status(404).json({message: "Tomma fält får inte förekomma!"});
            } else {
                db.run('INSERT INTO myjobs(company, title, location, description, start, end) VALUES(?, ?, ?, ?, ?, ?)', [company, title, location, description, start, end], (err) => {
                    if (err) {
                        res.json(err.message);
                    } else
                    {
                        res.status(200).end();
                    }
                });
            }
        }
    });
    db.close();
});

// Uppdaterar i databasen
app.put('/api', (req, res) =>
{
    let id = req.body.id;
    let company = req.body.company;
    let title = req.body.title;
    let location = req.body.location;
    let description = req.body.description;
    let start = req.body.start;
    let end = req.body.end;

    let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            res.status(404).json(err.message);
        } else {
            if (!id || !company || !title || !location || !description || !start || !end)
            {
                res.status(404).json({message: "Tomma fält får inte förekomma!"});
            } else {
                db.run('UPDATE myjobs SET company=?, title=?, location=?, description=?, start=?, end=? WHERE id =?', [company, title, location, description, start, end, id], (err) => {
                    if (err) {
                        res.json(err.message);
                    } else
                    {
                        res.status(200).end();
                    }
                });
            }
        }
    });
    db.close();
});

// Raderar i databasen
app.delete('/api/:id', (req, res) =>
{
    let workid = req.params.id;
    if (!workid)
    {
        res.status(404).json("Arbetets ID måste anges!");
    } else
    {
        let db = new sqlite3.Database(dbpath, sqlite3.OPEN_READWRITE, (err) => {
            if (err)
            {
                return res.status(404).json(err.message);
            } else {
                db.run("DELETE FROM myjobs WHERE id = ?", [workid], (err) => {
                    if (err)
                    {
                        res.status(404).json(err.message);
                    } else
                    {
                        //Skickar koden OK;
                        res.status(200).end();
                    }
                });
            }
            db.close();
        });
    }
});

app.listen(port);