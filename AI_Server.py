# Import flask and datetime module for showing date and time
from flask import Flask, request
import requests
import datetime
import tensorflow as tf
import numpy as np

from flask_cors import CORS, cross_origin

x = datetime.datetime.now()

# Initializing flask app
app = Flask(__name__)

cors= CORS(app)
app.config['CORS_HEADERS'] = 'Content_Type'

# model = tf.saved_model.load('./feedback_model')
data = {
    'feedback': 'This is my feedback.'
}
# response = requests.post('http://localhost:5000/feedback', data=data)
# print(response.json())


@app.route('/feedback', methods=['POST'])
def process_feedback():
    feedback_text = request.json['feedback']
    # feedback_text = "The wedding hall was good but the overall event was exciting."

    processed_text = preprocess_text(feedback_text)  # Perform any necessary preprocessing on the input text
    model = tf.keras.models.load_model('./feedback_model')

    result = make_prediction(processed_text,model)  # Make a prediction using the loaded model
    print( result)
    prediction_value = result['prediction']
    first_prediction = prediction_value[0]
    if(first_prediction>(-0.4)):
        Result="Good"

    if(first_prediction<(-0.4)):
        Result="Bad"
    return Result

def preprocess_text(text):
    # Implement any text preprocessing steps here
    processed_text = text.lower()  # Convert text to lowercase
    return processed_text

def make_prediction(text, model):
    # Convert the processed text to a format suitable for model input
    input_data = np.array([text])
    # Make the prediction using the loaded model
    prediction = model.predict(input_data)
    # Process the prediction result and return it
    result = {
        'feedback': text,
        'prediction': prediction[0].tolist()  # Convert the prediction to a list or the desired format
    }
    return result



# Route for seeing a data
@app.route('/data')
def get_time():

    # Returning an api for showing in reactjs
    return {
        'Name':"geek",
        "Age":"22",
        "Date":x,
        "programming":"python"
        }

    
# Running app
if __name__ == '__main__':
    app.run(debug=True)
