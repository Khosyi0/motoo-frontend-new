import { useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../../axios";

export function MFAOTP() {
    const [data, setData] = useState({ otp: '' });
    const [validation, setValidation] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await instance.post('/complete-register-2fa', data, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (response.data.mfa_verified) {
                // Save the MFA token in localStorage with a different key
                const mfaToken = response.data.mfa_token;
                localStorage.setItem('mfa_token', mfaToken);

                // console.log("MFA Token:", mfaToken);

                // Redirect to the dashboard or another page
                navigate('/dashboard');
            } else {
                console.log('2FA verification failed');
            }
        } catch (error) {
            if (error.response) {
                setValidation(error.response.data);
                console.log(error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        }
    };

    return (
        <>
            <div className="hero min-h-screen bg-gradient-to-br from-red-300 to-gray-100">
                <div className="hero-content flex-col ">
                    <div className="card shrink-0 w-full max-w-sm shadow-xl bg-base-100">
                        <div className="bg-gradient-to-l from-base-100 to-primary">&nbsp;</div>
                        <form className="card-body" onSubmit={handleSubmit}>
                            <div className="flex items-center mb-4">
                                <img src="/img/logo.png" className="w-14 mr-2" />
                                <span className="font-bold text-4xl text-primary">MO</span>
                                <span className="font-bold text-4xl">TOO</span>
                            </div>
                            <span className="text-sm italic font-semibold">Please enter the OTP code in Google Authenticator</span>
                            <div className="py-4">
                                <div className="form-control">
                                    <div className="join border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-red-500">
                                        <input type="text" placeholder="OTP Code" className="input join-item w-full input-bordered" name="otp" onChange={handleChange} value={data.otp} required />
                                    </div>
                                    {validation.otp && (
                                        <div className="text-error">
                                            {validation.otp[0]}
                                        </div>
                                    )}
                                    {validation.message && (
                                        <div className="text-error">
                                            {validation.message}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-control">
                                <button className="btn btn-primary">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
