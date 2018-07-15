import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import 'rxjs/add/operator/filter';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import turf from 'turf'; 


@Injectable()
export class LocationTracker {
 
  public watch: any;   
  public lat: number = 0;
  public lng: number = 0;
  public paJobb : boolean = false;
  public lastTimestamp : any;
 
  constructor(public zone: NgZone, public backgroundGeolocation: BackgroundGeolocation, private geolocation : Geolocation) {
 
  }
 
  startTracking() {
    // Background Tracking
  let config = {
    desiredAccuracy: 0,
    stationaryRadius: 20,
    distanceFilter: 10,
    debug: false,
    interval: 2000
  };
 
  this.backgroundGeolocation.configure(config).subscribe((location) => {
 
    console.log('BackgroundGeolocation:  ' + location.latitude + ',' + location.longitude);
 
    // Run update inside of Angular's zone
    this.zone.run(() => {
      this.lat = location.latitude;
      this.lng = location.longitude;
      this.insidePolygonCheck(this.lat, this.lng);
    });
 
  }, (err) => {
 
    console.log(err);
 
  });
 
  // Turn ON the background-geolocation system.
  this.backgroundGeolocation.start();
  
  // Foreground Tracking
let options = {
  frequency: 3000,
  enableHighAccuracy: true
};
 
this.watch = this.geolocation.watchPosition(options).filter((p: any) => p.code === undefined).subscribe((position: Geoposition) => {
 
  console.log(position);
 
  // Run update inside of Angular's zone
  this.zone.run(() => {
    this.lat = position.coords.latitude;
    this.lng = position.coords.longitude;
    this.insidePolygonCheck(this.lat, this.lng);
    this.lastTimestamp = position.timestamp;
  });
 
});
  }
 
  stopTracking() {
    console.log('stopTracking');
 
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
 
  }
  
  insidePolygonCheck(lat : number, lng : number) {
    var pt = turf.point([lat, lng]);
    var poly = turf.polygon([[
       [58.76682,5.854009],
       [58.771804,5.857099],
        [58.771448,5.86963
],
        [58.76188,5.869459],
      [58.76682,5.854009]
      ]]);
      console.log("ER VI PÅ JOBB?????")
      console.log(booleanPointInPolygon(pt,poly));
      this.paJobb = booleanPointInPolygon(pt,poly);
  }


}