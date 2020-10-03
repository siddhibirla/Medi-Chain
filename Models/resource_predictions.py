import csv
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from statsmodels.tsa.base.datetools import dates_from_str
import datetime
import time
from sklearn import svm
import json


feature_file_cases = '/Users/edwardgent/Downloads/NYT_US_COVID19.csv'
feature_file_tests = '/Users/edwardgent/Downloads/CT_US_COVID_TESTS.csv'
results_file = '/Users/edwardgent/Downloads/COVID-19_Hospital_Capacity_Metrics.csv'
test_threshold = 0.7


dataf = pd.DataFrame(columns=['New Cases', 'New Deaths', 'New Tests', 'Ventilators', 'ICU'])

chicago_cases = []
chicago_deaths = []
chicago_dates = []
chicago_ventilators = []
chicago_icu = []
chicago_tests = []

with open(feature_file_cases, newline='') as fh:
    spamreader = csv.reader(fh, delimiter=',', quotechar='|')
    for item in spamreader:
        if item[2] == 'Illinois':
            chicago_cases.append(item[8])
            chicago_deaths.append(item[9])
            chicago_dates.append(item[0])
fh.close()
chicago_dates = dates_from_str(chicago_dates)
dataf['New Cases'] = chicago_cases
dataf['New Deaths'] = chicago_deaths
dataf.index = pd.DatetimeIndex(chicago_dates)

temp_dates = []
with open(feature_file_tests, newline='') as fh:
    spamreader = csv.reader(fh, delimiter=',', quotechar='|')
    for item in spamreader:
        if item[1] == 'Illinois':
            chicago_tests.append(item[14])
            temp_dates.append(item[2].split(' ')[0])
fh.close()

temp_dates = dates_from_str(temp_dates)

temp_df = pd.DataFrame(columns=['New Tests'])

temp_df['New Tests'] = chicago_tests

temp_df.index =pd.DatetimeIndex(temp_dates)

dataf = dataf.join(temp_df, lsuffix='_caller', rsuffix='_other')
dataf = dataf[~dataf.index.duplicated(keep='first')]

temp_dates = []
with open(results_file, newline='') as fh:
    spamreader = csv.reader(fh, delimiter=',', quotechar='|')
    for item in spamreader:
        if item[0] == 'Date':
            pass
        else:
            chicago_icu.append(item[14])
            chicago_ventilators.append(item[1])
            temp_dates.append(item[0].replace('/','-'))

fh.close()

temp_dates = dates_from_str(temp_dates)

temp_df = pd.DataFrame(columns=['Ventilators', 'ICU'])

temp_df['Ventilators'] = chicago_ventilators
temp_df['ICU'] = chicago_icu
temp_df.index = pd.DatetimeIndex(temp_dates)

dataf = dataf.join(temp_df, lsuffix='_caller', rsuffix='_other')
dataf = dataf[~dataf.index.duplicated(keep='first')]

def generate_model(dataf, train_col, train_features):
    model = svm.SVC(probability=False, decision_function_shape='ovr', kernel='linear')
    target_length = len(dataf['New Cases'])
    target_length = int(test_threshold * target_length)
    '''
    cols_cases = dataf['New Cases']
    cols_cases = cols_cases.tolist()[0:target_length]
    cols_deaths = dataf['New Deaths']
    cols_deaths = cols_deaths.tolist()[0:target_length]
    cols_tests = dataf['New Tests_other']
    cols_tests = cols_tests.tolist()[0:target_length]
    feature_set = zip(cols_cases,cols_deaths,cols_tests)
    feature_set = np.array(list(feature_set))
    feature_set.reshape(133,3)
    train_res = train_res.reshape(133,211)
    train_res = train_res.ravel()
    train_res_new = np.array_split(train_res, 133)
    '''
    #train_features = train_data[:,[3,4]].toarray()
    #train_res = train_data[:,[1,2]].toarray()
    #train_res = np.array(np.split(train_res,133))
    '''
    train_res_list = []
    for item in train_res:
        s = item[0]
        train_res_list.append(''.join(str(s)))
    print(train_res_list)
    train_res = np.array(train_res_list)
    '''
    #train_res = train_res.reshape(133,211,1)
    print(train_col)
    #train_features = train_features.reshape(-1,1)
    #train_res = train_res.reshape(-1,1)
    print(train_features)
    model.fit(train_features, np.array(train_col))
    return model

def encode_results(dataf):
    target_length = len(dataf['Ventilators_other'])
    target_length = int(test_threshold*target_length)
    cols_vent = dataf['Ventilators_other']
    cols_vent = cols_vent.tolist()[0:target_length]
    cols_icu = dataf['ICU_other']
    cols_icu = cols_icu.tolist()[0:target_length]
    backup_cols_vent = dataf['Ventilators_other'][target_length+1:-1]
    backup_cols_icu = dataf['ICU_other'][target_length+1:-1]
    dataf.drop(columns=['Ventilators_other', 'ICU_other'], inplace=True)
    cols_cases = dataf['New Cases'][0:target_length]
    cols_tests = dataf['New Tests_other'][0:target_length]
    cols_deaths = dataf['New Deaths'][0:target_length]
    backup_cols_cases = dataf['New Cases'][target_length+1:-1]
    backup_cols_deaths = dataf['New Deaths'][target_length+1:-1]
    backup_features = zip(backup_cols_deaths, backup_cols_cases)
    backup_features = np.array(list(backup_features))
    backup_features = backup_features.astype('int32')

    train_icu = cols_icu
    train_vent = cols_vent
    train_features = zip(cols_deaths, cols_cases)
    data_backup = zip(backup_cols_deaths,backup_cols_cases)
    data_backup = np.array(list(data_backup))
    data_backup = data_backup.astype('int32')


    train_features = np.array(list(train_features)).astype('int32')
    n_data=[]

    for i in train_features:
        n_data.append(list([int(j) for j in i]))
    train_features = n_data #np.array(n_data)
    for item in train_features:
        for val in item:
            item[item.index(val)] = int(val)
    for item in train_vent:
        train_vent[train_vent.index(item)] = int(item)
    for item in train_icu:
        train_icu[train_icu.index(item)] = int(item)
    #my_list = []
    #for ex in train_res:
    #    my_list.append(ex.tolist())
    #print(train_res).
    #train_res = np.array(dates_from_str())
    return train_icu, train_vent, data_backup, backup_features, train_features

if __name__ == '__main__':
    train_icu, train_vent, data_backup, backup_features, train_features  = encode_results(dataf)
    trained_model_icu = generate_model(dataf, train_icu, train_features)
    trained_model_vent = generate_model(dataf, train_vent, train_features)
    predictions_icu = trained_model_icu.predict(backup_features)
    predictions_vent = trained_model_vent.predict(backup_features)
    new_df = pd.DataFrame(columns=['Ventilators', 'ICU', 'New Deaths', 'New Cases'])
    new_df['Ventilators'] = predictions_vent
    new_df['ICU'] = predictions_icu
    new_df['New Deaths'] =  backup_features[:,0]
    new_df['New Cases'] = backup_features[:,1]
    new_df.reset_index(drop=True, inplace=True)
    new_df = new_df.to_json(orient='records')
    new_df = json.loads(new_df)
    print(json.dumps(new_df, indent=4))