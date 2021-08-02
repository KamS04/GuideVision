const {
    suffix,
    randomLetter,
    randomInt,
    range
} = require('./utils');

const randomAddress = () => {
    let streetNumber = range(3).reduce( (p) => p + randomInt(0, 9), '');
    let streetName = randomInt(0, 9);
    return `${streetNumber} ${streetName}${suffix(streetName)} Street`;
}

const randomPostalCode = () => {
    return range(3).reduce( (p, _) => p + randomLetter() + randomInt(0, 9), '').toUpperCase();
}

const logos = [
    'https://uwaterloo.ca/brand/sites/ca.brand/files/universityofwaterloo_logo_horiz_rev_rgb.png',
    'https://www.queensu.ca/sites/all/themes/queensbase_omega/images/queens_logo_white_108x74.png',
    //'https://www.queensu.ca/sites/all/themes/queensbase_omega/images/wordmark_489x62.png',
    'https://www.utoronto.ca/sites/all/themes/uoft_stark/img/U-of-T-logo.png',
]

const universities = range(3).map( (_, id) => {
    return {
        id: id,
        name: `University #${id}`,
        faculties: range(randomInt(0, 5)).map( (_, idx) => `Random Faculty #${idx}`),
        phone: range(9).reduce( (p) => p + randomInt(0, 9), ''),
        streetAddress: randomAddress(),
        city: 'Mississauga',
        provinceState: 'Ontario',
        country: 'Canada',
        postalCode: randomPostalCode(),
        url: 'https://google.com',
        iconUrl: logos[id]
    };
});

const courses = range(80).map( (_, id) => {
    let uni = universities[ randomInt(0, universities.length) ];
    return {
        id: id,
        universityId: uni.id,
        title: `Course #${id}`,
        faculty: uni.faculties[ randomInt(0, uni.faculties.length) ],
        prerequisites: range(randomInt(0, 5)).map( (_, idx) => { return { title: `Prerequisite ${idx}`, prerequisites: range(3).map( (_, pIdx) => `PreReq ${pIdx}`)} }),
        requiredAverage: 44,
        domesticTuition: randomInt(10000, 40000),
        domesticBooks: randomInt(1000, 4000),
        domesticNotes: 'No Notes yet',
        internationalTuition: randomInt(10000, 40000),
        internationalBooks: randomInt(1000, 4000),
        internationalNotes: 'No Notes yet',
        notes: 'No Notes yet'
    }
});

const miniCourses = courses.map( (course) => {
    let uni = universities.filter((uni) => uni.id == course.universityId)[0];
    return {
        courseId: course.id,
        courseTitle: course.title,
        universityName: uni.name,
        universityIconUrl: uni.iconUrl,
        universityId: uni.id
    };
});

const categories = range(3).map( (_, idx) => {
    return { 
        id: idx,
        title: `Pathway #${idx}`,
        futureJobOpportunities: range(randomInt(0, 5)).map( (_, idx) => `Opportunity ${idx}`)
    };
});

module.exports = {
    universities,
    courses,
    miniCourses,
    categories
}