import { useEffect, useRef } from "react";
import { useMotionTemplate, useMotionValue, motion, animate } from "framer-motion";
import { BackgroundLines } from "../../Components/ui/background-lines";
import './Homepage.css'
import { useNavigate } from "react-router";
import axios from "axios";


const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];

const Homepage = () => {
    const navigate = useNavigate();
    const fileref = useRef(null);
    const color = useMotionValue(COLORS_TOP[0]);
    const border = useMotionTemplate`1px solid ${color}`;
    const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;
    const handlechats = () => {
        navigate('/chats');
    }
    const handlechange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            uploadFile(file);
            handlechats()
        }
    }
    const handleupload = () => {
        fileref.current.click();
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

    const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

    return (
        <motion.section
            className="w-screen"
            style={{
                backgroundImage,
                backgroundAttachment: "fixed",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="min-h-screen w-screen">
                <BackgroundLines className="flex items-center justify-center w-full flex-col px-4">
                    <h2 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-neutral-900 to-neutral-700 dark:from-neutral-600 dark:to-white text-2xl md:text-4xl lg:text-7xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
                        Rethink the way <br /> You Look at Plants
                    </h2>
                    <div className="flex upload h-[50px] w-[550px]">
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
                            className="rounded-[50vw] upload h-[50px] w-[50%] bg-blue-500 z-50"
                        >
                            Upload
                        </motion.button>
                        <motion.button
                            onClick={handlechats}
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
                            className="rounded-[50vw] upload h-[50px] w-[50%] border-solid border-4 ml-[12px] border-neutral-50 text-neutral-50 z-50"
                        >
                            Open Chat
                        </motion.button>
                    </div>
                </BackgroundLines>
            </div>
        </motion.section>
    );
};

export default Homepage;
