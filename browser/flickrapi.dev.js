(function() {
 var methodNames = [];
 var Utils = {};
Utils.formQueryString = function (queryArguments) {
    var args = [],
        append = function(key) {
          args.push(key + "=" + queryArguments[key]);
        };
    Object.keys(queryArguments).sort().forEach(append);
    return args.join("&");
  };
Utils.checkRequirements = function (method_name, required, callOptions, callback) {
    for(var r=0, last=required.length, arg; r<last; r++) {
      arg = required[r];
      if(arg.name === "api_key") continue;
      if(!callOptions.hasOwnProperty(arg.name)) {
        return callback(new Error("missing required argument '"+arg.name+"' in call to "+method_name));
      }
    }
  };
Utils.generateQueryArguments = function (method_name, flickrOptions, callOptions) {
    // set up authorized method access
    var queryArguments = {
      method: method_name,
      format: "json",
      api_key: flickrOptions.key
    };
    // set up bindings for method-specific args
    Object.keys(callOptions).forEach(function(key) {
      queryArguments[key] = callOptions[key];
    });
    return queryArguments;
  };
Utils.queryFlickr = function (queryArguments, flickrOptions, processResult) {
    var protocol = (window.location.protocol.indexOf("http") === -1 ? "http:" : ""),
        url = "//api.flickr.com/services/rest/",
        queryString = this.formQueryString(queryArguments),
        flickrURL = protocol + url + "?" + queryString;

    var xhr = new XMLHttpRequest();
    xhr.open("GET", flickrURL, true);
    xhr.onreadystatechange = function() {
      if(xhr.readyState === 4) {
        if(xhr.status == 200) {
          var error = false,
              body = xhr.responseText;

          if(!body) {
            error = "HTTP Error " + response.statusCode + " (" + statusCodes[response.statusCode] + ")";
            return processResult(error);
          }

          if(!error) {
            try {
              body = body.replace(/^jsonFlickrApi\(/,'').replace(/\}\)$/,'}');
              body = JSON.parse(body);
              if(body.stat !== "ok") {
                return processResult(new Error(body.message));
              }
            } catch (e) {
              return processResult("could not parse body as JSON");
            }
          }

          processResult(error, body);
        }
      }
    };
    xhr.send(null);
  };
 Utils.errors = {
    "96": {
        "code": 96,
        "message": "Invalid signature",
        "_content": "The passed signature was invalid."
    },
    "97": {
        "code": 97,
        "message": "Missing signature",
        "_content": "The call required signing but no signature was sent."
    },
    "98": {
        "code": 98,
        "message": "Login failed / Invalid auth token",
        "_content": "The login details or auth token passed were invalid."
    },
    "99": {
        "code": 99,
        "message": "User not logged in / Insufficient permissions",
        "_content": "The method requires user authentication but the user was not logged in, or the authenticated method call did not have the required permissions."
    },
    "100": {
        "code": 100,
        "message": "Invalid API Key",
        "_content": "The API key passed was not valid or has expired."
    },
    "105": {
        "code": 105,
        "message": "Service currently unavailable",
        "_content": "The requested service is temporarily unavailable."
    },
    "108": {
        "code": "108",
        "message": "Invalid frob",
        "_content": "The specified frob does not exist or has already been used."
    },
    "111": {
        "code": 111,
        "message": "Format \"xxx\" not found",
        "_content": "The requested response format was not found."
    },
    "112": {
        "code": 112,
        "message": "Method \"xxx\" not found",
        "_content": "The requested method was not found."
    },
    "114": {
        "code": 114,
        "message": "Invalid SOAP envelope",
        "_content": "The SOAP envelope send in the request could not be parsed."
    },
    "115": {
        "code": 115,
        "message": "Invalid XML-RPC Method Call",
        "_content": "The XML-RPC request document could not be parsed."
    },
    "116": {
        "code": 116,
        "message": "Bad URL found",
        "_content": "One or more arguments contained a URL that has been used for abuse on Flickr."
    }
};
 var Flickr = function (flickrOptions) { this.bindOptions(flickrOptions); };
 Flickr.prototype = {
    "activity": {},
    "auth": {
        "oauth": {}
    },
    "blogs": {},
    "cameras": {},
    "collections": {},
    "commons": {},
    "contacts": {},
    "favorites": {},
    "galleries": {},
    "groups": {
        "discuss": {
            "replies": {},
            "topics": {}
        },
        "members": {},
        "pools": {}
    },
    "interestingness": {},
    "machinetags": {},
    "panda": {},
    "people": {},
    "photos": {
        "comments": {},
        "geo": {},
        "licenses": {},
        "notes": {},
        "people": {},
        "suggestions": {},
        "transform": {},
        "upload": {}
    },
    "photosets": {
        "comments": {}
    },
    "places": {},
    "prefs": {},
    "push": {},
    "reflection": {},
    "stats": {},
    "tags": {},
    "test": {},
    "urls": {}
}
 Flickr.prototype.bindOptions = function (flickrOptions) {
      this.flickrOptions = flickrOptions;
      (function bindOptions(obj, props) {
        Object.keys(props).forEach(function(key) {
          if (typeof obj[key] === "object") {
            bindOptions(obj[key], props[key]);
            obj[key].flickrOptions = flickrOptions;
          }
        });
      }(this, Flickr.prototype));
    };
Flickr.prototype.activity.userComments = (function(Utils) {
  var method_name = "flickr.activity.userComments";
  var required = [];
  var optional = [
  {
    "name": "per_page",
    "_content": "Number of items to return per page. If this argument is omitted, it defaults to 10. The maximum allowed value is 50."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.activity.userPhotos = (function(Utils) {
  var method_name = "flickr.activity.userPhotos";
  var required = [];
  var optional = [
  {
    "name": "timeframe",
    "_content": "The timeframe in which to return updates for. This can be specified in days (<code>'2d'</code>) or hours (<code>'4h'</code>). The default behavoir is to return changes since the beginning of the previous user session."
  },
  {
    "name": "per_page",
    "_content": "Number of items to return per page. If this argument is omitted, it defaults to 10. The maximum allowed value is 50."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.auth.checkToken = (function(Utils) {
  var method_name = "flickr.auth.checkToken";
  var required = [
  {
    "name": "auth_token",
    "_content": "The authentication token to check."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.auth.getFrob = (function(Utils) {
  var method_name = "flickr.auth.getFrob";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.auth.getFullToken = (function(Utils) {
  var method_name = "flickr.auth.getFullToken";
  var required = [
  {
    "name": "mini_token",
    "_content": "The mini-token typed in by a user. It should be 9 digits long. It may optionally contain dashes."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Mini-token not found",
    "_content": "The passed mini-token was not valid."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.auth.getToken = (function(Utils) {
  var method_name = "flickr.auth.getToken";
  var required = [
  {
    "name": "frob",
    "_content": "The frob to check."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.auth.oauth.checkToken = (function(Utils) {
  var method_name = "flickr.auth.oauth.checkToken";
  var required = [
  {
    "name": "oauth_token",
    "_content": "The OAuth authentication token to check."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.auth.oauth.getAccessToken = (function(Utils) {
  var method_name = "flickr.auth.oauth.getAccessToken";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.blogs.getList = (function(Utils) {
  var method_name = "flickr.blogs.getList";
  var required = [];
  var optional = [
  {
    "name": "service",
    "_content": "Optionally only return blogs for a given service id.  You can get a list of from <a href=\"/services/api/flickr.blogs.getServices.html\">flickr.blogs.getServices()</a>."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.blogs.getServices = (function(Utils) {
  var method_name = "flickr.blogs.getServices";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.blogs.postPhoto = (function(Utils) {
  var method_name = "flickr.blogs.postPhoto";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to blog"
  },
  {
    "name": "title",
    "_content": "The blog post title"
  },
  {
    "name": "description",
    "_content": "The blog post body"
  }
];
  var optional = [
  {
    "name": "blog_id",
    "_content": "The id of the blog to post to."
  },
  {
    "name": "blog_password",
    "_content": "The password for the blog (used when the blog does not have a stored password)."
  },
  {
    "name": "service",
    "_content": "A Flickr supported blogging service.  Instead of passing a blog id you can pass a service id and we'll post to the first blog of that service we find."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Blog not found",
    "_content": "The blog id was not the id of a blog belonging to the calling user"
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id was not the id of a public photo"
  },
  {
    "code": "3",
    "message": "Password needed",
    "_content": "A password is not stored for the blog and one was not passed with the request"
  },
  {
    "code": "4",
    "message": "Blog post failed",
    "_content": "The blog posting failed (a blogging API failure of some sort)"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.cameras.getBrandModels = (function(Utils) {
  var method_name = "flickr.cameras.getBrandModels";
  var required = [
  {
    "name": "brand",
    "_content": "The ID of the requested brand (as returned from flickr.cameras.getBrands)."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Brand not found",
    "_content": "Unable to find the given brand ID."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.cameras.getBrands = (function(Utils) {
  var method_name = "flickr.cameras.getBrands";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.collections.getInfo = (function(Utils) {
  var method_name = "flickr.collections.getInfo";
  var required = [
  {
    "name": "collection_id",
    "_content": "The ID of the collection to fetch information for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Collection not found",
    "_content": "The requested collection could not be found or is not visible to the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.collections.getTree = (function(Utils) {
  var method_name = "flickr.collections.getTree";
  var required = [];
  var optional = [
  {
    "name": "collection_id",
    "_content": "The ID of the collection to fetch a tree for, or zero to fetch the root collection. Defaults to zero."
  },
  {
    "name": "user_id",
    "_content": "The ID of the account to fetch the collection tree for. Deafults to the calling user."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The specified user could not be found."
  },
  {
    "code": "2",
    "message": "Collection not found",
    "_content": "The specified collection does not exist."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.commons.getInstitutions = (function(Utils) {
  var method_name = "flickr.commons.getInstitutions";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.contacts.getList = (function(Utils) {
  var method_name = "flickr.contacts.getList";
  var required = [];
  var optional = [
  {
    "name": "filter",
    "_content": "An optional filter of the results. The following values are valid:<br />\r\n&nbsp;\r\n<dl>\r\n\t<dt><b><code>friends</code></b></dt>\r\n\t<dl>Only contacts who are friends (and not family)</dl>\r\n\r\n\t<dt><b><code>family</code></b></dt>\r\n\t<dl>Only contacts who are family (and not friends)</dl>\r\n\r\n\t<dt><b><code>both</code></b></dt>\r\n\t<dl>Only contacts who are both friends and family</dl>\r\n\r\n\t<dt><b><code>neither</code></b></dt>\r\n\t<dl>Only contacts who are neither friends nor family</dl>\r\n</dl>"
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  },
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 1000. The maximum allowed value is 1000."
  },
  {
    "name": "sort",
    "_content": "The order in which to sort the returned contacts. Defaults to name. The possible values are: name and time."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Invalid sort parameter.",
    "_content": "The possible values are: name and time."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.contacts.getListRecentlyUploaded = (function(Utils) {
  var method_name = "flickr.contacts.getListRecentlyUploaded";
  var required = [];
  var optional = [
  {
    "name": "date_lastupload",
    "_content": "Limits the resultset to contacts that have uploaded photos since this date. The date should be in the form of a Unix timestamp.\r\n\r\nThe default offset is (1) hour and the maximum (24) hours. "
  },
  {
    "name": "filter",
    "_content": "Limit the result set to all contacts or only those who are friends or family. Valid options are:\r\n\r\n<ul>\r\n<li><strong>ff</strong> friends and family</li>\r\n<li><strong>all</strong> all your contacts</li>\r\n</ul>\r\nDefault value is \"all\"."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.contacts.getPublicList = (function(Utils) {
  var method_name = "flickr.contacts.getPublicList";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the contact list for."
  }
];
  var optional = [
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  },
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 1000. The maximum allowed value is 1000."
  },
  {
    "name": "show_more",
    "_content": "Include additional information for each contact, such as realname, is_friend, is_family, path_alias and location."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The specified user NSID was not a valid user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.contacts.getTaggingSuggestions = (function(Utils) {
  var method_name = "flickr.contacts.getTaggingSuggestions";
  var required = [];
  var optional = [
  {
    "name": "include_self",
    "_content": "Return calling user in the list of suggestions. Default: true."
  },
  {
    "name": "include_address_book",
    "_content": "Include suggestions from the user's address book. Default: false"
  },
  {
    "name": "per_page",
    "_content": "Number of contacts to return per page. If this argument is omitted, all contacts will be returned."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.favorites.add = (function(Utils) {
  var method_name = "flickr.favorites.add";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to add to the user's favorites."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
  },
  {
    "code": "2",
    "message": "Photo is owned by you",
    "_content": "The photo belongs to the user and so cannot be added to their favorites."
  },
  {
    "code": "3",
    "message": "Photo is already in favorites",
    "_content": "The photo is already in the user's list of favorites."
  },
  {
    "code": "4",
    "message": "User cannot see photo",
    "_content": "The user does not have permission to add the photo to their favorites."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.favorites.getContext = (function(Utils) {
  var method_name = "flickr.favorites.getContext";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to fetch the context for."
  },
  {
    "name": "user_id",
    "_content": "The user who counts the photo as a favorite."
  }
];
  var optional = [
  {
    "name": "num_prev",
    "_content": ""
  },
  {
    "name": "num_next",
    "_content": ""
  },
  {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id, or was the id of a photo that the calling user does not have permission to view."
  },
  {
    "code": "2",
    "message": "User not found",
    "_content": "The specified user was not found."
  },
  {
    "code": "3",
    "message": "Photo not a favorite",
    "_content": "The specified photo is not a favorite of the specified user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.favorites.getList = (function(Utils) {
  var method_name = "flickr.favorites.getList";
  var required = [];
  var optional = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the favorites list for. If this argument is omitted, the favorites list for the calling user is returned."
  },
  {
    "name": "jump_to",
    "_content": ""
  },
  {
    "name": "min_fave_date",
    "_content": "Minimum date that a photo was favorited on. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_fave_date",
    "_content": "Maximum date that a photo was favorited on. The date should be in the form of a unix timestamp."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The specified user NSID was not a valid flickr user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.favorites.getPublicList = (function(Utils) {
  var method_name = "flickr.favorites.getPublicList";
  var required = [
  {
    "name": "user_id",
    "_content": "The user to fetch the favorites list for."
  }
];
  var optional = [
  {
    "name": "jump_to",
    "_content": ""
  },
  {
    "name": "min_fave_date",
    "_content": "Minimum date that a photo was favorited on. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_fave_date",
    "_content": "Maximum date that a photo was favorited on. The date should be in the form of a unix timestamp."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The specified user NSID was not a valid flickr user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.favorites.remove = (function(Utils) {
  var method_name = "flickr.favorites.remove";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to remove from the user's favorites."
  }
];
  var optional = [
  {
    "name": "user_id",
    "_content": "NSID of the user whose favorites the photo should be removed from. This only works if the calling user owns the photo."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not in favorites",
    "_content": "The photo id passed was not in the user's favorites."
  },
  {
    "code": "2",
    "message": "Cannot remove photo from that user's favorites",
    "_content": "user_id was passed as an argument, but photo_id is not owned by the authenticated user."
  },
  {
    "code": "3",
    "message": "User not found",
    "_content": "Invalid user_id argument."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.addPhoto = (function(Utils) {
  var method_name = "flickr.galleries.addPhoto";
  var required = [
  {
    "name": "gallery_id",
    "_content": "The ID of the gallery to add a photo to.  Note: this is the compound ID returned in methods like <a href=\"/services/api/flickr.galleries.getList.html\">flickr.galleries.getList</a>, and <a href=\"/services/api/flickr.galleries.getListForPhoto.html\">flickr.galleries.getListForPhoto</a>."
  },
  {
    "name": "photo_id",
    "_content": "The photo ID to add to the gallery"
  }
];
  var optional = [
  {
    "name": "comment",
    "_content": "A short comment or story to accompany the photo."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameters was not included with your API call."
  },
  {
    "code": "2",
    "message": "Invalid gallery ID",
    "_content": "That gallery could not be found."
  },
  {
    "code": "3",
    "message": "Invalid photo ID",
    "_content": "The requested photo could not be found."
  },
  {
    "code": "4",
    "message": "Invalid comment",
    "_content": "The comment body could not be validated."
  },
  {
    "code": "5",
    "message": "Failed to add photo",
    "_content": "Unable to add the photo to the gallery."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.create = (function(Utils) {
  var method_name = "flickr.galleries.create";
  var required = [
  {
    "name": "title",
    "_content": "The name of the gallery"
  },
  {
    "name": "description",
    "_content": "A short description for the gallery"
  }
];
  var optional = [
  {
    "name": "primary_photo_id",
    "_content": "The first photo to add to your gallery"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more of the required parameters was missing from your API call."
  },
  {
    "code": "2",
    "message": "Invalid title or description",
    "_content": "The title or the description could not be validated."
  },
  {
    "code": "3",
    "message": "Failed to add gallery",
    "_content": "There was a problem creating the gallery."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.editMeta = (function(Utils) {
  var method_name = "flickr.galleries.editMeta";
  var required = [
  {
    "name": "gallery_id",
    "_content": "The gallery ID to update."
  },
  {
    "name": "title",
    "_content": "The new title for the gallery."
  }
];
  var optional = [
  {
    "name": "description",
    "_content": "The new description for the gallery."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameters was missing from your request."
  },
  {
    "code": "2",
    "message": "Invalid title or description",
    "_content": "The title or description arguments could not be validated."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.editPhoto = (function(Utils) {
  var method_name = "flickr.galleries.editPhoto";
  var required = [
  {
    "name": "gallery_id",
    "_content": "The ID of the gallery to add a photo to. Note: this is the compound ID returned in methods like flickr.galleries.getList, and flickr.galleries.getListForPhoto."
  },
  {
    "name": "photo_id",
    "_content": "The photo ID to add to the gallery."
  },
  {
    "name": "comment",
    "_content": "The updated comment the photo."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Invalid gallery ID",
    "_content": "That gallery could not be found."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.editPhotos = (function(Utils) {
  var method_name = "flickr.galleries.editPhotos";
  var required = [
  {
    "name": "gallery_id",
    "_content": "The id of the gallery to modify. The gallery must belong to the calling user."
  },
  {
    "name": "primary_photo_id",
    "_content": "The id of the photo to use as the 'primary' photo for the gallery. This id must also be passed along in photo_ids list argument."
  },
  {
    "name": "photo_ids",
    "_content": "A comma-delimited list of photo ids to include in the gallery. They will appear in the set in the order sent. This list must contain the primary photo id. This list of photos replaces the existing list."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.getInfo = (function(Utils) {
  var method_name = "flickr.galleries.getInfo";
  var required = [
  {
    "name": "gallery_id",
    "_content": "The gallery ID you are requesting information for."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.getList = (function(Utils) {
  var method_name = "flickr.galleries.getList";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to get a galleries list for. If none is specified, the calling user is assumed."
  }
];
  var optional = [
  {
    "name": "per_page",
    "_content": "Number of galleries to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.getListForPhoto = (function(Utils) {
  var method_name = "flickr.galleries.getListForPhoto";
  var required = [
  {
    "name": "photo_id",
    "_content": "The ID of the photo to fetch a list of galleries for."
  }
];
  var optional = [
  {
    "name": "per_page",
    "_content": "Number of galleries to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.galleries.getPhotos = (function(Utils) {
  var method_name = "flickr.galleries.getPhotos";
  var required = [
  {
    "name": "gallery_id",
    "_content": "The ID of the gallery of photos to return"
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.browse = (function(Utils) {
  var method_name = "flickr.groups.browse";
  var required = [];
  var optional = [
  {
    "name": "cat_id",
    "_content": "The category id to fetch a list of groups and sub-categories for. If not specified, it defaults to zero, the root of the category tree."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Category not found",
    "_content": "The value passed for cat_id was not a valid category id."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.discuss.replies.add = (function(Utils) {
  var method_name = "flickr.groups.discuss.replies.add";
  var required = [
  {
    "name": "topic_id",
    "_content": "The ID of the topic to post a comment to."
  },
  {
    "name": "message",
    "_content": "The message to post to the topic."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid."
  },
  {
    "code": "2",
    "message": "Cannot post to group",
    "_content": "Either this account is not a member of the group, or discussion in this group is disabled.\r\n"
  },
  {
    "code": "3",
    "message": "Missing required arguments",
    "_content": "The topic_id and message are required."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.discuss.replies.delete = (function(Utils) {
  var method_name = "flickr.groups.discuss.replies.delete";
  var required = [
  {
    "name": "topic_id",
    "_content": "The ID of the topic the post is in."
  },
  {
    "name": "reply_id",
    "_content": "The ID of the reply to delete."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid."
  },
  {
    "code": "2",
    "message": "Reply not found",
    "_content": "The reply_id is invalid."
  },
  {
    "code": "3",
    "message": "Cannot delete reply",
    "_content": "Replies can only be edited by their owner."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.discuss.replies.edit = (function(Utils) {
  var method_name = "flickr.groups.discuss.replies.edit";
  var required = [
  {
    "name": "topic_id",
    "_content": "The ID of the topic the post is in."
  },
  {
    "name": "reply_id",
    "_content": "The ID of the reply post to edit."
  },
  {
    "name": "message",
    "_content": "The message to edit the post with."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid"
  },
  {
    "code": "2",
    "message": "Reply not found",
    "_content": "The reply_id is invalid."
  },
  {
    "code": "3",
    "message": "Missing required arguments",
    "_content": "The topic_id and reply_id are required."
  },
  {
    "code": "4",
    "message": "Cannot edit reply",
    "_content": "Replies can only be edited by their owner."
  },
  {
    "code": "5",
    "message": "Cannot post to group",
    "_content": "Either this account is not a member of the group, or discussion in this group is disabled."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.discuss.replies.getInfo = (function(Utils) {
  var method_name = "flickr.groups.discuss.replies.getInfo";
  var required = [
  {
    "name": "topic_id",
    "_content": "The ID of the topic the post is in."
  },
  {
    "name": "reply_id",
    "_content": "The ID of the reply to fetch."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid"
  },
  {
    "code": "2",
    "message": "Reply not found",
    "_content": "The reply_id is invalid"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.discuss.replies.getList = (function(Utils) {
  var method_name = "flickr.groups.discuss.replies.getList";
  var required = [
  {
    "name": "topic_id",
    "_content": "The ID of the topic to fetch replies for."
  },
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  }
];
  var optional = [
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.discuss.topics.add = (function(Utils) {
  var method_name = "flickr.groups.discuss.topics.add";
  var required = [
  {
    "name": "group_id",
    "_content": "The NSID of the group to add a topic to.\r\n"
  },
  {
    "name": "subject",
    "_content": "The topic subject."
  },
  {
    "name": "message",
    "_content": "The topic message."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Group not found",
    "_content": "The group by that ID does not exist\r\n"
  },
  {
    "code": "2",
    "message": "Cannot post to group",
    "_content": "Either this account is not a member of the group, or discussion in this group is disabled."
  },
  {
    "code": "3",
    "message": "Message is too long",
    "_content": "The post message is too long."
  },
  {
    "code": "4",
    "message": "Missing required arguments",
    "_content": "Subject and message are required."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.discuss.topics.getInfo = (function(Utils) {
  var method_name = "flickr.groups.discuss.topics.getInfo";
  var required = [
  {
    "name": "topic_id",
    "_content": "The ID for the topic to edit."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Topic not found",
    "_content": "The topic_id is invalid"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.discuss.topics.getList = (function(Utils) {
  var method_name = "flickr.groups.discuss.topics.getList";
  var required = [
  {
    "name": "group_id",
    "_content": "The NSID of the group to fetch information for."
  }
];
  var optional = [
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Group not found",
    "_content": "The group_id is invalid"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.getInfo = (function(Utils) {
  var method_name = "flickr.groups.getInfo";
  var required = [
  {
    "name": "group_id",
    "_content": "The NSID of the group to fetch information for."
  }
];
  var optional = [
  {
    "name": "lang",
    "_content": "The language of the group name and description to fetch.  If the language is not found, the primary language of the group will be returned.\r\n\r\nValid values are the same as <a href=\"/services/feeds/\">in feeds</a>."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Group not found",
    "_content": "The group NSID passed did not refer to a group that the calling user can see - either an invalid group is or a group that can't be seen by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.join = (function(Utils) {
  var method_name = "flickr.groups.join";
  var required = [
  {
    "name": "group_id",
    "_content": "The NSID of the Group in question"
  }
];
  var optional = [
  {
    "name": "accept_rules",
    "_content": "If the group has rules, they must be displayed to the user prior to joining. Passing a true value for this argument specifies that the application has displayed the group rules to the user, and that the user has agreed to them. (See flickr.groups.getInfo)."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "The group_id doesn't exist"
  },
  {
    "code": "2",
    "message": "Group does not exist",
    "_content": "The Group does not exist"
  },
  {
    "code": "3",
    "message": "Group not availabie to the account",
    "_content": "The authed account does not have permission to view/join the group."
  },
  {
    "code": "4",
    "message": "Account is already in that group",
    "_content": "The authed account has previously joined this group"
  },
  {
    "code": "5",
    "message": "Membership in group is by invitation only.",
    "_content": "Use flickr.groups.joinRequest to contact the administrations for an invitation."
  },
  {
    "code": "6",
    "message": "User must accept the group rules before joining",
    "_content": "The user must read and accept the rules before joining. Please see the accept_rules argument for this method."
  },
  {
    "code": "10",
    "message": "Account in maximum number of groups",
    "_content": "The account is a member of the maximum number of groups."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.joinRequest = (function(Utils) {
  var method_name = "flickr.groups.joinRequest";
  var required = [
  {
    "name": "group_id",
    "_content": "The NSID of the group to request joining."
  },
  {
    "name": "message",
    "_content": "Message to the administrators."
  },
  {
    "name": "accept_rules",
    "_content": "If the group has rules, they must be displayed to the user prior to joining. Passing a true value for this argument specifies that the application has displayed the group rules to the user, and that the user has agreed to them. (See flickr.groups.getInfo)."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "The group_id or message argument are missing."
  },
  {
    "code": "2",
    "message": "Group does not exist",
    "_content": "The Group does not exist"
  },
  {
    "code": "3",
    "message": "Group not available to the account",
    "_content": "The authed account does not have permission to view/join the group."
  },
  {
    "code": "4",
    "message": "Account is already in that group",
    "_content": "The authed account has previously joined this group"
  },
  {
    "code": "5",
    "message": "Group is public and open",
    "_content": "The group does not require an invitation to join, please use flickr.groups.join."
  },
  {
    "code": "6",
    "message": "User must accept the group rules before joining",
    "_content": "The user must read and accept the rules before joining. Please see the accept_rules argument for this method."
  },
  {
    "code": "7",
    "message": "User has already requested to join that group",
    "_content": "A request has already been sent and is pending approval."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.leave = (function(Utils) {
  var method_name = "flickr.groups.leave";
  var required = [
  {
    "name": "group_id",
    "_content": "The NSID of the Group to leave"
  }
];
  var optional = [
  {
    "name": "delete_photos",
    "_content": "Delete all photos by this user from the group"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "The group_id doesn't exist"
  },
  {
    "code": "2",
    "message": "Group does not exist",
    "_content": "The group by that ID does not exist"
  },
  {
    "code": "3",
    "message": "Account is not in that group",
    "_content": "The user is not a member of the group that was specified"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.members.getList = (function(Utils) {
  var method_name = "flickr.groups.members.getList";
  var required = [
  {
    "name": "group_id",
    "_content": "Return a list of members for this group.  The group must be viewable by the Flickr member on whose behalf the API call is made."
  }
];
  var optional = [
  {
    "name": "membertypes",
    "_content": "Comma separated list of member types\r\n<ul>\r\n<li>2: member</li>\r\n<li>3: moderator</li>\r\n<li>4: admin</li>\r\n</ul>\r\nBy default returns all types.  (Returning super rare member type \"1: narwhal\" isn't supported by this API method)"
  },
  {
    "name": "per_page",
    "_content": "Number of members to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Group not found",
    "_content": ""
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.pools.add = (function(Utils) {
  var method_name = "flickr.groups.pools.add";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to add to the group pool. The photo must belong to the calling user."
  },
  {
    "name": "group_id",
    "_content": "The NSID of the group who's pool the photo is to be added to."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a photo owned by the caling user."
  },
  {
    "code": "2",
    "message": "Group not found",
    "_content": "The group id passed was not a valid id for a group the user is a member of."
  },
  {
    "code": "3",
    "message": "Photo already in pool",
    "_content": "The specified photo is already in the pool for the specified group."
  },
  {
    "code": "4",
    "message": "Photo in maximum number of pools",
    "_content": "The photo has already been added to the maximum allowed number of pools."
  },
  {
    "code": "5",
    "message": "Photo limit reached",
    "_content": "The user has already added the maximum amount of allowed photos to the pool."
  },
  {
    "code": "6",
    "message": "Your Photo has been added to the Pending Queue for this Pool",
    "_content": "The pool is moderated, and the photo has been added to the Pending Queue. If it is approved by a group administrator, it will be added to the pool."
  },
  {
    "code": "7",
    "message": "Your Photo has already been added to the Pending Queue for this Pool",
    "_content": "The pool is moderated, and the photo has already been added to the Pending Queue."
  },
  {
    "code": "8",
    "message": "Content not allowed",
    "_content": "The content has been disallowed from the pool by the group admin(s)."
  },
  {
    "code": "10",
    "message": "Maximum number of photos in Group Pool",
    "_content": "A group pool has reached the upper limit for the number of photos allowed."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.pools.getContext = (function(Utils) {
  var method_name = "flickr.groups.pools.getContext";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to fetch the context for."
  },
  {
    "name": "group_id",
    "_content": "The nsid of the group who's pool to fetch the photo's context for."
  }
];
  var optional = [
  {
    "name": "num_prev",
    "_content": ""
  },
  {
    "name": "num_next",
    "_content": ""
  },
  {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id, or was the id of a photo that the calling user does not have permission to view."
  },
  {
    "code": "2",
    "message": "Photo not in pool",
    "_content": "The specified photo is not in the specified group's pool."
  },
  {
    "code": "3",
    "message": "Group not found",
    "_content": "The specified group nsid was not a valid group or the caller does not have permission to view the group's pool."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.pools.getGroups = (function(Utils) {
  var method_name = "flickr.groups.pools.getGroups";
  var required = [];
  var optional = [
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  },
  {
    "name": "per_page",
    "_content": "Number of groups to return per page. If this argument is omitted, it defaults to 400. The maximum allowed value is 400."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.pools.getPhotos = (function(Utils) {
  var method_name = "flickr.groups.pools.getPhotos";
  var required = [
  {
    "name": "group_id",
    "_content": "The id of the group who's pool you which to get the photo list for."
  }
];
  var optional = [
  {
    "name": "tags",
    "_content": "A tag to filter the pool with. At the moment only one tag at a time is supported."
  },
  {
    "name": "user_id",
    "_content": "The nsid of a user. Specifiying this parameter will retrieve for you only those photos that the user has contributed to the group pool."
  },
  {
    "name": "safe_search",
    "_content": "Safe search setting:\r\n<ul>\r\n<li>1 for safe.</li>\r\n<li>2 for moderate.</li>\r\n<li>3 for restricted.</li>\r\n</ul>"
  },
  {
    "name": "jump_to",
    "_content": ""
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Group not found",
    "_content": "The group id passed was not a valid group id."
  },
  {
    "code": "2",
    "message": "You don't have permission to view this pool",
    "_content": "The logged in user (if any) does not have permission to view the pool for this group."
  },
  {
    "code": "3",
    "message": "Unknown user",
    "_content": "The user specified by user_id does not exist."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.pools.remove = (function(Utils) {
  var method_name = "flickr.groups.pools.remove";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to remove from the group pool. The photo must either be owned by the calling user of the calling user must be an administrator of the group."
  },
  {
    "name": "group_id",
    "_content": "The NSID of the group who's pool the photo is to removed from."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Group not found",
    "_content": "The group_id passed did not refer to a valid group."
  },
  {
    "code": "2",
    "message": "Photo not in pool",
    "_content": "The photo_id passed was not a valid id of a photo in the group pool."
  },
  {
    "code": "3",
    "message": "Insufficient permission to remove photo",
    "_content": "The calling user doesn't own the photo and is not an administrator of the group, so may not remove the photo from the pool."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.groups.search = (function(Utils) {
  var method_name = "flickr.groups.search";
  var required = [
  {
    "name": "text",
    "_content": "The text to search for."
  }
];
  var optional = [
  {
    "name": "per_page",
    "_content": "Number of groups to return per page. If this argument is ommited, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is ommited, it defaults to 1. "
  }
];
  var errors = [
  {
    "code": "1",
    "message": "No text passed",
    "_content": "The required text argument was ommited."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.interestingness.getList = (function(Utils) {
  var method_name = "flickr.interestingness.getList";
  var required = [];
  var optional = [
  {
    "name": "date",
    "_content": "A specific date, formatted as YYYY-MM-DD, to return interesting photos for."
  },
  {
    "name": "use_panda",
    "_content": "Always ask the pandas for interesting photos. This is a temporary argument to allow developers to update their code."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Not a valid date string.",
    "_content": "The date string passed did not validate. All dates must be formatted : YYYY-MM-DD"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.machinetags.getNamespaces = (function(Utils) {
  var method_name = "flickr.machinetags.getNamespaces";
  var required = [];
  var optional = [
  {
    "name": "predicate",
    "_content": "Limit the list of namespaces returned to those that have the following predicate."
  },
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Not a valid predicate.",
    "_content": "Missing or invalid predicate argument."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.machinetags.getPairs = (function(Utils) {
  var method_name = "flickr.machinetags.getPairs";
  var required = [];
  var optional = [
  {
    "name": "namespace",
    "_content": "Limit the list of pairs returned to those that have the following namespace."
  },
  {
    "name": "predicate",
    "_content": "Limit the list of pairs returned to those that have the following predicate."
  },
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Not a valid namespace",
    "_content": "Missing or invalid namespace argument."
  },
  {
    "code": "2",
    "message": "Not a valid predicate",
    "_content": "Missing or invalid predicate argument."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.machinetags.getPredicates = (function(Utils) {
  var method_name = "flickr.machinetags.getPredicates";
  var required = [];
  var optional = [
  {
    "name": "namespace",
    "_content": "Limit the list of predicates returned to those that have the following namespace."
  },
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Not a valid namespace",
    "_content": "Missing or invalid namespace argument."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.machinetags.getRecentValues = (function(Utils) {
  var method_name = "flickr.machinetags.getRecentValues";
  var required = [];
  var optional = [
  {
    "name": "namespace",
    "_content": "A namespace that all values should be restricted to."
  },
  {
    "name": "predicate",
    "_content": "A predicate that all values should be restricted to."
  },
  {
    "name": "added_since",
    "_content": "Only return machine tags values that have been added since this timestamp, in epoch seconds.  "
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.machinetags.getValues = (function(Utils) {
  var method_name = "flickr.machinetags.getValues";
  var required = [
  {
    "name": "namespace",
    "_content": "The namespace that all values should be restricted to."
  },
  {
    "name": "predicate",
    "_content": "The predicate that all values should be restricted to."
  }
];
  var optional = [
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 100. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  },
  {
    "name": "usage",
    "_content": "Minimum usage count."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Not a valid namespace",
    "_content": "Missing or invalid namespace argument."
  },
  {
    "code": "2",
    "message": "Not a valid predicate",
    "_content": "Missing or invalid predicate argument."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.panda.getList = (function(Utils) {
  var method_name = "flickr.panda.getList";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.panda.getPhotos = (function(Utils) {
  var method_name = "flickr.panda.getPhotos";
  var required = [
  {
    "name": "panda_name",
    "_content": "The name of the panda to ask for photos from. There are currently three pandas named:<br /><br />\r\n\r\n<ul>\r\n<li><strong><a href=\"http://flickr.com/photos/ucumari/126073203/\">ling ling</a></strong></li>\r\n<li><strong><a href=\"http://flickr.com/photos/lynnehicks/136407353\">hsing hsing</a></strong></li>\r\n<li><strong><a href=\"http://flickr.com/photos/perfectpandas/1597067182/\">wang wang</a></strong></li>\r\n</ul>\r\n\r\n<br />You can fetch a list of all the current pandas using the <a href=\"/services/api/flickr.panda.getList.html\">flickr.panda.getList</a> API method."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing.",
    "_content": "One or more required parameters was not included with your request."
  },
  {
    "code": "2",
    "message": "Unknown panda",
    "_content": "You requested a panda we haven't met yet."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.findByEmail = (function(Utils) {
  var method_name = "flickr.people.findByEmail";
  var required = [
  {
    "name": "find_email",
    "_content": "The email address of the user to find  (may be primary or secondary)."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "No user with the supplied email address was found."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.findByUsername = (function(Utils) {
  var method_name = "flickr.people.findByUsername";
  var required = [
  {
    "name": "username",
    "_content": "The username of the user to lookup."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "No user with the supplied username was found."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.getGroups = (function(Utils) {
  var method_name = "flickr.people.getGroups";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch groups for."
  }
];
  var optional = [
  {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: <code>privacy</code>, <code>throttle</code>, <code>restrictions</code>"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The user id passed did not match a Flickr user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.getInfo = (function(Utils) {
  var method_name = "flickr.people.getInfo";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch information about."
  },
  {
    "name": "url",
    "_content": "As an alternative to user_id, load a member based on URL, either photos or people URL."
  }
];
  var optional = [
  {
    "name": "fb_connected",
    "_content": "If set to 1, it checks if the user is connected to Facebook and returns that information back."
  },
  {
    "name": "storage",
    "_content": "If set to 1, it returns the storage information about the user, like the storage used and storage available."
  },
  {
    "name": "datecreate",
    "_content": "If set to 1, it returns the timestamp of the user's account creation, in MySQL DATETIME format."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The user id passed did not match a Flickr user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.getLimits = (function(Utils) {
  var method_name = "flickr.people.getLimits";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.getPhotos = (function(Utils) {
  var method_name = "flickr.people.getPhotos";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user who's photos to return. A value of \"me\" will return the calling user's photos."
  }
];
  var optional = [
  {
    "name": "safe_search",
    "_content": "Safe search setting:\r\n\r\n<ul>\r\n<li>1 for safe.</li>\r\n<li>2 for moderate.</li>\r\n<li>3 for restricted.</li>\r\n</ul>\r\n\r\n(Please note: Un-authed calls can only see Safe content.)"
  },
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  },
  {
    "name": "content_type",
    "_content": "Content Type setting:\r\n<ul>\r\n<li>1 for photos only.</li>\r\n<li>2 for screenshots only.</li>\r\n<li>3 for 'other' only.</li>\r\n<li>4 for photos and screenshots.</li>\r\n<li>5 for screenshots and 'other'.</li>\r\n<li>6 for photos and 'other'.</li>\r\n<li>7 for photos, screenshots, and 'other' (all).</li>\r\n</ul>"
  },
  {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. This only applies when making an authenticated call to view photos you own. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends & family</li>\r\n<li>5 completely private photos</li>\r\n</ul>"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required arguments missing",
    "_content": ""
  },
  {
    "code": "2",
    "message": "Unknown user",
    "_content": "A user_id was passed which did not match a valid flickr user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.getPhotosOf = (function(Utils) {
  var method_name = "flickr.people.getPhotosOf";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user you want to find photos of. A value of \"me\" will search against photos of the calling user, for authenticated calls."
  }
];
  var optional = [
  {
    "name": "owner_id",
    "_content": "An NSID of a Flickr member. This will restrict the list of photos to those taken by that member."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found.",
    "_content": "A user_id was passed which did not match a valid flickr user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.getPublicGroups = (function(Utils) {
  var method_name = "flickr.people.getPublicGroups";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch groups for."
  }
];
  var optional = [
  {
    "name": "invitation_only",
    "_content": "Include public groups that require <a href=\"http://www.flickr.com/help/groups/#10\">an invitation</a> or administrator approval to join."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The user id passed did not match a Flickr user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.getPublicPhotos = (function(Utils) {
  var method_name = "flickr.people.getPublicPhotos";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user who's photos to return."
  }
];
  var optional = [
  {
    "name": "safe_search",
    "_content": "Safe search setting:\r\n\r\n<ul>\r\n<li>1 for safe.</li>\r\n<li>2 for moderate.</li>\r\n<li>3 for restricted.</li>\r\n</ul>\r\n\r\n(Please note: Un-authed calls can only see Safe content.)"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.people.getUploadStatus = (function(Utils) {
  var method_name = "flickr.people.getUploadStatus";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.addTags = (function(Utils) {
  var method_name = "flickr.photos.addTags";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to add tags to."
  },
  {
    "name": "tags",
    "_content": "The tags to add to the photo."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a photo that the calling user can add tags to. It could be an invalid id, or the user may not have permission to add tags to it."
  },
  {
    "code": "2",
    "message": "Maximum number of tags reached",
    "_content": "The maximum number of tags for the photo has been reached - no more tags can be added. If the current count is less than the maximum, but adding all of the tags for this request would go over the limit, the whole request is ignored. I.E. when you get this message, none of the requested tags have been added."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.comments.addComment = (function(Utils) {
  var method_name = "flickr.photos.comments.addComment";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to add a comment to."
  },
  {
    "name": "comment_text",
    "_content": "Text of the comment"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The photo id passed was not a valid photo id"
  },
  {
    "code": "8",
    "message": "Blank comment.",
    "_content": "Comment text can not be blank"
  },
  {
    "code": "9",
    "message": "User is posting comments too fast.",
    "_content": "The user has reached the limit for number of comments posted during a specific time period.  Wait a bit and try again."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.comments.deleteComment = (function(Utils) {
  var method_name = "flickr.photos.comments.deleteComment";
  var required = [
  {
    "name": "comment_id",
    "_content": "The id of the comment to edit."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The requested comment is against a photo which no longer exists."
  },
  {
    "code": "2",
    "message": "Comment not found.",
    "_content": "The comment id passed was not a valid comment id"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.comments.editComment = (function(Utils) {
  var method_name = "flickr.photos.comments.editComment";
  var required = [
  {
    "name": "comment_id",
    "_content": "The id of the comment to edit."
  },
  {
    "name": "comment_text",
    "_content": "Update the comment to this text."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The requested comment is against a photo which no longer exists."
  },
  {
    "code": "2",
    "message": "Comment not found.",
    "_content": "The comment id passed was not a valid comment id"
  },
  {
    "code": "8",
    "message": "Blank comment.",
    "_content": "Comment text can not be blank"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.comments.getList = (function(Utils) {
  var method_name = "flickr.photos.comments.getList";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to fetch comments for."
  }
];
  var optional = [
  {
    "name": "min_comment_date",
    "_content": "Minimum date that a a comment was added. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_comment_date",
    "_content": "Maximum date that a comment was added. The date should be in the form of a unix timestamp."
  },
  {
    "name": "page",
    "_content": ""
  },
  {
    "name": "per_page",
    "_content": ""
  },
  {
    "name": "include_faves",
    "_content": ""
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.comments.getRecentForContacts = (function(Utils) {
  var method_name = "flickr.photos.comments.getRecentForContacts";
  var required = [];
  var optional = [
  {
    "name": "date_lastcomment",
    "_content": "Limits the resultset to photos that have been commented on since this date. The date should be in the form of a Unix timestamp.<br /><br />\r\nThe default, and maximum, offset is (1) hour.\r\n\r\n\r\n"
  },
  {
    "name": "contacts_filter",
    "_content": "A comma-separated list of contact NSIDs to limit the scope of the query to."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.delete = (function(Utils) {
  var method_name = "flickr.photos.delete";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to delete."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was not the id of a photo belonging to the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.batchCorrectLocation = (function(Utils) {
  var method_name = "flickr.photos.geo.batchCorrectLocation";
  var required = [
  {
    "name": "lat",
    "_content": "The latitude of the photos to be update whose valid range is -90 to 90. Anything more than 6 decimal places will be truncated."
  },
  {
    "name": "lon",
    "_content": "The longitude of the photos to be updated whose valid range is -180 to 180. Anything more than 6 decimal places will be truncated."
  },
  {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the photos to be updated. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. Defaults to 16 if not specified."
  }
];
  var optional = [
  {
    "name": "place_id",
    "_content": "A Flickr Places ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
  },
  {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "Some or all of the required arguments were not supplied."
  },
  {
    "code": "2",
    "message": "Not a valid latitude",
    "_content": "The latitude argument failed validation."
  },
  {
    "code": "3",
    "message": "Not a valid longitude",
    "_content": "The longitude argument failed validation."
  },
  {
    "code": "4",
    "message": "Not a valid accuracy",
    "_content": "The accuracy argument failed validation."
  },
  {
    "code": "5",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) ID was passed with the API call."
  },
  {
    "code": "6",
    "message": "No photos geotagged at that location",
    "_content": "There were no geotagged photos found for the authed user at the supplied latitude, longitude and accuracy."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.correctLocation = (function(Utils) {
  var method_name = "flickr.photos.geo.correctLocation";
  var required = [
  {
    "name": "photo_id",
    "_content": "The ID of the photo whose WOE location is being corrected."
  },
  {
    "name": "foursquare_id",
    "_content": "The venue ID for a Foursquare location. (If not passed in with correction, any existing foursquare venue will be removed)."
  }
];
  var optional = [
  {
    "name": "place_id",
    "_content": "A Flickr Places ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
  },
  {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User has not configured default viewing settings for location data.",
    "_content": "Before users may assign location data to a photo they must define who, by default, may view that information. Users can edit this preference at <a href=\"http://www.flickr.com/account/geo/privacy/\">http://www.flickr.com/account/geo/privacy/</a>"
  },
  {
    "code": "2",
    "message": "Missing place ID",
    "_content": "No place ID was passed to the method"
  },
  {
    "code": "3",
    "message": "Not a valid place ID",
    "_content": "The place ID passed to the method could not be identified"
  },
  {
    "code": "4",
    "message": "Server error correcting location.",
    "_content": "There was an error trying to correct the location."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.getLocation = (function(Utils) {
  var method_name = "flickr.photos.geo.getLocation";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo you want to retrieve location data for."
  }
];
  var optional = [
  {
    "name": "extras",
    "_content": "Extra flags."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  },
  {
    "code": "2",
    "message": "Photo has no location information.",
    "_content": "The photo requested has no location data or is not viewable by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.getPerms = (function(Utils) {
  var method_name = "flickr.photos.geo.getPerms";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to get permissions for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  },
  {
    "code": "2",
    "message": "Photo has no location information",
    "_content": "The photo requested has no location data or is not viewable by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.photosForLocation = (function(Utils) {
  var method_name = "flickr.photos.geo.photosForLocation";
  var required = [
  {
    "name": "lat",
    "_content": "The latitude whose valid range is -90 to 90. Anything more than 6 decimal places will be truncated."
  },
  {
    "name": "lon",
    "_content": "The longitude whose valid range is -180 to 180. Anything more than 6 decimal places will be truncated."
  }
];
  var optional = [
  {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. Defaults to 16 if not specified."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "One or more required arguments was missing from the method call."
  },
  {
    "code": "2",
    "message": "Not a valid latitude",
    "_content": "The latitude argument failed validation."
  },
  {
    "code": "3",
    "message": "Not a valid longitude",
    "_content": "The longitude argument failed validation."
  },
  {
    "code": "4",
    "message": "Not a valid accuracy",
    "_content": "The accuracy argument failed validation."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.removeLocation = (function(Utils) {
  var method_name = "flickr.photos.geo.removeLocation";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo you want to remove location data from."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  },
  {
    "code": "2",
    "message": "Photo has no location information",
    "_content": "The specified photo has not been geotagged - there is nothing to remove."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.setContext = (function(Utils) {
  var method_name = "flickr.photos.geo.setContext";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to set context data for."
  },
  {
    "name": "context",
    "_content": "Context is a numeric value representing the photo's geotagginess beyond latitude and longitude. For example, you may wish to indicate that a photo was taken \"indoors\" or \"outdoors\". <br /><br />\r\nThe current list of context IDs is :<br /><br/>\r\n<ul>\r\n<li><strong>0</strong>, not defined.</li>\r\n<li><strong>1</strong>, indoors.</li>\r\n<li><strong>2</strong>, outdoors.</li>\r\n</ul>"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  },
  {
    "code": "2",
    "message": "Not a valid context",
    "_content": "The context ID passed to the method is invalid."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.setLocation = (function(Utils) {
  var method_name = "flickr.photos.geo.setLocation";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to set location data for."
  },
  {
    "name": "lat",
    "_content": "The latitude whose valid range is -90 to 90. Anything more than 6 decimal places will be truncated."
  },
  {
    "name": "lon",
    "_content": "The longitude whose valid range is -180 to 180. Anything more than 6 decimal places will be truncated."
  }
];
  var optional = [
  {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. Defaults to 16 if not specified."
  },
  {
    "name": "context",
    "_content": "Context is a numeric value representing the photo's geotagginess beyond latitude and longitude. For example, you may wish to indicate that a photo was taken \"indoors\" or \"outdoors\". <br /><br />\r\nThe current list of context IDs is :<br /><br/>\r\n<ul>\r\n<li><strong>0</strong>, not defined.</li>\r\n<li><strong>1</strong>, indoors.</li>\r\n<li><strong>2</strong>, outdoors.</li>\r\n</ul><br />\r\nThe default context for geotagged photos is 0, or \"not defined\"\r\n"
  },
  {
    "name": "bookmark_id",
    "_content": "Associate a geo bookmark with this photo."
  },
  {
    "name": "is_public",
    "_content": ""
  },
  {
    "name": "is_contact",
    "_content": ""
  },
  {
    "name": "is_friend",
    "_content": ""
  },
  {
    "name": "is_family",
    "_content": ""
  },
  {
    "name": "foursquare_id",
    "_content": "The venue ID for a Foursquare location."
  },
  {
    "name": "woeid",
    "_content": "A Where On Earth (WOE) ID. (If passed in, will override the default venue based on the lat/lon.)"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  },
  {
    "code": "2",
    "message": "Required arguments missing.",
    "_content": "Some or all of the required arguments were not supplied."
  },
  {
    "code": "3",
    "message": "Not a valid latitude.",
    "_content": "The latitude argument failed validation."
  },
  {
    "code": "4",
    "message": "Not a valid longitude.",
    "_content": "The longitude argument failed validation."
  },
  {
    "code": "5",
    "message": "Not a valid accuracy.",
    "_content": "The accuracy argument failed validation."
  },
  {
    "code": "6",
    "message": "Server error.",
    "_content": "There was an unexpected problem setting location information to the photo."
  },
  {
    "code": "7",
    "message": "User has not configured default viewing settings for location data.",
    "_content": "Before users may assign location data to a photo they must define who, by default, may view that information. Users can edit this preference at <a href=\"http://www.flickr.com/account/geo/privacy/\">http://www.flickr.com/account/geo/privacy/</a>"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.geo.setPerms = (function(Utils) {
  var method_name = "flickr.photos.geo.setPerms";
  var required = [
  {
    "name": "is_public",
    "_content": "1 to set viewing permissions for the photo's location data to public, 0 to set it to private."
  },
  {
    "name": "is_contact",
    "_content": "1 to set viewing permissions for the photo's location data to contacts, 0 to set it to private."
  },
  {
    "name": "is_friend",
    "_content": "1 to set viewing permissions for the photo's location data to friends, 0 to set it to private."
  },
  {
    "name": "is_family",
    "_content": "1 to set viewing permissions for the photo's location data to family, 0 to set it to private."
  },
  {
    "name": "photo_id",
    "_content": "The id of the photo to get permissions for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  },
  {
    "code": "2",
    "message": "Photo has no location information",
    "_content": "The photo requested has no location data or is not viewable by the calling user."
  },
  {
    "code": "3",
    "message": "Required arguments missing.",
    "_content": "Some or all of the required arguments were not supplied."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getAllContexts = (function(Utils) {
  var method_name = "flickr.photos.getAllContexts";
  var required = [
  {
    "name": "photo_id",
    "_content": "The photo to return information for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getContactsPhotos = (function(Utils) {
  var method_name = "flickr.photos.getContactsPhotos";
  var required = [];
  var optional = [
  {
    "name": "count",
    "_content": "Number of photos to return. Defaults to 10, maximum 50. This is only used if <code>single_photo</code> is not passed."
  },
  {
    "name": "just_friends",
    "_content": "set as 1 to only show photos from friends and family (excluding regular contacts)."
  },
  {
    "name": "single_photo",
    "_content": "Only fetch one photo (the latest) per contact, instead of all photos in chronological order."
  },
  {
    "name": "include_self",
    "_content": "Set to 1 to include photos from the calling user."
  },
  {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields include: license, date_upload, date_taken, owner_name, icon_server, original_format, last_update. For more information see extras under <a href=\"/services/api/flickr.photos.search.html\">flickr.photos.search</a>."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getContactsPublicPhotos = (function(Utils) {
  var method_name = "flickr.photos.getContactsPublicPhotos";
  var required = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch photos for."
  }
];
  var optional = [
  {
    "name": "count",
    "_content": "Number of photos to return. Defaults to 10, maximum 50. This is only used if <code>single_photo</code> is not passed."
  },
  {
    "name": "just_friends",
    "_content": "set as 1 to only show photos from friends and family (excluding regular contacts)."
  },
  {
    "name": "single_photo",
    "_content": "Only fetch one photo (the latest) per contact, instead of all photos in chronological order."
  },
  {
    "name": "include_self",
    "_content": "Set to 1 to include photos from the user specified by user_id."
  },
  {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: license, date_upload, date_taken, owner_name, icon_server, original_format, last_update."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getContext = (function(Utils) {
  var method_name = "flickr.photos.getContext";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to fetch the context for."
  }
];
  var optional = [
  {
    "name": "num_prev",
    "_content": ""
  },
  {
    "name": "num_next",
    "_content": ""
  },
  {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: <code>description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o</code>"
  },
  {
    "name": "order_by",
    "_content": "Accepts <code>datetaken</code> or <code>dateposted</code> and returns results in the proper order."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id, or was the id of a photo that the calling user does not have permission to view."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getCounts = (function(Utils) {
  var method_name = "flickr.photos.getCounts";
  var required = [];
  var optional = [
  {
    "name": "dates",
    "_content": "A comma delimited list of unix timestamps, denoting the periods to return counts for. They should be specified <b>smallest first</b>."
  },
  {
    "name": "taken_dates",
    "_content": "A comma delimited list of mysql datetimes, denoting the periods to return counts for. They should be specified <b>smallest first</b>."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "No dates specified",
    "_content": "Neither dates nor taken_dates were specified."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getExif = (function(Utils) {
  var method_name = "flickr.photos.getExif";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to fetch information for."
  }
];
  var optional = [
  {
    "name": "secret",
    "_content": "The secret for the photo. If the correct secret is passed then permissions checking is skipped. This enables the 'sharing' of individual photos by passing around the id and secret."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  },
  {
    "code": "2",
    "message": "Permission denied",
    "_content": "The owner of the photo does not want to share EXIF data."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getFavorites = (function(Utils) {
  var method_name = "flickr.photos.getFavorites";
  var required = [
  {
    "name": "photo_id",
    "_content": "The ID of the photo to fetch the favoriters list for."
  }
];
  var optional = [
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  },
  {
    "name": "per_page",
    "_content": "Number of usres to return per page. If this argument is omitted, it defaults to 10. The maximum allowed value is 50."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The specified photo does not exist, or the calling user does not have permission to view it."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getInfo = (function(Utils) {
  var method_name = "flickr.photos.getInfo";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to get information for."
  }
];
  var optional = [
  {
    "name": "secret",
    "_content": "The secret for the photo. If the correct secret is passed then permissions checking is skipped. This enables the 'sharing' of individual photos by passing around the id and secret."
  },
  {
    "name": "humandates",
    "_content": ""
  },
  {
    "name": "privacy_filter",
    "_content": ""
  },
  {
    "name": "get_contexts",
    "_content": ""
  },
  {
    "name": "get_geofences",
    "_content": "Return geofence information in the photo's location property"
  },
  {
    "name": "datecreate",
    "_content": "If set to 1, it returns the timestamp of the user's account creation, in MySQL DATETIME format.\r\n"
  },
  {
    "name": "extras",
    "_content": ""
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found.",
    "_content": "The photo id was either invalid or was for a photo not viewable by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getNotInSet = (function(Utils) {
  var method_name = "flickr.photos.getNotInSet";
  var required = [];
  var optional = [
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
  },
  {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends &amp; family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
  },
  {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
  },
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getPerms = (function(Utils) {
  var method_name = "flickr.photos.getPerms";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to get permissions for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id of a photo belonging to the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getRecent = (function(Utils) {
  var method_name = "flickr.photos.getRecent";
  var required = [];
  var optional = [
  {
    "name": "jump_to",
    "_content": ""
  }
];
  var errors = [
  {
    "code": "1",
    "message": "bad value for jump_to, must be valid photo id.",
    "_content": ""
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getSizes = (function(Utils) {
  var method_name = "flickr.photos.getSizes";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to fetch size information for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
  },
  {
    "code": "2",
    "message": "Permission denied",
    "_content": "The calling user does not have permission to view the photo."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getUntagged = (function(Utils) {
  var method_name = "flickr.photos.getUntagged";
  var required = [];
  var optional = [
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
  },
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime or unix timestamp."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
  },
  {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends &amp; family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
  },
  {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getWithGeoData = (function(Utils) {
  var method_name = "flickr.photos.getWithGeoData";
  var required = [];
  var optional = [
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  },
  {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends & family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
  },
  {
    "name": "sort",
    "_content": "The order in which to sort returned photos. Deafults to date-posted-desc. The possible values are: date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, and interestingness-asc."
  },
  {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.getWithoutGeoData = (function(Utils) {
  var method_name = "flickr.photos.getWithoutGeoData";
  var required = [];
  var optional = [
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
  },
  {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends &amp; family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
  },
  {
    "name": "sort",
    "_content": "The order in which to sort returned photos. Deafults to date-posted-desc. The possible values are: date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, and interestingness-asc."
  },
  {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
  },
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.licenses.getInfo = (function(Utils) {
  var method_name = "flickr.photos.licenses.getInfo";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.licenses.setLicense = (function(Utils) {
  var method_name = "flickr.photos.licenses.setLicense";
  var required = [
  {
    "name": "photo_id",
    "_content": "The photo to update the license for."
  },
  {
    "name": "license_id",
    "_content": "The license to apply, or 0 (zero) to remove the current license. Note : as of this writing the \"no known copyright restrictions\" license (7) is not a valid argument."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The specified id was not the id of a valif photo owner by the calling user."
  },
  {
    "code": "2",
    "message": "License not found",
    "_content": "The license id was not valid."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.notes.add = (function(Utils) {
  var method_name = "flickr.photos.notes.add";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to add a note to"
  },
  {
    "name": "note_x",
    "_content": "The left coordinate of the note"
  },
  {
    "name": "note_y",
    "_content": "The top coordinate of the note"
  },
  {
    "name": "note_w",
    "_content": "The width of the note"
  },
  {
    "name": "note_h",
    "_content": "The height of the note"
  },
  {
    "name": "note_text",
    "_content": "The description of the note"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id"
  },
  {
    "code": "2",
    "message": "User cannot add notes",
    "_content": "The calling user does not have permission to add a note to this photo"
  },
  {
    "code": "3",
    "message": "Missing required arguments",
    "_content": "One or more of the required arguments were not supplied."
  },
  {
    "code": "4",
    "message": "Maximum number of notes reached",
    "_content": "The maximum number of notes for the photo has been reached."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.notes.delete = (function(Utils) {
  var method_name = "flickr.photos.notes.delete";
  var required = [
  {
    "name": "note_id",
    "_content": "The id of the note to delete"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Note not found",
    "_content": "The note id passed was not a valid note id"
  },
  {
    "code": "2",
    "message": "User cannot delete note",
    "_content": "The calling user does not have permission to delete the specified note"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.notes.edit = (function(Utils) {
  var method_name = "flickr.photos.notes.edit";
  var required = [
  {
    "name": "note_id",
    "_content": "The id of the note to edit"
  },
  {
    "name": "note_x",
    "_content": "The left coordinate of the note"
  },
  {
    "name": "note_y",
    "_content": "The top coordinate of the note"
  },
  {
    "name": "note_w",
    "_content": "The width of the note"
  },
  {
    "name": "note_h",
    "_content": "The height of the note"
  },
  {
    "name": "note_text",
    "_content": "The description of the note"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Note not found",
    "_content": "The note id passed was not a valid note id"
  },
  {
    "code": "2",
    "message": "User cannot edit note",
    "_content": "The calling user does not have permission to edit the specified note"
  },
  {
    "code": "3",
    "message": "Missing required arguments",
    "_content": "One or more of the required arguments were not supplied."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.people.add = (function(Utils) {
  var method_name = "flickr.photos.people.add";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to add a person to."
  },
  {
    "name": "user_id",
    "_content": "The NSID of the user to add to the photo."
  }
];
  var optional = [
  {
    "name": "person_x",
    "_content": "The left-most pixel co-ordinate of the box around the person."
  },
  {
    "name": "person_y",
    "_content": "The top-most pixel co-ordinate of the box around the person."
  },
  {
    "name": "person_w",
    "_content": "The width (in pixels) of the box around the person."
  },
  {
    "name": "person_h",
    "_content": "The height (in pixels) of the box around the person."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Person not found",
    "_content": "The NSID passed was not a valid user id."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
  },
  {
    "code": "3",
    "message": "User cannot add this person to photos",
    "_content": "The person being added to the photo does not allow the calling user to add them."
  },
  {
    "code": "4",
    "message": "User cannot add people to that photo",
    "_content": "The owner of the photo doesn't allow the calling user to add people to their photos."
  },
  {
    "code": "5",
    "message": "Person can't be tagged in that photo",
    "_content": "The person being added to the photo does not want to be identified in this photo."
  },
  {
    "code": "6",
    "message": "Some co-ordinate paramters were blank",
    "_content": "Not all of the co-ordinate parameters (person_x, person_y, person_w, person_h) were passed with valid values."
  },
  {
    "code": "7",
    "message": "Can't add that person to a non-public photo",
    "_content": "You can only add yourself to another member's non-public photos."
  },
  {
    "code": "8",
    "message": "Too many people in that photo",
    "_content": "The maximum number of people has already been added to the photo."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.people.delete = (function(Utils) {
  var method_name = "flickr.photos.people.delete";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to remove a person from."
  },
  {
    "name": "user_id",
    "_content": "The NSID of the person to remove from the photo."
  }
];
  var optional = [
  {
    "name": "email",
    "_content": "An email address for an invited user."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Person not found",
    "_content": "The NSID passed was not a valid user id."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
  },
  {
    "code": "3",
    "message": "User cannot remove that person",
    "_content": "The calling user did not have permission to remove this person from this photo."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.people.deleteCoords = (function(Utils) {
  var method_name = "flickr.photos.people.deleteCoords";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to edit a person in."
  },
  {
    "name": "user_id",
    "_content": "The NSID of the person whose bounding box you want to remove."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Person not found",
    "_content": "The NSID passed was not a valid user id."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
  },
  {
    "code": "3",
    "message": "User cannot edit that person in that photo",
    "_content": "The calling user is neither the person depicted in the photo nor the person who added the bounding box."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.people.editCoords = (function(Utils) {
  var method_name = "flickr.photos.people.editCoords";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to edit a person in."
  },
  {
    "name": "user_id",
    "_content": "The NSID of the person to edit in a photo."
  },
  {
    "name": "person_x",
    "_content": "The left-most pixel co-ordinate of the box around the person."
  },
  {
    "name": "person_y",
    "_content": "The top-most pixel co-ordinate of the box around the person."
  },
  {
    "name": "person_w",
    "_content": "The width (in pixels) of the box around the person."
  },
  {
    "name": "person_h",
    "_content": "The height (in pixels) of the box around the person."
  }
];
  var optional = [
  {
    "name": "email",
    "_content": "An email address for an 'invited' person in a photo"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Person not found",
    "_content": "The NSID passed was not a valid user id."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
  },
  {
    "code": "3",
    "message": "User cannot edit that person in that photo",
    "_content": "The calling user did not originally add this person to the photo, and is not the person in question."
  },
  {
    "code": "4",
    "message": "Some co-ordinate paramters were blank",
    "_content": "Not all of the co-ordinate parameters (person_x, person_y, person_w, person_h) were passed with valid values."
  },
  {
    "code": "5",
    "message": "No co-ordinates given",
    "_content": "None of the co-ordinate parameters were valid."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.people.getList = (function(Utils) {
  var method_name = "flickr.photos.people.getList";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to get a list of people for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.recentlyUpdated = (function(Utils) {
  var method_name = "flickr.photos.recentlyUpdated";
  var required = [
  {
    "name": "min_date",
    "_content": "A Unix timestamp or any English textual datetime description indicating the date from which modifications should be compared."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Required argument missing.",
    "_content": "Some or all of the required arguments were not supplied."
  },
  {
    "code": "2",
    "message": "Not a valid date",
    "_content": "The date argument did not pass validation."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.removeTag = (function(Utils) {
  var method_name = "flickr.photos.removeTag";
  var required = [
  {
    "name": "tag_id",
    "_content": "The tag to remove from the photo. This parameter should contain a tag id, as returned by <a href=\"/services/api/flickr.photos.getInfo.html\">flickr.photos.getInfo</a>."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Tag not found",
    "_content": "The calling user doesn't have permission to delete the specified tag. This could mean it belongs to someone else, or doesn't exist."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.search = (function(Utils) {
  var method_name = "flickr.photos.search";
  var required = [];
  var optional = [
  {
    "name": "user_id",
    "_content": "The NSID of the user who's photo to search. If this parameter isn't passed then everybody's public photos will be searched. A value of \"me\" will search against the calling user's photos for authenticated calls."
  },
  {
    "name": "tags",
    "_content": "A comma-delimited list of tags. Photos with one or more of the tags listed will be returned. You can exclude results that match a term by prepending it with a - character."
  },
  {
    "name": "tag_mode",
    "_content": "Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified."
  },
  {
    "name": "text",
    "_content": "A free text search. Photos who's title, description or tags contain the text will be returned. You can exclude results that match a term by prepending it with a - character."
  },
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
  },
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date can be in the form of a unix timestamp or mysql datetime."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date can be in the form of a mysql datetime or unix timestamp."
  },
  {
    "name": "license",
    "_content": "The license id for photos (for possible values see the flickr.photos.licenses.getInfo method). Multiple licenses may be comma-separated."
  },
  {
    "name": "sort",
    "_content": "The order in which to sort returned photos. Deafults to date-posted-desc (unless you are doing a radial geo query, in which case the default sorting is by ascending distance from the point specified). The possible values are: date-posted-asc, date-posted-desc, date-taken-asc, date-taken-desc, interestingness-desc, interestingness-asc, and relevance."
  },
  {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. This only applies when making an authenticated call to view photos you own. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends & family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
  },
  {
    "name": "bbox",
    "_content": "A comma-delimited list of 4 values defining the Bounding Box of the area that will be searched.\r\n<br /><br />\r\nThe 4 values represent the bottom-left corner of the box and the top-right corner, minimum_longitude, minimum_latitude, maximum_longitude, maximum_latitude.\r\n<br /><br />\r\nLongitude has a range of -180 to 180 , latitude of -90 to 90. Defaults to -180, -90, 180, 90 if not specified.\r\n<br /><br />\r\nUnlike standard photo queries, geo (or bounding box) queries will only return 250 results per page.\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &#8212; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
  },
  {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information.  Current range is 1-16 : \r\n\r\n<ul>\r\n<li>World level is 1</li>\r\n<li>Country is ~3</li>\r\n<li>Region is ~6</li>\r\n<li>City is ~11</li>\r\n<li>Street is ~16</li>\r\n</ul>\r\n\r\nDefaults to maximum value if not specified."
  },
  {
    "name": "safe_search",
    "_content": "Safe search setting:\r\n\r\n<ul>\r\n<li>1 for safe.</li>\r\n<li>2 for moderate.</li>\r\n<li>3 for restricted.</li>\r\n</ul>\r\n\r\n(Please note: Un-authed calls can only see Safe content.)"
  },
  {
    "name": "content_type",
    "_content": "Content Type setting:\r\n<ul>\r\n<li>1 for photos only.</li>\r\n<li>2 for screenshots only.</li>\r\n<li>3 for 'other' only.</li>\r\n<li>4 for photos and screenshots.</li>\r\n<li>5 for screenshots and 'other'.</li>\r\n<li>6 for photos and 'other'.</li>\r\n<li>7 for photos, screenshots, and 'other' (all).</li>\r\n</ul>"
  },
  {
    "name": "machine_tags",
    "_content": "Aside from passing in a fully formed machine tag, there is a special syntax for searching on specific properties :\r\n\r\n<ul>\r\n  <li>Find photos using the 'dc' namespace :    <code>\"machine_tags\" => \"dc:\"</code></li>\r\n\r\n  <li> Find photos with a title in the 'dc' namespace : <code>\"machine_tags\" => \"dc:title=\"</code></li>\r\n\r\n  <li>Find photos titled \"mr. camera\" in the 'dc' namespace : <code>\"machine_tags\" => \"dc:title=\\\"mr. camera\\\"</code></li>\r\n\r\n  <li>Find photos whose value is \"mr. camera\" : <code>\"machine_tags\" => \"*:*=\\\"mr. camera\\\"\"</code></li>\r\n\r\n  <li>Find photos that have a title, in any namespace : <code>\"machine_tags\" => \"*:title=\"</code></li>\r\n\r\n  <li>Find photos that have a title, in any namespace, whose value is \"mr. camera\" : <code>\"machine_tags\" => \"*:title=\\\"mr. camera\\\"\"</code></li>\r\n\r\n  <li>Find photos, in the 'dc' namespace whose value is \"mr. camera\" : <code>\"machine_tags\" => \"dc:*=\\\"mr. camera\\\"\"</code></li>\r\n\r\n </ul>\r\n\r\nMultiple machine tags may be queried by passing a comma-separated list. The number of machine tags you can pass in a single query depends on the tag mode (AND or OR) that you are querying with. \"AND\" queries are limited to (16) machine tags. \"OR\" queries are limited\r\nto (8)."
  },
  {
    "name": "machine_tag_mode",
    "_content": "Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified."
  },
  {
    "name": "group_id",
    "_content": "The id of a group who's pool to search.  If specified, only matching photos posted to the group's pool will be returned."
  },
  {
    "name": "faves",
    "_content": "boolean. Pass faves=1 along with your user_id to search within your favorites"
  },
  {
    "name": "camera",
    "_content": "Limit results by camera.  Camera names must be in the <a href=\"http://www.flickr.com/cameras\">Camera Finder</a> normalized form.  <a href=\"http://flickr.com/services/api/flickr.cameras.getList\">flickr.cameras.getList()</a> returns a list of searchable cameras."
  },
  {
    "name": "jump_to",
    "_content": "Jump, jump!"
  },
  {
    "name": "contacts",
    "_content": "Search your contacts. Either 'all' or 'ff' for just friends and family. (Experimental)"
  },
  {
    "name": "woe_id",
    "_content": "A 32-bit identifier that uniquely represents spatial entities. (not used if bbox argument is present). \r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
  },
  {
    "name": "place_id",
    "_content": "A Flickr place id.  (not used if bbox argument is present).\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
  },
  {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
  },
  {
    "name": "has_geo",
    "_content": "Any photo that has been geotagged, or if the value is \"0\" any photo that has <i>not</i> been geotagged.\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
  },
  {
    "name": "geo_context",
    "_content": "Geo context is a numeric value representing the photo's geotagginess beyond latitude and longitude. For example, you may wish to search for photos that were taken \"indoors\" or \"outdoors\". <br /><br />\r\nThe current list of context IDs is :<br /><br/>\r\n<ul>\r\n<li><strong>0</strong>, not defined.</li>\r\n<li><strong>1</strong>, indoors.</li>\r\n<li><strong>2</strong>, outdoors.</li>\r\n</ul>\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
  },
  {
    "name": "lat",
    "_content": "A valid latitude, in decimal format, for doing radial geo queries.\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
  },
  {
    "name": "lon",
    "_content": "A valid longitude, in decimal format, for doing radial geo queries.\r\n<br /><br />\r\nGeo queries require some sort of limiting agent in order to prevent the database from crying. This is basically like the check against \"parameterless searches\" for queries without a geo component.\r\n<br /><br />\r\nA tag, for instance, is considered a limiting agent as are user defined min_date_taken and min_date_upload parameters &mdash; If no limiting factor is passed we return only photos added in the last 12 hours (though we may extend the limit in the future)."
  },
  {
    "name": "radius",
    "_content": "A valid radius used for geo queries, greater than zero and less than 20 miles (or 32 kilometers), for use with point-based geo queries. The default value is 5 (km)."
  },
  {
    "name": "radius_units",
    "_content": "The unit of measure when doing radial geo queries. Valid options are \"mi\" (miles) and \"km\" (kilometers). The default is \"km\"."
  },
  {
    "name": "is_commons",
    "_content": "Limit the scope of the search to only photos that are part of the <a href=\"http://flickr.com/commons\">Flickr Commons project</a>. Default is false."
  },
  {
    "name": "in_gallery",
    "_content": "Limit the scope of the search to only photos that are in a <a href=\"http://www.flickr.com/help/galleries/\">gallery</a>?  Default is false, search all photos."
  },
  {
    "name": "person_id",
    "_content": "The id of a user.  Will return photos where the user has been people tagged.  A call signed as the person_id in question will return *all* photos the user in, otherwise returns public photos."
  },
  {
    "name": "is_getty",
    "_content": "Limit the scope of the search to only photos that are for sale on Getty. Default is false."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Too many tags in ALL query",
    "_content": "When performing an 'all tags' search, you may not specify more than 20 tags to join together."
  },
  {
    "code": "2",
    "message": "Unknown user",
    "_content": "A user_id was passed which did not match a valid flickr user."
  },
  {
    "code": "3",
    "message": "Parameterless searches have been disabled",
    "_content": "To perform a search with no parameters (to get the latest public photos, please use flickr.photos.getRecent instead)."
  },
  {
    "code": "4",
    "message": "You don't have permission to view this pool",
    "_content": "The logged in user (if any) does not have permission to view the pool for this group."
  },
  {
    "code": "10",
    "message": "Sorry, the Flickr search API is not currently available.",
    "_content": "The Flickr API search databases are temporarily unavailable."
  },
  {
    "code": "11",
    "message": "No valid machine tags",
    "_content": "The query styntax for the machine_tags argument did not validate."
  },
  {
    "code": "12",
    "message": "Exceeded maximum allowable machine tags",
    "_content": "The maximum number of machine tags in a single query was exceeded."
  },
  {
    "code": "13",
    "message": "jump_to not avaiable for this query",
    "_content": "jump_to only supported for some query types."
  },
  {
    "code": "14",
    "message": "Bad value for jump_to",
    "_content": "jump_to must be valid photo ID."
  },
  {
    "code": "15",
    "message": "Photo not found",
    "_content": ""
  },
  {
    "code": "16",
    "message": "You can only search within your own favorites",
    "_content": ""
  },
  {
    "code": "17",
    "message": "You can only search within your own contacts",
    "_content": "The call tried to use the contacts parameter with no user ID or a user ID other than that of the authenticated user."
  },
  {
    "code": "18",
    "message": "Illogical arguments",
    "_content": "The request contained contradictory arguments."
  },
  {
    "code": "20",
    "message": "Excessive photo offset in search",
    "_content": "The search requested photos beyond an allowable offset. Reduce the page number or number of results per page for this search."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.setContentType = (function(Utils) {
  var method_name = "flickr.photos.setContentType";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to set the adultness of."
  },
  {
    "name": "content_type",
    "_content": "The content type of the photo. Must be one of: 1 for Photo, 2 for Screenshot, and 3 for Other."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id of a photo belonging to the calling user."
  },
  {
    "code": "2",
    "message": "Required arguments missing",
    "_content": "Some or all of the required arguments were not supplied."
  },
  {
    "code": "3",
    "message": "Change not allowed",
    "_content": "Changing the content type of this photo is not allowed."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.setDates = (function(Utils) {
  var method_name = "flickr.photos.setDates";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to edit dates for."
  }
];
  var optional = [
  {
    "name": "date_posted",
    "_content": "The date the photo was uploaded to flickr (see the <a href=\"/services/api/misc.dates.html\">dates documentation</a>)"
  },
  {
    "name": "date_taken",
    "_content": "The date the photo was taken (see the <a href=\"/services/api/misc.dates.html\">dates documentation</a>)"
  },
  {
    "name": "date_taken_granularity",
    "_content": "The granularity of the date the photo was taken (see the <a href=\"/services/api/misc.dates.html\">dates documentation</a>)"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was not the id of a valid photo belonging to the calling user."
  },
  {
    "code": "2",
    "message": "Not enough arguments",
    "_content": "No dates were specified to be changed."
  },
  {
    "code": "3",
    "message": "Invalid granularity",
    "_content": "The value passed for 'granularity' was not a valid flickr date granularity."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.setMeta = (function(Utils) {
  var method_name = "flickr.photos.setMeta";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to set information for."
  },
  {
    "name": "title",
    "_content": "The title for the photo."
  },
  {
    "name": "description",
    "_content": "The description for the photo."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a photo belonging to the calling user. It might be an invalid id, or the photo might be owned by another user. "
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.setPerms = (function(Utils) {
  var method_name = "flickr.photos.setPerms";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to set permissions for."
  },
  {
    "name": "is_public",
    "_content": "1 to set the photo to public, 0 to set it to private."
  },
  {
    "name": "is_friend",
    "_content": "1 to make the photo visible to friends when private, 0 to not."
  },
  {
    "name": "is_family",
    "_content": "1 to make the photo visible to family when private, 0 to not."
  },
  {
    "name": "perm_comment",
    "_content": "who can add comments to the photo and it's notes. one of:<br />\r\n<code>0</code>: nobody<br />\r\n<code>1</code>: friends &amp; family<br />\r\n<code>2</code>: contacts<br />\r\n<code>3</code>: everybody"
  },
  {
    "name": "perm_addmeta",
    "_content": "who can add notes and tags to the photo. one of:<br />\r\n<code>0</code>: nobody / just the owner<br />\r\n<code>1</code>: friends &amp; family<br />\r\n<code>2</code>: contacts<br />\r\n<code>3</code>: everybody\r\n"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id of a photo belonging to the calling user."
  },
  {
    "code": "2",
    "message": "Required arguments missing",
    "_content": "Some or all of the required arguments were not supplied."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.setSafetyLevel = (function(Utils) {
  var method_name = "flickr.photos.setSafetyLevel";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to set the adultness of."
  }
];
  var optional = [
  {
    "name": "safety_level",
    "_content": "The safety level of the photo.  Must be one of:\r\n\r\n1 for Safe, 2 for Moderate, and 3 for Restricted."
  },
  {
    "name": "hidden",
    "_content": "Whether or not to additionally hide the photo from public searches.  Must be either 1 for Yes or 0 for No."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id of a photo belonging to the calling user."
  },
  {
    "code": "2",
    "message": "Invalid or missing arguments",
    "_content": "Neither a valid safety level nor a hidden value were passed."
  },
  {
    "code": "3",
    "message": "Change not allowed",
    "_content": "Changing the safety level of this photo is not allowed."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.setTags = (function(Utils) {
  var method_name = "flickr.photos.setTags";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to set tags for.\r\n"
  },
  {
    "name": "tags",
    "_content": "All tags for the photo (as a single space-delimited string)."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a photo belonging to the calling user. It might be an invalid id, or the photo might be owned by another user. "
  },
  {
    "code": "2",
    "message": "Maximum number of tags reached",
    "_content": "The number of tags specified exceeds the limit for the photo. No tags were modified."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.suggestions.approveSuggestion = (function(Utils) {
  var method_name = "flickr.photos.suggestions.approveSuggestion";
  var required = [
  {
    "name": "suggestion_id",
    "_content": "The unique ID for the location suggestion to approve."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.suggestions.getList = (function(Utils) {
  var method_name = "flickr.photos.suggestions.getList";
  var required = [];
  var optional = [
  {
    "name": "photo_id",
    "_content": "Only show suggestions for a single photo."
  },
  {
    "name": "status_id",
    "_content": "Only show suggestions with a given status.\r\n\r\n<ul>\r\n<li><strong>0</strong>, pending</li>\r\n<li><strong>1</strong>, approved</li>\r\n<li><strong>2</strong>, rejected</li>\r\n</ul>\r\n\r\nThe default is pending (or \"0\")."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.suggestions.rejectSuggestion = (function(Utils) {
  var method_name = "flickr.photos.suggestions.rejectSuggestion";
  var required = [
  {
    "name": "suggestion_id",
    "_content": "The unique ID of the suggestion to reject."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.suggestions.removeSuggestion = (function(Utils) {
  var method_name = "flickr.photos.suggestions.removeSuggestion";
  var required = [
  {
    "name": "suggestion_id",
    "_content": "The unique ID for the location suggestion to approve."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.suggestions.suggestLocation = (function(Utils) {
  var method_name = "flickr.photos.suggestions.suggestLocation";
  var required = [
  {
    "name": "photo_id",
    "_content": "The photo whose location you are suggesting."
  },
  {
    "name": "lat",
    "_content": "The latitude whose valid range is -90 to 90. Anything more than 6 decimal places will be truncated."
  },
  {
    "name": "lon",
    "_content": "The longitude whose valid range is -180 to 180. Anything more than 6 decimal places will be truncated."
  }
];
  var optional = [
  {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. Defaults to 16 if not specified."
  },
  {
    "name": "woe_id",
    "_content": "The WOE ID of the location used to build the location hierarchy for the photo."
  },
  {
    "name": "place_id",
    "_content": "The Flickr Places ID of the location used to build the location hierarchy for the photo."
  },
  {
    "name": "note",
    "_content": "A short note or history to include with the suggestion."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.transform.rotate = (function(Utils) {
  var method_name = "flickr.photos.transform.rotate";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to rotate."
  },
  {
    "name": "degrees",
    "_content": "The amount of degrees by which to rotate the photo (clockwise) from it's current orientation. Valid values are 90, 180 and 270."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id was invalid or did not belong to the calling user."
  },
  {
    "code": "2",
    "message": "Invalid rotation",
    "_content": "The rotation degrees were an invalid value."
  },
  {
    "code": "3",
    "message": "Temporary failure",
    "_content": "There was a problem either rotating the image or storing the rotated versions."
  },
  {
    "code": "4",
    "message": "Rotation disabled",
    "_content": "The rotation service is currently disabled."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photos.upload.checkTickets = (function(Utils) {
  var method_name = "flickr.photos.upload.checkTickets";
  var required = [
  {
    "name": "tickets",
    "_content": "A comma-delimited list of ticket ids"
  }
];
  var optional = [
  {
    "name": "batch_id",
    "_content": ""
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.addPhoto = (function(Utils) {
  var method_name = "flickr.photosets.addPhoto";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to add a photo to."
  },
  {
    "name": "photo_id",
    "_content": "The id of the photo to add to the set."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not the id of avalid photoset owned by the calling user."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo owned by the calling user."
  },
  {
    "code": "3",
    "message": "Photo already in set",
    "_content": "The photo is already a member of the photoset."
  },
  {
    "code": "10",
    "message": "Maximum number of photos in set",
    "_content": "A set has reached the upper limit for the number of photos allowed."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.comments.addComment = (function(Utils) {
  var method_name = "flickr.photosets.comments.addComment";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to add a comment to."
  },
  {
    "name": "comment_text",
    "_content": "Text of the comment"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": ""
  },
  {
    "code": "8",
    "message": "Blank comment",
    "_content": ""
  },
  {
    "code": "9",
    "message": "User is posting comments too fast.",
    "_content": "The user has reached the limit for number of comments posted during a specific time period. Wait a bit and try again."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.comments.deleteComment = (function(Utils) {
  var method_name = "flickr.photosets.comments.deleteComment";
  var required = [
  {
    "name": "comment_id",
    "_content": "The id of the comment to delete from a photoset."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "2",
    "message": "Comment not found.",
    "_content": "The comment id passed was not a valid comment id"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.comments.editComment = (function(Utils) {
  var method_name = "flickr.photosets.comments.editComment";
  var required = [
  {
    "name": "comment_id",
    "_content": "The id of the comment to edit."
  },
  {
    "name": "comment_text",
    "_content": "Update the comment to this text."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "2",
    "message": "Comment not found.",
    "_content": "The comment id passed was not a valid comment id."
  },
  {
    "code": "8",
    "message": "Blank comment.",
    "_content": "Comment text can't be blank."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.comments.getList = (function(Utils) {
  var method_name = "flickr.photosets.comments.getList";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to fetch comments for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found.",
    "_content": "The photoset id was invalid."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.create = (function(Utils) {
  var method_name = "flickr.photosets.create";
  var required = [
  {
    "name": "title",
    "_content": "A title for the photoset."
  },
  {
    "name": "primary_photo_id",
    "_content": "The id of the photo to represent this set. The photo must belong to the calling user."
  }
];
  var optional = [
  {
    "name": "description",
    "_content": "A description of the photoset. May contain limited html."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "No title specified",
    "_content": "No title parameter was passed in the request."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The primary photo id passed was not a valid photo id or does not belong to the calling user."
  },
  {
    "code": "3",
    "message": "Can't create any more sets",
    "_content": "The user has reached their maximum number of photosets limit."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.delete = (function(Utils) {
  var method_name = "flickr.photosets.delete";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to delete. It must be owned by the calling user."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id or did not belong to the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.editMeta = (function(Utils) {
  var method_name = "flickr.photosets.editMeta";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to modify."
  },
  {
    "name": "title",
    "_content": "The new title for the photoset."
  }
];
  var optional = [
  {
    "name": "description",
    "_content": "A description of the photoset. May contain limited html."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id or did not belong to the calling user."
  },
  {
    "code": "2",
    "message": "No title specified",
    "_content": "No title parameter was passed in the request. "
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.editPhotos = (function(Utils) {
  var method_name = "flickr.photosets.editPhotos";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to modify. The photoset must belong to the calling user."
  },
  {
    "name": "primary_photo_id",
    "_content": "The id of the photo to use as the 'primary' photo for the set. This id must also be passed along in photo_ids list argument."
  },
  {
    "name": "photo_ids",
    "_content": "A comma-delimited list of photo ids to include in the set. They will appear in the set in the order sent. This list <b>must</b> contain the primary photo id. All photos must belong to the owner of the set. This list of photos replaces the existing list. Call flickr.photosets.addPhoto to append a photo to a set."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id or did not belong to the calling user."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "One or more of the photo ids passed was not a valid photo id or does not belong to the calling user."
  },
  {
    "code": "3",
    "message": "Primary photo not found",
    "_content": "The primary photo id passed was not a valid photo id or does not belong to the calling user."
  },
  {
    "code": "4",
    "message": "Primary photo not in list",
    "_content": "The primary photo id passed did not appear in the photo id list."
  },
  {
    "code": "5",
    "message": "Empty photos list",
    "_content": "No photo ids were passed."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.getContext = (function(Utils) {
  var method_name = "flickr.photosets.getContext";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to fetch the context for."
  },
  {
    "name": "photoset_id",
    "_content": "The id of the photoset for which to fetch the photo's context."
  }
];
  var optional = [
  {
    "name": "num_prev",
    "_content": ""
  },
  {
    "name": "num_next",
    "_content": ""
  },
  {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: description, license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_z, url_l, url_o"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id, or was the id of a photo that the calling user does not have permission to view."
  },
  {
    "code": "2",
    "message": "Photo not in set",
    "_content": "The specified photo is not in the specified set."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.getInfo = (function(Utils) {
  var method_name = "flickr.photosets.getInfo";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The ID of the photoset to fetch information for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id was not valid."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.getList = (function(Utils) {
  var method_name = "flickr.photosets.getList";
  var required = [];
  var optional = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to get a photoset list for. If none is specified, the calling user is assumed."
  },
  {
    "name": "page",
    "_content": "The page of results to get. Currently, if this is not provided, all sets are returned, but this behaviour may change in future."
  },
  {
    "name": "per_page",
    "_content": "The number of sets to get per page. If paging is enabled, the maximum number of sets per page is 500."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID and the calling user was not logged in.\r\n"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.getPhotos = (function(Utils) {
  var method_name = "flickr.photosets.getPhotos";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to return the photos for."
  }
];
  var optional = [
  {
    "name": "extras",
    "_content": "A comma-delimited list of extra information to fetch for each returned record. Currently supported fields are: license, date_upload, date_taken, owner_name, icon_server, original_format, last_update, geo, tags, machine_tags, o_dims, views, media, path_alias, url_sq, url_t, url_s, url_m, url_o"
  },
  {
    "name": "privacy_filter",
    "_content": "Return photos only matching a certain privacy level. This only applies when making an authenticated call to view a photoset you own. Valid values are:\r\n<ul>\r\n<li>1 public photos</li>\r\n<li>2 private photos visible to friends</li>\r\n<li>3 private photos visible to family</li>\r\n<li>4 private photos visible to friends &amp; family</li>\r\n<li>5 completely private photos</li>\r\n</ul>\r\n"
  },
  {
    "name": "per_page",
    "_content": "Number of photos to return per page. If this argument is omitted, it defaults to 500. The maximum allowed value is 500."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  },
  {
    "name": "media",
    "_content": "Filter results by media type. Possible values are <code>all</code> (default), <code>photos</code> or <code>videos</code>"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.orderSets = (function(Utils) {
  var method_name = "flickr.photosets.orderSets";
  var required = [
  {
    "name": "photoset_ids",
    "_content": "A comma delimited list of photoset IDs, ordered with the set to show first, first in the list. Any set IDs not given in the list will be set to appear at the end of the list, ordered by their IDs."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Set not found",
    "_content": "One of the photoset ids passed was not the id of a valid photoset belonging to the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.removePhoto = (function(Utils) {
  var method_name = "flickr.photosets.removePhoto";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to remove a photo from."
  },
  {
    "name": "photo_id",
    "_content": "The id of the photo to remove from the set."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not the id of avalid photoset owned by the calling user."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo belonging to the calling user."
  },
  {
    "code": "3",
    "message": "Photo not in set",
    "_content": "The photo is not a member of the photoset."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.removePhotos = (function(Utils) {
  var method_name = "flickr.photosets.removePhotos";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to remove photos from."
  },
  {
    "name": "photo_ids",
    "_content": "Comma-delimited list of photo ids to remove from the photoset."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not the id of available photosets owned by the calling user."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo belonging to the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.reorderPhotos = (function(Utils) {
  var method_name = "flickr.photosets.reorderPhotos";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to reorder. The photoset must belong to the calling user."
  },
  {
    "name": "photo_ids",
    "_content": "Ordered, comma-delimited list of photo ids. Photos that are not in the list will keep their original order"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not a valid photoset id or did not belong to the calling user."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "One or more of the photo ids passed was not a valid photo id or does not belong to the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.photosets.setPrimaryPhoto = (function(Utils) {
  var method_name = "flickr.photosets.setPrimaryPhoto";
  var required = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to set primary photo to."
  },
  {
    "name": "photo_id",
    "_content": "The id of the photo to set as primary."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photoset not found",
    "_content": "The photoset id passed was not the id of avalid photoset owned by the calling user."
  },
  {
    "code": "2",
    "message": "Photo not found",
    "_content": "The photo id passed was not the id of a valid photo owned by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.find = (function(Utils) {
  var method_name = "flickr.places.find";
  var required = [
  {
    "name": "query",
    "_content": "The query string to use for place ID lookups"
  }
];
  var optional = [
  {
    "name": "bbox",
    "_content": "A bounding box for limiting the area to query."
  },
  {
    "name": "extras",
    "_content": "Secret sauce."
  },
  {
    "name": "safe",
    "_content": "Do we want sexy time words in our venue results?"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameters was not included with the API call."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.findByLatLon = (function(Utils) {
  var method_name = "flickr.places.findByLatLon";
  var required = [
  {
    "name": "lat",
    "_content": "The latitude whose valid range is -90 to 90. Anything more than 4 decimal places will be truncated."
  },
  {
    "name": "lon",
    "_content": "The longitude whose valid range is -180 to 180. Anything more than 4 decimal places will be truncated."
  }
];
  var optional = [
  {
    "name": "accuracy",
    "_content": "Recorded accuracy level of the location information. World level is 1, Country is ~3, Region ~6, City ~11, Street ~16. Current range is 1-16. The default is 16."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required arguments missing",
    "_content": "One or more required parameters was not included with the API request."
  },
  {
    "code": "2",
    "message": "Not a valid latitude",
    "_content": "The latitude argument failed validation."
  },
  {
    "code": "3",
    "message": "Not a valid longitude",
    "_content": "The longitude argument failed validation."
  },
  {
    "code": "4",
    "message": "Not a valid accuracy",
    "_content": "The accuracy argument failed validation."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.getChildrenWithPhotosPublic = (function(Utils) {
  var method_name = "flickr.places.getChildrenWithPhotosPublic";
  var required = [];
  var optional = [
  {
    "name": "place_id",
    "_content": "A Flickr Places ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
  },
  {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. (While optional, you must pass either a valid Places ID or a WOE ID.)"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameter is missing from the API call."
  },
  {
    "code": "2",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) ID was passed with the API call."
  },
  {
    "code": "3",
    "message": "Place not found",
    "_content": "No place could be found for the Places (or WOE) ID passed to the API call."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.getInfo = (function(Utils) {
  var method_name = "flickr.places.getInfo";
  var required = [];
  var optional = [
  {
    "name": "place_id",
    "_content": "A Flickr Places ID. <span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. <span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameter is missing from the API call."
  },
  {
    "code": "2",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) ID was passed with the API call."
  },
  {
    "code": "3",
    "message": "Place not found",
    "_content": "No place could be found for the Places (or WOE) ID passed to the API call."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.getInfoByUrl = (function(Utils) {
  var method_name = "flickr.places.getInfoByUrl";
  var required = [
  {
    "name": "url",
    "_content": "A flickr.com/places URL in the form of /country/region/city. For example: /Canada/Quebec/Montreal"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "2",
    "message": "Place URL required.",
    "_content": "The flickr.com/places URL was not passed with the API method."
  },
  {
    "code": "3",
    "message": "Place not found.",
    "_content": "Unable to find a valid place for the places URL."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.getPlaceTypes = (function(Utils) {
  var method_name = "flickr.places.getPlaceTypes";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.getShapeHistory = (function(Utils) {
  var method_name = "flickr.places.getShapeHistory";
  var required = [];
  var optional = [
  {
    "name": "place_id",
    "_content": "A Flickr Places ID. <span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "woe_id",
    "_content": "A Where On Earth (WOE) ID. <span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameter is missing from the API call."
  },
  {
    "code": "2",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) ID was passed with the API call."
  },
  {
    "code": "3",
    "message": "Place not found",
    "_content": "No place could be found for the Places (or WOE) ID passed to the API call."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.getTopPlacesList = (function(Utils) {
  var method_name = "flickr.places.getTopPlacesList";
  var required = [
  {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>"
  }
];
  var optional = [
  {
    "name": "date",
    "_content": "A valid date in YYYY-MM-DD format. The default is yesterday."
  },
  {
    "name": "woe_id",
    "_content": "Limit your query to only those top places belonging to a specific Where on Earth (WOE) identifier."
  },
  {
    "name": "place_id",
    "_content": "Limit your query to only those top places belonging to a specific Flickr Places identifier."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more required parameters with missing from your request."
  },
  {
    "code": "2",
    "message": "Not a valid place type.",
    "_content": "An unknown or unsupported place type ID was passed with your request."
  },
  {
    "code": "3",
    "message": "Not a valid date.",
    "_content": "The date argument passed with your request is invalid."
  },
  {
    "code": "4",
    "message": "Not a valid Place ID",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.placesForBoundingBox = (function(Utils) {
  var method_name = "flickr.places.placesForBoundingBox";
  var required = [
  {
    "name": "bbox",
    "_content": "A comma-delimited list of 4 values defining the Bounding Box of the area that will be searched. The 4 values represent the bottom-left corner of the box and the top-right corner, minimum_longitude, minimum_latitude, maximum_longitude, maximum_latitude."
  }
];
  var optional = [
  {
    "name": "place_type",
    "_content": "The name of place type to using as the starting point to search for places in a bounding box. Valid placetypes are:\r\n\r\n<ul>\r\n<li>neighbourhood</li>\r\n<li>locality</li>\r\n<li>county</li>\r\n<li>region</li>\r\n<li>country</li>\r\n<li>continent</li>\r\n</ul>\r\n<br />\r\n<span style=\"font-style:italic;\">The \"place_type\" argument has been deprecated in favor of the \"place_type_id\" argument. It won't go away but it will not be added to new methods. A complete list of place type IDs is available using the <a href=\"http://www.flickr.com/services/api/flickr.places.getPlaceTypes.html\">flickr.places.getPlaceTypes</a> method. (While optional, you must pass either a valid place type or place type ID.)</span>"
  },
  {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>\r\n<br /><span style=\"font-style:italic;\">(While optional, you must pass either a valid place type or place type ID.)</span>\r\n"
  },
  {
    "name": "recursive",
    "_content": "Perform a recursive place type search. For example, if you search for neighbourhoods in a given bounding box but there are no results the method will also query for localities and so on until one or more valid places are found.<br /<br /> \r\nRecursive searches do not change the bounding box size restrictions for the initial place type passed to the method."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameters missing",
    "_content": "One or more required parameter is missing from the API call."
  },
  {
    "code": "2",
    "message": "Not a valid bbox",
    "_content": "The bbox argument was incomplete or incorrectly formatted"
  },
  {
    "code": "3",
    "message": "Not a valid place type",
    "_content": "An invalid place type was included with your request."
  },
  {
    "code": "4",
    "message": "Bounding box exceeds maximum allowable size for place type",
    "_content": "The bounding box passed along with your request was too large for the request place type."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.placesForContacts = (function(Utils) {
  var method_name = "flickr.places.placesForContacts";
  var required = [];
  var optional = [
  {
    "name": "place_type",
    "_content": "A specific place type to cluster photos by. <br /><br />\r\n\r\nValid place types are :\r\n\r\n<ul>\r\n<li><strong>neighbourhood</strong> (and neighborhood)</li>\r\n<li><strong>locality</strong></li>\r\n<li><strong>region</strong></li>\r\n<li><strong>country</strong></li>\r\n<li><strong>continent</strong></li>\r\n</ul>\r\n<br />\r\n<span style=\"font-style:italic;\">The \"place_type\" argument has been deprecated in favor of the \"place_type_id\" argument. It won't go away but it will not be added to new methods. A complete list of place type IDs is available using the <a href=\"http://www.flickr.com/services/api/flickr.places.getPlaceTypes.html\">flickr.places.getPlaceTypes</a> method. (While optional, you must pass either a valid place type or place type ID.)</span>"
  },
  {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>\r\n<br /><span style=\"font-style:italic;\">(While optional, you must pass either a valid place type or place type ID.)</span>"
  },
  {
    "name": "woe_id",
    "_content": "A Where on Earth identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (WOE ID <strong>23424977</strong>).<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "place_id",
    "_content": "A Flickr Places identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (Place ID <strong>4KO02SibApitvSBieQ</strong>).\r\n<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "threshold",
    "_content": "The minimum number of photos that a place type must have to be included. If the number of photos is lowered then the parent place type for that place will be used.<br /><br />\r\n\r\nFor example if your contacts only have <strong>3</strong> photos taken in the locality of Montreal</strong> (WOE ID 3534) but your threshold is set to <strong>5</strong> then those photos will be \"rolled up\" and included instead with a place record for the region of Quebec (WOE ID 2344924)."
  },
  {
    "name": "contacts",
    "_content": "Search your contacts. Either 'all' or 'ff' for just friends and family. (Default is all)"
  },
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Places for contacts are not available at this time",
    "_content": "Places for contacts have been disabled or are otherwise not available."
  },
  {
    "code": "2",
    "message": "Required parameter missing",
    "_content": "One or more of the required parameters was not included with your request."
  },
  {
    "code": "3",
    "message": "Not a valid place type.",
    "_content": "An invalid place type was included with your request."
  },
  {
    "code": "4",
    "message": "Not a valid Place ID",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
  },
  {
    "code": "5",
    "message": "Not a valid threshold",
    "_content": "The threshold passed was invalid. "
  },
  {
    "code": "6",
    "message": "Not a valid contacts type",
    "_content": "Contacts must be either \"all\" or \"ff\" (friends and family)."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.placesForTags = (function(Utils) {
  var method_name = "flickr.places.placesForTags";
  var required = [
  {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>"
  }
];
  var optional = [
  {
    "name": "woe_id",
    "_content": "A Where on Earth identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (WOE ID <strong>23424977</strong>).\r\n<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "place_id",
    "_content": "A Flickr Places identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (Place ID <strong>4KO02SibApitvSBieQ</strong>).\r\n<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "threshold",
    "_content": "The minimum number of photos that a place type must have to be included. If the number of photos is lowered then the parent place type for that place will be used.<br /><br />\r\n\r\nFor example if you only have <strong>3</strong> photos taken in the locality of Montreal</strong> (WOE ID 3534) but your threshold is set to <strong>5</strong> then those photos will be \"rolled up\" and included instead with a place record for the region of Quebec (WOE ID 2344924)."
  },
  {
    "name": "tags",
    "_content": "A comma-delimited list of tags. Photos with one or more of the tags listed will be returned."
  },
  {
    "name": "tag_mode",
    "_content": "Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified."
  },
  {
    "name": "machine_tags",
    "_content": "Aside from passing in a fully formed machine tag, there is a special syntax for searching on specific properties :\r\n\r\n<ul>\r\n  <li>Find photos using the 'dc' namespace :    <code>\"machine_tags\" => \"dc:\"</code></li>\r\n\r\n  <li> Find photos with a title in the 'dc' namespace : <code>\"machine_tags\" => \"dc:title=\"</code></li>\r\n\r\n  <li>Find photos titled \"mr. camera\" in the 'dc' namespace : <code>\"machine_tags\" => \"dc:title=\\\"mr. camera\\\"</code></li>\r\n\r\n  <li>Find photos whose value is \"mr. camera\" : <code>\"machine_tags\" => \"*:*=\\\"mr. camera\\\"\"</code></li>\r\n\r\n  <li>Find photos that have a title, in any namespace : <code>\"machine_tags\" => \"*:title=\"</code></li>\r\n\r\n  <li>Find photos that have a title, in any namespace, whose value is \"mr. camera\" : <code>\"machine_tags\" => \"*:title=\\\"mr. camera\\\"\"</code></li>\r\n\r\n  <li>Find photos, in the 'dc' namespace whose value is \"mr. camera\" : <code>\"machine_tags\" => \"dc:*=\\\"mr. camera\\\"\"</code></li>\r\n\r\n </ul>\r\n\r\nMultiple machine tags may be queried by passing a comma-separated list. The number of machine tags you can pass in a single query depends on the tag mode (AND or OR) that you are querying with. \"AND\" queries are limited to (16) machine tags. \"OR\" queries are limited\r\nto (8)."
  },
  {
    "name": "machine_tag_mode",
    "_content": "Either 'any' for an OR combination of tags, or 'all' for an AND combination. Defaults to 'any' if not specified."
  },
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  }
];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.placesForUser = (function(Utils) {
  var method_name = "flickr.places.placesForUser";
  var required = [];
  var optional = [
  {
    "name": "place_type_id",
    "_content": "The numeric ID for a specific place type to cluster photos by. <br /><br />\r\n\r\nValid place type IDs are :\r\n\r\n<ul>\r\n<li><strong>22</strong>: neighbourhood</li>\r\n<li><strong>7</strong>: locality</li>\r\n<li><strong>8</strong>: region</li>\r\n<li><strong>12</strong>: country</li>\r\n<li><strong>29</strong>: continent</li>\r\n</ul>\r\n<br />\r\n<span style=\"font-style:italic;\">The \"place_type\" argument has been deprecated in favor of the \"place_type_id\" argument. It won't go away but it will not be added to new methods. A complete list of place type IDs is available using the <a href=\"http://www.flickr.com/services/api/flickr.places.getPlaceTypes.html\">flickr.places.getPlaceTypes</a> method. (While optional, you must pass either a valid place type or place type ID.)</span>"
  },
  {
    "name": "place_type",
    "_content": "A specific place type to cluster photos by. <br /><br />\r\n\r\nValid place types are :\r\n\r\n<ul>\r\n<li><strong>neighbourhood</strong> (and neighborhood)</li>\r\n<li><strong>locality</strong></li>\r\n<li><strong>region</strong></li>\r\n<li><strong>country</strong></li>\r\n<li><strong>continent</strong></li>\r\n</ul>\r\n<br /><span style=\"font-style:italic;\">(While optional, you must pass either a valid place type or place type ID.)</span>"
  },
  {
    "name": "woe_id",
    "_content": "A Where on Earth identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (WOE ID <strong>23424977</strong>).<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "place_id",
    "_content": "A Flickr Places identifier to use to filter photo clusters. For example all the photos clustered by <strong>locality</strong> in the United States (Place ID <strong>4KO02SibApitvSBieQ</strong>).<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "threshold",
    "_content": "The minimum number of photos that a place type must have to be included. If the number of photos is lowered then the parent place type for that place will be used.<br /><br />\r\n\r\nFor example if you only have <strong>3</strong> photos taken in the locality of Montreal</strong> (WOE ID 3534) but your threshold is set to <strong>5</strong> then those photos will be \"rolled up\" and included instead with a place record for the region of Quebec (WOE ID 2344924)."
  },
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Places for user are not available at this time",
    "_content": "Places for user have been disabled or are otherwise not available."
  },
  {
    "code": "2",
    "message": "Required parameter missing",
    "_content": "One or more of the required parameters was not included with your request."
  },
  {
    "code": "3",
    "message": "Not a valid place type",
    "_content": "An invalid place type was included with your request."
  },
  {
    "code": "4",
    "message": "Not a valid Place ID",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
  },
  {
    "code": "5",
    "message": "Not a valid threshold",
    "_content": "The threshold passed was invalid. "
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.resolvePlaceId = (function(Utils) {
  var method_name = "flickr.places.resolvePlaceId";
  var required = [
  {
    "name": "place_id",
    "_content": "A Flickr Places ID"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "2",
    "message": "Place ID required.",
    "_content": ""
  },
  {
    "code": "3",
    "message": "Place not found.",
    "_content": ""
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.resolvePlaceURL = (function(Utils) {
  var method_name = "flickr.places.resolvePlaceURL";
  var required = [
  {
    "name": "url",
    "_content": "A Flickr Places URL.  \r\n<br /><br />\r\nFlickr Place URLs are of the form /country/region/city"
  }
];
  var optional = [];
  var errors = [
  {
    "code": "2",
    "message": "Place URL required.",
    "_content": ""
  },
  {
    "code": "3",
    "message": "Place not found.",
    "_content": ""
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.places.tagsForPlace = (function(Utils) {
  var method_name = "flickr.places.tagsForPlace";
  var required = [];
  var optional = [
  {
    "name": "woe_id",
    "_content": "A Where on Earth identifier to use to filter photo clusters.<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "place_id",
    "_content": "A Flickr Places identifier to use to filter photo clusters.<br /><br />\r\n<span style=\"font-style:italic;\">(While optional, you must pass either a valid Places ID or a WOE ID.)</span>"
  },
  {
    "name": "min_upload_date",
    "_content": "Minimum upload date. Photos with an upload date greater than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "max_upload_date",
    "_content": "Maximum upload date. Photos with an upload date less than or equal to this value will be returned. The date should be in the form of a unix timestamp."
  },
  {
    "name": "min_taken_date",
    "_content": "Minimum taken date. Photos with an taken date greater than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  },
  {
    "name": "max_taken_date",
    "_content": "Maximum taken date. Photos with an taken date less than or equal to this value will be returned. The date should be in the form of a mysql datetime."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One or more parameters was not included with the API request"
  },
  {
    "code": "2",
    "message": "Not a valid Places ID",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
  },
  {
    "code": "3",
    "message": "Place not found",
    "_content": "An invalid Places (or WOE) identifier was included with your request."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.prefs.getContentType = (function(Utils) {
  var method_name = "flickr.prefs.getContentType";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.prefs.getGeoPerms = (function(Utils) {
  var method_name = "flickr.prefs.getGeoPerms";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.prefs.getHidden = (function(Utils) {
  var method_name = "flickr.prefs.getHidden";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.prefs.getPrivacy = (function(Utils) {
  var method_name = "flickr.prefs.getPrivacy";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.prefs.getSafetyLevel = (function(Utils) {
  var method_name = "flickr.prefs.getSafetyLevel";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.push.getSubscriptions = (function(Utils) {
  var method_name = "flickr.push.getSubscriptions";
  var required = [];
  var optional = [];
  var errors = [
  {
    "code": "5",
    "message": "Service currently available only to pro accounts",
    "_content": "PuSH subscriptions are currently restricted to Pro account holders."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.push.getTopics = (function(Utils) {
  var method_name = "flickr.push.getTopics";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.push.subscribe = (function(Utils) {
  var method_name = "flickr.push.subscribe";
  var required = [
  {
    "name": "topic",
    "_content": "The type of subscription. See <a href=\"http://www.flickr.com/services/api/flickr.push.getTopics.htm\">flickr.push.getTopics</a>."
  },
  {
    "name": "callback",
    "_content": "The url for the subscription endpoint. Limited to 255 bytes, and must be unique for this user, i.e. no two subscriptions for a given user may use the same callback url."
  },
  {
    "name": "verify",
    "_content": "The verification mode, either <code>sync</code> or <code>async</code>. See the <a href=\"http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#subscribingl\">Google PubSubHubbub spec</a> for details."
  }
];
  var optional = [
  {
    "name": "verify_token",
    "_content": "The verification token to be echoed back to the subscriber during the verification callback, as per the <a href=\"http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#subscribing\">Google PubSubHubbub spec</a>. Limited to 200 bytes."
  },
  {
    "name": "lease_seconds",
    "_content": "Number of seconds for which the subscription will be valid. Legal values are 60 to 86400 (1 minute to 1 day). If not present, the subscription will be auto-renewing."
  },
  {
    "name": "woe_ids",
    "_content": "A 32-bit integer for a <a href=\"http://developer.yahoo.com/geo/geoplanet/\">Where on Earth ID</a>. Only valid if <code>topic</code> is <code>geo</code>.\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
  },
  {
    "name": "place_ids",
    "_content": "A comma-separated list of Flickr place IDs. Only valid if <code>topic</code> is <code>geo</code>.\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
  },
  {
    "name": "lat",
    "_content": "A latitude value, in decimal format. Only valid if <code>topic</code> is <code>geo</code>. Defines the latitude for a radial query centered around (lat, lon).\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
  },
  {
    "name": "lon",
    "_content": "A longitude value, in decimal format. Only valid if <code>topic</code> is <code>geo</code>. Defines the longitude for a radial query centered around (lat, lon).\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
  },
  {
    "name": "radius",
    "_content": "A radius value, in the units defined by radius_units. Only valid if <code>topic</code> is <code>geo</code>. Defines the radius of a circle for a radial query centered around (lat, lon). Default is 5 km.\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
  },
  {
    "name": "radius_units",
    "_content": "Defines the units for the radius parameter. Only valid if <code>topic</code> is <code>geo</code>. Options are <code>mi</code> and <code>km</code>. Default is <code>km</code>.\r\n<br/><br/>\r\nThe order of precedence for geo subscriptions is : woe ids, place ids, radial i.e. the <code>lat, lon</code> parameters will be ignored if <code>place_ids</code> is present, which will be ignored if <code>woe_ids</code> is present."
  },
  {
    "name": "accuracy",
    "_content": "Defines the minimum accuracy required for photos to be included in a subscription. Only valid if <code>topic</code> is <code>geo</code> Legal values are 1-16, default is 1 (i.e. any accuracy level).\r\n<ul>\r\n<li>World level is 1</li>\r\n<li>Country is ~3</li>\r\n<li>Region is ~6</li>\r\n<li>City is ~11</li>\r\n<li>Street is ~16</li>\r\n</ul>"
  },
  {
    "name": "nsids",
    "_content": "A comma-separated list of nsids representing Flickr Commons institutions (see <a href=\"http://www.flickr.com/services/api/flickr.commons.getInstitutions.html\">flickr.commons.getInstitutions</a>). Only valid if <code>topic</code> is <code>commons</code>. If not present this argument defaults to all Flickr Commons institutions."
  },
  {
    "name": "tags",
    "_content": "A comma-separated list of strings to be used for tag subscriptions. Photos with one or more of the tags listed will be included in the subscription. Only valid if the <code>topic</code> is <code>tags</code>."
  },
  {
    "name": "machine_tags",
    "_content": "A comma-separated list of strings to be used for machine tag subscriptions. Photos with one or more of the machine tags listed will be included in the subscription. Currently the format must be <code>namespace:tag_name=value</code> Only valid if the <code>topic</code> is <code>tags</code>."
  },
  {
    "name": "update_type",
    "_content": ""
  },
  {
    "name": "output_format",
    "_content": ""
  },
  {
    "name": "mailto",
    "_content": ""
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One of the required arguments for the method was not provided."
  },
  {
    "code": "2",
    "message": "Invalid parameter value",
    "_content": "One of the arguments was specified with an illegal value."
  },
  {
    "code": "3",
    "message": "Callback URL already in use for a different subscription",
    "_content": "A different subscription already exists that uses the same callback URL."
  },
  {
    "code": "4",
    "message": "Callback failed or invalid response",
    "_content": "The verification callback failed, or failed to return the expected response to confirm the subscription."
  },
  {
    "code": "5",
    "message": "Service currently available only to pro accounts",
    "_content": "PuSH subscriptions are currently restricted to Pro account holders."
  },
  {
    "code": "6",
    "message": "Subscription awaiting verification callback response - try again later",
    "_content": "A subscription with those details exists already, but it is in a pending (non-verified) state. Please wait a bit for the verification callback to complete before attempting to update the subscription."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.push.unsubscribe = (function(Utils) {
  var method_name = "flickr.push.unsubscribe";
  var required = [
  {
    "name": "topic",
    "_content": "The type of subscription. See <a href=\"http://www.flickr.com/services/api/flickr.push.getTopics.htm\">flickr.push.getTopics</a>."
  },
  {
    "name": "callback",
    "_content": "The url for the subscription endpoint (must be the same url as was used when creating the subscription)."
  },
  {
    "name": "verify",
    "_content": "The verification mode, either 'sync' or 'async'. See the <a href=\"http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#subscribingl\">Google PubSubHubbub spec</a> for details."
  }
];
  var optional = [
  {
    "name": "verify_token",
    "_content": "The verification token to be echoed back to the subscriber during the verification callback, as per the <a href=\"http://pubsubhubbub.googlecode.com/svn/trunk/pubsubhubbub-core-0.3.html#subscribing\">Google PubSubHubbub spec</a>. Limited to 200 bytes."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Required parameter missing",
    "_content": "One of the required arguments for the method was not provided."
  },
  {
    "code": "2",
    "message": "Invalid parameter value",
    "_content": "One of the arguments was specified with an illegal value."
  },
  {
    "code": "4",
    "message": "Callback failed or invalid response",
    "_content": "The verification callback failed, or failed to return the expected response to confirm the un-subscription."
  },
  {
    "code": "6",
    "message": "Subscription awaiting verification callback response - try again later",
    "_content": "A subscription with those details exists already, but it is in a pending (non-verified) state. Please wait a bit for the verification callback to complete before attempting to update the subscription."
  },
  {
    "code": "7",
    "message": "Subscription not found",
    "_content": "No subscription matching the provided details for this user could be found."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.reflection.getMethodInfo = (function(Utils) {
  var method_name = "flickr.reflection.getMethodInfo";
  var required = [
  {
    "name": "method_name",
    "_content": "The name of the method to fetch information for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Method not found",
    "_content": "The requested method was not found."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.reflection.getMethods = (function(Utils) {
  var method_name = "flickr.reflection.getMethods";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getCollectionDomains = (function(Utils) {
  var method_name = "flickr.stats.getCollectionDomains";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  }
];
  var optional = [
  {
    "name": "collection_id",
    "_content": "The id of the collection to get stats for. If not provided, stats for all collections will be returned."
  },
  {
    "name": "per_page",
    "_content": "Number of domains to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Collection not found",
    "_content": "The collection id was either invalid or was for a collection not owned by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getCollectionReferrers = (function(Utils) {
  var method_name = "flickr.stats.getCollectionReferrers";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format. \r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  },
  {
    "name": "domain",
    "_content": "The domain to return referrers for. This should be a hostname (eg: \"flickr.com\") with no protocol or pathname."
  }
];
  var optional = [
  {
    "name": "collection_id",
    "_content": "The id of the collection to get stats for. If not provided, stats for all collections will be returned."
  },
  {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Collection not found",
    "_content": "The collection id was either invalid or was for a collection not owned by the calling user."
  },
  {
    "code": "5",
    "message": "Invalid domain",
    "_content": "The domain provided is not in the expected format."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getCollectionStats = (function(Utils) {
  var method_name = "flickr.stats.getCollectionStats";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  },
  {
    "name": "collection_id",
    "_content": "The id of the collection to get stats for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Collection not found",
    "_content": "The collection id was either invalid or was for a collection not owned by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getCSVFiles = (function(Utils) {
  var method_name = "flickr.stats.getCSVFiles";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotoDomains = (function(Utils) {
  var method_name = "flickr.stats.getPhotoDomains";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  }
];
  var optional = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to get stats for. If not provided, stats for all photos will be returned."
  },
  {
    "name": "per_page",
    "_content": "Number of domains to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not owned by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotoReferrers = (function(Utils) {
  var method_name = "flickr.stats.getPhotoReferrers";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  },
  {
    "name": "domain",
    "_content": "The domain to return referrers for. This should be a hostname (eg: \"flickr.com\") with no protocol or pathname."
  }
];
  var optional = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to get stats for. If not provided, stats for all photos will be returned."
  },
  {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not owned by the calling user."
  },
  {
    "code": "5",
    "message": "Invalid domain",
    "_content": "The domain provided is not in the expected format."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotosetDomains = (function(Utils) {
  var method_name = "flickr.stats.getPhotosetDomains";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  }
];
  var optional = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to get stats for. If not provided, stats for all sets will be returned."
  },
  {
    "name": "per_page",
    "_content": "Number of domains to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Photoset not found",
    "_content": "The photoset id was either invalid or was for a set not owned by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotosetReferrers = (function(Utils) {
  var method_name = "flickr.stats.getPhotosetReferrers";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format. \r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  },
  {
    "name": "domain",
    "_content": "The domain to return referrers for. This should be a hostname (eg: \"flickr.com\") with no protocol or pathname."
  }
];
  var optional = [
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to get stats for. If not provided, stats for all sets will be returned."
  },
  {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Photoset not found",
    "_content": "The photoset id was either invalid or was for a set not owned by the calling user."
  },
  {
    "code": "5",
    "message": "Invalid domain",
    "_content": "The domain provided is not in the expected format."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotosetStats = (function(Utils) {
  var method_name = "flickr.stats.getPhotosetStats";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  },
  {
    "name": "photoset_id",
    "_content": "The id of the photoset to get stats for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Photoset not found",
    "_content": "The photoset id was either invalid or was for a set not owned by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotoStats = (function(Utils) {
  var method_name = "flickr.stats.getPhotoStats";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  },
  {
    "name": "photo_id",
    "_content": "The id of the photo to get stats for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "4",
    "message": "Photo not found",
    "_content": "The photo id was either invalid or was for a photo not owned by the calling user."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotostreamDomains = (function(Utils) {
  var method_name = "flickr.stats.getPhotostreamDomains";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  }
];
  var optional = [
  {
    "name": "per_page",
    "_content": "Number of domains to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100"
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotostreamReferrers = (function(Utils) {
  var method_name = "flickr.stats.getPhotostreamReferrers";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format. \r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  },
  {
    "name": "domain",
    "_content": "The domain to return referrers for. This should be a hostname (eg: \"flickr.com\") with no protocol or pathname."
  }
];
  var optional = [
  {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "5",
    "message": "Invalid domain",
    "_content": "The domain provided is not in the expected format."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPhotostreamStats = (function(Utils) {
  var method_name = "flickr.stats.getPhotostreamStats";
  var required = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getPopularPhotos = (function(Utils) {
  var method_name = "flickr.stats.getPopularPhotos";
  var required = [];
  var optional = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format. \r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day.\r\n\r\nIf no date is provided, all time view counts will be returned."
  },
  {
    "name": "sort",
    "_content": "The order in which to sort returned photos. Defaults to views. The possible values are views, comments and favorites. \r\n\r\nOther sort options are available through <a href=\"/services/api/flickr.photos.search.html\">flickr.photos.search</a>."
  },
  {
    "name": "per_page",
    "_content": "Number of referrers to return per page. If this argument is omitted, it defaults to 25. The maximum allowed value is 100."
  },
  {
    "name": "page",
    "_content": "The page of results to return. If this argument is omitted, it defaults to 1."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  },
  {
    "code": "5",
    "message": "Invalid sort",
    "_content": "The sort provided is not valid"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.stats.getTotalViews = (function(Utils) {
  var method_name = "flickr.stats.getTotalViews";
  var required = [];
  var optional = [
  {
    "name": "date",
    "_content": "Stats will be returned for this date. This should be in either be in YYYY-MM-DD or unix timestamp format.\r\n\r\nA day according to Flickr Stats starts at midnight GMT for all users, and timestamps will automatically be rounded down to the start of the day.\r\n\r\nIf no date is provided, all time view counts will be returned."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User does not have stats",
    "_content": "The user you have requested stats has not enabled stats on their account."
  },
  {
    "code": "2",
    "message": "No stats for that date",
    "_content": "No stats are available for the date requested. Flickr only keeps stats data for the last 28 days."
  },
  {
    "code": "3",
    "message": "Invalid date",
    "_content": "The date provided could not be parsed"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getClusterPhotos = (function(Utils) {
  var method_name = "flickr.tags.getClusterPhotos";
  var required = [
  {
    "name": "tag",
    "_content": "The tag that this cluster belongs to."
  },
  {
    "name": "cluster_id",
    "_content": "The top three tags for the cluster, separated by dashes (just like the url)."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getClusters = (function(Utils) {
  var method_name = "flickr.tags.getClusters";
  var required = [
  {
    "name": "tag",
    "_content": "The tag to fetch clusters for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Tag cluster not found",
    "_content": "The tag was invalid or no cluster exists for that tag."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getHotList = (function(Utils) {
  var method_name = "flickr.tags.getHotList";
  var required = [];
  var optional = [
  {
    "name": "period",
    "_content": "The period for which to fetch hot tags. Valid values are <code>day</code> and <code>week</code> (defaults to <code>day</code>)."
  },
  {
    "name": "count",
    "_content": "The number of tags to return. Defaults to 20. Maximum allowed value is 200."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "Invalid period",
    "_content": "The specified period was not understood."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getListPhoto = (function(Utils) {
  var method_name = "flickr.tags.getListPhoto";
  var required = [
  {
    "name": "photo_id",
    "_content": "The id of the photo to return tags for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Photo not found",
    "_content": "The photo id passed was not a valid photo id."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getListUser = (function(Utils) {
  var method_name = "flickr.tags.getListUser";
  var required = [];
  var optional = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the tag list for. If this argument is not specified, the currently logged in user (if any) is assumed."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID and the calling user was not logged in.\r\n"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getListUserPopular = (function(Utils) {
  var method_name = "flickr.tags.getListUserPopular";
  var required = [];
  var optional = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the tag list for. If this argument is not specified, the currently logged in user (if any) is assumed."
  },
  {
    "name": "count",
    "_content": "Number of popular tags to return. defaults to 10 when this argument is not present."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The user NSID passed was not a valid user NSID and the calling user was not logged in.\r\n"
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getListUserRaw = (function(Utils) {
  var method_name = "flickr.tags.getListUserRaw";
  var required = [];
  var optional = [
  {
    "name": "tag",
    "_content": "The tag you want to retrieve all raw versions for."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The calling user was not logged in."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getMostFrequentlyUsed = (function(Utils) {
  var method_name = "flickr.tags.getMostFrequentlyUsed";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.tags.getRelated = (function(Utils) {
  var method_name = "flickr.tags.getRelated";
  var required = [
  {
    "name": "tag",
    "_content": "The tag to fetch related tags for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Tag not found",
    "_content": "The tag argument was missing."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.test.echo = (function(Utils) {
  var method_name = "flickr.test.echo";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.test.login = (function(Utils) {
  var method_name = "flickr.test.login";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.test.null = (function(Utils) {
  var method_name = "flickr.test.null";
  var required = [];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.urls.getGroup = (function(Utils) {
  var method_name = "flickr.urls.getGroup";
  var required = [
  {
    "name": "group_id",
    "_content": "The NSID of the group to fetch the url for."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Group not found",
    "_content": "The NSID specified was not a valid group."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.urls.getUserPhotos = (function(Utils) {
  var method_name = "flickr.urls.getUserPhotos";
  var required = [];
  var optional = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the url for. If omitted, the calling user is assumed."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The NSID specified was not a valid user."
  },
  {
    "code": "2",
    "message": "No user specified",
    "_content": "No user_id was passed and the calling user was not logged in."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.urls.getUserProfile = (function(Utils) {
  var method_name = "flickr.urls.getUserProfile";
  var required = [];
  var optional = [
  {
    "name": "user_id",
    "_content": "The NSID of the user to fetch the url for. If omitted, the calling user is assumed."
  }
];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The NSID specified was not a valid user."
  },
  {
    "code": "2",
    "message": "No user specified",
    "_content": "No user_id was passed and the calling user was not logged in."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.urls.lookupGallery = (function(Utils) {
  var method_name = "flickr.urls.lookupGallery";
  var required = [
  {
    "name": "url",
    "_content": "The gallery's URL."
  }
];
  var optional = [];
  var errors = [];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.urls.lookupGroup = (function(Utils) {
  var method_name = "flickr.urls.lookupGroup";
  var required = [
  {
    "name": "url",
    "_content": "The url to the group's page or photo pool."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "Group not found",
    "_content": "The passed URL was not a valid group page or photo pool url."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

Flickr.prototype.urls.lookupUser = (function(Utils) {
  var method_name = "flickr.urls.lookupUser";
  var required = [
  {
    "name": "url",
    "_content": "The url to the user's profile or photos page."
  }
];
  var optional = [];
  var errors = [
  {
    "code": "1",
    "message": "User not found",
    "_content": "The passed URL was not a valid user profile or photos url."
  }
];
  var fn = function (callOptions, callback) {
            if(callOptions && !callback) { callback = callOptions; callOptions = {}; }
            Utils.checkRequirements(method_name, required, callOptions, callback);
            var queryArguments = Utils.generateQueryArguments(method_name, this.flickrOptions, callOptions);
            Utils.queryFlickr(queryArguments, this.flickrOptions, callback, errors);
          }
  fn.data = { required: required, optional: optional, errors: errors, name: method_name };
  return fn;
}(Utils));

 Flickr.methodNames = [
    "flickr.activity.userComments",
    "flickr.activity.userPhotos",
    "flickr.auth.checkToken",
    "flickr.auth.getFrob",
    "flickr.auth.getFullToken",
    "flickr.auth.getToken",
    "flickr.auth.oauth.checkToken",
    "flickr.auth.oauth.getAccessToken",
    "flickr.blogs.getList",
    "flickr.blogs.getServices",
    "flickr.blogs.postPhoto",
    "flickr.cameras.getBrandModels",
    "flickr.cameras.getBrands",
    "flickr.collections.getInfo",
    "flickr.collections.getTree",
    "flickr.commons.getInstitutions",
    "flickr.contacts.getList",
    "flickr.contacts.getListRecentlyUploaded",
    "flickr.contacts.getPublicList",
    "flickr.contacts.getTaggingSuggestions",
    "flickr.favorites.add",
    "flickr.favorites.getContext",
    "flickr.favorites.getList",
    "flickr.favorites.getPublicList",
    "flickr.favorites.remove",
    "flickr.galleries.addPhoto",
    "flickr.galleries.create",
    "flickr.galleries.editMeta",
    "flickr.galleries.editPhoto",
    "flickr.galleries.editPhotos",
    "flickr.galleries.getInfo",
    "flickr.galleries.getList",
    "flickr.galleries.getListForPhoto",
    "flickr.galleries.getPhotos",
    "flickr.groups.browse",
    "flickr.groups.discuss.replies.add",
    "flickr.groups.discuss.replies.delete",
    "flickr.groups.discuss.replies.edit",
    "flickr.groups.discuss.replies.getInfo",
    "flickr.groups.discuss.replies.getList",
    "flickr.groups.discuss.topics.add",
    "flickr.groups.discuss.topics.getInfo",
    "flickr.groups.discuss.topics.getList",
    "flickr.groups.getInfo",
    "flickr.groups.join",
    "flickr.groups.joinRequest",
    "flickr.groups.leave",
    "flickr.groups.members.getList",
    "flickr.groups.pools.add",
    "flickr.groups.pools.getContext",
    "flickr.groups.pools.getGroups",
    "flickr.groups.pools.getPhotos",
    "flickr.groups.pools.remove",
    "flickr.groups.search",
    "flickr.interestingness.getList",
    "flickr.machinetags.getNamespaces",
    "flickr.machinetags.getPairs",
    "flickr.machinetags.getPredicates",
    "flickr.machinetags.getRecentValues",
    "flickr.machinetags.getValues",
    "flickr.panda.getList",
    "flickr.panda.getPhotos",
    "flickr.people.findByEmail",
    "flickr.people.findByUsername",
    "flickr.people.getGroups",
    "flickr.people.getInfo",
    "flickr.people.getLimits",
    "flickr.people.getPhotos",
    "flickr.people.getPhotosOf",
    "flickr.people.getPublicGroups",
    "flickr.people.getPublicPhotos",
    "flickr.people.getUploadStatus",
    "flickr.photos.addTags",
    "flickr.photos.comments.addComment",
    "flickr.photos.comments.deleteComment",
    "flickr.photos.comments.editComment",
    "flickr.photos.comments.getList",
    "flickr.photos.comments.getRecentForContacts",
    "flickr.photos.delete",
    "flickr.photos.geo.batchCorrectLocation",
    "flickr.photos.geo.correctLocation",
    "flickr.photos.geo.getLocation",
    "flickr.photos.geo.getPerms",
    "flickr.photos.geo.photosForLocation",
    "flickr.photos.geo.removeLocation",
    "flickr.photos.geo.setContext",
    "flickr.photos.geo.setLocation",
    "flickr.photos.geo.setPerms",
    "flickr.photos.getAllContexts",
    "flickr.photos.getContactsPhotos",
    "flickr.photos.getContactsPublicPhotos",
    "flickr.photos.getContext",
    "flickr.photos.getCounts",
    "flickr.photos.getExif",
    "flickr.photos.getFavorites",
    "flickr.photos.getInfo",
    "flickr.photos.getNotInSet",
    "flickr.photos.getPerms",
    "flickr.photos.getRecent",
    "flickr.photos.getSizes",
    "flickr.photos.getUntagged",
    "flickr.photos.getWithGeoData",
    "flickr.photos.getWithoutGeoData",
    "flickr.photos.licenses.getInfo",
    "flickr.photos.licenses.setLicense",
    "flickr.photos.notes.add",
    "flickr.photos.notes.delete",
    "flickr.photos.notes.edit",
    "flickr.photos.people.add",
    "flickr.photos.people.delete",
    "flickr.photos.people.deleteCoords",
    "flickr.photos.people.editCoords",
    "flickr.photos.people.getList",
    "flickr.photos.recentlyUpdated",
    "flickr.photos.removeTag",
    "flickr.photos.search",
    "flickr.photos.setContentType",
    "flickr.photos.setDates",
    "flickr.photos.setMeta",
    "flickr.photos.setPerms",
    "flickr.photos.setSafetyLevel",
    "flickr.photos.setTags",
    "flickr.photos.suggestions.approveSuggestion",
    "flickr.photos.suggestions.getList",
    "flickr.photos.suggestions.rejectSuggestion",
    "flickr.photos.suggestions.removeSuggestion",
    "flickr.photos.suggestions.suggestLocation",
    "flickr.photos.transform.rotate",
    "flickr.photos.upload.checkTickets",
    "flickr.photosets.addPhoto",
    "flickr.photosets.comments.addComment",
    "flickr.photosets.comments.deleteComment",
    "flickr.photosets.comments.editComment",
    "flickr.photosets.comments.getList",
    "flickr.photosets.create",
    "flickr.photosets.delete",
    "flickr.photosets.editMeta",
    "flickr.photosets.editPhotos",
    "flickr.photosets.getContext",
    "flickr.photosets.getInfo",
    "flickr.photosets.getList",
    "flickr.photosets.getPhotos",
    "flickr.photosets.orderSets",
    "flickr.photosets.removePhoto",
    "flickr.photosets.removePhotos",
    "flickr.photosets.reorderPhotos",
    "flickr.photosets.setPrimaryPhoto",
    "flickr.places.find",
    "flickr.places.findByLatLon",
    "flickr.places.getChildrenWithPhotosPublic",
    "flickr.places.getInfo",
    "flickr.places.getInfoByUrl",
    "flickr.places.getPlaceTypes",
    "flickr.places.getShapeHistory",
    "flickr.places.getTopPlacesList",
    "flickr.places.placesForBoundingBox",
    "flickr.places.placesForContacts",
    "flickr.places.placesForTags",
    "flickr.places.placesForUser",
    "flickr.places.resolvePlaceId",
    "flickr.places.resolvePlaceURL",
    "flickr.places.tagsForPlace",
    "flickr.prefs.getContentType",
    "flickr.prefs.getGeoPerms",
    "flickr.prefs.getHidden",
    "flickr.prefs.getPrivacy",
    "flickr.prefs.getSafetyLevel",
    "flickr.push.getSubscriptions",
    "flickr.push.getTopics",
    "flickr.push.subscribe",
    "flickr.push.unsubscribe",
    "flickr.reflection.getMethodInfo",
    "flickr.reflection.getMethods",
    "flickr.stats.getCollectionDomains",
    "flickr.stats.getCollectionReferrers",
    "flickr.stats.getCollectionStats",
    "flickr.stats.getCSVFiles",
    "flickr.stats.getPhotoDomains",
    "flickr.stats.getPhotoReferrers",
    "flickr.stats.getPhotosetDomains",
    "flickr.stats.getPhotosetReferrers",
    "flickr.stats.getPhotosetStats",
    "flickr.stats.getPhotoStats",
    "flickr.stats.getPhotostreamDomains",
    "flickr.stats.getPhotostreamReferrers",
    "flickr.stats.getPhotostreamStats",
    "flickr.stats.getPopularPhotos",
    "flickr.stats.getTotalViews",
    "flickr.tags.getClusterPhotos",
    "flickr.tags.getClusters",
    "flickr.tags.getHotList",
    "flickr.tags.getListPhoto",
    "flickr.tags.getListUser",
    "flickr.tags.getListUserPopular",
    "flickr.tags.getListUserRaw",
    "flickr.tags.getMostFrequentlyUsed",
    "flickr.tags.getRelated",
    "flickr.test.echo",
    "flickr.test.login",
    "flickr.test.null",
    "flickr.urls.getGroup",
    "flickr.urls.getUserPhotos",
    "flickr.urls.getUserProfile",
    "flickr.urls.lookupGallery",
    "flickr.urls.lookupGroup",
    "flickr.urls.lookupUser"
];
 window.Flickr = Flickr;
}());