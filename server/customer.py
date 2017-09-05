#this class store the cumstomer's curent state
import uuid
import mongo as db
from datetime import datetime as dt
from datetime import timedelta as td
from urllib.parse import urlparse

__Description_Attrib=list(db.descriptAttr.find({}))
Description_Attrib={}
for it in __Description_Attrib:
    Description_Attrib[it['_id']]=it.pop('_id')

All_Customer = dict()
All_Customer_WS = dict()

class Customer:
    def __init__(self, customerid, currentpage):
        if not customerid:
            self.customerid = str(uuid.uuid5(uuid.uuid4(),'cunstomerID'))
            self.description = None
        else:
            self.customerid = customerid
            self.description = db.description.find_one({'_id': self.customerid})

        self.currentpage = currentpage
        
        self.basic_info = None
        self.page_contact = None

    def get_current_contact(self, allcus):
        '''
        get the current contactable people and insert to list
        allcus is a dict which storge all cumstomer lisk: {'custID': CustomerObject}
        '''
        page_con=[]
        for cid,obj in enumerate(allcus):
            if obj.currentpage == self.currentpage:
                page_con.append(cid)
        self.page_contact = page_con
              
        pass
    
    
    def get_basic_info(self):
        cursor=db.customer.find_one({'_id': self.customerid})
        friend=cursor['friend']
        friends=dict()
        for f in friend:
            k=f.split('_')   ##  !!!!!! customer id and tag name can't contain '_'            
            if friends.get(k[-1]) == None:
                friends[k[-1]]=k[0]
            else:
                friends[k[-1]].append(k[0])
        self.basic_info=cursor
        self.basic_info['friend']=friends
        pass

    def get_history(self, date):
        his=db.history.find({'customerId':self.customerid, 'date':{'$gte':date}}).sort('date')
        his=list(his)
        return his

    def get_profile(self, start_date, end_date):
        pro=db.profile.find({'customerId':self.customerid, 'date':{'$gte':start_date, '$lte': end_date}}).sort('date')
        pro=list(pro)
        return pro    
        pass

    def set_profile(self, ss):
        db.profile.insert_one({'customerId':self.customerid, 'date': dt.today(), 'saying': ss})
    
    def set_history(self, page=None):
        if page == None:
            page = self.currentpage
        parse = urlparse(page)
        val = dt.today()-td(1)
        if db.history.count({'customerId': self.customerid, 'url': page,'date':{'$gte': val}}) >=1:
            db.history.update_many({'customerId': self.customerid, 'url': page,'date':{'$gte': val}}, {'$inc':{'duration':1}, '$set':{'renewdate':dt.today()}})
        else:
            db.history.insert_one({'customerId': self.customerid, 'date': dt.today(), 'renewdate': dt.today(), 'host': parse.hostname, 'url': page, 'duration':1})

    def update_customer(self, body):
        db.customer.update_one({'_id': self.customerid}, {'$set': body})