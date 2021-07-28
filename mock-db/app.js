const data = require('./mock-data');
const express = require('express');

const {
    randomInt,
} = require('./utils');


const responseSuccess = (data) => {
    return { success: true, data };
};

const responseFailure = (msg) => {
    return { success: false, msg };
};

const resWriteFail = (res, msg, status=400) => {
    res.status(status).json(responseFailure(msg));
};

const resWriteSuccess = (res, data, status=200) => {
    res.status(status).json(responseSuccess(data));
};

const getLimitOffset = (req, res) => {
    const { limit, offset } = req.query;

    if (limit === null || offset === null) {
        resWriteFail(res, 'Missing query parameters limit and offset');
        return undefined;
    };

    const [ pLimit, pOffset ] = [ parseInt(limit), parseInt(offset) ];

    if ( isNaN(pLimit) || isNaN(pOffset) ) {
        resWriteFail(res, 'Query parameters limit and offset must be of type integer');
        return undefined;
    }
    
    return { limit, offset };
}

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

const app = express();

app.use((req, res, next) => {
    console.log(req.url, req.params, req.query)
    next();
});

const courseRouter = express.Router();
courseRouter.route('/').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {
        let courses = data.courses.slice(offset, limit);
        resWriteSuccess(res, courses);
    }
});
courseRouter.route('/search').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {

        const { title } = req.query;

        if (typeof(title) !== String) {
            resWriteFail(res, 'Query parameter title must be of type string');
            return;        
        }

        const courses = [];
        let isDone = false;
        let idx = 0;
        while (!isDone && courses.length < limit) {
            let course = data.miniCourses[idx];
            if (course.courseTitle.includes(title)) {
                courses.push(course);
            }
            idx += 1;
            if (idx > data.miniCourses.length) {
                isDone = true;
            }
        }
        resWriteSuccess(res, courses.slice(offset, limit));
    }    
});
courseRouter.route('/random').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {
        let courses = shuffle(data.courses).slice(offset, limit);
        resWriteSuccess(res, courses);
    }    
});
courseRouter.route('/minified').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {
        let courses = data.miniCourses.slice(offset, limit);
        resWriteSuccess(res, courses);
    }
});
courseRouter.route('/minified/random').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {
        let courses = shuffle(data.miniCourses).slice(offset, limit);
        resWriteSuccess(res, courses);
    } 
});
courseRouter.route('/minified/:categoryId').get( (req, res) => {
    resWriteSuccess(
        res,
        shuffle(data.miniCourses).slice(0, randomInt(0, data.miniCourses.length))
    );
});
courseRouter.route('/:id').get( (req, res) => {
    const { id } = req.params;
    
    const pId = parseInt(id);

    if (id === null || isNaN(pId) ) {
        resWriteFail(res, 'Missing url parameter id of type integer');
        return;
    };

    let course = data.courses.filter( (course) => course.id == pId )[0];

    if (course === undefined) {
        resWriteFail(res, `No Course with id ${pId}`, 404);        
    } else {
        resWriteSuccess(res, course);        
    }
});

app.use('/api/course', courseRouter);

const uniRouter = express.Router();
uniRouter.route('/').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {
        let universities = data.universities.slice(offset, limit);
        resWriteSuccess(res, universities);
    }    
});
uniRouter.route('/search').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {

        const { name } = req.query;

        if (typeof(name) !== String) {
            resWriteFail(res, 'Query parameter name must be of type string');
            return;        
        }

        const universities = [];
        let isDone = false;
        let idx = 0;
        while (!isDone && universities.length < limit) {
            let university = data.universities[idx];
            if (university.name.includes(name)) {
                universities.push(course);
            }
            idx += 1;
            if (idx > data.universities.length) {
                isDone = true;
            }
        }
        resWriteSuccess(res, universities.slice(offset, limit));
    }        
});
uniRouter.route('/random').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {
        let universities = shuffle(data.universities).slice(offset, limit);
        resWriteSuccess(res, universities);
    }
});
uniRouter.route('/:id').get( (req, res) => {
    const { id } = req.params;
    
    const pId = parseInt(id);

    if (id === null || isNaN(pId) ) {
        resWriteFail(res, 'Missing url parameter id of type integer');
        return;
    };

    let university = data.universities.filter( (university) => university.id == pId )[0];

    if (university === undefined) {
        resWriteFail(res, `No University with id ${pId}`, 404);        
    } else {
        resWriteSuccess(res, university);        
    }    
})

app.use('/api/university', uniRouter);

const categoryRouter = express.Router();
categoryRouter.route('/').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {
        let categories = data.categories.slice(offset, limit);
        resWriteSuccess(res, categories);
    }
});
categoryRouter.route('/search').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {

        const { title } = req.query;

        if (typeof(title) !== String) {
            resWriteFail(res, 'Query parameter title must be of type string');
            return;        
        }

        const categories = [];
        let isDone = false;
        let idx = 0;
        while (!isDone && categories.length < limit) {
            let category = data.categories[idx];
            if (category.title.includes(title)) {
                categories.push(course);
            }
            idx += 1;
            if (idx > data.categories.length) {
                isDone = true;
            }
        }
        resWriteSuccess(res, categories.slice(offset, limit));
    }        
});
categoryRouter.route('/random').get( (req, res) => {
    const { limit, offset } = getLimitOffset(req, res);
    if (limit !== undefined) {
        let categories = shuffle(data.categories).slice(offset, limit);
        resWriteSuccess(res, categories);
    }
});
categoryRouter.route('/:id').get( (req, res) => {
    const { id } = req.params;
    
    const pId = parseInt(id);

    if (id === null || isNaN(pId) ) {
        resWriteFail(res, 'Missing url parameter id of type integer');
        return;
    };

    let category = data.categories.filter( (category) => category.id == pId )[0];

    if (category === undefined) {
        resWriteFail(res, `No Category with id ${pId}`, 404);        
    } else {
        resWriteSuccess(res, category);        
    }    
})

app.use('/api/category', categoryRouter);

app.listen(9200, () => {
    console.log(`Server listening on 9200...`)
});
