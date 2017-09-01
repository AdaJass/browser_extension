import asyncio
import datetime
import random
import websockets
import uuid
from customer import *
import control

# uuid.uuid5(uuid.uuid4(),'cunstomerID')


async def handler(websocket, path): 
    print(path)
    try:
        message = await websocket.recv()
    except Exception as err:
        print(err)
        websocket.send({'msgid':'error','option':{'type':'normal'}})
        return
        pass   
    
    # print(websocket)
    if (All_Customer.get(websocket) == None) and message['msgid']=='login':  #log in initialize
        cus_id = message['option'].get('customId')
        psw = message['option'].get('password')
        if cus_id and not psw:
            await websocket.send({'msgid':'error','option':{'type':'no password'}})
            return
        if not cus_id and message['option'].get('anonymous'):
            anon=True
        else:
            result=control.login(cus_id, psw)
        if not result:
            await websocket.send({'msgid':'error','option':{'type':'password wrong'}})
            return
        cpg = [message['body']['currentpage']]
        if result or anon:
            All_Customer[websocket] = Customer(cus_id, cpg)
            All_Customer_WS[cus_id]=[websocket]
            await websocket.send({'msgid':'login','option':{'type':'succeeds'}})
            return
    else:
        control.task_center(websocket, message)
        return 
    

start_server = websockets.serve(handler, 'localhost', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
