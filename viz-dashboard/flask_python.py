import numpy as np
import pandas as pd

from sklearn.preprocessing import MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans

from sklearn.manifold import MDS
from sklearn.metrics.pairwise import pairwise_distances

from flask import Flask, render_template, send_from_directory
from flask import  render_template, Flask
import json

#app = Flask(__name__)
app = Flask(__name__, static_url_path='', static_folder='my-app/build')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/data_energy')
def data_energy():
	data = pd.read_csv("WEC_Short_1.csv")
	features = data.columns
	return {
		'features': features.tolist(),
		'data': data.to_dict(orient='records')
	}

if __name__ == '__main__':
	app.debug = True
	app.run(port=5002)
