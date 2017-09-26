import asyncio
from aiohttp import web
import datetime
import json
import random
import websockets
import uuid
from customer import *
import control

# uuid.uuid5(uuid.uuid4(),'cunstomerID')
async def resp_data(request):
    return web.json_response({'ss':'ss'})

async def init_webserver(loop):
    app = web.Application()
    app.router.add_route('GET', '/data', resp_data)
    srv = await loop.create_server(
        app.make_handler(), '0.0.0.0', 3000)
    print('Sever starts at port: 3000')
    return srv 

async def handler(websocket, path):
    while  True:        
        try:
            message = await websocket.recv() 
            # print(All_Customer)
            # print(All_Customer_WS)
            print('the message is: ', message)
            message = json.loads(message)
        except Exception as err:
            print(err.args,' error')
            if err.__class__.__name__ == 'ConnectionClosed':
                # print('closed connection! ',websocket)
                # print(All_Customer, '   the customer')
                cust = All_Customer.get(websocket)
                if cust: 
                    All_Customer.pop(websocket)                   
                    All_Customer_WS.pop(cust.customerid)
                # print('***********************')
                # print(All_Customer_WS)
                # print(All_Customer)
                # print('**********************')
                return
            websocket.send(json.dumps({'msgid':'error','option':{'type':'normal'}}))
            continue
            pass
        if control.operation.get(message['msgid']):
            await control.task_center(websocket, message)
            continue        
        # print(websocket)
        if (All_Customer.get(websocket) == None) and message['msgid']=='login':  #log in initialize
            cus_id = message['option'].get('customId')
            psw = message['option'].get('password')
            if cus_id and not psw:
                await websocket.send(json.dumps({'msgid':'error','option':{'type':'no password'}}))
            if not cus_id and message['option'].get('anonymous'):
                anon=True
                result = False
            else:
                result=control.login(cus_id, psw)
                if not result:
                    await websocket.send(json.dumps({'msgid':'error','option':{'type':'password wrong'}}))
                    continue
            cpg = [message['body']['currentpage']]
            if result or anon:
                All_Customer[websocket] = Customer(cus_id, cpg)
                All_Customer_WS[All_Customer[websocket].customerid] = websocket
                await websocket.send(json.dumps({'msgid':'loginsucceed','option':{'customerid':All_Customer[websocket].customerid}}))
    

start_server = websockets.serve(handler, 'localhost', 5678)

loop=asyncio.get_event_loop()
tasks=[init_webserver(loop), start_server]
loop.run_until_complete(asyncio.wait(tasks))
try:
    loop.run_forever()
except KeyboardInterrupt:
    pass
