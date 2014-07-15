// from https://gist.github.com/Integralist/4966463

/**
 * Shorten a string by a specified number of characters and end the string
 * using either a user specified suffix or a default suffix.
 * Ensures string is not abbreviated prematurely (e.g. half way through a word)
 *
 * Dependencies:
 *     - clean_string
 *     - is_too_short
 *     - crop
 *
 * @param user_str {string} user specified string
 * @param user_max {number} the maximum allowed characters before abbreviating
 * @param user_suffix {string} the characters used to end the string
 * @return {string} the abbreviated string
 */
function abbreviate (user_str, user_max, user_suffix) {
    var suffix = (typeof user_suffix !== 'undefined' ? user_suffix : '...');
    var max = user_max - suffix.length;
    var string = clean_string(user_str); // remove all extraneous white space

    if (shorter_than(string, max)) {
        return string;
    }

    return crop(string, max, suffix);
}

/**
 * Removes any unnecessary spaces from the specified string
 *
 * @param string {string} user specified string
 * @return {string} the string cleared of unnecessary spaces
 */
function clean_string (string) {
    var startend_spaces = /^\s+|\s+$/g;
    var linebreak_spaces = /[\r\n]*\s*[\r\n]+/g;
    var tab_spaces = /[ \t]+/g;

    return string.replace(startend_spaces, '').replace(linebreak_spaces, ' ').replace(tab_spaces, ' ');
}

/**
 * Checks if the string length is less or equal to the maximum allowed
 *
 * @param string {string} user specified string
 * @param max {number} the maximum allowed characters before abbreviating
 * @return {boolean} whether the length of the string exceeds the maximum
 */
function shorter_than (string, max) {
    return string.length <= max;
}

/**
 * Crops the string so its length is under the max allowed, and also
 * adds the specified suffix to the end of the string
 * Ensures string is not abbreviated prematurely (e.g. half way through a word)
 *
 * @param string {string} user specified string
 * @param max {number} the maximum allowed characters before abbreviating
 * @param suffix {string} the characters used to end the string
 * @return {string} the abbreviated string
 */
function crop (string, max, suffix) {
    var abbr = '';
    var counter = 0;
    var len;
    var ending_space = /[ ]$/g;

    string = string.split(' ');
    len = string.length;

    while (counter < len) {
        // individual characters of a string can be accessed via bracket notation
        if ((abbr + string[counter]).length < max) {
            abbr += string[counter] + ' ';
        } else {
            break;
        }

        counter++;
    }

    return abbr.replace(ending_space, '') + suffix;
}

// Example usage:
console.log(abbreviate('this is my very long string that probably should be cropped at some point soon', 11, '!!!'));
console.log(abbreviate('this is my very long string that probably should be cropped at some point soon', 20));
