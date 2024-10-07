import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";

export function TopologyEdit() {
    const [topology, setTopology] = useState([]);
    const [applications, setApplications] = useState([]);
    const [load, setLoad] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();
    const [data, setData] = useState({
        description: '',
        status: '',
        link: '',
        group: ''
    });

    const fetchDataApplications = async () => {
        try {
            const response = await instance.get("/applications");
            setApplications(response.data.data);
        } catch (error) {
            console.error("Error fetching applications", error);
        }
    };

    const fetchDataTopology = async () => {
        try {
            const userResponse = await instance.get('/user');
            if (userResponse.data.role !== "admin") {
                navigate('/dashboard');
                return;
            }

            const topologyResponse = await instance.get(`/topologies/${id}`);
            setTopology(topologyResponse.data.data);
            setData(topologyResponse.data.data);
            setLoad(false);
        } catch (error) {
            console.error("Error fetching topology data", error);
        }
    };

    const renderOptions = (allOptions, current) => {
        return allOptions.filter(option => option !== current).map(option => (
            <option key={option} value={option}>{option}</option>
        ));
    };

    useEffect(() => {
        fetchDataTopology();
        fetchDataApplications();
    }, []);

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await instance.patch(`/topologies/${id}`, data);
            console.log('Data updated successfully');
            navigate('/dashboard/topologies');
        } catch (error) {
            console.error('Error updating data', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="container mx-auto p-4">
                <div className="font-bold text-lg">Edit Topology Data</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                    <div>
                        <label className="form-control w-full max-w-lg">
                            <span className="label-text text-xs font-semibold">Group</span>
                            <select className="select select-bordered select-sm" name="group" defaultValue={topology.group} onChange={handleChange}>
                                <option value={topology.group}>{topology.group}</option>
                                {renderOptions(['Direct DB', 'API', 'RFC'], topology.group)}
                            </select>
                        </label>
                    </div>

                    <div>
                        <label className="form-control w-full max-w-lg">
                            <span className="label-text text-xs font-semibold">Status</span>
                            <select className="select select-bordered select-sm" name="status" defaultValue={topology.status} onChange={handleChange}>
                                <option value={topology.status}>{topology.status}</option>
                                {renderOptions(['used', 'not used'], topology.status)}
                            </select>
                        </label>
                    </div> 

                    <div>
                        <label className="form-control w-full max-w-lg">
                            <span className="label-text text-xs font-semibold">Link</span>
                            <input type="text" name="link" defaultValue={topology.link} onChange={handleChange} className="input input-bordered input-sm w-full" />
                        </label>
                    </div>
                </div>
                
                <div>
                    <label className="form-control w-full">
                        <span className="label-text">Description</span>
                        <textarea className="textarea textarea-bordered h-36" defaultValue={topology.description} onChange={handleChange} name="description" placeholder="Write your description here..."></textarea>
                    </label>
                </div>

                <div className="flex items-center justify-end my-4 gap-4">
                    <button className="btn btn-success btn-sm" type="submit" value="submit">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
                        Submit
                    </button>
                    <Link to={"/dashboard/topologies"}>
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
