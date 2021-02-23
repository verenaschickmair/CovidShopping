let view;
let printList = Symbol();
let loadDetailList = Symbol();
let getDetailViewStyle = Symbol();
let printDetailList = Symbol();
let printDetailListInfo = Symbol();
let getListViewStyle = Symbol();
let deleteDetailContent = Symbol();
let printArticle = Symbol();
let printArticleWithButtons = Symbol();
let recentArticleNumber = Symbol();

class CovidShoppingView {
    #dom;
    #listView;

    constructor() {
        this.#dom = {
            document: $(document)
        };
        this.#listView = 0;

        this[getListViewStyle]();
    }

    get DOM(){
        return this.#dom;
    }

    //BOTH VIEWS--------------------------------------------------------------------------------------------------------
    switchRole(list){
        this[getListViewStyle]();
        this[getDetailViewStyle](list);
    }

    //LISTVIEW----------------------------------------------------------------------------------------------------------

    addList(list){
        this[printList](list);
    }

    getDetailView(list){
        $(".listView").hide();
        $(".detailView").show();

        this[loadDetailList](list, 0);
    }

    deleteListHtml(btn){
        btn.parentElement.remove();
    }

    createNewList(values){
        $("#nameCreatorAdd").html(values[0]);
        $("#dateCreationAdd").html(values[1]);
    }

    addArticlesToNewList(article){
        $("#forArticles").append(`<div>
                <div>Artikel: ${article.articleTitle}</div>
                <div>Menge: ${article.quantity}</div>
                <div>max. Preis: ${article.maxPrice}</div>
                </div>`);

        $("#ArticleAdd").val("");
        $("#ArticleAddQuantity").val("");
        $("#ArticleAddPrice").val("");
    }

    addNewList(list){
        this[printList](list);
        $("form input").val('');
        $("#forArticles").empty();
    }

    editViewFromLists(list){
        this[loadDetailList](list, 2);

        //DESIGN OF DETAILVIEW FOR EDITING
        $(".detailView .edit").text("Fertig");
        $(".detailView .edit").attr("id", "editing");
        $("#editBtn").show();
        $(".articleEdit").parent().show();
        $(".articleDelete").parent().show();
        $(".listView").hide();
        $(".detailView").show();
    }

    //DETAILVIEW--------------------------------------------------------------------------------------------------------

    backToAllLists(){
        $(".detailView").hide();
        $(".listView").show();
        this[deleteDetailContent]();
    }

    editViewFromDetail(values){
        this[loadDetailList](values[0], 1);
        $("#editBtn").show();
        $(".articleEdit").parent().show();
        $(".articleDelete").parent().show();
        $(".detailView ."+values[0].listId+" .edit").html("Fertig");
        $(values[1]).attr("id", "editing");
    }

    articleEdit(values){
        $("#newArticle").attr("placeholder", values[2]);
        $("#newPrice").attr("placeholder", values[1]);
        $("#newQuantity").attr("placeholder", values[0]);
    }

    overtakeChangesArticle(values){
        $(values[0]).siblings(".qua").html(values[3]);
        $(values[0]).siblings(".pri").html(values[2]);
        $(values[0]).siblings(".tit").html(values[1]);

        $("form input").val('');
    }

    deleteArticleFromList(values) {
        $(values[0]).parent().parent('tr').remove();
        this[recentArticleNumber](values[1], values[2]); //update Article number
    }

    editListDetail(values){
        $("#titleListEdit").attr("placeholder", values[0]);
        $("#descriptionEdit").attr("placeholder", values[1]);
        $("#wishedDateEdit").attr("placeholder", values[2]);
    }

    overtakeChangesListDetail(values){
        $("#listTitle").html("Titel: " + values[0]);
        $("#desc").html("Beschreibung: " + values[1]);
        $("#wishedDate").html("Erfüllen bis: " + values[2]);
        $("form input").val('');
    }

    finishedEditing(values){
        this[loadDetailList](values[0], 1);
        $(values[1]).html("Einkaufsliste bearbeiten");
        $("#editBtn").hide();
        $(".articleEdit").parent().hide();
        $(".articleDelete").parent().hide();
        $(values[1]).removeAttr("id");
    }

    deleteListFromDetailView(listId){
        //close Detailview and delete content
        $("#"+listId).parent(".list").remove();
        $(".detailView").hide();
        $(".listView").show();
        this[deleteDetailContent]();
    }

    overtakeList(values){
        //design in detailview
        $(values[1]).html("Einkaufsliste stornieren");
        $(values[1]).attr("id", "isOvertaken");
        $("#state").css("color", "orange");
        $("#state").html("Status: übernommen");
        $(".tableEnd").show();
        $(values[1]).closest(".edit").hide();

        //design in listview
        $("#"+ values[0]).siblings('#statusForm').css("background-color","orange");
        $("#"+values[0]).siblings('a').not('.detail').removeAttr("class");
    }

    cancelList(values){
        //design in detailview
        $(values[1]).html("Einkaufsliste übernehmen");
        $(values[1]).removeAttr("id");
        $("#state").css("color", "green");
        $("#state").html("Status: nicht übernommen");
        $(".tableEnd").hide();

        //design in listview
        $("#"+values[0]).siblings('#statusForm').css("background-color","green");
        $("#"+values[0]).siblings('#' + values[0] + 'ed').addClass("edit");
        $("#"+values[0]).siblings('#' + values[0] + 'del').addClass("delete");
    }

    sendFinalPrice(values){
        //design of detailview
        $("#state").html("Status: abgeschlossen");
        $("#state").css("color", "red");
        $(".buttons a").not(".backToAllLists").hide();
        $(".tableEnd").hide();
        $("#finalPrice").val("");

        //design of listview
        $("#" + values[0]).parent().css("background-color", "lightgrey");
        $("#" + values[0]).siblings('#statusForm').css("background-color", "red");
        $("#" + values[0]).siblings('a').not('.detail').remove();
    }

    //===============private ===========================================================================================

    //Prints a single list in the listview
    //Input Parameters: void
    //Ouput Parameters: void
    [printList](list){
        let listId = list.listId;
        let creator = list.creator;
        let quantity = list.quantityOfArticles;

        $(".listBox").append(`<div class="list">
                    <div id="statusForm" class="${listId}"></div>
                    <a href="#" class="edit" id="${listId + 'ed'}">Bearbeiten</a>
                    <a href="#" class="delete" id="${listId + 'del'}">Löschen</a>
                    <h4>${creator}</h4>
                <p id="quantityArticlesList">${quantity + ' Artikel'}</p>
                <a href="#" class ="detail" id="${listId}">Detailansicht</a>
                </div>`);
    }

    //PRINTS THE CONTENT OF THE DETAILVIEW (FOR EDITING ALSO BUTTONS ARE SHOWN)
    //INPUT PARAMETER: LIST, NUMBER
    //OUTPUT PARAMETER: VOID

    [loadDetailList](list, withBtn){
        this[printDetailList](list,withBtn);
        this[getDetailViewStyle](list);
    }

    //EMPTIES THE CONTENT OF A DETAILVIEW AFTER LEAVING
    //INPUT PARAMETER: VOID
    //OUTPUT PARAMETER: VOID
    [getListViewStyle]() {
        //if Helper, hide buttons for helpseeker
        if (this.#listView === 1) {
            $(".role").html(`<h1>Helfer</h1>`);
            $(".listView .edit").hide();
            $(".listView .delete").hide();
            $("#addList").hide();

            //SWITCH TO HELPER
            this.#listView = 0;

            //if Helpseeker, hide buttons for helper
        } else {
            //label of status
            $(".role").html(`<h1>Hilfesuchender</h1>`);
            $("#addList").show();
            $(".listView .edit").show();
            $(".listView .delete").show();

            //SWITCH TO HELPSEEKER
            this.#listView = 1;
        }
    }

    //CHECKS THE LIST STATUS OF THE OPENED LIST AND HIDES / SHOWS / MOFIFIES THE PAGE ACCORDINGLY
    //INPUT PARAMETER: LIST
    //OUTPUT PARAMETER: VOID

    [getDetailViewStyle](list) {
        //LIST IS OPEN
        if (list != undefined){
            if (list.status == "nicht übernommen") {
                $("#state").css("color", "green");
                $(".tableBox").css("background-color", "#ffffff");
                $(".backToAllLists").show();
                $(".tableEnd").hide();

                //VIEW OF HELPER
                if (this.#listView === 0) {
                    $(".overtake").show();
                    $(".overtake").removeAttr("id");
                    $(".detailView .edit").hide();
                    $(".detailView .delete").hide();
                    $("#editBtn").hide();
                    $(".articleEdit").parent().hide();
                    $(".articleDelete").parent().hide();
                }
                //VIEW OF HELPSEEKER
                else {
                    $(".detailView .edit").show();
                    $(".detailView .edit").html("Einkaufsliste bearbeiten");
                    $(".detailView .edit").removeAttr("id");
                    $(".detailView .delete").show();
                    $(".overtake").hide();
                }
            }

            //LIST IS OVERTAKEN BY A HELPER
            else if (list.status == "übernommen") {
                $("#state").css("color", "orange");
                $(".tableBox").css("background-color", "#ffffff");
                $(".backToAllLists").show();
                $(".detailView .edit").hide();
                $(".detailView .delete").hide();
                $(".listView .edit").hide();
                $(".listView .delete").hide();

                //VIEW OF HELPER
                if (this.#listView === 0) {
                    $(".tableEnd").show();
                    $(".overtake").html("Einkaufsliste stornieren");
                    $(".overtake").attr("id", "isOvertaken");
                    $(".buttons .overtake").show();
                }

                //VIEW OF HELPSEEKER
                else {
                    $(".tableEnd").hide();
                    $(".overtake").hide();
                    $(".buttons .overtake").hide();
                }
            }

            //LIST IS DONE BY A HELPER
            else if (list.status == "abgeschlossen") {
                $("#state").css("color", "red");
                $(".backToAllLists").show();
                $(".overtake").hide();
                $(".detailView .edit").hide();
                $(".detailView .delete").hide();
                $(".tableEnd").hide();
                $("#editBtn").hide();
            }
        }
    }

    //Prints the detail view (depending on the button if buttons are included or not)
    //Input Parameters: NUMBER
    //Output Parameters: void
    [printDetailList](list, withBtn){
        $("#dynamicTableStart tbody").children().remove();
        $("#dynamicTableStart tbody").removeClass();
        $("#dynamicTableStart tbody").addClass(list.listId);

        //PRINTS ALL INFOS WITHOUT ANY EDIT-BUTTONS
        if(withBtn === 0) {
            this[printDetailListInfo](list);
            for (let article of list.articles.values()) {
                this[printArticle](article);
            }
        }

        //PRINTS ONLY THE ARTICLES WITH EDIT-BUTTONS
        else if(withBtn === 1){
            for (let article of list.articles.values()) {
                this[printArticleWithButtons](article);
            }
        }

        //PRINTS ALL INFOS AND EDIT-BUTTONS
        else if (withBtn === 2){
            this[printDetailListInfo](list);
            for (let article of list.articles.values()) {
                this[printArticleWithButtons](article);
            }
        }
    }

    //Prints the details and basic buttons of the detail view
    //Input: void
    //Output: void
    [printDetailListInfo](list){
        $("#listDetailId").addClass(list.listId);
        $("#listTitle").append(`Titel: ${list.title}`);
        $("#creatorList").append(`Ersteller: ${list.creator}`);
        $("#creatorName").append(`Einkaufsliste von ${list.creator}`);
        $("#creationDate").append(`Erstellungsdatum: ${list.creationDate}`);
        $("#quantityArticles").append(`${list.quantityOfArticles} Artikel`);
        $("#wishedDate").append(`Erfüllen bis: ${list.fulfillmentDate}`);
        $("#state").append(`Status: ${list.status}`);
        $("#desc").append(`Beschreibung: ${list.description}`);
        $("#editBtn").append(`<a href="#" data-toggle="modal" data-target="#editModal" class="${list.listId}">Listendetails bearbeiten</a>`);

        $(".backToAllLists").append(`Zurück`);
        $(".overtake").append(`Einkaufsliste übernehmen`);
        $(".detailView .edit").append(`Einkaufsliste bearbeiten`);
        $(".detailView .delete").append(`Einkaufsliste löschen`);
        $(".tableEnd").hide();
    }

    //EMPTIES THE CONTENT OF A DETAILVIEW AFTER LEAVING
    //INPUT PARAMETER: VOID
    //OUTPUT PARAMETER: VOID

    [deleteDetailContent](){
        //Inhalte aus Detailansicht rauslöschen
        $("#listDetailId").removeClass();
        $("#listTitle").empty();
        $("#creatorName").empty();
        $("#creatorList").empty();
        $("#creationDate").empty();
        $("#quantityArticles").empty();
        $("#wishedDate").empty();
        $("#desc").empty();
        $("#state").empty();
        $("#editBtn").empty();
        $(".backToAllLists").empty();
        $(".detailView .delete").empty();
        $(".detailView .edit").empty();
        $(".overtake").empty();
        $("#dynamicTableStart body").children().remove();
        $("#editing").text("Bearbeiten");
    }

    //Prints a row with articles in the table in HTML
    //Input Parameters: void
    //Output Parameters: void
    [printArticle](article) {
        $("#dynamicTableStart tbody").append(`
        <tr>
            <td>${article.quantity}</td>
            <td>${article.articleTitle}</td>
            <td>${article.maxPrice}</td>
        </tr>`);
    }

    //Prints a row wih articles and edit-buttons in the table in HTML
    //Input Parameters: void
    //Output Parameters: void
    [printArticleWithButtons](article){
        $("#dynamicTableStart tbody").append(`
        <tr>
            <td class="qua">${article.quantity}</td>
            <td class="tit">${article.articleTitle}</td>
            <td class="pri">${article.maxPrice}</td>
            <td><a href="#" class="articleEdit" data-target="#editArticleModal" data-toggle="modal">bearbeiten</a></td>
            <td><a href="#" class="articleDelete">löschen</a></td>
        </tr>`);
    }

    //CHANGES THE HTML TO THE RECENT ARTICLE COUNT
    //Input Parameters: void
    //Output Parameters: void
    [recentArticleNumber](listId, list){
        $("#quantityArticles").html(list.quantityOfArticles + " Artikel");
        $("#"+listId).siblings("#quantityArticlesList").html(list.quantityOfArticles + " Artikel");
    }
}

export function getInstance() {
    if(!view){
        view = new CovidShoppingView();
    }
    return view;
}
