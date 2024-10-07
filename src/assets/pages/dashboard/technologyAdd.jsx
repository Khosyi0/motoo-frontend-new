import { useEffect, useState } from "react";
import instance from "../../../axios";
import { Link, useNavigate } from "react-router-dom";

export function TechnologyAdd() {
    const [loadPage, setLoadPage] = useState(false);
    const [applications, setApplications] = useState([]);

    const fetchDataApplications = async () => {
        //fetch data from API with Axios
        await instance.get("/applications").then((response) => {
            setApplications(response.data.data);
            setLoadPage(true);
        });
    };

    const fetchData = async () => {
        //fetch user from API
        await instance.get('/user')
            .then((response) => {
                //set response user to state
                (response.data.role !== "admin" ?
                    navigate('/dashboard') : "")
            })
    }
    useEffect(() => {
        fetchData();
        fetchDataApplications();
    }, []);

    const [data, setData] = useState({
        // Define the fields you want to add
        name: '',
        version: '',           
        group: ''
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const navigate = useNavigate();

    console.log(data)
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make a POST request to your API endpoint
            const response = await instance.post('/technologies', data);

            // Handle success (you can redirect or perform other actions)
            console.log('Data added successfully');
            navigate('/dashboard/technologies');
        } catch (error) {
            // Handle error
            console.log('Error adding data');
        }
    };
    return (
        <>{loadPage ?
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
                <div className="font-bold text-lg">Add Technology Data</div>
                <div className="grid grid-cols-1 gap-4 py-2">
                    <div >
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Name</span>
                            <input type="text" required value={data.name} onChange={handleChange} name="name" className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    
                    <div >
                        <label className="form-control w-full ">
                            <span className="label-text text-xs font-semibold">Group</span>
                            <select className="select select-bordered select-sm" required name="group" value={data.group} onChange={handleChange}>
                                <option value="" disabled>-- Select Group --</option>
                                <option value="FE">FE</option>
                                <option value="BE">BE</option>
                                <option value="fullstuck">FullStuck</option>
                                <option value="DB">DB</option>
                            </select>
                        </label>
                    </div>


                    {["version"].map(
                        (el) => (
                            <div key={el}>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">{el}</span>
                                    <input type="text" value={data.el} onChange={handleChange} name={el} className="input input-bordered input-sm w-full " />
                                </label>
                            </div>
                        )
                    )}

                </div>
                

                <div className="flex items-center justify-end my-4 gap-4">
                    <button className="btn btn-success btn-sm" value="submit" type="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Submit
                    </button>
                    <Link to={"/dashboard/technologies"}>
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