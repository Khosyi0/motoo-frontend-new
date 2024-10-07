import { useEffect, useState, useCallback } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import instance from "../../../axios";
import UploadDataComponent from '../../components/uploadDataComponent';
import axios from "axios";
import * as XLSX from 'xlsx';
import { components } from "react-select";

export function Applications() {
    const [applications, setApplications] = useState([]);
    const [virtualMachine, setVirtualMachine] = useState([]);
    const [topology, setTopology] = useState([]);
    const [technology, setTechnology] = useState([]);
    const [picOld, setPicOld] = useState([]);
    const [picIct, setPicIct] = useState([]);
    const [picUser, setPicUser] = useState([]);
    const [picBackup, setPicBackup] = useState([]);
    const [picFirst, setPicFirst] = useState([]);
    const [applicationSpecified, setApplicationSpecified] = useState([]);

    const [currentData, setCurrentData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const itemsPerPage = 10; // Number of items to display per page

    const [open, setOpen] = useState(false);
    const [id, setId] = useState(0);
    const [load, setLoad] = useState(true);
    const [platform, setPlatform] = useState('all');
    const [category, setCategory] = useState('all');
    const [group, setGroup] = useState('all');
    const [groupArea, setGroupArea] = useState('all');
    const [productBy, setProductBy] = useState('all');
    const [status, setStatus]= useState('all');
    const [userCompany, setUserCompany] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [seeButtonAdmin, setSeeButtonAdmin] = useState(null);
    const [seeButtonTech, setSeeButtonTech] = useState(null);

    const [showToastSuccess, setShowToastSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    const handleOpen = async (el) => {
        setOpen(open === true ? false : true);
        setId(el);
        await instance.get(`/applications/${el}`).then((response) => {
            const data = response.data.data;
            setApplicationSpecified(data || []);
            setVirtualMachine(data.virtual_machines || []);
            setTopology(data.topology || []);
            setTechnology(data.technology || []);
            setPicFirst(data.first_pics || []);
            setPicBackup(data.backup_pics || []);
            setPicIct(data.pic_icts || []);
            setPicUser(data.pic_users || []);
            setPicOld(data.old_pics || []);

            console.log(applicationSpecified);

            const userCompaniesArray = userCompany ? userCompany.split(',').map(comp => comp.trim()) : [];
    
            if (data.company && Array.isArray(data.company)) {
                const companyShortNames = data.company.map(comp => comp.short_name);

                const hasAccess = userCompaniesArray.some(userComp => companyShortNames.includes(userComp));
                
                if (userRole === "teknisi"){
                // Cek apakah userCompany ada dalam companyShortNames
                if (hasAccess) {
                    setSeeButtonTech(true);
                } else {
                    setSeeButtonTech(false);
                }}
            }
        });
    };
    
    //define method 
    
    const fetchDataApplications = async (page = 1, limit = itemsPerPage) => {
        await instance.get(`/applications?page=${page}&limit=${limit}`).then((response) => {
            setApplications(response.data.data);
            setLoad(false);
        });
    };

    const deleteApplication = async (id) => {
        await instance.delete(`/applications/${id}`).then((response) => {
            setApplications(
                applications.filter((applications) => {
                    return applications.id !== id;
                })
            )
            let successMessage = "The application has been successfully deleted";
            setSuccessMessage(successMessage);
            setShowToastSuccess(true);

            setTimeout(() => {
                setShowToastSuccess(false);
            }, 3000); // 3 detik
        });
    };

    const debounce = (func, wait) => {
        let timeout;

        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const debounced = useCallback(
        debounce((value, setterFunction) => {
            setterFunction(value);
        }, 300),
        [] // Dependencies array can be empty because debounce creates a stable function
    );

    const handlePlatformChange = (e) => {
        debounced(e.target.value, setPlatform);
    };
    const handleCategoryChange = (e) => {
        debounced(e.target.value, setCategory);
    };
    const handleGroupAreaChange = (e) => {
        debounced(e.target.value, setGroupArea);
    };    
    const handleCompanyChange = (e) => {
        debounced(e.target.value, setProductBy);
    };  
    const handleStatusChange = (e) => {
        debounced(e.target.value, setStatus);
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    }; 

    useEffect(() => {
        const applyFilters = () => {
            // Filter data based on dropdowns and searchTerm, if they are used
            const filtered = applications.filter(application => {
                // Ensure all comparisons are case-insensitive and handle 'all' cases
                const byPlatform = platform === 'all' || application.platform.toLowerCase() === platform.toLowerCase();
                const byCategory = category === 'all' || application.category.toLowerCase() === category.toLowerCase();
                const byGroupArea = groupArea === 'all' || application.group_area.short_name.toLowerCase() === groupArea.toLowerCase();
                const byCompany = productBy === 'all' || application.company.some(comp => comp.short_name.toLowerCase() === productBy.toLowerCase());
                const byStatus = status === 'all' || application.status.toLowerCase() === status.toLowerCase();
                const byShortName = application.short_name.toLowerCase().includes(searchTerm.toLowerCase());
                const byLongName = application.long_name.toLowerCase().includes(searchTerm.toLowerCase());
    
                // Return true if all conditions are met
                return byPlatform && byCategory && byGroupArea && byCompany && byStatus && (byShortName || byLongName);
            });
    
            // Update totalPages based on filtered or initial data
            setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    
            // Apply pagination
            const startIndex = (currentPage - 1) * itemsPerPage;
            const endIndex = startIndex + itemsPerPage;
            setCurrentData(filtered.slice(startIndex, endIndex));
        };
    
        applyFilters();
    }, [currentPage, applications, platform, category, group, groupArea, productBy, status, searchTerm, itemsPerPage]);
    
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

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        setLoadPage(true)
    };
    
    const handleExportData = () => {
        const flattenApplications = applications.map(app => ({
            id: app.id,
            ad_connection_path: app.ad_connection_path || '',
            backup_pics: app.backup_pics.length ? app.backup_pics.map(pic => pic.name).join(', ') : '',
            business_process: app.business_process || '',
            category: app.category || '',
            company: app.company ? app.company.map(comp => comp.short_name).join(', ') : '',
            created_at: app.created_at || '',
            db_connection_path: app.db_connection_path || '',
            description: app.description || '',
            environment: app.environment || '',
            first_pics: app.first_pics.length ? app.first_pics.map(pic => pic.name).join(', ') : '',
            group_area: app.group_area ? app.group_area.id : '',
            image: app.image || '',
            information: app.information || '',
            long_name: app.long_name || '',
            old_pics: app.old_pics.length ? app.old_pics.map(pic => pic.name).join(', ') : '',
            other_doc: app.other_doc || '',
            pic_icts: app.pic_icts.length ? app.pic_icts.map(pic => pic.name).join(', ') : '',
            pic_users: app.pic_users.length ? app.pic_users.map(pic => pic.name).join(', ') : '',
            platform: app.platform || '',
            reviews: app.reviews.length ? app.reviews.map(review => review.id).join(', ') : '',
            sap_connection_path: app.sap_connection_path || '',
            short_name: app.short_name || '',
            slug: app.slug || '',
            status: app.status || '',
            technical_doc: app.technical_doc || '',
            technology: app.technology.length ? app.technology.map(techno => techno.id).join(', ') : '',
            tier: app.tier || '',
            topology: app.topology.length ? app.topology.map(topo => topo.id).join(', ') : '',
            total_rating: app.total_rating || '',
            total_review: app.total_review || '',
            updated_at: app.updated_at || '',
            url_dev: app.url_dev || '',
            url_prod: app.url_prod || '',
            user_doc: app.user_doc || '',
            user_login: app.user_login || '',
            virtual_machines: app.virtual_machines.length ? app.virtual_machines.map(vm => vm.id).join(', ') : '',
            vm_dev: app.vm_dev || '',
            vm_prod: app.vm_prod || ''
        }));

        console.log(applications);
    
        var wb = XLSX.utils.book_new();
        var ws = XLSX.utils.json_to_sheet(flattenApplications);
    
        XLSX.utils.book_append_sheet(wb, ws, "MySheet1");
    
        XLSX.writeFile(wb, "DataAplikasi.xlsx");
    };
    

    const handleExportDataSpecified = () => {
        // Ensure applicationSpecified is an array and not empty
        if (!Array.isArray(applicationSpecified) || applicationSpecified.length === 0) {
            console.error('applicationSpecified is not valid.');
            return;
        }
    
        // Define the data you want to export
        const data = applicationSpecified;
    
        // Create a new workbook
        const wb = XLSX.utils.book_new();
    
        // Convert the data to a worksheet
        const ws = XLSX.utils.json_to_sheet(data);
    
        // Add the worksheet to the workbook
        XLSX.utils.book_append_sheet(wb, ws, 'Application Data');
    
        // Save the workbook as an Excel file
        XLSX.writeFile(wb, 'application_data.xlsx');
    };

    const navigate = useNavigate();
    const [loadPage, setLoadPage] = useState(false)

    const fetchData = async () => {
        //fetch user from API
        await instance.get('/user')
            .then((response) => {
                const userRole = response.data.role;
                const company = response.data.company;
                setUserCompany(company);
                setUserRole(userRole);

                //set response user to state
                if (userRole === "admin" || userRole === "teknisi") {
                    setLoadPage(true);
                    if (userRole === "teknisi"){
                        setSeeButtonAdmin(false);
                    } else {
                        setSeeButtonAdmin(true);
                    }

                } else {
                    navigate('/dashboard');
                }

                // Cek hanya untuk teknisi
                if (userRole === "teknisi") {
                    setSeeButtonTech(false); // Reset seeButton di sini
                }

                if (userRole === "admin"){
                    setSeeButtonAdmin(true);
                    setSeeButtonTech(false);
                }
            });
    };

    //run hook useEffect
    useEffect(() => {
        fetchData();
        fetchDataApplications();
    }, []);

    return (
        <>{loadPage ? (
            <section className='flex gap-4'>
                <div className={(open) ? "w-full lg:w-8/12" : "w-full"}>
                    <div className=" p-2">
                        <h1 className='font-bold text-xl p-2'>Applications Table</h1>
                        {load === true ?
                            <div className="flex items-center p-2"><span className="loading loading-infinity loading-md"></span>&emsp;Loading data</div>
                            : <div >
                                <div className='flex justify-between p-2'>
                                <div className="flex gap-2">
                                        <Link to="/dashboard/topologies">
                                            <button className='btn btn-secondary btn-sm'> 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                                                    </svg>Master Data Topologies
                                            </button>
                                        </Link>
                                        <Link to="/dashboard/technologies">
                                            <button className='btn btn-secondary btn-sm'> 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="14" x2="23" y2="14"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="14" x2="4" y2="14"></line>
                                                    </svg>
                                            Master Data Technology
                                            </button>
                                        </Link>
                                        <Link to="/dashboard/pics">
                                            <button className='btn btn-secondary btn-sm'> 
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3"/><circle cx="12" cy="10" r="3"/><circle cx="12" cy="12" r="10"/></svg>
                                            Master Data PIC
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className='flex justify-between p-2'>
                                {seeButtonAdmin &&(
                                    <>
                                        <div className="flex gap-2">
                                        
                                        <Link to="add">
                                            <button className='btn btn-success btn-sm'><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 animate-bounce">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                            </svg>Add
                                            </button>
                                        </Link>
                                        <UploadDataComponent />
                                        <button className='btn btn-success btn-sm' onClick={handleExportData}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 animate-bounce">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
                                        </svg>Download
                                        </button>
                                    
                                    </div>
                                    </>
                                )
                                    }
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
                                <table className="w-full table-auto table-xs">
                                    <thead>
                                        <tr>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                application
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={platform}
                                                    onChange={handlePlatformChange}
                                                    className="form-select rounded-lg p-2"
                                                >
                                                    <option value="all">Platform</option>
                                                    {["Website","Mobile","Dekstop"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))
                                                    }
                                                </select>
                                                </div>
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={category}
                                                    onChange={handleCategoryChange}
                                                    className="form-select rounded-lg p-2"
                                                >
                                                    <option value="all">Category</option>
                                                    {["SAP","Non SAP","Turunan","OT/IT","Collaboration"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))}
                                                </select>
                                                </div>
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={groupArea}
                                                    onChange={handleGroupAreaChange}
                                                    className="form-select rounded-lg p-2 "
                                                >
                                                    <option value="all">Group Area</option>
                                                    {["SIG","SP","ST","SBI","PTPN","BIOFARMA"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))}
                                                </select>
                                                </div>
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={productBy}
                                                    onChange={handleCompanyChange}
                                                    className="form-select rounded-lg p-2 "
                                                >
                                                    <option value="all">Company</option>
                                                    {["SISI","SBI","UTSG","PP","ADHI"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))}
                                                </select>
                                                </div>
                                            </th>
                                            <th className="px-2 py-3 text-left text-xs font-medium text-secondary uppercase tracking-wider">
                                                <div className="flex items-center justify-between">
                                                <select
                                                    value={status}
                                                    onChange={handleStatusChange}
                                                    className="form-select rounded-lg p-2 "
                                                >
                                                    <option value="all">Status</option>
                                                    {["UP","DOWN","Maintenance","DELETED"].map((option) => (
                                                    <option key={option} value={option}>
                                                        {option}
                                                    </option>
                                                    ))}
                                                </select>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentData.map((applications, index) => (
                                            <tr key={applications.id} onClick={() => handleOpen(applications.id)} className="hover:bg-gray-300 hover:shadow-lg">

                                                <td className="px-4 align-middle">
                                                    <div className="flex items-center gap-4">
                                                        {/* <img src="/img/sig.png" alt="sig" className="h-10" /> */}
                                                        {(applications.image == null) ? (<img src="/img/sig.png" alt="Default Image" className="h-12" />
                                                        ) : (
                                                            // <p>{applications.image}</p>
                                                            <img
                                                            src={applications.image}
                                                            className="w-16 h-16 object-cover"
                                                            alt={applications.name}
                                                        />
                                                        )}
                                                        <div>
                                                            <p className="font-semibold text-md capitalize "
                                                            >
                                                                {applications.short_name}
                                                            </p>
                                                            <p className="text-xs italic">
                                                                {applications.url_prod}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td >
                                                    {applications.platform}
                                                </td>
                                                <td >
                                                    {applications.category}
                                                </td>
                                                <td >
                                                    {applications.group_area.short_name}
                                                </td>
                                                <td>
                                                    {applications.company?.map((comp, idx) => (
                                                        <span key={idx}>{comp.short_name}{idx < applications.company.length - 1 ? ', ' : ''}</span>
                                                    )) || 'Company not available'}
                                                </td>
                                                <td>
                                                    {(applications.status === "up") ? (
                                                        <div className="badge badge-success badge-lg w-24 h-6 p-2 text-xs">UP</div>
                                                    ) : applications.status === "down" ? (
                                                        <div className="badge badge-error badge-lg w-24 h-6 p-2 text-xs">DOWN</div>
                                                    ) : applications.status === "deleted" ?(
                                                        <div className="badge badge-error badge-lg w-24 h-6 p-2 text-xs ">DELETED</div>
                                                    ) :  (
                                                        <div className="badge badge-warning badge-lg w-24 h-6 p-2 text-xs ">MAINTENANCE</div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                <div className="flex items-center justify-between my-4">

                                    <p>Total data {applications.length ? applications.length : 0} entries</p>

                                    {applications.length > 10 && (<div className="join">
                                    <button 
                                        className="join-item btn btn-primary btn-sm p-1 rounded-none" 
                                        onClick={() => handlePageChange(currentPage - 1)} 
                                        disabled={currentPage === 1}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5" />
                                        </svg>
                                    </button>

                                    <p className="join-item btn btn-base-100 btn-sm">{`${currentPage} of ${totalPages}`}</p>
                                    <button 
                                        className="join-item btn btn-primary btn-sm p-1 rounded-none" 
                                        onClick={() => handlePageChange(currentPage + 1)} 
                                        disabled={currentPage >= totalPages || totalPages === 0}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                                        </svg>
                                    </button>
                                    </div>)}

                                </div>
                            </div>}

                    </div>
                </div>


                <div className={(open) ? "hidden md:block lg:w-4/12 shadow-xl px-2 py-4 min-h-screen bg-gray-200" : "hidden"}>
                    <div className="flex justify-between p-2 rounded-xl bg-gray-200">
                        <h1 className='text-2xl font-bold'>Detail</h1>
                        {seeButtonAdmin &&(
                        <>
                        {applicationSpecified.id === id && <div className="flex gap-1">
                        <Link to={`edit/${applicationSpecified.id}`}>
                            <button className="btn btn-warning btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>Edit</button>
                        </Link>
                        <button className="btn btn-error btn-sm p-1" onClick={() => document.getElementById('my_modal_1').showModal()}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                            </svg>Delete
                        </button>
                        <button className="btn btn-success btn-sm p-1" onClick={handleExportDataSpecified}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
                            </svg>Download
                        </button>
                        

                    </div>}
                        </>  
                        )
                        
                    }
                    {seeButtonTech &&(
                        <>
                        {applicationSpecified.id === id && <div className="flex gap-1">
                        <Link to={`edit/${applicationSpecified.id}`}>
                            <button className="btn btn-warning btn-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 ">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>Edit</button>
                        </Link>
                        <button className="btn btn-success btn-sm p-1" onClick={handleExportDataSpecified}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 ">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15v4c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2v-4M17 9l-5 5-5-5M12 12.8V2.5" />
                            </svg>Download
                        </button>
                        

                    </div>}
                        </>  
                        )
                        
                    }
                </div>

                <div role="tablist" className="tabs tabs-boxed mt-4 bg-gray-200 overflow-hidden">
                        <input type="radio" name="my_tabs_2" role="tab" className="tab tab-secondary font-bold" aria-label="Spesifikasi" defaultChecked />
                        <div role="tabpanel" className="tab-content border border-primary px-2">
                            <div className="flex justify-between items-center">
                                {/* <img src="/img/sig.png" alt="sig" className="h-24" /> */}
                                {(applicationSpecified.image === null) ? <img src="/img/sig.png" alt="sig" className="h-28" /> : <img src={applicationSpecified.image} className="h-24" />}
                                <div className="btn btn-info btn-xs  text-white capitalize" onClick={() => document.getElementById('modal-vm').showModal()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
                                    </svg>
                                    Show VM</div>
                                <div className="btn btn-info btn-xs  text-white capitalize" onClick={() => document.getElementById('modal-documents').showModal()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
                                    </svg>
                                    Show More Documents</div>
                            </div>
                            
                            <div className=" ">
                                <table className="table table-bordered table-xs">
                                    <thead className="hidden">
                                        <tr>
                                            <th>Field</th>
                                            <th>Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {[[applicationSpecified.url_prod, "URL Prod"], [applicationSpecified.url_dev, "URL Dev"]].map(
                                            (el) => (
                                                (el[0] &&
                                                    <tr className="my-2" key={el}>
                                                        <td className="font-bold capitalize bg-gray-300">{el[1]}
                                                        </td>
                                                        <td className="border border-gray-300">
                                                            <Link to={"//" + el[0]} target="_blank" className="italic underline text-primary ">
                                                                {el[0]}
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                )
                                            )
                                        )}

                                        {[[applicationSpecified.short_name, "Short name"],
                                        [applicationSpecified.long_name, "Long name"],
                                        [applicationSpecified.category, "category"], 
                                        [applicationSpecified.platform, "platform"], 
                                        [applicationSpecified.user_login, "User Login"],
                                        [applicationSpecified.business_process, "business"],
                                        [applicationSpecified.group_area?.short_name || 'Group Area not available', "Group Area"], 
                                        [applicationSpecified.company && applicationSpecified.company.map((comp, idx) => (
                                            <span key={idx}>{comp.short_name}{idx < applicationSpecified.company.length - 1 ? ', ' : ''}</span>
                                        )) || 'Company not available', "Company"],
                                        [applicationSpecified.tier, "Tier"], 
                                        [applicationSpecified.status, "status"], 
                                        [applicationSpecified.db_connection_path, "DB Connect"], 
                                        [applicationSpecified.sap_connection_path, "SAP Connect"]].map(
                                            (el) => (
                                                (el[0] && <tr key={el} >
                                                    <td className="font-bold capitalize bg-gray-300">{el[1]}</td>
                                                    <td className="border border-gray-300">{el[0]} </td>
                                                </tr>)
                                            )
                                        )}

                                        {[[applicationSpecified.description, "Description"], [applicationSpecified.information, "Information"]].map(
                                            (el, index) => (
                                                el[0] && (
                                                    <tr key={index}>
                                                        <td className="font-bold capitalize bg-gray-300" colSpan={2}>
                                                            {el[1]}
                                                            <div
                                                                className="font-normal text-justify py-2 break-word"
                                                                dangerouslySetInnerHTML={{ __html: el[0] }}
                                                            />
                                                        </td>
                                                        <style jsx>{`
                                                            .font-normal ol {
                                                                list-style-type: decimal; /* Tampilkan angka untuk ordered list */
                                                                padding-left: 20px;
                                                            }

                                                            .font-normal ul {
                                                                list-style-type: disc; /* Tampilkan bullet untuk unordered list */
                                                                padding-left: 20px;
                                                            }

                                                            .font-normal li {
                                                                margin-left: 20px; /* Pastikan setiap list item memiliki jarak */
                                                            }
                                                        `}</style>
                                                    </tr>
                                                )
                                            )
                                        )}

                                    </tbody>
                                </table>
                            </div>

                        </div>
                        <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold" aria-label="Technician" />
                        <div role="tabpanel" className="tab-content">
                            <div className="join join-vertical w-full">
                            <div className="collapse collapse-plus bg-base-200">
                                    <input type="radio" name="my-accordion-3" />
                                    <div className="collapse-title text-xl font-medium">
                                        First PIC
                                    </div>
                                    <div className="collapse-content">
                                        {picFirst.length > 0 ? (
                                            picFirst.map((pic, index) => (
                                                <div key={index} className="flex items-start mb-4">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mr-4">
                                                        <img src={pic.photo ? "http://127.0.0.1:8000" + pic.photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="PIC" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-grow flex flex-col mr-4">
                                                        <div className="flex flex-col">
                                                            <p><b>Name</b> : {pic.name}</p>
                                                            <p><b>Contact</b> : {pic.contact}</p>
                                                            <p><b>Job</b> : {pic.jobdesc}</p>
                                                            <p><b>Status</b> : {pic.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No First PIC available</p>
                                        )}
                                    </div>
                                </div>

                                <div className="collapse collapse-plus bg-base-200">
                                    <input type="radio" name="my-accordion-3" />
                                    <div className="collapse-title text-xl font-medium">
                                        Backup PIC
                                    </div>
                                    <div className="collapse-content">
                                        {picBackup.length > 0 ? (
                                            picBackup.map((pic, index) => (
                                                <div key={index} className="flex items-start mb-4">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mr-4">
                                                        <img src={pic.photo ? "http://127.0.0.1:8000" + pic.photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="PIC" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-grow flex flex-col mr-4">
                                                        <div className="flex flex-col">
                                                            <p><b>Name</b> : {pic.name}</p>
                                                            <p><b>Contact</b> : {pic.contact}</p>
                                                            <p><b>Job</b> : {pic.jobdesc}</p>
                                                            <p><b>Status</b> : {pic.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No Backup PIC available</p>
                                        )}
                                    </div>
                                </div>

                                <div className="collapse collapse-plus bg-base-200">
                                    <input type="radio" name="my-accordion-3" />
                                    <div className="collapse-title text-xl font-medium">
                                        PIC ICT
                                    </div>
                                    <div className="collapse-content">
                                        {picIct.length > 0 ? (
                                            picIct.map((pic, index) => (
                                                <div key={index} className="flex items-start mb-4">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mr-4">
                                                        <img src={pic.photo ? "http://127.0.0.1:8000" + pic.photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="PIC" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-grow flex flex-col mr-4">
                                                        <div className="flex flex-col">
                                                            <p><b>Name</b> : {pic.name}</p>
                                                            <p><b>Contact</b> : {pic.contact}</p>
                                                            <p><b>Job</b> : {pic.jobdesc}</p>
                                                            <p><b>Status</b> : {pic.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No PIC ICT available</p>
                                        )}
                                    </div>
                                </div>

                                <div className="collapse collapse-plus bg-base-200">
                                    <input type="radio" name="my-accordion-3" />
                                    <div className="collapse-title text-xl font-medium">
                                        PIC User
                                    </div>
                                    <div className="collapse-content">
                                        {picUser.length > 0 ? (
                                            picUser.map((pic, index) => (
                                                <div key={index} className="flex items-start mb-4">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mr-4">
                                                        <img src={pic.photo ? "http://127.0.0.1:8000" + pic.photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="PIC" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-grow flex flex-col mr-4">
                                                        <div className="flex flex-col">
                                                            <p><b>Name</b> : {pic.name}</p>
                                                            <p><b>Contact</b> : {pic.contact}</p>
                                                            <p><b>Job</b> : {pic.jobdesc}</p>
                                                            <p><b>Status</b> : {pic.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No PIC User available</p>
                                        )}
                                    </div>
                                </div>

                                <div className="collapse collapse-plus bg-base-200">
                                    <input type="radio" name="my-accordion-3" />
                                    <div className="collapse-title text-xl font-medium">
                                        Old PIC
                                    </div>
                                    <div className="collapse-content">
                                        {picOld.length > 0 ? (
                                            picOld.map((pic, index) => (
                                                <div key={index} className="flex items-start mb-4">
                                                    <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 mr-4">
                                                        <img src={pic.photo ? "http://127.0.0.1:8000" + pic.photo : "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.jpg"} alt="PIC" className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-grow flex flex-col mr-4">
                                                        <div className="flex flex-col">
                                                            <p><b>Name</b> : {pic.name}</p>
                                                            <p><b>Contact</b> : {pic.contact}</p>
                                                            <p><b>Job</b> : {pic.jobdesc}</p>
                                                            <p><b>Status</b> : {pic.status}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p>No Old PIC available</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>


                        <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold " aria-label="Technology" />
                        <div role="tabpanel" className="tab-content border border-primary w-full">
                        <div className="join join-vertical w-full">
                            {technology.length > 0 ? (
                                <table className="table table-bordered">
                                    <thead>                                           
                                    <tr className="border border-secondary">
                                        <th>Group</th>
                                        <th>Name </th>
                                        <th>Version</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {technology.map((tech, index) => (
                                        <tr key={index} className="border border-secondary">
                                            <td >{tech.group}</td>
                                            <td >{tech.name}</td>
                                            <td >{tech.version}</td>
                                            {/* <td >{topo.status}</td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                    ) : (
                                        <p>No technology available for this application.</p>
                                    )}
                        </div>
                        </div>
                        <input type="radio" name="my_tabs_2" role="tab" className="tab font-bold " aria-label="Topology" />
                        <div role="tabpanel" className="tab-content border border-gray-300 p-4 items-center h-64">
                        <div className="flex justify-between items-center">
                        <div className="btn btn-info btn-sm text-white capitalize" onClick={() => document.getElementById('modal-topology').showModal()}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 17.25v-.228a4.5 4.5 0 0 0-.12-1.03l-2.268-9.64a3.375 3.375 0 0 0-3.285-2.602H7.923a3.375 3.375 0 0 0-3.285 2.602l-2.268 9.64a4.5 4.5 0 0 0-.12 1.03v.228m19.5 0a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3m19.5 0a3 3 0 0 0-3-3H5.25a3 3 0 0 0-3 3m16.5 0h.008v.008h-.008v-.008Zm-3 0h.008v.008h-.008v-.008Z" />
                                    </svg>
                                    Show Topology</div>
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
                                {/* if there is a button in form, it will close the modal */}

                                <button className="btn btn-success btn-sm mr-2" onClick={() => (deleteApplication(applicationSpecified.id), document.getElementById('my_modal_1').close())} ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                    Yes</button>
                                <button className="btn btn-error btn-sm" onClick={() => document.getElementById('my_modal_1').close()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                    No</button>
                            </div>
                        </div>
                    </div>
                </dialog>

                <dialog id="my_modal_2" className="modal">
                    <div className="modal-box ">
                        <div className="flex justify-between">
                            <h3 className="font-bold text-2xl">Upload Data</h3>
                            <a href="../../exampleData/test.xlsx" download target='_blank'>
                            <button className="btn btn-info btn-sm"> Download Template </button>
                            </a>
                        </div>
                        <form className="py-6">
                            <div className="">Update data via file Excel</div>
                            <input type="file" className="file-input file-input-sm w-full max-w-xs my-4" />
                            {/* <br/> */}
                            <div className="text-error text-xs w-full">important to download template first before submit</div>
                            <a href="" className="btn btn-success btn-sm mt-2 w-full">Submit</a>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                <dialog id="modal-vm" className="modal">
                    <div className="modal-box max-w-6xl w-full">
                        <h3 className="font-bold text-xl mb-2">Virtual Machine</h3>
                        <div className="join join-vertical w-full">
                        {virtualMachine.length > 0 ? (
                                virtualMachine.map((vm, index) => (
                                <div key={index} className="collapse collapse-arrow join-item">
                                    <input type="radio" name="my-accordion-4" />
                                    <div className="collapse-title text-sm font-semibold">
                                        {vm.environment === "production" && (<span className="badge badge-warning font-bold rounded-none p-1">P</span>)}  
                                        {vm.environment === "development" && (<span className="badge badge-accent font-bold rounded-none p-1">D</span>)}
                                        <span> &nbsp;{vm.name}</span>
                                    </div>
                                    <div className="collapse-content text-justify">
                                        <table className="table table-bordered">
                                            <thead>                                           
                                                <tr className="border border-secondary">
                                                <th>Group</th>
                                                <th>IP Address</th>
                                                {/* <th>Environment</th> */}
                                                <th>Description</th>
                                                <th>Notes</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            <tr className="border border-secondary">
                                                <td >{vm.group}</td>
                                                <td >{vm.ip_address}</td>
                                                {/* <td ><span className="badge badge-secondary">{vm.environment}</span></td> */}
                                                <td >{vm.description}</td>
                                                <td >{vm.notes}</td>
                                            </tr>
                                            </tbody>
                                        </table>

                                    </div>
                                </div>

                                ) )) : (
                                    <p>No virtual machines available for this application.</p>
                                )}
                            


                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                <dialog id="modal-documents" className="modal">
                    <div className="modal-box max-w-6xl w-full">
                        <h3 className="font-bold text-xl mb-2">More Documents</h3>
                        <div className="join join-vertical w-full">
                            <ul className="flex flex-wrap items-center justify-center">
                                <li>
                                <a href="#" >
                                    <button className="btn btn-secondary me-4 hover:underline md:me-6"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                        Technical Documents
                                    </button>
                                </a>
                                </li>
                                <li>
                                    <a href="#" >
                                        <button className="btn btn-info me-4 hover:underline md:me-6"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                        User Guide
                                        </button>
                                    </a>
                                    
                                </li>
                                <li>
                                <a href="#" >
                                    <button className="btn btn-outline btn-info me-4 hover:underline md:me-6"> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                    </svg>
                                        More Documents
                                    </button>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>


                <dialog id="modal-topology" className="modal">
                    <div className="modal-box max-w-6xl w-full">
                        <h3 className="font-bold text-xl mb-2">Topology</h3>
                        {topology.length > 0 ? (
                                <table className="table table-bordered">
                                    <thead>                                           
                                    <tr className="border border-secondary">
                                        <th>Group</th>
                                        <th>Link </th>
                                        <th>Description</th>
                                        <th>Status</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {topology.map((topo, index) => (
                                        <tr key={index} className="border border-secondary">
                                            <td >{topo.group}</td>
                                            <td >{topo.link}</td>
                                            <td >{topo.description}</td>
                                            {/* <td >{topo.status}</td> */}
                                            </tr>
                                        ))}
                                    </tbody>
                                    </table>
                                    ) : (
                                        <p>No Topology available for this application.</p>
                                    )}
                        </div>
                        <form method="dialog" className="modal-backdrop">
                            <button>close</button>
                        </form>
                        </dialog>


            </section >) : <div className="flex items-center justify-center min-h-screen bg-base-100 "><span className="loading loading-infinity loading-lg items-center text-primary animate-bounce"></span><span className="animate-bounce text-xl font-bold text-primary capitalize">&nbsp;loading</span></div>}
            {showToastSuccess && (
            <div className="toast">
                <div className="alert alert-success">
                    <span>{successMessage}</span>
                </div>
            </div>
        )}
        </>
    )
}