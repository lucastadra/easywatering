exports.parse2Json = (rawData) =>{
    let data = {};
    console.log("Data raw: ", rawData.split(':')[1]);
    data.id = String(rawData[0]).split(':')[1];
    data.temperatura = String(rawData[0]).split(':')[1];
    data.umidadeAr = String(rawData[1]).split(':')[1];

    return null;
}

// const str = 'try-again-later';

// const after = str.slice(str.indexOf('-') + 1);
// console.log(after); // 👉️ again-later

// const before = str.slice(0, str.indexOf('-'));
// console.log(before); // 👉️ try