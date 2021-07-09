module.exports = class Category {
    constructor(id, title, attachedCourses, futureJobOpporunities) {
        this.id = id;
        this.title = title;
        this.attachedCourses = attachedCourses;
        this.futureJobOpporunities = futureJobOpporunities;
    }
}