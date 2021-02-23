import {getInstance as Model} from "./model.js";
import {getInstance as View} from "./view.js"

let init = Symbol();
let controller;

class CovidShoppingController {
    #model;
    #view;

    constructor() {
        this.#model = Model();
        this.#view = View();

        //Init all Dom Handlers
        this[init]();

        //Anmelden für Events
        this.#model.subscribe("switchRole",this.#view,this.#view.switchRole);
        this.#model.subscribe("addList",this.#view,this.#view.addList);
        this.#model.subscribe("getDetailView",this.#view,this.#view.getDetailView);
        this.#model.subscribe("deleteListHtml",this.#view,this.#view.deleteListHtml);
        this.#model.subscribe("createNewList",this.#view,this.#view.createNewList);
        this.#model.subscribe("addArticlesToNewList",this.#view,this.#view.addArticlesToNewList);
        this.#model.subscribe("addNewList",this.#view,this.#view.addNewList);
        this.#model.subscribe("backToAllLists",this.#view,this.#view.backToAllLists);
        this.#model.subscribe("editViewFromLists",this.#view,this.#view.editViewFromLists);
        this.#model.subscribe("editViewFromDetail",this.#view,this.#view.editViewFromDetail);
        this.#model.subscribe("articleEdit",this.#view,this.#view.articleEdit);
        this.#model.subscribe("overtakeChangesArticle",this.#view,this.#view.overtakeChangesArticle);
        this.#model.subscribe("deleteArticleFromList",this.#view,this.#view.deleteArticleFromList);
        this.#model.subscribe("editListDetail",this.#view,this.#view.editListDetail);
        this.#model.subscribe("overtakeChangesListDetail",this.#view,this.#view.overtakeChangesListDetail);
        this.#model.subscribe("finishedEditing",this.#view,this.#view.finishedEditing);
        this.#model.subscribe("deleteListFromDetailView",this.#view,this.#view.deleteListFromDetailView);
        this.#model.subscribe("overtakeList",this.#view,this.#view.overtakeList);
        this.#model.subscribe("cancelList",this.#view,this.#view.cancelList);
        this.#model.subscribe("sendFinalPrice",this.#view,this.#view.sendFinalPrice);
    }

    //Registrierung der Event Handler - im Model entsprechende Methode aufrufen
    [init](){
        //BOTH VIEWS----------------------------------------------------------------------------------------------------
        //Button "Rolle wechseln"
        View().DOM.document.on("click", ".switchRole",(e)=> {
            Model().switchRole(e.currentTarget);
        });

        //LISTVIEW------------------------------------------------------------------------------------------------------

        //ADD A NEW LIST (LISTVIEW / HELPSEEKER)
        //ADD A NEW LIST -> A POPUP-WINDOW OPENS WHERE THE USER CAN ENTER THE INFORMATION OF----------------------------
        //THE NEW LIST -> AFTER FINISHING, THE INPUT-DATA WILL BE USED TO CREATE A NEW LIST OBJECT
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        let articleList;

        //1. STEP: KLICK ON BUTTON "NEUE LISTE HINZUFÜGEN"
        //POP UP WILL SHOW UP - GET NEW VARIABLES CREATOR, CREATIONDATE AND ARTICLELIST
        //THE NAME OF THE READ IN USER AND TODAYS DATE ARE ALREADY GIVEN

        View().DOM.document.on("click", "#addList",(e)=> {
            articleList = Model().createNewList();
        });

        //2. STEP: ADD VARIOUS ARTICLES TO THE LIST WITH BUTTON "ARTIKEL HINZUFÜGEN"
        //THIS METHOD FETCHES THE ENTERED CONTENT IN THE INPUT-BOXES FOR THE ARTICLES
        //IT CREATES A NEW ARTICLE OBJECT AND EVENTUALLY PRINTS THE ENTERED DETAILS OF
        //THE ARTICLE AND CLEANS THE INPUT BOXES (FOR BETTER USABILITY)

        View().DOM.document.on("click", "#addArticleToList",(e)=> {
            Model().addArticlesToNewList(articleList);

        });

        //3. STEP: CREATE A NEW LIST WITH THE DETAILS GIVEN IN THE INPUT BOXES AND PUT THE ARTICLES
        //IN THE NEW LIST - EVENTUALLY PRINT THE NEW LIST, CLEAN THE FORM AND CLEAN THE ARTICLE OUTPUT

        View().DOM.document.on("click", "#listAdd",(e)=> {
            Model().addNewList(articleList);

        });

        //EDIT A LIST (LISTVIEW / HELPSEEKER)---------------------------------------------------------------------------
        //EDITING A LIST FROM THE LISTVIEW -> SENDS THE USER TO THE DETAILVIEW AND SHOW BUTTONS TO EDIT
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click", ".listView .edit",(e)=> {
            Model().editViewFromLists(e.currentTarget);
        }); 

        //DELETE A LIST (LISTVIEW / HELPSEEKER)-------------------------------------------------------------------------
        //DELETE THE HTML LIST + DELETE THE LIST IN THE LISTLIST-MAP AFTER THE CONFIRM OF THE USER
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click", ".listView .delete",(e)=> {
            Model().deleteListHtml(e.currentTarget);
        });

        //GO TO DETAILVIEW (LISTVIEW)-----------------------------------------------------------------------------------
        //SENDS THE USER TO THE DETAILVIEW (WITHOUT BUTTONS TO EDIT)
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click",".detail",(e)=>{
            let listId = e.currentTarget.id;
            Model().getDetailView(listId);
        });

        //DETAILVIEW----------------------------------------------------------------------------------------------------

        //EDIT A LIST (DETAILVIEW / HELPSEEKER)-------------------------------------------------------------------------
        //SHOWS BUTTON TO DELETE OR EDIT A ARTICLE AND ALSO TO EDIT THE GENERAL LIST INFORMATION
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click",".detailView .edit",(e)=>{
            Model().editViewFromDetail(e.currentTarget);
        });

        //EDIT ARTICLES (DETAILVIEW / HELPSEEKER)-----------------------------------------------------------------------
        // A POPUP-WINDOW OPENS WHERE THE USER CAN ENTER EDIT AN EXISTING ARTICLE
        // -> AFTER FINISHING, THE INPUT-DATA WILL BE USED TO OVERWRITE THE OLD ARTICLE
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        let articleRowClicked;

        //STEP 1: OPEN POP-UP VIA "BEARBEITEN" AT AN ARTICLE
        //IN THIS STEP, WE GET THE ARTICLE ROW WHERE THE CLICK HAPPENED AND SAVE IT
        //MOREOVER, WE FETCH THE OLD CONTENT OF THE THREE COLS TITLE, ANZAHL AND MAX. KOSTEN, SAVE IT AND
        //SET IT AS PLACEHOLDER TEXT FOR THE INPUT FIELDS

        View().DOM.document.on("click",".articleEdit",(e)=>{
            let btn = e.currentTarget;
            articleRowClicked = Model().articleEdit(btn);
        });

        //STEP 2: AFTER FILLING IN THE INPUT BOXES IN THE POPUP, YOU CAN SUBMIT THE NEW INFORMATION BY PRESSING
        //BUTTON "ÄNDERUNGEN ÜBERNEHMEN". THEREFORE THIS FUNCTION GETS THE VALUES OF THE INPUT BOXES. IF A
        //INPUT BOX IS EMPTY, THE OLD VALUE OF THIS COLUMN WILL BE TAKEN OVER. THEN THE NEW VALUES WILL BE PLACED
        //IN THE HTML AND A NEW ARTICLE WILL BE CREATED (THE OLD ARTICLE WILL BE DELETED AND THE NEW ONE SET IN
        //THE LIST. EVENTUALLY, THE FORM WILL BE CLEARED.

        View().DOM.document.on("click","#overtakeChangesArticle",(e)=>{
            Model().overtakeChangesArticle(articleRowClicked);
        });

        //DELETE ARTICLES (DETAILVIEW / HELPSEEKER)---------------------------------------------------------------------
        //AFTER GETTING THE CONFIRM OF THE USER, THE TABLEROW WILL BE DELETED IN THE HTML AND THE ARTICLE WILL BE
        //REMOVED FROM THE LIST-MAP. EVENTUALLY, THE NUMBER OF ARTICLES WILL BE UPDATED.
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click",".articleDelete",(e)=>{
            Model().deleteArticleFromList(e.currentTarget);
        });

        //EDIT LISTDETAILS (DETAILVIEW / HELPSEEKER)--------------------------------------------------------------------
        // A POPUP-WINDOW OPENS WHERE THE USER CAN ENTER EDIT AN EXISTING LISTDETAILS
        // -> AFTER FINISHING, THE INPUT-DATA WILL BE USED TO OVERWRITE THE LIST DETAILS.
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        let btnPressed;

        //STEP 1: THE POP UP OPENS HERE - GETTING THE CONTENT OF THE RECENT LIST DETAILS AND SETTING IT AS
        //PLACEHOLDER TEXT

        View().DOM.document.on("click","#editBtn",(e)=>{
            btnPressed = e.currentTarget;
            Model().editListDetail();
        });

        //STEP 2: SAVE THE NEW CONTENT OF THE INPUT BOXES. IF THERE WAS NO ENTRY FOUND, THE OLD LIST DETAIL WILL BE
        //TAKEN. EVENTUALLY WRITES IT DOWN IN THE HTML AND UPDATES THE LIST INFOS.

        View().DOM.document.on("click","#overtakeChangesEdit",(e)=>{
            Model().overtakeChangesListDetail(btnPressed);
        });

        //STOP EDITING (BUTTON "FERTIG") (DETAILVIEW / HELPSEEKER)------------------------------------------------------
        //HIDES ALL EDIT-BUTTONS AGAIN
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click","#editing",(e)=>{
            Model().finishedEditing(e.currentTarget);
        });

        //DELETE A LIST (DETAILVIEW / HELPSEEKER)-----------------------------------------------------------------------
        //HIDES THE DETAILVIEW AND DELETE ITS CONTENT (AFTER THE USER CONFIRMS), ALSO DELETES
        //THE LIST IN THE LISTVIEW SO THE DETAILVIEW WONT BE ACCESSABLE ANYMORE
        //DELETES ALSO LIST IN THE LISTLIST-MAP
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click",".detailView .delete",(e)=>{
            Model().deleteListFromDetailView(e.currentTarget);
        });

        //OVERTAKE A LIST (DETAILVIEW / HELPER)-------------------------------------------------------------------------
        //CHANGES THE LISTSTATUS TO OVERTAKEN, THE DESIGN IN THE DETAILVIEW BUT ALSO IN THE LISTVIEW CHANGES
        //(OTHER COLORS / HIDE BUTTONS -> A HELPSEEKER IS NOW UNABLE TO EDIT / DELETE A LIST!)
        //ALSO THE INPUTFIELD FOR THE TOTAL PRICE IS NOW VISIBLE.
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click",".overtake",(e)=>{
            Model().overtakeList(e.currentTarget);
        });

        //CANCEL A LIST (DETAILVIEW / HELPER)---------------------------------------------------------------------------
        //CHANGES THE LISTSTATUS TO FREE, THE DESIGN IN THE DETAILVIEW IS NOW AS AT THE BEGINNING
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click","#isOvertaken",(e)=>{
            Model().cancelList(e.currentTarget);
        });

        //BACK TO THE LISTVIEW (BUTTON ZURÜCK)(DETAILVIEW)--------------------------------------------------------------
        //HIDES THE DETAILVIEW AND DELETES ITS CONTENT
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click",".backToAllLists",(e)=>{
            Model().backToAllLists();
        });

        //SEND TOTAL PRICE (DETAILVIEW / HELPER)------------------------------------------------------------------------
        //HELPER CAN SEND THE TOTAL PRICE TO COMPLETE THE LIST. HE HAS TO ENTER SOMETHING IN THE INPUT BEFORE SENDING IT
        //AFTERWARDS, THE LIST IS "LOCKED" - THE DESIGN IS CHANGED SO NEITHER THE HELPER NOR THE HELPSEEKER CAN
        //CHANGE SOMETHING. THE ONLY THING POSSIBLE IS TO LOOK AT THE LISTDETAILS. PRICE IS SAVED FOR THE LIST.
        //INPUT PARAMETERS: VOID
        //OUTPUT PARAMETERS: VOID

        View().DOM.document.on("click","#sendPrice",(e)=>{
            Model().sendPaidPrice(e.currentTarget);
        });
    }
}

export function getInstance() {
    if(!controller){
        controller = new CovidShoppingController();
    }
    return controller;
}