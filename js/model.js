import Subject from "./subject.js";
import Person from "./person.js";
import List from "./list.js";
import Article from "./article.js";

let covidShoppingModel;
let loadFromJSON = Symbol();
let addArticleToList = Symbol();
let getListFromHtml = Symbol();
let getDetailListFromHtml = Symbol();

class CovidShoppingModel extends Subject {
    #listList;
    #userList;

    constructor() {
        super();
        this.#listList = new Map();
        this.#userList = new Map();

        this[loadFromJSON]();
    }

    //LISTLIST----------------------------------------------------------------------------------------------------------

    //Adds a list to the map
    //Input Parameters: list
    //Output Parameters: void
    addList(list) {
        this.#listList.set(list.listId, list);
    }

    //Getter for a list
    //Input Parameters: NUMBER
    //Output Parameters: list
    getList(listId) {
        return this.#listList.get(listId);
    }

    //Deletes a list from the map
    //Input Parameters: NUMBER
    //Output Parameters: void
    deleteList(listId){
        this.#listList.delete(listId);
    }

    //USERLIST----------------------------------------------------------------------------------------------------------

    //Adding a person to the map
    //Input Parameters: Person
    //Output Parameters: void
    addUser(person) {
        this.#userList.set(person.getPersonId(), person);
    }

    //Getter for the userId
    //Input Parameters: NUMBER
    //Output Parameters: STRING
    getName(userId){
        let n = this.#userList.get(userId);
        return n.getName();
    }

    //EVENTHANDLER

    //BOTH VIEWS--------------------------------------------------------------------------------------------------------

    switchRole(btn){
        let listId = $(btn).parent().parent().parent().attr('class');
        let list = this.getList(listId);

        super.notify("switchRole", list);
    }

    //LISTVIEW----------------------------------------------------------------------------------------------------------

    printList(list){
        //Event schmeißen
        super.notify("addList",list);
    }

    getDetailView(listId){
        let list = this.getList(listId);
        super.notify("getDetailView",list);
    }

    deleteListHtml(btn){
        if (confirm("Soll diese Liste wirklich gelöscht werden?") === true) {
            super.notify("deleteListHtml",btn);

            //delete list in map
            let list = this[getListFromHtml](btn);
            this.deleteList(list);
        }
    }

    createNewList(){
        let creator = this.getName(1);
        let creationDate = new Date().toLocaleDateString();
        super.notify("createNewList", [creator, creationDate]);

        return new Map();
    }

    addArticlesToNewList(articleList){
        let title = $("#ArticleAdd").val();
        let quantity = $("#ArticleAddQuantity").val();
        let maxPrice = $("#ArticleAddPrice").val();

        let article = new Article({title, maxPrice, quantity});
        articleList.set(title, article);

        super.notify("addArticlesToNewList",article);
    }

    addNewList(articleList){
        let length = $(".list").length + 10;
        let listId = "list"+length;
        let description = $("#descriptionAdd").val();
        let title = $("#titleListAdd").val();
        let fulfillmentDate = $("#wishedDateAdd").val();
        let creator = this.getName(1);
        let creationDate = new Date().toLocaleDateString();

        let list = new List({listId, title, creator,
            description, creationDate, fulfillmentDate});
        list.overtakeArticles(articleList);
        this.addList(list);

        super.notify("addNewList",list);
    }

    editViewFromLists(btn){
        let list = this[getListFromHtml](btn);
        super.notify("editViewFromLists",list);
    }

    //DETAILVIEW--------------------------------------------------------------------------------------------------------

    backToAllLists(){
        super.notify("backToAllLists");
    }

    editViewFromDetail(btn){
        let list = this[getDetailListFromHtml](btn);
        super.notify("editViewFromDetail",[list, btn]);
    }

    articleEdit(btn){
        let articleRowClicked = btn.parentElement;
        let qua = $(articleRowClicked).siblings(".qua").html();
        let pri = $(articleRowClicked).siblings(".pri").html();
        let tit = $(articleRowClicked).siblings(".tit").html();

        super.notify("articleEdit",[qua, pri, tit]);
        return articleRowClicked;
    }

    overtakeChangesArticle(articleRowClicked){
        let qua = $(articleRowClicked).siblings(".qua").html();
        let pri = $(articleRowClicked).siblings(".pri").html();
        let tit = $(articleRowClicked).siblings(".tit").html();
        let title = $("#newArticle").val();
        let maxPrice = $("#newPrice").val();
        let quantity = $("#newQuantity").val();

        if(title === ""){
            title = tit;
        }
        if(maxPrice === ""){
            maxPrice = pri;
        }
        if(quantity === ""){
            quantity = qua;
        }

        let newArt = new Article({title, maxPrice, quantity});
        let listId = articleRowClicked.parentElement.parentElement.className;
        let list = this.getList(listId);
        list.editArticle(tit,newArt);

        super.notify("overtakeChangesArticle",[articleRowClicked, title, maxPrice, quantity]);
    }

    deleteArticleFromList(btn){
        if (confirm("Soll dieser Artikel wirklich gelöscht werden?") === true) {
            let title = $(btn).parent().siblings(".tit").html();
            let listId = $(btn).parents('tr').parent('tbody').attr('class');
            let list = this.getList(listId);
            list.deleteArticle(title);

            super.notify("deleteArticleFromList",[btn,listId,list]);
        }
    }

    editListDetail(){
        let titList = $("#listTitle").html();
        let descList = $("#desc").html();
        let dateList = $("#wishedDate").html();
        super.notify("editListDetail",[titList, descList, dateList]);
    }

    overtakeChangesListDetail(btn){
        let titList = $("#listTitle").html();
        let descList = $("#desc").html();
        let dateList = $("#wishedDate").html();
        let title = $("#titleListEdit").val();
        let description = $("#descriptionEdit").val();
        let wishedDate = $("#wishedDateEdit").val();

        if(title === ""){
            title = titList;
        }
        if(description === ""){
            description = descList;
        }
        if(wishedDate === ""){
            wishedDate = dateList;
        }

        let listId = btn.parentElement.parentElement.parentElement.parentElement.className;
        let list = this.getList(listId);
        list.updateListInfos(title, description, wishedDate);

        super.notify("overtakeChangesListDetail",[title, description, wishedDate]);
    }

    finishedEditing(btn){
        let list = this[getDetailListFromHtml](btn);
        super.notify("finishedEditing",[list, btn]);
    }

    deleteListFromDetailView(btn){
        if (confirm("Soll diese Liste wirklich gelöscht werden?") === true) {
            let listId = btn.parentElement.parentElement.parentElement.parentElement.className;

            //delete listview and hide detailview
            super.notify("deleteListFromDetailView",listId);

            //delete in Listmap
            let list = this[getDetailListFromHtml](btn);
            this.deleteList(list);
        }
    }

    overtakeList(btn){
        let list = this[getDetailListFromHtml](btn);
        let listId = list.listId;
        list.changeState(2);
        super.notify("overtakeList",[listId, btn]);
    }

    cancelList(btn){
        let list = this[getDetailListFromHtml](btn);
        let listId = list.listId;
        list.changeState(1);
        super.notify("cancelList",[listId, btn]);
    }

    sendPaidPrice(btn){
        if($("#finalPrice").val() != "" &&  $.isNumeric($("#finalPrice").val()))
        {
            let listId = $(btn).parent().parent().parent().parent().parent().attr('class');
            let list = this.getList(listId);
            list.changeState(3);
            list.setPrice($("#finalPrice").val());

            super.notify("sendFinalPrice",[listId, btn]);
        }

        else{
            window.alert("Bitte einen gültigen Gesamtpreis eintragen!")
        }
    }

//============ private methods =========================================================================================
    [loadFromJSON](){
        $.getJSON("json/covidShopping.json").then((data) => {
            for (let user of data.users) {
                let person = new Person(user);
                this.addUser(person);
            }

            for (let list of data.lists) {
                let l = new List(list);
                this.addList(l);
                this[addArticleToList](l, list);
                this.printList(l);
            }
        });
    }

    [addArticleToList](list,jsonList){
        for(let a of jsonList.articles){
            let article = new Article(a);
            list.addArticleToList(article);
        }
    }

    //GETS THE LIST FROM THE HTML OF DETAILVIEW
    //INPUT PARAMETER: this of pressed button
    //OUTPUT PARAMETER: VOID
    [getDetailListFromHtml](btn){
        let listId = btn.parentElement.parentElement.parentElement.parentElement.className;
        return this.getList(listId);
    }

    //GETS THE LIST FROM THE HTML OF LISTVIEW
    //INPUT PARAMETER: this of pressed button
    //OUTPUT PARAMETER: VOID
    [getListFromHtml](btn){
        let l = $(btn).siblings(".detail").attr("id");
        return this.getList(l);
    }
}

export function getInstance() {
    if(!covidShoppingModel){
        covidShoppingModel = new CovidShoppingModel();
    }
    return covidShoppingModel;
}
