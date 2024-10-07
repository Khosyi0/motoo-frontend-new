import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";

export function GroupEdit() {
    const [groupArea, setGroupArea] = useState(null);
    const [applications, setApplications] = useState([]);
    const [load, setLoad] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchDataApplications = async () => {
        // Fetch data from API with Axios
        await instance.get("/applications").then((response) => {
            setApplications(response.data.data);
        });
    };

    const fetchDataGroupArea = async () => {
        try {
            // Fetch user data and check role
            const userResponse = await instance.get('/user');
            if (userResponse.data.role !== "admin") {
                navigate('/dashboard');
                return;
            }

            // Fetch group area data by ID
            const groupAreaResponse = await instance.get(`/group_areas/${id}`);
            setGroupArea(groupAreaResponse.data.data);
            setData({
                short_name: groupAreaResponse.data.data.short_name,
                long_name: groupAreaResponse.data.data.long_name,
                image: null,
            });
            setImagePreview(groupAreaResponse.data.data.image); // Set the initial image preview
            setLoad(false);
        } catch (error) {
            // Handle error
            console.error('Error fetching group area data:', error);
            // Optionally, you can set an error state here to display an error message to the user
        }
    };

    // Run hook useEffect
    useEffect(() => {
        fetchDataGroupArea();
        fetchDataApplications();
    }, []);

    const [data, setData] = useState({
        short_name: '',
        long_name: '',
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setData({ ...data, image: file });
            setImagePreview(URL.createObjectURL(file)); // Set image preview URL
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

            // Log form data for debugging
            for (let [key, value] of formData.entries()) {
                console.log(key, value);
            }
            formData.append('_method', 'PATCH');
            // Make a PATCH request to update the group area data
            await instance.post(`/group_areas/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Handle success (you can redirect or perform other actions)
            console.log('Data updated successfully');
            navigate('/dashboard/groups');
        } catch (error) {
            // Handle error
            console.error('Error updating data:', error);
            if (error.response && error.response.data) {
                console.error('Server response:', error.response.data);
            }
        }
    };

    if (load) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-base-100">
                <span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span>
                <span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span>
            </div>
        );
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
                <div className="font-bold text-lg">Edit Group Area Data</div>
                <div className="grid grid-cols-1 gap-4 py-2">
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Short Name</span>
                            <input type="text" defaultValue={groupArea.short_name} onChange={handleChange} name="short_name" className="input input-bordered input-sm w-full" />
                        </label>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Long Name</span>
                            <input type="text" defaultValue={groupArea.long_name} onChange={handleChange} name="long_name" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    <div>
                        <label className="form-control w-full">
                            <span className="label-text text-xs font-semibold">Image</span>
                            <input type="file" accept="image/*" onChange={handleChange} name="image" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                    {imagePreview && (
                        <div>
                            <img src={imagePreview} alt="Selected Preview" className="max-w-xs" />
                        </div>
                    )}
                </div>
                <div className="flex items-center justify-end my-4 gap-4">
                    <button className="btn btn-success btn-sm" type="submit" value="submit">
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
            </form>
        </>
    );
}
