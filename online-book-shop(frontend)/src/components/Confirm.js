import React from 'react'
import { useFormik } from 'formik';
import { Alert } from '@mui/material';
import Footer from './Footer';
import { useLocation, useNavigate } from 'react-router-dom';
import HeaderWelcome from './HeaderWelcome';
import { confirmCognitoUser } from '../UserPool';

export default function Confirm() {

    const { state } = useLocation();
    const { username } = state;
    const navigate = useNavigate();

    const validate = values => {
        const errors = {};
        if (!values.code) {
            errors.code = 'Please enter code'
        }
        return errors
    }
    const formik = useFormik({
        initialValues: {
            code: ''
        },
        validate,
        onSubmit: values => {
            confirmCognitoUser(username, values.code)
                .then(response => {
                    alert("Successfully confirmed!")
                    navigate('/login')
                })
                .catch(error => {
                    console.error(error)
                })
        }
    })
    return (
        <div >
            <HeaderWelcome />
            <h3 className='mt-3'><b>Confirm</b></h3>
            <form onSubmit={formik.handleSubmit} className='confirmForm'>
                <div className="mb-3">
                    <label htmlFor="code" className="form-label">Enter code sent to <b> <em>{username}</em></b></label>
                    <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control form-control-md"
                        id="code"
                        name='code'
                    />
                    {formik.touched.code && formik.errors.code &&
                        <Alert severity="error">{formik.errors.code}</Alert>}
                </div>
                <button
                    type="submit"
                    className="btn btn-outline-warning">
                    <b>Confirm</b>
                </button>
            </form>
            <Footer />
        </div>
    )
}
