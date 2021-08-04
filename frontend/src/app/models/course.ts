export class Prerequisite {
    title: String
    prerequisites: Array<String>
}

export class MiniCourse {
    courseId: number
    courseTitle: String
    universityName: String
    universityIconUrl: String
}

export class Course {
    id: number
    universityId: number
    courseUrl: String
    title: String
    faculty: Array<String>
    prerequisites: Array<Prerequisite>
    requiredAverage: number
    domesticTuition: number
    domesticBooks: number
    domesticNotes: String
    internationalTuition: number
    internationalBooks: number
    internationalNotes: String
    notes: String
}