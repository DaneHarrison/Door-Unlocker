import DBSettings as config
import pony.orm as pny
import datetime as date
import sys


db = pny.Database()

class Friend(db.Entity):
    Email = pny.PrimaryKey(str)
    Name = pny.Required(str)
    LastAccessed = pny.Optional(date.datetime)
    History = pny.Set('History', reverse = 'Target')
    Permission = pny.Optional('Permission', cascade_delete = True)

class History(db.Entity):
    Date = pny.PrimaryKey(date.datetime)
    Instigator = pny.Required(str)
    Target = pny.Required('Friend')
    Event = pny.Required(str)

class Permission(db.Entity):
    Friend = pny.PrimaryKey('Friend')
    SessionID = pny.Optional(str)
    Role = pny.Required(str)

db.bind(provider = config.login['provider'], user = config.login['user'], password = config.login['password'], 
    host = config.login['host'], database = config.login['database'])
db.generate_mapping(create_tables = True)
   

@pny.db_session
def getName(id):
    name = ''     
                    
    if(Permission.get(SessionID = id)):
        name = Permission.get(SessionID = id).Friend.Name

    print(name)

@pny.db_session
def getUserRole(id):
    role = ''     
                    
    if(Permission.get(SessionID = id)):
        role = Permission.get(SessionID = id).Role

    print(role)

@pny.db_session
def getEveryonesInfo():
    list = ''

    for f in Friend.select().order_by(Friend.Name):
        list += f.Name + ' ' + f.Permission.Role + ' ' + str(f.LastAccessed) + '\n'

    print(list)

@pny.db_session
def addUser(email, name, role):
    newUser = Friend(Email = email, Name = name)

    permission = {
        'Friend': newUser,
        'Role': role,
    }

    addPermission = Permission(**permission)

@pny.db_session
def isUnique(dataType, data):
    unique = True

    if dataType == 'sessionID' and Permission.get(SessionID = data):
        unique = not unique
    elif dataType == 'email' and Friend.get(Email = data):
        unique = not unique
    elif dataType == 'name' and Friend.get(Name = data):
        unique = not unique

    print(unique)

@pny.db_session
def deleteUser(user):
    delete = Friend.get(Name = user)

    if not delete.Permission.Role == 'owner' and not delete.Permission.Role == 'admin':
        History.select(lambda p: p.Target.Name == delete.Name).delete(bulk=True)
        delete.delete()

@pny.db_session
def modifyRole(user, newRole):
    modify = Friend.get(Name = user)
    modify.Permission.Role = newRole

@pny.db_session
def saveUserInfo(id, dataType, data):
    if(Permission.get(SessionID = id)):
        userPerms = Permission.get(SessionID = id)

        if(dataType == 'SessionID'):
            userPerms.SessionID = data

@pny.db_session
def saveEvent(id, name, event): 
    currTime = date.datetime.now()

    if(Permission.get(SessionID = id)):
        user = Permission.get(SessionID = id).Friend

        if(event == 'Prepping door unlock' or event  == 'Unlocking door'):
            if(event  == 'Unlocking door'):
                user.LastAccessed = currTime
            record = History(Date = currTime, Instigator = user.Name, Target = user, Event = event)
        else:
            if(Friend.get(Name = name)):
                target = Friend.get(Name = name)
                record = History(Date = currTime, Instigator = user.Name, Target = target, Event = event)

@pny.db_session
def checkForOwner():
    owner = ''

    if(Permission.get(Role = 'owner')):
        owner = Permission.get(Role = 'owner').Friend.Email

    print(owner)

@pny.db_session
def authenticate(email, id):
    userExists = False

    if(Friend.get(Email = email)):
        userPerms = Friend.get(Email = email).Permission
        userPerms.SessionID = id
        userExists = True

    print(userExists)

@pny.db_session
def getLogs(logType):
    logs = ''

    if(logType == 'Friends'):
        for f in Friend.select().order_by(Friend.Name):
            logs += f.Name + ' ' + ' ' + f.Email + ' ' + f.Permission.Role + ' ' + str(f.LastAccessed) +  ' ' + f.Permission.SessionID + '\n'
    elif(logType == 'History'):
        for h in History.select():
            logs += str(h.Date) + ' ' + h.Instigator + ' ' + h.Target.Name + ' '+ h.Event + '\n'

    print(logs)


if sys.argv[1] == 'getUserRole':
    getUserRole(sys.argv[2])
elif sys.argv[1] == 'getName':
    getName(sys.argv[2])
elif sys.argv[1] == 'getEveryonesInfo':  
    getEveryonesInfo()
elif sys.argv[1] == 'modifyRole':
    modifyRole(sys.argv[2], sys.argv[3])
elif sys.argv[1] == 'addUser':
    addUser(sys.argv[2], sys.argv[3], sys.argv[4])
elif sys.argv[1] == 'isUnique':
    isUnique(sys.argv[2], sys.argv[3])
elif sys.argv[1] == 'deleteUser':
    deleteUser(sys.argv[2])
elif sys.argv[1] == 'saveUserInfo':
    saveUserInfo(sys.argv[2], sys.argv[3], sys.argv[4])
elif sys.argv[1] == 'saveEvent':
    saveEvent(sys.argv[2], sys.argv[3], sys.argv[4])
elif sys.argv[1] == 'checkForOwner':
    checkForOwner()
elif sys.argv[1] == 'authenticate':
    authenticate(sys.argv[2], sys.argv[3])
elif sys.argv[1] == 'getLogs':
    getLogs(sys.argv[2])


db.disconnect()