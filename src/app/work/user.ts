export class User{
    name: string;
    age: number;
    
    constructor(name:string, age?:number){
        this.name = name || 'leo';
        this.age = age || 12;
    }
}

const leo = new User('Leo');
const tom = new User('Tom', 0);
