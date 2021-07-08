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
        domesticNotes,
        internationalTuition,
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
        this.domesticNotes = domesticNotes;
        this.internationalTuition = internationalTuition;
        this.internationalNotes = internationalNotes;
        this.notes = notes;
    }
}