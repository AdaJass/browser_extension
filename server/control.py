from customer import *
from datetime import datetime as dt
import json


"""
message={
    'msgid':history,
    'option':{'customId', 'getOrset', 'startDate', ...}
    'body':{}
}
"""
def login(uid, psw):
    pass

async def task_center(ws, message):    
    await operation.get(message['msgid'])(ws, message)
    pass


async def history(ws, msg):
    """
    update the structure of history and make it easy to analysis page's attraction.
    """
    if msg['option'].get('output') == 'true':
        start_date = msg['option'].get('startdate')
        if start_date:
            his = All_Customer[ws].get_history(start_date)
        else:
            his = All_Customer[ws].get_history(dt(2017,10,10))
        await ws.send(json.dumps(his))

    if  msg['option'].get('input') =='true':
        cpage = msg['body']['url']
        All_Customer[ws].set_history(cpage)
        

async def profile(ws, msg):
    if msg['option'].get('output') == 'true':
        start_date = msg['option'].get('start_date')
        end_date = msg['option'].get('end_date')
        pro = All_Customer[ws].get_profile(start_date, end_date)
        await ws.send(json.dumps(pro))
    if msg['option'].get('input') == 'true':
        All_Customer[ws].set_profile(msg['body'])        
    pass 

async def customer(ws, msg):
    if msg['option'].get('output') == 'true':
        if All_Customer[ws].basic_info is not None:
            await ws.send(json.dumps(All_Customer[ws].basic_info))
        else:
            All_Customer[ws].get_basic_info()
            await ws.send(json.dumps(All_Customer[ws].basic_info))
    if msg['option'].get('input') == 'true':
        All_Customer[ws].update_customer(msg['body'])

async def chat(ws, msg):
    zero = msg['option'].get('from')
    one = msg['option'].get('to')
    await All_Customer_WS[one].send(json.dumps(msg))

async def description():
    pass

async def problem():
    print('problem.')
    pass

async def get_contect(ws, msg):
    pagecontact = All_Customer[ws].get_current_contact()
    if len(All_Customer[ws].customerid) == 36:
        await ws.send(json.dumps({'msgid':'contactable','body':{'pagecontact':pagecontact, 'friends':{}}}))
        return
    if All_Customer[ws].basic_info is None:
        All_Customer[ws].get_basic_info()
    if type(All_Customer[ws].basic_info) is type({}) and All_Customer[ws].get('friend') is not None:
        await ws.send(json.dumps({'msgid':'contactable','body':{'pagecontect':pagecontact, 'friends':All_Customer[ws].basic_info['friend']}}))
    

operation={
    'history': history,
    'profile': profile,
    'customer':customer,
    'description':description,
    'problem':problem,
    'chat':chat,
    'contactable': get_contect,
}
