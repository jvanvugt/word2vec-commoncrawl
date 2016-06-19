from flask import Flask, url_for, jsonify
from model import *

app = Flask(__name__)
model = Word2VecModel('word2vecmodel.csv', 'embeddings.csv')

@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.route('/synonyms/<query>')
def synonyms(query):
    synonyms = model.synonyms(query)
    if len(synonyms) == 5:
        return jsonify(synonyms=synonyms)
    else:
        return jsonify(error=synonyms[0]), 403