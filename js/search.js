var Search = {

    open: function() {
        return lunr(function () {
            // TODO define schema
        });
    },

    add: function(index, item) {
        console.log("Adding " + JSON.stringify(item) + " to the index");
    },

    search: function(index, term) {
        console.log("Searching for " + term);
    }
};
