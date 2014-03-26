var Search = {

    open: function() {
        return lunr(function () {
            // TODO create schema
        });
    },

    add: function(index, item) {
        console.log("Adding " + JSON.stringify(item) + " to the index");
        // TODO
    },

    search: function(index, term) {
        console.log("Searching for " + term);
        // TODO
    }
};
