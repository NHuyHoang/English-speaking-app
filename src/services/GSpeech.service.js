/* const config = {
    api_uri: "https://speech.googleapis.com/v1/speech:recognize",
    access_token: "ya29.c.ElqCBYeYHueZ8JZAGT4lTo3xV7Ndz0EH83Bkq-e0fXluoBYDMWMyiG4X1sLWgdI5peH_4I_u6ibhcOGNuoI1AZa99TcpwsfZSgAZcBlFH15OjDc6yapKbwFBDpQ",
    
} */

export default fetchData = (config,base64code, answer) => {
    let body = {
        config: {
            encoding: "AMR",
            sampleRateHertz: 8000,
            languageCode: "en-US",
        },
        audio: {
            content: base64code
        }
    }
    return fetch(config.api_uri, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + config.access_token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body),
    }).then(data => data.json())
        /* .then(data => chooseResult(data,answer)) */
        .then(data => {
            console.log(data);
            return showAllAlternatives(data);
        })
        .catch(err => {
            console.log(err.TypeError)
        })
}


const chooseResult = (data, answer) => {
    let results = data.results;
    let finalResult = "Error!!!";
    results.forEach(result => {
        let resultHolder = findMax(result.alternatives);
        if (compareAnswer(answer, resultHolder.transcript))
        finalResult = resultHolder.transcript;
    })

    return finalResult
}

const showAllAlternatives = (data) => {
    let results = data.results;
    let finalResult = [];
    results.forEach(result => {
        let resultHolder = findMax(result.alternatives);
        finalResult.push(resultHolder.transcript);
    })
    return finalResult
}


const findMax = (arr) => {
    if (arr.length === 0) return null;
    let max = 0;
    let result = null;
    arr.forEach(element => {
        if (max < element.confidence) {
            max = element.confidence;
            result = Object.assign({}, element);
            result.transcript = result.transcript.toLowerCase().trim();
        }
    })
    return result;
}

const compareAnswer = (answer, input) => {
    let inp = input.replace(/\s/g, '');
    let ans = answer.replace(/\s/g, '');
    return inp === ans;
}

let example = { "results": [{ "alternatives": [{ "transcript": "food", "confidence": 0.75836825 }] }, { "alternatives": [{ "transcript": " it's cool.", "confidence": 0.6815934 }] }, { "alternatives": [{ "transcript": " School", "confidence": 0.83758235 }] }] }
