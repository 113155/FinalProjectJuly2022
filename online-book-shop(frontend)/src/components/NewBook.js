import Footer from './Footer'
import HeaderHome from './HeaderHome'
import { useFormik } from 'formik';
import { Alert } from '@mui/material'
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useState } from 'react';

export default function NewBook() {
    const [file, setFile] = useState()

    const validate = values => {
        const errors = {};
        if (!values.title) {
            errors.title = 'Title is required'
        }

        if (!values.isbn) {
            errors.isbn = 'ISBN is Required';
        }

        if (!values.price) {
            errors.price = 'Price is required'
        }

        if (!values.quantity) {
            errors.quantity = 'Quantity is required'
        }

        if (!values.publisher) {
            errors.publisher = 'Publisher is required'
        }

        if (!values.datePublished) {
            errors.datePublished = 'Date Published is required'
        }
        return errors;
    }

    const formik = useFormik({
        initialValues: {
            title: '',
            isbn: '',
            price: 0.00,
            quantity: 0,
            publisher: '',
            datePublished: '',
        },
        validate,
        onSubmit: (values, { resetForm }) => {
            const data = new FormData();
            data.append("id", uuidv4())
            data.append("BookTitle", values.title)
            data.append("ISBN", values.isbn)
            data.append("Price", values.price)
            data.append("Quantity", values.quantity)
            data.append("Publisher", values.publisher)
            data.append("DatePublished", values.datePublished)
            data.append("isDeleted", 0)
            data.append("picture", file)

            axios
                .post("http://localhost:8080/books", data)
                .then(response => {
                    alert("Book successfully added!!")
                    console.log(response);
                })
                .catch(error => {
                    console.log(error);
                })
            localStorage.removeItem("books");
            resetForm({ values: "" });
        },
    });

    return (
        <div>
            <HeaderHome />
            <div className="container" style={{ marginBottom: "1000px" }}>
                <div>
                    <span style={{ fontSize: "1.7em" }}>
                        New Book Form
                    </span>
                </div>
                <div>
                    <span>
                        <b>Note:</b> Form fields with asterisk (*) are required.
                    </span>
                </div>
                <form onSubmit={formik.handleSubmit} id="formNewBook">
                    <fieldset>
                        <div className="row my-3">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label htmlFor="title">*Book Title:</label>
                                    <input className="form-control" type="text" name="title" id="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                </div>
                                {formik.touched.title && formik.errors.title && <Alert className='showMsg' severity="error">{formik.errors.title}</Alert>}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="isbn">*ISBN:</label>
                                    <input className="form-control" type="text" name="isbn" id="isbn"
                                        value={formik.values.isbn}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                </div>
                                {formik.touched.isbn && formik.errors.isbn && <Alert className='showMsg' severity="error">{formik.errors.isbn}</Alert>}
                            </div>

                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="price">*Price:</label>
                                    <input className="form-control" type="number" step=".01" min="0" name="price" id="price"
                                        value={formik.values.price}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                </div>
                                {formik.touched.price && formik.errors.price && <Alert className='showMsg' severity="error">{formik.errors.price}</Alert>}
                            </div>
                            <div className="col-md-3">
                                <div className="form-group">
                                    <label htmlFor="quantity">*Quantity:</label>
                                    <input className="form-control" type="number" step="1" min="0" name="quantity" id="quantity"
                                        value={formik.values.quantity}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                </div>
                                {formik.touched.quantity && formik.errors.quantity && <Alert className='showMsg' severity="error">{formik.errors.quantity}</Alert>}
                            </div>
                        </div>
                        <div className="row my-3">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="publisher">*Publisher:</label>
                                    <input className="form-control" type="text" name="publisher" id="publisher"
                                        value={formik.values.publisher}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                </div>
                                {formik.touched.publisher && formik.errors.publisher && <Alert className='showMsg' severity="error">{formik.errors.publisher}</Alert>}
                            </div>

                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="datePublished">*Date Published:</label>
                                    <input className="form-control" type="date" name="datePublished" id="datePublished"
                                        value={formik.values.datePublished}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur} />
                                </div>
                                {formik.touched.datePublished && formik.errors.datePublished && <Alert className='showMsg' severity="error">{formik.errors.datePublished}</Alert>}
                            </div>
                        </div>

                        <div>
                            <label htmlFor='file'>*Upload photo:</label>
                            <input className="form-control mb-3" type="file" accept='.jpeg'
                                onChange={event => {
                                    const fil = event.target.files[0];
                                    setFile(fil)
                                }}
                            />
                        </div>

                        <div className="row">
                            <button data-target="submitform" id="btnSubmit" type="submit" className="btn btn-outline-warning">Save Book</button>
                        </div>
                    </fieldset>
                </form>
            </div>
            <Footer />
        </div>
    )
}

