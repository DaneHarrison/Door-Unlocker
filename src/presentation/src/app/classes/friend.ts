export class Friend {
    static accessOrder = ['admin', 'allowed', 'not allowed'];

    friendID: number;
    name: string;
    accessLvl: string;
    lastAccessed: string;

    constructor(friendID: number, name: string, accessLvl: string, lastAccessed: string) {
      this.friendID = friendID;
      this.name = name;
      this.accessLvl = accessLvl;
      this.lastAccessed = lastAccessed;
    }
  
    
    static sortFriends(friends: Friend[]): Friend[] {
      return friends.sort((first, second) => {
        // Compare access levels first
        let accessComparison = Friend.accessOrder.indexOf(first.accessLvl) - Friend.accessOrder.indexOf(second.accessLvl);
        
        // If access levels are the same, compare by name
        if (accessComparison === 0) {
          return first.name.localeCompare(second.name);
        }
        
        return accessComparison;
      });
    }
  }
  