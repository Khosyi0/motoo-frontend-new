import React, { useRef, useEffect } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

export function Testing() {
    const quillRef = useRef(null);
    const quillInstance = useRef(null);
    const quillReftes = useRef(null);
    const quillInstancetes = useRef(null);

    useEffect(() => {
        if (quillRef.current && !quillInstance.current) {
            quillInstance.current = new Quill(quillRef.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        [{ 'align': [] }],
                        ['link', 'image']
                    ]
                }
            });
        }

        if (quillReftes.current && !quillInstancetes.current) {
            quillInstancetes.current = new Quill(quillReftes.current, {
                theme: 'snow',
                modules: {
                    toolbar: [
                        [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                        ['bold', 'italic', 'underline'],
                        [{ 'align': [] }],
                        ['link', 'image']
                    ]
                }
            });
        }

    }, []); // Dependensi kosong memastikan ini hanya dijalankan sekali

    return (
        <div>
            {/* <div >
                <label className="form-control w-full ">
                    <span className="label-text text-xs font-semibold">Information</span>
                    <textarea className="textarea textarea-bordered h-36"name="information" autoComplete="off"></textarea>
                </label>
            </div>
            <div>
                <label className="form-control w-full ">
                    <span className="label-text text-xs font-semibold">Information</span>
                    <span className="label-text text-xs">(Jangan ditekan jika tidak ada perubahan)</span>
                    <div ref={quillReftes} className="quill-container h-36" name="information" autoComplete="off"/>
                </label>
            </div> */}
            <div>
            <span className="label-text text-xs font-semibold">Information</span>
            <span className="label-text text-xs">(Jangan ditekan jika tidak ada perubahan)</span>
                <div ref={quillRef} className="quill-container h-36" name="information" autoComplete="off"/>
            </div>
        </div>
        
    );
}
