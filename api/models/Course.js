class Prerequisites {
    constructor(title, prerequisites) {
        this.title = title;
        this.prerequisites = prerequisites;
    }
}

class Course {
    constructor(
        id,
        university_id,
        title,
        faculty,
        prerequisites,
        recommendedPrequesites,
        requiredAverage,
        additionalDetails,
        domesticTution,
        domesticBooks,
        domesticNotes,
        internationalTuition,
        internationalBooks,
        internationalNotes,
        notes,
    ) {
        this.id = id;
        this.universityId = university_id;
    
        this.title = title;
        this.faculty = faculty;
        this.prerequisites = prerequisites;
        this.recommendedPrequesites = recommendedPrequesites;
        this.requiredAverage = requiredAverage;
        this.additionalDetails = additionalDetails;
        this.domesticTution = domesticTution;
        this.domesticBooks = domesticBooks;
        this.domesticNotes = domesticNotes;
        this.internationalTuition = internationalTuition;
        this.internationalBooks = internationalBooks;
        this.internationalNotes = internationalNotes;
        this.notes = notes;
    }
}

module.exports = {
    Prerequisites,
    Course
};