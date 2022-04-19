import pandas as pd

df1 = pd.read_csv("/Users/faheemali/Desktop/MastersLocal/SEM2/BP-CSE522/project/CSE564Vis-SourceCode/pgatour_cleaned.csv")

df2 = pd.read_csv('~/Desktop/data.csv')

df1['country']=df1['country'].str.strip()
df2['country']=df2['country'].str.strip()

df3 = pd.merge(df1, df2, on="country")

df3.to_csv('~/Desktop/merged_pgatour.csv',index=False)
