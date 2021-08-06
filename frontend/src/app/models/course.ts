export class Prerequisite {
    title: String = '';
    prerequisites: Array<String> = [];
}

export class MiniCourse {
    courseId: number = 0;
    courseTitle: String = '';
    universityName: String = '';
    universityIconUrl: String = '';
}

export class Course {
    id: number = 0;
    universityId: number = 0;
    courseUrl: String = '';
    title: String = '';
    faculty: Array<String> = [];
    prerequisites: Array<Prerequisite> = [];
    requiredAverage: number = 0;
    domesticTuition: number = 0;
    domesticBooks: number = 0;
    domesticNotes: String = '';
    internationalTuition: number = 0;
    internationalBooks: number = 0;
    internationalNotes: String = '';
    notes: String = '';
}