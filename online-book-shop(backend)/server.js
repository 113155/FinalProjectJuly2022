const express = require("express");
const app = express();
const cors = require('cors')
const log = require("log-to-file");
const multer = require('multer');

const upload = multer();

const MongoConnectionClient = require("mongodb").MongoClient;

MongoConnectionClient.connect("mongodb+srv://AdminUser:testpasswordmain@cluster0.cxdf2ih.mongodb.net/?retryWrites=true&w=majority")
    .then((client) => {
        console.log("Successfully connected to the DB!");
        app.use(cors());
        app.use(express.json());

        app.listen(8080, () => {
            console.log("Server started! Listening on 8080...");
        });

        app.post("/users", (req, res) => {
            log('/users' + JSON.stringify(req.body), 'book-shop-logs.log');
            client
                .db("online-book-shop-db")
                .collection("users")
                .insertOne(req.body)
                .then(() => {
                    res.send("Successfully saved user in MongoDB");
                })
                .catch((err) => {
                    console.log("Couldn't save user" + err);
                    log("Couldn't save user" + err, 'book-shop-logs.log')
                });
        });

        app.get("/books", (req, res) => {
            log('/books', 'book-shop-logs.log');
            client
                .db("online-book-shop-db")
                .collection("books")
                .find()
                .toArray()
                .then((books) => {
                    res.send(books);
                })
                .catch((err) => {
                    console.error("Couldn't get a list of books!" + err);
                    log("Couldn't get a list of books!" + err, 'book-shop-logs.log')
                });
        });

        app.post("/books", upload.single("picture"), (req, res) => {
            log('/books' + JSON.stringify(req.body), 'book-shop-logs.log');
            console.log(req)
            const { file, body } = req;
            if (file.detectedFileExtension != ".jpeg") {
                res.send(new Error("Invalid file format. Only .jpeg allowed"))
            }
            client
                .db("online-book-shop-db")
                .collection("books")
                .insertOne({ ...body, amount: 1, picture: file })
                .then(() => {
                    res.send("Successfully saved book in MongoDB");
                })
                .catch((err) => {
                    console.log("Couldn't save book" + err);
                    log("Couldn't save book" + err, 'book-shop-logs.log')
                });
        });

        app.put("/books/update/:id", (req, res) => {
            log('/books/update/:id' + JSON.stringify(req.body), 'book-shop-logs.log');
            client
                .db("online-book-shop-db")
                .collection("books")
                .updateOne({ id: req.params.id },
                    {
                        $set: {
                            ISBN: req.body.ISBN,
                            BookTitle: req.body.BookTitle,
                            Publisher: req.body.Publisher,
                            DatePublished: req.body.DatePublished,
                            Price: req.body.Price,
                            Quantity: req.body.Quantity
                        }
                    })
                .then(() => {
                    res.send("Successfully updated book record in MongoDB");
                })
                .catch((err) => {
                    console.log("Couldn't update the book" + err);
                    log("Couldn't update the book" + err, 'book-shop-logs.log')
                });
        });


        app.put("/books/delete/:id", (req, res) => {
            log('/books/delete/:id' + JSON.stringify(req.body), 'book-shop-logs.log');
            client
                .db("online-book-shop-db")
                .collection("books")
                .updateOne({ id: req.params.id },
                    { $set: { isDeleted: req.body.isDeleted } })
                .then(() => {
                    res.send("Successfully updated the book to deleted status in MongoDB");
                })
                .catch((err) => {
                    console.log("Couldn't update the book to deleted status" + err);
                    log("Couldn't update the book to deleted status" + err, 'book-shop-logs.log')

                });
        });

        app.get("/orders", (req, res) => {
            log('/orders', 'book-shop-logs.log');
            client
                .db("online-book-shop-db")
                .collection("orders")
                .find()
                .toArray()
                .then((orders) => {
                    res.send(orders);
                })
                .catch((err) => {
                    console.error("Couldn't get a list of orders!" + err);
                    log("Couldn't get a list of orders!" + err, 'book-shop-logs.log')
                });
        });

        app.post("/orders", (req, res) => {
            log('/orders' + JSON.stringify(req.body), 'book-shop-logs.log');
            client
                .db("online-book-shop-db")
                .collection("orders")
                .insertOne(req.body)
                .then(() => {
                    res.send("Successfully saved order in MongoDB");
                })
                .catch((err) => {
                    console.log("Couldn't save order" + err);
                    log("Couldn't save order" + err, 'book-shop-logs.log')
                });
        });


    })
    .catch((err) => {
        console.error("Couldn't connect to the MongoDB! " + err);
        log("Couldn't connect to the MongoDB! " + err, 'book-shop-logs.log')

    });