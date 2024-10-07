import { useEffect, useState } from "react";
import instance from "../../../axios";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function Users() {
    const [user, setUser] = useState([]);
    const [userSpecified, setUserSpecified] = useState({});
    const [load, setLoad] = useState(true);

    const fetchDataUser = async () => {
        await instance.get("/users").then((response) => {
            setUser(response.data.data);
            setLoad(false);
        });
    };

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);

    const handleOpen = async (el) => {
        setOpen(!open);
        setId(el);
        await instance.get(`/users/${el}`).then((response) => {
            setUserSpecified(response.data.data);
        });
    };

    const [showToastError, setShowToastError] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [showToastSuccess, setShowToastSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const deleteUser = async (id) => {
        await instance.delete(`/users/${id}`).then((response) => {
            setUser(user.filter((user) => user.id !== id)); 
            let successMessage = "This user has been successfully deleted";
            setSuccessMessage(successMessage);
            setShowToastSuccess(true);

            setTimeout(() => {
                setShowToastSuccess(false);
            }, 3000); // 3 detik
        });
    };

    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = user.slice(startIndex, endIndex);
    const totalPages = Math.ceil(user.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const [searchTerm, setSearchTerm] = useState("");

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
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

    const location = useLocation();

    useEffect(() => {
        if (location.state && location.state.successMessage) {
            setSuccessMessage(location.state.successMessage);
            setTimeout(() => {
                setShowToastSuccess(true);
            }, 1000)

            // Hide toast after a few seconds
            setTimeout(() => {
                setShowToastSuccess(false);
            }, 3000); // 3 seconds
        }
    }, [location.state]);

    const filteredUser = user.filter((user) => {
        const  {name, role, company, team, status} = user;
        //console.log(user);
    
        return (
        (name && name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (role && role.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (company && company.some(comp => comp.short_name.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (team && team.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (status && status.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    });
    
    useEffect(() => {
        fetchData();
        fetchDataUser();
    }, []);

    const disable2FA = async (id) => {
        try {
            await instance.post(`/disable-2fa/${id}`);
            setUser(user.map(u => u.id === id ? { ...u, is_2fa_enabled: 0 } : u));
            let successMessage = "This user's 2FA has been successfully disabled";
            setSuccessMessage(successMessage);
            setShowToastSuccess(true);

            setTimeout(() => {
                setShowToastSuccess(false);
            }, 3000); // 3 detik
            
        } catch (error) {
            console.error('Error disabling 2FA:', error);
            let errorMessage = "Error disabling 2FA";
            setErrorMessage(errorMessage);
            setShowToastError(true);

            setTimeout(() => {
                setShowToastError(false);
            }, 3000); // 3 detik
        }
    };
    
    return (
        <>
            {loadPage ? (
                <section className="flex gap-4">
                    <div className={open ? "w-full lg:w-9/12" : "w-full"}>
                        <div className="p-2">
                            <h1 className="font-bold text-xl p-2">Users Table</h1>
                            {load ? (
                                <div className="flex items-center p-2">
                                    <span className="loading loading-infinity loading-md"></span>
                                    &emsp;Loading data
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between p-2">
                                    {seeButton &&(
                                    <>
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
                                                onChange={handleSearch}
                                                name="searchBox"
                                                className="input input-bordered pl-8 w-full"
                                            />
                                        </label>
                                    </div>
                                    <table className="w-full table-auto my-4 table-xs">
                                        <thead>
                                            <tr>
                                                {["name", "role", "company", "team","email", "phone", "status"].map((el) => (
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
                                        {filteredUser.slice(startIndex, endIndex).map((user, index) => (
                                                <tr
                                                    key={index}
                                                    onClick={() => handleOpen(user.id)}
                                                    className="hover:bg-gray-300 hover:shadow-lg"
                                                >
                                                    <td className="px-4 align-middle">
                                                        <div className="flex items-center gap-4">
                                                            {user.photo ? (
                                                                <img
                                                                    src={"http://127.0.0.1:8000" + user.photo}
                                                                    alt={user.name}
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
                                                                <p className="font-semibold">{user.name}</p>
                                                                <p className="italic hidden md:flex">{user.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        {user.role === "admin" && (
                                                            <div className="badge badge-error w-24 h-6 p-2 text-xs">
                                                                {user.role}
                                                            </div>
                                                        )}
                                                        {user.role === "client" && (
                                                            <div className="badge badge-info w-24 h-6 p-2 text-xs">
                                                                {user.role}
                                                            </div>
                                                        )}
                                                        {user.role === "teknisi" && (
                                                            <div className="badge badge-warning w-24 h-6 p-2 text-xs">
                                                                {user.role}
                                                            </div>
                                                        )}
                                                        {user.role === "reporter" && (
                                                            <div className="badge badge-success w-24 h-6 p-2 text-xs">
                                                                {user.role}
                                                            </div>
                                                        )}
                                                    </td>
                                                    <td>
                                                        {user.company?.map((comp, idx) => (
                                                            <span key={idx}>{comp.short_name}{idx < user.company.length - 1 ? ', ' : ''}</span>
                                                        )) || 'Company not available'}
                                                    </td>
                                                    <td>{user.team}</td>
                                                    <td>{user.email}</td>
                                                    <td>{user.phone}</td>
                                                    <td>
                                                        {user.status === "active" && (
                                                            <div className="badge badge-success w-24 h-6 p-2 text-xs">
                                                                {user.status}
                                                            </div>
                                                        )}
                                                        {user.status === "inactive" && (
                                                            <div className="badge badge-error w-24 h-6 p-2 text-xs">
                                                                {user.status}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="flex items-center justify-between my-4">
                                        <p>Total data {user.length ? user.length : 0} entries</p>
                                        {user.length > 10 && (
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
                    <div className={open ? "hidden md:block lg:w-4/12 shadow-xl px-2 py-4 min-h-screen bg-gray-200" : "hidden"}>
                        <div className="flex justify-between p-2 bg-gray-200">
                            <span className="text-2xl font-bold">Detail</span>
                            {seeButton &&(
                                    <>
                            {userSpecified.id === id && (
                                <div className="flex gap-1">
                                        <button
                                            className="btn btn-info btn-sm p-1"
                                            onClick={() => disable2FA(userSpecified.id)}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="w-5"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M19.89 10.105a8.696 8.696 0 0 0-.789-1.456l-1.658 1.119a6.606 6.606 0 0 1 .987 2.345a6.659 6.659 0 0 1 0 2.648a6.495 6.495 0 0 1-.384 1.231a6.404 6.404 0 0 1-.603 1.112a6.654 6.654 0 0 1-1.776 1.775a6.606 6.606 0 0 1-2.343.987a6.734 6.734 0 0 1-2.646 0a6.55 6.55 0 0 1-3.317-1.788a6.605 6.605 0 0 1-1.408-2.088a6.613 6.613 0 0 1-.382-1.23a6.627 6.627 0 0 1 .382-3.877A6.551 6.551 0 0 1 7.36 8.797A6.628 6.628 0 0 1 9.446 7.39c.395-.167.81-.296 1.23-.382c.107-.022.216-.032.324-.049V10l5-4l-5-4v2.938a8.805 8.805 0 0 0-.725.111a8.512 8.512 0 0 0-3.063 1.29A8.566 8.566 0 0 0 4.11 16.77a8.535 8.535 0 0 0 1.835 2.724a8.614 8.614 0 0 0 2.721 1.833a8.55 8.55 0 0 0 5.061.499a8.576 8.576 0 0 0 6.162-5.056c.22-.52.389-1.061.5-1.608a8.643 8.643 0 0 0 0-3.45a8.684 8.684 0 0 0-.499-1.607"
                                                />
                                            </svg>
                                            Reset MFA
                                        </button>

                                    <Link to={`edit/${userSpecified.id}`}>
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
                                    {userSpecified.photo ? (
                                        <img
                                            src={"http://127.0.0.1:8000" + userSpecified.photo}
                                            alt={userSpecified.name}
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
                                                [userSpecified.name, "name"],
                                                [userSpecified.email, "email"],
                                                [userSpecified.role, "role"],
                                                [userSpecified.job, "job"],
                                                [userSpecified.phone, "phone"],
                                            ].map(
                                                (el) =>
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
                                            )}
                                        </tbody>
                                    </table>
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
                                        onClick={() => (deleteUser(userSpecified.id), document.getElementById("my_modal_1").close())}
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
                    <span className="text-2xl font-bold text-primary animate-bounce">&nbsp;Loading</span>
                </div>
            )}
            {showToastSuccess && (
                <div className="toast">
                    <div className="alert alert-success">
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}
            {showToastError && (
                <div className="toast">
                    <div className="alert alert-error">
                        <span>{errorMessage}</span>
                    </div>
                </div>
            )}
        </>
    );
}
