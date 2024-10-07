import { useEffect, useRef, useState } from "react";
import instance from "../../../axios";
import ApplicationCard from "../../components/applicationCard";
import { Footer } from "../../components/footer";

export function Dashboard() {
    const [totalApp, setTotalApp] = useState();
    const [totalUser, setTotalUser] = useState();
    const [applications, setApplications] = useState([]);
    const [loadPage, setLoadPage] = useState(false);
    const [openApp, setOpenApp] = useState(false);
    const [statusCounts, setStatusCounts] = useState({ Up: 0, Maintenance: 0, Down: 0 });
    const appSectionRef = useRef(null);

    const handleOpenApp = () => {
        setOpenApp(!openApp);
        if (!openApp) {
            setTimeout(() => {
                appSectionRef.current.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };

    // Fetch applications data
    const fetchData = async () => {
        try {
            const response = await instance.get("/applications");
            const data = response.data.data;
            setTotalApp(data.length);
            setApplications(data);

            const counts = data.reduce((acc, app) => {
                const status = app.status.toLowerCase();
                if (status === "up") {
                    acc.Up = (acc.Up || 0) + 1;
                } else if (status === "maintenance") {
                    acc.Maintenance = (acc.Maintenance || 0) + 1;
                } else if (status === "down") {
                    acc.Down = (acc.Down || 0) + 1;
                }
                return acc;
            }, { Up: 0, Maintenance: 0, Down: 0 });

            setStatusCounts(counts);
            setLoadPage(true);
        } catch (error) {
            console.error("Error fetching applications data:", error);
        }
    };

    // Fetch user data
    const fetchDataUser = async () => {
        try {
            const response = await instance.get("/users");
            const users = response.data.data;
            setTotalUser(users.length);

            // Retrieve the logged-in user ID from localStorage
            const loggedInUserId = localStorage.getItem('loggedInUserId');

            // Find the logged-in user based on the ID stored in localStorage
            const loggedInUser = users.find(user => user.id === loggedInUserId);

            if (loggedInUser) {
                console.log("Logged in user:", loggedInUser);
            } else {
                console.log("No logged in user found.");
            }

            const MFAStatus = localStorage.getItem('MFAStatus');

            if (MFAStatus === "0"){
                window.location.href = "/login";
                return;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    // Run useEffect when the component is mounted
    useEffect(() => {
        fetchData();
        fetchDataUser();

        // Log token from localStorage
        const token = localStorage.getItem('token');
        const mfaToken = localStorage.getItem('mfa_token');
        if (token) {
            console.log("Logged in token:", token);
        } else {
            console.log("No logged in token found.");
        }

        if (mfaToken) {
            console.log("MFA Token:", mfaToken);
        } else {
            console.log("No MFA Token found.");
            window.location.href = "/login";
                return;
        }
        
    }, []);

    const itemsPerPage = 15;
    const [currentPage, setCurrentPage] = useState(1);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = applications.slice(startIndex, endIndex);
    const totalPages = Math.ceil(applications.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <>
            {loadPage && (
                <div>
                    <div className="md:flex justify-between">
                        <div className="p-2 text-left">
                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-title font-bold">Up Applications</div>
                                    <div className="flex items-center">
                                        <div className="stat-value text-success flex items-center text-3xl mb-1">
                                            <div className="badge badge-success text-xs p-1 flex items-center font-normal w-8 h-8 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-8 h-8">
                                                    <path fillRule="evenodd" d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-2">{statusCounts.Up}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title font-bold">Maintenance Applications</div>
                                    <div className="flex items-center">
                                        <div className="stat-value text-warning flex items-center text-3xl mb-1">
                                            <div className="badge badge-warning text-xs p-1 flex items-center font-normal w-8 h-8 mt-1">
                                                <div className="badge badge-warning text-xs p-1 flex items-center font-normal">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="w-5 h-5">
                                                        <path d="M13.675 19.683c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.66 1.66 0 0 0-.324.114" />
                                                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0m13 10l-5-5m0 5l5-5" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="ml-2">{statusCounts.Maintenance}</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title font-bold">Down Applications</div>
                                    <div className="flex items-center">
                                        <div className="stat-value text-error flex items-center text-3xl mb-1">
                                            <div className="badge badge-error text-xs p-1 flex items-center font-normal w-8 h-8 mt-1">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-8 h-8">
                                                    <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" />
                                                </svg>
                                            </div>
                                            <div className="ml-2">{statusCounts.Down}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-2 text-right">
                            <div className="stats shadow">
                                <div className="stat">
                                    <div className="stat-title font-bold">Total Applications</div>
                                    <div className="flex items-center">
                                        <div className="stat-value text-primary text-3xl mb-1 ml-16">{totalApp}</div>
                                        <div className="stat-figure text-primary ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                                <path d="M19.5 6h-15v9h15V6z" />
                                                <path fillRule="evenodd" d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v11.25C1.5 17.16 2.34 18 3.375 18H9.75v1.5H6A.75.75 0 006 21h12a.75.75 0 000-1.5h-3.75V18h6.375c1.035 0 1.875-.84 1.875-1.875V4.875C22.5 3.839 21.66 3 20.625 3H3.375zm0 13.5h17.25a.375.375 0 00.375-.375V4.875a.375.375 0 00-.375-.375H3.375A.375.375 0 003 4.875v11.25c0 .207.168.375.375.375z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div className="stat">
                                    <div className="stat-title font-bold">Total Users</div>
                                    <div className="flex items-center">
                                        <div className="stat-value text-info text-3xl mb-1 ml-6">{totalUser}</div>
                                        <div className="stat-figure text-info ml-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                                            <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 117.5 0 3.75 3.75 0 01-7.5 0zM15.75 9.75a3 3 0 116 0 3 3 0 01-6 0zM2.25 9.75a3 3 0 116 0 3 3 0 01-6 0zM6.31 15.117A6.745 6.745 0 0112 12a6.745 6.745 0 016.709 7.498.75.75 0 01-.372.568A12.696 12.696 0 0112 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 01-.372-.568 6.787 6.787 0 011.019-4.38z" clipRule="evenodd" />
                                            <path d="M5.082 14.254a8.287 8.287 0 00-1.308 5.135 9.687 9.687 0 01-1.764-.44l-.115-.04a.563.563 0 01-.373-.487l-.01-.121a3.75 3.75 0 013.57-4.047zM20.226 19.389a8.287 8.287 0 00-1.308-5.135 3.75 3.75 0 013.57 4.047l-.01.121a.563.563 0 01-.373.486l-.115.04c-.567.2-1.156.349-1.764.441z" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <section>
                        <div className="hero min-h-[480px] mb-8">
                            <div className="hero-content flex-col lg:flex-row-reverse">
                                <img src="/img/hero.png" className="max-w-sm md:max-w-lg" />
                                <div>
                                    <h1 className="text-4xl font-bold py-2">Dashboard Monitoring Tools Office</h1>
                                    {openApp ? 
                                        <button className="btn btn-secondary" onClick={handleOpenApp}>Hide All Applications</button> : 
                                        <button className="btn btn-primary" onClick={handleOpenApp}>See All Application</button>}
                                    
                                    <div className="md:flex mt-16 hidden">
                                        <div className="max-w-screen-xl mx-auto">
                                            <div className="grid gap-2 md:grid-cols-10">
                                                {['product01.png', 'product02.png', 'product03.png', 'product04.png', 'product05.png', 'product06.png', 'product07.png', 'product08.png', 'product09.png', 'product10.png'].map(
                                                    (el) => (
                                                        <img src={"/img/" + el} key={el} className="w-full hover:p-1" />
                                                    ))
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <br />
                            </div>
                        </div>
                    </section>
                    <div className={openApp ? "w-full bg-base-100" : "hidden"} ref={appSectionRef}>
                        {currentData.length > 0 ?
                        <section className="px-4 py-8 my-2 bg-gray-200" id="catalog">
                            <div className="container mx-auto">
                                <h1 className="text-3xl font-bold text-center">
                                    All Applications
                                </h1>
                                <h3 className="text-lg text-center">
                                    Our Application was managed by Sinergi Informatika Semen Indonesia
                                </h3>
                                <div>
                                    {/* Render your data here using the currentData array */}
                                    <div className="my-8 grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-5 ">
                                        {currentData.map((applications, index) => (
                                            <ApplicationCard
                                            id={applications.id}
                                            name={applications.short_name}
                                            img={applications.image}
                                            key={index}
                                            status={applications.status}
                                            platform={applications.platform}
                                            category={applications.category}
                                            group_area={applications.group_area.short_name}
                                            rating={applications.total_rating.toFixed(1)}
                                            />
                                        ))}
                                    </div>
                                    {applications.length > 15 && (
                                        <div className='mt-8 text-right'>
                                            <div className="join px-2">
                                                <button className="join-item btn btn-primary btn-sm px-1 rounded-none" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                                                    </svg>
                                                </button>
                                                <p className="join-item btn btn-base-100 btn-sm">{`${currentPage} of ${totalPages}`}</p>
                                                <button className="join-item btn btn-primary btn-sm px-1 rounded-none" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </section> : <></>}
                    </div>
                </div>
            )}    
        </>
    );
}