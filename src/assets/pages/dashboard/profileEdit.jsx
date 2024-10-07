import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import instance from "../../../axios";
import Select from 'react-select';

export function ProfileEdit() {
    const [user, setUser] = useState({});
    const [loadPage, setLoadPage] = useState(false);
    const [isCompanyEditable, setIsCompanyEditable] = useState(true);
    const navigate = useNavigate();

    // Ambil ID dari localStorage
    const loggedInUserId = localStorage.getItem('loggedInUserId');

    const fetchDataUser = async () => {
        try {
            const response = await instance.get(`/users/${loggedInUserId}`);
            const userData = response.data.data;

            // Tangani data company yang mungkin berupa objek atau array dari objek
            const companyValues = Array.isArray(userData.company)
                ? userData.company.map(c => c.short_name)
                : userData.company.split(', ');

            setUser({ ...userData, company: companyValues });
            setIsCompanyEditable(!companyValues.length); // Setel status editable berdasarkan isi awal
            setLoadPage(true);
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    useEffect(() => {
        fetchDataUser();
    }, []);

    const companyOptions = [
        { value: 'SISI', label: 'SISI' },
        { value: 'SBI', label: 'SBI' },
        { value: 'PP', label: 'PP' },
        { value: 'ADHI', label: 'ADHI' },
        { value: 'UTSG', label: 'UTSG' },
    ];

    const handleSelectCompanyChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setUser({ ...user, company: selectedValues });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({ ...user, [name]: value === '' ? null : value });
    };
    
    const [imagePreview, setImagePreview] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUser({ ...user, photo: file });
            const fileUrl = URL.createObjectURL(file);
            setImagePreview(fileUrl);
        } else {
            // Jika tidak ada file, hapus foto dari state
            setUser({ ...user, photo: null });
            setImagePreview(null);
        }
    };

    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!user.name) {
            let errorMessage = "Name can not be empty.";
            setErrorMessage(errorMessage);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
            return;
        }
    
        try {
            const formattedCompany = Array.isArray(user.company)
                ? user.company.join(', ')
                : user.company;
    
            const formData = new FormData();
            formData.append('name', user.name || '');
            formData.append('email', user.email || '');
            formData.append('role', user.role || 'client');
            formData.append('job', user.job || ''); // Tambahkan || '' untuk memastikan tidak ada 'null'
            formData.append('team', user.team || ''); // Tambahkan || '' untuk memastikan tidak ada 'null'
            formData.append('phone', user.phone || '');
            formData.append('company', formattedCompany || '');
    
            if (user.photo instanceof File) {
                formData.append('photo', user.photo);
            }
    
            const response = await instance.post(`/users/${loggedInUserId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
    
            console.log("Response dari server :", response.data);
            navigate('/dashboard/profilePage', { state: { successMessage: "Profile updated successfully" } });
        } catch (error) {
            console.error("Error updating profile:", error.response ? error.response.data : error.message);
            let errorMessage = "Error updating data.";
            setErrorMessage(errorMessage);
            setShowToast(true);
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
        }
    };
    
    
    return (
        <>
            {showToast && (
                <div className="toast">
                    <div className="alert alert-error">
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}
            {loadPage ? (
                <form onSubmit={handleSubmit} className="container mx-auto p-4">
                    <div className="font-bold text-lg">Edit Profile</div>
                    <div className="text-xs text-gray-500">Contact admin to change the blocked content.</div>
                    <div className="text-xs text-gray-500">* Required & Can be changed once</div>
                    <hr className="my-2"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Name</span>
                                <input type="text" value={user.name || ''} onChange={handleChange} name="name" className="input input-bordered input-sm w-full" disabled/>
                            </label>
                        </div>
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Phone</span>
                                <input type="text" value={user.phone || ''} onChange={handleChange} name="phone" className="input input-bordered input-sm w-full"/>
                            </label>
                        </div>
                    </div>

                    <div>
                        <span className="label-text text-xs font-semibold">User's Photo</span>
                        <div className="grid grid-cols-1 p-4 border border-gray-300 rounded-lg bg-white">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="md:col-span-1">
                                    <label className="form-control w-full">
                                        <span className="label-text text-xs font-semibold">Upload Image</span>
                                        <input type="file" className="file-input file-input-sm file-input-bordered w-full" name="image" onChange={handleFileChange} />
                                    </label>
                                </div>
                            </div>
                            {imagePreview && (
                                <div className="label-text text-xs font-semibold mt-2">
                                    Image Preview
                                    <img 
                                        src={imagePreview} 
                                        alt="Preview" 
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '40px',
                                            objectFit: 'contain'
                                        }} 
                                        className="border rounded"
                                    />
                                </div>
                            )}
                            <div>
                                <span className="label-text text-xs font-semibold">Current Photo</span>
                                <figure className="w-16">
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
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Team</span>
                                <input type="text" value={user.team || ''} onChange={handleChange} name="team" className="input input-bordered input-sm w-full"/>
                            </label>
                        </div>
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Job</span>
                                <input type="text" value={user.job || ''} onChange={handleChange} name="job" className="input input-bordered input-sm w-full"/>
                            </label>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Email</span>
                                <input type="text" value={user.email || ''} name="email" className="input input-bordered input-sm w-full" disabled/>
                            </label>
                        </div>
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Password</span>
                                <input type="text" value={''} name="password" className="input input-bordered input-sm w-full" disabled />
                            </label>
                        </div>
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Role</span>
                                <input type="text" value={user.role || ''} name="role" className="input input-bordered input-sm w-full" disabled/>
                            </label>
                        </div>
                        <div>
                            <label className="form-control w-full mt-2">
                                <span className="label-text text-xs font-semibold">Company*</span>
                                <Select
                                    options={companyOptions}
                                    isMulti
                                    isDisabled={!isCompanyEditable}
                                    defaultValue={companyOptions.filter(option => user.company.includes(option.value))}
                                    onChange={handleSelectCompanyChange}
                                    placeholder="Select Companies"
                                    className="w-full"
                                    classNamePrefix="select"
                                    styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            padding: '0.25rem',
                                            borderColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.5rem',
                                            boxShadow: 'none',
                                            '&:hover': {
                                                borderColor: 'rgba(96, 165, 250)',
                                            },
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected
                                                ? 'rgba(96, 165, 250, 0.2)'
                                                : state.isFocused
                                                ? 'rgba(229, 231, 235, 0.4)'
                                                : undefined,
                                            '&:hover': {
                                                backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                            },
                                        }),
                                        multiValue: (provided) => ({
                                            ...provided,
                                            backgroundColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.25rem',
                                            padding: '2px 4px',
                                        }),
                                        multiValueLabel: (provided) => ({
                                            ...provided,
                                            color: 'rgba(31, 41, 55)',
                                        }),
                                        multiValueRemove: (provided) => ({
                                            ...provided,
                                            color: 'rgba(107, 114, 128)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                                color: 'rgba(31, 41, 55)',
                                                backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                            },
                                        }),
                                    }}
                                />
                            </label>
                        </div>
                    </div>
                    <div className="flex items-center justify-end my-4 gap-4">
                        <button className="btn btn-success btn-sm" type="submit" value="submit">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                            Submit
                        </button>
                        <Link to={"/dashboard/profilePage"}>
                            <button className="btn btn-error btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-base-100">
                    <span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span>
                    <span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span>
                </div>
            )}
        </>
    );
}