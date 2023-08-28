const toObjet = (json) => {
    const stringifyJSON = JSON.stringify(json)
    const parseJSON = JSON.parse(stringifyJSON)
    return parseJSON;	
};

export default toObjet;