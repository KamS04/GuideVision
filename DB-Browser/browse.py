from os import stat
import click
import sqlite3
from pandas import read_sql
import json
import tempfile
import filecmp
import os
from inspect import signature

class Config:
    def __init__(
        self,
        UNIVERSITIES = 'Universities',
        UNI_ID = 'ID',
        UNI_NAME = 'Name',
        UNI_FACULTIES = 'Faculties',
        UNI_PHONE = 'Phone',
        UNI_STREET_ADDRESS = 'Street',
        UNI_CITY = 'City',
        UNI_PROVINCE = 'Province',
        UNI_COUNTRY = 'Country',
        UNI_POSTAL = 'PostalCode',
        UNI_URL = 'Url',
        UNI_ICON_URL = 'IconUrl',

        COURSES = 'Courses',
        COURSE_ID = 'ID',
        COURSE_UNI = 'CUniversity',
        COURSE_URL = 'CUrl',
        COURSE_TITLE = 'Title',
        COURSE_FACULTY = 'CFaculty',
        COURSE_PREQ = 'Prerequisite',
        COURSE_AVE = 'RequiredAverage',
        COURSE_DOM_TUI = 'DomesticTuition',
        COURSE_DOM_BOOKS = 'DomesticBooks',
        COURSE_DOM_NOTES = 'DomesticNotes',
        COURSE_INT_TUI = 'InternationalTuition',
        COURSE_INT_BOOKS = 'InternationalBooks',
        COURSE_INT_NOTES = 'InternationalNotes',
        COURSE_NOTES = 'Notes',

        CATEGORIES = 'Categories',
        CATEGORY_ID = 'ID',
        CATEGORY_TITLE = 'CatTitle',
        CATEGORY_FUTURE_JOB_OPPS = 'Future',

        CAT_COU_JUNC = 'CatCourseJunction',
        CCJ_ID = 'ID',
        CCJ_COURSE = 'CourseId',
        CCJ_CATEGORY = 'CategoryId',
    ):
        self.UNIVERSITIES = UNIVERSITIES
        self.UNI_ID = UNI_ID
        self.UNI_NAME = UNI_NAME
        self.UNI_FACULTIES = UNI_FACULTIES
        self.UNI_PHONE = UNI_PHONE
        self.UNI_STREET_ADDRESS = UNI_STREET_ADDRESS
        self.UNI_CITY = UNI_CITY
        self.UNI_PROVINCE = UNI_PROVINCE
        self.UNI_COUNTRY = UNI_COUNTRY
        self.UNI_POSTAL = UNI_POSTAL
        self.UNI_URL = UNI_URL
        self.UNI_ICON_URL = UNI_ICON_URL

        self.COURSES = COURSES
        self.COURSE_ID = COURSE_ID
        self.COURSE_UNI = COURSE_UNI
        self.COURSE_URL = COURSE_URL
        self.COURSE_TITLE = COURSE_TITLE
        self.COURSE_FACULTY = COURSE_FACULTY
        self.COURSE_PREQ = COURSE_PREQ
        self.COURSE_AVE = COURSE_AVE
        self.COURSE_DOM_TUI = COURSE_DOM_TUI
        self.COURSE_DOM_BOOKS = COURSE_DOM_BOOKS
        self.COURSE_DOM_NOTES = COURSE_DOM_NOTES
        self.COURSE_INT_TUI = COURSE_INT_TUI
        self.COURSE_INT_BOOKS = COURSE_INT_BOOKS
        self.COURSE_INT_NOTES = COURSE_INT_NOTES
        self.COURSE_NOTES = COURSE_NOTES
        
        self.CATEGORIES = CATEGORIES
        self.CATEGORY_ID = CATEGORY_ID
        self.CATEGORY_TITLE = CATEGORY_TITLE
        self.CATEGORY_FUTURE_JOB_OPPS = CATEGORY_FUTURE_JOB_OPPS
        
        self.CAT_COU_JUNC = CAT_COU_JUNC
        self.CCJ_ID = CCJ_ID
        self.CCJ_COURSE = CCJ_COURSE
        self.CCJ_CATEGORY = CCJ_CATEGORY


class ModelBase:
    @property
    def dict(self):
        return vars(self)
    
    @property
    def json(self):
        return json.dumps(self.dict)


class University(ModelBase):
    def __init__(
        self,
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
    ):
        self.id = id
        self.name = name
        self.faculties = faculties
        self.phone = phone
        self.streetAddress = streetAddress
        self.city = city
        self.provinceState = provinceState
        self.country = country
        self.postalCode = postalCode
        self.url = url
        self.iconUrl = iconUrl


class Course(ModelBase):
    def __init__(
        self,
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
    ):
        self.id = id
        self.universityId = universityId
        
        self.courseUrl = courseUrl

        self.title = title
        self.faculty = faculty
        self.prerequisites = prerequisites
        self.requiredAverage = requiredAverage
        self.domesticTuition = domesticTuition
        self.domesticBooks = domesticBooks
        self.domesticNotes = domesticNotes
        self.internationalTuition = internationalTuition
        self.internationalBooks = internationalBooks
        self.internationalNotes = internationalNotes
        self.notes = notes


class Category(ModelBase):
    def __init__(self, id, title, futureJobOpportunities):
        self.id = id
        self.title = title
        self.futureJobOpportunities = futureJobOpportunities


class CatCouJunc(ModelBase):
    def __init__(self, id, course_id, category_id):
        self.id = id
        self.course_id = course_id
        self.category_id = category_id


def map_university(rawUniversity, config: Config):
    return University(
        int(rawUniversity[config.UNI_ID]),
        rawUniversity[config.UNI_NAME],
        json.loads(rawUniversity[config.UNI_FACULTIES]),
        rawUniversity[config.UNI_PHONE],
        rawUniversity[config.UNI_STREET_ADDRESS],
        rawUniversity[config.UNI_CITY],
        rawUniversity[config.UNI_PROVINCE],
        rawUniversity[config.UNI_COUNTRY],
        rawUniversity[config.UNI_POSTAL],
        rawUniversity[config.UNI_URL],
        rawUniversity[config.UNI_ICON_URL],
    )

def map_course(rawCourse, config: Config):
    return Course(
        int(rawCourse[config.COURSE_ID]),
        int(rawCourse[config.COURSE_UNI]),
        rawCourse[config.COURSE_URL],
        rawCourse[config.COURSE_TITLE],
        rawCourse[config.COURSE_FACULTY],
        json.loads(rawCourse[config.COURSE_PREQ]),
        rawCourse[config.COURSE_AVE],
        int(rawCourse[config.COURSE_DOM_TUI]),
        int(rawCourse[config.COURSE_DOM_BOOKS]),
        rawCourse[config.COURSE_DOM_NOTES],
        int(rawCourse[config.COURSE_INT_TUI]),
        int(rawCourse[config.COURSE_INT_BOOKS]),
        rawCourse[config.COURSE_INT_NOTES],
        rawCourse[config.COURSE_NOTES],
    )

def map_category(rawCategory, config: Config):
    return Category(
        int(rawCategory[config.CATEGORY_ID]),
        rawCategory[config.CATEGORY_TITLE],
        json.loads(rawCategory[config.CATEGORY_FUTURE_JOB_OPPS])
    )

def map_catcoujunc(rawCatCouJunc, config: Config):
    return CatCouJunc(
        int(rawCatCouJunc[config.CCJ_ID]),
        int(rawCatCouJunc[config.CCJ_COURSE]),
        int(rawCatCouJunc[config.CCJ_CATEGORY])
    )

def write_university(university: University, config: Config):
    return {
        config.UNI_ID: university.id,
        config.UNI_NAME: university.name,
        config.UNI_FACULTIES: json.dumps(university.faculties),
        config.UNI_PHONE: university.phone,
        config.UNI_STREET_ADDRESS: university.streetAddress,
        config.UNI_CITY: university.city,
        config.UNI_PROVINCE: university.provinceState,
        config.UNI_COUNTRY: university.country,
        config.UNI_POSTAL: university.postalCode,
        config.UNI_URL: university.url,
        config.UNI_ICON_URL: university.iconUrl,
    }

def write_course(course: Course, config: Config):
    return {
        config.COURSE_ID: course.id,
        config.COURSE_UNI: course.universityId,
        config.COURSE_URL: course.courseUrl,
        config.COURSE_TITLE: course.title,
        config.COURSE_FACULTY: course.faculty,
        config.COURSE_PREQ: json.dumps(course.prerequisites),
        config.COURSE_AVE: course.requiredAverage,
        config.COURSE_DOM_TUI: course.domesticTuition,
        config.COURSE_DOM_BOOKS: course.domesticBooks,
        config.COURSE_DOM_NOTES: course.domesticNotes,
        config.COURSE_INT_TUI: course.internationalTuition,
        config.COURSE_INT_BOOKS: course.internationalBooks,
        config.COURSE_INT_NOTES: course.internationalNotes,
        config.COURSE_NOTES: course.notes,
    }

def write_category(category: Category, config: Config):
    return {
        config.CATEGORY_ID: category.id,
        config.CATEGORY_TITLE: category.title,
        config.CATEGORY_FUTURE_JOB_OPPS: json.dumps(category.futureJobOpportunities)
    }

def write_ccj(ccj: CatCouJunc, config: Config):
    return {
        config.CCJ_ID: ccj.id,
        config.CCJ_COURSE: ccj.course_id,
        config.CCJ_CATEGORY: ccj.category_id
    }

def mapModelsToDict(models: ModelBase):
    return [ model.dict for model in models ]

def read_map_dataframe(query, database, mapper, params=None):
    dataframe = read_sql(query, database, params=params)
    # print(dataframe)
    transformed = dataframe.T
    return [ mapper(transformed[row_number]) for row_number in range(len(dataframe)) ]

def get_data(db_file, config: Config):
    db = sqlite3.connect(db_file)
    universities = read_map_dataframe(f'SELECT * FROM {config.UNIVERSITIES};', db, lambda data, config=config : map_university(data, config) )
    courses = read_map_dataframe(f'SELECT * FROM {config.COURSES};', db, lambda data, config=config : map_course(data, config) )
    categories = read_map_dataframe(f'SELECT * FROM {config.CATEGORIES}', db, lambda data, config=config : map_category(data, config) )
    cat_cou_juncs = read_map_dataframe(f'SELECT * FROM {config.CAT_COU_JUNC}', db, lambda data, config=config : map_catcoujunc(data, config) )
    
    # universities = [ map_university(row, config) for row in read_sql(f'SELECT * FROM {config.UNIVERSITIES};', db).T ]
    # courses = [ map_course(row, config) for row in read_sql(f'SELECT * FROM {config.COURSES};', db).T ]
    # categories = [ map_course(row, config) for row in read_sql(f'SELECT * FROM {config.CATEGORIES}', db).T ]
    # cat_cou_juncs = [ map_catcoujunc(row, config) for row in read_sql(f'SELECT * FROM {config.CAT_COU_JUNC}', db).T ]

    return {
        'universities': mapModelsToDict(universities),
        'courses': mapModelsToDict(courses),
        'categories': mapModelsToDict(categories),
        'cat_cou_juncs': mapModelsToDict(cat_cou_juncs)
    }

def write_out(db_file, config: Config, out_file, debug_mode=True):
    data = get_data(db_file, config)

    if debug_mode:
        to_write = json.dumps(data, indent=2)
    else:
        to_write = json.dumps(data)

    open(out_file, 'w').write(to_write)

def get_none_ifyed(cls: type):
    return cls( *( [None] * len(signature(cls).parameters) ) )

def remove_nones(data):
    none_keys = { k for k in data.keys() if data[k] is None }
    for k in none_keys:
        del data[k]
    return data

def create_insert_query(table_name, data):
    keys, values = list( zip( *list(data.items() ) ) )
    key_query = ', '.join(keys)
    params = ', '.join('?' for i in values)
    query = f'INSERT INTO {table_name} ({key_query}) VALUES({params})'
    return query, tuple(values)

def create_update_query(table_name, data, id_key, id):
    keys, values = list( zip( *list(data.items() ) ) )
    set_string = ', '.join( f'{key} = ?' for key in keys )
    query = f'UPDATE {table_name} SET {set_string} WHERE {id_key} = {id}'
    return query, tuple(values)

def create_delete_query(table_name, id_key, id):
    return f'DELETE FROM {table_name} WHERE {id_key} = ?', (id,)

def process_changes(db_file, config: Config, change_file, super_safe_mode=False):
    db = sqlite3.connect(db_file)

    ids = {
        'university': {},
        'course': {},
        'category': {},
        'ccj': {}
    }

    def get_university(uni_id):
        df = read_sql(f'SELECT * FROM {config.UNIVERSITIES} WHERE {config.UNI_ID} = ?;', db, params=(uni_id,))
        return map_university(df.T[0], config) if not df.empty else None
    
    def get_course(c_id):
        df = read_sql(f'SELECT * FROM {config.COURSES} WHERE {config.COURSE_ID} = ?;', db, params=(c_id,))
        return map_course(df.T[0], config) if not df.empty else None
    
    def get_category(c_id):
        df = read_sql(f'SELECT * FROM {config.CATEGORIES} WHERE {config.CATEGORY_ID} = ?;', db, params=(c_id,))
        return map_category(df.T[0], config) if not df.empty else None
    

    # Read change file
    changes = json.loads( open(change_file, 'rb').read() )

    # -- Create Operations --

    # Update Universities
    for university in changes['editions']['universities']:
        default: University = get_none_ifyed(University)
        for key, value in university.items():
            setattr(default, key, value)
        
        sql_dict = remove_nones( write_university(default, config) )

        sql_id = sql_dict[config.UNI_ID]
        del sql_dict[config.UNI_ID]

        query, params = create_update_query(config.UNIVERSITIES, sql_dict, config.UNI_ID, sql_id)
        db.execute(query, params)
    

    # Create Unis
    for uni_to_add in changes['additions']['universities']:
        new_university = University(**uni_to_add)
        sql_dict = write_university(new_university, config)
        
        _, meta_id = sql_dict[config.UNI_ID].split(':')
        del sql_dict[config.UNI_ID]

        query, params = create_insert_query(config.UNIVERSITIES, sql_dict)
        cursor = db.execute(query, params)
        new_id = cursor.lastrowid
        ids['university'][meta_id] = new_id
    
    # Create Courses
    for course_to_add in changes['additions']['courses']:
        new_course = Course(**course_to_add)

        if isinstance(new_course.universityId, str):
            # @:meta_id
            _, uni_meta_id = new_course.universityId.split(':')
            try:
                new_course.universityId = ids['university'][uni_meta_id]
            except KeyError:
                print(f'WOAH course {new_course.id} tried to access university {meta_id} that does not exist')
                exit(1)
        
        uni = get_university(new_course.universityId)

        if uni is None:
            print(f"Course {new_course.id} tried to access university {new_course.universityId} that doesn't exist")
            exit(1)

        if new_course.faculty not in uni.faculties:
            print(f"Course {new_course.id} has faculty that it's university {new_course.universityId} does not have")
            exit(1)

        sql_dict = write_course(new_course, config)
        
        _, meta_id = sql_dict[config.COURSE_ID].split(':')
        del sql_dict[config.COURSE_ID]

        query, params = create_insert_query(config.COURSES, sql_dict)
        cursor = db.execute(query, params)
        new_id = cursor.lastrowid
        ids['course'][meta_id] = new_id

    # Create Categories
    for category_to_add in changes['additions']['categories']:
        new_category = Category(**category_to_add)
        sql_dict = write_category(new_category, config)
        
        _, meta_id = sql_dict[config.CATEGORY_ID].split(':')
        del sql_dict[config.CATEGORY_ID]

        query, params = create_insert_query(config.CATEGORIES, sql_dict)
        cursor = db.execute(query, params)
        new_id = cursor.lastrowid
        ids['category'][meta_id] = new_id

    # Create CCJs
    for ccj_to_add in changes['additions']['ccjs']:
        new_ccj = CatCouJunc(**ccj_to_add)

        if isinstance(new_ccj.course_id, str):
            # @:meta_id
            _, course_meta_id = new_ccj.course_id.split(':')
            try:
                new_ccj.course_id = ids['course'][course_meta_id]
            except KeyError:
                print(f'WOAH ccj {new_ccj.id} tried to access course {meta_id} that does not exist')
                exit(1)
        elif get_course(new_ccj.course_id) is None:
            print(f'WOAH ccj {new_ccj.id} tried to access course {new_ccj.course_id} that does not exist')
            exit(1)

        if isinstance(new_ccj.category_id, str):
            # @:meta_id
            _, category_meta_id = new_ccj.category_id.split(':')
            try:
                new_ccj.category_id = ids['category'][category_meta_id]
            except KeyError:
                print(f'WOAH ccj {new_ccj.id} tried to access category {meta_id} that does not exist')
                exit(1)
        elif get_category(new_ccj.category_id) is None:
            print(f'WOAH tried to access category {new_ccj.category_id} that does not exist')
            exit(1)

        sql_dict = write_ccj(new_ccj, config)
        
        _, meta_id = sql_dict[config.CCJ_ID].split(':')
        del sql_dict[config.CCJ_ID]

        query, params = create_insert_query(config.CAT_COU_JUNC, sql_dict)
        cursor = db.execute(query, params)
        new_id = cursor.lastrowid
        ids['ccj'][meta_id] = new_id

    # -- End Create --

    # -- Update Operations --

    # Update Courses
    for course in changes['editions']['courses']:
        default: Course = get_none_ifyed(Course)
        for key, value in course.items():
            setattr(default, key, value)
        
        if isinstance(default.universityId, str):
            # @:meta_id
            _, uni_meta_id = default.universityId.split(':')
            try:
                default.universityId = ids['university'][uni_meta_id]
            except KeyError:
                print(f'WOAH course {default.id} tried to access university {uni_meta_id} that does not exist')
                exit(1)

        sql_dict = remove_nones( write_course(default, config) )

        if config.COURSE_FACULTY in sql_dict.keys():
            uni_id = None
            if config.COURSE_UNI in sql_dict.keys():
                uni_id = sql_dict[config.COURSE_UNI]
            else:
                uni_id = get_course(sql_dict[config.COURSE_ID]).universityId
            uni = get_university(uni_id)
            if sql_dict[config.COURSE_FACULTY] not in uni.faculties:
                print(f"Course {default.id} has faculty that it's university {uni_id} does not have")
                exit(1)
        elif config.COURSE_UNI in sql_dict.keys():
            uni = get_university(sql_dict[config.COURSE_UNI])
            if sql_dict[config.COURSE_FACULTY] not in uni.faculties:
                print(f"Courses {default.id} has faculty that it's university {sql_dict[config.COURSE_UNI]} does not have")
                exit(1)

        sql_id = sql_dict[config.COURSE_ID]
        del sql_dict[config.COURSE_ID]

        query, params = create_update_query(config.COURSES, sql_dict, config.COURSE_ID, sql_id)
        db.execute(query, params)
    
    # Update Categories
    for category in changes['editions']['categories']:
        default: Category = get_none_ifyed(Category)
        for key, value in category.items():
            setattr(default, key, value)

        sql_dict = remove_nones( write_course(default, config) )

        sql_id = sql_dict[config.CATEGORY_ID]
        del sql_dict[config.CATEGORY_ID]

        query, params = create_update_query(config.CATEGORIES, sql_dict, config.CATEGORY_ID, sql_id)
        db.execute(query, params)
    
    # -- End Updates --

    # -- Delete Operations --
    for ccj_id in changes['deletions']['ccjs']:
        query, params = create_delete_query(config.CAT_COU_JUNC, config.CCJ_ID, ccj_id)
        db.execute(query, params)
    
    for course_id in changes['deletions']['courses']:
        if super_safe_mode:
            df = read_sql(f'SELECT * FROM {config.CAT_COU_JUNC} WHERE {config.CCJ_COURSE} = ?;', db, params=(course_id,))
            if not df.empty:
                print(f'WOAH There, tried to delete course {course_id} without changing all the CatCouJuncs connected to it')
                exit(1)
        
        query, params = create_delete_query(config.COURSES, config.COURSE_ID, course_id)
        db.execute(query, params)
    
    for category_id in changes['deletions']['categories']:
        if super_safe_mode:
            df = read_sql(f'SELECT * FROM {config.CAT_COU_JUNC} WHERE {config.CCJ_CATEGORY} = ?;', db, params=(category_id,))
            if not df.empty:
                print(f'WOAH There, tried to delete category {category_id} without changing all the CatCouJuncs connected to it')
                exit(1)
        
        query, params = create_delete_query(config.CATEGORIES, config.CATEGORY_ID, category_id)
        db.execute(query, params)
    
    for university_id in changes['deletions']['universities']:
        if super_safe_mode:
            df = read_sql(f'SELECT * FROM {config.COURSES} WHERE {config.UNI_ID} = ?;', db, (university_id,) )
            if not df.empty:
                print(f'WOAH There, tried to delete university {university_id} without changing all the courses connected to it')
                exit(1)
        
        query, params = create_delete_query(config.UNIVERSITIES, config.UNI_ID, university_id)
        db.execute(query, params)

    db.commit()
    print(f'Saved Changes to database at {db_file}')

def verify_integrity(db_file, config: Config, data_file, debug_mode=True):
    tmp_path = os.path.join( tempfile.gettempdir(), 'gcdb.data')
    write_out(db_file, config, tmp_path, debug_mode=debug_mode)
    return filecmp.cmp(tmp_path, data_file, shallow=True)


# -- CLI --

@click.group()
def main():
    '''Guiding Vision Database Browser Utility'''
    pass

@main.command()
@click.argument('db-path', type=click.Path(exists=True, dir_okay=False, readable=True, resolve_path=True), required=True)
@click.option('-c', '--config', type=click.Path(exists=True, dir_okay=False, resolve_path=True, readable=True), required=False)
@click.argument('out-path', type=click.Path(dir_okay=False, writable=True, resolve_path=True), required=True)
@click.option('-d', '--debug', is_flag=True, required=False)
def writeout(db_path, config, out_path, debug):
    config = Config(**json.loads(open(config, 'rb'))) if config else Config()
    write_out(db_path, config, out_path, debug_mode=debug)


@main.command()
@click.argument('db-path', type=click.Path(exists=True, dir_okay=False, readable=True, writable=True, resolve_path=True), required=True)
@click.argument('data-file', type=click.Path(exists=True, dir_okay=False, readable=True, writable=True, resolve_path=True), required=True)
@click.option('-c', '--config', type=click.Path(exists=True, dir_okay=False, resolve_path=True, readable=True), required=False)
@click.argument('change-file', type=click.Path(exists=True, dir_okay=False, readable=True, resolve_path=True), required=True)
@click.option('-f', '--force', is_flag=True, required=False)
@click.option('-s', '--safe', is_flag=True, required=False)
@click.option('-d', '--debug', is_flag=True, required=False)
def processchanges(db_path, data_file, config, change_file, force, safe, debug):
    config = Config(**json.loads(open(config, 'rb').read())) if config else Config()

    file_verified = verify_integrity(db_path, config, data_file, debug_mode=debug)

    if not file_verified:
        print('You are editing an outdated data file, while things may work it is possible you may lose edits made by others.')
        if force:
            print('Continuing anyways')
        else:
            print('If you would like to continue anyways, run the command with the "-f" flag')
            return

    process_changes(db_path, config, change_file, super_safe_mode=(not safe))


@main.command()
@click.argument('db-path', type=click.Path(exists=True, dir_okay=False, readable=True, writable=True, resolve_path=True), required=True)
@click.argument('data-file', type=click.Path(exists=True, dir_okay=False, readable=True, writable=True, resolve_path=True), required=True)
@click.option('-c', '--config', type=click.Path(exists=True, dir_okay=False, resolve_path=True, readable=True), required=False)
def verify(db_path, data_file, config):
    config = Config( **json.loads( open(config, 'rb').read() ) ) if config else Config()

    file_verified = verify_integrity(db_path, config, data_file)

    if file_verified:
        print('Data file is up-to-date')
    else:
        print('Data file is out of date')


if __name__ == '__main__':
    main()