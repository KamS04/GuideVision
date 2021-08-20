module.exports = class University {
    constructor(
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
    ) {
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
};
