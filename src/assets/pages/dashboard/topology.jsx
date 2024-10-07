import { useEffect, useState } from "react";
import instance from "../../../axios";
import { Link, useNavigate } from "react-router-dom";

export function Topology() {
    const [topology, setTopology] = useState([]);
    const [topologySpecified, setTopologySpecified] = useState({});

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const [load, setLoad] = useState(true);

    const [loadPage, setLoadPage] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const [searchTerm, setSearchTerm] = useState("");
    const [searchDetailTerm, setSearchDetailTerm] = useState("");

    const navigate = useNavigate();

    const handleOpen = async (el) => {
        setOpen(!open);
        setId(el);
        try {
            const response = await instance.get(`/topologies/${el}`);
            setTopologySpecified(response.data.data);
        } catch (error) {
            console.error("Error fetching topology details", error);
        }
    };

    const fetchDataTopology = async () => {
        try {
            const response = await instance.get("/topologies");
            setTopology(response.data.data);
            setLoad(false);
        } catch (error) {
            console.error("Error fetching topology data", error);
        }
    };

    const deleteTopology = async (id) => {
        try {
            await instance.delete(`/topologies/${id}`);
            setTopology(topology.filter((item) => item.id !== id));
        } catch (error) {
            console.error("Error deleting topology", error);
        }
    };

    
    const itemsPerPage = 10; // Number of items to display per page

    // Calculate the range of items to display based on the current page
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    // Slice the data array to get the items for the current page
    const currentData = topology.slice(startIndex, endIndex);

    const totalPages = Math.ceil(topology.length / itemsPerPage);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchDetailChange = (e) => {
        setSearchDetailTerm(e.target.value);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };
    

    const [seeButton, setSeeButton] = useState(null);
    const fetchData = async () => {

        //fetch user from API
        await instance.get('/user')
            .then((response) => {
                const userRole = response.data.role;

                //set response user to state
                if (userRole === "admin" || userRole === "teknisi") {
                    setLoadPage(true);
                } else {
                    navigate('/dashboard');
                }

                if (userRole === "admin") {
                    setSeeButton(true);
                    setLoadPage(true);
                }
            })
    }

    useEffect(() => {
        fetchData();
        fetchDataTopology();
    }, []);

    const filteredTopo = topology.filter((topo) => {
        const { group, status, applications } = topo;
        const appMatch = applications.some((app) =>
            app.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            group.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appMatch
        );
    });

    const filteredApplications = topologySpecified.applications
        ? topologySpecified.applications.filter((app) =>
            app.name.toLowerCase().includes(searchDetailTerm.toLowerCase())
        )
        : [];

    return (
        <>
            {loadPage ? 
                <section className='flex gap-4'>
                    <div className={open ? "w-full lg:w-9/12" : "w-full"}>
                        <div className="p-2">
                            <h1 className='font-bold text-xl p-2'>Topology Table</h1>
                            {load ? (
                                <div className="flex items-center p-2">
                                    <span className="loading loading-infinity loading-md"></span>&emsp;Loading data
                                </div>
                            ) : (
                                <>
                                    <div className='flex justify-between p-2'>
                                    {seeButton &&(
                                    <>
                                        <Link to="add">
                                            <button className='btn btn-success btn-sm'>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                </svg>
                                                Add
                                            </button>
                                        </Link>
                                        </>)}
                                        <label className="relative block">
                                            <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                                                <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 16 16"
                                                fill="currentColor"
                                                className="w-4 h-4 text-gray-400"
                                                >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                                    clipRule="evenodd"
                                                />
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                value={searchTerm}
                                                onChange={handleSearchChange}
                                                name="searchBox"
                                                className="input input-bordered pl-8 w-full"
                                            />
                                        </label>
                                    </div>
                                    <table className="w-full table-x table">
                                        <thead>
                                            <tr>
                                                {["group", "link","status", "description","applications"].map((el) => (
                                                    <td key={el} className="text-left font-semibold capitalize text-sm border-b border-neutral py-2">
                                                        {el}
                                                    </td>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                        {filteredTopo.slice(startIndex, endIndex).map((topo, index) => (
                                                <tr 
                                                    key={index} 
                                                    onClick={() => handleOpen(topo.id)} 
                                                    className="hover:bg-gray-300 border-b border-gray-400 text-wrap"
                                                >
                                                    <td>{topo.group}</td>
                                                    <td>{topo.link}</td>
                                                    <td>{topo.status}</td>
                                                    <td>{topo.description}</td>
                                                    <td className="flex flex-wrap items-center">
                                                        {topo.applications.slice(0, 9).map((app) => (
                                                            app.image ? (
                                                                <Link key={app.id} to={`/application/${app.id}`} className="m-1">
                                                                    <img
                                                                        src={app.image}
                                                                        className="w-16 h-16 object-cover"
                                                                        alt={app.name}
                                                                    />
                                                                </Link>
                                                            ) : null
                                                        ))}
                                                        {topo.applications.length > 5 && (
                                                            <button
                                                                onClick={() => handleOpen(topo.id)}
                                                                className="m-1 p-2 border rounded bg-gray-200"
                                                            >
                                                                +{topo.applications.length - 7}
                                                            </button>
                                                        )}
                                            </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex items-center justify-between my-4">
                                        <p>Total data {topology.length} entries</p>
                                        {topology.length > 10 && (
                                            <div className="join">
                                                <button className="join-item btn btn-primary btn-sm p-1 rounded-none" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                                                    </svg>
                                                </button>
                                                <p className="join-item btn btn-base-100 btn-sm">{`${currentPage} of ${totalPages}`}</p>
                                                <button className="join-item btn btn-primary btn-sm p-1 rounded-none" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={open ? "hidden md:block lg:w-3/12 shadow-xl px-2 py-4 min-h-screen bg-gray-200" : "hidden"}>
                        <div className="flex justify-between p-2 bg-gray-200">
                            <span className='text-2xl font-bold'>Detail</span>
                            {seeButton &&(
                                    <>
                            {topologySpecified.id === id && (
                                <div className="flex gap-1">
                                    <Link to={`edit/${topologySpecified.id}`}>
                                        <button className="btn btn-warning btn-sm p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                            Edit
                                        </button>
                                    </Link>
                                    <button className="btn btn-primary btn-sm p-1" onClick={() => document.getElementById('my_modal_1').showModal()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            )}
                            </>)}
                        </div>
                        <div role="tablist" className="tabs tabs-boxed mt-4 bg-gray-200">
                            <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold" aria-label="Spesifikasi" defaultChecked />
                            <div role="tabpanel" className="tab-content rounded-box">
                                <div className="overflow-x-auto py-4">
                                    <table className="table table-xs table-bordered">
                                        <thead className="hidden">
                                            <tr>
                                                <th>Field</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                [topologySpecified.group, "group"],
                                                [topologySpecified.link, "link"],
                                                [topologySpecified.status, "status"],
                                                [topologySpecified.description, "description"],
                                            ].map((el, index) => (
                                                el[0] && (
                                                    <tr key={index}>
                                                        <td className="font-bold text-sm capitalize">{el[1]}</td>
                                                        <td>{el[0]}</td>
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold w-full whitespace-nowrap" aria-label="Connected Apps" />
                    <div role="tabpanel" className="tab-content bg-base-100 ">
                    <div className="py-4">
                    <div className="overflow-x-auto">
                        <table className="table table-xs table-bordered">
                            <thead>
                                <tr>
                                    <th>Application Name</th>
                                    <th>Application Image</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredApplications.length > 0 ? (
                                    filteredApplications.map((app, index) => (
                                <tr key={index}>
                                    <td>{app.name}</td>
                                    <td>
                                    {app.image ? (
                                        <Link to={`/application/${app.id}`}>
                                            <img
                                                src={app.image}
                                                className="w-16 h-16 object-cover"
                                                alt={app.name}
                                            />
                                        </Link>
                                            ) : (
                                            "N/A"
                                                )}
                                    </td>
                                </tr>
                                    ))
                                ) : (
                                <tr>
                                    <td colSpan="2">No Connected Apps</td>
                                </tr>
                                    )}
                            </tbody>
                        </table>
                    </div>
                    </div>
                    </div>
                        </div>
                    </div>
                    <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Delete</h3>
                            <p className="pt-4">Are you sure to delete the data?</p>
                            <div className="modal-action">
                                <div method="dialog">
                                    <button className="btn btn-success btn-sm mr-2" onClick={() => (deleteTopology(topologySpecified.id), document.getElementById('my_modal_1').close())}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                        </svg>
                                        Yes
                                    </button>
                                    <button className="btn btn-error btn-sm" onClick={() => document.getElementById('my_modal_1').close()}>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </section>
            : <div className="flex items-center justify-center min-h-screen bg-base-100">
                <span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span>
                <span className="text-2xl animate-bounce font-bold text-primary">&nbsp;Loading</span>
            </div>}
        </>
    );
}


