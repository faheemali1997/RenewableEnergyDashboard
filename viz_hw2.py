
#%%
import numpy as np
import pandas as pd
import os
from sklearn import preprocessing
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.manifold import MDS
from sklearn.metrics.pairwise import pairwise_distances
from flask import Flask, render_template, request, redirect, Response, jsonify
# %%
from flask import  render_template, Flask
import json
app = Flask(__name__)
@app.route("/", methods = ['POST', 'GET'])
def index():
	return render_template("main.html", data=final_data)

@app.route("/mds",  methods = ['POST', 'GET'])
def mds():
	return render_template("mds.html", data=final_data)

if __name__ == "__main__":
	data_points = 700
	data_x = pd.read_csv("all_players.csv")
	#Selecting only numerical data
	named_features = ["Player", "Club","Position","Games Played","Games Started", "Minutes Played",
	"Goals", "Assists", "Shots", "Shots on Goal", "Fouls Committed", "Fouls Suffered", "Offside", 
	"Yellow Card", "Red Card", "Year"]
	# original_features = data_x.columns
	data_x.columns = named_features
	features = data_x.columns[3:-1]
	# original_features = original_features[3:-1]
	# print(features, original_features)
	# features_name = named_features[3:-1]
	
	only_numeric_data = data_x[features]
	final_data = only_numeric_data[0:data_points]
	final_data_with_catergorical = data_x[0:data_points]
	# print(final_data.shape)
	#%%
	#Standardizing the original data
	standard_data = MinMaxScaler().fit_transform(final_data)
	standard_data = (standard_data * 2) - 1
	#%%
	#Calculation for PCA
	My_PCA = PCA(features.shape[0])
	pca_data = My_PCA.fit_transform(standard_data)
	#Standardizing the data that is in principle component space
	pca_data = MinMaxScaler().fit_transform(pca_data)
	pca_data = (pca_data * 2) - 1
	#The explained variance
	exp_var = np.round(My_PCA.explained_variance_ratio_* 100, decimals=2)
	#Cumulative array for explained variance
	cumsum_exp_var = (np.cumsum(exp_var))
	label = [i for i in range(1,My_PCA.n_components_+1)]
	pca_component_features = ["PC" + str(i) for i in range(1,My_PCA.n_components_+1)]
	#Organizing various dataframes and numpy arrays to send over flask to client side
	final_exp_var = pd.DataFrame(list(zip(label, pca_component_features, exp_var, cumsum_exp_var)), columns=['p_number', 'pc_number','exp_var', 'cumsum_exp_var'])
	data_row_loading = pd.DataFrame(pca_data, columns=pca_component_features)
	attribute_loading = pd.DataFrame(My_PCA.components_.T, columns=pca_component_features)
	attribute_loading.insert(loc=0, column="features", value=features)

	#For MDS
	#Finding the dissimilarity matrix for the data and the attribute
	data_diss = pairwise_distances(standard_data)	#use euclidean distance as default for data
	attr_diss = 1 - final_data.corr()	#finding correlation between attribute of data
	# print(attr_diss.shape)

	#Applying MDS for data_matrix and attribute_matrix
	Data_MDS = MDS(n_components=2, dissimilarity="precomputed")
	Attr_MDS = MDS(n_components=2, dissimilarity="precomputed")
	data_mds = Data_MDS.fit_transform(data_diss)
	attr_mds = Attr_MDS.fit_transform(attr_diss)
	# print(attr_mds.shape)

	#Organizing all the data for MDS in dataframe for sending over flask to client side
	data_mds_df = pd.DataFrame(data_mds, columns=["MDS1","MDS2"])
	attr_mds_df = pd.DataFrame(attr_mds, columns=["MDS1","MDS2"])
	attr_mds_df["features"] = features
	# attr_mds_df["features_name"] = features_name
	# print(attr_mds_df.shape)

	#KMeans clustering on the original data
	model = KMeans(n_clusters=3).fit(only_numeric_data)
	predictions = model.predict(only_numeric_data)
	final_data["clus_number"] = predictions[0:data_points]
	final_data_with_catergorical["clus_number"] = predictions[0:data_points]
	data_mds_df["clus_number"] = predictions[0:data_points]

	#Creating data (json) for sending to client side via Flask
	data = {}
	data["exp_var"] = final_exp_var.to_dict(orient="records")
	data["attribute_loading"] = attribute_loading.to_dict('records')
	data["data_loading"] = data_row_loading.to_dict(orient='records')
	data["original_data"] = final_data.to_dict(orient="records")
	data["original_data_w_catergorical"] = final_data_with_catergorical.to_dict(orient='records')
	data["data_mds"] = data_mds_df.to_dict(orient='records')
	data["attr_mds"] = attr_mds_df.to_dict(orient='records')
	
	json_data = json.dumps(data)
	final_data = {'chart_data': json_data}
	app.debug = True
	app.run(debug=True)

# %%
