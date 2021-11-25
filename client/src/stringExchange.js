

const switchStringFirstAndLastCharacter = (str) => {
    const strArray = [...str];
    const lastCharacter = strArray[strArray.length - 1];

    strArray[strArray.length - 1] =  strArray[0] ;
    strArray[0] = lastCharacter;

    return strArray.join('');
} 