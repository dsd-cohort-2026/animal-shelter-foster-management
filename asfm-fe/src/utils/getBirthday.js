export default function getBirthdayYear(dob) {

    const currentDate = Date.now();
    const birthdayInMs = new Date(dob).getTime();
    const oneYear =  365 * 24 * 60 * 60 * 1000;

    const diffInYear = currentDate - birthdayInMs;

    return Math.floor(diffInYear / oneYear)

}