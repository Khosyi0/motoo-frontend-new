import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../../axios";

export function MFAEnable() {
    const [qrImage, setQrImage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchQR = async () => {
            try {
                const response = await instance.get('/register-2fa', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setQrImage(response.data.QR_Image);
                await enable2FA();  // panggil fungsi ini setelah berhasil mendapatkan QR Code
            } catch (error) {
                console.error("Error fetching QR Code:", error);
            }
        };

        fetchQR();
    }, []);

    const enable2FA = async () => {
        try {
            const response = await instance.post('/enable-2fa', {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (response.status === 200) {
                console.log('2FA enabled successfully');
            }
        } catch (error) {
            console.error("Error enabling 2FA:", error);
        }
    };

    const handleNext = async (e) => {
        e.preventDefault();
        //navigate('/mfaOTP');
        navigate('/login');
    };

    return (
        <>
            <div className="hero min-h-screen bg-gradient-to-br from-red-300 to-gray-100">
                <div className="hero-content flex-col ">
                    <div className="card shrink-0 w-full max-w-sm shadow-xl bg-base-100">
                        <div className="bg-gradient-to-l from-base-100 to-primary">&nbsp;</div>
                        <form className="card-body" onSubmit={handleNext}>
                            <div className="flex items-center mb-4">
                                <img src="/img/logo.png" className="w-14 mr-2" />
                                <span className="font-bold text-4xl text-primary">MO</span>
                                <span className="font-bold text-4xl">TOO</span>
                            </div>
                            <span className="text-sm italic font-semibold">Scan this QR Code in Google Authenticator</span>
                            <div className="py-4">
                                {qrImage ? (
                                    <div dangerouslySetInnerHTML={{ __html: qrImage }} />
                                ) : (
                                    <p>Loading QR Code...</p>
                                )}
                            </div>
                            <div className="form-control">
                                <button className="btn btn-primary">Next</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}
