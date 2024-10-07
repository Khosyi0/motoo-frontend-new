import React, { useState, useEffect } from 'react';
import instance from "../../../axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function ProfilePage() {
    const [user, setUser] = useState();
    const navigate = useNavigate();

    const fetchDataUser = async () => {
        try {
            const response = await instance.get("/users");
            const users = response.data.data;

            // Retrieve the logged-in user ID from localStorage
            const loggedInUserId = localStorage.getItem('loggedInUserId');

            // Find the logged-in user based on the ID stored in localStorage
            const loggedInUser = users.find(user => user.id === loggedInUserId);

            if (loggedInUser) {
                setUser(loggedInUser);
            } else {
                console.log("No logged in user found.");
            }

            console.log("Logged in user:", loggedInUser);

            const MFAStatus = localStorage.getItem('MFAStatus');
            if (MFAStatus === "0"){
                window.location.href = "/login";
                return;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchDataUser();

        const mfaToken = localStorage.getItem('mfa_token');
        if (!mfaToken) {
            console.log("No MFA Token found.");
            window.location.href = "/login";
            return;
        }
    }, []);

    const clickonEditProfile = async () => {
        navigate('/dashboard/profileEdit');
    }

    const [showToastSuccess, setShowToastSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.successMessage) {
            setSuccessMessage(location.state.successMessage);
            setTimeout(() => {
                setShowToastSuccess(true);
            }, 1000)

            // Hide toast after a few seconds
            setTimeout(() => {
                setShowToastSuccess(false);
            }, 3000); // 3 seconds
        }
    }, [location.state]);

    return (
        <div>
            {user ? (
                <div>
                    <Link to={"/dashboard"} className="btn btn-primary btn-outline border-2 btn-sm mt-8 ml-16">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                        </svg>
                    </Link>
                    <div className="flex m-8 justify-center">
                        <div className="p-8 border-2 border-red-500 rounded-3xl">
                            <div className="flex flex-row space-x-4">
                                <div className="card bg-base-100 w-64 shadow-xl">
                                    <figure>
                                        {user.photo ? (
                                            <img
                                                src={"http://127.0.0.1:8000" + user.photo}
                                                alt={user.name}
                                                className="w-5/6 rounded-xl object-cover"
                                            />
                                            ) : (
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-48 h-48">
                                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" clipRule="evenodd" />
                                                </svg>
                                            )
                                        }
                                    </figure>
                                    <div className="flex justify-center mt-2">
                                        <td>
                                            {user.role === "admin" && (
                                                <div className="badge badge-error w-20 h-6 p-2 text-xs">
                                                    {user.role}
                                                </div>
                                            )}
                                            {user.role === "client" && (
                                                <div className="badge badge-info w-20 h-6 p-2 text-xs">
                                                    {user.role}
                                                </div>
                                            )}
                                            {user.role === "teknisi" && (
                                                <div className="badge badge-warning w-20 h-6 p-2 text-xs">
                                                    {user.role}
                                                </div>
                                            )}
                                            {user.role === "reporter" && (
                                                <div className="badge badge-success w-20 h-6 p-2 text-xs">
                                                    {user.role}
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            {user.status === "active" && (
                                                <div className="badge badge-success w-20 h-6 p-2 text-xs">
                                                    {user.status}
                                                </div>
                                            )}
                                            {user.status === "inactive" && (
                                                <div className="badge badge-error w-20 h-6 p-2 text-xs">
                                                    {user.status}
                                                </div>
                                            )}
                                        </td>
                                    </div>
                                    <div className="card items-center text-center p-4 mb-4">
                                        <div className="card-actions">
                                            <button className="btn btn-warning" onClick={clickonEditProfile}>Edit Profile</button>
                                        </div>
                                    </div>
                                </div>
                                <div className="card bg-base-100 shadow-xl p-4">
                                    <div className="card-body">
                                        <h2 className="card-title text-2xl font-bold">Profile Details</h2>
                                        <hr className="border-red-500 my-4" />

                                        <div className="grid grid-cols-3 gap-8">
                                            <div>
                                                <p className="font-semibold">Name:</p>
                                                <p>{user.name}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Company:</p>
                                                <p>
                                                    {user.company?.map((comp, idx) => (
                                                        <span key={idx}>
                                                            {comp.short_name}{idx < user.company.length - 1 ? ', ' : ''}
                                                        </span>
                                                    )) || 'Company not available'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Email:</p>
                                                <p>{user.email}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Job:</p>
                                                <p>{user.job}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Team:</p>
                                                <p>{user.team}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold">Phone:</p>
                                                <p>{user.phone}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-base-100">
                    <span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span>
                    <span className="animate-bounce text-xl font-bold text-primary capitalize">&nbsp;loading</span>
                </div>
            )}
            {showToastSuccess && (
                <div className="toast">
                    <div className="alert alert-success">
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}
        </div>
    );
}
