from requests import get
import matplotlib as plt
import statsmodels.api as sm
from statsmodels.tsa import ar_model
from statsmodels.tsa.base.datetools import dates_from_str
from statsmodels.tsa.stattools import adfuller
import numpy as np
import pandas
import re
import datetime
import json
from pymongo import MongoClient

def get_gov_data(endpoint):

    response = get(endpoint, timeout=10)

    if response.status_code >= 400:
        raise RuntimeError(f'Request failed: { response.text }')
    return response.json()

def sort_and_prep_data(raw_data):
    glob_dates = []
    glob_cases = []
    for datapoint in raw_data['data']:
        glob_dates.append(datapoint['date'])
        glob_cases.append(datapoint['newCases'])
    dataReady = pandas.DataFrame(columns=['New Cases'])
    dataReady['New Cases'] = glob_cases
    dates = dates_from_str(glob_dates)
    dataReady.index = pandas.DatetimeIndex(dates)

    #dataReady.plot()
    #plt.pyplot.show()
    return dataReady

def test_for_stationarity(dataReady):
    print('Dickey-Fuller stationarity test results...')
    dftest = adfuller(dataReady,autolag='AIC')
    dfoutput = pandas.Series(dftest[0:4], index=['Test Statistic', 'p-value', '#Lags Used', 'Number of Observations Used'])
    for key, value in dftest[4].items():
        dfoutput['Critical Value (%s)' % key] = value
    print(dfoutput)
    return dfoutput

def insert_collection(data):
    client = MongoClient('mongodb://sirphemmiey:Algorithm212...@ds021689.mlab.com:21689/?authSource=admin')

    db = client['medichain']
    mycol = db['reports']
    mycol.insert_one(data)


if __name__ == '__main__':
    endpoint = (
        'https://api.coronavirus.data.gov.uk/v1/data?'
        'filters=areaType=nation;areaName=england&'
        'structure={"date":"date","newCases":"newCases  √çvcssByPublishDate"}'
    )

    data = get_gov_data(endpoint)
    prepped_dataf = sort_and_prep_data(data)
    print(prepped_dataf)
    test_results = test_for_stationarity(prepped_dataf)
    test_stat = test_results['Test Statistic']
    crit_val_1p = test_results['Critical Value (1%)']
    if abs(test_stat) > abs(crit_val_1p):
        #making stationary anyway for now...
        prepped_dataf['Log Number Cases'] = np.log(prepped_dataf['New Cases'])
        prepped_dataf['Log Number Cases Delta'] = prepped_dataf['Log Number Cases'] - prepped_dataf[
            'Log Number Cases'].shift(1)
        prepped_dataf['Log Number Cases Delta'].dropna().plot()
        # plt.pyplot.show()
        prepped_dataf['New Cases'] = prepped_dataf['Log Number Cases Delta']
    else:
        #using a log transform to make stationary
        prepped_dataf['Log Number Cases'] = np.log(prepped_dataf['New Cases'])
        prepped_dataf['Log Number Cases Delta'] = prepped_dataf['Log Number Cases'] - prepped_dataf['Log Number Cases'].shift(1)
        prepped_dataf['Log Number Cases Delta'].dropna().plot()
        #plt.pyplot.show()
        prepped_dataf['New Cases'] = prepped_dataf['Log Number Cases Delta']

    prepped_dataf = prepped_dataf[prepped_dataf['New Cases'].notna()]
    prepped_dataf = prepped_dataf.replace([np.inf, -np.inf], np.nan)
    prepped_dataf = prepped_dataf[prepped_dataf['New Cases'].notna()]
    logged_vals = prepped_dataf['Log Number Cases']
    for col in prepped_dataf.keys():
        if re.match(r'Log.*', col):
            print(re.match(r'Log.*', col))
            prepped_dataf = prepped_dataf.drop(col, axis=1)
    with pandas.option_context('display.max_rows', None, 'display.max_columns', None):  # more options can be specified also
        print(prepped_dataf)
    #prepped_dataf.drop(prepped_dataf.tail(3).index,inplace=True) # drop last n rows


    model = ar_model.AutoReg(prepped_dataf,lags=2).fit()
    print(model.summary())
    target_len = len(prepped_dataf['New Cases']) -1
    prediction = model.predict(start=205, end=205+target_len)
    predictions = [pred for pred in prediction]
    cases_log_diff_rev = []
    for v in predictions:
        index = predictions.index(v)
        v_0 = logged_vals[index]
        v_0 += v
        cases_log_diff_rev.append(v_0)

    print(np.exp(cases_log_diff_rev))
    start_date = prepped_dataf.index[0]
    start_date = start_date + datetime.timedelta(days=1)
    date_list = [start_date + datetime.timedelta(days=x) for x in range(target_len + 1)]
    date_list = [item.date() for item in date_list]
    resultsdf = pandas.DataFrame(columns=['Predicted Cases'])
    resultsdf['Predicted Cases'] = np.exp(cases_log_diff_rev)
    resultsdf.index = pandas.DatetimeIndex(date_list)
    resultsdf.plot()
    pandas.to_datetime(resultsdf.index, unit='ms')
    #parsed = resultsdf.to_dict()
    results = resultsdf.to_json( orient='split', date_format='iso')
    parsed = json.loads(results)
    parsed['Country'] = 'England'
    parsed['City'] = 'London'
    parsed['County'] = 'All'
    print(json.dumps(parsed,indent=4))
    #output = json.dumps(parsed, indent=4)
    insert_collection(parsed)

    #plt.pyplot.show()