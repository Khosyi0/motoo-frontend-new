import { useEffect, useState } from "react";
import instance from "../../../axios";
import { Link, useNavigate } from "react-router-dom";

export function Company() {
    const [company, setCompany] = useState([]);
    const [companySpecified, setCompanySpecified] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDetailTerm, setSearchDetailTerm] = useState("");

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const [load, setLoad] = useState(true);

    const handleOpen = async (el) => {
        setOpen(open === true ? false : true);
        setId(el);
        console.log(el, id);
        await instance.get(`/companies/${el}`).then((response) => {
            setCompanySpecified(response.data.data);
            console.log(response.data.data);
        });
    };

    const fetchDataCompany = async () => {
        await instance.get("/companies").then((response) => {
            setCompany(response.data.data);
            console.log(company);
            setLoad(false);
        });
    };

    const deleteCompany = async (id) => {
        await instance.delete(`/companies/${id}`).then((response) => {
            setCompany(
                company.filter((company) => {
                    return company.id !== id;
                })
            );
        });
    };

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentData = company.slice(startIndex, endIndex);

    const totalPages = Math.ceil(company.length / itemsPerPage);

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
        fetchDataCompany();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSearchDetailChange = (e) => {
        setSearchDetailTerm(e.target.value);
    };

    const filteredCompanies = company.filter((cmp) => {
        const { short_name, long_name, applications } = cmp;
        const appMatch = applications.some((app) =>
            app.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        return (
            short_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            long_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            appMatch
        );
    });

    const filteredApplications = companySpecified.applications
        ? companySpecified.applications.filter((app) =>
            app.name.toLowerCase().includes(searchDetailTerm.toLowerCase())
        )
        : [];

    return (
        <>
            {loadPage ? (
                <section className="flex gap-4">
                    <div className={open ? "w-full lg:w-9/12" : "w-full"}>
                        <div className="p-2">
                            <h1 className="font-bold text-xl p-2">Company Table</h1>
                            <input
                                type="text"
                                placeholder="Search Companies or Applications"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="input input-bordered w-full mb-4"
                            />
                            {load === true ? (
                                <div className="flex items-center p-2">
                                    <span className="loading loading-infinity loading-md"></span>
                                    &emsp;Loading data
                                </div>
                            ) : (
                                <>
                                {seeButton &&(
                                    <>
                                    <div className="flex justify-between p-2">
                                        <Link to="add">
                                            <button className="btn btn-success btn-sm">
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
                                                        d="M12 4.5v15m7.5-7.5h-15"
                                                    />
                                                </svg>
                                                Add
                                            </button>
                                        </Link>
                                    </div>
                                    </>
                                    )
                                }
                                    <table className="w-full table-x table">
                                        <thead>
                                            <tr>
                                                {["logo", "short_name", "long_name", "application"].map((el) => (
                                                    <td
                                                        key={el}
                                                        className="text-left font-semibold capitalize text-sm border-b border-neutral py-2"
                                                    >
                                                        {el}
                                                    </td>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredCompanies.slice(startIndex, endIndex).map((company, index) => (
                                                <tr
                                                    key={index}
                                                    onClick={() => handleOpen(company.id)}
                                                    className="hover:bg-gray-300 border-b border-gray-400 text-wrap;"
                                                >
                                                    <td>
                                                        {company.logo ? (
                                                            <img
                                                                src={company.logo}
                                                                className="w-16 h-16 object-cover"
                                                            />
                                                        ) : (
                                                            'N/A'
                                                        )}
                                                    </td>
                                                    <td>{company.short_name}</td>
                                                    <td>{company.long_name}</td>
                                                    <td className="flex flex-wrap items-center">
                                                    {company.applications.slice(0, 9).map((app) => (
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
                                                    {company.applications.length > 5 && (
                                                        <button
                                                            onClick={() => handleOpen(company.id)}
                                                            className="m-1 p-2 border rounded bg-gray-200"
                                                        >
                                                            +{company.applications.length - 7}
                                                        </button>
                                                    )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>

                                    <div className="flex items-center justify-between my-4">
                                        <p>Total data {filteredCompanies.length ? filteredCompanies.length : 0} entries</p>
                                        {filteredCompanies.length > 10 && (
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
                            {companySpecified.id === id && (
                                <div className="flex gap-1">
                                    <Link to={`edit/${companySpecified.id}`}>
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
                                                [companySpecified.short_name, "short_name"],
                                                [companySpecified.long_name, "long_name"],
                                                [companySpecified.logo, "logo"],
                                            ].map((el, index) => el[0] && (
                                                <tr key={index}>
                                                    <td className="font-bold text-sm capitalize">{el[1]}</td>
                                                    <td>
                                                        {el[1] === "logo" ? (
                                                            <img
                                                                src={el[0]}
                                                                className="w-16 h-16 object-cover"
                                                                alt="Company Logo"
                                                            />
                                                        ) : (
                                                            el[0]
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold" aria-label="Connected Apps" />
                            <div role="tabpanel" className="tab-content bg-base-100">
                                <div className="py-4">
                                    {/* <input
                                        type="text"
                                        placeholder="Search Applications"
                                        value={searchDetailTerm}
                                        onChange={handleSearchDetailChange}
                                        className="input input-bordered w-full mb-4"
                                    /> */}
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
                                    <button
                                        className="btn btn-success btn-sm mr-2"
                                        onClick={() => (deleteCompany(companySpecified.id), document.getElementById("my_modal_1").close())}
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
