import { useEffect, useState } from "react";
import instance from "../../../axios";
import { Link, useNavigate } from "react-router-dom";

export function PicAdd() {
    const [loadPage, setLoadPage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState({
        name: '',
        pic_type: '',
        contact: '',
        jobdesc: '',
        status: '',
    });

    const fetchData = async () => {
        try {
            // Fetch logged-in user data
            const response = await instance.get('/user');
            if (response.data.role !== "admin") {
                navigate('/dashboard');
            } else {
                setLoadPage(true);
            }
        } catch (error) {
            console.error("Error fetching data", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Validate the user
            const validateResponse = await instance.post('/validate-user', { name: data.name });
            const user = validateResponse.data.user;

            // Make a POST request to your API endpoint with user_id instead of name
            const response = await instance.post('/pics', {
                user_id: user.id,
                pic_type: data.pic_type,
                contact: data.contact,
                jobdesc: data.jobdesc,
                status: data.status,
            });

            // Handle success (you can redirect or perform other actions)
            console.log('Data added successfully');
            navigate('/dashboard/pics');
        } catch (error) {
            // Handle error
            if (error.response && error.response.data.message) {
                setErrorMessage(error.response.data.message);
            } else {
                console.log('Error adding data', error);
            }
        }
    };

    return (
        <>
            {loadPage ? (
                <form onSubmit={handleSubmit} className="container mx-auto p-4">
                    <div className="font-bold text-lg">Add PIC Data</div>
                    {errorMessage && <div className="text-red-500">{errorMessage}</div>}
                    <div className="grid grid-cols-1 gap-4 py-2">
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">User Name</span>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={handleChange}
                                    name="name"
                                    className="input input-bordered input-sm w-full"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                        <div className="md:mt-0 mt-2 w-full">
                            <label className="form-control w-full max-w-lg">
                                <span className="label-text text-xs font-semibold">PIC Type</span>
                                <select
                                    className="select select-bordered select-sm"
                                    name="pic_type"
                                    value={data.pic_type}
                                    onChange={handleChange}
                                >
                                    <option value="" disabled>Select a PIC type</option>
                                    <option value="first_pic">First PIC</option>
                                    <option value="backup_pic">Backup PIC</option>
                                    <option value="old_pic">Old PIC</option>
                                    <option value="pic_ict">PIC ICT</option>
                                    <option value="pic_user">PIC User</option>
                                </select>
                            </label>
                        </div>

                        {["contact", "jobdesc", "status"].map((el) => (
                            <div key={el}>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">{el}</span>
                                    <input
                                        type="text"
                                        value={data[el]}
                                        onChange={handleChange}
                                        name={el}
                                        className="input input-bordered input-sm w-full"
                                    />
                                </label>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end my-4 gap-4">
                        <button className="btn btn-success btn-sm" value="submit" type="submit">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4.5 12.75l6 6 9-13.5"
                                />
                            </svg>
                            Submit
                        </button>
                        <Link to={"/dashboard/pics"}>
                            <button className="btn btn-error btn-sm">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                Cancel
                            </button>
                        </Link>
                    </div>
                </form>
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-base-100">
                    <span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span>
                    <span className="text-2xl font-bold animate-bounce text-primary">
                        &nbsp;Loading
                    </span>
                </div>
            )}
        </>
    );
}
