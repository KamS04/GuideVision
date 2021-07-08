class Prerequisites {
    title: String = '';
    prerequisites: String[] = [];
}


class Course {
    id: Number = 0;
    university_id: Number = 0;

    title: String = '';
    faculty: String = '';
    prerequisites: Prerequisites[] = [];
    recommended_prequesites: String[] = [];
    required_average: String = '';
    additional_details: String = '';
    domestic_tuition: Number = 0;
    domestic_notes: String = '';
    international_tuition: Number = 0;
    international_notes: String = '';
    notes: String[] = [];
}