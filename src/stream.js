define(['helpers', 'poller'], function(helpers, Poller) {
  var _enc = encodeURIComponent;

  function Stream() {
    var args = arguments.length === 1 ? arguments[0].split('/') : arguments;
    
    this.account = args[0];
    this.stream_name = args[1];
    
    this._enumerators = [];
  }
  Stream.prototype.stream_url = function() {
    return helpers.api_url('/'+ _enc(this.account) +'/'+ _enc(this.stream_name) +'.json');
  };
  Stream.prototype.meta_url = function() {
    return helpers.api_url('/'+ _enc(this.account) +'/'+ _enc(this.stream_name) +'/meta.json');
  };
  Stream.prototype.load = function(opts, fn, error) {
    opts = helpers.extend(opts || {}, {
      // put defaults
    });
    
    var params = [];
    if(opts.limit) {
      params.push(['limit', opts.limit]);
    }
    if(opts.since_id) {
      params.push(['since_id', opts.since_id]);
    }
    if(opts.replies) {
      params.push(['replies', opts.replies]);
    }
    if(opts.geo_hint) {
      params.push(['geo_hint', '1']);
    }

    helpers.jsonp_factory(this.stream_url(), params, '_', this, fn || this._enumerators, error);

    return this;
  };
  Stream.prototype.each = function(fn) {
    this._enumerators.push(fn);
    return this;
  };
  Stream.prototype.poller = function(opts) {
    return new Poller(this, opts);
  };
  Stream.prototype.meta = function() {
    var opts, fn, error;
    if(typeof(arguments[0]) === 'function') {
      fn = arguments[0];
      error = arguments[1];
      opts = {};
    }
    else if(typeof(arguments[0]) === 'object') {
      opts = arguments[0];
      fn = arguments[1];
      error = arguments[2];
    }
    else {
      throw new Error('incorrect arguments');
    }
    
    var params = [];
    if(opts.disregard) {
      params.push(['disregard', opts.disregard]);
    }

    helpers.jsonp_factory(this.meta_url(), params, 'meta_', this, fn, error);
    
    return this;
  };

  return Stream;

});