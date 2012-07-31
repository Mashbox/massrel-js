define(['helpers', 'compare_poller'], function(helpers, ComparePoller) {
  function Compare(streams) {
    if(helpers.is_array(streams)) {
      // keep a copy of the array
      this.streams = streams.slice(0);
    }
    else if(typeof(streams) === 'string') {
      this.streams = [streams];
    }
    else {
      this.streams = [];
    }
  }
  
  Compare.prototype.compare_url = function() {
    return helpers.api_url('/compare.json');
  };
  
  Compare.prototype.buildParams = function(opts) {
    var params = [];
    
    opts = opts || {};

    if (opts.streams) {
      params.push(['streams', opts.streams]);
    }
    
    return params;
  };
  
  Compare.prototype.load = function(fn, error) {
    var params = this.buildParams(this);
    
    helpers.jsonp_factory(this.compare_url(), params, 'meta_', this, fn, error);
    
    return this;
  };
  
  Compare.prototype.poller = function(opts) {
    return new ComparePoller(this, opts);
  };
  
  return Compare;
});
