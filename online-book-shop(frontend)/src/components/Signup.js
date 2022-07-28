import React from 'react';
import { useFormik } from 'formik';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { Alert } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { signupCognitoUser } from '../UserPool';
import HeaderWelcome from './HeaderWelcome';
import Footer from './Footer';


export default function Signup() {
    const lower = React.createRef();
    const upper = React.createRef();
    const number = React.createRef();
    const special = React.createRef()
    const length = React.createRef();
    const message = React.createRef();
    const pass = React.createRef();

    const navigate = useNavigate();

    const validate = values => {
        const errors = {};

        if (!values.firstname) {
            errors.firstname = 'First Name is Required';
        } else if (values.firstname.length > 15) {
            errors.firstname = 'Must be 15 characters or less';
        }

        if (!values.lastname) {
            errors.lastname = 'Last Name is Required';
        } else if (values.lastname.length > 20) {
            errors.lastname = 'Must be 20 characters or less';
        }

        if (!values.email) {
            errors.email = 'Email is Required'
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
            errors.email = 'Invalid Email'
        }

        if (!values.password) {
            errors.password = 'Password is Required'
        } else if (!/^(?=.*\d)(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{7,14}$/i.test(values.password)) {
            errors.password = pass.current.title;
        }

        if (!values.repassword) {
            errors.repassword = 'Please re-enter password'
        } else if (values.password !== values.repassword) {
            errors.repassword = 'Passwords do not match'
        }

        if (!values.role) errors.role = 'Role is required'
        else if (values.role === "customer") {
            if (!values.nameOnCard) errors.nameOnCard = 'Required'
            if (!values.cardNumber) errors.cardNumber = 'Required'
            if (!values.securityCode) errors.securityCode = 'Required'
            if (!values.expirationDate) errors.expirationDate = 'Required'
            if (!values.zipcode) errors.zipcode = 'Required'
        }

        if (!values.agree) {
            errors.agree = 'You must agree to the terms and conditions'
        }
        return errors
    }
    const formik = useFormik({
        initialValues: {
            firstname: '',
            lastname: '',
            email: '',
            password: '',
            repassword: '',
            role: '',
            nameOnCard: '',
            cardNumber: '',
            securityCode: '',
            expirationDate: '',
            zipcode: '',
            agree: ''
        },
        validate,
        onSubmit: (values, { resetForm }) => {
            const signup = signupCognitoUser(values);

            axios
                .post("http://localhost:8080/users", {
                    userId: uuidv4(),
                    firstname: values.firstname,
                    lastname: values.lastname,
                    email: values.email,
                    password: values.password,
                    role: values.role,
                    payment: {
                        nameOnCard: values.nameOnCard,
                        cardNumber: values.cardNumber,
                        securityCode: values.securityCode,
                        expirationDate: values.expirationDate,
                        zipcode: values.zipcode
                    },
                    isRemoved: 0,
                })
                .then(response => {
                    alert("User successfully added!!")
                })
                .catch(error => {
                    console.log(error);
                })

            resetForm({ values: "" });

            signup.then(response => {
                navigate('/confirm', { state: { username: response.user.username } });
            })
        },
    });

    const passFocused = () => {
        message.current.style.display = "block"
    }
    const passBlur = () => {
        message.current.style.display = "none"
    }
    const passChanged = () => {
        // Validate lowercase letters
        var lowerCaseLetters = /[a-z]/g;
        if (pass.current.value.match(lowerCaseLetters)) {
            lower.current.classList.remove("invalid");
            lower.current.classList.add("valid");
        } else {
            lower.current.classList.remove("valid");
            lower.current.classList.add("invalid");
        }

        // Validate capital letters
        var upperCaseLetters = /[A-Z]/g;
        if (pass.current.value.match(upperCaseLetters)) {
            upper.current.classList.remove("invalid");
            upper.current.classList.add("valid");
        } else {
            upper.current.classList.remove("valid");
            upper.current.classList.add("invalid");
        }

        // Validate special characters
        var specialCharacters = /[@!#&+-]/g;
        if (pass.current.value.match(specialCharacters)) {
            special.current.classList.remove("invalid");
            special.current.classList.add("valid");
        } else {
            special.current.classList.remove("valid");
            special.current.classList.add("invalid");
        }

        // Validate numbers
        var numbers = /[0-9]/g;
        if (pass.current.value.match(numbers)) {
            number.current.classList.remove("invalid");
            number.current.classList.add("valid");
        } else {
            number.current.classList.remove("valid");
            number.current.classList.add("invalid");
        }

        // Validate length
        if (pass.current.value.length >= 7) {
            length.current.classList.remove("invalid");
            length.current.classList.add("valid");
        } else {
            length.current.classList.remove("valid");
            length.current.classList.add("invalid");
        }
    }
    return (
        <div>
            <HeaderWelcome />
            <div style={{ margin: "20px 300px" }}>
                <h2><b>Register Account</b></h2>
                <form onSubmit={formik.handleSubmit}>
                    <label className='form-label' htmlFor="firstname"><b>First Name</b></label>
                    <input
                        id="firstname"
                        name="firstname"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.firstname}
                        className="form-control mb-3"
                    />
                    {formik.touched.firstname && formik.errors.firstname && <Alert className='showMsg' severity="error">{formik.errors.firstname}</Alert>}
                    <label className="form-label" htmlFor="lastname"><b>Last Name</b></label>
                    <input
                        id="lastname"
                        name="lastname"
                        type="text"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.lastname}
                        className="form-control mb-3"
                    />
                    {formik.touched.lastname && formik.errors.lastname && <Alert className='showMsg' severity="error">{formik.errors.lastname}</Alert>}

                    <label className="form-label" htmlFor="email"><b>Email Address</b></label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className="form-control mb-3"
                    />
                    {formik.touched.email && formik.errors.email && <Alert className='showMsg' severity="error">{formik.errors.email}</Alert>}

                    <label className="form-label" htmlFor="password"><b>Password</b></label>
                    <input
                        autoComplete=''
                        id="password"
                        name="password"
                        type="password"
                        onChange={formik.handleChange}
                        value={formik.values.password}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{7,}"
                        title="Must contain at least one number, a special character, one uppercase and lowercase letter, and at least 7
                        characters and at most 14"
                        onFocus={passFocused}
                        onBlur={passBlur}
                        onKeyUp={passChanged}
                        ref={pass}
                        className="form-control mb-3"
                    />
                    {formik.touched.password && formik.errors.password && <Alert className='showMsg' severity="error">{formik.errors.password}</Alert>}

                    <div ref={message} id="message">
                        <h5>Password must contain the following:</h5>
                        <p ref={lower} className="invalid">A <b>lowercase</b> letter</p>
                        <p ref={upper} className="invalid">A <b>capital (uppercase)</b> letter</p>
                        <p ref={number} className="invalid">A <b>number</b></p>
                        <p ref={length} className="invalid">Minimum <b>7 characters</b></p>
                        <p ref={special} className="invalid">A <b>special character</b>{"(! @ # & + -)"}</p>
                    </div>

                    <label className="form-label" htmlFor="repassword"><b>Confirm Password</b></label>
                    <input
                        autoComplete=''
                        id="repassword"
                        name="repassword"
                        type="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.repassword}
                        className="form-control mb-3"
                    />
                    {formik.touched.repassword && formik.errors.repassword && <Alert className='showMsg' severity="error">{formik.errors.repassword}</Alert>}

                    <label className="form-label" htmlFor="role"><b>Role</b></label>
                    <select
                        onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        value={formik.values.role}
                        name='role'
                        className="form-select my-3"
                        aria-label="Role" >
                        <option value="">*Role</option>
                        <option value="admin">Admin</option>
                        <option value="customer">Customer</option>
                    </select>
                    {formik.touched.role && formik.errors.role && <Alert className='showMsg' severity="error">{formik.errors.role}</Alert>}
                    {formik.values.role === "customer" &&
                        <div>
                            <label className="form-label" ><b>Payment Details</b></label>
                            <div className='row'>
                                <div className='col'>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.nameOnCard} id='nameOnCard' name='nameOnCard' className='form-control' placeholder='Name on card' />
                                    {formik.touched.nameOnCard && formik.errors.nameOnCard && <Alert className='showMsg' severity="error">{formik.errors.nameOnCard}</Alert>}
                                </div>
                                <div className='col'>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.cardNumber} id='cardNumber' name='cardNumber' className='form-control' placeholder='Card number' type='number' />
                                    {formik.touched.cardNumber && formik.errors.cardNumber && <Alert className='showMsg' severity="error">{formik.errors.cardNumber}</Alert>}
                                </div>
                            </div>
                            <div className='row my-3'>
                                <div className='col'>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.securityCode} id='securityCode' name='securityCode' className='form-control' placeholder='Security code' type='number' />
                                    {formik.touched.securityCode && formik.errors.securityCode && <Alert className='showMsg' severity="error">{formik.errors.securityCode}</Alert>}
                                </div>
                                <div className='col'>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.expirationDate} id='expirationDate' name='expirationDate' className='form-control' placeholder='Expiration date(mm/yy)' />
                                    {formik.touched.expirationDate && formik.errors.expirationDate && <Alert className='showMsg' severity="error">{formik.errors.expirationDate}</Alert>}
                                </div>
                                <div className='col'>
                                    <input onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.zipcode} id='zipcode' name='zipcode' className='form-control' placeholder='Zipcode' type='number' />
                                    {formik.touched.zipcode && formik.errors.zipcode && <Alert className='showMsg' severity="error">{formik.errors.zipcode}</Alert>}
                                </div>
                            </div>
                        </div>
                    }

                    <label>
                        <input className="form-check-input" id="agree" name="agree" type="checkbox" onChange={formik.handleChange} onBlur={formik.handleBlur} />
                        <span className="form-check-label" htmlFor='agree'><b> I agree to all the terms and conditions</b></span>
                    </label>
                    {formik.touched.agree && formik.errors.agree && <Alert className='showMsg' severity="error">{formik.errors.agree}</Alert>}

                    <div style={{ textAlign: "center" }}>
                        <button type="submit" className='btn btn-outline-warning btn-lg mt-3'><b>Create Account</b></button>
                    </div>
                    <div className='mt-3'>
                        <b> Already have an account? &nbsp;</b>
                        <Link to="/login">
                            <button
                                type='button'
                                className="btn btn-warning btn-sm">LOG IN
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    )
}
