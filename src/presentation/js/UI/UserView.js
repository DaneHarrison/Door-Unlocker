class UserView {

    loadUserView(role) {
        if(role == 'allowed' || role == 'admin' || role == 'owner') {
            document.getElementById('userView').innerHTML = `
                <a class="button is-large is-warning" onclick="comeInside.requests.prepUnlock()"> Unlock </a>
                <p class="py-6 is-size-3"> Access Granted &lt3 </p>
                <div class="mt-6 pt-6">
                    <a class="button is-small is-danger is-light" onclick="window.location.replace('/auth/logout');"> Logout </a>
                </div>

                <div class="modal" id="popUp">
                    <div class="modal-background"></div>
                        <div class="modal-card" id="popUpInfo">
                        </div>
                    </div>
                </div>
            `;
        }
        else {
            document.getElementById('userView').innerHTML = `
                <a class="button is-danger is-light" onclick="window.location.replace('http://localhost:4000/auth/logout');"> Logout </a>    
                <h1 class="title"> Access Denied </h1>
                <p> Please get ahold of me if you'd like to change that &lt3 </p>
            `;
        }
    }

    loadColourMode() {
        document.getElementById('popUpInfo').innerHTML = `
            <header class="modal-card-head">
                <p class="modal-card-title">Please select the colours you see in order to gain entry!</p>
                <button class="delete" aria-label="close" onclick="comeInside.UI.ctrl.hideLogin()"></button>
            </header>
                            
            <section class="modal-card-body">
                <div class="columns is-mobile is-multiline is-centered">
                    <a class="button" onclick="comeInside.UI.user.passcode.push('0')"> Purple </a>
                    <a class="button" onclick="comeInside.UI.user.passcode.push('1')"> Green </a>
                    <a class="button" onclick="comeInside.UI.user.passcode.push('2')"> Blue </a>
                    <a class="button" onclick="comeInside.UI.user.passcode.push('3')"> Orangey-Pink </a>
                    <a class="button" onclick="comeInside.UI.user.passcode.push('4')"> Red </a>
                    <a class="button" onclick="comeInside.UI.user.passcode.push('5')"> Black </a>
                    <a class="button" onclick="comeInside.UI.user.passcode.push('6')"> Yellow </a>
                </div>
            </section>

            <footer class="modal-card-foot">
                <button class="button is-success" onclick="comeInside.requests.attemptUnlock()">Submit</button>
            </footer>
        `;
    }
}

module.exports = {
    UserView
}