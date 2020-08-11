import { Component, Input, OnInit } from '@angular/core';
import { NouisliderModule } from 'ng2-nouislider';
import { FlightModel } from './../interface/flight-model';
import { FlightService } from './../service/flight.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit {
  // Necessary variable declarations which will be used in html
  flight: FlightModel;
  flightInput: FlightModel[] = [];
  someRange: Array<any> = [];
  displayRetField: boolean = false;
  removed: FlightModel[] = [];
  minDate = new Date();
  maxDate = new Date(2020, 0, 1);

  flightArr: Array<FlightModel[]> = [];

  // Using constructor, call the FlightService.
  constructor(private _flightService: FlightService) { }
  ngOnInit() {
    // Initializing values in flight model
    this.someRange = [1000, 5000];
    // this.minDate.setDate(this.minDate.getDate() - 1);
    this.flight = {
      id: null,
      FlightCode: "",
      SeatsAvailable: null,
      OriginDestination: { Origin: "", Destination: "", DeptDate: null, ArrDate: null },
      FareDetails: null
    };
  }

  // This function is called from html which in turn calls the functions in our Flight service.
  searchFlights(vals) {
    if (this.displayRetField === true) {
      // Assign input values from user.
      this.flightInput = [
        // When the trip type is two-way
        {
          id: null,
          FlightCode: "",
          SeatsAvailable: vals.passCount,
          OriginDestination: { Origin: vals.originCity, Destination: vals.destCity, DeptDate: vals.deprtDt, ArrDate: null },
          FareDetails: null
        },
        {
          id: null,
          FlightCode: "",
          SeatsAvailable: vals.passCount,
          OriginDestination: { Origin: vals.destCity, Destination: vals.originCity, DeptDate: vals.retDt, ArrDate: null },
          FareDetails: null
        },
      ]
    } else {
      this.flightInput = [
        // When trip type is one way
        {
          id: null,
          FlightCode: "",
          SeatsAvailable: vals.passCount,
          OriginDestination: { Origin: vals.originCity, Destination: vals.destCity, DeptDate: vals.deprtDt, ArrDate: null },
          FareDetails: null
        }
      ]
    }
    // Service function called to add person details to array
    this.flightArr = this._flightService.getFlightDetails(this.flightInput, this.someRange[0], this.someRange[1]);

  }

  retDt = new FormControl('', [Validators.required]);

  getErrorMessage() {
    return this.retDt.hasError('required') ? 'You must enter a value' :
      this.retDt.hasError('retDt') ? 'Not a valid email' :
        '';
  }

  noResults() {
    // Conditions to check whether or not to display results
    if ((this.flightArr.length == 0) || (this.displayRetField === false && this.flightArr[0].length == 0) || (this.displayRetField === true && this.flightArr[1].length == 0)) {
      return true;
    }
  }

  // Price range slider function
  onChange($event) {
    this.flightArr = this._flightService.getFlightDetails(this.flightInput, this.someRange[0], this.someRange[1]);
  }

}
