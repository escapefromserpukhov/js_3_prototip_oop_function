class Good {
    constructor(id, name, description, sizes, price, available) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.sizes = sizes;
        this.price = price;
        this.available = available;
    }
    setAvailable(status) {
        this.available = status;
    }
}

class GoodsList {
    #goods
    constructor(filter, sortPrice, sortDir) {
        this.#goods = [];
        this.filter = filter;
        this.sortPrice = sortPrice;
        this.sortDir = sortDir;
    }
    get list() {
        const forSaleList = this.#goods.filter(good => this.filter.test(good.name));
        
        if (!this.sortPrice) {
            return forSaleList;
        }

        if (this.sortDir) {
            return forSaleList.sort((a, b) => (a.price - b.price));
        }
        return forSaleList.sort((a, b) => (b.price - a.price));
    }

    add(newGood) {
        this.#goods.push(newGood);
    }

    remove(id) {
        const getIndex = this.#goods.findIndex(good => good.id === id);
        if (getIndex != undefined) {
            this.#goods.splice(getIndex, 1);
        }
        return getIndex;
    }
}


class BasketGood extends Good {
    constructor(id, name, description, sizes, price, available, amount) {
        super(id, name, description, sizes, price, available);
        this.amount = amount;
    }
}

class Basket {
    constructor() {
        this.goods = []
    }
    
    get totalAmount() {
        return this.goods.map(item => item.amount).reduce((a, b) => a + b, 0)
    }

    get totalSum() {
        return this.goods.reduce((a, b) => a + b.amount * b.price, 0);
    }

    add(good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            this.goods[index].amount += amount;
        } else {
            let addGood = new BasketGood(good.id, good.name, good.description, good.sizes, good.price, good.available, amount);
            this.goods.push(addGood);
        }
    }

    remove(good, amount) {
        let index = this.goods.findIndex(value => value.id === good.id);
        if (index >= 0) {
            if (this.goods[index].amount - amount <= 0 || amount === 0) {
                this.goods.splice(index, 1);
            } else {
                this.goods[index].amount -= amount;
            }
        } 
    }

    clear() {
        this.goods.length = 0;
    }

    removeUnavailable() {
        this.goods.filter(item => item.available === false).forEach(value => this.remove(value));
    }

}


const first = new Good(1, "T-shirt", "color: white, material: coton", ["S", "M", "XL"], 1500, true);
const second = new Good(2, "Dress", "color: red, material: silk", ["S", "M", "L"], 10000, true);
const third = new Good(3, "Jacket", "color: black, material: leather", ["XS", "M", "XXL"], 35000, true);
const fourth = new Good(4, "Jeans", "color: blue, material: coton", ["S", "M", "L", "XL"], 8000, true);
const fifth = new Good(5, "Shorts", "color: grey, material: coton", ["L", "XL"], 4500, true);

// second.setAvailable(false);

// console.log(second)

const catalog = new GoodsList(/Jeans/i, true, false);

catalog.add(first);
catalog.add(second);
catalog.add(third);
catalog.add(fourth);
catalog.add(fifth);

// console.log(`Selected goods from catalog: `, catalog.list);

catalog.sortPrice = true;
catalog.sortDir = false;

// console.log(`Sorted by price in descending order: `, catalog.list);

catalog.remove(4);
// console.log(`Removing item from catalog:`, catalog.list);

const basket = new Basket();

basket.add(first, 1);
basket.add(second, 2);
basket.add(third, 3);
basket.add(fourth, 4);
basket.add(fifth, 5);

console.log(`Total items in shopping cart: ${basket.totalAmount}`);
console.log(`Total sum for ${basket.totalAmount} items in a cart is: $${basket.totalSum}`);

basket.remove(second, 1);
basket.remove(third, 2);

// console.log(basket.goods)

basket.removeUnavailable();

// console.log(basket.goods)

basket.clear();

// console.log(basket.goods)