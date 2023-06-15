const {Utils} = require('./Utils');
const {UILoader} = require('./UI/UILoader');
const {UserView} = require('./UI/UserView');
const {OwnerView} = require('./UI/OwnerView');
const {AdminView} = require('./UI/AdminView');
const {URLManager} = require('./UI/URLManager');
const {UIController} = require('./UI/UIController');
const {Requests} = require('./Requests');


(function startup(){
    window.comeInside = {};
    comeInside.utils = new Utils();
    comeInside.UI = new UILoader();
    comeInside.UI.user = new UserView();
    comeInside.UI.admin = new AdminView();
    comeInside.UI.owner = new OwnerView();
    comeInside.UI.url = new URLManager();
    comeInside.UI.ctrl = new UIController();
    comeInside.requests = new Requests();
    
    comeInside.UI.generateUI();
})();