import asyncio
from aiohttp import web
import aiohttp_jinja2
import jinja2
import datetime
import json
import random
import websockets
import ssl
import uuid
from customer import *
import control
import handler
# uuid.uuid5(uuid.uuid4(),'cunstomerID')
async def resp_data(request):
    return web.json_response({'ss':'ss'})

async def init_http_server(loop):    
    app = web.Application()    
    aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('./views'))
    app.router.add_static('/static/', path='./static', name='static')
    app.router.add_route('GET', '/data', resp_data)
    app.router.add_route('GET', '/chat_box', handler.chatbox)
    srv = await loop.create_server(app.make_handler(), '0.0.0.0', 3000)
    print('http sever starts at port: 3000')
    return srv 

async def init_https_server(loop):    
    app = web.Application()    
    aiohttp_jinja2.setup(app, loader=jinja2.FileSystemLoader('./views'))
    app.router.add_static('/static/', path='./static', name='static')
    app.router.add_route('GET', '/data', resp_data)
    app.router.add_route('GET', '/chat_box', handler.chatbox)
    srv = await loop.create_server(app.make_handler(), '0.0.0.0', 3448, ssl=ssl.create_default_context())
    print('https sever starts at port: 3448')
    return srv 

async def wsocket(websocket, path):
    while  True:        
        try:
            message = await websocket.recv() 
            print(websocket)
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
            websocket.send(json.dumps({'msgid':'error','body':'normal'}))
            continue
            pass
        if control.operation.get(message['msgid']):
            await control.task_center(websocket, message)
            continue        
        
        if (All_Customer.get(websocket) == None) and message['msgid']=='login':  #log in initialize
            cus_id = message.get('customerid')
            psw = message.get('password')
            if cus_id and not psw:
                await websocket.send(json.dumps({'msgid':'error','body':'no password'}))
            if not cus_id and message.get('anonymous'):
                anon=True
                result = False
            else:
                result=control.login(cus_id, psw)
                if not result:
                    await websocket.send(json.dumps({'msgid':'error','body':'password wrong'}))
                    continue            
            if result or anon:
                All_Customer[websocket] = Customer(cus_id)
                All_Customer_WS[All_Customer[websocket].customerid] = websocket
                await websocket.send(json.dumps({'msgid':'loginsucceed','customerid':All_Customer[websocket].customerid}))
    

ws_server = websockets.serve(wsocket, '0.0.0.0', 5678)
loop=asyncio.get_event_loop()
http_server = init_http_server(loop)
https_server = init_https_server(loop)
tasks=[http_server, https_server, ws_server]
loop.run_until_complete(asyncio.wait(tasks))
try:
    loop.run_forever()
except KeyboardInterrupt:
    pass
