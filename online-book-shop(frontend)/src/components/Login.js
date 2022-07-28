import React from 'react'
import { useFormik } from 'formik';
import { Avatar, Alert } from '@mui/material';
import Footer from './Footer';
import { Link } from 'react-router-dom';
import HeaderWelcome from './HeaderWelcome';
import { loginCognitoUser } from '../UserPool';

export default function Login() {

    const validate = values => {
        const errors = {};
        if (!values.email) {
            errors.email = 'Email is Required'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid Email'
        }
        if (!values.password) {
            errors.password = 'Password is Required'
        }
        return errors
    }
    const formik = useFormik({
        initialValues: {
            email: '',
            password: ''
        },
        validate,
        onSubmit: values => {
            loginCognitoUser(values)
                .then(response => {
                    localStorage.setItem("currentUser", JSON.stringify(response.idToken.payload))
                    window.location = "/home"
                })
        }
    })
    return (
        <div >
            <HeaderWelcome />
            <h2 className='mt-3'><b>Login</b></h2>
            <form onSubmit={formik.handleSubmit} className='loginForm'>

                <Avatar style={{ margin: 'auto' }}
                    sx={{ width: 150, height: 150 }}
                    src="/broken-image.jpg"
                />
                <div className="mb-3">
                    <label htmlFor="email" className="form-label"><b>Email</b></label>
                    <input
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control form-control-md"
                        id="email"
                        name='email'
                    />
                    {formik.touched.email && formik.errors.email &&
                        <Alert severity="error">{formik.errors.email}</Alert>}
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label"><b>Password</b></label>
                    <input
                        autoComplete=''
                        type='password'
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="form-control form-control-md"
                        id="password" name='password'>
                    </input>
                    {formik.touched.password && formik.errors.password &&
                        <Alert severity="error">{formik.errors.password}</Alert>}
                </div>
                <div className='row'>
                    <button
                        type="submit"
                        className="btn btn-outline-warning btn-lg">
                        <b>Login</b>
                    </button>
                </div>
                <br></br>

                <div>
                    <b> Not Registered? &nbsp;</b>
                    <Link to="/signup">
                        <button
                            type='button'
                            className="btn btn-warning btn-sm">SIGN UP
                        </button>
                    </Link>
                </div>
            </form>
            <Footer />
        </div>
    )
}
