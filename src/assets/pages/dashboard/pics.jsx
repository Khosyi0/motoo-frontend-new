import { useEffect, useState } from "react";
import instance from "../../../axios";
import { Link, useNavigate } from "react-router-dom";

export function Pics() {
    const [pics, setPics] = useState([]);
    const [picSpecified, setPicSpecified] = useState({});
    const [load, setLoad] = useState(true);

    const fetchDataPics = async () => {
        await instance.get("/pics").then((response) => {
            setPics(response.data.data);
            setLoad(false);
        });
    };

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);

    const handleOpen = async (el) => {
        setOpen(!open);
        setId(el);
        await instance.get(`/pics/${el}`).then((response) => {
            setPicSpecified(response.data.data);
        });
    };

    const deletePic = async (id) => {
        await instance.delete(`/pics/${id}`).then((response) => {
            setPics(pics.filter((pic) => pic.id !== id));
        });
    };

    const itemsPerPage = 8;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = pics.slice(startIndex, endIndex);
    const totalPages = Math.ceil(pics.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    
    const navigate = useNavigate();
    const [loadPage, setLoadPage] = useState(false);
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
        fetchDataPics();
    }, []);

    return (
        <>
            {loadPage ? (
                <section className="flex gap-4">
                    <div className={open ? "w-full lg:w-9/12" : "w-full"}>
                        <div className="p-2">
                            <h1 className="font-bold text-xl p-2">Pics Table</h1>
                            {load ? (
                                <div className="flex items-center p-2">
                                    <span className="loading loading-infinity loading-md"></span>
                                    &emsp;Loading data
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between p-2">
                                        <div className="badge badge-outline text-error">
                                            *click row for detail
                                        </div>
                                    </div>
                                    <table className="w-full table-auto my-4 table-xs">
                                        <thead>
                                            <tr>
                                                {["name", "role", "job description", "contact", "status"].map(
                                                    (el) => (
                                                        <td
                                                            key={el}
                                                            className="text-left font-semibold capitalize text-sm border-b border-neutral py-2"
                                                        >
                                                            {el}
                                                        </td>
                                                    )
                                                )}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentData.map((pic, index) => (
                                                <tr
                                                    key={index}
                                                    onClick={() => handleOpen(pic.id)}
                                                    className="hover:bg-gray-300 hover:shadow-lg"
                                                >
                                                    <td className="px-4 align-middle">
                                                        <div className="flex items-center gap-4">
                                                            {pic.photo ? (
                                                                <img
                                                                    src={"http://127.0.0.1:8000" + pic.photo}
                                                                    alt={pic.name}
                                                                    className="w-8 h-8 rounded-full object-cover"
                                                                />
                                                            ) : (
                                                                <svg
                                                                    xmlns="http://www.w3.org/2000/svg"
                                                                    viewBox="0 0 24 24"
                                                                    fill="currentColor"
                                                                    className="w-8 h-8"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            )}
                                                            <div>
                                                                <p className="font-semibold">{pic.name}</p>
                                                                <p className="italic hidden md:flex">{pic.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {pic.role}
                                                    </td>
                                                    <td>{pic.jobdesc}</td>
                                                    <td>{pic.contact}</td>
                                                    <td>{pic.status}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex items-center justify-between my-4">
                                        <p>Total data {pics.length ? pics.length : 0} entries</p>
                                        {pics.length > 10 && (
                                            <div className="join">
                                                <button
                                                    className="join-item btn btn-primary btn-sm p-1 rounded-none"
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                >
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
                                                            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
                                                        />
                                                    </svg>
                                                </button>
                                                <p className="join-item btn btn-base-100 btn-sm">{`${currentPage} of ${totalPages}`}</p>
                                                <button
                                                    className="join-item btn btn-primary btn-sm p-1 rounded-none"
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                >
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
                                                            d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5"
                                                        />
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
                            <span className="text-2xl font-bold">Detail</span>
                            {seeButton &&(
                                    <>
                            {picSpecified.id === id && (
                                <div className="flex gap-1">
                                    <Link to={`edit/${picSpecified.id}`}>
                                        <button className="btn btn-warning btn-sm p-1">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth="2"
                                                stroke="currentColor"
                                                className="w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                                                />
                                            </svg>
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        className="btn btn-primary btn-sm p-1"
                                        onClick={() => document.getElementById("my_modal_1").showModal()}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth="1.5"
                                            stroke="currentColor"
                                            className="w-5"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                            />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            )}
                            </>)}
                        </div>
                        <div role="tablist" className="tabs tabs-boxed mt-4 bg-gray-200">
                            <input
                                type="radio"
                                name="my_tabs_2"
                                role="tab"
                                className="tab font-bold"
                                aria-label="Spesifikasi"
                                defaultChecked
                            />
                            <div role="tabpanel" className="tab-content px-2">
                                <div className="flex justify-center items-center p-2">
                                    {picSpecified.photo ? (
                                        <img
                                            src={"http://127.0.0.1:8000" + picSpecified.photo}
                                            alt={picSpecified.name}
                                            className="w-60 h-60 rounded-full object-cover"
                                        />
                                    ) : (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                            fill="currentColor"
                                            className="w-20 h-20"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    )}
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="table table-bordered">
                                        <thead className="hidden">
                                            <tr>
                                                <th>Field</th>
                                                <th>Value</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {[
                                                [picSpecified.name, "name"],
                                                [picSpecified.role, "role"],
                                                [picSpecified.jobdesc, "job description"],
                                                [picSpecified.contact, "contact"],
                                                [picSpecified.status, "status"],
                                            ].map((el) => (
                                                el[0] && (
                                                    <tr key={el[1]}>
                                                        <td className="text-sm capitalize font-semibold bg-gray-300">
                                                            {el[1]}
                                                        </td>
                                                        <td className="border border-gray-200">
                                                            {el[0]}
                                                        </td>
                                                    </tr>
                                                )
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <input
                                type="radio"
                                name="my_tabs_2"
                                role="tab"
                                className="tab font-bold"
                                aria-label="Connected Apps"
                            />
                            <div role="tabpanel" className="tab-content px-2">
                                <div className="py-4">
                                    <div className="overflow-x-auto">
                                        <table className="table table-xs table-bordered">
                                            <thead>
                                                <tr>
                                                    <th>Application Image</th>
                                                    <th>Application Name</th>
                                                    <th>As</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {picSpecified.applications && picSpecified.applications.length > 0 ? (
                                                    picSpecified.applications.map((app, index) => (
                                                        <tr key={index}>
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
                                                            <td>{app.name}</td>
                                                            <td>{app.pic_type}</td>
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
                                    <button
                                        className="btn btn-success btn-sm mr-2"
                                        onClick={() => (deletePic(picSpecified.id), document.getElementById("my_modal_1").close())}
                                    >
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
                                        Yes
                                    </button>
                                    <button className="btn btn-error btn-sm" onClick={() => document.getElementById("my_modal_1").close()}>
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
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    </dialog>
                </section>
            ) : (
                <div className="flex items-center justify-center min-h-screen bg-base-100">
                    <span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span>
                    <span className="text-2xl animate-bounce font-bold text-primary">&nbsp;Loading</span>
                </div>
            )}
        </>
    );
}
