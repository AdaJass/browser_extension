from customer import *
import aiohttp_jinja2

@aiohttp_jinja2.template('chatbox.html')
async def chatbox(request):
    print('hello')
    users =[
        {'state': 'online', 'headurl':'http://localhost:3000/static/img/head/2015.jpg', 'name':'JieSi'},
        {'state': 'offline', 'headurl':'http://localhost:3000/static/img/head/2014.jpg', 'name':'Ada'}
    ]    
    emos=['0'+str(i) for i in range(1,10)] + [str(i) for i in range(10,61)]
    return {
        'users': users,
        'emos': emos
    }
