import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";

export function PicEdit() {
    const [pics, setPics] = useState(null);
    const [load, setLoad] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchDataPics = async () => {
        try {
            const userResponse = await instance.get('/user');
            if (userResponse.data.role !== "admin") {
                navigate('/dashboard');
                return;
            }

            const picsResponse = await instance.get(`/pics/${id}`);
            setPics(picsResponse.data.data);
            setData(picsResponse.data.data);
            setLoad(false);
        } catch (error) {
            console.error("Error fetching data", error);
            navigate('/dashboard');
        }
    };

    useEffect(() => {
        fetchDataPics();
    }, [id]);

    const [data, setData] = useState({
        name: '',        
        contact: '',
        jobdesc: '',
        status: '',
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await instance.put(`/pics/${id}`, data);
            console.log('Data updated successfully');
            navigate('/dashboard/pics');
        } catch (error) {
            console.error('Error updating data', error);
        }
    };

    const renderOptions = (allOptions, current) => {
        return allOptions.filter(option => option !== current).map(option => (
            <option key={option} value={option}>{option}</option>
        ));
    };

    if (load) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
                <div className="font-bold text-lg">Edit Pic Data</div>
                <div className="grid grid-cols-1 gap-4 py-2">
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Name</span>
                            <input 
                                type="text" 
                                defaultValue={pics.name} 
                                onChange={handleChange} 
                                name="name" 
                                className="input input-bordered input-sm w-full" 
                            />
                        </label>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    
                    {['contact', 'jobdesc', 'status'].map((field) => (
                        <div key={field}>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">{field}</span>
                                <input 
                                    type="text" 
                                    defaultValue={pics[field]} 
                                    onChange={handleChange} 
                                    name={field} 
                                    className="input input-bordered input-sm w-full" 
                                />
                            </label>
                        </div>
                    ))}
                </div>
                <div className="flex items-center justify-end my-4 gap-4">
                    <button className="btn btn-success btn-sm" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Submit
                    </button>
                    <Link to={"/dashboard/pics"}>
                        <button className="btn btn-error btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </Link>
                </div>
            </form>
        </>
    );
}