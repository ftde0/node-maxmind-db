'use strict';

var IPv6 = {
    "Address": function(ip) {
        if(typeof(ip) !== "string") {
            return {"valid": false, "isValid": function(){return false;}}
        }
        if(ip.indexOf("::") !== -1) {
            var beforeElided = ip.split("::")[0].split(":")
            var afterElided = ip.split("::")[1].split(":")
            var neededGroups = 8 - (beforeElided.length + afterElided.length)
            if(neededGroups < 0) {
                return {"valid": false, "isValid": function(){return false;}}
            }
            var elids = []
            for (var i = 0; i < neededGroups; i++) {
                elids.push("0")
            }
            beforeElided = beforeElided.concat(elids)
            return {
                "valid": true,
                "isValid": function() {return true;},
                "groups": 8,
                "v4": false,
                "parsedAddress": beforeElided.concat(afterElided)
            }
        } else if(ip.split(":").length == 8) {
            return {
                "valid": true,
                "isValid": function() {return true;},
                "groups": 8,
                "v4": false,
                "parsedAddress": ip.split(":")
            }
        } else {
            return {"valid": false, "isValid": function(){return false;}}
        }
    }
}
var IPv4 = {
    "Address": function(ip) {
        if(typeof(ip) !== "string") {
            return {"valid": false, "isValid": function(){return false;}}
        }
        var subnet = 32
        if(ip.indexOf("/") !== -1) {
            subnet = parseInt(ip.split("/")[1])
            if(isNaN(subnet)) {subnet = 32;}
        }
        var s = ip.split(".")
        if(s.length == 4) {
            s = s.map(function(z) {
                return parseInt(z.split("/")[0]).toString()
            })
            return {
                "valid": true,
                "isValid": function() {return true;},
                "groups": 4,
                "v4": true,
                "addressMinusSuffix": ip.split("/")[0],
                "parsedAddress": s
            }
        }
        return {"valid": false, "isValid": function(){return false;}}
    }
}

exports.parseIPv4 = function parseIPv4(ip) {
    var v4Address = new IPv4.Address(ip);
    if (!v4Address.isValid()) {
        throw new Error("Invalid IPv4 address");
    }
    return v4Address.parsedAddress;
};

exports.parseIPv6 = function parseIPv6(ip) {
    var v6Address = new IPv6.Address(ip);
    if (!v6Address.isValid()) {
        throw new Error("Invalid IPv6 address");
    }
    return v6Address.parsedAddress;
};
