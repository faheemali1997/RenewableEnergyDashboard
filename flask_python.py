import numpy as np
import pandas as pd

from flask import Flask, send_from_directory
from flask import Flask
import json

app = Flask(__name__, static_url_path='', static_folder='my-app/build')

@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/data_energy')
def data_energy():
	data = pd.read_csv("WorldRenewableEnergy.csv")
	features = data.columns
	return {
		'features': features.tolist(),
		'data': data.to_dict(orient='records')
	}

if __name__ == '__main__':
	app.debug = True
	app.run(port=5002)
