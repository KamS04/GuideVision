function setValue(inputElement, value) {
    inputElement.value = value;
    inputElement.dispatchEvent(new Event('change'));
}

function magicifyString(item) {
    let parsed = parseInt(item);
    return isNaN(parsed) ? item : parsed;
}

const modalSheet = document.getElementById('modalViewer');
const modalTitle = modalSheet.querySelector('#modalTitle');
const modalContent = modalSheet.querySelector('#content');

function showModal(title, content) {
    modalTitle.textContent = title;
    modalContent.innerHTML = "";
    modalContent.appendChild(content);
    modalSheet.style.display = 'block';
}

function closeModal() {
    modalContent.innerHTML = "";
    modalSheet.style.display = 'none';
}

const CATEGORY_KEYS = [
    "id",
    "title",
    "futureJobOpportunities"
];

class Category {
    constructor(partial) {
        if (CATEGORY_KEYS.some( (it) => partial[it] == undefined )) {
            throw 'Parameters not met';
        }

        let {
            id,
            title,
            futureJobOpportunities
        } = partial;

        this.id = id;
        this.title = title;
        this.futureJobOpportunities = futureJobOpportunities;
    }
}

const CCJ_KEYS = [
    "id",
    "course_id",
    "category_id"
]

class CCJ {
    constructor(partial) {
        if (CCJ_KEYS.some( (it) => partial[it] == undefined )) {
            throw 'Parameters not met';
        }

        let {
            id,
            course_id,
            category_id
        } = partial;

        this.id = id;
        this.course_id = course_id;
        this.category_id = category_id;
    }
}

const COURSE_KEYS = [
    "id",
    "universityId",
    "courseUrl",
    "title",
    "faculty",
    "prerequisites",
    "requiredAverage",
    "domesticTuition",
    "domesticBooks",
    "domesticNotes",
    "internationalTuition",
    "internationalBooks",
    "internationalNotes",
    "notes"
]

class Course {
    constructor(partial) {
        if (COURSE_KEYS.some( (it) => partial[it] === undefined)) {
            throw new Error('Parameters not met');
        }

        let {
            id,
            universityId,
            courseUrl,
            title,
            faculty,
            prerequisites,
            requiredAverage,
            domesticTuition,
            domesticBooks,
            domesticNotes,
            internationalTuition,
            internationalBooks,
            internationalNotes,
            notes,
        } = partial;

        this.id = id
        this.universityId = universityId
        this.courseUrl = courseUrl
        this.title = title
        this.faculty = faculty
        this.prerequisites = prerequisites
        this.requiredAverage = requiredAverage
        this.domesticTuition = domesticTuition
        this.domesticBooks = domesticBooks
        this.domesticNotes = domesticNotes
        this.internationalTuition = internationalTuition
        this.internationalBooks = internationalBooks
        this.internationalNotes = internationalNotes
        this.notes = notes
    }
}

const UNI_KEYS = [
    "id",
    "name",
    "faculties",
    "phone",
    "streetAddress",
    "city",
    "provinceState",
    "country",
    "postalCode",
    "url",
    "iconUrl"
];

class University {
    constructor(partial) {
        if (UNI_KEYS.some( (it) => partial[it] === undefined )) {
            throw new Error('Parameters not met');
        }

        let {
            id,
            name,
            faculties,
            phone,
            streetAddress,
            city,
            provinceState,
            country,
            postalCode,
            url,
            iconUrl
        } = partial;

        this.id = id;
        this.name = name;
        this.faculties = faculties;
        this.phone = phone;
        this.streetAddress = streetAddress;
        this.city = city;
        this.provinceState = provinceState;
        this.country = country;
        this.postalCode = postalCode;
        this.url = url;
        this.iconUrl = iconUrl;
    }
}

const RAW_IN_CACHE = 'raw_in_cache';

class DataInType {
    constructor() {
        this.universities = [];
        this.courses = [];
        this.categories = [];
        this.cat_cou_juncs = [];
    }
}

class DataOut {
    constructor(title, additions, editions, deletions) {
        this.title = title;
        this.additions = additions;
        this.editions = editions;
        this.deletions = deletions;
    }
}

class GlobalDataIn {
    constructor() {
        this.data = null;
        this.currentData = new DataInType();
        this.onLoadHandlers = [];
    }

    async parse(content) {
        this.rawData = content;
        this.currentData = await JSON.parse(content);
        localStorage.setItem(RAW_IN_CACHE, content);
        console.log(
`Loaded DB Data with
    ${this.currentData.universities.length} universities,
    ${this.currentData.courses.length} courses,
    ${this.currentData.categories.length} categories,
    ${this.currentData.cat_cou_juncs.length} cat_cou_juncs
`
        );
        this.onLoadHandlers.forEach( (handler) => handler() );
    }

    reset() {
        localStorage.removeItem(RAW_IN_CACHE);
    }

    addOnLoad(handler) {
        this.onLoadHandlers.push(handler);
    }
}

class GlobalUniversityProcessor {
    constructor() {
        Injector.globalDataIn.addOnLoad(() => this.setup() );
    }

    setup() {
        let originalUniversities = Injector.globalDataIn.currentData.universities;
        
        this.originalUniversities = {};
        originalUniversities.forEach( (university) => {
            this.originalUniversities[university.id] = university;
        });

        this.newUniversityId = 0;

        this.addedUniversities = {};
        this.editedUniversities = {};
        this.deletedUniversities = {};

        drawAllUniversities(originalUniversities);
    }

    getNewUniversityId() {
        this.newUniversityId++;
        return `@:uni${this.newUniversityId}`;
    }

    addUniversity(university) {
        this.addedUniversities[university.id] = university;
        addUniversityToDisplayPanel(university);
    }

    getAddedUniversities() {
        return Object.values(this.addedUniversities);
    }

    getAddedUniversity(id) {
        return this.addedUniversities[id];
    }

    removeAddedUniversity(id) {
        delete this.addedUniversities[id];
        removeAddedUniversityFromDisplayPanel(id);
    }

    getUniversity(id) {
        let uni = this.originalUniversities[id];
        if (this.editedUniversities[id] !== undefined) {
            Object.entries(this.editedUniversities[id]).forEach( ([key, data]) => {
                uni[key] = data;
            });
        }
        return uni;
    }

    getUniversityFromAnywhere(id) {
        let uni;
        if (typeof(id) == 'number') {
            uni = this.getUniversity(id);
        } else if ( !isNaN( parseInt(id) ) ) {
            uni = this.getUniversity( parseInt(id) );
        } else {
            uni = this.getAddedUniversity(id);
        }
        
        return uni;
    }

    editUniversity(university) {
        let oldUniversity = this.getUniversity(university.id);

        let keys = UNI_KEYS.filter( (it) => it !== 'faculties' && it !== 'id');

        let edits = {};
        keys.forEach( (key) => {
            if (university[key] !== oldUniversity[key]) {
                edits[key] = university[key];
            }
        });

        if (university.faculties.some((val, idx) => val !== oldUniversity.faculties[idx])) {
            edits.faculties = university.faculties;
        }

        if (Object.keys(edits).length > 0) {
            this.editedUniversities[university.id] = edits;

            this.redraw(university.id);
            return true;
        }
        return false;
    }

    unEditUniversity(universityId) {
        delete this.editedUniversities[universityId];
        
        this.redraw(universityId);
    }

    deleteUniversity(id) {
        this.deletedUniversities[id] = true;

        this.redraw(id);
    }

    unDeleteUniversity(id) {
        delete this.deletedUniversities[id];
        
        this.redraw(id);
    }

    isDeleted(id) {
        return this.deletedUniversities[id] === true;
    }

    isEdited(id) {
        return this.editedUniversities[id] !== undefined;
    }

    getSplitUniversities() {
        let old = [];
        let deleted = [];
        
        Object.values(this.originalUniversities).forEach( (university) => {
            let uni = this.getUniversity(university.id);
            if (this.isDeleted(uni.id)) {
                deleted.push(uni);
            } else {
                old.push(uni);
            }
        });

        return {
            'new': this.getAddedUniversities(),
            old,
            deleted
        }
    }

    redraw(universityId) {
        redrawEditedUniversities(universityId);
        redrawDeletedUniversities(universityId);
    }

    getData() {
        return new DataOut(
            'universities',
            this.getAddedUniversities(),
            Object.entries(this.editedUniversities).map( ([id, edits]) => { return { id, ...edits } } ),
            Object.entries(this.deletedUniversities).filter( ([id, deleted]) => deleted).map( ([id, _]) => parseInt(id) )
        );
    }
}

class Prerequisite {
    constructor(
        title, prerequisites
    ) {
        this.title = title;
        this.prerequisites = prerequisites;
    }

    notSame(other) {
        if (other instanceof Prerequisite) {
            return this.title == other.title &&
                !this.prerequisites.some( (req, idx) => req !== other.prerequisites[idx] );
        }
        return false;
    }
}

class GlobalCourseProcessor {
    constructor() {
        Injector.globalDataIn.addOnLoad(() => this.setup() );
    }

    setup() {
        let originalCourses = Injector.globalDataIn.currentData.courses;

        this.originalCourses = {};
        originalCourses.forEach( (course) => {
            this.originalCourses[course.id] = course;
        });

        this.newCourseId = 0;

        this.addedCourses = {};
        this.editedCourses = {};
        this.deletedCourses = {};

        drawAllPrograms(originalCourses);
    }

    getNewCourseId() {
        this.newCourseId++;
        return `@:course${this.newCourseId}`;
    }

    addCourse(course) {
        this.addedCourses[course.id] = course;
        addProgramToDisplayPanel(course);
    }

    getAddedCourses() {
        return Object.values(this.addedCourses);
    }

    removeAddedCourse(id) {
        delete this.addedCourses[id];
        removeAddedProgramFromDisplayPanel(id);
    }

    getCourse(id) {
        let course = this.originalCourses[id];
        if (this.editedCourses[id] !== undefined) {
            Object.entries(this.editedCourses[id]).forEach( ([key, data]) => {
                course[key] = data;
            });
        }
        return course;
    }

    getCourseFromAnywhere(id) {
        let parsed = typeof(id) == 'string' ? magicifyString(id) : id;
        if (typeof(parsed) == 'string') {
            return this.addedCourses[id];
        } else {
            return this.getCourse(parsed);
        }
    }

    editCourse(course) {
        let oldCourse = this.getCourse(course.id);

        let keys = COURSE_KEYS.filter( (it) => it !== 'prerequisites' && it !== 'id' );

        let edits = {};
        keys.forEach( (key) => {
            if (course[key] !== oldCourse[key]) {
                edits[key] = oldCourse[key];
            }
        })

        if (course.prerequisites.length !== oldCourse.prerequisites.length || course.prerequisites.some( (val, idx) => val.notSame(oldCourse.prerequisites[idx]) )) {
            edits.prerequisites = course.prerequisites;
        }

        if (Object.keys(edits).length > 0) {
            this.editedCourses[course.id] = edits;

            this.redraw(course.id);
            return true;
        }
        return false;
    }

    unEditCourse(courseId) {
        delete this.editedCourses[courseId];
        this.redraw(courseId);
    }

    deleteCourse(id) {
        this.deletedCourses[id] = true;
        this.redraw(id);
    }

    unDeleteCourse(id) {
        delete this.deletedCourses[id];
        this.redraw(id);
    }

    isDeleted(id) {
        return this.deletedCourses[id] === true;
    }

    isEdited(id) {
        return this.editedCourses[id] !== undefined
    }

    getSplitCourses() {
        let old = [];
        let deleted = [];
        Object.keys(this.originalCourses).forEach( (courseId) => {
            let cCourse = this.getCourse(courseId);
            if (this.isDeleted(cCourse.id)) {
                deleted.push(cCourse);
            } else {
                old.push(cCourse);
            }
        });

        return {
            'new': this.getAddedCourses(),
            old,
            deleted
        };
    }

    redraw(id) {
        redrawEditedCourse(id);
        redrawDeletedCourse(id);
    }

    getData() {
        return new DataOut(
            'courses',
            this.getAddedCourses(),
            Object.entries(this.editedCourses).map( ([id, edits]) => { return { id, ...edits }} ),
            Object.entries(this.deletedCourses).filter( ([id, deleted]) => deleted ).map( ([id, deleted]) => parseInt(id) )
        );
    }
}

class GlobalCategoryProcessor {
    constructor() {
        Injector.globalDataIn.addOnLoad( () => this.setup() );
    }

    setup() {
        let originalCategories = Injector.globalDataIn.currentData.categories;

        this.originalCategories = {};
        originalCategories.forEach( (category) => {
            this.originalCategories[category.id] = category;
        });

        this.newCategoryId = 0;
        this.addedCategories = {};
        this.deletedCategories = {};
        this.editedCategories = {};

        drawAllCategories(originalCategories);
    }

    getNewCategoryId() {
        this.newCategoryId++;
        return `@:category${this.newCategoryId}`;
    }

    addCategory(category) {
        this.addedCategories[category.id] = category;
        addCategoryToDisplayPanel(category);
    }

    getAddedCategories() {
        return Object.values(this.addedCategories);
    }

    removeAddedCategories(id) {
        delete this.addedCategories[id];
        Injector.globalCCJProcessor.removeCategory(id);
        removeAddedCategoryFromDisplayPanel(id);
    }

    getCategory(id) {
        let category = this.originalCategories[id];
        if (this.editedCategories[id] !== undefined) {
            Object.entries(this.editedCategories[id]).forEach( ([key, value]) => {
                category[key] = value;
            });
        }
        return category;
    }

    getCategoryFromAnywhere(id) {
        let parsed = typeof(id) == 'string' ? magicifyString(id) : id;
        if (typeof(parsed) == 'number') {
            return this.getCourse(parsed);
        } else {
            return this.addedCategories[id];
        }
    }

    editCategory(category) {
        let oldCategory = this.getCategory(category.id);

        let edits = {};
        if (category.title !== oldCategory.title) {
            edits.title = category.title;
        }

        if (category.futureJobOpportunities.length !== oldCategory.futureJobOpportunities.length || category.futureJobOpportunities.some( (it, idx) => it !== oldCategory.futureJobOpportunities[idx])) {
            edits.futureJobOpportunities = category.futureJobOpportunities;
        }

        let edited = Object.keys(edits).length > 0;

        if (edited) {
            this.editedCategories[category.id] = edits;
        }

        edited = edited || Injector.globalCCJProcessor.isEdited(category.id);

        if (edited) {
            this.redraw(category.id);
        }

        return edited;
    }

    unEditCategory(categoryId) {
        delete this.editedCategories[categoryId];
        Injector.globalCCJProcessor.removeEditsFor(categoryId);
        this.redraw(categoryId);
    }

    deletedCategory(id) {
        if (this.isEdited(id)) {
            this.unEditCategory(id);
        }
        this.deletedCategories[id] = true;
        Injector.globalCCJProcessor.removeCategory(id);
        this.redraw(id);
    }

    unDeleteCategory(id) {
        delete this.deletedCategories[id];
        Injector.globalCCJProcessor.removeEditsFor(id);
        this.redraw(id);
    }

    isDeleted(id) {
        return this.deletedCategories[id] === true;
    }

    isEdited(id) {
        return this.editedCategories[id] !== undefined || Injector.globalCCJProcessor.isEdited(id);
    }

    getSplitCategory() {
        let old = {};
        let deleted = {};
        Object.keys(this.originalCategories).forEach( (categoryId) => {
            let cCategory = this.getCategory(categoryId);
            if (this.isDeleted(cCategory)) {
                deleted.push(cCategory);
            } else {
                old.push(cCategory);
            }
        });

        return {
            'new': this.getAddedCategories(),
            old,
            deleted
        };
    }

    redraw(id) {
        redrawEditedCategory(id);
        redrawDeletedCategory(id);
    }

    getData() {
        return new DataOut(
            'categories',
            this.getAddedCategories(),
            Object.entries(this.editedCategories).map( ([id, edits]) => { return { ids, ...edits }} ),
            Object.entries(this.deletedCategories).filter( ([id, deleted]) => deleted).map( ([id, _]) => parseInt(id) )
        )
    }
}

class GlobalCCJProcessor {
    constructor() {
        Injector.globalDataIn.addOnLoad( () => this.setup() );
    }

    getCCJId(course, category) {
        return `${category}|${course}`;
    }

    setup() {
        let originalCCJs = Injector.globalDataIn.currentData.cat_cou_juncs;

        this.allCCJs = {};

        this.originalCCJs = {};
        originalCCJs.forEach( (ccj) => {
            this.originalCCJs[ccj.id] = ccj;
            this.allCCJs[this.getCCJId(ccj.course_id, ccj.category_id)] = ccj.id;
        });

        this.newCCJId = 0;

        this.deletedCCJs = {};
        this.addedCCJs = {};
    }

    isDeleted(categoryId, courseId) {
        return this.deletedCCJs[this.getCCJId(courseId, categoryId)] !== undefined;
    }

    isEdited(categoryId) {
        return this.getAddedCCJs().some( (ccj) => ccj.category_id == categoryId ) || Object.values(this.deletedCCJs).some( (ccj) => ccj.category_id == categoryId );
    }

    getAddedCCJs() {
        return Object.values(this.addedCCJs);
    }

    getOriginalCCJs() {
        return Object.values(this.originalCCJs);
    }

    getNewCCJId() {
        this.newCCJId++;
        return `@:ccj${this.newCCJId}`;
    }

    removeCategory(categoryId) {
        this.getAddedCCJs()
            .filter( (ccj) => ccj.category_id === categoryId )
            .forEach( (ccj) => {
                delete this.addedCCJs[ccj.id];
                delete this.allCCJs[this.getCCJId(ccj.course_id, categoryId)];
            });

        this.getOriginalCCJs()
            .filter( (ccj) => ccj.category_id === categoryId )
            .forEach( (ccj) => {
                this.deletedCCJs[this.getCCJId(ccj.course_id, ccj.category_id)] = ccj;
                delete this.allCCJs[this.getCCJId(ccj.course_id, ccj.category_id)];
            });
    }

    removeEditsFor(categoryId) {
        this.getAddedCCJs()
            .filter( (ccj) => ccj.category_id === categoryId )
            .forEach( (ccj) => {
                delete this.addedCCJs[ccj.id];
                delete this.allCCJs[this.getCCJId(ccj.course_id, categoryId)];
            });
            
            this.getOriginalCCJs()
                .filter( (ccj) => ccj.category_id === categoryId && this.isDeleted(categoryId, ccj.course_id) )
                .forEach( (ccj) => {
                    let ccjId = this.getCCJId(ccj.course_id, ccj.category_id);
                    delete this.deletedCCJs[ccjId];
                    this.allCCJs[ccjId] = ccj.id;
                })
    }

    processCCJs(categoryId, courseIds) {
        this.getAddedCCJs()
            .filter( (ccj) => ccj.category_id === categoryId && !courseIds.includes(ccj.course_id) )
            .forEach( (ccj) => {
                delete this.addedCCJs[ccj.id];
                delete this.allCCJs[this.getCCJId(ccj.course_id, categoryId)];
            });

        this.getOriginalCCJs()
            .filter( (ccj) => ccj.category_id === categoryId && !this.isDeleted(ccj.category_id, ccj.course_id) && !courseIds.includes(ccj.course_id) )
            .forEach( (ccj) => {
                this.deletedCCJs[this.getCCJId(ccj.course_id, ccj.category_id)] = ccj;
                delete this.allCCJs[this.getCCJId(ccj.course_id, ccj.category_id)];
            });
        
        courseIds.forEach( (courseId) => {
            let ccjId = this.getCCJId(courseId, categoryId);
            if (this.isDeleted(categoryId, courseId)) {
                delete this.deletedCCJs[ccjId];
                this.allCCJs[ccjId] = this.getCCJId(ccjId);
            } else if ( this.allCCJs[ccjId] === undefined ) {
                let newId = this.getNewCCJId();
                let newCCJ = new CCJ({ id: newId, category_id: categoryId, course_id: courseId });
                // Object.defineProperty(this.addedCCJs, newId, { enumerable: true, value: newCCJ });
                this.addedCCJs[newId] = newCCJ;
                this.allCCJs[ccjId] = newCCJ.id;
            }
        });
    }

    getCCJsForCategory(categoryId) {
        return [ ...this.getAddedCCJs(),  ...this.getOriginalCCJs() ].filter( (ccj) => ccj.category_id === categoryId && !this.isDeleted(categoryId, ccj.course_id) );
    }

    getCCJIdFromLists(ccjToFind) {
        return [ ...this.getAddedCCJs(), ...this.getOriginalCCJs() ].find( (ccj) => this.getCCJId(ccj.course_id, ccj.category_id) === ccjToFind ).id;
    }

    getData() {
        return new DataOut(
            'ccjs',
            this.getAddedCCJs(),
            [],
            Object.entries(this.deletedCCJs).map( ([ccjId, ccj]) => ccj.id )
        );
    }
}

const Injector = {
    globalDataIn: new GlobalDataIn(),
    globalUniversityProcessor: null,
    globalCourseProcessor: null,
    globalCategoryProcessor: null,
    globalCCJProcessor: null,
};

Injector.globalCCJProcessor = new GlobalCCJProcessor();
Injector.globalUniversityProcessor = new GlobalUniversityProcessor();
Injector.globalCourseProcessor = new GlobalCourseProcessor();
Injector.globalCategoryProcessor = new GlobalCategoryProcessor();


function getFinalOutData() {
    let rawUnisData = Injector.globalUniversityProcessor.getData();
    let rawCoursesData = Injector.globalCourseProcessor.getData();
    let rawCategories = Injector.globalCategoryProcessor.getData();
    let rawCCJs = Injector.globalCCJProcessor.getData();

    let rawData = [rawUnisData, rawCoursesData, rawCategories, rawCCJs];
    let finalData = {};

    ['additions', 'editions', 'deletions'].forEach( (key) => {
        finalData[key] = {};
        rawData.forEach( (data) => {
            finalData[key][data.title] = data[key];
        });
    })

    return finalData;
}

// ---- Data Loading Page ----
const dataPanel = document.getElementById('data-panel');
const dropZone = document.getElementById('drop-zone');
const dropOutline = dropZone.querySelector('.outline');
const fileSelector = dropZone.querySelector('input');
const dataLoadingBar = dataPanel.querySelector('#loading-bar');

function highlight(element) {
    element.classList.add('highlight');
}

function unhighlight(element) {
    element.classList.remove('highlight');
}

function showDataLoadingBar() {
    dataLoadingBar.style.display = 'block';
}

function hideDataLoadingBar() {
    dataLoadingBar.style.display = 'none';
}

// Event Functions

fileSelector.addEventListener('change', (ev) => {
    let file = fileSelector.files[0];
    loadFile(file);
})

// If the box is clicked -> click the input element
dropZone.addEventListener('click', (ev) => {
    fileSelector.click();
})

dropZone.addEventListener('dragover', (ev) => {
    ev.preventDefault();
    highlight(dropZone);
    highlight(dropOutline);
})

dropZone.addEventListener('dragenter', (ev) => {
    ev.preventDefault();
    highlight(dropZone);
    highlight(dropOutline);
})

dropZone.addEventListener('dragleave', (ev) => {
    ev.preventDefault();
    highlight(dropZone);
    highlight(dropOutline);
})

// When the user drops files here
dropZone.addEventListener('drop', (ev) => {
    ev.preventDefault();

    unhighlight(dropZone);
    unhighlight(dropOutline);

    let file;

    if (ev.dataTransfer.items) {
        file = ev.dataTransfer.items[0].getAsFile();
    } else {
        file = ev.dataTransfer.files[0];
    }
    console.log(file);
    loadFile(file);
})

// End Event Functions

// ---- Data Editing Page ----
const mainPanel = document.getElementById('main-panel');
mainPanel.style.display = 'none'; // Will be set to auto after data is loaded

// Start reading a file
function loadFile(file) {
    // TODO Reset Old Stuff
    showDataLoadingBar();

    let reader = new FileReader();

    reader.addEventListener('load', async (event) => {
        loadContent(event.target.result);
    });

    reader.readAsText(file);
}

// Process data
async function loadContent(content) {
    showDataLoadingBar();
    await Injector.globalDataIn.parse(content);
    hideDataLoadingBar();
    convertToMainPanel();
}

function convertToMainPanel() {
    dataPanel.style.display = 'none';
    mainPanel.style.display = 'block';
    routeTo(sessionStorage.getItem(LAST_ROUTE) || ADD_ROUTE);
    tabTo(sessionStorage.getItem(LAST_TAB) || UNIVERSITIES_TAB);
}

// -- Operation Tabs --
const addUniversities = document.getElementById('addUniversities');
const editUniversities = document.getElementById('editUniversities');
const deleteUniversities = document.getElementById('deleteUniversities');

const addPrograms = document.getElementById('addPrograms');
const editPrograms = document.getElementById('editPrograms');
const deletePrograms = document.getElementById('deletePrograms');

const addPathways = document.getElementById('addPathways');
const editPathways = document.getElementById('editPathways');
const deletePathways = document.getElementById('deletePathways');

// -- Routing --
const ADD_ROUTE = 'add_route';
const EDIT_ROUTE = 'edit_route';
const DELETE_ROUTE = 'delete_route';

const addLinkElement = document.getElementById('addLink');
const editLinkElement = document.getElementById('editLink');
const deleteLinkElement = document.getElementById('deleteLink');

const resetLinkElement = document.getElementById('resetLink');
resetLinkElement.addEventListener('click', (ev) => {
    ev.preventDefault();

    if (confirm('Are you sure you want to reset all data?')) {
        Injector.globalDataIn.reset();
        location.reload();
    }
});

const ROUTES = {};
const LAST_ROUTE = 'last_route';

ROUTES[ADD_ROUTE] = {
    element: addLinkElement,
    panels: [addUniversities, addPrograms, addPathways],
};
ROUTES[EDIT_ROUTE] = {
    element: editLinkElement,
    panels: [editUniversities, editPrograms, editPathways],
};
ROUTES[DELETE_ROUTE] = {
    element: deleteLinkElement,
    panels: [deleteUniversities, deletePrograms, deletePathways],
};

function resetAllRoutes() {
    Object.entries(ROUTES).forEach( ([_, { element, panels }]) => {
        element.classList.remove('active');
        panels.forEach( (panel) => {
            panel.style.display = 'none';
        })
    } )
}

function routeTo(route) {
    resetAllRoutes();

    let { element, panels } = ROUTES[route];
    element.classList.add('active');
    panels.forEach( (panel) => {
        panel.style.display = 'block';
    })

    sessionStorage.setItem(LAST_ROUTE, route);
}

// -- Tabs --
const UNIVERSITIES_TAB = 'universities_tab';
const PROGRAMS_TAB = 'programs_tab';
const PATHWAYS_TAB = 'pathways_tab';

const universitiesTabLink = document.getElementById('universitiesTab');
const universitiesTabContent = document.getElementById('universitiesTabContent');

const programsTabLink = document.getElementById('programsTab');
const programsTabContent = document.getElementById('programsTabContent');

const pathwaysTabLink = document.getElementById('pathwaysTab');
const pathwaysTabContent = document.getElementById('pathwaysTabContent');

const TABS = {};
const LAST_TAB = 'last_tab';

TABS[UNIVERSITIES_TAB] = {
    element: universitiesTabLink,
    panel: universitiesTabContent,
}

TABS[PROGRAMS_TAB] = {
    element: programsTabLink,
    panel: programsTabContent,
}

TABS[PATHWAYS_TAB] = {
    element: pathwaysTabLink,
    panel: pathwaysTabContent,
}


function resetAllTabs() {
    Object.entries(TABS).forEach( ([_, { element, panel }]) => {
        element.classList.remove('active');
        panel.style.display = 'none';
    });
}

function tabTo(tab) {
    resetAllTabs();

    let { element, panel } = TABS[tab];
    element.classList.add('active');
    panel.style.display = 'block'

    sessionStorage.setItem(LAST_TAB, tab);
}


// -- Route Link Events --
addLinkElement.addEventListener('click', (ev) => routeTo(ADD_ROUTE) );

editLinkElement.addEventListener('click', (ev) => routeTo(EDIT_ROUTE) );

deleteLinkElement.addEventListener('click', (ev) => routeTo(DELETE_ROUTE) );

// -- Tab Link Events --
universitiesTabLink.addEventListener('click', (ev) => tabTo(UNIVERSITIES_TAB) );
programsTabLink.addEventListener('click', (ev) => tabTo(PROGRAMS_TAB) );
pathwaysTabLink.addEventListener('click', (ev) => tabTo(PATHWAYS_TAB) );
// -- End Link Events --


// -- On Start --
let oldSessionData = localStorage.getItem(RAW_IN_CACHE);
if (oldSessionData !== null) {
    loadContent(oldSessionData)
}

// -- Global Templates --
const liInputDeleteTemplate = document.getElementById('liInputDeleteTemplate');
const liSelectTemplate = document.getElementById('liSelectTemplate');

const splitViewTemplate = document.getElementById('splitViewTemplate');

function getSelectElement(title, eventHandler) {
    const elem = liSelectTemplate.content.cloneNode(true);
    elem.querySelector('#itemHeading').textContent = title;

    if (eventHandler !== undefined) {
        elem.querySelector('.btn').addEventListener('click', eventHandler);
    }

    return elem;
}

function getNoStyledList() {
    let elem = document.createElement('ul');
    elem.style.listStyle = 'none';
    return elem;
}
// -- End Global Templates --

// -- University Operations --

// -- Add University --
const addUniversityForm = document.getElementById('addUniversityForm');
const addUniversityFacultyPanel = document.getElementById('uniAddFacPanel');

const addNewFacultyBtn = document.getElementById('addUniversitiesFacAdd');

function addUniversityFacultyElementToAdder() {
    let newFacul = liInputDeleteTemplate.content.cloneNode(true);
    newFacul.querySelector('.btn').addEventListener('click', (ev2) => {
        ev2.preventDefault();
        ev2.path.find( (el) => el.tagName == 'LI' ).classList.add('to-be-removed');
        addUniversityFacultyPanel.removeChild(
            document.querySelector('.to-be-removed')
        );
    });
    addUniversityFacultyPanel.appendChild(newFacul);
}

addNewFacultyBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    addUniversityFacultyElementToAdder();
});

addUniversityForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let data = [ ...new FormData(addUniversityForm) ];
    
    let faculties = [...addUniversityFacultyPanel.children]
        .map( (li) => li.querySelector('input').value )
        .filter( (it) => it.length > 0 );

    data.push(["faculties", faculties])

    if (data.some( ([_, it]) => it.length == 0)) {
        showError('You missed something');
        return;
    }

    let obj = data.reduce( (obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});

    obj.id = Injector.globalUniversityProcessor.getNewUniversityId();

    let newUniversity = new University(obj);

    Injector.globalUniversityProcessor.addUniversity(newUniversity);
    addUniversityForm.reset();
});

addUniversityForm.addEventListener('reset', (ev) => {
    addUniversityFacultyPanel.innerHTML = '';
})

const addedUniversitiesDisplayPanel = document.getElementById('addedUniversitiesDisplayPanel');

function addUniversityToDisplayPanel(newUniversity) {
    let element = getUniversityCard(newUniversity);
    element.querySelector('.btn').textContent = "Edit";
    element.querySelector('.btn').addEventListener('click', (ev) => {
        ev.preventDefault();
        Injector.globalUniversityProcessor.removeAddedUniversity(newUniversity.id);
        showUniversityToAdd(newUniversity);
    });

    addedUniversitiesDisplayPanel.appendChild(element);
}

function removeAddedUniversityFromDisplayPanel(universityIdToDelete) {
    addedUniversitiesDisplayPanel.removeChild(
        addedUniversitiesDisplayPanel.querySelector(`div[data-uni='${universityIdToDelete}']`)
    );
}

function showUniversityToAdd(university) {
    let data = { ...university };
    delete data['faculties'];
    delete data["id"];
    Object.entries(data).forEach( ([key, value]) => {
        addUniversityForm.elements[key].value = value;
    });

    university.faculties.forEach( (faculty, idx) => {
        addUniversityFacultyElementToAdder();
        addUniversityFacultyPanel.children[idx].querySelector('input').value = faculty;
    });
}

// -- End Add Universities --

// -- Edit Universities  --
const editUniversityForm = document.getElementById('editUniversityForm');
const editUniversityFacultyPanel = document.getElementById('uniEditFacPanel');

const editNewFacultyBtn = document.getElementById('editUniversitiesFacAdd');

function addUniversityFacultyElementToEditor() {
    let newFacul = liInputDeleteTemplate.content.cloneNode(true);
    newFacul.querySelector('.btn').addEventListener('click', (ev2) => {
        ev2.preventDefault();
        ev2.path.find( (el) => el.tagName == 'LI' ).classList.add('to-be-removed');
        editUniversityFacultyPanel.removeChild(
            document.querySelector('.to-be-removed')
        );
    });
    editUniversityFacultyPanel.appendChild(newFacul);
}

editNewFacultyBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    
    addUniversityFacultyElementToEditor();
});

editUniversityForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    if (editUniversityForm.dataset.uni == undefined) {
        return
    };

    let data = [ ...new FormData(editUniversityForm) ];
    
    let faculties = [...editUniversityFacultyPanel.children]
        .map( (li) => li.querySelector('input').value )
        .filter( (it) => it.length > 0 );

    data.push(["faculties", faculties])

    if (data.some( ([_, it]) => it.length == 0)) {
        showError('You missed something');
        return;
    }

    let obj = data.reduce( (obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});

    obj.id = parseInt(editUniversityForm.dataset.uni);

    let editedUniversity = new University(obj);

    if (Injector.globalUniversityProcessor.editUniversity(editedUniversity)) {
        editUniversityForm.reset();
    }
});

editUniversityForm.addEventListener('reset', (ev) => {
    editUniversityFacultyPanel.innerHTML = '';
    editUniversityForm.dataset.uni = undefined;
});

function showUniversityToEdit(university) {
    editUniversityForm.reset();
    let data = { ...university };
    delete data['faculties'];
    delete data['id'];

    Object.entries(data).forEach( ([key, value]) => {
        editUniversityForm.elements[key].value = value;
    });

    editUniversityFacultyPanel.innerHTML = '';
    university.faculties.forEach( (faculty, idx) => {
        addUniversityFacultyElementToEditor();
        editUniversityFacultyPanel.children[idx].querySelector('input').value = faculty;
    });

    editUniversityForm.dataset.uni = university.id;
}
// -- End Edit Universities --

// -- Display All Universities --
const allEditUniversitiesPanel = document.getElementById('editedUniversitiesDisplayPanel');
const allDeleteUniversitiesPanel = document.getElementById('deletedUniversitiesDisplayPanel');

function drawAllUniversities(universities) {
    universities.forEach( (university) => {
        drawUniversityInEditor(university);
        drawUniveristyInDeleter(university);
    })
}

function drawUniversityInEditor(university) {
    let elem = getUniversityCard(university);

    let editBtn = elem.querySelector('#uni-action');
    
    editBtn.textContent = 'Edit';
    editBtn.dataset.edited = false;
    editBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        
        if (!editBtn.classList.contains('disabled')) {
            if (editBtn.dataset.edited == 'false') {
                showUniversityToEdit(university);
            } else {
                Injector.globalUniversityProcessor.unEditUniversity(university.id);
            }
        }
    });
    
    allEditUniversitiesPanel.appendChild(elem);
}

function drawUniveristyInDeleter(university) {
    let elem = getUniversityCard(university);

    let deleteBtn = elem.querySelector('#uni-action');
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.deleted = false;
    deleteBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (deleteBtn.dataset.deleted == 'false') {
            Injector.globalUniversityProcessor.deleteUniversity(university.id);
        } else {
            Injector.globalUniversityProcessor.unDeleteUniversity(university.id);
        }
    });

    allDeleteUniversitiesPanel.appendChild(elem);
}

const EDITED = 'bg-success';
const DELETED = 'bg-danger';
const WHITE_TEXT = 'text-white';

function redrawEditedUniversities(id) {
    let elem = allEditUniversitiesPanel.querySelector(`div[data-uni='${id}']`);

    let university = Injector.globalUniversityProcessor.getUniversity(id);
    mapUniversityToCard(elem, university);
    
    let title = elem.querySelector('.card-title');
    title.classList.remove(EDITED);
    title.classList.remove(DELETED);
    title.classList.remove(WHITE_TEXT);

    actionBtn = elem.querySelector('.btn');
    actionBtn.classList.remove('disabled');
    actionBtn.textContent = 'Edit';
    actionBtn.dataset.edited = false;

    if (Injector.globalUniversityProcessor.isEdited(id)) {
        title.classList.add(EDITED);
        title.classList.add(WHITE_TEXT);
        actionBtn.textContent = 'Remove Edits';
        actionBtn.dataset.edited = true;
    }
    if (Injector.globalUniversityProcessor.isDeleted(id)) {
        title.classList.add(DELETED);
        title.classList.add(WHITE_TEXT);
        elem.querySelector('.btn').classList.add('disabled');
    }
}

function redrawDeletedUniversities(id) {
    let elem = allDeleteUniversitiesPanel.querySelector(`div[data-uni='${id}']`);

    let university = Injector.globalUniversityProcessor.getUniversity(id);
    mapUniversityToCard(elem, university);

    let title = elem.querySelector('.card-title');
    title.classList.remove(EDITED);
    title.classList.remove(DELETED);
    title.classList.remove(WHITE_TEXT);
    
    let actionBtn = elem.querySelector('.btn');
    actionBtn.textContent = 'Delete';
    actionBtn.dataset.deleted = false;

    if (Injector.globalUniversityProcessor.isDeleted(id)) {
        title.classList.add(DELETED);
        title.classList.add(WHITE_TEXT);
        actionBtn.textContent = 'UnDelete';
        actionBtn.dataset.deleted = true;
    } else if (Injector.globalUniversityProcessor.isEdited(id)) {
        title.classList.add(EDITED);
        title.classList.add(WHITE_TEXT);
    }
}


// -- General Mappers --
const universityTemplate = document.getElementById('universityTemplate');

function getUniversityCard(university) {
    let element = universityTemplate.content.cloneNode(true);

    mapUniversityToCard(element, university);

    element.querySelector('div').dataset.uni = university.id.toString();

    return element;
}

function mapUniversityToCard(element, university) {
    element.querySelector('#uni-name').textContent = university.name;
    
    element.querySelector('#uni-iconUrl').src = university.iconUrl;

    let table = element.querySelector('table');

    Object.entries(university).forEach( ([key, value]) => {
        let elem = table.querySelector(`#uni-${key}`);
        if (elem !== null) {
            elem.textContent = value;
        }
    });

    table.querySelector('#uni-url').href = university.url;

    let faculties = element.querySelector('#uni-faculties');
    faculties.innerHTML = '';
    university.faculties.forEach( (faculty) => {
        let li = document.createElement('li');
        li.textContent = faculty;
        faculties.appendChild(li);
    });
}

// -- End Universities

// -- Programs --

// -- Add Program
const addProgramForm = document.getElementById('addProgramForm');
const addProgramPrereqPanel = addProgramForm.querySelector('#courseAddPrePanel');

const prereqTemplate = document.getElementById('prereqItemTemplate');

function addCourseItemToPrereq(holder) {
    const courseItem = liInputDeleteTemplate.content.cloneNode(true);
    courseItem.querySelector('.btn').addEventListener('click', (ev2) => {
        ev2.preventDefault();
        ev2.path.find( (it) => it.tagName == 'LI' ).classList.add('to-be-removed');
        holder.removeChild(holder.querySelector('.to-be-removed'));
    })

    holder.appendChild(courseItem);
}

function addProgramPrereq(holder) {
    let newPrereq = prereqTemplate.content.cloneNode(true);
    newPrereq.querySelector('#removePrereq').addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.path.find( (it) => it.tagName == 'LI' ).classList.add('to-be-removed');
        holder.removeChild(
            holder.querySelector('.to-be-removed')
        );
    });

    const prereqCourseList = newPrereq.querySelector('#prereqCourseList');
    newPrereq.querySelector('#addCourseItem').addEventListener('click', (ev) => {
        ev.preventDefault();

        addCourseItemToPrereq(prereqCourseList);
    });

    holder.appendChild(newPrereq);
}

addProgramForm.querySelector('.btn').addEventListener('click', (ev) => {
    ev.preventDefault();
    addProgramPrereq(addProgramPrereqPanel);
});

const addProgramNotesTextArea = addProgramForm.querySelector('textarea');
const addProgramNotesMarkdownOutput = addProgramForm.querySelector('#addMarkupOutput')

const showDownConvertor = new showdown.Converter();
addProgramNotesTextArea.addEventListener('input', (ev) => {
    addProgramNotesMarkdownOutput.innerHTML = showDownConvertor.makeHtml(addProgramNotesTextArea.value);
});
addProgramNotesTextArea.addEventListener('change', (ev) => {
    addProgramNotesMarkdownOutput.innerHTML = showDownConvertor.makeHtml(addProgramNotesTextArea.value);
});

const selectAddProgramUniversity = addProgramForm.querySelector('#selectUniversity');
selectAddProgramUniversity.addEventListener('click', (ev) => {
    ev.preventDefault();

    let splitUniversities = Injector.globalUniversityProcessor.getSplitUniversities();
    let element = splitViewTemplate.content.cloneNode(true);

    let newPanel = document.createElement('div');
    let oldPanel = document.createElement('div');
    let deletedPanel = document.createElement('div');

    element.querySelector('#newItemsPanel').appendChild(newPanel);
    element.querySelector('#oldItemsPanel').appendChild(oldPanel);
    element.querySelector('#deletedItemsPanel').appendChild(deletedPanel);

    splitUniversities.new.forEach( (university) => {
        let elem = getSelectElement(university.name, (ev) => {
            ev.preventDefault();
            
            selectUniversityForAddProgram(university);
        });

        newPanel.appendChild(elem);
    });

    splitUniversities.old.forEach( (university) => {
        let elem = getSelectElement(university.name, (ev) => {
            ev.preventDefault();

            selectUniversityForAddProgram(university);
        });

        oldPanel.appendChild(elem);
    });

    splitUniversities.deleted.forEach( (university) => {
        let elem = getSelectElement(university.name);
        elem.querySelector('.btn').classList.add('disabled');

        deletedPanel.appendChild(elem);
    })

    showModal('Select University', element);
});

const addProgramUniversityInput = addProgramForm.querySelector('#addProgramUniversityId');
const addProgramUniversityOutput = addProgramForm.querySelector('#addProgramUniversityOutput');

const addProgramOverallFaculty = addProgramForm.querySelector('#faculty');
const addProgramFacultyInput = addProgramForm.querySelector('#addProgramFaculty');
const addProgramFacultyOutput = addProgramForm.querySelector('#addProgramFacultyOutput');
const selectAddProgramFaculty = addProgramOverallFaculty.querySelector('.btn');

addProgramUniversityInput.addEventListener('change', (ev) => {
    let uni = getUniversityFromIdValue(addProgramUniversityInput.value);
    if (uni == undefined) {
        addProgramUniversityOutput.textContent = '';
        addProgramOverallFaculty.classList.add('d-none');
        setValue(addProgramFacultyInput, undefined);
    } else {
        addProgramUniversityOutput.textContent = uni.name;
        addProgramOverallFaculty.classList.remove('d-none');
    }
});

function getUniversityFromIdValue(id) {
    const intId = parseInt(id);
    
    let university;
    if (isNaN(intId)) {
        university = Injector.globalUniversityProcessor.getAddedUniversity(id);
    } else {
        university = Injector.globalUniversityProcessor.getUniversity(intId);
    }

    return university;
}

addProgramFacultyInput.addEventListener('change', (ev) => {
    let faculty = addProgramFacultyInput.value;
    if (faculty != 'undefined' && faculty.length > 0) {
        addProgramFacultyOutput.textContent = faculty;
    } else {
        addProgramFacultyOutput.textContent = '';
    }
});

selectAddProgramFaculty.addEventListener('click', (ev) => {
    ev.preventDefault();

    let panel = document.createElement('div');
    panel.classList.add('p-2');

    getUniversityFromIdValue(addProgramUniversityInput.value).faculties.forEach( (faculty) => {
        let elem = getSelectElement(faculty, (ev) => {
            ev.preventDefault();
            setValue(addProgramFacultyInput, faculty);
            closeModal();
        });
        panel.appendChild(elem);
    });

    showModal('Select Faculty', panel);
});

function selectUniversityForAddProgram(university) {
    closeModal();
    setValue(addProgramUniversityInput, university.id);
}

addProgramForm.addEventListener('reset', (ev) => {
    addProgramNotesMarkdownOutput.innerHTML = '';
    addProgramPrereqPanel.innerHTML = '';
    setValue(addProgramFacultyInput, undefined);
    setValue(addProgramUniversityInput, undefined);
});

addProgramForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let data = [...new FormData(addProgramForm)];

    let prereqs = [...addProgramPrereqPanel.children].map( (li) => {
        let title = li.querySelector('#prereqTitle').value;
        let prerequisites = [...li.querySelector('#prereqCourseList').children].map( (cLi) => cLi.querySelector('input').value );

        return new Prerequisite(title, prerequisites);
    });

    if (prereqs.some( (it) => it.title.length == 0 || it.prerequisites.length == 0 || it.prerequisites.some( (req) => req.length == 0 ))) {
        showError('You missed something');
        return;
    }

    data.push(['prerequisites', prereqs]);

    let obj = data.reduce( (obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});

    let omitted = ['id', 'prerequisites', 'domesticNotes', 'internationalNotes', 'notes'];
    let error = COURSE_KEYS.filter( (key) => !omitted.includes(key) ).some( (key) => {
        let cx = obj[key] == undefined || obj[key].length == 0;
        if (cx) {
            console.log(key);
        }
        return cx;
    });

    if (error) {
        showError('You missed something');
        return;
    }

    let uniId = parseInt(obj.universityId);
    if ( !isNaN(uniId) ) {
        obj.universityId = uniId;
    }

    obj.domesticBooks = parseInt(obj.domesticBooks);
    obj.domesticTuition = parseInt(obj.domesticTuition);
    obj.internationalBooks = parseInt(obj.internationalBooks);
    obj.internationalTuition = parseInt(obj.internationalTuition);

    obj.requiredAverage = parseInt(obj.requiredAverage);
    obj.id = Injector.globalCourseProcessor.getNewCourseId();

    let newCourse = new Course(obj);

    Injector.globalCourseProcessor.addCourse(newCourse);
    addProgramForm.reset();
});

const addedProgramsDisplayPanel = document.getElementById('addedProgramsDisplayPanel');

function addProgramToDisplayPanel(program) {
    let element = getProgramCard(program);
    element.querySelector('.btn').textContent = 'Edit';
    element.querySelector('.btn').addEventListener('click', (ev) => {
        ev.preventDefault();
        Injector.globalCourseProcessor.removeAddedCourse(program.id);
        showProgramToAdd(program);
    });

    addedProgramsDisplayPanel.appendChild(element);
}

function removeAddedProgramFromDisplayPanel(programId) {
    addedProgramsDisplayPanel.removeChild(
        addedProgramsDisplayPanel.querySelector(`div[data-course='${programId}']`)
    );
}

function showProgramToAdd(program) {
    addProgramForm.reset();
    
    let data = { ...program };
    delete data["prerequisites"];
    delete data["id"];

    Object.entries(data).forEach( ([key, value]) => {
        setValue(addProgramForm.elements[key], value);
    });

    

    program.prerequisites.forEach( (prerequisite, idx) => {
        addProgramPrereq(addProgramPrereqPanel);
        const liPanel = addProgramPrereqPanel.children[idx].querySelector('#prereqCourseList');
        addProgramPrereqPanel.children[idx].querySelector('input').value = prerequisite.title;
        prerequisite.prerequisites.forEach( (prereq, idx2) => {
            addCourseItemToPrereq(liPanel);
            liPanel.children[idx2].querySelector('input').value = prereq;
        });
    });
}
// -- End Add Programs

// -- Edit Programs ==
const editProgramForm = document.getElementById('editProgramForm');
const editProgramPrereqPanel = editProgramForm.querySelector('#courseAddPrePanel');

editProgramForm.querySelector('.btn').addEventListener('click', (ev) => {
    ev.preventDefault();
    addProgramPrereq(editProgramPrereqPanel);
});

const editProgramNotesTextArea = editProgramForm.querySelector('textarea');
const editProgramNotesMarkdownOutput = editProgramForm.querySelector('#addMarkupOutput');

editProgramNotesTextArea.addEventListener('input', (ev) => {
    editProgramNotesMarkdownOutput.innerHTML = showDownConvertor.makeHtml(editProgramNotesTextArea.value);
});
editProgramNotesTextArea.addEventListener('change', (ev) => {
    editProgramNotesMarkdownOutput.innerHTML = showDownConvertor.makeHtml(editProgramNotesTextArea.value);
});

window.addEventListener('unload', (ev) => {
    addProgramNotesTextArea.value = '';
    editProgramNotesTextArea.value = '';
});

const selectEditProgramUniversity = editProgramForm.querySelector('#selectUniversity');
selectEditProgramUniversity.addEventListener('click', (ev) => {
    ev.preventDefault();

    let splitUniversities = Injector.globalUniversityProcessor.getSplitUniversities();
    let element = splitViewTemplate.content.cloneNode(true);

    let newPanel = document.createElement('div');
    let oldPanel = document.createElement('div');
    let deletedPanel = document.createElement('div');

    element.querySelector('#newItemsPanel').appendChild(newPanel);
    element.querySelector('#oldItemsPanel').appendChild(oldPanel);
    element.querySelector('#deletedItemsPanel').appendChild(deletedPanel);

    splitUniversities.new.forEach( (university) => {
        let elem = getSelectElement(university.name, (ev) => {
            ev.preventDefault();
            selectUniversityForEditProgram(university);
        });

        newPanel.appendChild(elem);
    });

    splitUniversities.old.forEach( (university) => {
        let elem = getSelectElement(university.name, (ev) => {
            ev.preventDefault();
            selectUniversityForEditProgram(university);
        });

        oldPanel.appendChild(elem);
    });

    splitUniversities.deleted.forEach( (university) => {
        let elem = getSelectElement(university.name);
        elem.querySelector('.btn').classList.add('disabled');

        deletedPanel.appendChild(elem);
    });

    showModal('Select University', element);
});

const editProgramUniversityInput = editProgramForm.querySelector('#addProgramUniversityId');
const editProgramUniversityOutput = editProgramForm.querySelector('#addProgramUniversityOutput');

const editProgramOverallFaculty = editProgramForm.querySelector('#faculty');
const editProgramFacultyInput = editProgramForm.querySelector('#addProgramFaculty');
const editProgramFacultyOutput = editProgramForm.querySelector('#addProgramFacultyOutput');
const selectEditProgramFaculty = editProgramOverallFaculty.querySelector('.btn');

editProgramUniversityInput.addEventListener('change', (ev) => {
    let uni = getUniversityFromIdValue(editProgramUniversityInput.value);
    if (uni == undefined) {
        editProgramUniversityOutput.textContent = '';
        editProgramOverallFaculty.classList.add('d-none');
        setValue(editProgramFacultyInput, undefined);
    } else {
        editProgramUniversityOutput.textContent = uni.name;
        editProgramOverallFaculty.classList.remove('d-none');
    }
});

editProgramFacultyInput.addEventListener('change', (ev) => {
    let faculty = editProgramFacultyInput.value;
    if (faculty != 'undefined' && faculty.length > 0) {
        editProgramFacultyOutput.textContent = faculty;
    } else {
        editProgramFacultyOutput.textContent = '';
    }
});

selectEditProgramFaculty.addEventListener('click', (ev) => {
    ev.preventDefault();

    let panel = document.createElement('div');
    panel.classList.add('p-2');

    getUniversityFromIdValue(editProgramUniversityInput.value).faculties.forEach( (faculty) => {
        let elem = getSelectElement(faculty, (ev) => {
            ev.preventDefault();
            setValue(editProgramFacultyInput, faculty);
            closeModal();
        });
        panel.appendChild(elem);
    });

    showModal('Select Faculty', panel);
});

function selectUniversityForEditProgram(university) {
    closeModal();
    setValue(editProgramUniversityInput, university.id);
}

editProgramForm.addEventListener('reset', (ev) => {
    editProgramNotesMarkdownOutput.innerHTML = '';
    editProgramPrereqPanel.innerHTML = '';
    setValue(editProgramFacultyInput, undefined);
    setValue(addProgramUniversityInput, undefined);
    editProgramForm.dataset.course = undefined;
});

editProgramForm.addEventListener('submit', (ev) => {
    ev.preventDefault();
    let data = [...new FormData(editProgramForm)];

    let prereqs = [...editProgramPrereqPanel.children].map( (li) => {
        let title = li.querySelector('#prereqTitle').value;
        let prerequisites = [...li.querySelector('#prereqCourseList').children].map( (cLi) => cLi.querySelector('input').value );

        return new Prerequisite(title, prerequisites);
    });

    if (prereqs.some( (it) => it.title.length == 0 || it.prerequisites.length == 0 || it.prerequisites.some( (req) => req.length == 0 ))) {
        showError('You missed something');
        return;
    }

    data.push(['prerequisites', prereqs]);

    let obj = data.reduce( (obj, [key, value]) => {
        obj[key] = value;
        return obj;
    }, {});

    let omitted = ['id', 'prerequisites', 'domesticNotes', 'internationalNotes', 'notes'];
    let error = COURSE_KEYS.filter( (key) => !omitted.includes(key) ).some( (key) => {
        let cx = obj[key] == undefined || obj[key].length == 0;
        if (cx) {
            console.log(key);
        }
        return cx;
    });

    if (error) {
        showError('You missed something');
        return;
    }

    let uniId = parseInt(obj.universityId);
    if ( !isNaN(uniId) ) {
        obj.universityId = uniId;
    }

    obj.domesticBooks = parseInt(obj.domesticBooks);
    obj.domesticTuition = parseInt(obj.domesticTuition);
    obj.internationalBooks = parseInt(obj.internationalBooks);
    obj.internationalTuition = parseInt(obj.internationalTuition);

    obj.requiredAverage = parseInt(obj.requiredAverage);
    
    obj.id = parseInt(editProgramForm.dataset.course);

    let editedProgram = new Course(obj);

    if (Injector.globalCourseProcessor.editCourse(editedProgram)) {
        editProgramForm.reset();
    }
});

function showProgramToEdit(program) {
    editProgramForm.reset();
    let data = { ...program };
    delete data['prerequisites'];
    delete data['id'];

    Object.entries(data).forEach( ([key, value]) => {
        setValue(editProgramForm.elements[key], value);
    });

    program.prerequisites.forEach( (prerequisite, idx) => {
        addProgramPrereq(editProgramPrereqPanel);
        let prereq = editProgramPrereqPanel.children[idx];
        prereq.querySelector('input').value = prerequisite.title;
        let prereqCourseList = prereq.querySelector('#prereqCourseList');

        prerequisite.prerequisites.forEach( (req, idx2) => {
            addCourseItemToPrereq(prereqCourseList);
            prereqCourseList.children[idx2].querySelector('input').value = req;
        });
    });

    editProgramForm.dataset.course = program.id;
}

// -- End Edit Programs

const programTemplate = document.getElementById('programTemplate');
const programCardPrereqTemplate = document.getElementById('prereqCardTemplate');

function getProgramCard(program) {
    let element = programTemplate.content.cloneNode(true);
    
    mapProgramToCard(element, program);

    element.querySelector('div').dataset.course = program.id.toString();

    return element;
}

function mapProgramToCard(element, program) {
    element.querySelector('#course-id').textContent = program.id;
    element.querySelector('#course-universityId').textContent = program.universityId;
    element.querySelector('#course-title').textContent = program.title;
    element.querySelector('#course-faculty').textContent = program.faculty;
    element.querySelector('#course-requiredAverage').textContent = `${program.requiredAverage}%`;
    element.querySelector('#course-domesticTuition').textContent = `$${program.domesticTuition}`;
    element.querySelector('#course-domesticBooks').textContent = `$${program.domesticBooks}`;
    element.querySelector('#course-domesticNotes').textContent = program.domesticNotes;
    element.querySelector('#course-internationalTuition').textContent = `$${program.internationalTuition}`;
    element.querySelector('#course-internationalBooks').textContent = `$${program.internationalBooks}`;
    element.querySelector('#course-internationalNotes').textContent = program.internationalNotes;
    element.querySelector('#course-notes').innerHTML = showDownConvertor.makeHtml(program.notes);
    
    if (program.prerequisites.length == 0) {
        element.querySelector('#course-prerequisites-div').classList.add('d-none');
    } else {
        let prereqPanel = element.querySelector('#course-prerequisites');
        prereqPanel.innerHTML = '';

        program.prerequisites.forEach( (prerequisite) => {
            let prereqElem = programCardPrereqTemplate.content.cloneNode(true);
            prereqElem.querySelector('#pre-title').textContent = prerequisite.title;
            let ul = prereqElem.querySelector('#pre-reqs');
            prerequisite.prerequisites.forEach( (req) => {
                let li = document.createElement('li');
                li.textContent = req;
                ul.appendChild(li);
            });

            prereqPanel.appendChild(prereqElem);
        });
    }

    return element;
}

const allEditProgramsPanel = document.getElementById('editedProgramsDisplayPanel')
const allDeletedProgramsPanel = document.getElementById('deletedCoursesDisplayPanel');

function drawAllPrograms(courses) {
    courses.forEach( (course) => {
        drawProgramInEditor(course);
        drawProgramInDeletor(course);
    });
}

function drawProgramInEditor(program) {
    let elem = getProgramCard(program);

    let editBtn = elem.querySelector('#course-action');

    editBtn.textContent = 'Edit';
    editBtn.dataset.edited = false;
    editBtn.addEventListener('click', (ev) => {
        ev.preventDefault();

        if (!editBtn.classList.contains('disabled')) {
            if (editBtn.dataset.edited == 'false') {
                showProgramToEdit(program);
            } else {
                Injector.globalCourseProcessor.unEditCourse(program.id);
            }
        }
    });

    allEditProgramsPanel.appendChild(elem);
}

function drawProgramInDeletor(program) {
    let elem = getProgramCard(program);

    let deleteBtn = elem.querySelector('#course-action');
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.deleted = false;
    deleteBtn.addEventListener('click', (ev) => {
        ev.preventDefault();
        if (deleteBtn.dataset.deleted == 'false') {
            Injector.globalCourseProcessor.deleteCourse(program.id);
        } else {
            Injector.globalCourseProcessor.unDeleteCourse(program.id);
        }
    });

    allDeletedProgramsPanel.appendChild(elem);
}

function redrawEditedCourse(programId) {
    let elem = allEditProgramsPanel.querySelector(`div[data-course='${programId}']`);

    let program = Injector.globalCourseProcessor.getCourse(programId);
    mapProgramToCard(elem, program);

    let title = elem.querySelector('.card-title');
    title.classList.remove(EDITED);
    title.classList.remove(DELETED);
    title.classList.remove(WHITE_TEXT);

    actionBtn = elem.querySelector('.btn');
    actionBtn.classList.remove('disabled');
    actionBtn.textContent = 'Edit';
    actionBtn.dataset.edited = false;

    if (Injector.globalCourseProcessor.isEdited(programId)) {
        title.classList.add(EDITED);
        title.classList.add(WHITE_TEXT);
        actionBtn.textContent = 'Remove Edits';
        actionBtn.dataset.edited = true;
    }
    if (Injector.globalCourseProcessor.isDeleted(programId)) {
        title.classList.add(DELETED);
        title.classList.add(WHITE_TEXT);
        actionBtn.classList.add('disabled');
    }
}

function redrawDeletedCourse(programId) {
    let elem = allDeletedProgramsPanel.querySelector(`div[data-course='${programId}']`);

    let program = Injector.globalCourseProcessor.getCourse(programId);
    mapProgramToCard(elem, program);

    let title = elem.querySelector('.card-title');
    title.classList.remove(EDITED);
    title.classList.remove(DELETED);
    title.classList.remove(WHITE_TEXT);

    let actionBtn = elem.querySelector('.btn');
    actionBtn.textContent = 'Delete';
    actionBtn.dataset.deleted = false;

    if (Injector.globalCourseProcessor.isDeleted(programId)) {
        title.classList.add(DELETED);
        title.classList.add(WHITE_TEXT);
        actionBtn.textContent = 'UnDelete';
        actionBtn.dataset.deleted = true;
    } else if (Injector.globalCourseProcessor.isEdited(programId)) {
        title.classList.add(EDITED);
        title.classList.add(WHITE_TEXT);
    }
}

// -- End Programs

// -- Pathways
const pathwayProgramTemplate = document.getElementById('pathwayProgramTemplate');
const pathwayCourseLiT = document.getElementById('pathwayCourseLiT');
const pathwayTemplate = document.getElementById('pathwayCardTemplate');

function displayPathwayProgram(holder, program) {
    let elem = pathwayProgramTemplate.content.cloneNode(true);

    elem.querySelector('#program-name').textContent = program.title;
    elem.querySelector('#faculty').textContent = program.faculty;
    
    let university = Injector.globalUniversityProcessor.getUniversityFromAnywhere(program.universityId);
    elem.querySelector('#uni-name').textContent = university.name;

    elem.querySelector('div').dataset.course = program.id;

    elem.querySelector('.btn').addEventListener('click', (ev) => {
        ev.preventDefault();

        holder.removeChild(
            holder.querySelector(`div[data-course='${program.id}']`)
        );
    });

    holder.appendChild(elem);
}

function getProgramIdsFromPathwayForm(form) {
    return [...form.querySelector('#addPathwayCourses').children].map( (div) => magicifyString(div.dataset.course) );
}

function getPathwayCard(pathway) {
    let element = pathwayTemplate.content.cloneNode(true);
    
    mapPathwayToElement(element, pathway);

    element.querySelector('div').dataset.pathway = pathway.id;

    return element;
}

function mapPathwayToElement(element, pathway) {
    element.querySelector('#pathway-title').texContent = pathway.title;
    
    let oppUl = element.querySelector('#pathway-opps');
    oppUl.innerHTML = '';

    pathway.futureJobOpportunities.forEach( (opp) => {
        let li = document.createElement('li');
        li.textContent = opp;
        oppUl.appendChild(li);
    });

    let courseList = element.querySelector('#pathway-courses');
    courseList.innerHTML = '';

    let ccjs;
    ccjs.forEach( (ccj) => {
        let course = Injector.globalCourseProcessor.getCourseFromAnywhere(ccj);
        let uni = Injector.globalUniversityProcessor.getUniversityFromAnywhere(course.universityId);
        let element = getCCJView(course, uni);
        courseList.appendChild(element);
    })
}

function getCCJView(ccj) {
    let course = Injector.globalCourseProcessor.getCourseFromAnywhere(ccj.course_id);
    let uni = Injector.globalUniversityProcessor.getUniversityFromAnywhere(course.universityId);

    let elem = pathwayCourseLiT.content.cloneNode(true);
    elem.querySelector('#course').textContent = course.title;
    elem.querySelector('#university').textContent = uni.name;
    elem.querySelector('#faculty').textContent = course.faculty;
    return elem;
}

function addLiInputElement(holder) {
    let newOpp = liInputDeleteTemplate.content.cloneNode(true);
    newOpp.querySelector('.btn').addEventListener('click', (ev) => {
        ev.preventDefault();
        ev.path.find( (it) => it.tagName == 'LI' ).classList.add('to-be-removed');
        holder.removeChild(
            holder.querySelector('.to-be-removed')
        );
    });

    holder.appendChild(newOpp);
}

const selectProgramTemplate = document.getElementById('selectProgramTemplate');
function getSelectProgram(program, handler) {
    let element = selectProgramTemplate.content.cloneNode(true);
    element.querySelector('#course-title').textContent = program.title;
    element.querySelector('#faculty').textContent = program.faculty;
    element.querySelector('#uni-name').textContent = Injector.globalUniversityProcessor.getUniversityFromAnywhere(program.universityId).name;

    if (handler !== undefined) {
        element.querySelector('.btn').addEventListener('click', handler);
    }

    return element;
}

function showSelectProgramModal(handler, excluded=[]) {
    let splitView = splitViewTemplate.content.cloneNode(true);
    let newPanel = splitView.querySelector('#newItemsPanel');
    let oldPanel = splitView.querySelector('#oldItemsPanel');
    let deletedPanel = splitView.querySelector('#deletedItemsPanel');

    let programs = Injector.globalCourseProcessor.getSplitCourses();

    programs.new.forEach( (program) => {
        if (excluded.includes(program.id)) {
            return;
        }
        let cElement = getSelectProgram(program, (ev) => {
            ev.preventDefault();
            handler(program);
            closeModal();
        });

        newPanel.appendChild(cElement);
    });

    programs.old.forEach( (program) => {
        if (excluded.includes(program.id)) {
            return;
        }
        let cElement = getSelectProgram(program, (ev) => {
            ev.preventDefault();
            handler(program);
            closeModal();
        });

        oldPanel.appendChild(cElement);
    });

    programs.deleted.forEach( (program) => {
        let cElement = getSelectProgram(program, (ev) => {
            ev.preventDefault();
        });
        cElement.querySelector('.btn').classList.add('disabled');

        deletedPanel.appendChild(cElement);
    });

    showModal('Select Program', splitView);
}

// -- Add Pathway --
const addPathwayForm = document.getElementById('addPathwayForm');
const addPathwayFutureOpps = addPathwayForm.querySelector('#pathwayAddFutureOppPanel');
const addPathwayAttachedCourses = addPathwayForm.querySelector('#addPathwayCourses');


addPathwayForm.querySelector('#addPathwaysFutureOpp').addEventListener('click', (ev) => {
    ev.preventDefault();

    addLiInputElement(addPathwayFutureOpps);
});

addPathwayForm.querySelector('#addPathwayAttachProgram').addEventListener('click', (ev) => {
    ev.preventDefault();

    showSelectProgramModal((program) => displayPathwayProgram(addPathwayAttachedCourses, program), getProgramIdsFromPathwayForm(addPathwayForm) );
});

addPathwayForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    let title = addPathwayForm.querySelector('input').value;
    let futureJobOpportunities = [...addPathwayFutureOpps.children].map( (li) => li.querySelector('input').value );
    let courseIds = [ ...addPathwayAttachedCourses.children ].map( (div) => magicifyString(div.dataset.course) );
    
    if (title.length == 0 || futureJobOpportunities.length == 0 || futureJobOpportunities.some( (it) => it.length == 0 ) || courseIds.length == 0) {
        showError('You missed something');
        return;
    }

    let newId = Injector.globalCategoryProcessor.getNewCategoryId();

    let newCategory = new Category({ id: newId, title, futureJobOpportunities });

    Injector.globalCCJProcessor.processCCJs(newId, courseIds);

    Injector.globalCategoryProcessor.addCategory(newCategory);

    addPathwayForm.reset();
});

addPathwayForm.addEventListener('reset', (ev) => {
    addPathwayFutureOpps.innerHTML = '';
    addPathwayAttachedCourses.innerHTML = '';
});

const addedPathwaysDisplayPanel = document.getElementById('addedPathwaysDisplayPanel');

function addCategoryToDisplayPanel(pathway) {
    let card = getPathwayCard(pathway);

    card.querySelector('div').dataset.pathway = pathway.id;

    let actionBtn = card.querySelector('.btn');
    actionBtn.textContent = 'Edit';
    actionBtn.addEventListener('click', (ev) => {
        ev.preventDefault();

        showPathwayToAdd(pathway);
    });

    addedPathwaysDisplayPanel.appendChild(card);
}

function removeAddedCategoryFromDisplayPanel(id) {
    addedPathwaysDisplayPanel.removeChild(
        addedPathwaysDisplayPanel.querySelector(`div[data-pathway='${id}']`)
    );
}

function showPathwayToAdd(pathway) {
    addPathwayForm.reset();

    Injector.globalCategoryProcessor.removeAddedCategories(pathway.id);

    addPathwayForm.elements['title'].value = pathway.title;
    pathway.futureJobOpportunities.forEach( (futureOpp, idx) => {
        addLiInputElement(addPathwayFutureOpps);
        addPathwayFutureOpps.children[idx].querySelector('input').value = futureOpp;
    });

    let ccjs = Injector.globalCCJProcessor.getCCJsForCategory(pathway.id);
    ccjs.forEach( (ccj) => {
        displayPathwayProgram(addPathwayAttachedCourses, Injector.globalCourseProcessor.getCourseFromAnywhere(ccj.course_id) );
    });
}

// -- End Add Pathway --

// -- Edit Pathway --

const editPathwayForm = document.getElementById('editPathwayForm');
const editPathwayFutureOpps = editPathwayForm.querySelector('#pathwayAddFutureOppPanel');
const editPathwayAttachedCourses = editPathwayForm.querySelector('#addPathwayCourses');

editPathwayForm.querySelector('#addPathwaysFutureOpp').addEventListener('click', (ev) => {
    ev.preventDefault();

    addLiInputElement(editPathwayFutureOpps);
});

editPathwayForm.querySelector('#addPathwayAttachProgram').addEventListener('click', (ev) => {
    ev.preventDefault();

    showSelectProgramModal( (program) => displayPathwayProgram(editPathwayAttachedCourses, program), getProgramIdsFromPathwayForm(editPathwayForm) );
});

editPathwayForm.addEventListener('submit', (ev) => {
    ev.preventDefault();

    let title = editPathwayForm.querySelector('input').value;
    let futureJobOpportunities = [ ...editPathwayFutureOpps.children ].map( (li) => li.querySelector('input').value );
    let courseIds = [ ...editPathwayAttachedCourses.children ].map( (div) => magicifyString(div.dataset.course) );

    if (title.length == 0 || futureJobOpportunities.length == 0 || futureJobOpportunities.some( (it) => it.length == 0 ) || courseIds.length == 0) {
        showError('You missed something');
        return;
    }

    let pathwayId = magicifyString(editPathwayForm.dataset.pathway);

    let editedCategory = new Category({ id: pathwayId, title, futureJobOpportunities });

    Injector.globalCCJProcessor.processCCJs(pathwayId, courseIds);
    Injector.globalCategoryProcessor.editCategory(editedCategory);

    editPathwayForm.reset();
});

editPathwayForm.addEventListener('reset', (ev) => {
    editPathwayFutureOpps.innerHTML = '';
    editPathwayAttachedCourses.innerHTML = '';
    editPathwayForm.dataset.pathway = undefined;
});

function showPathwayToEdit(pathway) {
    editPathwayForm.reset();

    editPathwayForm.elements['title'].value = pathway.title;

    pathway.futureJobOpportunities.forEach( (futureOpp, idx) => {
        addLiInputElement(editPathwayFutureOpps);
        editPathwayFutureOpps.children[idx].querySelector('input').value = futureOpp;
    });

    let ccjs = Injector.globalCCJProcessor.getCCJsForCategory(pathway.id);
    ccjs.forEach( (ccj) => {
        displayPathwayProgram(editPathwayAttachedCourses, Injector.globalCourseProcessor.getCourseFromAnywhere(ccj.course_id) );
    });

    editPathwayForm.dataset.pathway = pathway.id;
}

// -- End Edit Pathway



const pathwayCardTemplate = document.getElementById('pathwayCardTemplate');
function getPathwayCard(pathway) {
    let element = pathwayCardTemplate.content.cloneNode(true);

    mapPathwayToCard(element, pathway);

    element.querySelector('div').dataset.pathway = pathway.id;

    return element;
}

function mapPathwayToCard(element, pathway) {
    element.querySelector('#pathway-title').textContent = pathway.title;
    element.querySelector('#pathway-id').textContent = pathway.id;

    const futureJobOpportunities = element.querySelector('#pathway-opps');
    futureJobOpportunities.innerHTML = '';
    
    pathway.futureJobOpportunities.forEach( (futureJob) => {
        let li = document.createElement('li');
        li.textContent = futureJob;
        futureJobOpportunities.appendChild(li);
    });

    const attachedCourses = element.querySelector('#pathway-courses');
    attachedCourses.innerHTML = '';

    let ccjs = Injector.globalCCJProcessor.getCCJsForCategory(pathway.id);
    ccjs.forEach( (ccj) => {
        attachedCourses.appendChild(
            getCCJView(ccj)
        );
    });

    return element;
}

function drawAllCategories(categories) {
    categories.forEach( (pathway) => {
        drawPathwayInEditor(pathway);
        drawPathwayInDeletor(pathway);
    });
}

const allEditedPathwaysPanel = document.getElementById('editedPathwaysDisplayPanel');
const allDeletedPathwaysPanel = document.getElementById('deletedPathwaysDisplayPanel');

function drawPathwayInEditor(pathway) {
    let elem = getPathwayCard(pathway);

    let editBtn = elem.querySelector('#pathway-action');
    
    editBtn.textContent = 'Edit';
    editBtn.dataset.edited = false;
    editBtn.addEventListener('click', (ev) => {
        ev.preventDefault();

        if (!editBtn.classList.contains('disabled')) {
            if (editBtn.dataset.edited == 'false' ) {
                showPathwayToEdit(pathway);
            } else {
                Injector.globalCategoryProcessor.unEditCategory(pathway.id);
            }
        }
    });

    allEditedPathwaysPanel.appendChild(elem);
}

function drawPathwayInDeletor(pathway) {
    let elem = getPathwayCard(pathway);

    let deleteBtn = elem.querySelector('#pathway-action');
    deleteBtn.textContent = 'Delete';
    deleteBtn.dataset.deleted = false;
    deleteBtn.addEventListener('click', (ev) => {
        ev.preventDefault();

        if (deleteBtn.dataset.deleted == 'false') {
            Injector.globalCategoryProcessor.deletedCategory(pathway.id);
        } else {
            Injector.globalCategoryProcessor.unDeleteCategory(pathway.id);
        }
    });

    allDeletedPathwaysPanel.appendChild(elem);
}

function redrawEditedCategory(pathwayId) {
    let elem = allEditedPathwaysPanel.querySelector(`div[data-pathway='${pathwayId}']`);

    let pathway = Injector.globalCategoryProcessor.getCategory(pathwayId);
    mapPathwayToCard(elem, pathway);

    let title = elem.querySelector('.card-title');
    title.classList.remove(EDITED);
    title.classList.remove(DELETED);
    title.classList.remove(WHITE_TEXT);

    actionBtn = elem.querySelector('.btn');
    actionBtn.classList.remove('disabled');
    actionBtn.textContent = 'Edit';
    actionBtn.dataset.edited = false;

    if (Injector.globalCategoryProcessor.isEdited(pathwayId)) {
        title.classList.add(EDITED);
        title.classList.add(WHITE_TEXT);
        actionBtn.textContent = 'Remove Edits';
        actionBtn.dataset.edited = true;
    }
    if (Injector.globalCategoryProcessor.isDeleted(pathwayId)) {
        title.classList.add(DELETED);
        title.classList.add(WHITE_TEXT);
        actionBtn.classList.add('disabled');
    }
}

function redrawDeletedCategory(pathwayId) {
    let elem = allDeletedPathwaysPanel.querySelector(`div[data-pathway='${pathwayId}']`);

    let pathway = Injector.globalCategoryProcessor.getCategory(pathwayId);
    mapPathwayToCard(elem, pathway);

    let title = elem.querySelector('.card-title');
    title.classList.remove(EDITED);
    title.classList.remove(DELETED);
    title.classList.remove(WHITE_TEXT);

    let actionBtn = elem.querySelector('.btn');
    actionBtn.textContent = 'Delete';
    actionBtn.dataset.deleted = false;

    if (Injector.globalCategoryProcessor.isDeleted(pathwayId)) {
        title.classList.add(DELETED);
        title.classList.add(WHITE_TEXT);
        actionBtn.textContent = 'UnDelete';
        actionBtn.dataset.deleted = true;
    } else if (Injector.globalCategoryProcessor.isEdited(pathwayId)) {
        title.classList.add(EDITED);
        title.classList.add(WHITE_TEXT);
    }
}

// -- End Pathways

// -- Errors --
const errorDiv = document.getElementById('errorDiv');
const errorCloseBtn = errorDiv.querySelector('.btn');
errorCloseBtn.addEventListener('click', (ev) => {
    ev.preventDefault();
    errorDiv.style.display = 'none';
    errorCloseBtn.blur();
})

function showError(message) {
    errorDiv.querySelector('strong').textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(
        () => { errorDiv.style.display = 'none'},
        5000
    );
}

// FINAL DATA OUT
const saveElem = document.getElementById('saveChanges');
saveElem.addEventListener('click', (ev) => {
    ev.preventDefault();

    let data = getFinalOutData();
    let jsonData = JSON.stringify(data);

    let url = `data:text/json;charset=utf-8,${encodeURIComponent(jsonData)}`;
    
    let elem = document.createElement('a');
    elem.href = url;
    elem.setAttribute('download', 'changes_file.json');
    elem.style.display = 'none';
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
});