import React, { useRef, useEffect, useState } from "react";
import Select from 'react-select';
import { Link, NavLink, useNavigate } from "react-router-dom";
import instance from "../../../axios";
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export function ApplicationsAdd() {
    const [loadPage, setLoadPage] = useState(false);
    const [virtualMachine, setVirtualMachine] = useState([]);
    const [groupAreas, setGroupAreas] = useState([]);
    const [companies, setCompanies] = useState([]);
    const [pic, setPIC] = useState([]);
    const [topology, setTopology] = useState([]);
    const [technology, setTechnology] = useState([]);
    const [formPart, setFormPart] = useState(1);

    const fetchData = async () => {
        //fetch user from API
        await instance.get('/user')
            .then((response) => {
                //set response user to state
                (response.data.role !== "admin" ?
                    navigate('/dashboard') : setLoadPage(true))
            })
    }

    const fetchAppsData = async () => {
        //fetch data from API with Axios
        await instance.get("/virtual_machines").then((response) => {
            setVirtualMachine(response.data.data);
        });
        await instance.get("/topologies").then((response) => {
            setTopology(response.data.data);
        });
        await instance.get("/technologies").then((response) => {
            setTechnology(response.data.data);
        });
        await instance.get("/pics").then((response) => {
            setPIC(response.data.data);
        });
        await instance.get("/group_areas").then((response) => {
            setGroupAreas(response.data.data);
        });
        await instance.get("/companies").then((response) => {
            setCompanies(response.data.data);
        });
    };

    const companyOptions = companies.map(company => ({
        value: company.short_name,
        label: company.short_name
    }));

    const backup_picOptions = pic
        .filter(backup_pic => backup_pic.role === 'teknisi')
        .map(backup_pic => ({
            value: backup_pic.id,
            label: backup_pic.name
    }));

    const old_picOptions = pic
        .filter(old_pic => old_pic.role === 'teknisi')
        .map(old_pic => ({
            value: old_pic.id,
            label: old_pic.name
    }));

    const ict_picOptions = pic
        .filter(pic_ict => pic_ict.role === 'client')
        .map(pic_ict => ({
            value: pic_ict.id,
            label: pic_ict.name
    }));

    const user_picOptions = pic
        .filter(pic_user => pic_user.role === 'client')
        .map(pic_user => ({
            value: pic_user.id,
            label: pic_user.name
    }));

    const techOptions = technology.map(technologies => ({
        value: technologies.id,
        label: technologies.group + " - " + technologies.name
    }));

    const topoOptions = topology.map(topologies => ({
        value: topologies.id,
        label: topologies.group + " - " + topologies.link
    }));

    const vmOptions = virtualMachine.map(virtual_machines => ({
        value: virtual_machines.id,
        label: virtual_machines.name
        
    }));

    const [errorMessage, setErrorMessage] = useState("");
    const [showToast, setShowToast] = useState(false);

    const quillRefInfo = useRef(null);
    const quillInstanceInfo = useRef(null);
    const quillRefDesc = useRef(null);
    const quillInstanceDesc = useRef(null);

    useEffect(() => {
        const destroyQuill = () => {
            if (quillInstanceInfo.current) {
                quillInstanceInfo.current.disable();
                quillInstanceInfo.current = null;
            }
            if (quillInstanceDesc.current) {
                quillInstanceDesc.current.disable();
                quillInstanceDesc.current = null;
            }
        };
    
        if (formPart === 4) {
            destroyQuill();
            const initializeQuill = () => {
                if (quillRefInfo.current && !quillInstanceInfo.current) {
                    quillInstanceInfo.current = new Quill(quillRefInfo.current, {
                        theme: 'snow',
                        modules: {
                            toolbar: [
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline'],
                                ['link']
                            ]
                        }
                    });
                    console.log('Quill instance created for info');

                    quillInstanceInfo.current.clipboard.dangerouslyPasteHTML(data.information || '');

                    quillInstanceInfo.current.on('text-change', () => {
                        setData(prevData => ({
                            ...prevData,
                            information: quillInstanceInfo.current.root.innerHTML
                        }));
                    });
                }
    
                if (quillRefDesc.current && !quillInstanceDesc.current) {
                    quillInstanceDesc.current = new Quill(quillRefDesc.current, {
                        theme: 'snow',
                        modules: {
                            toolbar: [
                                [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                ['bold', 'italic', 'underline'],
                                ['link']
                            ]
                        }
                    });
                    console.log('Quill instance created for desc');

                    quillInstanceDesc.current.clipboard.dangerouslyPasteHTML(data.description || '');

                    quillInstanceDesc.current.on('text-change', () => {
                        setData(prevData => ({
                            ...prevData,
                            description: quillInstanceDesc.current.root.innerHTML
                        }));
                    });
                }
            };
    
            initializeQuill();
        }
    }, [formPart]);


    useEffect(() => {
        fetchData();
        fetchAppsData();
    }, []);

    const [imagePreview, setImagePreview] = useState(null);

    const [data, setData] = useState({
        // Define the fields you want to add
        short_name: '', // required
        long_name: '', // required
        description: '', // required
        business_process: '', // required
        platform: 'website', // required, with specific enumerated options
        status: 'up', // required, with specific enumerated options, assuming default 'up'
        tier: '', // required, default set to '1', assuming the lowest level
        category: '', // required, need to select a valid category
        group_area: '', // integer
        company: '',
        image: '', // image file, handle as needed in your form logic
        db_connection_path: '', // required
        ad_connection_path: '', // assuming required, not listed but seems necessary
        sap_connection_path: '', // required
        technical_doc: '', // required
        user_doc: '', // required
        other_doc: '', // required
        information: '', // required, not listed in your snippet but seems important
        vm_prod: '', // required
        vm_dev: '', // required
        url_prod: '', // required
        url_dev: '', // required
        environment: '',
        virtual_machines: '',
        first_pic: '',
        backup_pic: '',
        pic_ict: '',
        pic_user: '',
        old_pic: '',
        topologies: '',
        technologies: '', 
    });

    const handleChange = (e) => {
        setData({ ...data, [e.target.name]: e.target.value });
    };

    const handleSelectCompanyChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        const selectedValuesString = selectedValues.join(', ');

        setData({ ...data, company: selectedValuesString });
    };

    const handleSelectBackUpPICChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setData(prevData => ({
            ...prevData,
            backup_pic: selectedValues
        }));
    };

    const handleSelectOldPICChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setData(prevData => ({
            ...prevData,
            old_pic: selectedValues
        }));
    };

    const handleSelectIctPICChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setData(prevData => ({
            ...prevData,
            pic_ict: selectedValues
        }));
    };

    const handleSelectUserPICChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setData(prevData => ({
            ...prevData,
            pic_user: selectedValues
        }));
    };

    const handleSelectTechChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setData(prevData => ({
            ...prevData,
            technologies: selectedValues
        }));
    };

    const handleSelectTopoChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setData(prevData => ({
            ...prevData,
            topologies: selectedValues
        }));
    };

    const handleSelectVMChange = (selectedOptions) => {
        const selectedValues = selectedOptions.map(option => option.value);
        setData(prevData => ({
            ...prevData,
            virtual_machines: selectedValues
        }));
    };

    const handleData = (e) => {
        const valueArray = Array.from(e.target.selectedOptions, option => option.value);
        setData({ ...data, [e.target.name]: valueArray });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setData({ ...data, [e.target.name]: file });

        // Membuat URL objek untuk preview gambar
        if (file) {
            const fileUrl = URL.createObjectURL(file);
            setImagePreview(fileUrl);
        }
    };

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        // Set default value for environment if not provided
        const environment = data.environment && ['production', 'development'].includes(data.environment) ? data.environment : 'production';
    
        // Modifikasi nama kunci sebelum menambahkannya ke FormData
        Object.entries(data).forEach(([key, value]) => {
            // Ubah nama kunci sesuai kebutuhan
            let newKey = key;
            if (key === 'first_pic') {
                newKey = 'first_pics';
            } else if (key === 'backup_pic') {
                newKey = 'backup_pics';
            } else if (key === 'old_pic') {
                newKey = 'old_pics';
            } else if (key === 'pic_user') {
                newKey = 'pic_users';
            } else if (key === 'pic_ict') {
                newKey = 'pic_icts';
            } else if (key === 'technologies') {
                newKey = 'technology';
            } else if (key === 'topologies') {
                newKey = 'topology';
            }
    
            if (Array.isArray(value)) {
                value.forEach(item => formData.append(`${newKey}[]`, item));
            } else {
                if (newKey === 'image' && value instanceof File) {
                    formData.append(newKey, value);
                } else if (newKey !== 'image') {
                    formData.append(newKey, value);
                }
            }
        });
    
        // Pastikan environment dimasukkan
        formData.append('environment', environment);
        
        // Log FormData entries untuk debugging
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }
        
        try {
            formData.append('_method', 'POST');
            const response = await instance.post('/applications', formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log('Response:', response);
            navigate('/dashboard/applications', { state: { successMessage: "Data updated successfully" } });
        } catch (error) {
            console.error('Error updating data', error);
    
            let errorMessage = "Error adding data.";
            errorMessage += " Make sure to fill in all the sections!";
    
            setErrorMessage(errorMessage);
            setShowToast(true);
    
            setTimeout(() => {
                setShowToast(false);
            }, 3000);
    
            if (error.response && error.response.status === 422) {
                console.log('Validation error details:', error.response.data);
            }
        }
    };    

    const renderFormPart = () => {
        switch (formPart) {
            case 1:
                return (
                    <div className="grid grid-cols-1 gap-4 py-2">
                        <div className="grid grid-cols-1 gap-4 py-2">
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Short Name</span>
                                    <input type="text" value={data.short_name} onChange={handleChange} name="short_name" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Long Name</span>
                                    <input type="text" value={data.long_name} onChange={handleChange} name="long_name" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <span className="label-text text-xs font-semibold">Application's Icon</span>
                            <div className="grid grid-cols-1 p-4 border border-gray-300 rounded-lg bg-white">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="md:col-span-1">
                                        <label className="form-control w-full">
                                            <span className="label-text text-xs font-semibold">Upload Image</span>
                                            <input type="file" className="file-input file-input-sm file-input-bordered w-full" name="image" onChange={handleFileChange} />
                                        </label>
                                    </div>
                                </div>
                                {imagePreview && (
                                    <div className="label-text text-xs font-semibold mt-2">
                                        Image Preview
                                        <img 
                                            src={imagePreview} 
                                            alt="Preview" 
                                            style={{ 
                                                maxWidth: '100%', 
                                                maxHeight: '40px',
                                                objectFit: 'contain'
                                            }} 
                                            className="border rounded"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">URL Dev</span>
                                    <input type="text" value={data.url_dev} onChange={handleChange} name="url_dev" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">URL Prod</span>
                                    <input type="text" value={data.url_prod} onChange={handleChange} name="url_prod" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">VM Dev</span>
                                    <input type="text" value={data.vm_dev} onChange={handleChange} name="vm_dev" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">VM Prod</span>
                                    <input type="text" value={data.vm_prod} onChange={handleChange} name="vm_prod" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-2">
                            <div>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Platform</span>
                                    <select className="select select-bordered select-sm" name="platform" value={data.platform} onChange={handleChange}>

                                        <option value="website">Website</option>
                                        <option value="mobile">Mobile</option>
                                        <option value="dekstop">Dekstop</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full max-w-lg">
                                    <span className="label-text text-xs font-semibold">Status</span>
                                    <select className="select select-bordered select-sm" name="status" value={data.status} onChange={handleChange}>
                                        <option value="up">UP</option>
                                        <option value="down">DOWN</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Tier</span>
                                    <select className="select select-bordered select-sm" name="tier" value={data.tier} onChange={handleChange}>
                                    <option value="">Select tier</option>
                                        {[...Array(10)].map((_, index) => (
                                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Category</span>
                                    <select className="select select-bordered select-sm" name="category" value={data.category} onChange={handleChange}>
                                    <option value="">Select category</option>
                                    <option value="sap">SAP</option>
                                    <option value="non_sap">Non SAP</option>
                                    <option value="turunan">Turunan</option>
                                    <option value="ot/it">OT/IT</option>
                                    <option value="collaboration">Collaboration</option>
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Group Area</span>
                                    <select className="select select-bordered select-sm" 
                                            name="group_area" 
                                            value={data.group_area} 
                                            onChange={handleChange}>
                                    <option value="">Select Group </option>
                                    {groupAreas.map((el, index) => (
                                        <option key={index} value={el.id}>{el.short_name}</option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">User Login</span>
                                    <select className="select select-bordered select-sm" name="user_login" value={data.user_login} onChange={handleChange}>
                                    <option value="">Select user login</option>
                                    <option value="login sso">login sso</option>
                                    <option value="login ad">login ad</option>
                                    <option value="internal apps">internal apps</option>
                                    </select>
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
                            <div>
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Environment</span>
                                    <select className="select select-bordered select-sm" name="environment" value={data.environment} onChange={handleChange}>
                                    <option value="">Select Environment</option>
                                    <option value="production">Production</option>
                                    <option value="development">Development</option>
                                    </select>
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Business Process</span>
                                    <input type="text" value={data.business_process} onChange={handleChange} name="business_process" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">Virtual Machine</span>
                                    <Select
                                        options={vmOptions}
                                        isMulti
                                        value={vmOptions.filter(option => Array.isArray(data.virtual_machines) && data.virtual_machines.includes(option.value))}
                                        onChange={handleSelectVMChange}
                                        placeholder="Select Virtual Machine"
                                        className="w-full"
                                        classNamePrefix="select"
                                        styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            padding: '0.25rem',
                                            borderColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.5rem',
                                            boxShadow: 'none',
                                            '&:hover': {
                                            borderColor: 'rgba(96, 165, 250)',
                                            },
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected
                                            ? 'rgba(96, 165, 250, 0.2)'
                                            : state.isFocused
                                            ? 'rgba(229, 231, 235, 0.4)'
                                            : undefined,
                                            '&:hover': {
                                            backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                            },
                                        }),
                                        multiValue: (provided) => ({
                                            ...provided,
                                            backgroundColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.25rem',
                                            padding: '2px 4px',
                                        }),
                                        multiValueLabel: (provided) => ({
                                            ...provided,
                                            color: 'rgba(31, 41, 55)',
                                        }),
                                        multiValueRemove: (provided) => ({
                                            ...provided,
                                            color: 'rgba(107, 114, 128)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                            color: 'rgba(31, 41, 55)',
                                            backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                            },
                                        }),
                                        }}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">Company</span>
                                    <Select
                                        options={companyOptions}
                                        isMulti
                                        value={companyOptions.filter(option => data.company.includes(option.value))}
                                        onChange={handleSelectCompanyChange}
                                        placeholder="Select Companies"
                                        className="w-full"
                                        classNamePrefix="select"
                                        styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            padding: '0.25rem',
                                            borderColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.5rem',
                                            boxShadow: 'none',
                                            '&:hover': {
                                            borderColor: 'rgba(96, 165, 250)',
                                            },
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected
                                            ? 'rgba(96, 165, 250, 0.2)'
                                            : state.isFocused
                                            ? 'rgba(229, 231, 235, 0.4)'
                                            : undefined,
                                            '&:hover': {
                                            backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                            },
                                        }),
                                        multiValue: (provided) => ({
                                            ...provided,
                                            backgroundColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.25rem',
                                            padding: '2px 4px',
                                        }),
                                        multiValueLabel: (provided) => ({
                                            ...provided,
                                            color: 'rgba(31, 41, 55)',
                                        }),
                                        multiValueRemove: (provided) => ({
                                            ...provided,
                                            color: 'rgba(107, 114, 128)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                            color: 'rgba(31, 41, 55)',
                                            backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                            },
                                        }),
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <div>
                            <label className="form-control w-full">
                                <span className="label-text text-xs font-semibold">PIC Technician First</span>
                                <select className="select select-bordered select-sm" name="first_pic" value={data.first_pic} onChange={handleChange}>
                                    <option value="" disabled>Select First PIC</option>
                                    {pic.filter(el => el.role === 'teknisi').map((el) => (
                                        <option key={el.id} value={el.id}>{el.name}</option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">PIC Technician Backup</span>
                                    <Select
                                        options={backup_picOptions}
                                        isMulti
                                        value={backup_picOptions.filter(option => Array.isArray(data.backup_pic) && data.backup_pic.includes(option.value))}
                                        onChange={handleSelectBackUpPICChange}
                                        placeholder="Select PIC Technician Backup"
                                        className="w-full"
                                        classNamePrefix="select"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: '0.25rem',
                                                borderColor: 'rgba(209, 213, 219)',
                                                borderRadius: '0.5rem',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    borderColor: 'rgba(96, 165, 250)',
                                                },
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected
                                                    ? 'rgba(96, 165, 250, 0.2)'
                                                    : state.isFocused
                                                    ? 'rgba(229, 231, 235, 0.4)'
                                                    : undefined,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                                },
                                            }),
                                            multiValue: (provided) => ({
                                                ...provided,
                                                backgroundColor: 'rgba(209, 213, 219)',
                                                borderRadius: '0.25rem',
                                                padding: '2px 4px',
                                            }),
                                            multiValueLabel: (provided) => ({
                                                ...provided,
                                                color: 'rgba(31, 41, 55)',
                                            }),
                                            multiValueRemove: (provided) => ({
                                                ...provided,
                                                color: 'rgba(107, 114, 128)',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: 'rgba(31, 41, 55)',
                                                    backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                                },
                                            }),
                                        }}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">PIC Old Technician</span>
                                    <Select
                                        options={old_picOptions}
                                        isMulti
                                        value={old_picOptions.filter(option => Array.isArray(data.old_pic) && data.old_pic.includes(option.value))}
                                        onChange={handleSelectOldPICChange}
                                        placeholder="Select PIC Old Technician"
                                        className="w-full"
                                        classNamePrefix="select"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: '0.25rem',
                                                borderColor: 'rgba(209, 213, 219)',
                                                borderRadius: '0.5rem',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    borderColor: 'rgba(96, 165, 250)',
                                                },
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected
                                                    ? 'rgba(96, 165, 250, 0.2)'
                                                    : state.isFocused
                                                    ? 'rgba(229, 231, 235, 0.4)'
                                                    : undefined,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                                },
                                            }),
                                            multiValue: (provided) => ({
                                                ...provided,
                                                backgroundColor: 'rgba(209, 213, 219)',
                                                borderRadius: '0.25rem',
                                                padding: '2px 4px',
                                            }),
                                            multiValueLabel: (provided) => ({
                                                ...provided,
                                                color: 'rgba(31, 41, 55)',
                                            }),
                                            multiValueRemove: (provided) => ({
                                                ...provided,
                                                color: 'rgba(107, 114, 128)',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: 'rgba(31, 41, 55)',
                                                    backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                                },
                                            }),
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <hr style={{ height: '0.5px', backgroundColor: 'gray', border: 'none' }} className="my-2" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                        <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">PIC USER</span>
                                    <Select
                                        options={user_picOptions}
                                        isMulti
                                        value={user_picOptions.filter(option => Array.isArray(data.pic_user) && data.pic_user.includes(option.value))}
                                        onChange={handleSelectUserPICChange}
                                        placeholder="Select PIC USER"
                                        className="w-full"
                                        classNamePrefix="select"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: '0.25rem',
                                                borderColor: 'rgba(209, 213, 219)',
                                                borderRadius: '0.5rem',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    borderColor: 'rgba(96, 165, 250)',
                                                },
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected
                                                    ? 'rgba(96, 165, 250, 0.2)'
                                                    : state.isFocused
                                                    ? 'rgba(229, 231, 235, 0.4)'
                                                    : undefined,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                                },
                                            }),
                                            multiValue: (provided) => ({
                                                ...provided,
                                                backgroundColor: 'rgba(209, 213, 219)',
                                                borderRadius: '0.25rem',
                                                padding: '2px 4px',
                                            }),
                                            multiValueLabel: (provided) => ({
                                                ...provided,
                                                color: 'rgba(31, 41, 55)',
                                            }),
                                            multiValueRemove: (provided) => ({
                                                ...provided,
                                                color: 'rgba(107, 114, 128)',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: 'rgba(31, 41, 55)',
                                                    backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                                },
                                            }),
                                        }}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">PIC ICT</span>
                                    <Select
                                        options={ict_picOptions}
                                        isMulti
                                        value={ict_picOptions.filter(option => Array.isArray(data.pic_ict) && data.pic_ict.includes(option.value))}
                                        onChange={handleSelectIctPICChange}
                                        placeholder="Select PIC ICT"
                                        className="w-full"
                                        classNamePrefix="select"
                                        styles={{
                                            control: (provided) => ({
                                                ...provided,
                                                padding: '0.25rem',
                                                borderColor: 'rgba(209, 213, 219)',
                                                borderRadius: '0.5rem',
                                                boxShadow: 'none',
                                                '&:hover': {
                                                    borderColor: 'rgba(96, 165, 250)',
                                                },
                                            }),
                                            option: (provided, state) => ({
                                                ...provided,
                                                backgroundColor: state.isSelected
                                                    ? 'rgba(96, 165, 250, 0.2)'
                                                    : state.isFocused
                                                    ? 'rgba(229, 231, 235, 0.4)'
                                                    : undefined,
                                                '&:hover': {
                                                    backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                                },
                                            }),
                                            multiValue: (provided) => ({
                                                ...provided,
                                                backgroundColor: 'rgba(209, 213, 219)',
                                                borderRadius: '0.25rem',
                                                padding: '2px 4px',
                                            }),
                                            multiValueLabel: (provided) => ({
                                                ...provided,
                                                color: 'rgba(31, 41, 55)',
                                            }),
                                            multiValueRemove: (provided) => ({
                                                ...provided,
                                                color: 'rgba(107, 114, 128)',
                                                cursor: 'pointer',
                                                '&:hover': {
                                                    color: 'rgba(31, 41, 55)',
                                                    backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                                },
                                            }),
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="grid grid-cols-1 gap-4 py-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">Technology</span>
                                    <Select
                                        options={techOptions}
                                        isMulti
                                        value={techOptions.filter(option => Array.isArray(data.technologies) && data.technologies.includes(option.value))}
                                        onChange={handleSelectTechChange}
                                        placeholder="Select Technology"
                                        className="w-full"
                                        classNamePrefix="select"
                                        styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            padding: '0.25rem',
                                            borderColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.5rem',
                                            boxShadow: 'none',
                                            '&:hover': {
                                            borderColor: 'rgba(96, 165, 250)',
                                            },
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected
                                            ? 'rgba(96, 165, 250, 0.2)'
                                            : state.isFocused
                                            ? 'rgba(229, 231, 235, 0.4)'
                                            : undefined,
                                            '&:hover': {
                                            backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                            },
                                        }),
                                        multiValue: (provided) => ({
                                            ...provided,
                                            backgroundColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.25rem',
                                            padding: '2px 4px',
                                        }),
                                        multiValueLabel: (provided) => ({
                                            ...provided,
                                            color: 'rgba(31, 41, 55)',
                                        }),
                                        multiValueRemove: (provided) => ({
                                            ...provided,
                                            color: 'rgba(107, 114, 128)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                            color: 'rgba(31, 41, 55)',
                                            backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                            },
                                        }),
                                        }}
                                    />
                                </label>
                            </div>
                            <div>
                                <label className="form-control w-full">
                                    <span className="label-text text-xs font-semibold">Topology</span>
                                    <Select
                                        options={topoOptions}
                                        isMulti
                                        value={topoOptions.filter(option => Array.isArray(data.topologies) && data.topologies.includes(option.value))}
                                        onChange={handleSelectTopoChange}
                                        placeholder="Select Topology"
                                        className="w-full"
                                        classNamePrefix="select"
                                        styles={{
                                        control: (provided) => ({
                                            ...provided,
                                            padding: '0.25rem',
                                            borderColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.5rem',
                                            boxShadow: 'none',
                                            '&:hover': {
                                            borderColor: 'rgba(96, 165, 250)',
                                            },
                                        }),
                                        option: (provided, state) => ({
                                            ...provided,
                                            backgroundColor: state.isSelected
                                            ? 'rgba(96, 165, 250, 0.2)'
                                            : state.isFocused
                                            ? 'rgba(229, 231, 235, 0.4)'
                                            : undefined,
                                            '&:hover': {
                                            backgroundColor: 'rgba(229, 231, 235, 0.5)',
                                            },
                                        }),
                                        multiValue: (provided) => ({
                                            ...provided,
                                            backgroundColor: 'rgba(209, 213, 219)',
                                            borderRadius: '0.25rem',
                                            padding: '2px 4px',
                                        }),
                                        multiValueLabel: (provided) => ({
                                            ...provided,
                                            color: 'rgba(31, 41, 55)',
                                        }),
                                        multiValueRemove: (provided) => ({
                                            ...provided,
                                            color: 'rgba(107, 114, 128)',
                                            cursor: 'pointer',
                                            '&:hover': {
                                            color: 'rgba(31, 41, 55)',
                                            backgroundColor: 'rgba(229, 231, 235, 0.4)',
                                            },
                                        }),
                                        }}
                                    />
                                </label>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">DB Connection Path</span>
                                    <input type="text" value={data.db_connection_path} onChange={handleChange} name="db_connection_path" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">SAP Connection Path</span>
                                    <input type="text" value={data.sap_connection_path} onChange={handleChange} name="sap_connection_path" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">AD Connection Path</span>
                                    <input type="text" value={data.ad_connection_path} onChange={handleChange} name="ad_connection_path" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>

                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">User Doc</span>
                                    <input type="text" value={data.user_doc} onChange={handleChange} name="user_doc" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Technical Doc</span>
                                    <input type="text" value={data.technical_doc} onChange={handleChange} name="technical_doc" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                            <div >
                                <label className="form-control w-full ">
                                    <span className="label-text text-xs font-semibold">Other Doc</span>
                                    <input type="text" value={data.other_doc} onChange={handleChange} name="other_doc" className="input input-bordered input-sm w-full" autoComplete="off" />
                                </label>
                            </div>
                        </div>
                        <div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div >
                                    <span className="label-text text-xs font-semibold">Description</span>
                                    <div ref={quillRefDesc} className="quill-container h-36" value={data.description} onChange={handleChange} name="description" autoComplete="off"/>
                                </div>
                                <div >
                                    <span className="label-text text-xs font-semibold">Information</span>
                                    <div ref={quillRefInfo} className="quill-container h-36" value={data.information} onChange={handleChange} name="information" autoComplete="off"/>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderPartDesc = () => {
        switch (formPart) {
            case 1:
                return (
                    <div>
                        <div className="text-xl font-bold pl-16 mt-2">Add Application</div>
                        <div className="text-sm text-gray-500 pl-16">Fill the Application Name, Image, and the URLs</div>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <div className="text-xl font-bold pl-16 mt-2">Add Application</div>
                        <div className="text-sm text-gray-500 pl-16">Fill the Application Details</div>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <div className="text-xl font-bold pl-16 mt-2">Add Application</div>
                        <div className="text-sm text-gray-500 pl-16">Select the PIC</div>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <div className="text-xl font-bold pl-16 mt-2">Add Application</div>
                        <div className="text-sm text-gray-500 pl-16">Select the Technology, Topology, Connection Path, Doc, Description and Information</div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderSteps = () => {
        switch (formPart) {
            case 1:
                return (
                    <div>
                        <ul className="steps mr-6 mb-4">
                            <li className="step step-primary">Basic Info</li>
                            <li className="step">Details</li>
                            <li className="step">PIC</li>
                            <li className="step">Tech & Others</li>
                        </ul>
                    </div>
                );
            case 2:
                return (
                    <div>
                        <ul className="steps mr-6 mb-4">
                            <li className="step step-primary">Basic Info</li>
                            <li className="step step-primary">Details</li>
                            <li className="step">PIC</li>
                            <li className="step">Tech & Others</li>
                        </ul>
                    </div>
                );
            case 3:
                return (
                    <div>
                        <ul className="steps mr-6 mb-4">
                            <li className="step step-primary">Basic Info</li>
                            <li className="step step-primary">Details</li>
                            <li className="step step-primary">PIC</li>
                            <li className="step">Tech & Others</li>
                        </ul>
                    </div>
                );
            case 4:
                return (
                    <div>
                        <ul className="steps mr-6 mb-4">
                            <li className="step step-primary">Basic Info</li>
                            <li className="step step-primary">Details</li>
                            <li className="step step-primary">PIC</li>
                            <li className="step step-primary">Tech & Others</li>
                        </ul>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        loadPage && (
            <>
                {showToast && (
                    <div className="toast">
                        <div className="alert alert-error">
                            <span>{errorMessage}</span>
                        </div>
                    </div>
                )}
                <div className="w-full flex items-center justify-between">
                    <div>
                        {renderPartDesc()}
                    </div>
                    <div className="flex items-center gap-2 pr-16 mt-2">
                        <Link to="/dashboard/applications" className="btn btn-primary btn-sm">
                            Cancel
                        </Link>
                        <button onClick={handleSubmit} className="btn btn-success btn-sm">
                            Save
                        </button>
                    </div>
                </div>
                <hr className="my-2 " />
                <div className="pl-16 pr-16">
                    <form>
                        {renderFormPart()}
                        <div className="flex justify-between mt-4">
                            <button type="button" disabled={formPart === 1} onClick={() => setFormPart(formPart - 1)} className="btn btn-secondary btn-sm mt-2">
                                Previous
                            </button>
                            {renderSteps()}
                            {formPart < 4 && (
                                <button type="button" onClick={() => setFormPart(formPart + 1)} className="btn btn-secondary btn-sm mt-2">
                                    Next
                                </button>
                            )}
                            {formPart === 4 && (
                                <button type="button" onClick={handleSubmit} className="btn btn-success btn-sm mt-2">
                                    Save
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </>
        )
    );
    
}