import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../../axios";
import ReCAPTCHA from "react-google-recaptcha";

export function Login() {
    const [data, setData] = useState({
        email: '',
        password: '',
        is_2fa_enabled: '',
    });

    const [validation, setValidation] = useState([]);
    const navigateTo = useNavigate();

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    const [adminContact, setAdminContact] = useState({ email: '', phone: '' });

    const navigate = useNavigate();
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    localStorage.removeItem('token')
    //hook useEffect
    useEffect(() => {

        //check token
        if (localStorage.getItem('token')) {

            //redirect page dashboard
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.post('/login', data);
            console.log("Login Response:", response.data); // Log seluruh response data
    
            // Jika response.data tidak memiliki is_2fa_enabled, pastikan bahwa backend mengirimkan data yang benar
            console.log("Response Keys:", Object.keys(response.data)); // Log keys dari response data
    
            // Simpan token dan ID pengguna di localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('loggedInUserId', response.data.user.id);
            localStorage.setItem('MFAStatus', response.data.is_2fa_enabled);
            console.log("Status 2fa:", response.data.is_2fa_enabled);
    
            if (response.data.is_2fa_enabled === 0) {
                console.log("Navigating to /mfaEnable");
                navigate('/mfaEnable');
            } else if (response.data.is_2fa_enabled === 1) {
                console.log("Navigating to /mfaOTP");
                navigate('/mfaOTP');
            }
        } catch (error) {
            console.error("Login Error:", error.response.data);
            setValidation(error.response.data);
        }
    };

    const fetchDataAdmin = async (e) => {
        e.preventDefault();
        try {
            const response = await instance.get('/admin-contact');
            if (response.data.success) {
                const adminContactInfo = response.data.data;
                setAdminContact(adminContactInfo);
                setPopupMessage(`Hubungi Admin untuk mengganti password anda <br /><br />Email : ${adminContactInfo.email}<br />Phone : ${adminContactInfo.phone}`);
                setShowPopup(true);
            }
        } catch (error) {
            setValidation(error.response.data);
            setPopupMessage('Error: ' + error.response.data.message || 'Gagal mengambil data admin');
            setShowPopup(true);
            console.error("Error fetching admin contact:", error);
        }
    }

    const closePopup = () => {
        setShowPopup(false);
        navigateTo('/login');
    };

    return (
        <>
            <div className="hero min-h-screen bg-gradient-to-br from-red-300 to-gray-100">
                <div className="hero-content flex-col lg:flex-row-reverse">
                    <div className="card shrink-0 w-full max-w-4xl shadow-2xl bg-base-100">
                        <div className="bg-gradient-to-l from-base-100 to-primary">&nbsp;</div>
                        <div className="flex">
                            <div className="w-full lg:w-1/2 ml-6">
                                <form className="card-body" onSubmit={handleSubmit}>
                                    <div className="flex items-center mb-2">
                                        <img src="/img/logo.png" className="w-12 mr-2" />
                                        <span className="font-bold text-4xl text-primary">MO</span>
                                        <span className="font-bold text-4xl">TOO</span>
                                    </div>
                                    <span className="text-sm italic font-semibold">Login with your email</span>
                                    <div className="py-4">
                                        <div className="form-control mb-2">
                                            <div className="join">
                                                <button className="btn join-item btn-primary" tabIndex={-1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zm0 0c0 1.657 1.007 3 2.25 3S21 13.657 21 12a9 9 0 10-2.636 6.364M16.5 12V8.25" />
                                                    </svg>
                                                </button>
                                                <input type="email" placeholder="Email" className="input join-item w-full input-primary" name="email" onChange={handleChange} value={data.email} required />
                                            </div>
                                            {validation.email && (
                                                <div className="text-error">
                                                    {validation.email[0]}
                                                </div>
                                            )}
                                        </div>

                                        <div className="form-control mb-2">
                                            <div className="join">
                                                <button className="btn btn-primary join-item" tabIndex={-1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                                                    </svg>
                                                </button>
                                                <input type="password" placeholder="Password" className="input join-item w-full input-primary" name="password" onChange={handleChange} value={data.password} required />
                                            </div>
                                            {validation.password && (
                                                <div className="text-error">
                                                    {validation.password[0]}
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
                                    <button className="btn btn-primary">Next</button>
                                </div>
                                <span className="text-sm font-semibold" style={{ textAlign: "center" }}>
                                    <a className="text-primary" onClick={fetchDataAdmin} style={{ cursor: 'pointer' }}>Forget Password?</a>
                                </span>
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
                        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
                        <p dangerouslySetInnerHTML={{ __html: popupMessage }}></p>
                        <button onClick={closePopup} className="mt-4 btn btn-primary">Close</button>
                    </div>
                </div>
            )}
        </>
    );
}
