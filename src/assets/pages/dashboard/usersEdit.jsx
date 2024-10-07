import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";
import Select from 'react-select';

export function UserEdit() {
    const [user, setUser] = useState([]);
    const [loadPage, setLoadPage] = useState(false);
    const [company, setCompany] = useState([]);
    //destruct ID
    const { id } = useParams();
    //define method
    const fetchDataUser = async () => {
        await instance.get('/user')
            .then((response) => {
                //set response user to state
                (response.data.role !== "admin" ?
                    navigate('/dashboard') : "")
            })

        //fetch data from API with Axios
        await instance.get(`/users/${id}`).then((response) => {
            const userData = response.data.data;
            const companyShortNames = userData.company.map(comp => comp.short_name);
            setUser({
                ...userData,
                company: companyShortNames.join(', '),
            });
            setData({
                ...userData,
                company: companyShortNames.join(', '),
            });

            setLoadPage(true);
        });
    };

    const companyOptions = [
        { value: 'SISI', label: 'SISI' },
        { value: 'SBI', label: 'SBI' },
        { value: 'PP', label: 'PP' },
        { value: 'ADHI', label: 'ADHI' },
        { value: 'UTSG', label: 'UTSG' },
    ];

    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const fetchAppsData = async () => {
        try {
            const companyResponse = await instance.get("/companies");
            setCompany(companyResponse.data.data);
        } catch (error) {
            console.error("Error fetching company data:", error);
        }
    };

    const renderRoleOptions = () => {
        const allRole = ['admin', 'teknisi', 'reporter', 'client'];  // List all possible groups
        const currentRole = user.role;  // Current group from props or state
    
        // Filter out the current group from the list of options to prevent duplication
        return allRole.filter(role => role !== currentRole).map(role => (
            <option key={role} value={role}>{role}</option>
        ));
    };

    const renderStatusOptions = () => {
        const allStatus = ['active', 'inactive'];  // List all possible groups
        const currentStatus = user.status;  // Current group from props or state
    
        // Filter out the current group from the list of options to prevent duplication
        return allStatus.filter(status => status !== currentStatus).map(status => (
            <option key={status} value={status}>{status}</option>
        ));
    };

    //run hook useEffect
    useEffect(() => {
        //call method "fetchDataPosts"
        fetchDataUser();
        fetchAppsData();
    }, []);

    const navigate = useNavigate();
    
    const [data, setData] = useState({
        // Define the structure of your item
        // You might get this data from an API call or other sources
        id: '',
        name: '',
        email: '',
        role: '',
        company: '',
        job: '',
        team: '',
        phone: '',
        password: '',
        status: '',
    });

    const handleSelectCompanyChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        const selectedValuesString = selectedValues.join(', ');

        setData({ ...data, company: selectedValuesString });
    };

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
        console.log(data);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log(data)
        
            // Make a PUT or PATCH request to update the item
            await instance.post(`/users/${id}`, data).then((response) => {
                console.log(response.data);
            });

            // Handle success (you can redirect or perform other actions)
            console.log('data updated successfully');
            navigate('/dashboard/users', { state: { successMessage: "Data updated successfully" } });
            
        } catch (error) {
            // Handle error
            console.log('Error updating data');
           // Tangkap pesan error dari server
            const errorData = error.response.data;

            // Periksa berapa field yang tidak terisi
            const errorFields = [];
            if (errorData.name) errorFields.push("name");
            if (errorData.email) errorFields.push("email");
            if (errorData.password) errorFields.push("password");

            let errorMessage = "Error adding data.";

            // Tambahkan logika untuk validasi khusus
            if (errorData.email && errorData.email.includes('Email harus valid')) {
                errorMessage += " Please enter a valid email address!";
            } else if (errorData.password && errorData.password.includes('Password minimal 8 karakter')) {
                errorMessage += " Password must be at least 8 characters!";
            } else if (errorFields.length === 3 || errorFields.length === 2) {
                errorMessage += " Make sure to fill in all the required sections!";
            } else if (errorFields.includes("name")) {
                errorMessage += " Make sure to fill in the name!";
            } else if (errorFields.includes("email")) {
                errorMessage += " Make sure to fill in the email!";
            } else if (errorFields.includes("password")) {
                errorMessage += " Make sure to fill in the password!";
            } else {
                errorMessage += " Make sure to fill in all the required sections!";
            }

            // Tampilkan toast dengan pesan error yang sesuai
            setErrorMessage(errorMessage);
            setShowToast(true);

            // Sembunyikan toast setelah beberapa detik
            setTimeout(() => {
                setShowToast(false);
            }, 3000); // 3 detik
        }
    };
    return (
        <>{showToast && (
            <div className="toast">
                <div className="alert alert-error">
                    <span>{errorMessage}</span>
                </div>
            </div>
        )}
        {loadPage ?
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
                <div className="font-bold text-lg">Edit User Data</div>
                <div className="text-xs text-gray-500">* Required</div>
                <hr className="my-2"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Name*</span>
                            <input type="text" defaultValue={user.name} onChange={handleChange} name="name" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Email*</span>
                            <input type="text" defaultValue={user.email} onChange={handleChange} name="email" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                </div>
                <div>
                    <label className="form-control w-full mt-2">
                        <span className="label-text text-xs font-semibold">Company*</span>
                        <Select
                            options={companyOptions}
                            isMulti
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
                <hr className="mt-8 mb-4"/>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Password</span>
                            <input type="password" defaultValue={user.password} onChange={handleChange} name="password" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div className="md:mt-0 mt-2 w-full">
                        <label className="form-control w-full max-w-lg">
                            <span className="label-text text-xs font-semibold">Role</span>
                            <select className="select select-bordered select-sm" name="role" defaultValue={user.role} onChange={handleChange}>
                                <option value={user.role}>{user.role}</option>
                                {renderRoleOptions()}
                            </select>
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Job</span>
                            <input type="text" defaultValue={user.job} onChange={handleChange} name="job" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Phone</span>
                            <input type="text" defaultValue={user.phone} onChange={handleChange} name="phone" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Team</span>
                            <input type="text" defaultValue={user.team} onChange={handleChange} name="team" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Status</span>
                            <select className="select select-bordered select-sm" name="status" defaultValue={user.status} onChange={handleChange}>
                                <option value={user.status}>{user.status}</option>
                                {renderStatusOptions()}
                            </select>
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
                    <Link to={"/dashboard/users"}>
                        <button className="btn btn-error btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
            : <div className="flex items-center justify-center min-h-screen bg-base-100"><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span></div>}
        </>
    );
}