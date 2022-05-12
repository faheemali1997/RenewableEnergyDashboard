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


# This is the route to the main home page ie index.html
@app.route('/')
def index():
    return send_from_directory(app.static_folder, 'index.html')

# @app.route("/", methods = ['POST', 'GET'])
# def main():
# 	return render_template("main.html", data=final_data)


# @app.route("/biplot", methods = ['POST', 'GET'])
# def biplot():
# 	return render_template("biplot.html", data=final_data)


# @app.route("/kmeans", methods = ['POST', 'GET'])
# def kmeans():
# 	return render_template("kmeans.html", data=final_data)


# @app.route("/mds", methods = ['POST', 'GET'])
# def mds():
# 	return render_template("mds.html", data=final_data)

@app.route('/data_info')
def data_info():
	data = pd.read_csv("merged_pgatour.csv")
	features = data.columns
	return {
		'features': features.tolist(),
		'data': data.to_dict(orient='records')
	}

	# features = ["country","country_x","year","biofuel_consumption","coal_consumption","fossil_fuel_consumption","gas_consumption","hydro_consumption","nuclear_consumption","oil_consumption","other_renewable_consumption","renewables_consumption","solar_consumption","wind_consumption",
	# 			"coal_production","gas_production","oil_production",""
	# 			"electricity_generation","population","gdp"
	# 			"biofuel_electricity","coal_electricity","fossil_electricity","gas_electricity","hydro_electricity","nuclear_electricity","oil_electricity","other_renewable_electricity","other_renewable_exc_biofuel_electricity","renewables_electricity","solar_electricity","wind_electricity",
	# 			]

@app.route('/data_energy')
def data_energy():
	data = pd.read_csv("WEC_Short_1.csv")
	features = data.columns
	return {
		'features': features.tolist(),
		'data': data.to_dict(orient='records')
	}

@app.route('/data_info1')
def data_info1():	
	number_of_points = 500
	data_x = pd.read_csv("merged_pgatour.csv")
	#Colums with numerical data
	
	named_features = ["ID", "Name","rounds","scoring","drive_distance", "fwy_%",
	"gir_%", "sg_p", "sg_ttg", "sg_t", "points", "top_10", "1st_pos", 
	"year", "money", "country","latitude","longitude"]

	data_x.columns = named_features
	features = data_x.columns[3:-1]
	
	only_numeric_data = data_x[features]
	final_data = only_numeric_data[0:number_of_points]
	final_data_with_catergorical = data_x[0:number_of_points]

	#Standardizing original data
	standard_data = MinMaxScaler().fit_transform(final_data)
	standard_data = (standard_data * 2) - 1

	#Calculating the PCA
	My_PCA = PCA(features.shape[0])
	pca_data = My_PCA.fit_transform(standard_data)
	#Standardizing the data that is in principle component space
	pca_data = MinMaxScaler().fit_transform(pca_data)
	pca_data = (pca_data * 2) - 1
	#The explained variance
	exp_var = np.round(My_PCA.explained_variance_ratio_* 100, decimals=2)
	#Getting the cumulative array for explained variance
	cumsum_exp_var = (np.cumsum(exp_var))
	label = [i for i in range(1,My_PCA.n_components_+1)]
	pca_component_features = ["PC" + str(i) for i in range(1,My_PCA.n_components_+1)]
	final_exp_var = pd.DataFrame(list(zip(label, pca_component_features, exp_var, cumsum_exp_var)), columns=['p_number', 'pc_number','exp_var', 'cumsum_exp_var'])
	data_row_loading = pd.DataFrame(pca_data, columns=pca_component_features)
	attribute_loading = pd.DataFrame(My_PCA.components_.T, columns=pca_component_features)
	attribute_loading.insert(loc=0, column="features", value=features)


	#MDS Code : Mini Project 2b 
	data_diss = pairwise_distances(standard_data)	
	attr_diss = 1 - final_data.corr()	

	Data_MDS = MDS(n_components=2, dissimilarity="precomputed")
	Attr_MDS = MDS(n_components=2, dissimilarity="precomputed")
	data_mds = Data_MDS.fit_transform(data_diss)
	attr_mds = Attr_MDS.fit_transform(attr_diss)


	data_mds_df = pd.DataFrame(data_mds, columns=["MDS1","MDS2"])
	attr_mds_df = pd.DataFrame(attr_mds, columns=["MDS1","MDS2"])
	attr_mds_df["features"] = features

	# Calculating the Sum of Squared Errors(SSE) for all features
	distortions = []
	K = range(1,12)
	for k in K:
		modelK = KMeans(n_clusters=k).fit(only_numeric_data)
		modelK.fit(only_numeric_data)
		distortions.append({'x':k, 'y':modelK.inertia_/10**15})

	#Performing KMeans clustering on the original data
	model = KMeans(n_clusters=3).fit(only_numeric_data)
	predictions = model.predict(only_numeric_data)
	final_data["clus_number"] = predictions[0:number_of_points]
	final_data_with_catergorical["clus_number"] = predictions[0:number_of_points]
	data_mds_df["clus_number"] = predictions[0:number_of_points]

	#Creating data (json) for sending to client side via Flask
	data = {}
	
	data["exp_var"] = final_exp_var.to_dict(orient="records")
	data["attribute_loading"] = attribute_loading.to_dict('records')
	data["data_loading"] = data_row_loading.to_dict(orient='records')
	data["original_data"] = final_data.to_dict(orient="records")
	data["original_data_w_catergorical"] = final_data_with_catergorical.to_dict(orient='records')
	data["distortions"] = distortions
	data["data_mds"] = data_mds_df.to_dict(orient='records')
	data["attr_mds"] = attr_mds_df.to_dict(orient='records')

	# json_data = json.dumps(data)
	# final_data = {'chart_data': json_data}

	return data


if __name__ == '__main__':
	app.debug = True
	app.run(port=5001)
