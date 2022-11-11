class AdminView {

    loadAdminView(listOfFriends) {
        document.getElementById('panelView').innerHTML = `
            <table class="table is-fullwidth">
                <thead>
                    <tr>
                        <th> Name </th>
                        <th> Role </th>
                        <th> Last Accessed </th>
                    </tr>
                </thead>
                <tbody id ="tableData"></tbody>
            </table>

            <div class="field is-grouped">
                <input class="input" type="text" placeholder="Enter new user's name" id="nameInput">
                <input class="input" type="text" placeholder="Enter new user's email" id="emailInput">
                <a class="button is-small is-outlined" onclick="comeInside.requests.addPerson('nameInput','emailInput')"> Add </a>
            </div>
        `;
        
        comeInside.UI.admin.fillTable(listOfFriends);      
    }

    fillTable(listOfFriends) {
        let length = comeInside.utils.getObjLength(listOfFriends);
        let data = '';
        
        for (let i = 0; i < length; i++) {
            let fillRole = comeInside.UI.admin.checkRoles(i, listOfFriends[i].name, listOfFriends[i].role);

            data += `                    
                <tr id="`+ i +`">
                    <td>` + listOfFriends[i].name + `</td>
                    <td>` + fillRole + `</td>
                    <td>` + listOfFriends[i].lastAccessed + `</td>
                    <th><a class="button is-small is-danger is-light" onclick="comeInside.requests.deletePerson(`+ i +`)"> Delete </a></th>
                </tr>   
            `;
        }

        document.getElementById('tableData').innerHTML = data;

        for(let i = 0; i < length; i++) {
            comeInside.UI.admin.showRole(listOfFriends[i].name, listOfFriends[i].role);
        }
    }

    checkRoles(i, friendsName, friendsRole) {
        let fillRole;

        if(friendsRole == 'owner' || friendsRole == 'locked' || friendsRole == 'admin') {
            fillRole = friendsRole;
        }
        else {
            fillRole = `
                <a class="button is-small" onclick="comeInside.requests.modifyAccess(` + i + `, 'notAllowed')" id="` + friendsName + `notAllowed"> Not Allowed </a>
                <a class="button is-small" onclick="comeInside.requests.modifyAccess(` + i + `, 'allowed')" id="` + friendsName + `allowed"> Allowed </a>
            `;
        }

        return fillRole;
    }

    showRole(name, role) {
        if(role == 'notAllowed' || role == 'allowed') {
            document.getElementById(name+role).className += ' is-warning';
        }
    }
}

module.exports = {
    AdminView
}