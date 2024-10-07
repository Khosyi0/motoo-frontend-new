import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../../axios";

export function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [validation, setValidation] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');

    const navigateTo = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        //send data to server
        await instance.post('/register', { name, email, password })
            .then(() => {
                // Show success popup
                setPopupMessage('Registration Successful. You will be redirected to the login page.');
                setShowPopup(true);
            })
            .catch((error) => {
                //assign error to state "validation"
                setValidation(error.response.data);
                setPopupMessage('Failed to register. Please check your input.');
                setShowPopup(true);
            });
    };

    const closePopup = () => {
        setShowPopup(false);
        if (popupMessage.startsWith('Registration Successful')) {
            navigateTo('/login'); // Navigate to login page after closing popup
        }
    };

    return (
        <>
            <div className="hero min-h-screen bg-gradient-to-br from-red-600 to-gray-100">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card shrink-0 w-full max-w-4xl shadow-2xl bg-base-100">
                        <div className="bg-gradient-to-l from-primary to-base-100">&nbsp;</div>
                        <div className="flex">
                            <div className="w-full lg:w-1/2 ml-6">
                                <form className="card-body">
                                    <div className="flex items-center mb-2">
                                        <img src="/img/logo.png" className="w-12 mr-2" />
                                        <span className="font-bold text-4xl text-primary">MO</span>
                                        <span className="font-bold text-4xl">TOO</span>
                                    </div>
                                    <span className="text-sm italic font-semibold">Register with your email</span>
                                    <div className="py-4">
                                        <div className="form-control mb-2">
                                            <div className="join from-primary">
                                                <button className="btn join-item btn-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                                                    </svg>
                                                </button>
                                                <input type="text" onChange={(e) => setName(e.target.value)} value={name} placeholder="Fullname" className="join-item input w-full input-primary" required />
                                            </div>
                                            {validation.name && (
                                                <div className="text-error">
                                                    {validation.name[0]}
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-control mb-2">
                                            <div className="join">
                                                <button className="btn join-item btn-primary">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                                                    </svg>
                                                </button>
                                                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} value={email} className="join-item input w-full input-primary" required />
                                            </div>
                                            {validation.email && (
                                                <div className="text-error">
                                                    {validation.email[0]}
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-control">
                                            <div className="join">
                                                <button className="btn btn-primary join-item">
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                    </svg>
                                                </button>
                                                <input type="password" placeholder="Password" className="input join-item w-full input-primary" onChange={(e) => setPassword(e.target.value)} value={password} required />
                                            </div>
                                            {validation.password && (
                                                <div className="text-error">
                                                    {validation.password[0]}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-control">
                                        <button className="btn btn-primary" onClick={handleSubmit}>Register</button>
                                        <span className="text-sm italic font-semibold text-center mt-2">Already have an account? <a className="text-primary" href="/login">Log in</a> </span>
                                    </div>
                                </form>
                            </div>
                            <div className="hidden lg:block lg:w-1/2 p-4 mr-6">
                                <img src="/img/hero.png" alt="Hero" className="h-72 mt-16 object-cover rounded-r-lg" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPopup && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">{popupMessage.startsWith('Registration Successful') ? 'Registration Successful' : 'Error'}</h2>
                        <p>{popupMessage}</p>
                        <button onClick={closePopup} className="mt-4 btn btn-primary">Close</button>
                    </div>
                </div>
            )}
        </>
    );
}
