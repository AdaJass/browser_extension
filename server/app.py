import asyncio
import datetime
import random
import websockets
import uuid

# uuid.uuid5(uuid.uuid4(),'cunstomerID')

connected = dict()

async def consumer_handler(websocket):
    while True:
        message = await websocket.recv()
        await consumer(message)

async def producer_handler(websocket):
    while True:
        message = await producer()
        await websocket.send(message)

async def handler(websocket, path):
    consumer_task = asyncio.ensure_future(consumer_handler(websocket))
    producer_task = asyncio.ensure_future(producer_handler(websocket))
    done, pending = await asyncio.wait([consumer_task, producer_task])
    
        
start_server = websockets.serve(handler, '127.0.0.1', 5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()

