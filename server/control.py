from cunstomer import *

operation={
    'history': set_history,
    'profile': _profile,
    'customer'_customer,
    'description':_description,
    'problem':_problem,
    'chat'_chat
}

"""
message={
    'msgid':history,
    'option':{'customId', 'getOrset', 'startDate', ...}
    'body':{}
}
"""

def task_center(ws, message):    
    operation.get(message['msgid'])(message)
    pass


def geter():
    pass

def set_history(msg):
    

