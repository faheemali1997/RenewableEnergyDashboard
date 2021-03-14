
#%%
import numpy as np
import pandas as pd
import os
from sklearn import preprocessing
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from flask import Flask, render_template, request, redirect, Response, jsonify
# %%
from flask import  render_template, Flask
import json
app = Flask(__name__)
@app.route("/", methods = ['POST', 'GET'])
def index():
	data_x = pd.read_csv("all_players.csv")
	features = data_x.columns[3:-1]
	final_data = data_x[features]
	final_data = final_data[0:1000]
	print(final_data.shape)
	#%%
	standard_data = MinMaxScaler().fit_transform(final_data)
	standard_data = (standard_data * 2) - 1
	#%%
	My_PCA = PCA(features.shape[0])
	pca_data = My_PCA.fit_transform(standard_data)
	pca_data = MinMaxScaler().fit_transform(pca_data)
	pca_data = (pca_data * 2) - 1
	exp_var = np.round(My_PCA.explained_variance_ratio_* 100, decimals=2)
	cumsum_exp_var = (np.cumsum(exp_var))
	label = [i for i in range(1,My_PCA.n_components_+1)]
	pca_component_features = ["PC" + str(i) for i in range(1,My_PCA.n_components_+1)]
	final_exp_var = pd.DataFrame(list(zip(label, pca_component_features, exp_var, cumsum_exp_var)), columns=['p_number', 'pc_number','exp_var', 'cumsum_exp_var'])
	data_row_loading = pd.DataFrame(pca_data, columns=pca_component_features)
	attribute_loading = pd.DataFrame(My_PCA.components_.T, columns=pca_component_features)
	attribute_loading.insert(loc=0, column="features", value=features)
	dataElbow = final_data.copy()
	model = KMeans(n_clusters=3).fit(dataElbow)
	predictions = model.predict(dataElbow)
	final_data["clus_number"] = predictions

	data = {}
	data["exp_var"] = final_exp_var.to_dict(orient="records")
	data["attribute_loading"] = attribute_loading.to_dict('records')
	data["data_loading"] = data_row_loading.to_dict(orient='records')
	data["original_data"] = final_data.to_dict(orient="records")
	
	json_data = json.dumps(data)
	final_data = {'chart_data': json_data}
	return render_template("main.html", data=final_data)

if __name__ == "__main__":
	app.debug = True
	app.run(debug=True)

# %%
