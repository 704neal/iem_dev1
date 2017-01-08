var Particle = require('particle-api-js');
var particle = new Particle();


var librato = require('librato-node');

librato.configure({email: process.env.LIBRATO_EMAIL, token: process.env.LIBRATO_TOKEN, period: 5000});
librato.start();

// console.log('librato?', librato);

librato.on('error', function(err) {
  console.error('librato error!: ', err);
});

let particleToken;
let devicesPr;

//
// var testObj = {};
//
// testObj = {
//   "apiDate": new Date(),
//   "apiResult" : {
//     "firstName": 'Neal',
//     "lastName": 'Pettijohn',
//     "age": 10,
//     data: {
//       xValue: 5,
//       temp: "test error"
//     }
//   }
//
// };
//
// // console.log("what's my api data?", testObj);
// var goodData = testObj.apiResult.data;
// if (goodData) {
//   var temp = goodData.temp;
//   var xVal = goodData.xValue;
//   if (temp >= 0) {
//     // console.log('valid temp:', temp);
//   } else if (temp < 0) {
//     // console.log('erro, too low temp:', temp)
//   } else {
//     // console.log('supper bad error, invalid data', temp);
//   }
//   // console.log('xVal?', xVal);
// }
//
//
// // console.log('goodData after all that nonsense', goodData);
//
//
// goodData.isProcessed = true;
// // console.log('goodData afte updating isProcessed', goodData);
//
//
// //going to send to librato
//
// if (goodData.isProcessed === true) {
//   //send to librato
// }



//variable apple   or word without quotes
//string "apple" or 'apple'
//object {}
//array []
//number 1234
//'apple' "apple"
// 11234
// {}
// []
//boolean true false
//falsy values  0 null undefined false  {} ""
// = assignment     var color = "blue"
// equality comparison > < <=  === strict equal , == loose equal 0 || "0"
// || or   , and &&
// console.log('librato token:', process.env.LIBRATO_TOKEN);
particle.login({username: process.env.PARTICLE_USER, password: process.env.PARTICLE_PASS})
  .then(
    function(data){
      console.log('data.body??????', data.body);
      // console.log('API call completed on promise resolve: ', data.body.access_token);
      particleToken = data.body.access_token;
      particle.listDevices({ auth: particleToken }).then(
        function(devices){
          // console.log('devices:\n', devices);
          var myDevice = devices.body[0];
          var myDeviceId = myDevice.id;

          console.log('mydevice id is ', myDeviceId);
          // Get all events
          if (!myDeviceId) {
            console.log('err - invalid device id');
            return;
          }
          // particle.getEventStream({deviceId: myDeviceId, auth: particleToken}).then(function(stream) {
          particle.getEventStream({auth: particleToken}).then(function(stream) {
            stream.on('event', function(streamData) {
              console.log('event all data', streamData);
              if (streamData.name === 'temperature') {
                var tempVal = Number(streamData.data);
                if (tempVal && tempVal > 60 && tempVal < 75) {
                  librato.measure('test_temperature_val3', tempVal, {source: myDeviceId});
                }
              }
              if (streamData.name === 'XValue') {
                var XValue = streamData.data;
                console.log('XValue:', XValue);
                // if (tempVal && tempVal > 60 && tempVal < 75) {
                //   console.log('converted temp val:', {data: tempVal});
                //   console.log('original temp val:', streamData);
                //   librato.measure('test_temperature_val3', tempVal);
                // }
              }
            });
          });
        }
      );
    },
    function(err) {
      console.log('API call completed on promise fail: ', err);
    }
  );


module.exports = {
  particle: particle,
  devices: devicesPr,
  token: particleToken
};
