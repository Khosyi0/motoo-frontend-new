import React from 'react';

export function PICCard({ picData, title, className, onViewDetail }) {
    console.log("foto", `http://127.0.0.1:8000${picData.photo}`);
    console.log("data picData", picData);
    console.log("title", title);
    return (
        <div className="card w-60 bg-base-100 shadow-xl">
            <figure>
                <img
                    src={picData.photo ? "http://127.0.0.1:8000" + picData.photo : 'https://i.pinimg.com/564x/58/cc/f0/58ccf0b8588653f63f55e93dc68d7cd0.jpg'}
                    alt={`${title}`}
                    className={className}
                    style={{ height: '300px', width: '100%', objectFit: 'cover' }}
                />
            </figure>
            <div className="card-body flex flex-col items-center">
                {picData.name ? (
                    <>
                        <div>{title}</div>
                        <h1 className="card-title">{picData.name}</h1>
                        <div className="card-actions justify-center items-center">
                            <button
                                className="btn btn-outline btn-sm w-40"
                                onClick={() => onViewDetail(picData, title)}
                            >
                                View Detail
                            </button>
                        </div>
                    </>
                ) : (
                    <p>Loading {title} information...</p>
                )}
            </div>
        </div>
    );
}
