#this class store the cumstomer's curent state
import uuid

class Customer:
    def __init__(self, customerid, currentpage):
        if not customerid:
            self.customerid = str(uuid.uuid5(uuid.uuid4(),'cunstomerID'))
        else:
            self.customerid = customerid

        self.currentpage = currentpage


    def get_current_contact(self, allcus):
        '''
        get the current contactable people and insert to list
        allcus is a dict which storge all cumstomer lisk: {'custID': CustomerObject}
        '''
        page_con=[]
        for i,it in enumerate(allcus):
            if it.currentpage == self.currentpage:
                page_con.append(i)
        self.page_contact = page_con
        
        pass
    
    def get_history(self):
        pass

