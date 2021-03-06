from customer import *
import mongo as db
from datetime import datetime as dt
import json


"""
message={
    'msgid':history,
    {'customId', 'getOrset', 'startDate', ...}
    'body':{}
}
"""
def login(uid, psw):
    # print('heheheh')
    if db.customer.count({'_id': uid, 'psw': psw}) >= 1:
        return True
    else:
        return False
    pass

async def task_center(ws, message):    
    await operation.get(message['msgid'])(ws, message)
    pass


async def history(ws, msg):
    """
    get or set history and make it easy to analysis page's attraction.
    """
    if msg.get('output') == 'true':
        start_date = msg.get('startdate')
        if start_date:
            his = All_Customer[ws].get_history(start_date)
        else:
            his = All_Customer[ws].get_history(dt(2017,10,10))
        await ws.send(json.dumps(his))

    if  msg.get('input') =='true':
        cpage = msg['body']
        if msg.get('duration'):
            All_Customer[ws].set_history(cpage, True)
        else:
            All_Customer[ws].set_history(cpage)
        pagecontact = All_Customer[ws].get_current_contact()
        await ws.send(json.dumps({'msgid':'contactable', 'tabid': msg.get('tabid'), 'pagecontact':pagecontact}))
        

async def profile(ws, msg):
    if msg.get('output') == 'true':
        start_date = msg.get('start_date')
        end_date = msg.get('end_date')
        pro = All_Customer[ws].get_profile(start_date, end_date)
        await ws.send(json.dumps(pro))
    if msg.get('input') == 'true':
        All_Customer[ws].set_profile(msg['body'])        
    pass 

async def customer(ws, msg):
    if msg.get('input') == 'true':
        All_Customer[ws].update_customer(msg['body'])
    else:
        if All_Customer[ws].basic_info is not None:
            tem = All_Customer[ws].basic_info
            tem['msgid'] = 'customer'
            await ws.send(json.dumps(tem))
        else:
            All_Customer[ws].get_basic_info()
            tem = All_Customer[ws].basic_info
            tem['msgid'] = 'customer'
            await ws.send(json.dumps(tem))

async def chat(ws, msg):
    zero = msg.get('from')
    ones = msg.get('to')
    for one in ones:
        if All_Customer_WS.get(one):
            await All_Customer_WS[one].send(json.dumps(msg))
        else:
            db.chat.insert({'origin':zero, 'destination':ones, 'date': msg.get('time'), 'words':msg.get('body')})

async def barrager(ws, msg):
    """here is lots of things and hard things to do, like controlling
    the barragers density.
    """
    All_Customer[ws].currentpage = msg.get('url')
    pagecontact = All_Customer[ws].get_current_contact()  
    msg['from'] = All_Customer[ws].customerid
    msg['nickName'] = All_Customer[ws].basic_info.get('nickName')
    for one in pagecontact:
        await All_Customer_WS[one].send(json.dumps(msg))


    

async def description():
    pass

async def problem():
    print('problem.')
    pass

async def get_contact(ws, msg):
    if msg.get('body'):
        All_Customer[ws].set_history(msg['body'])
    pagecontact = All_Customer[ws].get_current_contact()
    if msg.get('nofriend'):
        await ws.send(json.dumps({'msgid':'contactable', 'tabid': msg.get('tabid'), 'pagecontact':pagecontact}))
        return
    if len(All_Customer[ws].customerid) == 36:
        await ws.send(json.dumps({'msgid':'contactable', 'tabid': msg.get('tabid'),'body':{'pagecontact':pagecontact, 'friends':{}}}))
        return
    if All_Customer[ws].basic_info is None:
        All_Customer[ws].get_basic_info()
    if type(All_Customer[ws].basic_info) is type({}):
        await ws.send(json.dumps({'msgid':'contactable', 'tabid': msg.get('tabid'), 'body':{'pagecontact':pagecontact, 'friends':All_Customer[ws].basic_info['friend']}}))
    

operation={
    'history': history,
    'profile': profile,
    'customer':customer,
    'description':description,
    'problem':problem,
    'chat':chat,
    'barrager': barrager,
    'contactable': get_contact,
}
