const generatePassword = () => {
    const lowerCase = 'abcdefghijklmnopqrlstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const number = '0123456789';
    const specialChar = '#*@&$%';

    const mdp = 
        upperCase[Math.floor(Math.random() * upperCase.length)] +
        number[Math.floor(Math.random() * number.length)] +
        lowerCase[Math.floor(Math.random() * lowerCase.length)] +
        number[Math.floor(Math.random() * number.length)] +
        upperCase[Math.floor(Math.random() * upperCase.length)] +
        number[Math.floor(Math.random() * number.length)] +
        lowerCase[Math.floor(Math.random() * lowerCase.length)] +
        specialChar[Math.floor(Math.random() * specialChar.length)]

    //console.log('mdp', mdp)
    return mdp;
}

module.exports = { generatePassword }