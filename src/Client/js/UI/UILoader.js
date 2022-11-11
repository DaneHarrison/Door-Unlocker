class UILoader {

    async generateUI() {
        let role = comeInside.utils.getRole();
        if(role == 'admin' || role == 'owner') {
            let listOfFriends = await comeInside.UI.ctrl.aquireFriends();
            comeInside.UI.ctrl.loadTabs();
            
            comeInside.UI.user.loadUserView(role);
            if(role == 'admin') {
                comeInside.UI.admin.loadAdminView(listOfFriends);
            }
            else {
                comeInside.UI.owner.loadOwnerView(listOfFriends);
            }
        }
        else {
            comeInside.UI.ctrl.loadDisplay();
            comeInside.UI.user.loadUserView(role);
        }
    }

    changeTab(newTab, newDisplay) {
        comeInside.UI.ctrl.updateTab(newTab);
        comeInside.UI.ctrl.updateDisplay(newDisplay);
        comeInside.UI.url.setLocation(newTab);
    }
}

module.exports= {
    UILoader
}