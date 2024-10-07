import { Link } from "react-router-dom";

export function ApplicationCard({ img, name, id, status, category, platform, group_area, rating}) {
    return (
        <Link to={`/application/${id}`} className="min-card-height" >
            <div className="card hover:bg-gray-200 hover:shadow-2xl hover:border-secondary border bg-base-100 h-full ">
            <div className="flex justify-end">
                {status === "up" ? (
                    <div className="badge badge-success text-xs p-1 m-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M8 14a.75.75 0 0 1-.75-.75V4.56L4.03 7.78a.75.75 0 0 1-1.06-1.06l4.5-4.5a.75.75 0 0 1 1.06 0l4.5 4.5a.75.75 0 0 1-1.06 1.06L8.75 4.56v8.69A.75.75 0 0 1 8 14Z" clipRule="evenodd" />
                    </svg>
                    UP
                    </div>
                ) : status === "down" ? (
                    <div className="badge badge-error text-xs p-1 m-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" />
                    </svg>
                    DOWN
                    </div>
                ) : status === "delete" ? (
                    <div className="badge badge-error text-xs p-1 m-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path fillRule="evenodd" d="M8 2a.75.75 0 0 1 .75.75v8.69l3.22-3.22a.75.75 0 1 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.22 3.22V2.75A.75.75 0 0 1 8 2Z" clipRule="evenodd" />
                    </svg>
                    DELETE
                    </div>
                ) : (
                    <div className="badge badge-warning text-xs p-1 m-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                        <path d="M8 1a7 7 0 100 14A7 7 0 008 1zM2 8a6 6 0 1112 0A6 6 0 012 8z" />
                        <path d="M11.046 4.545a.5.5 0 00-.707 0L8 6.884 5.661 4.545a.5.5 0 10-.707.707L7.293 7.59l-2.339 2.338a.5.5 0 00.707.708L8 8.297l2.339 2.339a.5.5 0 00.707-.708L8.707 7.59l2.339-2.338a.5.5 0 000-.707z" />
                    </svg>
                    MAINTENANCE
                    </div>
                )}
            </div>
                <figure className="my-4 h-48 w-full overflow-hidden">
                    
                {(img === null) ? (<img src="/img/sig.png" alt="Default Image" className="w-4/5 p-4" />
                                    ) : (
                                     // <p>{applications.image}</p>
                                    <img src={img} className="w-4/5 p-4" />
                                    )}
                </figure>
                <div className="card-body p-4 flex-col justify-between min-h-[150px]">
                    <span className="font-semibold text-lg">
                        {name}
                    </span>
                    <div className="card-actions justify-center mt-auto">
                        {platform && <div className="badge bg-[#fecdd3] text-primary font-bold text-xs">{platform}</div>}
                        {category && <div className="badge bg-[#d1d5db] text-neutral font-bold text-xs">{category}</div>}
                        {group_area && <div className="badge badge-info p-1 text-xs font-bold">{group_area}</div>}
                    </div>
                    <div className="rating rating-sm join py-1">
                        <input type="radio" name="rating-app" className="mask mask-star-2 bg-accent" />
                        <span className="text-sm"> &nbsp;{rating}</span>
                    </div>
                </div>
            </div>

        </Link >
    );
}


export default ApplicationCard;
