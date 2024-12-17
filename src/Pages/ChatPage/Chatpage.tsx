import { animate, motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import './Chatpage.css';
import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

export default function Chatpage() {
    const color = useMotionValue(COLORS_TOP[0]);
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
    const fileref = useRef(null);
    const [data, setData] = useState([]);
    const handlechange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file);
        }
    }
    const handleupload = () => {
        fileref.current.click()
    }
    const uploadFile = async (file: any) => {
        const formData = new FormData();
        formData.append('image', file);
        try {
            const response = await axios.post('http://localhost:8000/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }

            });
            console.log('successfully uploaded');
        }
        catch (error) {
            console.log("Error!!");

        }
    }
    useEffect(() => {
        animate(color, COLORS_TOP, {
            ease: "easeInOut",
            duration: 10,
            repeat: Infinity,
            repeatType: "mirror",
        });
    }, []);
    useEffect(() => {
        fetch('http://localhost:8000/')
            .then((res) => {
                if (!res.ok) {
                    throw new Error('Network response was not ok');
                }
                return res.json();
            }).then((data) => {
                setData(data)

            }).catch((err) => {
                console.error(err);
            })
    }, [handlechange])
    return (
        <motion.div
            className="flex flex-col justify-between min-h-screen overflow-hidden pb-[30vh]" // Added padding bottom
            style={{
                backgroundImage,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className='h-[70vh] overflow-auto'>
                {data.map((item: any, index) => (
                    <div key={index} className="w-full h-[70vh] overflow-y-auto overflow-x-hidden">
                        <div className="flex justify-start h-fit w-full m-[30px]">
                            <div className="rounded-[20px] h-fit w-fit bg-white py-[20px] px-[20px] max-w-[40vw]">
                                <img
                                    src={`./../../backend/${item.IMAGES}`}
                                    alt="Descriptive alt text"
                                    className="w-full h-auto rounded-[10px]"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end h-fit w-full">
                            <div className="pr-[40px] rounded-[20px] h-fit w-fit bg-[#808080] py-[50px] pl-[30px] max-w-[40vw] mr-[30px] text-white text-sm">
                                {item.INFO}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Sticky div at the bottom of the screen */}
            <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center h-[30vh] w-full bg-transparent p-[20px]">
                <input
                    type="file"
                    ref={fileref}
                    style={{ display: 'none' }}
                    onChange={handlechange}
                />
                <motion.button
                    onClick={handleupload}
                    style={{
                        border,
                        boxShadow,
                    }}
                    whileHover={{
                        scale: 1.015,
                    }}
                    whileTap={{
                        scale: 0.985,
                    }}
                    className="h-[6vh] w-[30vw] min-w-[600px] rounded-[50vw] text-neutral-50"
                >
                    Upload
                </motion.button>
            </div>
        </motion.div>
    );

}
