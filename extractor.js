class InvalidIDError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidIDError";
    }
}

class EgyptianID {
    /*
    https://ar.wikipedia.org/wiki/بطاقة_الرقم_القومي_المصرية
    The first digit is the century (2 for 20th century, 3 for 21st).
    The next two digits are the year of birth.
    The following two digits are the month of birth.
    The next two digits are the day of birth.
    The following two digits represent the governorate code.
    The next two digits are random numbers for distinguishing people with similar data.
    The second last digit represents the gender (even for females, odd for males).
    The last digit is a check digit.
    */
    constructor(id) {
        if (!/^\d{14}$/.test(id)) {
            throw new InvalidIDError("The ID must be 14 digits and contain only numbers.");
        }
        this._id = id;
        this.GOVERNORATES = {
            '01': 'Cairo',
            '02': 'Alexandria',
            '03': 'Port Said',
            '04': 'Suez',
            '11': 'Damietta',
            '12': 'Dakahlia',
            '13': 'Al Sharqia',
            '14': 'Kaliobeya',
            '15': 'Kafr El-Sheikh',
            '16': 'Al Gharbia',
            '17': 'Al Monoufia',
            '18': 'Al Beheira',
            '19': 'Ismailia',
            '21': 'Giza',
            '22': 'Beni Suef',
            '23': 'Fayoum',
            '24': 'Al Menia',
            '25': 'Assiut',
            '26': 'Sohag',
            '27': 'Qena',
            '28': 'Aswan',
            '29': 'Luxor',
            '31': 'Red Sea',
            '32': 'New Valley',
            '33': 'Matrouh',
            '34': 'North Sinai',
            '35': 'South Sinai',
            '88': 'Foreign'
        };
    }

    getGovernorate(governorateCode) {
        if (this.GOVERNORATES[governorateCode]) {
            return this.GOVERNORATES[governorateCode];
        } else {
            throw new InvalidIDError(`Invalid Governorate Code: ${governorateCode}`);
        }
    }

    getGender(genderCode) {
        return genderCode % 2 === 0 ? "Female" : "Male";
    }

    getBirthdate(birthdate) {
        const century = parseInt(birthdate[0]);
        let year = parseInt(birthdate.slice(1, 3));
        const month = parseInt(birthdate.slice(3, 5));
        const day = parseInt(birthdate.slice(5));

        if (century === 2) {  // 20th century
            year += 1900;
        } else if (century === 3) {  // 21st century
            year += 2000;
        } else {
            throw new InvalidIDError(`Invalid Century: ${century}`);
        }

        if (month < 1 || month > 12 || day < 1 || day > 31) {
            throw new InvalidIDError(`Invalid Date of Birth: ${day}-${month}-${year}`);
        }

        return new Date(year, month - 1, day);
    }

    extractInfo() {
        const birthdate = this.getBirthdate(this._id.slice(0, 7));
        return {
            birthdate: {
                day: birthdate.getDate(),
                month: birthdate.getMonth() + 1,
                year: birthdate.getFullYear()
            },
            governorate: this.getGovernorate(this._id.slice(7, 9)),
            gender: this.getGender(parseInt(this._id[12]))
        };
    }

    get id() {
        return this._id;
    }

    get birthdate() {
        return this.getBirthdate(this._id.slice(0, 7));
    }

    get governorate() {
        return this.getGovernorate(this._id.slice(7, 9));
    }

    get gender() {
        return this.getGender(parseInt(this._id[12]));
    }
}

document.getElementById('nationalIdForm').addEventListener('submit', function (event) {
    event.preventDefault();

    const nationalIdValue = document.getElementById('national_id').value;

    const errorText = document.getElementById('error')
    const infoElement = document.getElementById('extractedInfo')

    try {
        const idInstance = new EgyptianID(nationalIdValue);
        const extractedInfo = idInstance.extractInfo();
        errorText.innerText = '';
        infoElement.style.display = 'block';

        document.getElementById('gender').innerText = `Gender: ${extractedInfo.gender}`;
        document.getElementById('birthdate').innerText = `Birth Date: ${extractedInfo.birthdate.day}-${extractedInfo.birthdate.month}-${extractedInfo.birthdate.year}`;
        document.getElementById('governorate').innerText = `Governorate: ${extractedInfo.governorate}`;

        // Calculate age based on the birth date
        const today = new Date();
        const birthdate = new Date(extractedInfo.birthdate.year, extractedInfo.birthdate.month - 1, extractedInfo.birthdate.day);
        let age = today.getFullYear() - birthdate.getFullYear();

        // Adjust age based on today's month and day
        if (today.getMonth() < birthdate.getMonth() || (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate())) {
            age--;
        }
        document.getElementById('age').innerText = `Age: ${age} years`;

    } catch (error) {
        errorText.innerText = `Error: ${error.message}`;
        infoElement.style.display = 'None';
    }
});