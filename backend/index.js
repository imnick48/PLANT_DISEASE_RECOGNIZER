const express=require('express');
const multer =require('multer');
const path=require('path');
const cors=require('cors');
const mysql=require('mysql2');
const app=express();
app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
    host:'Add YOURS',
    user:'Add YOURS',
    password:'Add YOURS',
    database:'Add YOURS'
})
db.connect((err)=>{
    if(err){
        console.error("Error connecting!"+err);
        return;
    }
    console.log("Connection Established!");
    
})
const storage=multer.diskStorage({
    destination:(req,files,cb)=>{
        cb(null,'upload/');
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname);
    }
})
const upload=multer({
    storage:storage,
})

function uploadinfo(file) {
    fetch('http://0.0.0.0:5175/upload', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ fileurl: file }), 
    })
        .then((response) => response.json())
        .then((data) => {
            console.log('Success:', data); 
        })
        .catch((error) => {
            console.error('Error:', error); 
        });
}

function UploadImages(file){
    const query='INSERT INTO DESEASE_INFO (IMAGES) VALUES(?)';
    db.query(query,[file],(err,result)=>{
        if(err){
            console.log("Error occurred!!");
            return;
        }
        console.log("File added successfully");
    })
}

app.post('/upload',upload.single('image'),(req,res)=>{
    if(!req.file){
        res.status(200).send({message:'no file found'});
    }
    res.send({message:'Successful'});
    console.log(req.file);
    UploadImages(req.file.path);
    uploadinfo(req.file.path);
    
})
app.get('/',(req,res)=>{
    const query='SELECT * FROM DESEASE_INFO';
    db.query(query,(err,response)=>{
        if (err){
            res.status(200).send({message:'Error'})
        }
        res.json(response)
    })
})
app.listen(8000,()=>{
    console.log("Port:8000");
})