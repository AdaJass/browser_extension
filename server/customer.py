#this class store the cumstomer's curent state
import uuid
import mongo as db

__Description_Attrib=list(db.descriptAttr.find({}))
Description_Attrib={}
for it in __Description_Attrib:
    Description_Attrib[it['_id']]=it.pop('_id')

All_Customer = dict()

class Customer:
    def __init__(self, customerid, currentpage):
        if not customerid:
            self.customerid = str(uuid.uuid5(uuid.uuid4(),'cunstomerID'))
        else:
            self.customerid = customerid

        self.currentpage = currentpage
        self.description = db.description.find_one({'_id': self.cumstomerid})
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
        pro=db.profile.find({'customerId':self.customerid, 'date':{'$gte':date, '$lte': end_date}}).sort('date')
        pro=list(pro)
        return pro    
        pass

