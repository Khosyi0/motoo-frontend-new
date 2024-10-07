import { useEffect, useState } from "react";
import instance from "../../../axios";
import { Link, useNavigate } from "react-router-dom";
import Select from 'react-select';

export function UserAdd() {
    const [loadPage, setLoadPage] = useState(false);
    const [companies, setCompany] = useState([]);
    const fetchData = () => {
        //fetch user from API
        instance.get('/user')
            .then((response) => {
                //set response user to state
                (response.data.role !== "admin" ?
                    navigate('/dashboard') : setLoadPage(true))
            })
    }

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
        //fetch data from API with Axios
        await instance.get("/companies").then((response) => {
            setCompany(response.data.data);
        });
    };

    useEffect(() => {
        fetchData();
        fetchAppsData();
    }, []);

    const [data, setData] = useState({
        // Define the fields you want to add
        name: '',
        role: 'client',
        company: '',
        job: '',
        group: '', // integer
        email: '',
        phone: '',
        team: '',
        password: '',
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSelectCompanyChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        const selectedValuesString = selectedValues.join(', ');

        setData({ ...data, company: selectedValuesString });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await instance.post('/users', data);
            console.log('Data added successfully', response.data);
            navigate('/dashboard/users', { state: { successMessage: "Data added successfully" } });
        } catch (error) {
            console.log('Error adding data:', error.response ? error.response.data : error.message);
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
        )}{loadPage ?
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
            <div className="font-bold text-lg">Add User Data</div>
            <div className="text-xs text-gray-500">* Required</div>
                <hr className="my-2"/>
                <div className="grid grid-cols-1 gap-4 py-2">
                    <div >
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Name*</span>
                            <input type="text" value={data.name} onChange={handleChange} name="name" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>    
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="md:mt-0 mt-2 w-full">
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Email*</span>
                            <input type="text" value={data.email} onChange={handleChange} name="email" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Password*</span>
                            <input type="password" name="password" value={data.password} onChange={handleChange} className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                </div>
                <hr className="mt-8 mb-4" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="md:mt-0 mt-2 w-full">
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Role</span>
                            <select className="select select-bordered select-sm" name="role" value={data.role} onChange={handleChange}>
                                <option value="client">client</option>
                                <option value="Teknisi">Teknisi</option>
                                <option value="Reporter">Reporter</option>
                                <option value="Admin">Admin</option>
                            </select>
                        </label>
                    </div>
                    <div className="md:mt-0 mt-2 w-full">
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Job</span>
                            <input type="text" value={data.job} onChange={handleChange} name="job" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div className="md:mt-0 mt-2 w-full">
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Phone</span>
                            <input type="text" value={data.phone} onChange={handleChange} name="phone" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div className="md:mt-0 mt-2 w-full">
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Team</span>
                            <input type="text" value={data.team} onChange={handleChange} name="team" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full">
                        <span className="label-text text-xs font-semibold">Company</span>
                        <Select
                            options={companyOptions}
                            isMulti
                            value={companyOptions.filter(option => data.company.includes(option.value))}
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
                    <Link to={"/dashboard/users"}>
                        <button className="btn btn-error btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </Link>
                    <button className="btn btn-success btn-sm" value="submit" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Submit
                    </button>
                </div>
            </form>:<div className="flex items-center justify-center min-h-screen bg-base-100"><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span></div>}
        </>
    )
}