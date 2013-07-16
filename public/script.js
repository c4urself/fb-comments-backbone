// Add a namespace, always good practice
window.cafepress = window.cafepress || {};

// Self-invoking function which is saved in the
// comments object, the only thing exposed in the
// global (window) namespace
cafepress.comments = (function (Backbone, $) {

    // Make a model - a container to hold our comments
    // The fields in this model are automatically
    // assigned by the server's response
    var Comment = Backbone.Model.extend({});

    // Collection of the above model. Here we define
    // the endpoint and give the collection some guidance
    // with 'parse' on where to find the array of objects
    var CommentList = Backbone.Collection.extend({
        url: 'http://graph.facebook.com/comments?id=http://www.cafepress.com/mf/52455707/dfr_tshirt',

        model: Comment,

        parse: function (response) {
            return response.data;
        }
    });

    // Initialise the collection
    var Comments = new CommentList();

    // Here we define how individual comments should be
    // rendered. The only special items are the events;
    // 'on' and 'off' are the callbacks that are triggered
    // onmouseover and onmouseout.
    var CommentView = Backbone.View.extend({
        tagName: 'li',

        className: 'comment',

        events: {
            'mouseover': 'on',
            'mouseout': 'off'
        },

        initialize: function () {
            _.bindAll(this, 'on', 'off'); // Make sure 'this' is mapped to the View
        },

        on: function () {
            var ctx = this.model.toJSON();
            this.$el.addClass('on');
            this.$el.html('<span class="comment">' + ctx.message + '</span>');
        },

        off: function () {
            this.$el.removeClass('on');
            this.render();
        },

        render: function () {
            var ctx = this.model.toJSON();
            this.$el.html('<span class="timestamp">' + ctx.created_time + '</span><span class="name">' + ctx.from.name + '</span>')
            return this;
        }
    });

    // Another view, this one finds an existing dom element
    // by using 'el' and is the view for the comments container
    var CommentsView = Backbone.View.extend({
        el: 'ul.comments',

        initialize: function () {
            this.listenTo(Comments, 'add', this.addComment);
            this.listenTo(Comments, 'reset', this.addAll);

            Comments.fetch();
        },

        addAll: function () {
            Comments.each(this.addComment, this);
        },

        addComment: function (comment) {
            var view = new CommentView({model: comment});
            this.$el.append(view.render().el);
        }
    });


    return {
        init: function () {
            var app = new CommentsView();
        }
    };


})(Backbone, jQuery);


// Since 'script.js' is loaded after Backbone, its dependency
// Underscore, and jQuery, the above code can be set up and run
// as soon as script.js is loaded. However, only once the dom
// is ready can we start manipulating the dom by injecting Backbone
// Views.
jQuery(document).ready(function () {
    cafepress.comments.init();
});