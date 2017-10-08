import pymongo
from pymongo import MongoClient
__client = MongoClient('mongodb://localhost:27017')

customer=__client.extension.customer
history=__client.extension.history
profile=__client.extension.profile
descriptAttr=__client.extension.descriptAttr
description=__client.extension.description
chat=__client.extension.chat
problemSet=__client.extension.problemSet

"""
customer={nickName, _id, birthday, age, sex, location, birthPlace, signInDate, bloodType, signature(one word), qq, wechat, phone, email, friend:[customerId_tagName, customerId_tagName, ...]} #customere static information
history={customerId, date, renewdate host, url, duration}
profile={customerId, date, saying(usually several words represent the mood, will save with format that contain picture or emoj)}
descriptAttr={_id, feature, example:[will list some of the customerid]}
description={customerId, attrPairs:{attrId1:likeRate, attrId2: likeRate, ....}}
chat={origin, destination, date, words}
problemSet={problem, category ,solveUrl:[up to 5 url], contributor: [up to 3 customerId], buldDate, lastUpdate}  #search engine recommend
"""


if __name__ == '__main__':
    from datetime import datetime as dt
    # db.customer.insert({nickName:'test',  psw:'test1234', birthday:'test', age:'test', sex:'test', location:'test', birthPlace:'test', signInDate:'test',_id:'test', bloodType:'test', signature:'test', qq:'test', wechat:'test', phone:'test', email:'test', friend:['customerId_tagName', 'customerId_tagName']})
    
    # customer.insert({'nickNmae': 'father', '_id': '3', 'psw': 'test1234', 'sex': False, 'age': 0, 'friend':['1_default']})
    # history.insert({'customerId':'1', 'builddate':dt.today(), 'renewdate': dt.today(),'host':'fun.com','url':'www.fun.com/adk/83', 'duration': 1})
    # profile.insert({'customerId':'1', 'date':dt.today(), 'saying':'i love you'})
    # descriptAttr.insert({'_id':'die','feature':'ksgasjkdgkajddkgjakdjkgj', 'example':['1']})
    # description.insert({'_id':'1', 'attrPairs':{'die':0.9, 'out':0.2}})
    # chat.insert({'origin':'1', 'destination':'2', 'date': dt.today(), 'words':'i love you'})
    # problemSet.insert({'problem':'why flower so red?', 'category': [] ,'solveUrl':['www.baidu.com/skg/skg.html','baidu.teiba.com/akjg/2354.html',None,None,None], 'contributor':['1','2','3'], 'buildDate':dt.today(), 'lastUpdate': dt.today()})
    cursor = customer.find({'_id': 'test'})
    print(cursor[0])
    friend=cursor[0]['friend']
    print(friend)

