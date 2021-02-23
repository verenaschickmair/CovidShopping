export default class Article {
    #articleTitle;
    #maxPrice;
    #quantity;

    constructor({title, maxPrice, quantity}) {
        this.#articleTitle = title;
        this.#maxPrice = maxPrice;
        this.#quantity = quantity;
    }

    //Getter
    //Input Parameters: void
    //Output Parameters: STRING
    get articleTitle() {
        return this.#articleTitle;
    }

    get maxPrice(){
        return this.#maxPrice;
    }

    get quantity(){
        return this.#quantity;
    }

    //Setter
    //Input Parameters: Article
    //Output Parameters: void
    setArticle(newArticle) {
        this.#articleTitle = newArticle.articleTitle;
        this.#maxPrice = newArticle.maxPrice;
        this.#quantity = newArticle.quantity;
    }
}
