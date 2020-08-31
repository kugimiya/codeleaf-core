import faker from 'faker';
import fs from 'fs';

const RETAILS_THRESHOLD = 25;
const PRODUCTS_THRESHOLD = 15;
const SALES_THRESHOLD = RETAILS_THRESHOLD * PRODUCTS_THRESHOLD * 3;

const retailTypes = [
    { name: 'local', maxTimeout: 50 },
    { name: 'public', maxTimeout: 250 }
];

const retails = [];
const products = [];
const sales = [];

for (let i = 0; i < RETAILS_THRESHOLD; i++) {
    retails.push({
        id: i,
        name: faker.fake("{{company.companyName}}"),
        type: Math.random() > 0.5 ? 'local' : 'public'
    });
}

for (let i = 0; i < PRODUCTS_THRESHOLD; i++) {
    products.push({
        id: i,
        name: faker.fake("{{commerce.productName}}"),
        price: getRandomInt(10, 150)
    });
}

for (let i = 0; i < SALES_THRESHOLD; i++) {
    const soldAmount = getRandomInt(1, 10);
    const sold = [];

    for (let j = 0; j < soldAmount; j++) {
        sold.push({
            productId: getRandomInt(0, PRODUCTS_THRESHOLD),
            amount: getRandomInt(1, 15)
        });
    }

    sales.push({
        id: i,
        sold,
        retailId: getRandomInt(0, RETAILS_THRESHOLD)
    });
}

fs.writeFileSync(`./testing/dummyBackend/data.json`, JSON.stringify({ retails, products, sales, retailTypes }, undefined, 2));

console.log('Done!');

function getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}
