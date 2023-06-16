class UIController {

    loadDisplay() {
        document.getElementById('userView').style.display = 'block';
    }

    loadTabs() {
        let location = comeInside.UI.url.getLocation();

        if(location != null) {
            comeInside.UI.currTab = location;
            
            if(location == 'panelTab') {
                comeInside.UI.currDisplay = 'panelView';
            }
            else if(location == 'userTab') {
                comeInside.UI.currDisplay = 'userView';
            }
        }
        else {
            comeInside.UI.currTab = 'userTab';
            comeInside.UI.currDisplay = 'userView';
        }

        document.getElementById(comeInside.UI.currDisplay).style.display = 'block';
        document.getElementById(comeInside.UI.currTab).className += ' is-active';
        document.getElementById('tabs').style.display = 'block';
    }

    updateTab(newTab) {
        document.getElementById(comeInside.UI.currTab).classList.remove('is-active');
        document.getElementById(newTab).className += ' is-active';
        comeInside.UI.currTab = newTab;
    }

    updateDisplay(newDisplay) {
        document.getElementById(comeInside.UI.currDisplay).style.display = 'none';
        document.getElementById(newDisplay).style.display = 'block';
        comeInside.UI.currDisplay = newDisplay;
    }

    async aquireFriends(sessionID) {
        let options = {
            method: 'get',
            url: '/fetchList/',
            responseType: 'json'
        }

        let listOfFriends = await comeInside.utils.getFromServer(options);

        return listOfFriends;
    }

    loadLogin() {
        comeInside.UI.user.passcode = [];
        document.getElementById('popUp').className += ' is-active';
    }

    hideLogin() {
        comeInside.UI.user.passcode = [];
        document.getElementById('popUp').classList.remove('is-active');
    }
}

module.exports = {
    UIController
}