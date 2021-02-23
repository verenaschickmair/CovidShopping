export default class List {
    #listId;
    #title;
    #creator;
    #description;
    #creationDate;
    #fulfillmentDate;
    #quantityOfArticles;
    #totalPricePaid;
    #status;
    #articles;

    constructor({listId, title, creator, description, creationDate, fulfillmentDate}) {
        this.#listId = listId;
        this.#title = title;
        this.#creator = creator;
        this.#description = description;
        this.#creationDate = creationDate;
        this.#fulfillmentDate = fulfillmentDate;

        this.#totalPricePaid = 0;
        this.#status = "nicht übernommen";
        this.#articles = new Map();
        this.#quantityOfArticles = 0;
    }

    get listId(){
        return this.#listId;
    }

    get title(){
        return this.#title;
    }

    get creator(){
        return this.#creator;
    }

    get description(){
        return this.#description;
    }

    get creationDate(){
        return this.#creationDate;
    }

    get fulfillmentDate(){
        return this.#fulfillmentDate;
    }

    get totalPricePaid(){
        return this.#totalPricePaid;
    }

    get status(){
        return this.#status;
    }

    get quantityOfArticles(){
        return this.#quantityOfArticles;
    }

    get articles(){
        return this.#articles;
    }

    //Add article to a list and increase article counter
    //Input Parameters: Article
    //Output Parameters: void
    addArticleToList(article){
        this.#articles.set(article.articleTitle, article);
        this.#quantityOfArticles++;
    }

    //Delete article of a list an decreases article counter
    //Input Parameters: ArticleTitle (STRING)
    //Output Parameters: void
    deleteArticle(articleTitle){
        this.#quantityOfArticles--;
        this.#articles.delete(articleTitle);
    }

    //Edit: Deletes the old Article and adds a new one
    //Input Parameters: oldArticleTitle (STRING), newArticle (Article)
    //Output Parameters: void
    editArticle(oldArticleTitle, newArticle){
        this.#articles.delete(oldArticleTitle);
        this.#articles.set(newArticle.articleTitle, newArticle);
    }

    //Overtakes a Map of articles and sets its size as new article count
    //Input Parameters: articleMap (Map)
    //Output Parameters: void
    overtakeArticles(articleMap) {
        this.#articles = articleMap;
        this.#quantityOfArticles = articleMap.size;
    }

    //Sets the status of the list according to the number given
    //Input Parameters: NUMBER
    //Output Parameters: void
    changeState(number){
        if(number === 1){
            this.#status = "nicht übernommen";
        }
        if(number === 2){
            this.#status = "übernommen";
        }
        if(number === 3){
            this.#status = "abgeschlossen";
        }
    }

    //Updates some infos of the list by editing list details
    //Input Parameters: STRING, STRING, STRING
    //Output Parameters: void
    updateListInfos(title, description, wishedDate){
        this.#title = title;
        this.#description = description;
        this.#fulfillmentDate = wishedDate;
    }

    //Setter for the final Price paid
    //Input Parameters: NUMBER
    //Output Parameters: void
    setPrice(price){
        this.#totalPricePaid = price;
    }
}