export default class Person{
    #userId;
    #firstName;
    #lastName;
    #birthday;
    #address;

    constructor({userId ,firstName, lastName, birthday, address}){
        this.#userId = userId;
        this.#firstName = firstName;
        this.#lastName = lastName;
        this.#birthday = birthday;
        this.#address = address;
    }

    //Getter for first and last name
    //Input Parameters: void
    //Output Parameters: STRING
    getName(){
        return this.#firstName + " " + this.#lastName;
    }

    //Getter for the userId
    //Input Parameters: void
    //Output Parameters: NUMBER
    getPersonId(){
        return this.#userId;
    }
}