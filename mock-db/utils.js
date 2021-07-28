const suffix = (number) => {
    let lastChar = number.toString().slice(-1)
    if (lastChar == '1') {
        return 'st';
    } else if (lastChar == '2') {
        return 'nd';
    } else if (lastChar == '3') {
        return 'rd';
    } else {
        return 'th';
    }
}

const randomLetter = () => {
    return Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 1);
}

const randomInt = (start, end) => {
    return Math.floor(Math.random() * (end - start)) + start;
}

const range = (length) => {
    return [...Array(length)];
}

module.exports = {
    suffix,
    randomLetter,
    randomInt,
    range
}