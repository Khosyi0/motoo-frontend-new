import { useEffect, useState } from "react";
import { Footer } from "../../components/footer";
import instance from "../../../axios";
import ApplicationCard from "../../components/applicationCard";
import { Link } from "react-router-dom";
import { FilterPanel } from "../../components/filterPanel";

export default function LandingPage() {
    const [currentData, setCurrentData] = useState([]);
    const [applications, setApplications] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [isFiltered, setIsFiltered] = useState(false);
    const [delayTimeout, setDelayTimeout] = useState(null);
    const [platformFilter, setPlatformFilter] = useState('All');
    const [companiesFilter, setCompaniesFilter] = useState([]);
    const [categoriesFilter, setCategoriesFilter] = useState([]);
    const [statusFilter, setStatusFilter] = useState([]);
    const [ratingsFilter, setRatingsFilter] = useState([]);
    const [totalApp, setTotalApp] = useState();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPage, setSelectedPage] = useState(currentPage);
    const [statusCounts, setStatusCounts] = useState({ Up: 0, Maintenance: 0, Down: 0 });

    const itemsPerPage = 8;
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/login";
        return;
    }

    const fetchDataApplications = async () => {
        await instance.get("/applications").then((response) => {
            const data = response.data.data;
            setApplications(data);
            setTotalApp(data.length);
            setTotalPages(Math.ceil(data.length / itemsPerPage));
            setCurrentData(data.slice(0, itemsPerPage));
        });
    };

    useEffect(() => {
        fetchDataApplications();

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

    useEffect(() => {
        if (searchTerm === '') {
            setTotalPages(Math.ceil(applications.length / itemsPerPage));
        }
    }, [searchTerm, applications]);

    useEffect(() => {
        if (delayTimeout) {
            clearTimeout(delayTimeout);
        }

        const newTimeout = setTimeout(() => {
            let filteredApplications = applications.filter(application => {
                const normalizePlatform = (platform) => {
                    const normalizationMap = { 'dekstop': 'desktop' };
                    return normalizationMap[platform.toLowerCase()] || platform.toLowerCase();
                };

                const byPlatform = platformFilter === 'All' || normalizePlatform(application.platform) === platformFilter.toLowerCase();
                const byCompany = companiesFilter.length === 0 || companiesFilter.some(filter => Array.isArray(application.company) && application.company.some(company => company.short_name.toLowerCase() === filter.toLowerCase()));
                const byCategory = categoriesFilter.length === 0 || categoriesFilter.some(filter => filter.toLowerCase() === application.category.toLowerCase());
                const byStatus = statusFilter.length === 0 || statusFilter.some(filter => filter.toLowerCase() === application.status.toLowerCase());
                const roundedRating = Math.round(application.total_rating);
                const byRatings = ratingsFilter.length === 0 || ratingsFilter.includes(roundedRating);

                return byPlatform && byCompany && byCategory && byStatus && byRatings;
            });

            if (searchTerm) {
                filteredApplications = filteredApplications.filter(application => application.short_name.toLowerCase().includes(searchTerm.toLowerCase()));
            }

            setCurrentData(filteredApplications.slice(0, itemsPerPage));
            setTotalApp(filteredApplications.length);
            setTotalPages(Math.ceil(filteredApplications.length / itemsPerPage));
            setIsFiltered(true);
        }, 500);

        setDelayTimeout(newTimeout);

        return () => {
            clearTimeout(newTimeout);
        };
    }, [searchTerm, platformFilter, companiesFilter, categoriesFilter, statusFilter, ratingsFilter, applications]);

    useEffect(() => {
        const isOnlyPlatformFilterAll = platformFilter === 'All' &&
            companiesFilter.length === 0 &&
            categoriesFilter.length === 0 &&
            statusFilter.length === 0 &&
            ratingsFilter.length === 0;

        const counts = applications.reduce((acc, app) => {
            const status = app.status.toLowerCase();
            if (status === 'up') {
                acc.Up = (acc.Up || 0) + 1;
            } else if (status === 'maintenance') {
                acc.Maintenance = (acc.Maintenance || 0) + 1;
            } else if (status === 'down') {
                acc.Down = (acc.Down || 0) + 1;
            }
            return acc;
        }, { Up: 0, Maintenance: 0, Down: 0 });

        if (isOnlyPlatformFilterAll) {
            setStatusCounts(counts);
        } else {
            const filteredCounts = currentData.reduce((acc, app) => {
                const status = app.status.toLowerCase();
                if (status === 'up') {
                    acc.Up = (acc.Up || 0) + 1;
                } else if (status === 'maintenance') {
                    acc.Maintenance = (acc.Maintenance || 0) + 1;
                } else if (status === 'down') {
                    acc.Down = (acc.Down || 0) + 1;
                }
                return acc;
            }, { Up: 0, Maintenance: 0, Down: 0 });

            setStatusCounts(filteredCounts);
        }
    }, [currentData, applications]);

    const handleSearch = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        setCurrentPage(1);
        setIsFiltered(true);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        const startIndex = (newPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
    
        let dataToSlice = isFiltered
            ? applications.filter(application => application.short_name.toLowerCase().includes(searchTerm.toLowerCase()))
            : applications;
    
        const slicedData = dataToSlice.slice(startIndex, endIndex);
        setCurrentData(slicedData);
    };    

    const handleModalOpen = () => {
        setSelectedPage(currentPage);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
    };

    const handleModalPageChange = () => {
        handlePageChange(selectedPage);
        setIsModalOpen(false);
    };

    const isOnlyPlatformFilterAll = platformFilter === 'All' &&
        companiesFilter.length === 0 &&
        categoriesFilter.length === 0 &&
        statusFilter.length === 0 &&
        ratingsFilter.length === 0;

    const totalApplicationsLabel = isOnlyPlatformFilterAll ? "Total Applications" : "Total Filtered Applications";

    return (
        <>
            <div className="p-4 mx-auto bg-gray-100" id="catalog">
                <div className="md:flex justify-between">
                    <div className="p-2">
                        <span className="text-3xl font-bold">All Applications</span>
                        <span className="text-lg">
                            <br />Our Application was managed by Sinergi Informatika Semen Indonesia</span>
                    </div>
                    <div className="flex items-center">
                        <div className="text-right">
                            <div className="font-bold">{totalApplicationsLabel}</div>
                            <div className="text-primary text-3xl">{totalApp}</div>
                        </div>
                        <div className="stat-figure text-primary ml-4">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8">
                            <path d="M19.5 6h-15v9h15V6z" />
                            <path fillRule="evenodd" d="M3.375 3C2.339 3 1.5 3.84 1.5 4.875v11.25C1.5 17.16 2.34 18 3.375 18H9.75v1.5H6A.75.75 0 006 21h12a.75.75 0 000-1.5h-3.75V18h6.375c1.035 0 1.875-.84 1.875-1.875V4.875C22.5 3.839 21.66 3 20.625 3H3.375zm0 13.5h17.25a.375.375 0 00.375-.375V4.875a.375.375 0 00-.375-.375H3.375A.375.375 0 003 4.875v11.25c0 .207.168.375.375.375z" clipRule="evenodd" />
                            </svg>
                        </div>
                        
                    </div>
                </div>
                <div className="md:flex justify-end mb-2">
                    <div className="flex">
                        <div className="flex ml-4">
                            <div className="stat-value text-success flex items-center text-sm">
                                <div className="mr-2">{statusCounts.Up}</div>
                                <div className="badge badge-success text-xs p-1 flex items-center font-normal">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1">
                                        <path fillRule="evenodd" d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z" clipRule="evenodd" />
                                    </svg>
                                    UP
                                </div>
                            </div>
                        </div>
                        <div className="flex ml-4">
                            <div className="stat-value text-warning flex items-center text-sm">
                                <div className="mr-2">{statusCounts.Maintenance}</div>
                                <div className="badge badge-warning text-xs p-1 flex items-center font-normal">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" className="w-4 h-4 mr-1">
                                        <path d="M13.675 19.683c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37c1 .608 2.296.07 2.572-1.065c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.66 1.66 0 0 0-.324.114" />
                                        <path d="M9 12a3 3 0 1 0 6 0a3 3 0 0 0-6 0m13 10l-5-5m0 5l5-5" />
                                    </svg>
                                    MAINTENANCE
                                </div>
                            </div>
                        </div>
                        <div className="flex ml-4">
                            <div className="stat-value text-error flex items-center text-sm">
                                <div className="mr-2">{statusCounts.Down}</div>
                                <div className="badge badge-error text-xs p-1 flex items-center font-normal">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 mr-1">
                                        <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" />
                                    </svg>
                                    DOWN
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex">
                    <div className="hidden md:block md:w-4/12 lg:w-2/12 p-2">
                        <div className="sidepanel">
                            <div className="px-2 mb-4 ">
                                <div className="join border-1 border-gray-300 rounded-lg overflow-hidden focus-within:border-red-500 ">
                                    <div>
                                        <div>
                                            <input className="input input-bordered w-full max-w-xs join-item input-primary" placeholder="Search" name="searchBox" value={searchTerm} onChange={handleSearch} />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary join-item"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                    </button>
                                </div>
                            </div>
                            <div>
                                <FilterPanel
                                    platformFilter={platformFilter}
                                    companiesFilter={companiesFilter}
                                    categoriesFilter={categoriesFilter}
                                    statusFilter={statusFilter}
                                    ratingsFilter={ratingsFilter}
                                    setPlatformFilter={setPlatformFilter}
                                    setCompaniesFilter={setCompaniesFilter}
                                    setCategoriesFilter={setCategoriesFilter}
                                    setStatusFilter={setStatusFilter}
                                    setRatingsFilter={setRatingsFilter}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="w-full md:w-8/12 lg:w-10/12 p-2">
                        <div>
                            <div className="md:hidden mb-4 ">
                                <div className="join border-1 border-gray-300 rounded-lg overflow-hidden focus-within:border-red-500 ">
                                    <div>
                                        <div>
                                            <input className="input input-bordered w-full max-w-xs join-item input-primary" placeholder="Search" name="searchBox" value={searchTerm} onChange={handleSearch} />
                                        </div>
                                    </div>
                                    <button className="btn btn-primary join-item"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                    </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                            {currentData.map((applications, index) => (
                                <ApplicationCard 
                                    id={applications.id}
                                    name={applications.short_name}
                                    img={applications.image}
                                    key={index}
                                    status={applications.status}
                                    platform={applications.platform}
                                    company={applications.company}
                                    category={applications.category}
                                    group_area={applications.group_area.short_name}
                                    rating={applications.total_rating.toFixed(1)}
                                />
                            ))}
                        </div>
                        {applications.length > 8 && (
                            <div className='mt-8 text-right'>
                                <div className="join px-2">
                                    <button className="join-item btn btn-primary btn-sm px-1 rounded-none" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                                    </svg>
                                    </button>
                                    <button className="join-item btn btn-base-100 btn-sm " onClick={handleModalOpen}>{`${currentPage} of ${totalPages}`}</button>
                                    <button className="join-item btn btn-primary btn-sm px-1 rounded-none" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                    </svg>
                                    </button>
                                </div>
                            </div>
                        )}
                        {isModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                                <div className="bg-white p-4 rounded-lg shadow-lg w-1/3">
                                    <h2 className="text-xl font-semibold mb-4">Select Page</h2>
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={selectedPage}
                                        onChange={(e) => setSelectedPage(Number(e.target.value))}
                                        className="input input-bordered w-full mb-4"
                                    />
                                    <div className="flex justify-end">
                                        <button className="btn btn-secondary mr-2" onClick={handleModalClose}>Cancel</button>
                                        <button className="btn btn-primary" onClick={handleModalPageChange}>Go</button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}