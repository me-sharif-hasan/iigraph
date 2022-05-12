/**
 * expected argument lengths
 * @type {Object}
 */

 var length = {a: 7, c: 6, h: 1, l: 2, m: 2, q: 4, s: 4, t: 2, v: 1, z: 0}

 /**
  * segment pattern
  * @type {RegExp}
  */
 
 var segment = /([astvzqmhlc])([^astvzqmhlc]*)/ig
 
 /**
  * parse an svg path data string. Generates an Array
  * of commands where each command is an Array of the
  * form `[command, arg1, arg2, ...]`
  *
  * @param {String} path
  * @return {Array}
  */
 
 function parse(path) {
     var data = []
     path.replace(segment, function(_, command, args){
         var type = command.toLowerCase()
         args = parseValues(args)
 
         // overloaded moveTo
         if (type == 'm' && args.length > 2) {
             data.push([command].concat(args.splice(0, 2)))
             type = 'l'
             command = command == 'm' ? 'l' : 'L'
         }
 
         while (true) {
             if (args.length == length[type]) {
                 args.unshift(command)
                 return data.push(args)
             }
             if (args.length < length[type]) throw new Error('malformed path data')
             data.push([command].concat(args.splice(0, length[type])))
         }
     })
     return data
 }
 
 var number = /-?[0-9]*\.?[0-9]+(?:e[-+]?\d+)?/ig
 
 function parseValues(args) {
     var numbers = args.match(number)
     return numbers ? numbers.map(Number) : []
 }

 function serialize(path){
    return path.reduce(function(str, seg){
        return str + seg[0] + seg.slice(1).join(',')
    }, '')
}




function scale(path, sx, sy) {
    segments=parse(path);
    sy = (!sy && (sy !== 0)) ? sx : sy
  
    return serialize(segments.map(function(segment) {
      var name  = segment[0].toLowerCase()
  
      // V & v are the only command, with shifted coords parity
      if (name === 'v') {
        segment[1] *= sy
        return segment
      }
  
      // ARC is: ['A', rx, ry, x-axis-rotation, large-arc-flag, sweep-flag, x, y]
      // touch rx, ry, x, y only
      if (name === 'a') {
        segment[1] *= sx
        segment[2] *= sy
        segment[6] *= sx
        segment[7] *= sy
        return segment
      }
  
      // All other commands have [cmd, x1, y1, x2, y2, x3, y3, ...] format
      return segment.map(function(val, i) {
        if (!i) {
          return val
        }
        return val *= i % 2 ? sx : sy
      })
    }))
  }