from flask import Flask, flash, jsonify, request, redirect, url_for, render_template
import os
import easyocr

app = Flask(__name__)

UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route("/")
def home():
    return render_template('index2.html')


@app.route("/upload", methods=['POST'])
def upload_image():
    if 'file' not in request.files:
        return jsonify({'error': request.files}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
    file.save(file_path)

    # return jsonify({'message': 'File uploaded successfully', 'file_path': file_path})

    reader = easyocr.Reader(['en'])  # specify the language
    result = reader.readtext(file_path)

    extracted_texts = []

    for (bbox, text, prob) in result:
        extracted_texts.append(text)

    if extracted_texts:
        # return (f'<h1>Card Type: {result[0][1]}</h1>')
        return jsonify({'message': extracted_texts, 'file_path': file_path})


if __name__ == "__main__":
    app.run(debug=True)