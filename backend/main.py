import pickle
import os
import uvicorn
import numpy as np
from fastapi import FastAPI
import mysql.connector
from pydantic import BaseModel
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import load_img, img_to_array
app=FastAPI()
current_path=os.getcwd()

model_path = current_path+"/backend/model.keras"
class_names=pickle.load(open(current_path+'/backend/class_names.pkl','rb'))

model = load_model(model_path)
def preprocess_image(image_path, target_size):
    img = load_img(image_path, target_size=target_size)
    img_array = img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    return img_array

def classify(image_path):
    input_shape = model.input_shape[1:3]
    image = preprocess_image(image_path, target_size=input_shape)
    predictions = model.predict(image)
    predicted_class = np.argmax(predictions, axis=1)[0]
    return class_names[predicted_class]


def get_db():
    return mysql.connector.connect(
        host='Add YOURS',
        user='Add YOURS',
        password='Add YOURS',
        database='Add YOURS'
    )
class FileUpload(BaseModel):
    fileurl:str

@app.post('/upload')
def makeupload(fileurl:FileUpload):
    db=get_db()
    cursor=db.cursor()
    cursor.execute( "UPDATE DESEASE_INFO SET INFO = %s WHERE IMAGES = %s",(classify(current_path + '/backend/' + fileurl.fileurl), fileurl.fileurl))
    db.commit()
    cursor.close()
    db.close()
    return {"message":"Add info successfully"}


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=5175, reload=True)