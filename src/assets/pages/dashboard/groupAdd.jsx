import { useEffect, useState } from "react";
import instance from "../../../axios";
import { Link, useNavigate } from "react-router-dom";

export function GroupAdd() {
    const [loadPage, setLoadPage] = useState(false);
    const [applications, setApplications] = useState([]);
    const [previewImage, setPreviewImage] = useState(null); // State for image preview
    const navigate = useNavigate();

    const fetchDataApplications = async () => {
        // Fetch data from API with Axios
        await instance.get("/applications").then((response) => {
            setApplications(response.data.data);
            setLoadPage(true);
        });
    };

    const fetchData = async () => {
        // Fetch user from API
        await instance.get('/user')
            .then((response) => {
                // Set response user to state
                (response.data.role !== "admin" ? navigate('/dashboard') : "")
            })
    }
    
    useEffect(() => {
        fetchData();
        fetchDataApplications();
    }, []);

    const [data, setData] = useState({
        // Define the fields you want to add
        short_name: '',
        long_name: '',
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setData({ ...data, image: file });

            // Set image preview URL
            setPreviewImage(URL.createObjectURL(file));
        } else {
            setData({ ...data, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('short_name', data.short_name);
            formData.append('long_name', data.long_name);
            if (data.image) {
                formData.append('image', data.image);
            }
            // Make a POST request to your API endpoint
            const response = await instance.post('/group_areas', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle success (you can redirect or perform other actions)
            console.log('Data added successfully');
            navigate('/dashboard/groups');
        } catch (error) {
            // Handle error
            console.log('Error adding data');
        }
    };

    return (
        <>{loadPage ?
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
                <div className="font-bold text-lg">Add Group Area Data</div>
                <div className="grid grid-cols-1 gap-4 py-2">
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Short Name</span>
                            <input type="text" required value={data.short_name} onChange={handleChange} name="short_name" className="input input-bordered input-sm w-full" />
                        </label>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Long Name</span>
                            <input type="text" required value={data.long_name} onChange={handleChange} name="long_name" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Image</span>
                            <input type="file" accept="image/*" onChange={handleChange} name="image" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    {previewImage && (
                        <div>
                            <img src={previewImage} alt="Image Preview" className="max-w-xs mt-2" />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end my-4 gap-4">
                    <button className="btn btn-success btn-sm" value="submit" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Submit
                    </button>
                    <Link to={"/dashboard/groups"}>
                        <button className="btn btn-error btn-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Cancel
                        </button>
                    </Link>
                </div>
            </form> : <div className="flex items-center justify-center min-h-screen bg-base-100"><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span></div>}
        </>
    )
}
