var Search = {

    open: function() {
        return lunr(function() {
            this.field('url');
            this.field('title');
            this.field('tags', { boost: 10 });
            this.ref('id');
        });
    },

    add: function(index, item) {
        console.log("Adding " + JSON.stringify(item) + " to the index");
        index.add(item);
    },

    search: function(index, terms) {
        console.log("Searching for " + terms);
        return index.search(terms);
    }
};
