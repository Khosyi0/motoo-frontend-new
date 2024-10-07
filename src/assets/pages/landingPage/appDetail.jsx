import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import instance from "../../../axios";
import {PICCard} from "../../components/picCard";
import Star from "../../components/stars";
import LoadingAnimation from "../../components/loadingAnimation";

export function AppDetail() {
    const [applications, setApplications] = useState([]);
    const [picOld, setPicOld] = useState([]);
    const [picIct, setPicIct] = useState([]);
    const [picBackup, setPicBackup] = useState([]);
    const [picFirst, setPicFirst] = useState([]);
    const [picUser, setPicUser] = useState([]);
    const [topology, setTopology] = useState([]);
    const [technology, setTechnology] = useState([]);
    //destruct ID
    const { id } = useParams();
    const [loadPage, setLoadPage] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState({
        // Define the fields you want to add
        review_text: '',
        reviewer_name: '',
        rating: '',
        review_date: new Date().toISOString().slice(0, 19).replace('T', ' '),
        app_id: id,
        review_id: null,
    });

    //define method
    const fetchDataApplications = async () => {
        try {
            const appResponse = await instance.get(`/applications/${id}`);
            const appData = appResponse.data.data;

            setApplications(appData || []);
            setLoadPage(true);
            setPicOld(appData.old_pics || []);
            setPicIct(appData.pic_icts || []);
            setPicBackup(appData.backup_pics || []);
            setPicFirst(appData.first_pics || []);
            setPicUser(appData.pic_users || []);
            setTopology(appData.topology || []);
            setTechnology(appData.technology || []);
            console.log("pic", appData.old_pics[0]);
        } catch (error) {
        console.error("Error fetching data", error);
    }
    };

    const [review, setReview] = useState([]);
    const [totalRatings, setTotalRatings] = useState([]);
    const [totalReviews, setTotalReviews] = useState([]);
    const [ratingCounts, setRatingCounts] = useState({
        Rating1: 0,
        Rating2: 0,
        Rating3: 0,
        Rating4: 0,
        Rating5: 0,
    });
    const [progressValues, setProgressValues] = useState({
        Rating1: 0,
        Rating2: 0,
        Rating3: 0,
        Rating4: 0,
        Rating5: 0,
    });

    const fetchReviews = async () => {
        try {
            const appResponse = await instance.get(`/applications/${id}`);
            const appData = appResponse.data.data;
            setReview(appData.reviews || []);
            // Calculate the counts of each rating
            const counts = { Rating1: 0, Rating2: 0, Rating3: 0, Rating4: 0, Rating5: 0 };
            appData.reviews.forEach((review) => {
                const key = `Rating${review.rating}`;
                counts[key] = (counts[key] || 0) + 1;
            });
            setRatingCounts(counts);
            setTotalRatings(appData.total_rating || 0);
            setTotalReviews(appData.total_review || 0);
            setTotalRatings(appData.total_rating || 0);

            const getProgressValue = (count) => {
                if (appData.total_review > 0) {
                    return ((count / appData.total_review) * 100).toFixed(1);
                }
                return 0;
            };

            const progressValues = {
                Rating1: getProgressValue(counts.Rating1),
                Rating2: getProgressValue(counts.Rating2),
                Rating3: getProgressValue(counts.Rating3),
                Rating4: getProgressValue(counts.Rating4),
                Rating5: getProgressValue(counts.Rating5),
            };

            setProgressValues(progressValues);
            
        } catch (error) {
            console.log('Error fetching reviews', error);
        }
    };


    //token
    const token = localStorage.getItem("token");
    const [user, setUser] = useState([]);

    const [seeReview, setSeeReview] = useState(null);
    const [seeDocsButton, setSeeDocsButton] = useState(null);
    const [seeDeleteButton, setSeeDeleteButton] = useState(null);
    const [seeData, setSeeData] = useState(null);
    const [seeTechnician, setSeeTechnician] = useState(false);
    const [seeTechnology, setSeeTechnology] = useState(false);
    const [seeTopology, setSeeTopology] = useState(false);

    const fetchData = async () => {
        // Set header type Authorization + Bearer token
        instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await instance.get('/user')
            .then((response) => {
                // Set response user to state
                setUser(response.data);
                const userRole = response.data.role;
                if (userRole === "admin" ) {
                    setSeeData(true);
                    setSeeDocsButton(true);
                    // setSeeDeleteButton(true);
                    setSeeTechnician(true);
                    setSeeTechnology(true);
                    setSeeTopology(true);
                    setLoadPage(true);
                    setSeeReview(false);
                } else if (userRole === "teknisi") {
                    setSeeData(true);
                    setSeeDocsButton(true);
                    setSeeTechnician(true);
                    setSeeTechnology(true);
                    setSeeTopology(true);
                    setLoadPage(true);
                    setSeeReview(false);
                } else if (userRole === "reporter") {
                    setSeeData(true);
                    setSeeTechnician(true);
                    setSeeTechnology(false);
                    setSeeTopology(false);
                    setLoadPage(true);
                    setSeeReview(false);
                } else {
                    setSeeData(false);
                    setSeeTechnician(false);
                    setSeeTechnology(false);
                    setSeeTopology(false);
                    setSeeReview(true);
                }
            })
            .catch((error) => {
                console.error("Error fetching user data", error);
                setSeeData(false);
                setSeeReview(false);
                setSeeTechnician(false);
                setSeeTechnology(false);
                setSeeTopology(false);
                
            });
    };


    const [existingReview, setExistingReview] = useState(null);
    useEffect(() => {
        //console.log("Current user:", user);
            const userReview = review.find(review => review.reviewer.id === user.id);
            //console.log("Found user review:", userReview);
            setExistingReview(userReview);
            if (userReview) {
                setData(prevData => ({
                    ...prevData,
                    review_text: userReview.review_text,
                    rating: userReview.rating,
                    review_id: userReview.id,
                }));
        }
    }, [user, review]);


    const getDateNow = () => {
        new Date().toISOString().slice(0, 19).replace('T', ' ');
    }

    console.log(data);
    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };
    const handleSubmitReview = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!token) {
        alert("You need to log in first to submit a review.");
        window.location.href = "/login"; // Redirect if not logged in
        setIsLoading(false);
        return;
    }

    const formData = new FormData();
    Object.keys(data).forEach(key => {
        formData.append(key, data[key]);
    });

    const config = {
        headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`
        }
    };

    try {
        if (existingReview) {
            // Update existing review using PATCH
            formData.append('_method', 'PATCH'); // Simulate PATCH using _method
            const response = await instance.post(`/reviews/${data.review_id}`, formData, config);
            console.log('Review updated successfully', response.data);
        } else {
            // Create new review using POST
            const response = await instance.post('/reviews', formData, config);
            console.log('Review added successfully', response.data);
        }

        // Reset form data after submission
        setData({ review_text: '', rating: 0, review_id: null });

        // Fetch updated reviews
        await fetchReviews();
    } catch (error) {
        console.log('Error adding/updating review', error);
    } finally {
        setIsLoading(false);
    }
};

    const deleteReview = async (id) => {
        await instance.delete(`/reviews/${id}`).then((response) => {
            setReview(
                review.filter((review) => {
                    return review.id !== id;
                })
            )
        });
    };

    const [selectedPicData, setSelectedPicData] = useState(null);
    const [modalTitle, setModalTitle] = useState('');

    const handleViewDetail = (data, title) => {
        console.log('Selected PIC Data:', data);  // Debugging step
        setSelectedPicData(data);
        setModalTitle(title);
        document.getElementById('modal-pic').showModal();
    };

    //run hook useEffect
    useEffect(() => {
        //call method "fetchDataPosts"
        fetchDataApplications();
        fetchData();
        fetchReviews();
    }, []);

    console.log(review);

    return (
        <>{loadPage ? (<div >
            {applications && (
                <section className="container mx-auto my-8">
                    <Link to={"/"} className="btn btn-primary btn-outline btn-sm"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                    </svg>
                    </Link>
                    <div className="block md:flex md:p-4 p-2">
                        <div className="w-full md:w-4/12">
                            <div className="flex items-center justify-center">
                                {(applications.image === null) ?(<img src="/img/sig.png" alt="Default Image" className="w-4/5 p-4" />
                                    ) : (
                                     // <p>{applications.image}</p>
                                    <img src={applications.image} className="w-1/2 md:w-4/5 p-2 md:p-4" />
                                    )
                                }

                            </div>
                        </div>
                        <div className="w-full md:w-8/12 px-4">
                            <h1 className="p-2 font-bold text-3xl">{applications.short_name}</h1>
                            <div className="p-2 flex gap-2">
                            {(applications.status === "up") ? (
                                <div className="badge badge-success badge-lg w-24 h-6 p-2 text-xs">UP</div>
                                ) : applications.status === "down" ? (
                                <div className="badge badge-error badge-lg w-24 h-6 p-2 text-xs">DOWN</div>
                                ) : applications.status === "deleted" ?(
                                <div className="badge badge-error badge-lg w-24 h-6 p-2 text-xs ">DELETED</div>
                                ) :  (
                                <div className="badge badge-warning badge-lg w-24 h-6 p-2 text-xs ">MAINTENANCE</div>
                                )}
                                {applications.platform && <div className="badge badge-lg bg-[#fecdd3] text-primary font-bold uppercase">{applications.platform}</div>}
                                {applications.category && <div className="badge badge-lg bg-[#d1d5db] text-neutral font-bold uppercase">{applications.category}</div>}
                            </div>
                            <div className="p-2">
                                <h3 className="font-semibold">Descriptions</h3>
                                <td className="font-bold capitalize" colSpan={2}>
                                <div
                                    className="font-normal text-justify py-2 break-word"
                                    dangerouslySetInnerHTML={{ __html: applications.description }} />
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
                            </div>
                            <div className="px-2 py-4 border-gray-300 border-b border-t">   
                            {seeDocsButton &&(
                                    <>
                                <button 
                                    onClick={() => window.open(`${applications.technical_doc}`, '_blank')} 
                                    className="btn btn-secondary btn-sm"
                                > 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    Technical Documents
                                </button>
                                </>)}
                                <button className="btn btn-info btn-sm m-2"
                                onClick={() => window.open(`${applications.user_doc}`, '_blank')} 
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                </svg>
                                    User Guide</button>
                                <button className="btn btn-outline btn-info btn-sm"
                                onClick={() => window.open(`${applications.other_doc}`, '_blank')} 
                                > 
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                                </svg>
                                    More Documents</button>
                            </div>

                            <div className="px-2 py-6">
                                <Link to={"//" + applications.url_prod} target="_blank" rel="noreferrer">
                                    <div className="tooltip mr-2" data-tip={applications.url_prod}>
                                        <button className="btn btn-primary btn-md">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                                            </svg>
                                            Open Applications
                                        </button>
                                    </div>
                                </Link>

                            </div>

                        </div>
                    </div>
                    <div className="text-center">
                        <div role="tablist" className="tabs tabs-lifted tabs-lg">
                            <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-bold [--tab-border-color:#e11d48] " aria-label="Information" defaultChecked />
                            <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                {applications && (
                                    <div className="overflow-x-auto">

                                        <table className="table">
                                            <thead>
                                                <tr className="font-bold capitalize text-md">
                                                    <th>Field</th>
                                                    <th>Value</th>
                                                </tr>

                                            </thead>
                                            <tbody>
                                                {[[applications.short_name, "short name"],
                                                [applications.long_name, "long name"], 
                                                [applications.category, "category"], 
                                                [applications.platform, "platform"], 
                                                [applications.group_area?.short_name || 'Group Area not available', "Group Area"], 
                                                [applications.tier, "Tier"], 
                                                [applications.business_process, "business"],
                                                [applications.user_login, "User Login"],
                                                [applications.db_connection_path, "DB Connect"], 
                                                [applications.sap_connection_path, "SAP Connect"]].map((el) => (
                                                    (el[0] && (
                                                        <tr key={el}>
                                                            <td className="font-semibold capitalize">
                                                                {el[1]}
                                                            </td>
                                                            <td >
                                                                {el[0]}
                                                            </td>
                                                        </tr>))
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>)}
                            </div>

                            <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-semibold [--tab-border-color:#e11d48]" aria-label="Reviews" />
                            <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                <div className="block md:flex gap-4">
                                    <div className="block w-full lg:w-4/12 ">
                                        <div className="bg-base-100 py-6 shadow-xl mb-4">
                                            <div className="flex items-center p-4 gap-4">
                                            <div className="rating rating-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <span className="font-bold text-2xl">{(applications.total_rating || 0).toFixed(1)}</span>
                                                    <span className="text-md"> / 5.0 </span>
                                                </div>
                                                <div className=""> ({totalReviews} reviews) </div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4">
                                                <div className="rating rating-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                </div>
                                                <progress className="progress progress-primary w-full" value={progressValues.Rating5} max="100"></progress>
                                                <div className="text-sm">{ratingCounts.Rating5}</div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4">
                                                <div className="rating rating-4">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                </div>
                                                <progress className="progress progress-primary w-full" value={progressValues.Rating4} max="100"></progress>
                                                <div className="text-sm">{ratingCounts.Rating4}</div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4">
                                                <div className="rating rating-3">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>

                                                </div>
                                                <progress className="progress progress-primary w-full" value={progressValues.Rating3} max="100"></progress>
                                                <div className="text-sm">{ratingCounts.Rating3}</div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4">
                                                <div className="rating rating-2">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                </div>
                                                <progress className="progress progress-primary w-full" value={progressValues.Rating2} max="100"></progress>
                                                <div className="text-sm">{ratingCounts.Rating2}</div>
                                            </div>
                                            <div className="flex items-center gap-2 px-4">
                                                <div className="rating rating-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-orange-400">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
                                                    </svg>
                                                </div>
                                                <progress className="progress progress-primary w-full" value={progressValues.Rating1} max="100"></progress>
                                                <div className="text-sm">{ratingCounts.Rating1}</div>
                                            </div>

                                        </div>
                                        {seeReview &&(
                                        <>
                                        <div className="bg-base-100 p-6 shadow-xl">
                                        <form onSubmit={handleSubmitReview}>
                                            <div className="join justify-start flex py-2">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="p-1 w-16 text-primary join-item">
                                                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                                                </svg>
                                                <input type="text" defaultValue={data.reviewer_name} value={user.name} onChange={handleChange} name="reviewer_name" placeholder="No user Login" className="join-item input input-bordered w-full max-w-xs font-bold" disabled />
                                            </div>
                                            <textarea name="review_text" value={data.review_text} onChange={handleChange} className="textarea textarea-secondary w-full mb-2" placeholder="write your review here ..."></textarea>
                                            <div className="join-item rating rating-md mb-2">
                                                <input type="radio" value={0} name="rating" defaultChecked={data.rating} onChange={handleChange} className="mask mask-star-2 bg-orange-400 hidden" />
                                                <input type="radio" name="rating" onChange={handleChange} value="1" className="mask mask-star-2 bg-orange-400" />
                                                <input type="radio" name="rating" onChange={handleChange} value="2" className="mask mask-star-2 bg-orange-400" />
                                                <input type="radio" name="rating" onChange={handleChange} value="3" className="mask mask-star-2 bg-orange-400" />
                                                <input type="radio" name="rating" onChange={handleChange} value="4" className="mask mask-star-2 bg-orange-400" />
                                                <input type="radio" name="rating" onChange={handleChange} value="5" className="mask mask-star-2 bg-orange-400" />
                                            </div>
                                            <input type="text" name="review_date" defaultValue={data.review_date} className="hidden" />
                                            <button className="btn btn-primary w-full" value="submit" type="submit">
                                                {data.review_id ? 'Update Review' : 'Submit Review'}
                                            </button>
                                        </form>
                                        </div>
                                        </>)}
                                    </div>

                                    <div className="mt-4 md:mt-0 block w-full lg:w-8/12 overflow-y-auto max-h-screen">
                                        <LoadingAnimation isLoading={isLoading} />
                                        {!isLoading && (
                                            <>
                                                {review.map((el, index) => (
                                                    <div key={index} className="mb-2 rounded-2xl border border-gray-300 shadow-xl"  >
                                                        <div className="p-6 text-left">
                                                        {seeDeleteButton &&(
                                                            <>
                                                        <button className="btn btn-error btn-sm p-1" onClick={() => document.getElementById('delete-modal').showModal()}>
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 ">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                                            </svg>Delete
                                                        </button>
                                                        </>)}
                                                            <div className="flex justify-between border-b border-neutral py-2">
                                                                <div className="w-full">
                                                                    <div className="text-lg">{el.review_text}</div>
                                                                    <div className="badge mt-2">{el.created_at}</div>
                                                                </div>
                                                            </div>
                                                            <div className="flex gap-2 mt-2">
                                                                <div className="badge badge-primary text-md font-semibold">
                                                                    {el.reviewer.name}
                                                                </div>
                                                                <div className="badge text-xs">
                                                                    {el.rating}
                                                                    <Star isFilled={true}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        
                                                    </div>
                                                ))}
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {seeData && (
                                <>
                                    {seeTechnician && (
                                        <>
                                            <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-semibold [--tab-border-color:#e11d48]" aria-label="Technician" />
                                            <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                            {/* Combined First Technician PIC and Technician Backup PIC */}
                                            <div className="flex gap-4 mb-6 ">
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-bold mb-2">First Technician PIC</h2>
                                                    <div className="carousel carousel-center max-w-md space-x-4 p-4">
                                                        {picFirst.map((pic) => (
                                                            <PICCard key={pic.id} picData={pic} title="First Technician PIC" onViewDetail={handleViewDetail} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="border-l-2 border-gray-300 mx-4" />
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-bold mb-2">Technician Backup PIC</h2>
                                                    <div className="carousel carousel-center max-w-md space-x-4 p-4">
                                                        {picBackup.map((pic) => (
                                                            <PICCard key={pic.id} picData={pic} title="Technician Backup PIC" onViewDetail={handleViewDetail} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="border-l-2 border-gray-300 mx-4" />
                                                {/* Old Technician PIC */}
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-bold mb-2">Old Technician PIC</h2>
                                                    <div className="carousel carousel-center max-w-md space-x-4 p-4">
                                                        {picOld.map((pic) => (
                                                            <PICCard key={pic.id} picData={pic} title="Old Technician PIC" className="grayscale" onViewDetail={handleViewDetail} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <hr className="my-4 border-t-2 border-gray-300" />
                                            {/* Combined ICT PIC and User PIC */}
                                            <div className="flex gap-4 mb-6">
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-bold mb-2">ICT PIC</h2>
                                                    <div className="carousel carousel-center max-w-md space-x-4 p-4">
                                                        {picIct.map((pic) => (
                                                            <PICCard key={pic.id} picData={pic} title="ICT PIC" onViewDetail={handleViewDetail} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="border-l-2 border-gray-300 mx-4" />
                                                <div className="flex-1">
                                                    <h2 className="text-xl font-bold mb-2">User PIC</h2>
                                                    <div className="carousel carousel-center max-w-md space-x-4 p-4">
                                                        {picUser.map((pic) => (
                                                            <PICCard key={pic.id} picData={pic} title="User PIC" onViewDetail={handleViewDetail} />
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        </>
                                    )}

                                    {seeTechnology && (
                                        <>
                                            <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-semibold [--tab-border-color:#e11d48]" aria-label="Technology" />
                                            <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                                <div className="join join-vertical w-full">
                                                    {technology.length > 0 ? (
                                                        <table className="table table-bordered">
                                                            <thead>
                                                                <tr className="border border-secondary">
                                                                    <th>Group</th>
                                                                    <th>Name</th>
                                                                    <th>Version</th>
                                                                    <th>Status</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {technology.map((tech, index) => (
                                                                    <tr key={index} className="border border-secondary">
                                                                        <td>{tech.group}</td>
                                                                        <td>{tech.name}</td>
                                                                        <td>{tech.version}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    ) : (
                                                        <p>No technology available for this application.</p>
                                                    )}
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    {seeTopology && (
                                        <>
                                            <input type="radio" name="my_tabs_2" role="tab" className="tab text-md font-semibold [--tab-border-color:#e11d48]" aria-label="Topology" />
                                            <div role="tabpanel" className="tab-content bg-base-100 border-primary rounded-box p-6">
                                                {topology.length > 0 ? (
                                                    <table className="table table-bordered">
                                                        <thead>
                                                            <tr className="border border-secondary">
                                                                <th>Group</th>
                                                                <th>Link</th>
                                                                <th>Description</th>
                                                                <th>Status</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {topology.map((topo, index) => (
                                                                <tr key={index} className="border border-secondary">
                                                                    <td>{topo.group}</td>
                                                                    <td>{topo.link}</td>
                                                                    <td>{topo.description}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                ) : (
                                                    <p>No Topology available for this application.</p>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>

                </section >)}

                <dialog id="delete-modal" className="modal">
                    <div className="modal-box">
                        <h3 className="font-bold text-lg">Delete</h3>
                        <p className="pt-4">Are you sure to delete the data?</p>
                        <div className="modal-action">
                            <div method="dialog">
                                {/* if there is a button in form, it will close the modal */}

                                <button className="btn btn-success btn-sm mr-2" onClick={() => (deleteReview(review.id), document.getElementById('delete-modal').close())} ><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                                    Yes</button>
                                <button className="btn btn-error btn-sm" onClick={() => document.getElementById('delete-modal').close()}><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                    No</button>
                            </div>
                        </div>
                    </div>
                </dialog>

                <dialog id="modal-pic" className="modal">
                    <div className="modal-box max-w-6xl w-full">
                        <h3 className="font-bold text-xl mb-2">Detail {modalTitle}</h3>
                        {selectedPicData ? (
                            <table className="table table-bordered">
                                <tbody>
                                    <tr>
                                        <td className="font-semibold capitalize">Nama</td>
                                        <td>{selectedPicData.name}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold capitalize">Contact</td>
                                        <td>{selectedPicData.contact}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold capitalize">JobDesc</td>
                                        <td>{selectedPicData.jobdesc}</td>
                                    </tr>
                                    <tr>
                                        <td className="font-semibold capitalize">Status</td>
                                        <td>{selectedPicData.status}</td>
                                    </tr>
                                </tbody>
                                <tbody>
                                    {selectedPicData.applications && selectedPicData.applications.length > 0 ? (
                                        selectedPicData.applications.map((app, index) => (
                                            <tr key={index}>
                                                <td>
                                                    {app.image ? (
                                                        <Link to={`/application/${app.id}`}>
                                                            <img
                                                                src={app.image}
                                                                className="w-16 h-16 object-cover"
                                                                alt={app.short_name}
                                                            />
                                                        </Link>
                                                    ) : (
                                                        "N/A"
                                                    )}
                                                </td>
                                                <td>{app.short_name}</td>
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
                        ) : (
                            <p>No data available for this PIC.</p>
                        )}
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>Close</button>
                    </form>
                </dialog>
        </div>) : 
            <div className="flex items-center justify-center min-h-screen bg-base-100">
                <span className="loading loading-infinity loading-lg items-center text-primary animate-bounce">
                    </span>
                    <span className="text-2xl font-bold animate-bounce text-primary">&nbsp;Loading</span></div>}

        </>
    );
}

export default AppDetail;
