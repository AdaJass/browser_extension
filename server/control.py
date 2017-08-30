import cunstomer

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

def seter(message):    
    operation.get(message['msgid'])(message)
    pass


def geter():
    pass

def set_history(msg):
    

