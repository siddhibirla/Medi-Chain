
// https://stackoverflow.com/questions/27709636/determining-if-all-attributes-on-a-javascript-object-are-null-or-an-empty-string
const isEmpty = (obj: any): boolean =>  {
    for (const key in obj) {
        if (obj[key] == null || obj[key] === "")
            return true;
    }
    return false;
}

export default isEmpty;

