//    Copyright © 2000 Peter Mierau pmierau@posteo.net
//    This work is free.You can redistribute it and / or modify it under the
//    terms of the Do What The Fuck You Want To Public License, Version 2,
//    as published by Sam Hocevar.

//            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
// Version 2, December 2004

// Copyright(C) 2004 Sam Hocevar <sam@hocevar.net>

//     Everyone is permitted to copy and distribute verbatim or modified
// copies of this license document, and changing it is allowed as long
// as the name is changed.

// DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
// TERMS AND CONDITIONS FOR COPYING, DISTRIBUTION AND MODIFICATION

// 0. You just DO WHAT THE FUCK YOU WANT TO.

class URLManager { 

    setLocation(tab) {
        let urlSearchParamsBuilder = new URLSearchParams();
        urlSearchParamsBuilder.set('location', tab);
        let encodedLocation = '?' + urlSearchParamsBuilder.toString();
        window.history.replaceState('', '', encodedLocation);
    }

    getLocation() { 
        let urlSearchParamsReader = new URLSearchParams(window.location.search);
        return urlSearchParamsReader.get('location');
    }
}

module.exports = {
    URLManager
}