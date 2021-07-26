export class Prerequisite {
    title: String
    prerequisites: Array<String>
}

export class MiniCourse {
    courseId: Number
    courseTitle: String
    universityName: String
    universityIconUrl: String
}

export class Course {
    id: Number
    universityId: Number
    title: String
    faculty: Array<String>
    prerequisites: Array<Prerequisite>
    requiredAverage: Number
    domesticTuition: Number
    domesticBooks: Number
    domesticNotes: String
    internationalTuition: Number
    internationalBooks: Number
    internationalNotes: String
    notes: Array<String>
}