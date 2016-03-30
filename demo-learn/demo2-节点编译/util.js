var util = {
	/**
	 * 转化数组
	 * @param  {[type]} list  [description]
	 * @param  {[type]} start [description]
	 * @return {[type]}       [description]
	 */
    toArray: function(list, start) {
        start = start || 0;
        var i = list.length - start;
        var ret = new Array(i);
        while (i--) {
            ret[i] = list[i + start];
        }
        return ret;
    }

}
