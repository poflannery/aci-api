module.exports = {
    master: async function (path,method,body) {
        let data;
        let error;
        await fetch(process.env.XATA_BASE_URL + '_master:main' + path, {
            headers: {
                Authorization: 'Bearer ' + process.env.XATA_API_KEY,
                'Content-Type': 'application/json',
            },
            method: method,
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(res => data = res)
        .catch(err => error = err)
        return { data,error }
    },
    env: async function (database,path,method,body) {
        let data;
        let error;
        await fetch(process.env.XATA_BASE_URL + database + ':main' + path, {
            headers: {
                Authorization: 'Bearer ' + process.env.XATA_API_KEY,
                'Content-Type': 'application/json',
            },
            method: method,
            body: JSON.stringify(body)
        })
        .then(res => res.json())
        .then(res => data = res)
        .catch(err => error = err)
        return { data,error }
    },
}
