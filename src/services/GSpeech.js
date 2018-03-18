let body = {
    config: {
        encoding: "AMR",
        sampleRateHertz: 8000,
        languageCode: "en-US",
    },
    audio: {
        content: ""
    }
}

/* const fetch = require('node-fetch');

fetch('https://speech.googleapis.com/v1/speech:recognize', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer ya29.c.El-BBfGhq_PCs_y-CIux7Yj_21kPYV1E2KJ4XSuVlIrwQ_jl4MyufyyEebLPJHwMBjHz9_knoL2YULTBl7F1tahNFN_zxIaPNKB6_iZoRJZWaCYCcD4Kat0PMGzqF-aW5g',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
}).then(data => data.json())
    .then(data => console.log(JSON.stringify(data)))
    .catch(err => console.log(err)) */


