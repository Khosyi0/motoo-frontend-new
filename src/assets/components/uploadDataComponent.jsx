import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import instance from '../../axios'; // Pre-configured axios instance

const UploadDataComponent = () => {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            alert("Please upload a file first.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            console.log("Extracted JSON data:", jsonData);

            // Define the required fields and their default values
            const requiredFields = {
                short_name: '', 
                long_name: '', 
                description: '', 
                business_process: '', 
                platform: 'web', // Assume default platform
                status: 'up',    // Default status 'up'
                tier: '1',       // Default tier to '1'
                category: '', 
                group_area: '', 
                company: '',
                image: '', // Handle as string, not as a file
                db_connection_path: '', 
                ad_connection_path: '', 
                sap_connection_path: '', 
                technical_doc: '', 
                user_doc: '', 
                other_doc: '', 
                information: '',
                vm_prod: '', 
                vm_dev: '', 
                url_prod: '', 
                url_dev: '', 
                environment: 'production', // Default environment
                virtual_machines: '',
                first_pics: '',
                backup_pics: '',
                pic_icts: '',
                pic_users: '',
                old_pics: '',
                topology: '',
                technology: '', 
                reviews: '',
                user_login: '',
            };

            // Map and validate the JSON data
            const formattedData = jsonData.map((item, index) => {
                const formattedItem = {};

                // Ensure all required fields are present
                for (const [key, defaultValue] of Object.entries(requiredFields)) {
                    formattedItem[key] = item[key] !== undefined ? item[key] : defaultValue;
                    if (Array.isArray(defaultValue) && typeof formattedItem[key] === 'string') {
                        formattedItem[key] = formattedItem[key].split(',');
                    }
                }

                // Log each item for detailed inspection
                console.log(`Formatted item ${index + 1}:`, formattedItem);

                return formattedItem;
            });

            console.log("Validated Data for API:", formattedData);

            try {
                // Use FormData for file upload and data submission
                const formData = new FormData();

                // Append each field to the FormData object
                formattedData.forEach((item, index) => {
                    Object.keys(item).forEach(key => {
                        if (Array.isArray(item[key])) {
                            item[key].forEach(value => formData.append(`${key}[]`, value));
                        } else {
                            // For the `image` field, if the value is a string, skip it
                            if (key === 'image' && typeof item[key] === 'string' && !item[key].match(/\.(jpg|jpeg|png)$/i)) {
                                console.log(`Skipping image field for item ${index + 1}`);
                                return; // Do not append image if it's not a valid file format
                            } else if (key !== 'image') {
                                formData.append(key, item[key]);
                            }
                        }
                    });
                });

                // Ensure 'environment' is always present
                formData.append('environment', 'production');

                // Log FormData entries for debugging
                for (let [key, value] of formData.entries()) {
                    console.log(`${key}: ${value}`);
                }

                // Send the formatted data to the API
                const response = await instance.post('/applications', formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                console.log('Data uploaded successfully', response);
                window.location.reload();
            } catch (error) {
                console.error('Error uploading data', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                    console.error('Response status:', error.response.status);
                    console.error('Response headers:', error.response.headers);
                    alert(`Error uploading data: ${error.response.data.message || error.response.statusText}`);
                } else {
                    alert('An unexpected error occurred.');
                }
            }
        };

        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <button className="btn btn-info btn-sm" onClick={() => document.getElementById('upload_modal').showModal()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 animate-bounce">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                </svg>
                Upload
            </button>
            <dialog id="upload_modal" className="modal">
                <div className="modal-box">
                    <form className="" onSubmit={handleSubmit}>
                        <div>Update data via Excel file</div>
                        <input type="file" className="file-input file-input-sm w-full max-w-xs my-4" onChange={handleFileChange} accept=".xlsx, .xls" />
                        <button type="submit" className="btn btn-success btn-sm mt-2 w-full">Submit</button>
                    </form>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>Close</button>
                </form>
            </dialog>
        </div>
    );
};

export default UploadDataComponent;
