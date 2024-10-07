import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";

export function VirtualMachineEdit() {
    const [virtualMachine, setVirtualMachine] = useState([]);
    const [loadPage, setLoadPage] = useState(true);
    const { id } = useParams();
    const navigate = useNavigate();

    const fetchDataVirtualMachine = async () => {
        await instance.get('/user').then((response) => {
            if (response.data.role !== "admin") {
                navigate('/dashboard');
            } else {
                setLoadPage(false);
            }
        });

        await instance.get(`/virtual_machines/${id}`).then((response) => {
            setVirtualMachine(response.data.data);
            setData(response.data.data);
            setLoadPage(false);
        });
    };

    const renderGroupOptions = () => {
        const allGroups = ['FE', 'BE', 'FullStuck', 'DB'];
        const currentGroup = virtualMachine.group;

        return allGroups.filter(group => group !== currentGroup).map(group => (
            <option key={group} value={group}>{group}</option>
        ));
    };

    useEffect(() => {
        fetchDataVirtualMachine();
    }, []);

    const [data, setData] = useState({
        id: '',
        name: '',
        description: '',
        ip_address: '',
        group: '',
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await instance.patch(`/virtual_machines/${id}`, data);
            console.log('data updated successfully');
            navigate('/dashboard/virtual_machines');
        } catch (error) {
            console.log('Error updating data', error);
        }
    };

    return (
        <>
            {loadPage ? (
                <div className="flex items-center justify-center min-h-screen bg-base-100"><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span></div>
            ) : (
                <form onSubmit={handleSubmit} className="container mx-auto p-4">
                    <div className="font-bold text-lg">Edit Virtual Machine Data</div>
                            <div className="grid grid-cols-1 gap-4 py-2">
                                <div>
                                    <label className="form-control w-full">
                                        <span className="label-text text-xs font-semibold">Name</span>
                                        <input type="text" defaultValue={virtualMachine.name} onChange={handleChange} name="name" className="input input-bordered input-sm w-full" />
                                    </label>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                                                            
                            <div className="md:mt-0 mt-2 w-full">
                                    <label className="form-control w-full max-w-lg">
                                        <span className="label-text text-xs font-semibold">Group</span>
                                        <select className="select select-bordered select-sm" name="group" defaultValue={virtualMachine.group} onChange={handleChange}>
                                            <option value={virtualMachine.group}>{virtualMachine.group}</option>
                                            {renderGroupOptions()}
                                        </select>
                                    </label>
                                </div>
                                
                                {[[virtualMachine.ip_address, "ip_address"]].map(
                                    (el, index) => (
                                        <div key={index}>
                                            <label className="form-control w-full">
                                                <span className="label-text text-xs font-semibold">{el[1]}</span>
                                                <input type="text" name={el[1]} defaultValue={el[0]} onChange={handleChange} className="input input-bordered input-sm w-full" />
                                            </label>
                                        </div>
                                    )
                                )}
                            </div>
                            <div className="    ">
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text">Description : </span>
                                    <textarea className="textarea textarea-bordered h-36" name="description" value={virtualMachine.description} onChange={handleChange} placeholder={"Write your description here..."}></textarea>
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
                                <Link to={"/dashboard/virtual_machines"}>
                                    <button className="btn btn-error btn-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        Cancel
                                    </button>
                                </Link>
                        </div>
                    </form>
            )}
        </>
    );    
}
